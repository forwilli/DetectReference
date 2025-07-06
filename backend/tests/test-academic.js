import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env') })

import { analyzeReference } from '../src/services/geminiServiceAxios.js'
import { searchReference } from '../src/services/googleSearchService.js'

async function testAcademic() {
  // 测试一个没有DOI的学术文献
  const reference = 'Barney, J. (1991). Firm resources and sustained competitive advantage. Journal of Management, 17(1), 99–120.'
  
  console.log('Testing reference:', reference)
  
  try {
    // Step 1: Analyze with Gemini
    console.log('\n1. Analyzing with Gemini...')
    const analysis = await analyzeReference(reference)
    console.log('Analysis result:', JSON.stringify(analysis, null, 2))
    
    // Step 2: Search with Google
    console.log('\n2. Searching with Google...')
    const searchResult = await searchReference(analysis)
    console.log('Search result:', JSON.stringify(searchResult, null, 2))
    
  } catch (error) {
    console.error('Error:', error.message)
    console.error(error.stack)
  }
}

testAcademic().catch(console.error)