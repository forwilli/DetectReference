import { analyzeReferencesBatch } from '../services/geminiServiceAxios.js'
import { searchReference } from '../services/googleSearchService.js'
import { verifyWithCrossRef, findPaperOnCrossRef } from '../services/crossrefService.js'
import { getCachedResult, setCachedResult, getCacheStats } from '../services/cacheService.js'
import { mapToCSL, formatCitation, SUPPORTED_FORMATS } from '../services/formattingService.js'

/**
 * Generate citations in all supported formats
 * @param {Object} cslData - CSL-JSON formatted data
 * @returns {Object} Object with format names as keys and formatted citations as values
 */
function generateAllFormats(cslData) {
  const formatted = {}
  
  Object.keys(SUPPORTED_FORMATS).forEach(formatName => {
    try {
      formatted[formatName.toLowerCase()] = formatCitation(cslData, formatName)
    } catch (error) {
      console.error(`Error formatting ${formatName}:`, error)
      // If a specific format fails, just skip it
    }
  })
  
  return formatted
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
    
    // Check cache first and separate cached vs uncached references
    const cachedResults = []
    const uncachedReferences = []
    const uncachedIndices = []
    
    for (let i = 0; i < references.length; i++) {
      const cachedResult = getCachedResult(references[i])
      if (cachedResult) {
        cachedResults.push({ index: i, result: cachedResult })
      } else {
        uncachedReferences.push(references[i])
        uncachedIndices.push(i)
      }
    }
    
    // 发送开始事件，包含缓存信息
    res.write(`data: ${JSON.stringify({ 
      type: 'start', 
      message: `Starting verification... (${cachedResults.length} from cache, ${uncachedReferences.length} to process)`,
      total: totalReferences,
      cached: cachedResults.length,
      uncached: uncachedReferences.length
    })}\n\n`)
    
    // 立即发送所有缓存的结果
    for (const { index, result } of cachedResults) {
      processedCount++
      const verificationResult = {
        index,
        reference: result.reference,
        ...result.verificationResult,
        fromCache: true
      }
      
      // Add formatting for all supported styles if the reference was successfully verified
      if (verificationResult.status === 'verified' && result.geminiAnalysis) {
        try {
          const cslData = mapToCSL({
            ...result.geminiAnalysis,
            doi: verificationResult.doi,
            url: verificationResult.url,
            source: verificationResult.source
          })
          verificationResult.formatted = generateAllFormats(cslData)
          // Keep backward compatibility
          verificationResult.formattedAPA = verificationResult.formatted.apa
        } catch (error) {
          console.error('Error formatting cached result:', error)
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
    }
    
    // 如果所有结果都来自缓存，直接结束
    if (uncachedReferences.length === 0) {
      const stats = getCacheStats()
      res.write(`data: ${JSON.stringify({ 
        type: 'complete', 
        message: 'All results from cache!',
        cacheStats: stats
      })}\n\n`)
      res.end()
      return
    }
    
    // 阶段一：批量解析（仅处理未缓存的）
    console.log(`Phase 1: Batch analysis with Gemini for ${uncachedReferences.length} uncached references...`)
    let analyzedReferences
    try {
      analyzedReferences = await analyzeReferencesBatch(uncachedReferences)
      console.log(`Successfully analyzed ${analyzedReferences.length} references`)
      
      // 恢复原始索引
      for (let i = 0; i < analyzedReferences.length; i++) {
        analyzedReferences[i].originalIndex = uncachedIndices[i]
        analyzedReferences[i].originalReference = uncachedReferences[i]
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
          
          // Add formatting for all supported styles for verified CrossRef results
          try {
            const cslData = mapToCSL({
              ...ref,
              ...crossrefResult,
              source: 'crossref'
            })
            verificationResult.formatted = generateAllFormats(cslData)
            // Keep backward compatibility
            verificationResult.formattedAPA = verificationResult.formatted.apa
          } catch (error) {
            console.error('Error formatting CrossRef result:', error)
          }
          
          // Store in cache
          setCachedResult(ref.originalReference, ref, verificationResult)
          
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
          index: ref.originalIndex,
          reference: ref.originalReference,
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
        
        // Add formatting for all supported styles for verified Google results
        if (finalStatus === 'verified') {
          try {
            const cslData = mapToCSL({
              ...ref,
              doi: searchResult.doi || ref.doi,
              source: 'google'
            })
            verificationResult.formatted = generateAllFormats(cslData)
            // Keep backward compatibility
            verificationResult.formattedAPA = verificationResult.formatted.apa
          } catch (error) {
            console.error('Error formatting Google result:', error)
          }
        }
        
        // Store in cache
        setCachedResult(ref.originalReference, ref, verificationResult)
        
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
    
    // Send completion event with cache statistics
    const stats = getCacheStats()
    res.write(`data: ${JSON.stringify({ 
      type: 'complete',
      message: 'Verification completed',
      cacheStats: stats
    })}\n\n`)
    res.end()
    
  } catch (error) {
    next(error)
  }
}