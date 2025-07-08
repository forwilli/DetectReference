import { analyzeReferencesBatch } from '../services/geminiServiceAxios.js'
import { searchReference } from '../services/googleSearchService.js'
import { verifyWithCrossRef, findPaperOnCrossRef } from '../services/crossrefService.js'

// Helper function to convert numeric score to confidence level
function getConfidenceLevel(score) {
  if (score >= 0.8) return 'HIGH'
  if (score >= 0.5) return 'MEDIUM'
  return 'LOW'
}

// Parallel processing with controlled concurrency
async function processInBatches(items, batchSize, processor) {
  const results = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchPromises = batch.map((item, localIndex) => processor(item, i + localIndex))
    const batchResults = await Promise.allSettled(batchPromises)
    results.push(...batchResults)
    
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  return results
}

export const verifyReferencesSSEController = async (req, res, next) => {
  try {
    const { references } = req.body
    
    if (!references || !Array.isArray(references)) {
      throw new Error('Invalid references data')
    }
    
    console.log('Received references for parallel SSE processing:', references.length)
    console.log('First reference sample:', references[0]?.substring(0, 100) + '...')
    
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')
    
    const totalReferences = references.length
    let processedCount = 0
    
    // Helper function to send results
    const sendResult = (verificationResult) => {
      processedCount++
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
    
    // Send start event
    res.write(`data: ${JSON.stringify({ 
      type: 'start', 
      message: `Starting parallel verification of ${totalReferences} references...`,
      total: totalReferences
    })}\n\n`)
    
    // Phase 1: Batch analysis with Gemini
    console.log(`Phase 1: Batch analysis for ${references.length} references...`)
    let analyzedReferences
    try {
      analyzedReferences = await analyzeReferencesBatch(references)
      console.log(`Successfully analyzed ${analyzedReferences.length} references`)
      
      // Set original index and reference
      for (let i = 0; i < analyzedReferences.length; i++) {
        analyzedReferences[i].originalIndex = i
        analyzedReferences[i].originalReference = references[i]
      }
      
      res.write(`data: ${JSON.stringify({ 
        type: 'analysis_complete', 
        message: 'Batch analysis completed',
        count: analyzedReferences.length 
      })}\n\n`)
      
    } catch (error) {
      console.error('Error in batch analysis:', error)
      // Send error for all references
      references.forEach((ref, index) => {
        sendResult({
          index: index,
          reference: ref,
          status: 'error',
          message: 'Failed to analyze reference structure',
          source: 'gemini_error',
          confidenceLevel: 'LOW'
        })
      })
      
      res.write(`data: ${JSON.stringify({ type: 'complete' })}\\n\\n`)
      res.end()
      return
    }
    
    // Phase 2: Parallel CrossRef verification
    console.log(`Phase 2: Parallel CrossRef verification for ${analyzedReferences.length} references...`)
    
    const crossrefProcessor = async (ref, index) => {
      try {
        let crossrefResult = null
        
        // Try DOI first if available
        if (ref.doi) {
          console.log(`Attempting CrossRef verification with DOI for: ${ref.title}`)
          crossrefResult = await verifyWithCrossRef(ref.doi)
        }
        
        // If no DOI or DOI verification failed, try metadata search
        if (!crossrefResult || crossrefResult.status !== 'verified') {
          console.log(`Attempting CrossRef search by metadata for: ${ref.title}`)
          crossrefResult = await findPaperOnCrossRef(ref)
        }
        
        if (crossrefResult && crossrefResult.status === 'verified') {
          const confidenceLevel = crossrefResult.matchScore ? 
            getConfidenceLevel(crossrefResult.matchScore) : 'HIGH'
          
          return {
            index: ref.originalIndex,
            reference: ref.originalReference,
            status: 'verified',
            message: `Verified - DOI: ${crossrefResult.doi}${confidenceLevel !== 'HIGH' ? ` (confidence: ${confidenceLevel})` : ''}`.replace(/"/g, '\"'),
            source: 'crossref',
            doi: crossrefResult.doi,
            confidenceLevel: confidenceLevel,
            details: {
              authors: crossrefResult.authors,
              title: crossrefResult.title,
              year: crossrefResult.year,
              journal: crossrefResult.journal,
              publisher: crossrefResult.publisher,
              citationCount: crossrefResult.citationCount
            }
          }
        }
        
        return null // Will need Google search
        
      } catch (error) {
        console.error(`CrossRef error for reference ${index}:`, error.message)
        return null // Will need Google search
      }
    }
    
    // Process CrossRef in batches of 10 (higher concurrency for CrossRef as it's more reliable)
    const crossrefResults = await processInBatches(
      analyzedReferences, 
      10, 
      crossrefProcessor
    )
    
    // Send CrossRef results and collect pending references
    const pendingGoogleSearch = []
    crossrefResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        sendResult(result.value)
      } else {
        pendingGoogleSearch.push(analyzedReferences[index])
      }
    })
    
    console.log(`CrossRef phase completed. ${processedCount} verified, ${pendingGoogleSearch.length} pending Google search`)
    
    // Phase 3: Parallel Google Search for remaining references
    if (pendingGoogleSearch.length > 0) {
      console.log(`Phase 3: Parallel Google search for ${pendingGoogleSearch.length} remaining references...`)
      
      const googleSearchProcessor = async (ref, globalIndex) => {
        try {
          console.log(`[${globalIndex + 1}] Processing Google search for: ${ref.title}`)
          const searchStartTime = Date.now()
          const searchResult = await searchReference(ref)
          const searchEndTime = Date.now()
          console.log(`Google search completed in ${searchEndTime - searchStartTime}ms`)
          
          const confidenceLevel = getConfidenceLevel(searchResult.confidence)
          let finalMessage = searchResult.message || `${searchResult.status} (confidence: ${confidenceLevel})`
          
          const verificationResult = {
            index: ref.originalIndex,
            reference: ref.originalReference,
            status: searchResult.status,
            message: finalMessage,
            source: 'google_search',
            confidenceLevel: confidenceLevel
          }
          
          // Add DOI if found
          if (searchResult.doi) {
            verificationResult.doi = searchResult.doi
            verificationResult.message = `Verified - DOI: ${searchResult.doi} (confidence: ${confidenceLevel})`
          }
          
          return verificationResult
          
        } catch (error) {
          console.error(`Google search error:`, error.message)
          return {
            index: ref.originalIndex,
            reference: ref.originalReference,
            status: 'error',
            message: `Error during Google search: ${error.message}`,
            source: 'google_search_error',
            confidenceLevel: 'LOW'
          }
        }
      }
      
      // Process Google Search in smaller batches of 5 to avoid rate limiting
      const googleResults = await processInBatches(
        pendingGoogleSearch,
        5,
        googleSearchProcessor
      )
      
      // Send Google search results
      googleResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          sendResult(result.value)
        } else {
          console.error('Google search batch error:', result.reason)
          // We'll handle this as a failed result, but we need the ref data
          // This is a fallback - in practice, our processor should handle errors
        }
      })
    }
    
    console.log(`All ${totalReferences} references processed. Sending completion event.`)
    
    // Send completion event
    res.write(`data: ${JSON.stringify({ 
      type: 'complete',
      message: `Verification completed for ${totalReferences} references`,
      processed: processedCount,
      total: totalReferences
    })}\n\n`)
    
    res.end()
    
  } catch (error) {
    console.error('SSE Controller error:', error)
    res.write(`data: ${JSON.stringify({ 
      type: 'error', 
      message: error.message 
    })}\n\n`)
    res.end()
    next(error)
  }
}