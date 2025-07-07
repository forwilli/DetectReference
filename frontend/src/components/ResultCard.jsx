import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

function ResultCard({ result }) {
  const [copied, setCopied] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('apa')
  
  // Available formats from backend
  const availableFormats = result.formatted ? Object.keys(result.formatted) : []

  const handleCopy = () => {
    const textToCopy = result.formatted?.[selectedFormat] || result.formattedAPA
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'border-green-500 bg-green-50/50'
      case 'not_found':
        return 'border-red-500 bg-red-50/50'
      case 'mismatch':
        return 'border-yellow-500 bg-yellow-50/50'
      case 'ambiguous':
        return 'border-orange-500 bg-orange-50/50'
      case 'error':
        return 'border-red-500 bg-red-50/50'
      default:
        return 'border-border'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return '✅'
      case 'not_found':
        return '❌'
      case 'mismatch':
        return '⚠️'
      case 'ambiguous':
        return '🔍'
      case 'error':
        return '❗'
      default:
        return '❓'
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
    <Card className={getStatusColor(result.status)}>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">{getStatusIcon(result.status)}</span>
          <div className="flex-1">
            <p className="text-foreground mb-2">{result.reference}</p>
          {result.url && (
            <a 
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              {result.url}
            </a>
          )}
            <p className={`text-sm font-semibold mt-2 ${
              result.status === 'verified' ? 'text-green-600' : 
              result.status === 'not_found' ? 'text-red-600' : 
              result.status === 'error' ? 'text-red-600' :
              result.status === 'ambiguous' ? 'text-orange-600' : 'text-yellow-600'
            }`}>
            {getStatusLabel(result.status)}
            {result.message && ` - ${result.message}`}
          </p>
          
          {/* Display formatted citation for verified references */}
          {result.status === 'verified' && (result.formatted || result.formattedAPA) && (
              <div className="mt-4 p-3 bg-muted/50 rounded-md border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <p className="text-xs font-medium text-muted-foreground">Formatted Citation</p>
                    {availableFormats.length > 1 && (
                      <Select 
                        value={selectedFormat} 
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="h-7 text-xs w-24"
                      >
                        {availableFormats.map(format => (
                          <option key={format} value={format}>
                            {format.toUpperCase()}
                          </option>
                        ))}
                      </Select>
                    )}
                  </div>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="text-sm text-foreground">
                  {result.formatted?.[selectedFormat] || result.formattedAPA}
                </div>
              </div>
          )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ResultCard