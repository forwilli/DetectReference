# Reference Verifier

一个使用AI技术验证学术参考文献真实性的Web应用。

## 功能特点

- 批量验证参考文献
- 使用 Gemini 2.5 Flash 进行文献信息识别
- 通过 Google Search API 验证文献真实性
- 直观的结果展示（已验证/虚构/不确定）
- 实时验证进度显示

## 技术栈

- **前端**: React + Vite + Tailwind CSS
- **后端**: Node.js + Express
- **AI**: Google Gemini 2.5 Flash
- **搜索**: Google Custom Search API

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm 或 yarn

### 安装步骤

1. 克隆项目
```bash
git clone [repository-url]
cd DetectReference
```

2. 安装前端依赖
```bash
cd frontend
npm install
```

3. 安装后端依赖
```bash
cd ../backend
npm install
```

4. 配置环境变量
在 backend 目录创建 `.env` 文件：
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_SEARCH_API_KEY=your_google_search_api_key
GOOGLE_CSE_ID=your_custom_search_engine_id
```

5. 启动开发服务器

前端：
```bash
cd frontend
npm run dev
```

后端：
```bash
cd backend
npm run dev
```

## 使用说明

1. 打开浏览器访问 http://localhost:5173
2. 在文本框中粘贴参考文献列表（每行一个）
3. 点击 "Verify References" 按钮
4. 查看验证结果

## 项目结构

```
DetectReference/
├── frontend/          # 前端应用
├── backend/           # 后端API
├── docs/              # 项目文档
└── README.md
```