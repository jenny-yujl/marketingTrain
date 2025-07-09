@echo off
title 巨量千川直播推广教学系统 - Windows
echo 🚀 启动巨量千川直播推广教学系统 (Windows版)...
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
    echo.
)

echo ==========================================
echo    巨量千川直播推广教学系统
echo ==========================================
echo 🌐 前端地址: http://localhost:3100
echo 🔧 后端API: http://localhost:5100
echo 📚 数据库: PostgreSQL (需要单独配置)
echo ==========================================
echo.

echo 📝 启动选项:
echo [1] 启动完整系统 (前端 + 后端)
echo [2] 仅启动前端 (端口: 3100)
echo [3] 仅启动后端 (端口: 5100)
echo [4] 退出
echo.

set /p choice=请选择 (1-4): 

if "%choice%"=="1" goto start_full
if "%choice%"=="2" goto start_frontend
if "%choice%"=="3" goto start_backend
if "%choice%"=="4" goto exit
echo 无效选择，启动完整系统...

:start_full
echo.
echo 🚀 启动完整系统...
echo 📖 使用 Ctrl+C 停止所有服务器
echo.

REM 在新窗口启动后端
start "后端服务器 - 端口5100" cmd /k "set PORT=5100 && set NODE_ENV=development && npx tsx server/index.ts"

REM 等待2秒让后端启动
timeout /t 2 /nobreak >nul

REM 在新窗口启动前端
start "前端服务器 - 端口3100" cmd /k "npx vite --config vite.local.config.ts --host 0.0.0.0 --port 3100"

echo ✅ 服务器启动完成!
echo.
echo 🌐 请访问: http://localhost:3100
echo 📱 系统将在新窗口中运行
echo.
pause
goto exit

:start_frontend
echo.
echo 🎨 启动前端服务器...
echo 🌐 访问地址: http://localhost:3100
echo.
npx vite --config vite.local.config.ts --host 0.0.0.0 --port 3100
goto exit

:start_backend
echo.
echo 🔧 启动后端服务器...
echo 🔧 API地址: http://localhost:5100
echo.
set PORT=5100
set NODE_ENV=development
npx tsx server/index.ts
goto exit

:exit
echo.
echo 👋 感谢使用巨量千川直播推广教学系统!
pause