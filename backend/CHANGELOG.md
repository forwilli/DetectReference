# Backend Changelog

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