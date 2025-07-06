# Windows 手动启动指南

## 步骤 1：打开两个命令提示符窗口

1. 按 `Win + R`，输入 `cmd`，按回车
2. 再次按 `Win + R`，输入 `cmd`，按回车

## 步骤 2：在第一个窗口启动后端

```cmd
cd C:\Users\K3i\Desktop\DetectReference\backend
npm run dev
```

您应该看到：
```
Server is running on port 3001
```

## 步骤 3：在第二个窗口启动前端

```cmd
cd C:\Users\K3i\Desktop\DetectReference\frontend
npm run dev
```

您应该看到：
```
VITE v4.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
```

## 步骤 4：打开浏览器

访问 http://localhost:5173

## 故障排除

### 如果出现 "npm 不是内部或外部命令"
- 需要安装 Node.js：https://nodejs.org/
- 安装后重启命令提示符

### 如果端口被占用
在命令提示符中运行：
```cmd
netstat -ano | findstr :5173
```
找到占用端口的进程ID，然后：
```cmd
taskkill /PID [进程ID] /F
```

### 如果防火墙阻止
- 打开 Windows Defender 防火墙
- 允许 Node.js 通过防火墙