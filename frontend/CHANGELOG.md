# Frontend Changelog

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