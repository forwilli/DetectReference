import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env') })

import { searchReference } from '../src/services/googleSearchService.js'
import { analyzeReference } from '../src/services/geminiServiceAxios.js'

async function testConfidenceSystem() {
  console.log('Testing new confidence-based verification system\n')
  
  const testCases = [
    {
      name: 'High confidence academic paper',
      reference: 'Barney, J. (1991). Firm resources and sustained competitive advantage. Journal of Management, 17(1), 99–120.'
    },
    {
      name: 'Ambiguous web reference',
      reference: 'Statista. (2024, January 25). Netflix paid subscribers count by region 2024. https://www.statista.com/statistics/1090122/netflix-global-subscribers-by-region/'
    },
    {
      name: 'Government report',
      reference: 'Ofcom. (2023). Media Nations Report 2023. https://www.ofcom.org.uk/'
    }
  ]
  
  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Testing: ${testCase.name}`)
    console.log(`Reference: ${testCase.reference}`)
    console.log('='.repeat(60))
    
    try {
      // First analyze with Gemini
      const analysis = await analyzeReference(testCase.reference)
      console.log('\nGemini Analysis:')
      console.log(`Type: ${analysis.type}`)
      console.log(`Title: ${analysis.title}`)
      console.log(`Authors: ${analysis.authors?.join(', ')}`)
      console.log(`Year: ${analysis.year}`)
      
      // Then search with new confidence system
      console.log('\nGoogle Search with Confidence System:')
      const searchResult = await searchReference(analysis)
      
      console.log(`\nStatus: ${searchResult.status}`)
      console.log(`Confidence: ${(searchResult.confidence * 100).toFixed(1)}%`)
      console.log(`Message: ${searchResult.message}`)
      
      if (searchResult.evidence && searchResult.evidence.length > 0) {
        console.log('\nTop Evidence:')
        searchResult.evidence.slice(0, 2).forEach((ev, idx) => {
          console.log(`${idx + 1}. Score: ${(ev.score * 100).toFixed(1)}%`)
          console.log(`   Matches: ${ev.matches.join(', ')}`)
          console.log(`   URL: ${ev.url}`)
        })
      }
      
      if (searchResult.doi) {
        console.log(`\nExtracted DOI: ${searchResult.doi}`)
      }
      
    } catch (error) {
      console.error('Error:', error.message)
    }
    
    // Wait to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

testConfidenceSystem().catch(console.error)