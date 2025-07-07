import { analyzeReferencesBatch } from '../services/geminiServiceAxios.js'
import { mapToCSL, formatCitation } from '../services/formattingService.js'

export const formatCitationsController = async (req, res, next) => {
  try {
    const { references, format = 'apa' } = req.body
    console.log('Received format request:', { count: references.length, format })
    
    if (!references || !Array.isArray(references) || references.length === 0) {
      return res.status(400).json({ 
        error: 'References array is required and must not be empty' 
      })
    }

    // Step 1: Analyze references with Gemini to extract structured data
    console.log('Analyzing references with Gemini...')
    const analyzedReferences = await analyzeReferencesBatch(references)
    console.log(`Successfully analyzed ${analyzedReferences.length} references`)

    // Step 2: Format each reference
    const formattedCitations = []
    const errors = []

    for (let i = 0; i < analyzedReferences.length; i++) {
      const ref = analyzedReferences[i]
      const originalRef = references[i]

      try {
        // Convert to CSL-JSON format
        const cslData = mapToCSL({
          ...ref,
          source: 'user_input'
        })

        // Format citation in requested style
        const formattedCitation = formatCitation(cslData, format)
        formattedCitations.push(formattedCitation)

        console.log(`Formatted reference ${i + 1}:`, formattedCitation.substring(0, 100) + '...')
      } catch (error) {
        console.error(`Error formatting reference ${i + 1}:`, error.message)
        // Fallback to original reference if formatting fails
        formattedCitations.push(originalRef)
        errors.push({
          index: i,
          original: originalRef,
          error: error.message
        })
      }
    }

    // Step 3: Return results
    const response = {
      success: true,
      format: format.toLowerCase(),
      count: formattedCitations.length,
      formatted: formattedCitations
    }

    // Include errors if any occurred
    if (errors.length > 0) {
      response.errors = errors
      response.note = `${errors.length} reference(s) could not be formatted and were returned as-is`
    }

    console.log(`Format operation completed: ${formattedCitations.length} citations formatted`)
    res.json(response)

  } catch (error) {
    console.error('Format controller error:', error)
    res.status(500).json({
      error: 'Failed to format citations',
      message: error.message
    })
  }
}