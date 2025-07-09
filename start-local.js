#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 启动巨量千川直播推广教学系统...\n');

// 检查依赖是否安装
function checkDependencies() {
  const tsxPath = path.join(__dirname, 'node_modules', '.bin', 'tsx');
  const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
  
  if (!fs.existsSync(tsxPath) || !fs.existsSync(vitePath)) {
    console.log('📦 安装依赖中...');
    exec('npm install', (error, stdout, stderr) => {
      if (error) {
        console.error('依赖安装失败:', error);
        return;
      }
      console.log('✅ 依赖安装完成\n');
      startServers();
    });
  } else {
    startServers();
  }
}

function startServers() {
  // 启动后端服务器
  const backend = spawn('node', ['node_modules/.bin/tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development', PORT: '5000' }
  });

  // 等待2秒后启动前端
  setTimeout(() => {
    console.log('🎨 启动前端开发服务器...\n');
    
    const frontend = spawn('node', ['node_modules/.bin/vite', '--host', '0.0.0.0', '--port', '3000'], {
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
}

// 开始检查依赖并启动服务器
checkDependencies();