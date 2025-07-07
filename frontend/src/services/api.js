import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

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
  
  fetch('/api/verify-references-stream', {
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
              try {
                const event = JSON.parse(data)
                
                if (event.type === 'result') {
                  onResult(event.data)
                  if (event.progress && onProgress) {
                    onProgress(event.progress)
                  }
                } else if (event.type === 'complete' && onComplete) {
                  onComplete()
                }
              } catch (e) {
                console.error('Failed to parse SSE data:', e)
              }
            }
          }
        }
        
        read()
      }).catch(error => {
        if (error.name !== 'AbortError' && onError) {
          onError(error)
        }
      })
    }
    
    read()
  })
  .catch(error => {
    if (error.name !== 'AbortError' && onError) {
      onError(error)
    }
  })
  
  return controller
}

export default api