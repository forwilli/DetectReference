# Frontend Changelog

## [0.2.0] - 2025-01-07

### Added
- Format selector dropdown for switching between citation styles
- Support for displaying multiple citation formats (APA, MLA, Chicago, Harvard)
- Dynamic format detection based on backend response

### Changed
- Copy button now copies the currently selected format
- Citation display shows selected format name in copy button tooltip

## [0.1.0] - 2025-01-07

### Added
- APA citation display for verified references in ResultCard component
- Copy button for formatted citations with visual feedback
- Elegant UI design for citation display section
- Support for displaying formattedAPA field from backend

### Changed
- ResultCard now uses React hooks (useState) for copy functionality
- Enhanced user experience with one-click citation copying

### Fixed
- Error display UI when backend verification fails
- Support for 'ambiguous' and 'error' status display with appropriate icons

## [0.0.2] - 2025-01-06

### Added
- Real-time streaming support for reference verification using Server-Sent Events (SSE)
- Progress bar showing verification progress percentage
- Cancel button to abort ongoing verification
- Automatic switching between batch and streaming modes based on reference count
- Real-time result updates as each reference is processed

### Changed
- Updated Zustand store to support streaming operations and progress tracking
- Enhanced API service with SSE client implementation
- Improved user experience for processing large batches of references

## [0.0.1] - 2025-01-06

### Added
- 初始项目设置
- React + Vite 开发环境
- Tailwind CSS 配置
- 基础项目结构
- 参考文献输入界面
- 验证结果展示组件
- 结果卡片组件（不同状态不同颜色）
- Zustand状态管理
- API服务集成