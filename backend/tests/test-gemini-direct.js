import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import dotenv from 'dotenv'

dotenv.config()

const httpsAgent = new HttpsProxyAgent('http://127.0.0.1:7890')
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

async function testGeminiDirect() {
  try {
    // 首先列出可用的模型
    console.log('Fetching available models...')
    const modelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    const modelsResponse = await axios.get(modelsUrl, { httpsAgent })
    
    console.log('Available models:')
    modelsResponse.data.models.forEach(model => {
      if (model.name.includes('gemini')) {
        console.log(`- ${model.name} (${model.displayName})`)
      }
    })
    
    // 测试不同的模型
    const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro']
    
    for (const modelName of models) {
      console.log(`\nTesting model: ${modelName}`)
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`
        const response = await axios.post(url, {
          contents: [{
            parts: [{
              text: 'Say hello'
            }]
          }]
        }, { httpsAgent })
        
        console.log(`✅ ${modelName} works!`)
        break
      } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.response?.status, error.response?.data?.error?.message)
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testGeminiDirect()