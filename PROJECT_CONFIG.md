# 📚 Reference Verification System - 完整项目文档

## 🎯 项目概述

这是一个基于三阶段验证的参考文献验证系统，能够智能识别和验证各种类型的学术参考文献。

### 核心功能
1. **批量分析**：使用 Gemini AI 批量解析参考文献
2. **学术验证**：通过 CrossRef API 验证学术论文（支持有/无 DOI）
3. **通用搜索**：使用 Google Search API 验证其他类型文献
4. **置信度评分**：基于多维度匹配的智能评分系统

## 🔧 环境配置

### WSL 环境下的完整配置

#### 1. 基础环境变量 (.env)
```bash
# 服务器配置
PORT=3001

# Gemini API 配置
GEMINI_API_KEY=AIzaSyDN9PAV2xRni0uI71vuvy9Kjkd9NoFqgzI
GEMINI_MODEL_NAME=gemini-2.5-flash-lite-preview-06-17

# Google Search API 配置
GOOGLE_SEARCH_API_KEY=AIzaSyBp_IUB2sy_btpQPLA2uXBdfjoBWxHUeLc
GOOGLE_CSE_ID=40d7da597e3ee4a51

# 代理配置（WSL 需要使用 Windows 主机 IP）
HTTP_PROXY=http://127.0.0.1:7890
HTTPS_PROXY=http://127.0.0.1:7890
PROXY_URL=http://172.27.224.1:7890
```

#### 2. 获取 Windows 主机 IP（WSL 环境）
```bash
# 获取 Windows 主机 IP
ip route | grep default | awk '{print $3}'
# 通常是 172.x.x.1
```

### 🌐 代理配置

#### Clash 配置要点
```yaml
mixed-port: 7890
allow-lan: true
bind-address: '*'
mode: rule
log-level: info
external-controller: '127.0.0.1:9090'
```

#### 重要提示
- Windows 上运行 Clash，端口 7890
- WSL 中必须使用 Windows 主机 IP（如 172.27.224.1）
- 不能使用 127.0.0.1 或 localhost

### 📋 API 配置详情

#### 1. Gemini API
- **用途**：批量解析参考文献，提取结构化信息
- **模型**：gemini-2.5-flash-lite-preview-06-17
- **限制**：请注意 API 调用配额

#### 2. Google Search API
- **用途**：搜索和验证非学术文献
- **配置**：
  - 自定义搜索引擎：在整个网络中搜索
  - 每天查询上限：10,000 次
  - 每次查询最多返回：10 个结果（免费版限制）

#### 3. CrossRef API
- **用途**：验证学术论文
- **特点**：免费使用，不需要认证
- **功能**：
  - 通过 DOI 直接查询
  - 通过标题/作者搜索（增强功能）

## 🏗️ 项目架构

### 三阶段验证流程

```mermaid
graph TD
    A[用户输入参考文献] --> B[阶段1: Gemini 批量分析]
    B --> C{文献类型判断}
    C -->|学术论文| D[阶段2: CrossRef 验证]
    C -->|其他类型| E[阶段3: Google Search]
    D -->|有 DOI| F[路径A: DOI 直接验证]
    D -->|无 DOI| G[路径B: 标题/作者搜索]
    F --> H[返回验证结果]
    G --> H
    E --> I[置信度评分]
    I --> H
```

### 目录结构
```
DetectReference/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── agent.js          # 统一代理配置
│   │   ├── controllers/
│   │   │   └── verifyControllerSSE.js  # SSE 控制器
│   │   ├── services/
│   │   │   ├── geminiServiceAxios.js   # Gemini 服务
│   │   │   ├── crossrefService.js      # CrossRef 服务
│   │   │   └── googleSearchService.js  # Google 搜索服务
│   │   └── index.js
│   ├── .env                      # 环境变量
│   └── package.json
└── frontend/
    └── (React 应用)
```

## 💻 关键代码配置

### 1. 统一代理配置 (agent.js)
```javascript
import { HttpsProxyAgent } from 'https-proxy-agent'
import dotenv from 'dotenv'

dotenv.config()

const proxyUrl = process.env.PROXY_URL
let httpsAgent = null

if (proxyUrl) {
  httpsAgent = new HttpsProxyAgent(proxyUrl)
  console.log(`✅ Proxy agent configured for: ${proxyUrl}`)
} else {
  console.warn('⚠️ PROXY_URL not found in .env file.')
}

export { httpsAgent }
```

### 2. CrossRef 增强搜索功能
```javascript
// 通过标题和作者搜索文献（无需 DOI）
export const findPaperOnCrossRef = async (referenceData) => {
  const { title, authors, year } = referenceData
  
  // 构建查询
  let query = title
  if (authors && authors.length > 0) {
    const firstAuthor = authors[0]
    const authorLastName = firstAuthor.split(',')[0].split(' ').pop()
    query += ` ${authorLastName}`
  }
  
  // 搜索参数
  const params = {
    'query.bibliographic': query,
    'rows': 5,
    'select': 'DOI,title,author,published-print,container-title'
  }
  
  if (year) {
    params['filter'] = `from-pub-date:${year},until-pub-date:${year}`
  }
  
  // 执行搜索并返回最佳匹配
}
```

### 3. Google Search 置信度评分
```javascript
const CONFIDENCE_WEIGHTS = {
  titleMatch: 0.35,        // 标题匹配权重
  authorMatch: 0.25,       // 作者匹配权重
  yearMatch: 0.15,         // 年份匹配权重
  sourceAuthority: 0.15,   // 来源权威性权重
  multipleEvidence: 0.10   // 多重证据权重
}
```

## 🚀 快速启动

### 1. 安装依赖
```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. 配置环境
1. 复制上面的 .env 内容到 `backend/.env`
2. 确保 Clash 在 Windows 上运行（端口 7890）
3. 在 WSL 中更新 PROXY_URL 为你的 Windows 主机 IP

### 3. 启动服务
```bash
# 后端
cd backend
npm run dev  # 或 npm start

# 前端
cd frontend
npm run dev
```

## ⚠️ 常见问题

### 1. 代理连接失败
- **问题**：`ECONNREFUSED 127.0.0.1:7890`
- **解决**：
  ```bash
  # 获取正确的 Windows 主机 IP
  ip route | grep default | awk '{print $3}'
  # 更新 .env 中的 PROXY_URL
  ```

### 2. Google Search API 400 错误
- **问题**：`Request contains an invalid argument`
- **原因**：
  - 查询参数 `num` 超过 10（免费版限制）
  - 特殊字符未正确处理
- **解决**：确保 `num` 参数不超过 10

### 3. CrossRef 无法找到论文
- **问题**：某些论文在 CrossRef 中不存在
- **解决**：系统会自动降级到 Google Search

### 4. WSL 网络问题
- **问题**：无法连接到 Windows 服务
- **解决**：
  1. 确保 Windows 防火墙允许 WSL 访问
  2. Clash 设置中启用 "允许局域网连接"

## 📊 API 使用统计

### 每日限额
- **Gemini API**：根据你的账户配额
- **Google Search API**：10,000 次查询/天
- **CrossRef API**：无限制（建议合理使用）

### 优化建议
1. 实现缓存机制减少重复查询
2. 批量处理参考文献
3. 优先使用 CrossRef（免费且准确）

## 🔐 安全提示

1. **不要公开分享 API 密钥**
2. 使用环境变量存储敏感信息
3. 在生产环境中使用密钥轮换
4. 监控 API 使用情况防止滥用

## 📝 维护建议

1. **定期更新依赖**
   ```bash
   npm update
   npm audit fix
   ```

2. **监控 API 状态**
   - Gemini API 状态：https://status.cloud.google.com/
   - CrossRef 状态：https://status.crossref.org/

3. **备份配置**
   - 定期备份 .env 文件
   - 记录 API 使用情况

## 🎯 未来改进方向

1. **性能优化**
   - 实现 Redis 缓存
   - 添加请求去重
   - 优化批处理逻辑

2. **功能增强**
   - 支持更多文献类型
   - 添加 PDF 解析功能
   - 实现文献管理功能

3. **用户体验**
   - 添加进度条
   - 实现断点续传
   - 优化错误提示

---

**最后更新**: 2025-01-07
**作者**: K3i
**版本**: 1.0.0