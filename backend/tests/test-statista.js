import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env') })

import { analyzeReference } from '../src/services/geminiServiceAxios.js'
import { searchReference } from '../src/services/googleSearchService.js'

async function testStatista() {
  const reference = 'Statista. (2024, January 25). Netflix paid subscribers count by region 2024. Statista. https://www.statista.com/statistics/1090122/netflix-global-subscribers-by-region/'
  
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

testStatista().catch(console.error)