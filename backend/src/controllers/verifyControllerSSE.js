import { analyzeReferencesBatch } from '../services/geminiServiceAxios.js'
import { searchReference } from '../services/googleSearchService.js'
import { verifyWithCrossRef, findPaperOnCrossRef } from '../services/crossrefService.js'

// Helper function to convert numeric score to confidence level
function getConfidenceLevel(score) {
  if (score >= 0.8) return 'HIGH'
  if (score >= 0.5) return 'MEDIUM'
  return 'LOW'
}

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
      message: `Starting verification...`,
      total: totalReferences
    })}\n\n`)
    
    // 阶段一：批量解析
    console.log(`Phase 1: Batch analysis with Gemini for ${references.length} references...`)
    let analyzedReferences
    try {
      analyzedReferences = await analyzeReferencesBatch(references)
      console.log(`Successfully analyzed ${analyzedReferences.length} references`)
      
      // 设置原始索引
      for (let i = 0; i < analyzedReferences.length; i++) {
        analyzedReferences[i].originalIndex = i
        analyzedReferences[i].originalReference = references[i]
      }
      
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
      
      console.log('DEBUG: Reference analysis:', { 
        title: ref.title, 
        type: ref.type, 
        doi: ref.doi, 
        shouldUseCrossRef 
      })
      
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
            index: ref.originalIndex,
            reference: ref.originalReference,
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
          
          // Formatting removed - handled by separate format endpoint
          
          // Cache removed - no longer storing results
          
          // 如果是通过路径B找到的，添加置信度等级
          if (crossrefResult.matchScore) {
            verificationResult.confidenceLevel = getConfidenceLevel(crossrefResult.matchScore)
            verificationResult.message += ` (confidence: ${verificationResult.confidenceLevel})`
          } else {
            // DOI直接匹配，置信度为HIGH
            verificationResult.confidenceLevel = 'HIGH'
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
        
        console.log('DEBUG: Google search result:', { status: searchResult.status, confidence: searchResult.confidence })
        
        // 根据置信度确定最终状态和消息
        let finalStatus = searchResult.status
        let finalMessage = searchResult.message
        
        // 获取置信度等级
        const confidenceLevel = getConfidenceLevel(searchResult.confidence)
        
        // 对于模糊结果，提供更详细的信息
        if (searchResult.status === 'ambiguous') {
          finalMessage = `Ambiguous (confidence: ${confidenceLevel})`
          if (searchResult.evidence && searchResult.evidence.length > 0) {
            const topEvidence = searchResult.evidence[0]
            finalMessage += ` - Best match: ${topEvidence.matches.join(', ')}`
          }
        } else if (searchResult.status === 'verified') {
          finalMessage = `Verified (confidence: ${confidenceLevel})`
        }
        
        const verificationResult = {
          index: ref.originalIndex,
          reference: ref.originalReference,
          status: finalStatus,
          message: finalMessage,
          source: 'google',
          confidenceLevel: confidenceLevel,
          doi: searchResult.doi || ref.doi || null
        }
        
        console.log('DEBUG: Verification result status before formatting:', finalStatus)
        
        // 如果有证据，添加最佳匹配信息（但不包含分数）
        if (searchResult.evidence && searchResult.evidence.length > 0) {
          verificationResult.bestMatch = {
            matches: searchResult.evidence[0].matches
          }
        }
        
        // Formatting removed - handled by separate format endpoint
        
        // Cache removed - no longer storing results
        
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
            index: ref.originalIndex,
            reference: ref.originalReference,
            status: 'error',
            message: error.message,
            confidenceLevel: 'LOW'  // 错误状态默认为LOW
          },
          progress: {
            current: processedCount,
            total: totalReferences,
            percentage: Math.round((processedCount / totalReferences) * 100)
          }
        })}\n\n`)
      }
    }
    
    // Send completion event
    res.write(`data: ${JSON.stringify({ 
      type: 'complete',
      message: 'Verification completed'
    })}\n\n`)
    res.end()
    
  } catch (error) {
    next(error)
  }
}