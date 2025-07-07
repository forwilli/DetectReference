import React, { useEffect, useState } from 'react'

function FooterDebug() {
  const [windowHeight, setWindowHeight] = useState(0)
  const [documentHeight, setDocumentHeight] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0)
  
  useEffect(() => {
    const updateMetrics = () => {
      setWindowHeight(window.innerHeight)
      setDocumentHeight(document.documentElement.scrollHeight)
      setScrollPosition(window.scrollY)
    }
    
    updateMetrics()
    window.addEventListener('resize', updateMetrics)
    window.addEventListener('scroll', updateMetrics)
    
    return () => {
      window.removeEventListener('resize', updateMetrics)
      window.removeEventListener('scroll', updateMetrics)
    }
  }, [])
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div>Window Height: {windowHeight}px</div>
      <div>Document Height: {documentHeight}px</div>
      <div>Scroll Position: {scrollPosition}px</div>
      <div>At Bottom: {scrollPosition + windowHeight >= documentHeight - 10 ? 'YES' : 'NO'}</div>
    </div>
  )
}

export default FooterDebug