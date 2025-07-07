import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

function ResultCard({ result }) {
  const [copied, setCopied] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('apa')
  
  const handleCopy = () => {
    navigator.clipboard.writeText(result.reference)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const getStatusColor = () => {
    return 'border-[#e2e8f0] bg-white/60 shadow-sm hover:shadow-md transition-all duration-200 paper-edge'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return (
          <svg className="w-6 h-6 text-[#22543d]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'not_found':
        return (
          <svg className="w-6 h-6 text-[#dc2626]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      case 'mismatch':
      case 'ambiguous':
        return (
          <svg className="w-6 h-6 text-[#92400e]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6 text-[#6b7280]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M9 10a3 3 0 015.5 1.5 2 2 0 01-2.5 2V16M12 20h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'verified':
        return 'VERIFIED'
      case 'not_found':
        return 'NOT FOUND'
      case 'mismatch':
        return 'MISMATCH'
      case 'ambiguous':
        return 'AMBIGUOUS'
      case 'error':
        return 'ERROR'
      default:
        return 'UNKNOWN'
    }
  }

  return (
    <Card className={getStatusColor()}>
      <CardContent className="py-4">
        <div className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-1 flex justify-center">
            {getStatusIcon(result.status)}
          </div>
          <div className="col-span-11">
            <p className="text-[#22543d] text-sm font-serif leading-relaxed mb-3">{result.reference}</p>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-sm text-xs font-serif tracking-wide border ${
                  result.status === 'verified' ? 'bg-[#22543d]/10 text-[#22543d] border-[#22543d]/20' : 
                  result.status === 'not_found' ? 'bg-[#dc2626]/10 text-[#dc2626] border-[#dc2626]/20' : 
                  result.status === 'error' ? 'bg-[#dc2626]/10 text-[#dc2626] border-[#dc2626]/20' :
                  'bg-[#92400e]/10 text-[#92400e] border-[#92400e]/20'
                }`}>
                  {getStatusLabel(result.status)}
                </span>
                {result.message && (
                  <span className="text-xs text-[#92400e]/60 font-serif italic">{result.message}</span>
                )}
              </div>
              {result.url && (
                <a 
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1a365d] hover:underline text-xs font-serif"
                >
                  View Source
                </a>
              )}
              <Button
                onClick={handleCopy}
                variant="ghost"
                size="sm"
                className="h-7 text-xs ml-auto font-serif hover:bg-[#e2e8f0]/50"
              >
                {copied ? 'Copied!' : 'Copy Reference'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ResultCard