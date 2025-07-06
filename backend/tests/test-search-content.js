import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env') })

const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID
const httpsAgent = new HttpsProxyAgent('http://127.0.0.1:7890')

async function searchAndCheckDoi() {
  // 搜索一个应该有DOI的文献
  const query = '"Dynamic capabilities and strategic management" Teece Pisano Shuen 1997'
  
  try {
    const url = 'https://www.googleapis.com/customsearch/v1'
    const params = {
      key: GOOGLE_SEARCH_API_KEY,
      cx: GOOGLE_CSE_ID,
      q: query,
      num: 10
    }

    const response = await axios.get(url, { 
      params,
      httpsAgent: httpsAgent 
    })
    
    const results = response.data.items || []
    console.log(`Found ${results.length} results for query: ${query}\n`)
    
    results.forEach((result, index) => {
      const combinedText = `${result.title} ${result.snippet}`.toLowerCase()
      console.log(`\nResult ${index + 1}:`)
      console.log(`Title: ${result.title}`)
      console.log(`URL: ${result.link}`)
      console.log(`Snippet: ${result.snippet}`)
      
      // 检查是否有DOI
      const doiMatch = combinedText.match(/10\.\d{4,}(?:\.\d+)*\/[-._;()\/:a-zA-Z0-9]+/i)
      if (doiMatch) {
        console.log(`✅ DOI found: ${doiMatch[0]}`)
      } else {
        console.log('❌ No DOI in this result')
      }
    })
  } catch (error) {
    console.error('Error:', error.message)
  }
}

searchAndCheckDoi().catch(console.error)