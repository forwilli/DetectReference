import React, { useState } from 'react'

function SimpleReferenceInput() {
  const [inputText, setInputText] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)

  const handleVerify = async () => {
    console.log('🔘 Simple button clicked!')
    
    const referenceList = inputText.trim().split('\n').filter(ref => ref.trim())
    
    if (referenceList.length === 0) {
      setError('请输入至少一条参考文献')
      return
    }

    setIsVerifying(true)
    setError(null)
    setResults([])
    
    console.log('📝 Processing references:', referenceList.length)

    try {
      const response = await fetch('https://detect-reference-backend.vercel.app/api/verify-references-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ references: referenceList })
      })
      
      console.log('📡 Response received:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          console.log('✅ Stream completed')
          break
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
                console.log('📨 Event:', event.type, event.message || 'data')
                
                if (event.type === 'result') {
                  setResults(prev => [...prev, event.data])
                } else if (event.type === 'complete') {
                  console.log('🎉 Verification completed')
                  break
                }
              } catch (e) {
                console.error('Parse error:', e.message)
              }
            }
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Verification error:', error.message)
      setError(error.message)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Simple Reference Verifier</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <textarea 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="输入参考文献，每行一个..."
          style={{
            width: '100%',
            height: '150px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>
      
      <button 
        onClick={handleVerify}
        disabled={isVerifying || !inputText.trim()}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: isVerifying ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isVerifying ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {isVerifying ? '🔄 验证中...' : '🔍 验证参考文献'}
      </button>
      
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          ❌ {error}
        </div>
      )}
      
      {results.length > 0 && (
        <div>
          <h2>验证结果：</h2>
          {results.map((result, index) => (
            <div key={index} style={{
              padding: '15px',
              margin: '10px 0',
              backgroundColor: result.status === 'verified' ? '#d4edda' : '#f8d7da',
              border: '1px solid ' + (result.status === 'verified' ? '#c3e6cb' : '#f5c6cb'),
              borderRadius: '4px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {result.status === 'verified' ? '✅' : '❌'} {result.status.toUpperCase()}
              </div>
              <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                {result.reference}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {result.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SimpleReferenceInput