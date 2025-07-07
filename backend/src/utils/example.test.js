import { add, multiply } from './example.js'

describe('Example Utils', () => {
  describe('add', () => {
    it('should add two numbers correctly', () => {
      expect(add(2, 3)).toBe(5)
      expect(add(-1, 1)).toBe(0)
      expect(add(0, 0)).toBe(0)
    })
  })

  describe('multiply', () => {
    it('should multiply two numbers correctly', () => {
      expect(multiply(3, 4)).toBe(12)
      expect(multiply(-2, 5)).toBe(-10)
      expect(multiply(0, 100)).toBe(0)
    })
  })
})