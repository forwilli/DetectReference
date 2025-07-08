import { HttpsProxyAgent } from 'https-proxy-agent'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Force disable proxy in production/Vercel
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL
const useProxy = false // 强制禁用代理，确保生产环境不使用代理
const proxyUrl = process.env.PROXY_URL

let httpsAgent = null

if (useProxy && proxyUrl) {
  httpsAgent = new HttpsProxyAgent(proxyUrl)
  console.log(`✅ Proxy agent configured for: ${proxyUrl}`)
} else if (useProxy && !proxyUrl) {
  console.warn('⚠️ USE_PROXY is true but PROXY_URL not found in .env file.')
} else {
  console.log('ℹ️ Proxy disabled - direct connection will be used')
}

export { httpsAgent } 