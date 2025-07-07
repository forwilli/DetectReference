# 维护指南

## 🚨 常见问题快速解决

### 1. API 调用失败
**症状**: "Verification request failed"
**解决步骤**:
1. 检查 Vercel Dashboard → Functions → Logs
2. 查看具体错误信息
3. 常见原因：
   - API 密钥过期 → 更新环境变量
   - 请求超时 → 检查网络或 API 服务状态
   - CORS 错误 → 检查后端 CORS 配置

### 2. 环境变量问题
**症状**: "Missing required environment variables"
**解决步骤**:
1. Vercel Dashboard → Settings → Environment Variables
2. 确认所有必需变量都存在：
   - `GEMINI_API_KEY`
   - `GOOGLE_SEARCH_API_KEY`
   - `GOOGLE_CSE_ID`
   - `USE_PROXY` = false
   - `VITE_API_URL` (前端)

### 3. 部署失败
**症状**: Build failed
**解决步骤**:
1. 查看 Vercel 部署日志
2. 常见原因：
   - 依赖安装失败 → 清理 package-lock.json
   - 构建错误 → 本地测试 `npm run build`

## 📊 监控设置

### 1. 免费监控工具

#### A. UptimeRobot (推荐)
1. 注册 [uptimerobot.com](https://uptimerobot.com)
2. 添加监控：
   - 前端：`https://detect-reference-frontend.vercel.app`
   - 后端：`https://detect-reference-backend.vercel.app/api/test`
3. 设置邮件/短信提醒

#### B. Vercel Analytics
- 自动包含在 Vercel 项目中
- 查看：项目 → Analytics 标签

### 2. 日志查看

#### 查看后端日志
```bash
# 在 Vercel Dashboard
Functions → Logs → 选择时间范围
```

#### 查看前端错误
1. 用户报告问题时
2. 让用户打开浏览器开发者工具 (F12)
3. 查看 Console 和 Network 标签

## 🔧 维护操作

### 1. 更新 API 密钥
当 Google 或 Gemini API 密钥需要更新时：
1. Vercel Dashboard → 项目 → Settings
2. Environment Variables → 编辑对应密钥
3. 保存后自动重新部署

### 2. 修复代码问题
```bash
# 1. 克隆项目到本地
git clone https://github.com/你的用户名/DetectReference.git
cd DetectReference

# 2. 安装依赖
cd backend && npm install
cd ../frontend && npm install

# 3. 本地测试
# 后端
cd backend
npm start

# 前端（新终端）
cd frontend
npm run dev

# 4. 修复问题后提交
git add .
git commit -m "fix: 描述你的修复"
git push
```

### 3. 查看 API 使用量

#### Google Cloud Console
1. 访问 [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. 查看 API 使用情况和配额

#### Vercel 使用量
1. Vercel Dashboard → 项目
2. Usage 标签查看函数调用次数

## 🤖 半自动化维护

### 1. 设置 GitHub Actions（可选）
创建 `.github/workflows/monitor.yml`：
```yaml
name: Health Check
on:
  schedule:
    - cron: '*/30 * * * *'  # 每30分钟
jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check Backend API
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://detect-reference-backend.vercel.app/api/test)
          if [ $response != "200" ]; then
            echo "Backend API is down!"
            exit 1
          fi
```

### 2. 使用 Vercel 的 Cron Jobs（Pro 版本）
可以设置定时任务自动检查和清理

## 📱 获取帮助

### 当遇到无法解决的问题时：

1. **收集信息**：
   - 错误截图
   - Vercel 日志
   - 浏览器控制台错误

2. **寻求帮助**：
   - 创建详细的问题描述
   - 包含错误信息和复现步骤
   - 可以在 GitHub Issues 或找 AI 助手帮助

## 🔄 定期维护建议

### 每周
- 检查 Vercel Dashboard 的错误日志
- 查看 API 使用量是否正常

### 每月
- 更新依赖包（谨慎测试）
- 检查 API 配额使用情况
- 备份环境变量配置

### 每季度
- 审查安全性
- 更新 API 密钥
- 性能优化检查

## 💡 预防措施

1. **设置使用限制**
   - 考虑添加速率限制
   - 监控异常高的 API 使用

2. **备份重要信息**
   - 环境变量配置
   - API 密钥（安全存储）
   - 部署配置

3. **文档更新**
   - 记录任何配置更改
   - 更新此维护指南

记住：大多数问题都可以通过查看日志和错误信息解决！