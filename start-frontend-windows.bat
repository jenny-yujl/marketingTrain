@echo off
echo 🎨 启动前端开发服务器 (端口: 3100)...
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查依赖是否安装
if not exist node_modules (
    echo 📦 正在安装依赖...
    npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
)

echo 🎨 启动前端服务器...
echo 🌐 前端地址: http://localhost:3100
echo 📖 使用 Ctrl+C 停止服务器
echo.

REM 使用本地配置启动前端
npx vite --config vite.local.config.ts --host 0.0.0.0 --port 3100