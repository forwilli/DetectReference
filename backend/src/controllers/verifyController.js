import { analyzeReference } from '../services/geminiServiceAxios.js'
import { searchReference } from '../services/googleSearchService.js'

export const verifyReferencesController = async (req, res, next) => {
  try {
    const { references } = req.body
    console.log('Received references:', references)
    const results = []

    for (let i = 0; i < references.length; i++) {
      const reference = references[i]
      
      try {
        const analysis = await analyzeReference(reference)
        
        const searchResult = await searchReference(analysis)
        
        const verificationResult = {
          reference: reference,
          status: searchResult.status,
          message: searchResult.message || null
        }
        
        // 如果有DOI信息，添加到结果中
        if (searchResult.doi || analysis.doi) {
          verificationResult.doi = searchResult.doi || analysis.doi
        }
        
        results.push(verificationResult)
      } catch (error) {
        console.error(`Error processing reference "${reference}":`, error.message)
        results.push({
          reference: reference,
          status: 'error',
          message: error.message
        })
      }
    }

    res.json(results)
  } catch (error) {
    next(error)
  }
}