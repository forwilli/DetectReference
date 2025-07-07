import React from 'react'
import ReferenceInput from './components/ReferenceInput'
import VerificationResults from './components/VerificationResults'
import ShadcnTest from './components/ShadcnTest'
import useStore from './store/useStore'

function App() {
  const { verificationResults } = useStore()
  
  // Temporarily show Shadcn test component
  const showTest = false

  if (showTest) {
    return <ShadcnTest />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Reference Verifier</h1>
        
        {verificationResults.length === 0 ? (
          <ReferenceInput />
        ) : (
          <VerificationResults />
        )}
      </div>
    </div>
  )
}

export default App