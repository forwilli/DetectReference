# Reference Verifier 启动脚本

Write-Host "Starting Reference Verifier..." -ForegroundColor Green

# 检查Node.js
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Error: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

# 进入项目目录
Set-Location $PSScriptRoot

# 安装依赖（如果需要）
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

# 启动后端
Write-Host "`nStarting backend server..." -ForegroundColor Green
Set-Location backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

# 等待后端启动
Start-Sleep -Seconds 3

# 启动前端
Write-Host "Starting frontend server..." -ForegroundColor Green
Set-Location ..\frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

# 等待前端启动
Start-Sleep -Seconds 5

# 打开浏览器
Write-Host "`nOpening browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "`nReference Verifier is running!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "`nClose the PowerShell windows to stop the servers." -ForegroundColor Yellow

Read-Host "`nPress Enter to exit"