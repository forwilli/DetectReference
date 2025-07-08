import {
  analyzeReference
} from '../services/geminiServiceAxios.js'
import {
  searchReference
} from '../services/googleSearchService.js'

export const verifyReferencesController = async (req, res, next) => {
  try {
    const {
      references
    } = req.body
    console.log('Received references:', references)
    const results = []

    for (const reference of references) {
      try {
        const analysis = await analyzeReference(reference)
        
        let finalResult = {
          reference: reference,
          status: 'verified',
          analysis: analysis,
        };

        if (analysis.hasPotentialIssues) {
          console.log(`Potential issues found for "${reference}". Performing Google Search.`);
          const searchResults = await searchReference(analysis.standardizedReference || reference);
          finalResult.searchResults = searchResults;

          if (searchResults.items && searchResults.items.length > 0) {
            console.log(`Found ${searchResults.items.length} search results.`);
          } else {
            console.log(`No search results found.`);
            finalResult.status = 'issue_not_found';
          }
        }
        
        // 如果有DOI信息，添加到结果中
        if (analysis.doi) {
          finalResult.doi = analysis.doi
        }
        
        results.push(finalResult);

      } catch (error) {
        console.error(`Error processing reference "${reference}":`, error.message)
        results.push({
          reference: reference,
          status: 'error',
          message: `Failed to analyze references: ${error.message}`
        });
      }
    }

    res.json(results)
  } catch (error) {
    next(error)
  }
}