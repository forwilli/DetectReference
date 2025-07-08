# 代理配置说明

## 当前配置

当前版本会在所有环境下使用代理（包括 Vercel），只要设置了 `PROXY_URL` 环境变量。

## Vercel 代理配置

要在 Vercel 上使用代理，你需要：

### 1. 公网可访问的代理服务器

你的代理服务器必须有公网 IP 地址，Vercel 服务器才能连接到它。本地的 `172.27.224.1:7890` 只能在你的本地 WSL 环境中使用。

### 2. 在 Vercel 设置环境变量

在 Vercel 项目设置中添加：
```
PROXY_URL=http://你的公网代理IP:端口
```

### 3. 代理服务器要求

- 必须支持 HTTPS 代理
- 必须允许来自 Vercel IP 的连接
- 建议使用认证保护

### 推荐的代理服务

1. **Squid Proxy** - 在云服务器上搭建
2. **Shadowsocks** - 配合 privoxy 使用
3. **商业代理服务** - 如 Bright Data, Oxylabs 等

### 示例：在云服务器上搭建 Squid 代理

```bash
# 在 Ubuntu 服务器上
sudo apt update
sudo apt install squid

# 编辑配置文件
sudo nano /etc/squid/squid.conf

# 添加以下内容
http_access allow all
http_port 3128

# 重启服务
sudo systemctl restart squid
```

然后在 Vercel 设置：
```
PROXY_URL=http://你的服务器IP:3128
```

## 注意事项

1. **安全性** - 确保代理服务器安全，避免被滥用
2. **成本** - 云服务器和流量费用
3. **延迟** - 代理会增加请求延迟
4. **稳定性** - 代理服务器需要高可用性

## 替代方案

如果不想使用代理，可以考虑：
1. 使用美国地区的 Google 账户生成 API 密钥
2. 使用其他 AI 服务（如 OpenAI、Anthropic）
3. 部署到支持的地区（如美国、欧洲）