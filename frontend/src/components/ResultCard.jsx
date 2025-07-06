import React from 'react'

function ResultCard({ result }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-50 border-green-200'
      case 'not_found':
        return 'bg-red-50 border-red-200'
      case 'mismatch':
        return 'bg-yellow-50 border-yellow-200'
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
            result.status === 'not_found' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {getStatusLabel(result.status)}
            {result.message && ` - ${result.message}`}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResultCard