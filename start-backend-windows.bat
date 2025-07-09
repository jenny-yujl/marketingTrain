@echo off
echo 🔧 启动后端服务器 (端口: 5100)...
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

echo 🔧 启动后端服务器...
echo 🔧 后端API: http://localhost:5100
echo 📖 使用 Ctrl+C 停止服务器
echo.

REM 设置环境变量并启动后端
set PORT=5100
set NODE_ENV=development
npx tsx server/index.ts