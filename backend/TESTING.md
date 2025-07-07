# Backend Testing Guide

## Test Framework Setup

The backend now uses Jest as the automated testing framework, replacing the manual test scripts in the `tests/` directory.

### Configuration

- **Jest Config**: `jest.config.js` - Configured for ES modules
- **Setup File**: `jest.setup.js` - Loads environment variables and mocks
- **Test Location**: Tests are placed next to source files with `.test.js` extension

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run a specific test file
npm test src/utils/example.test.js
```

### Writing Tests

Example test structure:

```javascript
import { jest } from '@jest/globals'
import { myFunction } from './myModule.js'

describe('MyModule', () => {
  beforeEach(() => {
    // Setup before each test
    jest.clearAllMocks()
  })

  it('should do something', async () => {
    const result = await myFunction('input')
    expect(result).toBe('expected output')
  })
})
```

### Mocking External Dependencies

For modules that make network calls (axios, https-proxy-agent), use Jest's module mocking:

```javascript
// Mock before imports
jest.unstable_mockModule('axios', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn()
  }
}))

// Then import the mocked module
const axiosMock = await import('axios')
const { myService } = await import('./myService.js')
```

### Migration Progress

- [x] Jest framework setup
- [x] Example test created (`src/utils/example.test.js`)
- [ ] Service tests need proper mocking setup
- [ ] Controller tests to be created
- [ ] Integration tests to be added

### Notes

- Tests run with ES modules support (`NODE_OPTIONS=--experimental-vm-modules`)
- Environment variables are loaded from `.env` file
- Proxy agent is mocked to avoid network dependencies
- Test timeout is set to 10 seconds for async operations