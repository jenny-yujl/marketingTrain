#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 启动巨量千川直播推广教学系统...\n');

// 启动后端服务器
const backend = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development', PORT: '5000' }
});

// 等待2秒后启动前端
setTimeout(() => {
  console.log('🎨 启动前端开发服务器...\n');
  
  const frontend = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '3000'], {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // 处理退出信号
  process.on('SIGINT', () => {
    console.log('\n⏹️  正在关闭服务器...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });

  frontend.on('close', (code) => {
    console.log(`前端服务器退出: ${code}`);
    backend.kill();
  });

}, 2000);

backend.on('close', (code) => {
  console.log(`后端服务器退出: ${code}`);
});

console.log('📱 服务器启动中...');
console.log('🌐 前端地址: http://localhost:3000');
console.log('🔧 后端API: http://localhost:5000');
console.log('📖 使用 Ctrl+C 停止服务器\n');