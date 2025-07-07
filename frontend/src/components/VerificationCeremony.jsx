import React, { useState, useEffect } from 'react'

function VerificationCeremony({ result, onComplete }) {
  const [phase, setPhase] = useState('scanning')
  
  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('analyzing'), 1500)
    const timer2 = setTimeout(() => setPhase('stamping'), 3000)
    const timer3 = setTimeout(() => {
      setPhase('complete')
      onComplete()
    }, 4000)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fafaf8]/95 backdrop-blur-sm">
      <div className="relative max-w-2xl w-full mx-4">
        {/* Paper background */}
        <div className="absolute inset-0 bg-white rounded-lg shadow-2xl paper-edge" />
        
        {/* Content */}
        <div className="relative p-12 text-center">
          {phase === 'scanning' && (
            <div className="animate-in">
              <div className="relative inline-block">
                <svg className="w-24 h-24 mx-auto text-[#1a365d] animate-pulse" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" fill="currentColor"/>
                </svg>
                <div className="scan-line w-32 h-32 -translate-x-4" />
              </div>
              <p className="mt-4 font-serif text-[#1a365d]">Scanning reference...</p>
            </div>
          )}
          
          {phase === 'analyzing' && (
            <div className="animate-in">
              <svg className="w-24 h-24 mx-auto text-[#22543d] animate-thinking" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-13h4v6h-4zm0 8h4v2h-4z" fill="currentColor"/>
              </svg>
              <p className="mt-4 font-serif text-[#22543d]">Analyzing authenticity...</p>
            </div>
          )}
          
          {phase === 'stamping' && (
            <div className="animate-in">
              <div className="relative inline-block animate-stamp">
                <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="45" stroke={result.isValid ? '#22543d' : '#dc2626'} strokeWidth="3" />
                  <circle cx="50" cy="50" r="40" stroke={result.isValid ? '#22543d' : '#dc2626'} strokeWidth="1" />
                  <text x="50" y="40" textAnchor="middle" className="font-serif text-2xl" fill={result.isValid ? '#22543d' : '#dc2626'}>
                    {result.isValid ? 'VERIFIED' : 'INVALID'}
                  </text>
                  <text x="50" y="65" textAnchor="middle" className="font-serif text-sm" fill={result.isValid ? '#22543d' : '#dc2626'}>
                    {new Date().toLocaleDateString()}
                  </text>
                </svg>
              </div>
              <div className="mt-6 space-y-2 animate-write">
                <p className="font-serif text-lg text-[#1a365d]">{result.title}</p>
                <p className="font-serif text-sm text-[#92400e]/70">{result.authors}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerificationCeremony