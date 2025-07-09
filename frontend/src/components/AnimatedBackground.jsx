import React from 'react'
import './AnimatedBackground.css'

const AnimatedBackground = () => {
  return (
    <div className="animated-background">
      {/* Floating orbs with gradient */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      
      {/* Geometric lines */}
      <div className="geometric-lines">
        <div className="line line-1" />
        <div className="line line-2" />
        <div className="line line-3" />
      </div>
    </div>
  )
}

export default AnimatedBackground