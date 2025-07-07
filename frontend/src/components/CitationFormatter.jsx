import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import FormattedCitation from './FormattedCitation'

function CitationFormatter() {
  const [inputText, setInputText] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('apa')
  const [formattedResults, setFormattedResults] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const formats = [
    { value: 'apa', label: 'APA Style' },
    { value: 'mla', label: 'MLA Style' },
    { value: 'chicago', label: 'Chicago Style' },
    { value: 'harvard', label: 'Harvard Style' }
  ]

  const exampleText = `Smith, J. (2023). Sample article title. Journal Name, 10(2), 123-145.
Doe, A., & Brown, B. (2022). Another research paper. Conference Proceedings, 45-52.
Johnson, M. (2021). Book title. Publisher Name.`

  const handleFormat = async () => {
    const referenceList = inputText.trim().split('\n').filter(ref => ref.trim())
    
    if (referenceList.length === 0) {
      setError('Please enter at least one reference')
      return
    }

    setIsProcessing(true)
    setError(null)
    setFormattedResults(null)

    try {
      const response = await fetch('/api/format-citations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          references: referenceList,
          format: selectedFormat
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to format citations')
      }

      const data = await response.json()
      setFormattedResults(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopyAll = () => {
    if (formattedResults) {
      const allFormatted = formattedResults.formatted.join('\n\n')
      navigator.clipboard.writeText(allFormatted)
    }
  }

  const handleCopySingle = (citation) => {
    navigator.clipboard.writeText(citation)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Citation Formatter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Format Style
          </label>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {formats.map(format => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            References (one per line)
          </label>
          <Textarea
            className="min-h-[120px]"
            placeholder={exampleText}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleFormat}
          disabled={!inputText.trim() || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Formatting...
            </>
          ) : (
            'Format Citations'
          )}
        </Button>

        {formattedResults && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Formatted Citations ({selectedFormat.toUpperCase()})
              </h3>
              <Button
                onClick={handleCopyAll}
                variant="outline"
                size="sm"
              >
                Copy All
              </Button>
            </div>
            
            <div className="space-y-3">
              {formattedResults.formatted.map((citation, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md border">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm text-gray-800 leading-relaxed flex-1">
                      <FormattedCitation citation={citation} />
                    </div>
                    <Button
                      onClick={() => handleCopySingle(citation)}
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CitationFormatter