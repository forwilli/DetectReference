// 直接测试前端API调用，模拟前端的行为

const API_URL = 'https://detect-reference-backend.vercel.app'

// 模拟前端的verifyReferencesStream函数
function verifyReferencesStream(references, onResult, onProgress, onComplete, onError) {
  const controller = new AbortController()
  
  console.log('🚀 Starting stream verification...')
  console.log('📝 References:', references.length)
  console.log('🔗 API URL:', `${API_URL}/api/verify-references-stream`)
  
  fetch(`${API_URL}/api/verify-references-stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ references }),
    signal: controller.signal
  })
  .then(response => {
    console.log('📡 Response received:', response.status, response.statusText)
    
    if (!response.ok) {
      throw new Error(`Stream request failed: ${response.status}`)
    }
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    
    function read() {
      reader.read().then(({ done, value }) => {
        if (done) {
          console.log('✅ Stream ended')
          if (onComplete) onComplete()
          return
        }
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\\n')
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data.trim()) {
              try {
                const event = JSON.parse(data)
                console.log('📨 Event:', event.type, event.message || 'data')
                
                if (event.type === 'result') {
                  if (onResult) onResult(event.data)
                  if (onProgress && event.progress) onProgress(event.progress)
                } else if (event.type === 'complete' && onComplete) {
                  onComplete()
                  return
                }
              } catch (e) {
                console.error('❌ Parse error:', e.message, 'Data:', data.substring(0, 100))
              }
            }
          }
        }
        
        read()
      }).catch(error => {
        console.error('❌ Stream read error:', error.message)
        if (error.name !== 'AbortError' && onError) {
          onError(error)
        }
      })
    }
    
    read()
  })
  .catch(error => {
    console.error('❌ Fetch error:', error.message)
    if (error.name !== 'AbortError' && onError) {
      onError(error)
    }
  })
  
  return controller
}

// 模拟前端的状态管理
const mockState = {
  isVerifying: false,
  verificationResults: [],
  progress: 0,
  error: null
}

function mockSetIsVerifying(value) {
  console.log('🔄 setIsVerifying:', value)
  mockState.isVerifying = value
}

function mockAddVerificationResult(result) {
  console.log('📋 addVerificationResult:', result.status, result.reference.substring(0, 50) + '...')
  mockState.verificationResults.push(result)
}

function mockUpdateProgress(progress) {
  console.log('📊 updateProgress:', progress.percentage + '%')
  mockState.progress = progress.percentage
}

function mockSetError(error) {
  console.log('❌ setError:', error)
  mockState.error = error
}

// 模拟handleVerify函数
async function simulateHandleVerify() {
  const inputText = `Adams, R.B. and Ferreira, D. (2009) 'Women in the boardroom and their impact on governance and performance', Journal of Financial Economics, 94(2), pp. 291-309.
Jensen, M.C. and Meckling, W.H. (1976) 'Theory of the firm: Managerial behavior, agency costs and ownership structure', Journal of Financial Economics, 3(4), pp. 305-360.`
  
  console.log('🎯 Simulating handleVerify function...')
  
  const referenceList = inputText.trim().split('\\n').filter(ref => ref.trim())
  console.log('📝 Reference list:', referenceList.length, 'items')
  
  if (referenceList.length === 0) {
    mockSetError('请输入至少一条参考文献')
    return
  }

  // Reset state
  mockState.verificationResults = []
  mockState.progress = 0
  mockState.error = null
  
  mockSetIsVerifying(true)
  
  const useStreaming = true // 模拟前端的useStreaming状态
  
  if (useStreaming) {
    console.log('🌊 Using streaming approach...')
    
    const controller = verifyReferencesStream(
      referenceList,
      (result) => {
        mockAddVerificationResult(result)
      },
      (progress) => {
        mockUpdateProgress(progress)
      },
      () => {
        mockSetIsVerifying(false)
        console.log('🎉 Verification completed!')
        console.log('📊 Final state:', {
          results: mockState.verificationResults.length,
          progress: mockState.progress,
          error: mockState.error
        })
      },
      (error) => {
        mockSetError(error.message)
        mockSetIsVerifying(false)
      }
    )
    
    console.log('⏱️ Stream controller created, waiting for results...')
  }
}

// 运行测试
console.log('=' .repeat(60))
console.log('🧪 FRONTEND SIMULATION TEST')
console.log('=' .repeat(60))

simulateHandleVerify()

// 设置超时检查
setTimeout(() => {
  console.log('\\n⏰ Test timeout check:')
  console.log('📊 Current state:', mockState)
  if (mockState.isVerifying) {
    console.log('⚠️ Still verifying... (this might indicate an issue)')
  }
}, 30000) // 30秒超时检查