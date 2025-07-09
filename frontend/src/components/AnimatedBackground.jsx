import React from 'react'
import './AnimatedBackground.css'

const AnimatedBackground = () => {
  return (
    <div className="animated-background">
      {/* Single breathing circle */}
      <div className="circle circle-1" />
      
      {/* Soft gradient overlay */}
      <div className="gradient-overlay" />
    </div>
  )
}

export default AnimatedBackground