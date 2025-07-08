import React, { useState } from 'react'
import useStore from '../store/useStore'

function FixedReferenceInput() {
  const [inputText, setInputText] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState(null)
  
  // 使用全局store
  const { addVerificationResult, resetState } = useStore()

  const exampleText = `Linnenluecke, M. K., & Griffiths, A. (2015). The climate resilient organization: Adaptation and resilience to climate change and weather extremes. Edward Elgar Publishing.
Linnenluecke, M. K., Griffiths, A., & Winn, M. (2012). Extreme weather events and the critical importance of anticipatory adaptation and organizational resilience in responding to impacts. Business Strategy and the Environment, 21(1), 17-32.
Ørsted. (2023). Annual report 2022. https://orsted.com/en/investors/ir-material/financial-reports-and-presentations
Porter, M. E., & Kramer, M. R. (2011). Creating shared value. Harvard Business Review, 89(1/2), 62-77.
Winn, M., Kirchgeorg, M., Griffiths, A., Linnenluecke, M. K., & Günther, E. (2011). Impacts from climate change on organizations: A conceptual foundation. Business Strategy and the Environment, 20(3), 157-173.`

  const handleVerify = async () => {
    console.log('🔘 FixedReferenceInput handleVerify called')
    
    const referenceList = inputText.trim().split('\n').filter(ref => ref.trim())
    
    if (referenceList.length === 0) {
      setError('请输入至少一条参考文献')
      return
    }

    console.log('📝 Processing references:', referenceList.length)
    
    setIsVerifying(true)
    setError(null)
    resetState() // 重置全局状态

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
                  addVerificationResult(event.data) // 添加到全局状态，这会触发页面切换
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

  const handleUseExample = () => {
    setInputText(exampleText)
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="space-y-4">

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">❌ {error}</p>
          </div>
        )}

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-white rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    📝 Input References
                  </h3>
                  <button
                    onClick={handleUseExample}
                    className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Use Example
                  </button>
                </div>
                
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your references here, one per line..."
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <div className="text-sm text-gray-500">
                  💡 Paste references from papers, separated by line breaks. Supports any citation format.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleVerify}
            disabled={isVerifying || !inputText.trim()}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
              isVerifying || !inputText.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {isVerifying ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                🔄 Verifying References...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 2C6.03 2 2 6.03 2 11C2 15.97 6.03 20 11 20C13.39 20 15.56 19.12 17.18 17.69L20.3 20.8C20.5 21 20.77 21.1 21.03 21.1C21.29 21.1 21.56 21 21.76 20.8C22.17 20.39 22.17 19.73 21.76 19.32L18.65 16.22C19.57 14.71 20.1 12.93 20.1 11C20.1 6.03 16.07 2 11.1 2H11ZM11 4C14.87 4 18 7.13 18 11C18 14.87 14.87 18 11 18C7.13 18 4 14.87 4 11C4 7.13 7.13 4 11 4Z" fill="currentColor"/>
                </svg>
                🔍 Verify References
              </>
            )}
          </button>
        </div>
        
        {isVerifying && (
          <div className="text-center text-sm text-gray-600">
            ⏳ Processing references... Results will appear automatically.
          </div>
        )}
      </div>
    </div>
  )
}

export default FixedReferenceInput