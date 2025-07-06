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

async function testGoogleSearch() {
  const queries = [
    '"Netflix paid subscribers count by region 2024"',
    'Netflix subscribers statista 2024',
    'Netflix paid subscribers statista',
    'statista.com Netflix subscribers'
  ]

  for (const query of queries) {
    console.log(`\nTesting query: ${query}`)
    
    try {
      const url = 'https://www.googleapis.com/customsearch/v1'
      const params = {
        key: GOOGLE_SEARCH_API_KEY,
        cx: GOOGLE_CSE_ID,
        q: query,
        num: 5
      }

      console.log('API Key:', GOOGLE_SEARCH_API_KEY ? 'Present' : 'Missing')
      console.log('CSE ID:', GOOGLE_CSE_ID ? 'Present' : 'Missing')

      const response = await axios.get(url, { 
        params,
        httpsAgent: httpsAgent 
      })
      
      const results = response.data.items || []
      console.log(`Found ${results.length} results`)
      
      if (results.length > 0) {
        results.forEach((result, index) => {
          console.log(`\nResult ${index + 1}:`)
          console.log(`Title: ${result.title}`)
          console.log(`Link: ${result.link}`)
          console.log(`Snippet: ${result.snippet.substring(0, 100)}...`)
        })
      }
    } catch (error) {
      console.error('Error:', error.response?.status, error.response?.data?.error?.message || error.message)
    }
  }
}

testGoogleSearch().catch(console.error)