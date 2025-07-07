import { jest } from '@jest/globals'
import axios from 'axios'
import { searchReference } from './googleSearchService.js'

// Mock axios module
jest.unstable_mockModule('axios', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn()
  }
}))

// Import mocked axios
const axiosMock = await import('axios')

describe('Google Search Service', () => {
  const mockApiKey = 'test-api-key'
  const mockCseId = 'test-cse-id'
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
    
    // Mock environment variables
    process.env.GOOGLE_API_KEY = mockApiKey
    process.env.GOOGLE_CX = mockCseId
    process.env.GOOGLE_SEARCH_API_KEY = mockApiKey
    process.env.GOOGLE_CSE_ID = mockCseId
  })

  describe('searchReference', () => {
    it('should verify reference as found when title matches', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              title: 'The Impact of Climate Change on Agriculture - Journal Article',
              link: 'https://journal.com/article',
              snippet: 'Smith, J. and Doe, A. (2023). The Impact of Climate Change on Agriculture. Environmental Studies Journal.'
            }
          ]
        }
      }

      axiosMock.default.get.mockResolvedValueOnce(mockResponse)

      const referenceData = {
        title: 'The Impact of Climate Change on Agriculture',
        authors: ['Smith, J.', 'Doe, A.'],
        year: 2023,
        type: 'journal_article'
      }

      const result = await searchReference(referenceData)

      expect(axiosMock.default.get).toHaveBeenCalledWith(
        'https://www.googleapis.com/customsearch/v1',
        expect.objectContaining({
          params: expect.objectContaining({
            key: mockApiKey,
            cx: mockCseId,
            q: expect.any(String),
            num: 10
          })
        })
      )

      expect(result.status).toBe('verified')
      expect(result.url).toBe('https://journal.com/article')
      expect(result.confidence).toBeGreaterThan(0.5)
    })

    it('should return not_found when no results match', async () => {
      const mockResponse = {
        data: {
          items: []
        }
      }

      axiosMock.default.get.mockResolvedValueOnce(mockResponse)

      const referenceData = {
        title: 'Non-existent Paper Title',
        authors: ['Unknown, A.'],
        year: 2023,
        type: 'journal_article'
      }

      const result = await searchReference(referenceData)

      expect(result.status).toBe('not_found')
      expect(result.confidence).toBeLessThan(0.3)
    })

    it('should handle missing title gracefully', async () => {
      const referenceData = {
        authors: ['Smith, J.'],
        year: 2023,
        type: 'journal_article'
      }

      const result = await searchReference(referenceData)

      expect(result.status).toBe('error')
      expect(result.message).toBe('Title is required for search')
    })

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error')
      mockError.response = {
        status: 403,
        data: {
          error: {
            message: 'Quota exceeded'
          }
        }
      }

      axiosMock.default.get.mockRejectedValueOnce(mockError)

      const referenceData = {
        title: 'Some Title',
        authors: ['Author, A.'],
        year: 2023
      }

      const result = await searchReference(referenceData)

      expect(result.status).toBe('error')
      expect(result.message).toContain('Search failed')
    })

    it('should build appropriate search query for different reference types', async () => {
      const mockResponse = {
        data: { items: [] }
      }

      axiosMock.default.get.mockResolvedValueOnce(mockResponse)

      const bookReference = {
        title: 'Book Title',
        authors: ['Author, A.'],
        publisher: 'Publisher Name',
        year: 2023,
        type: 'book'
      }

      await searchReference(bookReference)

      // Check that the query includes publisher for books
      const callArgs = axiosMock.default.get.mock.calls[0][1]
      expect(callArgs.params.q).toContain('Publisher Name')
    })

    it('should calculate confidence score based on multiple factors', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              title: 'Exact Title Match - Author, A. (2023)',
              link: 'https://scholar.google.com/article',
              snippet: 'Author, A. and Coauthor, B. (2023). Exact Title Match. Journal Name, 10(2), 100-120.'
            }
          ]
        }
      }

      axiosMock.default.get.mockResolvedValueOnce(mockResponse)

      const referenceData = {
        title: 'Exact Title Match',
        authors: ['Author, A.', 'Coauthor, B.'],
        journal: 'Journal Name',
        year: 2023,
        type: 'journal_article'
      }

      const result = await searchReference(referenceData)

      expect(result.status).toBe('verified')
      expect(result.confidence).toBeGreaterThan(0.8) // High confidence due to multiple matches
      expect(result.url).toBe('https://scholar.google.com/article')
    })
  })
})