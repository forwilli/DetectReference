import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 确保从正确的路径加载.env文件
dotenv.config({ path: join(__dirname, '../.env') })

import { searchReference } from '../src/services/googleSearchService.js'

const testReferences = [
  {
    name: "Netflix 10-K Report",
    data: {
      title: "Form 10-K for the fiscal year ended December 31, 2024",
      authors: ["Netflix, Inc."],
      year: "2025",
      publisher: "U.S. Securities and Exchange Commission",
      url: "https://s22.q4cdn.com/959853165/files/doc_financials/2024/ar/Netflix-10-K-01272025.pdf"
    }
  },
  {
    name: "Ofcom Report",
    data: {
      title: "Media Nations Report 2023",
      authors: ["Ofcom"],
      year: "2023",
      url: "https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/multi-sector/media-nations/2023/media-nations-2023-uk"
    }
  },
  {
    name: "Statista Data",
    data: {
      title: "Netflix paid subscribers count by region 2024",
      authors: ["Statista"],
      year: "2024",
      publisher: "Statista",
      url: "https://www.statista.com/statistics/1090122/netflix-global-subscribers-by-region/"
    }
  },
  {
    name: "Academic Paper - Barney",
    data: {
      title: "Firm resources and sustained competitive advantage",
      authors: ["Barney, J."],
      year: "1991",
      journal: "Journal of Management",
      volume: "17",
      issue: "1",
      pages: "99-120"
    }
  }
]

async function testImprovedSearch() {
  console.log('Testing improved search logic...\n')
  
  for (const ref of testReferences) {
    console.log(`\nTesting: ${ref.name}`)
    console.log('Reference data:', JSON.stringify(ref.data, null, 2))
    
    try {
      const result = await searchReference(ref.data)
      console.log('Result:', JSON.stringify(result, null, 2))
    } catch (error) {
      console.error('Error:', error.message)
    }
    
    // 等待一秒避免API限制
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

testImprovedSearch().catch(console.error)