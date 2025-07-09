#!/usr/bin/env node

const { exec } = require('child_process');

console.log('🚀 启动巨量千川直播推广教学系统...\n');

// 使用 npm scripts 启动
console.log('📦 使用 npm 启动服务器...\n');

const server = exec('npm run dev', {
  env: { ...process.env, NODE_ENV: 'development' }
});

server.stdout.on('data', (data) => {
  console.log(data.toString());
});

server.stderr.on('data', (data) => {
  console.error(data.toString());
});

server.on('close', (code) => {
  console.log(`服务器退出: ${code}`);
});

// 处理退出信号
process.on('SIGINT', () => {
  console.log('\n⏹️  正在关闭服务器...');
  server.kill();
  process.exit(0);
});

console.log('📱 服务器启动中...');
console.log('🌐 应用地址: http://localhost:5000');
console.log('📖 使用 Ctrl+C 停止服务器\n');