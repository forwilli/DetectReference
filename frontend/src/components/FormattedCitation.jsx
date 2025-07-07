import React from 'react'

/**
 * Component to render formatted citations with proper HTML formatting
 * Handles italics and other HTML formatting in citations
 */
function FormattedCitation({ citation }) {
  // Convert <i> tags to proper React elements
  const renderFormattedText = (text) => {
    if (!text) return null
    
    // Split by italic tags
    const parts = text.split(/(<i>.*?<\/i>)/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('<i>') && part.endsWith('</i>')) {
        // Remove the tags and render in italics
        const content = part.slice(3, -4)
        return <em key={index}>{content}</em>
      }
      return <span key={index}>{part}</span>
    })
  }
  
  return (
    <span className="formatted-citation">
      {renderFormattedText(citation)}
    </span>
  )
}

export default FormattedCitation