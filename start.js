#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

// 检测操作系统
const isWindows = os.platform() === 'win32';

console.log('🚀 启动巨量千川直播推广教学系统...\n');
console.log(`📱 操作系统: ${os.platform()} ${os.arch()}\n`);

// 检查依赖
if (!fs.existsSync('node_modules')) {
  console.log('📦 首次运行，正在安装依赖...');
  console.log('请等待依赖安装完成...\n');
}

console.log('==========================================');
console.log('    巨量千川直播推广教学系统');
console.log('==========================================');
console.log('🌐 前端地址: http://localhost:3100');
console.log('🔧 后端API: http://localhost:5100');
console.log('==========================================');
console.log('📖 使用 Ctrl+C 停止所有服务器\n');

// 设置环境变量
const env = {
  ...process.env,
  NODE_ENV: 'development',
  PORT: '5100',
  FORCE_COLOR: '1'
};

// 启动后端
console.log('🔧 启动后端服务器...');
const backendArgs = isWindows 
  ? ['cmd', ['/c', 'npx cross-env PORT=5100 NODE_ENV=development tsx server/index.ts']]
  : ['npx', ['cross-env', 'PORT=5100', 'NODE_ENV=development', 'tsx', 'server/index.ts']];

const backend = spawn(backendArgs[0], backendArgs[1], {
  stdio: 'inherit',
  shell: isWindows,
  env
});

// 等待后端启动后启动前端
setTimeout(() => {
  console.log('🎨 启动前端服务器...');
  
  const frontendArgs = isWindows
    ? ['cmd', ['/c', 'npx vite --config vite.local.config.ts --host 0.0.0.0 --port 3100']]
    : ['npx', ['vite', '--config', 'vite.local.config.ts', '--host', '0.0.0.0', '--port', '3100']];

  const frontend = spawn(frontendArgs[0], frontendArgs[1], {
    stdio: 'inherit',
    shell: isWindows,
    env
  });

  // 错误处理
  frontend.on('error', (error) => {
    console.error('❌ 前端启动失败:', error.message);
  });

  backend.on('error', (error) => {
    console.error('❌ 后端启动失败:', error.message);
  });

  // 退出处理
  const cleanup = () => {
    console.log('\n⏹️  正在关闭服务器...');
    try {
      frontend.kill();
      backend.kill();
    } catch (e) {
      // 忽略kill错误
    }
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  
  if (isWindows) {
    process.on('SIGBREAK', cleanup);
  }

  frontend.on('close', () => {
    backend.kill();
  });

  backend.on('close', () => {
    frontend.kill();
  });

}, 2000);

// 错误处理
backend.on('error', (error) => {
  console.error('❌ 后端启动失败:', error.message);
  process.exit(1);
});