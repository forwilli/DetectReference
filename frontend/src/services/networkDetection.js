// 网络连通性检测和API端点选择
const API_ENDPOINTS = {
  primary: 'https://detect-reference-backend.vercel.app',
  backup: 'https://detect-reference-backend-hk.vercel.app', // 将来部署到香港
  local: 'http://localhost:3001' // 开发环境
}

let currentEndpoint = API_ENDPOINTS.primary
let lastCheckTime = 0
const CHECK_INTERVAL = 5 * 60 * 1000 // 5分钟重新检测一次

/**
 * 检测API端点的连通性
 * @param {string} endpoint - API端点URL
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise<boolean>} - 是否可连通
 */
async function testEndpoint(endpoint, timeout = 5000) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(`${endpoint}/api/test`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    console.log(`Endpoint ${endpoint} is not accessible:`, error.message)
    return false
  }
}

/**
 * 获取最佳可用的API端点
 * @param {boolean} forceCheck - 是否强制重新检测
 * @returns {Promise<string>} - 最佳API端点URL
 */
export async function getBestEndpoint(forceCheck = false) {
  const now = Date.now()
  
  // 如果最近检测过且不强制检测，返回当前端点
  if (!forceCheck && now - lastCheckTime < CHECK_INTERVAL) {
    return currentEndpoint
  }
  
  console.log('🌐 Detecting best API endpoint...')
  
  // 检测环境
  if (process.env.NODE_ENV === 'development') {
    const isLocalAvailable = await testEndpoint(API_ENDPOINTS.local, 2000)
    if (isLocalAvailable) {
      currentEndpoint = API_ENDPOINTS.local
      lastCheckTime = now
      console.log('✅ Using local development endpoint')
      return currentEndpoint
    }
  }
  
  // 并行检测主要和备用端点
  const [primaryWorks, backupWorks] = await Promise.all([
    testEndpoint(API_ENDPOINTS.primary, 8000),
    testEndpoint(API_ENDPOINTS.backup, 8000)
  ])
  
  if (primaryWorks) {
    currentEndpoint = API_ENDPOINTS.primary
    console.log('✅ Using primary endpoint (US)')
  } else if (backupWorks) {
    currentEndpoint = API_ENDPOINTS.backup
    console.log('✅ Using backup endpoint (HK)')
  } else {
    console.warn('⚠️ No endpoints available, using primary as fallback')
    currentEndpoint = API_ENDPOINTS.primary
  }
  
  lastCheckTime = now
  return currentEndpoint
}

/**
 * 获取当前使用的端点信息
 * @returns {object} - 端点信息
 */
export function getCurrentEndpointInfo() {
  const region = currentEndpoint === API_ENDPOINTS.primary ? 'US' :
                currentEndpoint === API_ENDPOINTS.backup ? 'HK' :
                currentEndpoint === API_ENDPOINTS.local ? 'Local' : 'Unknown'
  
  return {
    url: currentEndpoint,
    region,
    lastCheck: lastCheckTime
  }
}

/**
 * 检测网络状态并返回建议
 * @returns {Promise<object>} - 网络状态信息
 */
export async function getNetworkStatus() {
  const endpoint = await getBestEndpoint(true)
  const info = getCurrentEndpointInfo()
  
  const isOptimal = endpoint === API_ENDPOINTS.primary
  const needsVPN = endpoint === API_ENDPOINTS.primary && 
    !(await testEndpoint(API_ENDPOINTS.primary, 3000))
  
  return {
    ...info,
    isOptimal,
    needsVPN,
    suggestion: needsVPN ? 
      '建议使用VPN以获得最佳性能' : 
      isOptimal ? '网络连接良好' : '使用备用线路连接'
  }
}