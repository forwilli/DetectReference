import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 显式指定.env文件路径
const envPath = path.join(__dirname, '.env')
console.log('Loading .env from:', envPath)

const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error('Error loading .env:', result.error)
} else {
  console.log('.env loaded successfully')
}

console.log('Environment variables:')
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY)
console.log('GOOGLE_SEARCH_API_KEY:', process.env.GOOGLE_SEARCH_API_KEY)
console.log('GOOGLE_CSE_ID:', process.env.GOOGLE_CSE_ID)