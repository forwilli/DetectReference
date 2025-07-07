import React, { useState } from 'react'

function ResultCard({ result }) {
  const [copied, setCopied] = useState(false)

  const handleCopyAPA = () => {
    if (result.formattedAPA) {
      navigator.clipboard.writeText(result.formattedAPA)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-50 border-green-200'
      case 'not_found':
        return 'bg-red-50 border-red-200'
      case 'mismatch':
        return 'bg-yellow-50 border-yellow-200'
      case 'ambiguous':
        return 'bg-orange-50 border-orange-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
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
    <div className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
      <div className="flex items-start space-x-3">
        <span className="text-2xl">{getStatusIcon(result.status)}</span>
        <div className="flex-1">
          <p className="text-gray-800 mb-2">{result.reference}</p>
          {result.url && (
            <a 
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
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
          
          {/* Display formatted APA citation for verified references */}
          {result.status === 'verified' && result.formattedAPA && (
            <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 mb-1">Formatted Citation (APA)</p>
                  <p className="text-sm text-gray-800">{result.formattedAPA}</p>
                </div>
                <button
                  onClick={handleCopyAPA}
                  className="ml-3 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors duration-200"
                  title="Copy APA citation"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResultCard