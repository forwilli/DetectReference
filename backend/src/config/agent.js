import { HttpsProxyAgent } from 'https-proxy-agent'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Check if proxy is enabled
const useProxy = process.env.USE_PROXY === 'true'
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