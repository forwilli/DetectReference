import React, { useState, useRef } from 'react'
import useStore from '../store/useStore'
import { verifyReferences, verifyReferencesStream } from '../services/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function ReferenceInput() {
  const [inputText, setInputText] = useState('')
  const streamControllerRef = useRef(null)
  const { 
    setReferences, 
    setIsVerifying, 
    setProgress, 
    setVerificationResults, 
    setError,
    addVerificationResult,
    updateProgress,
    resetState,
    useStreaming,
    error 
  } = useStore()
  
  const exampleText = `Linnenluecke, M. K., & Griffiths, A. (2015). The climate resilient organization: Adaptation and resilience to climate change and weather extremes. Edward Elgar Publishing.
Linnenluecke, M. K., Griffiths, A., & Winn, M. (2012). Extreme weather events and the critical importance of anticipatory adaptation and organizational resilience in responding to impacts. Business Strategy and the Environment, 21(1), 17-32.
Ørsted. (2023). Annual report 2022. https://orsted.com/en/investors/ir-material/financial-reports-and-presentations
Porter, M. E., & Kramer, M. R. (2011). Creating shared value. Harvard Business Review, 89(1/2), 62-77.
Winn, M., Kirchgeorg, M., Griffiths, A., Linnenluecke, M. K., & Günther, E. (2011). Impacts from climate change on organizations: A conceptual foundation. Business Strategy and the Environment, 20(3), 157-173.`

  const handleVerify = async () => {
    const referenceList = inputText.trim().split('\n').filter(ref => ref.trim())
    
    if (referenceList.length === 0) {
      setError('请输入至少一条参考文献')
      return
    }

    resetState()
    setReferences(referenceList)
    setIsVerifying(true)
    setError(null)

    if (useStreaming && referenceList.length > 2) {
      streamControllerRef.current = verifyReferencesStream(
        referenceList,
        (result) => {
          addVerificationResult(result)
        },
        (progress) => {
          updateProgress(progress)
        },
        () => {
          setIsVerifying(false)
          setProgress(100)
        },
        (error) => {
          setError(error.message)
          setIsVerifying(false)
        }
      )
    } else {
      try {
        const results = await verifyReferences(referenceList)
        setVerificationResults(results)
        setProgress(100)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsVerifying(false)
      }
    }
  }

  const handleCancel = () => {
    if (streamControllerRef.current) {
      streamControllerRef.current.abort()
      streamControllerRef.current = null
    }
    setIsVerifying(false)
    setProgress(0)
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="space-y-4">

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              Verification request failed. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <p className="text-sm font-serif text-[#1a365d] italic">
            "The pursuit of truth requires meticulous verification"
          </p>
          <div className="relative paper-edge rounded-lg">
            {/* Scanning line when verifying */}
            {useStore.getState().isVerifying && (
              <div className="scan-line pointer-events-none" />
            )}
            <div className="absolute left-0 top-0 bottom-0 w-8 border-l-2 border-[#e2e8f0] opacity-50" />
            <Textarea
              className="min-h-[350px] font-serif text-sm leading-relaxed bg-white/40 backdrop-blur-sm border-[#e2e8f0] pl-12 text-[#22543d] placeholder:text-[#92400e]/50 shadow-inner"
              placeholder={exampleText}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center">
          {!useStore.getState().isVerifying ? (
            <Button
              onClick={handleVerify}
              disabled={!inputText.trim()}
              size="lg"
              className={`transition-all duration-500 font-serif tracking-wide ${
                inputText.trim() 
                  ? 'bg-[#1a365d] hover:bg-[#22543d] text-white shadow-lg transform hover:scale-105' 
                  : 'bg-transparent text-[#1a365d]/40 border-2 border-dashed border-[#1a365d]/20'
              }`}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 2C6.03 2 2 6.03 2 11C2 15.97 6.03 20 11 20C13.39 20 15.56 19.12 17.18 17.69L20.3 20.8C20.5 21 20.77 21.1 21.03 21.1C21.29 21.1 21.56 21 21.76 20.8C22.17 20.39 22.17 19.73 21.76 19.32L18.65 16.22C19.57 14.71 20.1 12.93 20.1 11C20.1 6.03 16.07 2 11.1 2H11ZM11 4C14.87 4 18 7.13 18 11C18 14.87 14.87 18 11 18C7.13 18 4 14.87 4 11C4 7.13 7.13 4 11 4Z" fill="currentColor"/>
              </svg>
              Verify References
            </Button>
          ) : (
            <Button
              onClick={handleCancel}
              size="lg"
              variant="outline"
            >
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReferenceInput