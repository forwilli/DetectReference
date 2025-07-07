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
    <div className="space-y-8 animate-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif tracking-tight text-[#1a365d] mb-2">Verification Chamber Results</h2>
          <p className="text-[#92400e]/70 font-serif">
            Authenticated {verificationResults.filter(r => r.status === 'verified').length} of {verificationResults.length} references
          </p>
        </div>
        <Button
          onClick={handleNewVerification}
          className="bg-[#1a365d] hover:bg-[#22543d] text-white font-serif"
        >
          New Verification
        </Button>
      </div>

      {isVerifying && progress > 0 && (
        <div className="space-y-2">
          <div className="bg-secondary rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Processing references... {progress}%
          </p>
        </div>
      )}

      <div className="space-y-6">
        {verificationResults.map((result, index) => (
          <ResultCard key={index} result={result} />
        ))}
      </div>
    </div>
  )
}

export default VerificationResults