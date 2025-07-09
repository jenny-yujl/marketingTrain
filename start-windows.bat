@echo off
echo 🚀 启动巨量千川直播推广教学系统...
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查npm是否可用
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: npm不可用
    pause
    exit /b 1
)

REM 检查package.json是否存在
if not exist package.json (
    echo ❌ 错误: 未找到package.json文件
    echo 请确保在项目根目录下运行此脚本
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

echo 📱 启动服务器...
echo 🌐 前端地址: http://localhost:3000
echo 🔧 后端API: http://localhost:5000
echo 📖 使用 Ctrl+C 停止服务器
echo.

REM 设置环境变量并启动应用
set PORT=5000
set NODE_ENV=development
npm run dev