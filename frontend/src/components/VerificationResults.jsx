import React from 'react'
import useStore from '../store/useStore'
import ResultCard from './ResultCard'

function VerificationResults() {
  const { verificationResults, resetState, progress, isVerifying } = useStore()

  const handleNewVerification = () => {
    resetState()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Verification Results</h2>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            Verified {verificationResults.filter(r => r.status === 'verified').length} of {verificationResults.length} references
          </p>
          <button
            onClick={handleNewVerification}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            New Verification
          </button>
        </div>

        {isVerifying && progress > 0 && (
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
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