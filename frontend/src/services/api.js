import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://detect-reference-backend.vercel.app'

const api = axios.create({
  baseURL: API_URL + '/api',
  timeout: 60000,
})

export const verifyReferences = async (references) => {
  try {
    const response = await api.post('/verify-references', {
      references
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || '验证失败，请稍后重试')
  }
}

export const verifyReferencesStream = (references, onResult, onProgress, onComplete, onError) => {
  const controller = new AbortController()
  
  // 设置总体超时（5分钟）
  const timeout = setTimeout(() => {
    controller.abort()
    if (onError) {
      onError(new Error('Verification timeout - please try with fewer references'))
    }
  }, 300000) // 5 minutes
  
  // 设置心跳检测
  let lastActivity = Date.now()
  const heartbeat = setInterval(() => {
    if (Date.now() - lastActivity > 60000) { // 1分钟无响应
      controller.abort()
      clearInterval(heartbeat)
      clearTimeout(timeout)
      if (onError) {
        onError(new Error('Connection timeout - please refresh and try again'))
      }
    }
  }, 10000) // 每10秒检查一次
  
  fetch(`${API_URL}/api/verify-references-stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ references }),
    signal: controller.signal
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Stream request failed')
    }
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    
    function read() {
      reader.read().then(({ done, value }) => {
        if (done) {
          return
        }
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data.trim()) {
              lastActivity = Date.now() // 更新活动时间
              try {
                const event = JSON.parse(data)
                
                if (event.type === 'result') {
                  onResult(event.data)
                  if (event.progress && onProgress) {
                    onProgress(event.progress)
                  }
                } else if (event.type === 'complete' && onComplete) {
                  clearInterval(heartbeat)
                  clearTimeout(timeout)
                  onComplete()
                  return
                }
              } catch (e) {
                console.error('Failed to parse SSE data:', e)
              }
            }
          }
        }
        
        read()
      }).catch(error => {
        clearInterval(heartbeat)
        clearTimeout(timeout)
        if (error.name !== 'AbortError' && onError) {
          onError(error)
        }
      })
    }
    
    read()
  })
  .catch(error => {
    clearInterval(heartbeat)
    clearTimeout(timeout)
    if (error.name !== 'AbortError' && onError) {
      onError(error)
    }
  })
  
  return controller
}

export default api