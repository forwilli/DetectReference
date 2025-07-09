import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import FormattedCitation from './FormattedCitation'
import { useTranslation } from 'react-i18next'

function ResultCard({ result }) {
  const [copied, setCopied] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('apa')
  const { t } = useTranslation()
  
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
  
  const handleCopy = async () => {
    // Create plain text version
    const plainTextReference = result.reference.replace(/<[^>]*>/g, '')
    
    await copyRichText(result.reference, plainTextReference)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const getStatusColor = () => {
    // 统一使用 shadcn 风格的边框和阴影
    return 'border-border bg-white shadow-sm hover:shadow-md transition-shadow duration-200'
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
        return t('status.verified')
      case 'not_found':
        return t('status.notFound')
      case 'mismatch':
        return t('status.suspicious')
      case 'ambiguous':
        return t('status.suspicious')
      case 'error':
        return t('status.error')
      default:
        return t('status.error')
    }
  }

  return (
    <Card className={getStatusColor()}>
      <CardContent className="py-4">
        <div className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-1 flex justify-center">
            <span className="text-xl">{getStatusIcon(result.status)}</span>
          </div>
          <div className="col-span-11">
            <p className="text-gray-800 text-sm leading-relaxed mb-3">
              <FormattedCitation citation={result.reference} />
            </p>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  result.status === 'verified' ? 'bg-green-100 text-green-800' : 
                  result.status === 'not_found' ? 'bg-red-100 text-red-800' : 
                  result.status === 'error' ? 'bg-red-100 text-red-800' :
                  result.status === 'ambiguous' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {getStatusLabel(result.status)}
                </span>
                {result.message && (
                  <span className="text-xs text-gray-600">{result.message}</span>
                )}
              </div>
              {result.url && (
                <a 
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs"
                >
                  {t('buttons.viewSource')}
                </a>
              )}
              <Button
                onClick={handleCopy}
                variant="ghost"
                size="sm"
                className="h-7 text-xs ml-auto"
              >
                {copied ? t('buttons.copied') : t('buttons.copyReference')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ResultCard