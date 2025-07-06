# Reference Verifier 设置指南

## 获取必需的API密钥

### 1. Gemini API Key
1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 登录您的Google账号
3. 点击 "Create API Key"
4. 复制生成的API密钥

### 2. Google Custom Search API
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 "Custom Search API"
4. 创建凭据 > API密钥
5. 复制API密钥

### 3. Google Custom Search Engine ID
1. 访问 [Google Programmable Search Engine](https://programmablesearchengine.google.com/)
2. 点击 "Add" 创建新的搜索引擎
3. 在 "Sites to search" 中输入 `*.edu` 和 `scholar.google.com`
4. 创建后，在控制面板中找到 "Search engine ID"
5. 复制搜索引擎ID

## 配置环境变量

1. 进入后端目录：
```bash
cd backend
```

2. 创建 `.env` 文件：
```bash
cp .env.example .env
```

3. 编辑 `.env` 文件，填入您的API密钥：
```env
PORT=3001
GEMINI_API_KEY=您的Gemini_API密钥
GOOGLE_SEARCH_API_KEY=您的Google_Search_API密钥
GOOGLE_CSE_ID=您的搜索引擎ID
```

## 启动项目

### 方法1：使用启动脚本（推荐）
```bash
./start.sh
```

### 方法2：手动启动

1. 启动后端：
```bash
cd backend
npm install
npm run dev
```

2. 在新终端启动前端：
```bash
cd frontend
npm install
npm run dev
```

## 使用说明

1. 打开浏览器访问 http://localhost:5173
2. 在文本框中粘贴参考文献（每行一个）
3. 点击 "Verify References" 按钮
4. 查看验证结果：
   - ✅ VERIFIED（绿色）：已验证的真实文献
   - ⚠️ MISMATCH（黄色）：部分匹配，可能存在差异
   - ❌ NOT FOUND（红色）：未找到匹配的文献

## 故障排除

### API错误
- 检查 `.env` 文件中的API密钥是否正确
- 确保Google Cloud项目已启用相应的API
- 检查API配额是否用尽

### 端口冲突
- 如果3001或5173端口被占用，可以在配置文件中修改端口号

### 依赖安装失败
- 确保Node.js版本 >= 18.0.0
- 尝试清除npm缓存：`npm cache clean --force`