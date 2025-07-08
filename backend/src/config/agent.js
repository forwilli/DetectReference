import { HttpsProxyAgent } from 'https-proxy-agent'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const proxyUrl = process.env.PROXY_URL
const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production'

let httpsAgent = null

// 只在非生产环境且有代理配置时使用代理
if (proxyUrl && !isProduction) {
  httpsAgent = new HttpsProxyAgent(proxyUrl)
  console.log(`✅ Proxy agent configured for: ${proxyUrl}`)
} else if (!isProduction && !proxyUrl) {
  console.warn('⚠️ PROXY_URL not found in .env file. Outgoing requests may fail.')
} else if (isProduction) {
  console.log('🚀 Running in production mode - proxy disabled')
}

export { httpsAgent } 