import NodeCache from 'node-cache'
import crypto from 'crypto'

// Cache configuration based on ADR-001
const CACHE_CONFIG = {
  stdTTL: 7 * 24 * 60 * 60, // 7 days in seconds
  checkperiod: 600,         // Check for expired keys every 10 minutes
  maxKeys: 10000,           // Maximum number of keys
  deleteOnExpire: true,     // Delete expired keys
  useClones: false          // Don't clone objects for better performance
}

// API version for cache key generation
const API_VERSION = '1.0'

// Create cache instance
const cache = new NodeCache(CACHE_CONFIG)

// Cache statistics
let cacheStats = {
  hits: 0,
  misses: 0,
  sets: 0,
  deletes: 0
}

/**
 * Generate a cache key for a reference
 * @param {string} referenceText - The original reference text
 * @returns {string} Cache key
 */
export function generateCacheKey(referenceText) {
  const normalizedText = referenceText.trim().toLowerCase()
  const hash = crypto.createHash('sha256').update(normalizedText).digest('hex')
  return `verify:${API_VERSION}:${hash}`
}

/**
 * Get cached verification result
 * @param {string} referenceText - The original reference text
 * @returns {Object|null} Cached result or null if not found
 */
export function getCachedResult(referenceText) {
  const key = generateCacheKey(referenceText)
  const result = cache.get(key)
  
  if (result) {
    cacheStats.hits++
    console.log(`Cache hit for key: ${key.substring(0, 20)}...`)
    return result
  } else {
    cacheStats.misses++
    return null
  }
}

/**
 * Store verification result in cache
 * @param {string} referenceText - The original reference text
 * @param {Object} analysisResult - Gemini analysis result
 * @param {Object} verificationResult - Verification result from CrossRef/Google
 * @returns {boolean} Success status
 */
export function setCachedResult(referenceText, analysisResult, verificationResult) {
  const key = generateCacheKey(referenceText)
  
  const cacheData = {
    reference: referenceText,
    geminiAnalysis: analysisResult,
    verificationResult: {
      ...verificationResult,
      timestamp: new Date().toISOString(),
      fromCache: false
    }
  }
  
  const success = cache.set(key, cacheData)
  if (success) {
    cacheStats.sets++
    console.log(`Cached result for key: ${key.substring(0, 20)}...`)
  }
  
  return success
}

/**
 * Get cache statistics
 * @returns {Object} Cache statistics including hit rate
 */
export function getCacheStats() {
  const totalRequests = cacheStats.hits + cacheStats.misses
  const hitRate = totalRequests > 0 ? (cacheStats.hits / totalRequests) * 100 : 0
  
  return {
    ...cacheStats,
    hitRate: hitRate.toFixed(2) + '%',
    totalRequests,
    currentKeys: cache.keys().length,
    memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024 // MB
  }
}

/**
 * Clear all cached entries
 * @returns {void}
 */
export function clearCache() {
  cache.flushAll()
  cacheStats.deletes += cache.keys().length
  console.log('Cache cleared')
}

/**
 * Warm up cache with common references (optional feature mentioned by Claude)
 * @param {Array<Object>} commonReferences - Array of common reference data
 * @returns {number} Number of references preloaded
 */
export async function warmupCache(commonReferences = []) {
  let preloaded = 0
  
  for (const refData of commonReferences) {
    if (refData.reference && refData.analysisResult && refData.verificationResult) {
      const success = setCachedResult(
        refData.reference,
        refData.analysisResult,
        refData.verificationResult
      )
      if (success) preloaded++
    }
  }
  
  console.log(`Cache warmup completed: ${preloaded} references preloaded`)
  return preloaded
}

// Monitor memory usage (as suggested by Claude)
let memoryMonitorInterval = null
if (process.env.NODE_ENV !== 'test') {
  memoryMonitorInterval = setInterval(() => {
    const stats = getCacheStats()
    if (stats.memoryUsage > 500) { // Alert if memory usage exceeds 500MB
      console.warn(`High memory usage detected: ${stats.memoryUsage.toFixed(2)}MB`)
    }
  }, 60000) // Check every minute
}

// Export function to stop monitoring (for cleanup)
export function stopMemoryMonitoring() {
  if (memoryMonitorInterval) {
    clearInterval(memoryMonitorInterval)
    memoryMonitorInterval = null
  }
}

// Export cache instance for advanced operations if needed
export { cache }

// Log cache configuration on startup
console.log('Cache service initialized with config:', {
  ttl: `${CACHE_CONFIG.stdTTL / 86400} days`,
  maxKeys: CACHE_CONFIG.maxKeys,
  apiVersion: API_VERSION
})