# Vercel Analytics 使用指南

## 📊 查看流量数据

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目 `DetectReference`
3. 点击 **Analytics** 标签

## 📈 可用指标

### 基础指标
- **Page Views (PV)**: 页面浏览量
- **Unique Visitors (UV)**: 独立访客数
- **Average Duration**: 平均访问时长
- **Bounce Rate**: 跳出率

### 自定义事件
我们追踪以下用户行为：

| 事件名称 | 描述 | 数据 |
|---------|------|-----|
| `verify_references_start` | 用户开始验证引用 | count（引用数量）|
| `verify_references_complete` | 验证成功完成 | total_count, success_count, success_rate, duration_ms |
| `verify_references_error` | 验证出错 | error_message, references_count |
| `format_citations_start` | 开始格式化引用 | count, format（格式类型）|

## 🎯 关键指标解读

### 1. 转化漏斗
```
访问首页 → 输入引用 → 点击验证 → 查看结果
   100%  →    70%   →    50%   →    45%
```

### 2. 成功率指标
- **验证成功率**: success_count / total_count
- **API响应时间**: duration_ms 平均值
- **错误率**: error事件 / 总验证事件

### 3. 用户偏好
- **最常用格式**: format_citations_start 中 format 分布
- **平均引用数**: verify_references_start 的 count 平均值

## 📱 实时监控

### 查看实时数据
1. 在 Analytics 页面顶部
2. 可以看到当前在线人数
3. 实时页面访问情况

### 设置告警
在 Vercel Dashboard 中：
1. Settings → Notifications
2. 设置流量异常告警
3. 设置错误率告警

## 🔍 数据分析技巧

### 1. 识别高峰时段
- 查看 24 小时流量分布
- 找出用户最活跃时间
- 在高峰期避免部署

### 2. 分析用户路径
- 查看 Top Pages
- 分析用户从哪里来
- 优化转化路径

### 3. 监控性能
- 查看 Core Web Vitals
- 监控页面加载时间
- 优化慢速页面

## 💡 优化建议

基于数据做决策：

1. **如果跳出率高**
   - 优化首页加载速度
   - 改进用户引导
   - 添加示例引用

2. **如果验证成功率低**
   - 检查 API 稳定性
   - 优化错误提示
   - 增加重试机制

3. **如果特定格式使用多**
   - 将其设为默认
   - 优化该格式体验
   - 添加更多相关功能

## 🚨 常见问题

### 看不到数据？
1. 确保已部署最新代码
2. 检查广告拦截器
3. 等待 30 秒数据同步
4. 尝试不同页面

### 数据不准确？
1. 清除浏览器缓存
2. 使用隐身模式测试
3. 检查是否有重复事件

### 如何导出数据？
1. 目前 Vercel 不支持直接导出
2. 可以截图保存
3. 或使用 API 获取数据（需要 Pro 计划）

## 📞 需要帮助？

- 查看 [Vercel Analytics 文档](https://vercel.com/docs/analytics)
- 在项目 Issues 中提问
- 联系项目维护者

---

记住：数据驱动决策，持续优化体验！