import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 显式加载.env文件
dotenv.config({ path: path.join(__dirname, '..', '.env') })

// 安全地记录配置状态（不暴露密钥）
console.log('Environment variables loaded')
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓ Configured' : '✗ Missing')
console.log('GOOGLE_SEARCH_API_KEY:', process.env.GOOGLE_SEARCH_API_KEY ? '✓ Configured' : '✗ Missing')
console.log('GOOGLE_CSE_ID:', process.env.GOOGLE_CSE_ID ? '✓ Configured' : '✗ Missing')

import express from 'express'
import cors from 'cors'
import verifyRouter from './routes/verify.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api', verifyRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})