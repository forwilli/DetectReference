import { generateCacheKey, getCachedResult, setCachedResult, getCacheStats, clearCache } from './cacheService.js'

describe('Cache Service', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearCache()
  })

  describe('generateCacheKey', () => {
    it('should generate consistent keys for the same reference', () => {
      const ref1 = 'Smith, J. (2020). Test Article. Journal of Testing.'
      const ref2 = 'Smith, J. (2020). Test Article. Journal of Testing.'
      
      expect(generateCacheKey(ref1)).toBe(generateCacheKey(ref2))
    })

    it('should generate different keys for different references', () => {
      const ref1 = 'Smith, J. (2020). Test Article. Journal of Testing.'
      const ref2 = 'Doe, J. (2021). Another Article. Another Journal.'
      
      expect(generateCacheKey(ref1)).not.toBe(generateCacheKey(ref2))
    })

    it('should normalize whitespace and case', () => {
      const ref1 = 'Smith, J. (2020). Test Article. Journal of Testing.'
      const ref2 = '  SMITH, J. (2020). TEST ARTICLE. JOURNAL OF TESTING.  '
      
      expect(generateCacheKey(ref1)).toBe(generateCacheKey(ref2))
    })
  })

  describe('cache operations', () => {
    const testReference = 'Test, A. (2023). Cache Test. Test Journal.'
    const testAnalysis = { 
      authors: ['Test, A.'], 
      title: 'Cache Test',
      year: 2023 
    }
    const testVerification = {
      status: 'verified',
      source: 'test',
      confidence: 0.95
    }

    it('should store and retrieve cached results', () => {
      // Initially should return null
      expect(getCachedResult(testReference)).toBeNull()

      // Store result
      const success = setCachedResult(testReference, testAnalysis, testVerification)
      expect(success).toBe(true)

      // Retrieve result
      const cached = getCachedResult(testReference)
      expect(cached).not.toBeNull()
      expect(cached.reference).toBe(testReference)
      expect(cached.geminiAnalysis).toEqual(testAnalysis)
      expect(cached.verificationResult.status).toBe('verified')
      expect(cached.verificationResult.fromCache).toBe(false)
      expect(cached.verificationResult.timestamp).toBeDefined()
    })

    it('should track cache statistics', () => {
      // Initial stats
      let stats = getCacheStats()
      const initialHits = stats.hits
      const initialMisses = stats.misses

      // Cache miss
      getCachedResult('non-existent')
      stats = getCacheStats()
      expect(stats.misses).toBe(initialMisses + 1)

      // Cache set
      setCachedResult(testReference, testAnalysis, testVerification)
      stats = getCacheStats()
      expect(stats.sets).toBeGreaterThan(0)

      // Cache hit
      getCachedResult(testReference)
      stats = getCacheStats()
      expect(stats.hits).toBe(initialHits + 1)
      expect(Number(stats.hitRate.replace('%', ''))).toBeGreaterThan(0)
    })
  })
})