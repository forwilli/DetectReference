import React, { useState } from 'react'
import { track } from '@vercel/analytics'
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

    // Track citation formatting start
    track('format_citations_start', {
      count: referenceList.length,
      format: selectedFormat
    })

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://detect-reference-backend.vercel.app'
      const response = await fetch(`${API_URL}/api/format-citations`, {
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

  // Copy citation with rich text formatting
  const copyRichText = async (htmlText, plainText) => {
    try {
      // Use ClipboardItem API to write both HTML and plain text
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([htmlText], { type: 'text/html' }),
        'text/plain': new Blob([plainText], { type: 'text/plain' })
      })
      await navigator.clipboard.write([clipboardItem])
      return true
    } catch (err) {
      // Fallback to plain text if rich text fails
      console.warn('Rich text copy failed, falling back to plain text:', err)
      await navigator.clipboard.writeText(plainText)
      return false
    }
  }

  const handleCopyAll = async () => {
    if (formattedResults) {
      // Create both HTML and plain text versions
      const htmlFormatted = formattedResults.formatted.join('<br><br>')
      const plainFormatted = formattedResults.formatted
        .map(citation => citation.replace(/<[^>]*>/g, ''))
        .join('\n\n')
      
      await copyRichText(htmlFormatted, plainFormatted)
    }
  }

  const handleCopySingle = async (citation) => {
    // Create plain text version
    const plainTextCitation = citation.replace(/<[^>]*>/g, '')
    
    await copyRichText(citation, plainTextCitation)
  }

  return (
    <Card className="animate-in">
      <CardHeader>
        <CardTitle>
          Citation Formatter
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Transform your references into perfectly formatted citations.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Format Style
          </label>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {formats.map(format => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            References (one per line)
          </p>
          <Textarea
            className="min-h-[200px] font-mono text-sm"
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
          className={`w-full transition-all duration-300 ${
            inputText.trim() 
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg' 
              : 'bg-primary/20 text-primary/50 backdrop-blur-sm border border-primary/30'
          }`}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Formatting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" fill="currentColor"/>
              </svg>
              Format Citations
            </>
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
                <div key={index} className="group relative rounded-lg border p-3 hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm leading-relaxed flex-1">
                      <FormattedCitation citation={citation} />
                    </div>
                    <Button
                      onClick={() => handleCopySingle(citation)}
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
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