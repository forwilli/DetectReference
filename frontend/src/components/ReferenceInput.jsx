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
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Enter Your References</CardTitle>
        <CardDescription>
          Paste your references below, one per line. This tool uses the Gemini AI and Google Search 
          to verify each entry.
        </CardDescription>
      </CardHeader>
      <CardContent>
        
        <Alert className="mb-6">
          <AlertDescription>
            <strong>Note:</strong> A status like "Not Found" or "Mismatch" indicates the reference couldn't be strongly matched
            against the search results. It does **not** definitively prove the reference is
            fake or wrong (it could be new, unindexed, or formatted differently). Use this as a
            preliminary check. "Verified" indicates a good match was found, and the reference may have been
            automatically formatted.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Verification request failed. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        <Textarea
          className="min-h-[256px] mb-6"
          placeholder={exampleText}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <div className="flex justify-center gap-4">
          {!useStore.getState().isVerifying ? (
            <Button
              onClick={handleVerify}
              disabled={!inputText.trim()}
              size="lg"
            >
              🔄 Verify References
            </Button>
          ) : (
            <Button
              onClick={handleCancel}
              variant="destructive"
              size="lg"
            >
              ❌ Cancel Verification
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ReferenceInput