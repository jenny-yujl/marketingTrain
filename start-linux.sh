#!/bin/bash

echo "🚀 启动巨量千川直播推广教学系统 (Linux版)..."
echo ""

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    echo "安装方法: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

# 检查npm是否可用
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: npm不可用"
    exit 1
fi

# 显示版本信息
echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# 检查项目文件
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 未找到package.json文件"
    echo "请确保在项目根目录下运行此脚本"
    exit 1
fi

# 检查并安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
    echo ""
fi

echo "=========================================="
echo "    巨量千川直播推广教学系统"
echo "=========================================="
echo "🌐 前端地址: http://localhost:3100"
echo "🔧 后端API: http://localhost:5100"
echo "📚 数据库: PostgreSQL (需要单独配置)"
echo "=========================================="
echo ""

# 启动后端服务器
echo "🔧 启动后端服务器 (端口: 5100)..."
PORT=5100 NODE_ENV=development npx tsx server/index.ts &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端服务器
echo "🎨 启动前端服务器 (端口: 3100)..."
npx vite --config vite.local.config.ts --host 0.0.0.0 --port 3100 &
FRONTEND_PID=$!

echo ""
echo "✅ 服务器启动完成!"
echo ""
echo "🌐 请访问: http://localhost:3100"
echo "📖 使用 Ctrl+C 停止所有服务器"
echo ""

# 清理函数
cleanup() {
    echo ""
    echo "⏹️  正在关闭服务器..."
    kill $FRONTEND_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    echo "👋 服务器已关闭"
    exit 0
}

# 捕获退出信号
trap cleanup SIGINT SIGTERM

# 等待任一进程退出
wait $FRONTEND_PID $BACKEND_PID