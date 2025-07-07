# Backend Changelog

## [0.2.1] - 2025-01-07

### Fixed
- Multi-format citation now produces distinct outputs for each style
- Implemented custom formatters for MLA, Chicago, and Harvard styles
- Fixed issue where all formats showed identical APA-style output

### Changed
- formatCitation now uses custom implementations for each style instead of relying on citation-js templates

## [0.2.0] - 2025-01-07

### Added
- Multi-format citation support (APA, MLA, Chicago, Harvard)
- Generic `formatCitation` function to replace format-specific functions
- `SUPPORTED_FORMATS` constant for available citation styles
- All verified references now return citations in multiple formats

### Changed
- `formatAsApa` is now deprecated in favor of `formatCitation`
- verifyControllerSSE now returns `formatted` object with all citation styles
- Backward compatibility maintained with `formattedAPA` field

## [0.1.0] - 2025-01-07

### Added
- Citation formatting service (formattingService.js) with APA format support
- CSL-JSON mapping for various reference types (journal articles, books, etc.)
- Support for Chinese author name format "姓, 名"
- Integration of formatting into SSE verification endpoint
- Comprehensive unit tests for formatting service (11 test cases)
- citation-js dependency for professional citation formatting
- Fallback formatting mechanism when citation-js fails

### Changed
- verifyControllerSSE.js now returns `formattedAPA` field for verified references
- Cache system now stores and returns formatted citations

## [0.0.3] - 2025-01-07

### Added
- In-memory caching system using node-cache (7-day TTL, 10000 item limit)
- Cache key generation using SHA256 hashing
- Cache statistics and monitoring
- Memory usage monitoring with alerts
- Integration of caching into verification workflow

### Changed
- Verification performance improved from 3-5s to <100ms for cached results
- SSE responses now include cache statistics in completion event

## [0.0.2] - 2025-01-06

### Changed
- Updated Gemini model from experimental version to gemini-2.0-flash-latest
- Removed unused google-search-results-nodejs dependency

### Added
- Server-Sent Events (SSE) endpoint for real-time reference verification (/api/verify-references-stream)
- Progress tracking support in SSE responses
- Ability to handle batch processing with real-time updates

## [0.0.1] - 2025-01-06

### Added
- 初始项目设置
- Express.js 服务器配置
- 基础项目结构
- 环境变量配置
- 参考文献验证API端点 (/api/verify-references)
- Gemini 2.5 Flash 集成（文献信息提取）
- Google Search API 集成（真实性验证）
- 错误处理中间件
- 输入验证中间件