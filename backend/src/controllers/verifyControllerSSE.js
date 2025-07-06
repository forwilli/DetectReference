import { analyzeReferencesBatch } from '../services/geminiServiceAxios.js'
import { searchReference } from '../services/googleSearchService.js'
import { verifyWithCrossRef, findPaperOnCrossRef } from '../services/crossrefService.js'

export const verifyReferencesSSEController = async (req, res, next) => {
  try {
    const { references } = req.body
    console.log('Received references for SSE:', references)
    
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')
    
    const totalReferences = references.length
    let processedCount = 0
    
    // 发送开始事件
    res.write(`data: ${JSON.stringify({ 
      type: 'start', 
      message: 'Starting batch analysis...',
      total: totalReferences 
    })}\n\n`)
    
    // 阶段一：批量解析
    console.log('Phase 1: Batch analysis with Gemini...')
    let analyzedReferences
    try {
      analyzedReferences = await analyzeReferencesBatch(references)
      console.log(`Successfully analyzed ${analyzedReferences.length} references`)
      
      // 发送批量分析完成事件
      res.write(`data: ${JSON.stringify({ 
        type: 'analysis_complete', 
        message: 'Batch analysis completed',
        count: analyzedReferences.length 
      })}\n\n`)
    } catch (error) {
      console.error('Batch analysis failed:', error)
      res.write(`data: ${JSON.stringify({ 
        type: 'error', 
        message: 'Batch analysis failed: ' + error.message 
      })}\n\n`)
      res.end()
      return
    }
    
    // 阶段二：分类与 CrossRef 验证
    console.log('Phase 2: Classification and CrossRef verification...')
    const pendingGoogleSearch = [] // 待后续Google搜索的文献
    
    for (let i = 0; i < analyzedReferences.length; i++) {
      const ref = analyzedReferences[i]
      ref.index = i // 保存原始索引
      
      // 判断是否应该使用 CrossRef
      const shouldUseCrossRef = (
        ref.doi || 
        ref.type === 'journal_article' || 
        ref.type === 'conference_paper'
      )
      
      if (shouldUseCrossRef) {
        let crossrefResult = null
        
        if (ref.doi) {
          // 路径 A：如果 Gemini 已经提取了 DOI，优先使用它
          console.log(`Attempting CrossRef verification with DOI: ${ref.doi}`)
          crossrefResult = await verifyWithCrossRef(ref.doi)
        }
        
        // 如果路径 A 没走通 (没有DOI或DOI无效)，则尝试路径 B
        if (!crossrefResult || crossrefResult.status !== 'verified') {
          // 路径 B：没有 DOI，但我们知道这是篇论文，用标题和作者去搜
          console.log(`Attempting CrossRef search by metadata for: ${ref.title}`)
          crossrefResult = await findPaperOnCrossRef(ref)
        }
        
        if (crossrefResult && crossrefResult.status === 'verified') {
          // 无论通过路径A还是B，只要成功了，就立即发送结果
          processedCount++
          
          const verificationResult = {
            index: i,
            reference: ref.originalReference || references[i],
            status: 'verified',
            message: `Verified - DOI: ${crossrefResult.doi}`,
            source: 'crossref',
            doi: crossrefResult.doi,
            details: {
              authors: crossrefResult.authors,
              title: crossrefResult.title,
              year: crossrefResult.year,
              journal: crossrefResult.journal,
              publisher: crossrefResult.publisher,
              citationCount: crossrefResult.citationCount
            }
          }
          
          // 如果是通过路径B找到的，添加匹配分数信息
          if (crossrefResult.matchScore) {
            verificationResult.message += ` (match score: ${(crossrefResult.matchScore * 100).toFixed(0)}%)`
          }
          
          res.write(`data: ${JSON.stringify({
            type: 'result',
            data: verificationResult,
            progress: {
              current: processedCount,
              total: totalReferences,
              percentage: Math.round((processedCount / totalReferences) * 100)
            }
          })}\n\n`)
        } else {
          // 如果两种 CrossRef 方法都失败了，再把它加入待 Google 搜索的列表
          console.log(`Both CrossRef methods failed for: ${ref.title}, adding to pending list`)
          pendingGoogleSearch.push(ref)
        }
      } else {
        // 不是学术文献类型，直接加入待Google搜索列表
        pendingGoogleSearch.push(ref)
      }
    }
    
    // 阶段三：Google 搜索验证（将在下一步实现）
    console.log(`Phase 3: Google search for ${pendingGoogleSearch.length} remaining references...`)
    
    // 阶段三：使用改进的Google搜索验证剩余文献
    for (const ref of pendingGoogleSearch) {
      try {
        const searchResult = await searchReference(ref)
        processedCount++
        
        // 根据置信度确定最终状态和消息
        let finalStatus = searchResult.status
        let finalMessage = searchResult.message
        
        // 对于模糊结果，提供更详细的信息
        if (searchResult.status === 'ambiguous') {
          finalMessage = `Ambiguous (confidence: ${(searchResult.confidence * 100).toFixed(0)}%)`
          if (searchResult.evidence && searchResult.evidence.length > 0) {
            const topEvidence = searchResult.evidence[0]
            finalMessage += ` - Best match: ${topEvidence.matches.join(', ')}`
          }
        } else if (searchResult.status === 'verified') {
          finalMessage = `Verified (confidence: ${(searchResult.confidence * 100).toFixed(0)}%)`
        }
        
        const verificationResult = {
          index: ref.index,
          reference: ref.originalReference || references[ref.index],
          status: finalStatus,
          message: finalMessage,
          source: 'google',
          confidence: searchResult.confidence,
          doi: searchResult.doi || ref.doi || null
        }
        
        // 如果有证据，添加最佳匹配的URL（但不显示给用户）
        if (searchResult.evidence && searchResult.evidence.length > 0) {
          verificationResult.bestMatch = {
            score: searchResult.evidence[0].score,
            matches: searchResult.evidence[0].matches
          }
        }
        
        res.write(`data: ${JSON.stringify({
          type: 'result',
          data: verificationResult,
          progress: {
            current: processedCount,
            total: totalReferences,
            percentage: Math.round((processedCount / totalReferences) * 100)
          }
        })}\n\n`)
        
      } catch (error) {
        console.error(`Error processing reference:`, error.message)
        processedCount++
        
        res.write(`data: ${JSON.stringify({
          type: 'result',
          data: {
            index: ref.index,
            reference: ref.originalReference || references[ref.index],
            status: 'error',
            message: error.message
          },
          progress: {
            current: processedCount,
            total: totalReferences,
            percentage: Math.round((processedCount / totalReferences) * 100)
          }
        })}\n\n`)
      }
    }
    
    res.write(`data: ${JSON.stringify({ type: 'complete' })}\n\n`)
    res.end()
    
  } catch (error) {
    next(error)
  }
}