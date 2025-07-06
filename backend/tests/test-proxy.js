import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import dotenv from 'dotenv'

dotenv.config()

const httpsAgent = new HttpsProxyAgent('http://127.0.0.1:7890')

async function testProxy() {
  console.log('Testing proxy connection...')
  
  try {
    // 测试访问 Google
    const response = await axios.get('https://www.google.com', {
      httpsAgent: httpsAgent,
      timeout: 10000
    })
    console.log('✅ Proxy is working! Status:', response.status)
    
    // 测试 Gemini API
    console.log('\nTesting Gemini API with proxy...')
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    const geminiResponse = await axios.get(geminiUrl, {
      httpsAgent: httpsAgent
    })
    console.log('✅ Gemini API accessible! Models:', geminiResponse.data.models?.length || 0)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.code === 'ECONNREFUSED') {
      console.error('请确保您的代理服务器（Clash）正在运行在 127.0.0.1:7890')
    }
  }
}

testProxy()