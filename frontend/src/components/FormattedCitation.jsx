import React from 'react'

/**
 * Component to render formatted citations with proper HTML formatting
 * Handles italics and other HTML formatting in citations
 */
function FormattedCitation({ citation }) {
  // Convert HTML tags to proper React elements
  const renderFormattedText = (text) => {
    if (!text) return null
    
    // Handle multiple HTML tags: <i>, <b>, <em>, <strong>
    const htmlPattern = /(<(?:i|b|em|strong)>.*?<\/(?:i|b|em|strong)>)/g
    const parts = text.split(htmlPattern)
    
    return parts.map((part, index) => {
      // Handle italic tags
      if (part.match(/^<i>.*<\/i>$/)) {
        const content = part.slice(3, -4)
        return <em key={index}>{content}</em>
      }
      // Handle bold tags
      if (part.match(/^<b>.*<\/b>$/)) {
        const content = part.slice(3, -4)
        return <strong key={index}>{content}</strong>
      }
      // Handle em tags
      if (part.match(/^<em>.*<\/em>$/)) {
        const content = part.slice(4, -5)
        return <em key={index}>{content}</em>
      }
      // Handle strong tags
      if (part.match(/^<strong>.*<\/strong>$/)) {
        const content = part.slice(8, -9)
        return <strong key={index}>{content}</strong>
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