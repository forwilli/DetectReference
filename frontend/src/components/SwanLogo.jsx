import React from 'react'

function SwanLogo({ className = "w-8 h-8" }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M20.5 8.5C20.5 8.5 19.5 7 17.5 7C15.5 7 14.5 8.5 14.5 10.5C14.5 12.5 15.5 14 15.5 14C15.5 14 14 15 12 15C10 15 8.5 14 8.5 12C8.5 10 10 9 11 9C12 9 12.5 9.5 12.5 10.5M12 3C12 3 9 3 7 5C5 7 4 10 4 13C4 16 5 18 7 19C9 20 12 20 15 19C18 18 20 16 20 13C20 10 19 8.5 19 8.5"
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="0.5" fill="currentColor"/>
    </svg>
  )
}

export default SwanLogo