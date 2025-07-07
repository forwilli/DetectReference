import { jest } from '@jest/globals'

// Mock axios module before importing the service
jest.unstable_mockModule('axios', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn()
  }
}))

// Import the mocked axios and the service to test
const axiosMock = await import('axios')
const { analyzeReferencesBatch } = await import('./geminiServiceAxios.js')

describe('Gemini Service', () => {
  const mockApiKey = 'test-gemini-api-key'
  
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.GEMINI_API_KEY = mockApiKey
  })

  describe('analyzeReferencesBatch', () => {
    it('should analyze multiple references in batch', async () => {
      const mockResponse = {
        data: {
          candidates: [{
            content: {
              parts: [{
                text: JSON.stringify([
                  {
                    originalReference: 'Barney, J. (1991). Firm resources and sustained competitive advantage. Journal of Management, 17(1), 99–120.',
                    type: 'journal_article',
                    authors: ['Barney, J.'],
                    title: 'Firm resources and sustained competitive advantage',
                    journal: 'Journal of Management',
                    year: 1991,
                    volume: '17',
                    issue: '1',
                    pages: '99-120',
                    doi: null
                  },
                  {
                    originalReference: 'Porter, M. E. (1985). Competitive advantage. Free Press.',
                    type: 'book',
                    authors: ['Porter, M. E.'],
                    title: 'Competitive advantage',
                    publisher: 'Free Press',
                    year: 1985
                  }
                ])
              }]
            }
          }]
        }
      }

      axiosMock.default.post.mockResolvedValueOnce(mockResponse)

      const references = [
        'Barney, J. (1991). Firm resources and sustained competitive advantage. Journal of Management, 17(1), 99–120.',
        'Porter, M. E. (1985). Competitive advantage. Free Press.'
      ]

      const result = await analyzeReferencesBatch(references)

      expect(axiosMock.default.post).toHaveBeenCalledWith(
        expect.stringContaining('generativelanguage.googleapis.com'),
        expect.objectContaining({
          contents: expect.arrayContaining([
            expect.objectContaining({
              parts: expect.arrayContaining([
                expect.objectContaining({
                  text: expect.stringContaining(JSON.stringify(references))
                })
              ])
            })
          ])
        }),
        expect.any(Object)
      )

      expect(result).toHaveLength(2)
      expect(result[0].type).toBe('journal_article')
      expect(result[0].authors).toEqual(['Barney, J.'])
      expect(result[1].type).toBe('book')
      expect(result[1].publisher).toBe('Free Press')
    })

    it('should handle empty batch', async () => {
      const result = await analyzeReferencesBatch([])
      
      expect(result).toEqual([])
    })

    it('should handle parsing errors gracefully', async () => {
      const mockResponse = {
        data: {
          candidates: [{
            content: {
              parts: [{
                text: 'Invalid JSON response'
              }]
            }
          }]
        }
      }

      axiosMock.default.post.mockResolvedValueOnce(mockResponse)

      const references = ['Reference 1', 'Reference 2']
      
      await expect(analyzeReferencesBatch(references)).rejects.toThrow()
    })

    it('should handle API errors', async () => {
      const mockError = new Error('API Error')
      mockError.response = {
        status: 403,
        data: { error: { message: 'Invalid API key' } }
      }

      axiosMock.default.post.mockRejectedValueOnce(mockError)

      const references = ['Some reference']
      
      await expect(analyzeReferencesBatch(references)).rejects.toThrow()
    })

    it('should handle references with special characters', async () => {
      const mockResponse = {
        data: {
          candidates: [{
            content: {
              parts: [{
                text: JSON.stringify([{
                  originalReference: 'O\'Brien, T. & Smith, J. (2020). "Complex" title: A study.',
                  type: 'journal_article',
                  authors: ['O\'Brien, T.', 'Smith, J.'],
                  title: '"Complex" title: A study',
                  year: 2020
                }])
              }]
            }
          }]
        }
      }

      axiosMock.default.post.mockResolvedValueOnce(mockResponse)

      const references = ['O\'Brien, T. & Smith, J. (2020). "Complex" title: A study.']
      const result = await analyzeReferencesBatch(references)

      expect(result[0].authors).toContain('O\'Brien, T.')
      expect(result[0].title).toBe('"Complex" title: A study')
    })
  })
})