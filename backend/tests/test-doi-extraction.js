import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env') })

import { analyzeReference } from '../src/services/geminiServiceAxios.js'
import { searchReference } from '../src/services/googleSearchService.js'

async function testDoiExtraction() {
  // 测试一个通常有DOI的文献
  const references = [
    'Teece, D. J., Pisano, G., & Shuen, A. (1997). Dynamic capabilities and strategic management. Strategic Management Journal, 18(7), 509–533.',
    'Hallinan, B., & Striphas, T. (2016). The Netflix Prize and the production of algorithmic culture. New Media & Society, 18(1), 117–137.'
  ]
  
  for (const reference of references) {
    console.log('\n=====================================')
    console.log('Testing reference:', reference)
    
    try {
      const analysis = await analyzeReference(reference)
      console.log('Gemini analysis:', JSON.stringify(analysis, null, 2))
      
      const searchResult = await searchReference(analysis)
      console.log('Search result:', JSON.stringify(searchResult, null, 2))
      
      if (searchResult.doi) {
        console.log('✅ DOI found:', searchResult.doi)
      } else {
        console.log('❌ No DOI found in search results')
      }
    } catch (error) {
      console.error('Error:', error.message)
    }
    
    // 等待一下避免API限制
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

testDoiExtraction().catch(console.error)