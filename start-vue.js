#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 启动Vue 3版本的巨量千川教学系统...\n');

// 启动后端服务器
console.log('🔧 启动后端服务器 (端口: 5000)...');
const backend = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: process.platform === 'win32'
});

// 等待后端启动
setTimeout(() => {
  console.log('🎨 启动Vue前端服务器 (端口: 3000)...');
  
  // 启动Vue前端
  const frontend = spawn('npx', ['vite', '--config', 'vite.local.config.ts', '--port', '3000', '--host', '0.0.0.0'], {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  frontend.on('error', (error) => {
    console.error('❌ 前端启动失败:', error.message);
  });

  // 显示启动信息
  setTimeout(() => {
    console.log('\n✅ 系统启动完成!');
    console.log('🌐 前端地址: http://localhost:3000');
    console.log('🔧 后端API: http://localhost:5000');
    console.log('📖 使用 Ctrl+C 停止服务器\n');
  }, 3000);

}, 2000);

backend.on('error', (error) => {
  console.error('❌ 后端启动失败:', error.message);
});

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n⏹️  正在停止服务器...');
  backend.kill();
  process.exit(0);
});