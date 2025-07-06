import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env') })

import { analyzeReferencesBatch } from '../src/services/geminiServiceAxios.js'

async function testBatchAnalysis() {
  const references = [
    'Barney, J. (1991). Firm resources and sustained competitive advantage. Journal of Management, 17(1), 99–120.',
    'Netflix, Inc. (2025). Form 10-K for the fiscal year ended December 31, 2024. U.S. Securities and Exchange Commission. https://s22.q4cdn.com/959853165/files/doc_financials/2024/ar/Netflix-10-K-01272025.pdf',
    'Statista. (2024, January 25). Netflix paid subscribers count by region 2024. Statista. https://www.statista.com/statistics/1090122/netflix-global-subscribers-by-region/',
    'Teece, D. J., Pisano, G., & Shuen, A. (1997). Dynamic capabilities and strategic management. Strategic Management Journal, 18(7), 509–533. https://doi.org/10.1002/(SICI)1097-0266(199708)18:7<509::AID-SMJ882>3.0.CO;2-Z'
  ]
  
  console.log('Testing batch analysis with', references.length, 'references\n')
  
  try {
    const results = await analyzeReferencesBatch(references)
    
    console.log('Analysis complete. Results:\n')
    
    results.forEach((result, index) => {
      console.log(`Reference ${index + 1}:`)
      console.log('Title:', result.title)
      console.log('Type:', result.type)
      console.log('Authors:', result.authors?.join(', '))
      console.log('Year:', result.year)
      console.log('DOI:', result.doi || 'N/A')
      console.log('---\n')
    })
    
    // 统计类型
    const typeCounts = results.reduce((acc, ref) => {
      acc[ref.type] = (acc[ref.type] || 0) + 1
      return acc
    }, {})
    
    console.log('Type distribution:')
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`${type}: ${count}`)
    })
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testBatchAnalysis().catch(console.error)