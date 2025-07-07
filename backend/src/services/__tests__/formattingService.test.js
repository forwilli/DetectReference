import { jest } from '@jest/globals'
import { mapToCSL, formatAsApa } from '../formattingService.js'

describe('formattingService', () => {
  describe('mapToCSL', () => {
    it('should map journal article data correctly', () => {
      const input = {
        title: 'Test Article',
        authors: 'Smith, J.; Doe, Jane',
        year: '2023',
        journal: 'Test Journal',
        volume: '10',
        issue: '2',
        pages: '100-110',
        doi: '10.1234/test',
        type: 'journal'
      }
      
      const result = mapToCSL(input)
      
      expect(result.type).toBe('article-journal')
      expect(result.title).toBe('Test Article')
      expect(result.author).toHaveLength(2)
      expect(result.author[0]).toEqual({ family: 'Smith', given: 'J.' })
      expect(result.author[1]).toEqual({ family: 'Doe', given: 'Jane' })
      expect(result.issued['date-parts']).toEqual([[2023]])
      expect(result['container-title']).toBe('Test Journal')
      expect(result.volume).toBe('10')
      expect(result.issue).toBe('2')
      expect(result.page).toBe('100-110')
      expect(result.DOI).toBe('10.1234/test')
    })

    it('should handle Chinese author names in "姓, 名" format', () => {
      const input = {
        title: 'Test Article',
        authors: '张, 三; 李, 四',
        year: '2023'
      }
      
      const result = mapToCSL(input)
      
      expect(result.author).toHaveLength(2)
      expect(result.author[0]).toEqual({ family: '张', given: '三' })
      expect(result.author[1]).toEqual({ family: '李', given: '四' })
    })

    it('should handle various author formats', () => {
      const testCases = [
        {
          input: 'John Smith',
          expected: [{ given: 'John', family: 'Smith' }]
        },
        {
          input: 'Smith, John',
          expected: [{ family: 'Smith', given: 'John' }]
        },
        {
          input: 'Smith, J.',
          expected: [{ family: 'Smith', given: 'J.' }]
        },
        {
          input: 'John Smith and Jane Doe',
          expected: [
            { given: 'John', family: 'Smith' },
            { given: 'Jane', family: 'Doe' }
          ]
        },
        {
          input: 'Smith, J. & Doe, J.',
          expected: [
            { family: 'Smith', given: 'J.' },
            { family: 'Doe', given: 'J.' }
          ]
        }
      ]
      
      testCases.forEach(({ input, expected }) => {
        const result = mapToCSL({ authors: input })
        expect(result.author).toEqual(expected)
      })
    })

    it('should handle book data', () => {
      const input = {
        title: 'Test Book',
        authors: 'Author, A.',
        year: '2023',
        publisher: 'Test Publisher',
        type: 'book'
      }
      
      const result = mapToCSL(input)
      
      expect(result.type).toBe('book')
      expect(result.publisher).toBe('Test Publisher')
    })

    it('should handle missing data gracefully', () => {
      const input = {
        title: 'Test Article'
      }
      
      const result = mapToCSL(input)
      
      expect(result.title).toBe('Test Article')
      expect(result.type).toBe('article')
      expect(result.author).toEqual([])
      expect(result.issued).toBeUndefined()
    })

    it('should parse year from various date formats', () => {
      const testCases = [
        { input: '2023', expected: [[2023]] },
        { input: 2023, expected: [[2023]] },
        { input: '2023-05-15', expected: [[2023]] },
        { input: 'Published in 2023', expected: [[2023]] }
      ]
      
      testCases.forEach(({ input, expected }) => {
        const result = mapToCSL({ year: input })
        expect(result.issued['date-parts']).toEqual(expected)
      })
    })
  })

  describe('formatAsApa', () => {
    it('should format journal article in APA style', () => {
      const cslData = {
        type: 'article-journal',
        title: 'Test Article',
        author: [
          { family: 'Smith', given: 'John' },
          { family: 'Doe', given: 'Jane' }
        ],
        issued: { 'date-parts': [[2023]] },
        'container-title': 'Test Journal',
        volume: '10',
        issue: '2',
        page: '100-110'
      }
      
      const result = formatAsApa(cslData)
      
      // Citation-js might format slightly differently, so check for key components
      expect(result).toContain('Smith')
      expect(result).toContain('Doe')
      expect(result).toContain('2023')
      expect(result).toContain('Test Article')
      expect(result).toContain('Test Journal')
    })

    it('should use fallback formatting when citation-js fails', () => {
      // Mock console.error to avoid test output noise
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      
      const invalidData = {
        type: 'invalid-type',
        title: 'Test Article',
        author: [{ family: 'Smith', given: 'J' }],
        issued: { 'date-parts': [[2023]] }
      }
      
      const result = formatAsApa(invalidData)
      
      expect(result).toBe('Smith, J. (2023). Test Article.')
      
      consoleError.mockRestore()
    })

    it('should handle book formatting', () => {
      const cslData = {
        type: 'book',
        title: 'Test Book',
        author: [{ family: 'Author', given: 'A' }],
        issued: { 'date-parts': [[2023]] },
        publisher: 'Test Publisher'
      }
      
      const result = formatAsApa(cslData)
      
      expect(result).toContain('Author')
      expect(result).toContain('2023')
      expect(result).toContain('Test Book')
    })

    it('should handle missing author gracefully', () => {
      const cslData = {
        type: 'article',
        title: 'Test Article',
        issued: { 'date-parts': [[2023]] }
      }
      
      const result = formatAsApa(cslData)
      
      // Citation-js might handle missing authors differently than our fallback
      expect(result).toMatch(/Test Article/)
      expect(result).toContain('2023')
    })

    it('should handle et al. for multiple authors', () => {
      const cslData = {
        type: 'article',
        title: 'Test Article',
        author: [
          { family: 'Smith', given: 'A' },
          { family: 'Doe', given: 'B' },
          { family: 'Johnson', given: 'C' }
        ],
        issued: { 'date-parts': [[2023]] }
      }
      
      const result = formatAsApa(cslData)
      
      expect(result).toContain('Smith')
      // Either citation-js formats with all authors or fallback uses et al.
      expect(result.match(/et al\.|Doe.*Johnson/)).toBeTruthy()
    })
  })
})