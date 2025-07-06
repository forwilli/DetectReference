import { HttpsProxyAgent } from 'https-proxy-agent'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const proxyUrl = process.env.PROXY_URL

let httpsAgent = null

if (proxyUrl) {
  httpsAgent = new HttpsProxyAgent(proxyUrl)
  console.log(`✅ Proxy agent configured for: ${proxyUrl}`)
} else {
  console.warn('⚠️ PROXY_URL not found in .env file. Outgoing requests may fail.')
}

export { httpsAgent } 