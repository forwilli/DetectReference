import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 显式加载.env文件
dotenv.config({ path: path.join(__dirname, '..', '.env') })

// 验证必需的环境变量
const requiredEnvVars = ['GEMINI_API_KEY', 'GOOGLE_SEARCH_API_KEY', 'GOOGLE_CSE_ID']
let missingVars = []

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missingVars.push(envVar)
  }
}

// 安全地记录配置状态（不暴露密钥）
console.log('Environment variables loaded')
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓ Configured' : '✗ Missing')
console.log('GOOGLE_SEARCH_API_KEY:', process.env.GOOGLE_SEARCH_API_KEY ? '✓ Configured' : '✗ Missing')
console.log('GOOGLE_CSE_ID:', process.env.GOOGLE_CSE_ID ? '✓ Configured' : '✗ Missing')

if (missingVars.length > 0) {
  console.error('\n❌ ERROR: Missing required environment variables:')
  missingVars.forEach(v => console.error(`   - ${v}`))
  console.error('\nPlease configure these variables in your .env file or environment.')
  console.error('See .env.example for reference.\n')
  // Don't exit in production, just warn
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    process.exit(1)
  }
}

import express from 'express'
import cors from 'cors'
import verifyRouter from './routes/verify.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Reference Verifier API',
    version: '1.0.0',
    endpoints: {
      test: '/api/test',
      verify: '/api/verify-references',
      verifyStream: '/api/verify-references-stream',
      format: '/api/format-citations'
    }
  })
})

// Health check route
app.get('/api/test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend API is running',
    timestamp: new Date().toISOString()
  })
})

app.use('/api', verifyRouter)

app.use(errorHandler)

export default app