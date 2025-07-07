// Load environment variables for tests
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { jest } from '@jest/globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '.env') })

// Mock https-proxy-agent to avoid network calls in tests
jest.unstable_mockModule('https-proxy-agent', () => ({
  HttpsProxyAgent: jest.fn().mockImplementation(() => ({}))
}))

// Set test timeout
jest.setTimeout(10000)

// Global test utilities
global.testHelpers = {
  // Mock axios responses
  mockAxiosResponse: (data, status = 200) => ({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {}
  }),
  
  // Mock axios error
  mockAxiosError: (message, code = 'NETWORK_ERROR') => {
    const error = new Error(message)
    error.code = code
    error.isAxiosError = true
    return error
  }
}