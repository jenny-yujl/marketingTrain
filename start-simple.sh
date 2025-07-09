#!/bin/bash

echo "🚀 启动巨量千川直播推广教学系统..."
echo ""

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

echo "🔧 启动后端服务器 (端口: 5000)..."
PORT=5000 NODE_ENV=development npx tsx server/index.ts &

sleep 3

echo "🎨 启动前端服务器 (端口: 3000)..."
npx vite --config vite.local.config.ts --host 0.0.0.0 --port 3000 &

echo ""
echo "✅ 系统启动完成!"
echo "🌐 前端: http://localhost:3000" 
echo "🔧 后端: http://localhost:5000"
echo ""
echo "按 Ctrl+C 停止服务器"

wait