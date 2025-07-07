import React from 'react'
import useStore from '../store/useStore'
import ResultCard from './ResultCard'
import { Button } from '@/components/ui/button'

function VerificationResults() {
  const { verificationResults, resetState, progress, isVerifying } = useStore()

  const handleNewVerification = () => {
    resetState()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Verification Results</h2>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-muted-foreground">
            Verified {verificationResults.filter(r => r.status === 'verified').length} of {verificationResults.length} references
          </p>
          <Button
            onClick={handleNewVerification}
            variant="outline"
          >
            New Verification
          </Button>
        </div>

        {isVerifying && progress > 0 && (
          <div className="mb-4">
            <div className="bg-secondary rounded-full h-4 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Processing references... {progress}%
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {verificationResults.map((result, index) => (
          <ResultCard key={index} result={result} />
        ))}
      </div>
    </div>
  )
}

export default VerificationResults