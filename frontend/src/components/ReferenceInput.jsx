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
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Paste your references below, one per line. This tool uses CrossRef and Google Search to verify each entry.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> A status like "Not Found" or "Mismatch" indicates the reference couldn't be strongly matched
            against the search results. It does <strong>NOT</strong> definitively prove the reference is
            fake or wrong (it could be new, unindexed, or formatted differently). Use this as a
            preliminary check. "Verified" indicates a good match was found, and the reference may have been
            automatically formatted.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              Verification request failed. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        <Textarea
          className="min-h-[200px] border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
          placeholder={exampleText}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <div className="flex justify-center">
          {!useStore.getState().isVerifying ? (
            <Button
              onClick={handleVerify}
              disabled={!inputText.trim()}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#4ade80" stroke="#22c55e" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" fill="#16a34a"/>
                <path d="m19 19-3-3" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Verify References
            </Button>
          ) : (
            <Button
              onClick={handleCancel}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2"
            >
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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