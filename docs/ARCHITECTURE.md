# Reference Verifier Architecture

## System Overview
参考文献验证系统采用前后端分离架构，通过AI和搜索引擎验证学术参考文献的真实性。

## Technology Stack

### Frontend
- **Framework**: React 18
- **State Management**: Zustand
- **UI Library**: Tailwind CSS + shadcn/ui
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: Google Gemini 2.5 Flash API
- **Search Integration**: Google Custom Search API
- **Validation**: Express Validator

## System Architecture

```
┌─────────────────┐     ┌──────────────────┐
│   Frontend UI   │────▶│  Backend API     │
│  (React + Vite) │     │  (Express.js)    │
└─────────────────┘     └────────┬─────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ┌───────▼────────┐      ┌────────▼────────┐
            │ Gemini API     │      │ Google Search   │
            │ (AI Analysis)  │      │ (Verification)  │
            └────────────────┘      └─────────────────┘
```

## Data Flow

1. **用户输入**: 用户批量粘贴参考文献列表
2. **解析处理**: 前端解析文献格式，发送到后端
3. **AI分析**: Gemini 2.5 Flash 识别文献信息（作者、标题、期刊等）
4. **真实性验证**: Google Search API 验证文献是否存在
5. **结果分类**: 将结果分为"已验证"、"虚构"、"不确定"三类
6. **展示结果**: 前端以不同颜色卡片展示验证结果

## API Design

### POST /api/verify-references
- **Input**: 参考文献列表数组
- **Process**: 批量验证每个参考文献
- **Output**: 验证结果数组，包含状态和详细信息

## Security Considerations
- API密钥环境变量管理
- 请求速率限制
- 输入验证和清理