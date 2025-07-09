#!/bin/bash

echo "🛑 正在停止本地部署服务器..."

# 停止后端服务器 (端口5000)
echo "停止后端服务器 (端口5000)..."
lsof -ti:5000 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ 后端服务器已停止"
else
    echo "ℹ️ 端口5000未被占用"
fi

# 停止前端服务器 (端口3000)
echo "停止前端服务器 (端口3000)..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ 前端服务器已停止"
else
    echo "ℹ️ 端口3000未被占用"
fi

# 停止所有tsx进程
echo "停止所有tsx进程..."
pkill -f "tsx server" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ tsx进程已停止"
fi

echo "🏁 所有服务器已停止"