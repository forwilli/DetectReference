# 部署前检查清单

## 1. 代码准备 ✅
- [x] API 密钥已更新
- [x] `.env` 文件被 `.gitignore` 忽略
- [x] `.env.example` 不包含真实密钥
- [x] 添加了 `USE_PROXY` 环境变量控制

## 2. 提交到 GitHub
```bash
git add .
git commit -m "Prepare for Cloudflare deployment"
git push origin master
```

## 3. Cloudflare Workers 部署（后端）

### 安装 Wrangler
```bash
npm install -g wrangler
```

### 登录 Cloudflare
```bash
wrangler login
```

### 设置密钥（在 Cloudflare Dashboard）
1. 进入 Workers & Pages
2. 创建新的 Worker
3. 设置环境变量：
   - `GEMINI_API_KEY` = 你的新密钥
   - `GOOGLE_SEARCH_API_KEY` = 你的新密钥
   - `GOOGLE_CSE_ID` = 40d7da597e3ee4a51
   - `USE_PROXY` = false

### 部署
```bash
cd backend
wrangler deploy
```

## 4. Cloudflare Pages 部署（前端）

1. 进入 Cloudflare Dashboard
2. 选择 Pages → Create a project
3. 连接 GitHub 仓库
4. 配置构建设置：
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `frontend`
5. 环境变量：
   - `VITE_API_URL` = https://your-worker-name.workers.dev

## 5. 部署后验证

- [ ] 访问前端网站
- [ ] 测试参考文献验证功能
- [ ] 测试引文格式化功能
- [ ] 检查 API 调用是否正常
- [ ] 监控 Cloudflare Analytics

## 6. 注意事项

1. **CORS 配置**：后端已经配置了 CORS，应该可以正常工作
2. **API 限制**：注意 Google API 的配额限制
3. **错误监控**：查看 Cloudflare Workers 日志了解错误

## 故障排除

### 如果 API 调用失败
1. 检查 Workers 日志
2. 确认环境变量设置正确
3. 确认 `USE_PROXY=false`

### 如果前端无法连接后端
1. 检查 `VITE_API_URL` 是否正确
2. 检查 CORS 设置
3. 确认 Workers 已成功部署