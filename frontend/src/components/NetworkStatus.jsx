import React, { useState, useEffect } from 'react'
import { getNetworkStatus } from '../services/networkDetection'

function NetworkStatus() {
  const [networkInfo, setNetworkInfo] = useState(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkNetworkStatus = async () => {
    setIsChecking(true)
    try {
      const status = await getNetworkStatus()
      setNetworkInfo(status)
    } catch (error) {
      console.error('Network status check failed:', error)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkNetworkStatus()
  }, [])

  if (!networkInfo) {
    return null
  }

  const getStatusColor = () => {
    if (networkInfo.isOptimal) return 'text-green-600 bg-green-50 border-green-200'
    if (networkInfo.needsVPN) return 'text-amber-600 bg-amber-50 border-amber-200'
    return 'text-blue-600 bg-blue-50 border-blue-200'
  }

  const getStatusIcon = () => {
    if (networkInfo.isOptimal) return '🌐'
    if (networkInfo.needsVPN) return '🔒'
    return '🔄'
  }

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm border ${getStatusColor()}`}>
      <span>{getStatusIcon()}</span>
      <span className="font-medium">{networkInfo.region}</span>
      <span className="hidden sm:inline">• {networkInfo.suggestion}</span>
      {isChecking && <span className="animate-spin">⟳</span>}
      <button
        onClick={checkNetworkStatus}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
        title="重新检测网络"
      >
        🔄
      </button>
    </div>
  )
}

export default NetworkStatus