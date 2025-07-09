import React from 'react'
import './AnimatedBackground.css'

const AnimatedBackground = () => {
  return (
    <div className="animated-background">
      {/* Minimal geometric shapes */}
      <div className="shape shape-1" />
      <div className="shape shape-2" />
      <div className="shape shape-3" />
      <div className="shape shape-4" />
      
      {/* Subtle floating dots */}
      <div className="dot dot-1" />
      <div className="dot dot-2" />
      <div className="dot dot-3" />
    </div>
  )
}

export default AnimatedBackground