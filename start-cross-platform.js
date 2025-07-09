#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

console.log('🚀 启动巨量千川直播推广教学系统 (跨平台版)...\n');

// 检测操作系统
const isWindows = os.platform() === 'win32';
const isLinux = os.platform() === 'linux';
const isMacOS = os.platform() === 'darwin';

console.log(`📱 检测到操作系统: ${os.platform()} ${os.arch()}`);

// 获取正确的可执行文件路径
function getExecutablePath(command) {
  const nodeModulesBin = path.join(__dirname, 'node_modules', '.bin');
  
  if (isWindows) {
    // Windows下的可执行文件路径
    const extensions = ['.cmd', '.bat', '.exe', ''];
    for (const ext of extensions) {
      const execPath = path.join(nodeModulesBin, command + ext);
      if (fs.existsSync(execPath)) return execPath;
    }
  } else {
    // Unix系统 (Linux, macOS)
    const execPath = path.join(nodeModulesBin, command);
    if (fs.existsSync(execPath)) return execPath;
  }
  
  // 回退到系统PATH中的命令
  return command;
}

// 检查Node.js和npm
function checkNodeAndNpm() {
  return new Promise((resolve, reject) => {
    exec('node --version && npm --version', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ 错误: 未找到Node.js或npm');
        console.log('请安装Node.js: https://nodejs.org/');
        reject(error);
      } else {
        const lines = stdout.trim().split('\n');
        console.log(`✅ Node.js: ${lines[0]}`);
        console.log(`✅ npm: ${lines[1]}`);
        resolve();
      }
    });
  });
}

// 安装依赖
function installDependencies() {
  return new Promise((resolve, reject) => {
    console.log('📦 正在安装依赖...');
    const installCmd = isWindows ? 'npm.cmd' : 'npm';
    const installProcess = spawn(installCmd, ['install'], {
      stdio: 'inherit',
      shell: isWindows
    });
    
    installProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('❌ 依赖安装失败');
        reject(new Error(`npm install failed with code ${code}`));
      } else {
        console.log('✅ 依赖安装完成\n');
        resolve();
      }
    });
  });
}

// 检查依赖
async function checkDependencies() {
  try {
    await checkNodeAndNpm();
    
    // 检查node_modules是否存在
    const nodeModulesPath = path.join(__dirname, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      await installDependencies();
    }
    
    // 检查关键依赖
    const tsxPath = getExecutablePath('tsx');
    const vitePath = getExecutablePath('vite');
    
    if (!fs.existsSync(tsxPath) || !fs.existsSync(vitePath)) {
      console.log('⚠️  检测到缺失关键依赖，正在重新安装...');
      await installDependencies();
    }
    
    startServers();
  } catch (error) {
    console.error('启动失败:', error.message);
    process.exit(1);
  }
}

// 启动服务器
function startServers() {
  console.log('🔧 启动后端服务器 (端口: 5100)...\n');
  
  // 后端启动命令 - 直接使用npx避免npm脚本问题
  const backendCmd = getExecutablePath('npx');
  const backendArgs = ['cross-env', 'PORT=5100', 'NODE_ENV=development', 'tsx', 'server/index.ts'];
  
  const backend = spawn(backendCmd, backendArgs, {
    stdio: 'inherit',
    shell: isWindows,
    env: { 
      ...process.env, 
      FORCE_COLOR: '1'
    }
  });

  // 等待后端启动
  setTimeout(() => {
    console.log('🎨 启动前端服务器 (端口: 3100)...\n');
    
    // 前端启动命令 - 直接使用npx避免npm脚本问题
    const frontendCmd = getExecutablePath('npx');
    const frontendArgs = ['vite', '--config', 'vite.local.config.ts', '--host', '0.0.0.0', '--port', '3100'];
    
    const frontend = spawn(frontendCmd, frontendArgs, {
      stdio: 'inherit',
      shell: isWindows,
      env: { 
        ...process.env,
        FORCE_COLOR: '1'
      }
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
      frontend.kill();
      backend.kill();
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
    if (isWindows) {
      process.on('SIGBREAK', cleanup);
    }

    frontend.on('close', (code) => {
      console.log(`前端服务器退出: ${code}`);
      backend.kill();
    });

    backend.on('close', (code) => {
      console.log(`后端服务器退出: ${code}`);
      frontend.kill();
    });

  }, 3000);

  console.log('==========================================');
  console.log('    巨量千川直播推广教学系统');
  console.log('==========================================');
  console.log('🌐 前端地址: http://localhost:3100');
  console.log('🔧 后端API: http://localhost:5100');
  console.log(`📱 操作系统: ${os.platform()} ${os.arch()}`);
  console.log('==========================================');
  console.log('📖 使用 Ctrl+C 停止所有服务器\n');
}

// 显示启动信息
function showStartupInfo() {
  console.log('📋 系统信息:');
  console.log(`   操作系统: ${os.type()} ${os.release()}`);
  console.log(`   架构: ${os.arch()}`);
  console.log(`   Node.js: ${process.version}`);
  console.log(`   工作目录: ${process.cwd()}`);
  console.log('');
}

// 开始启动流程
async function main() {
  showStartupInfo();
  await checkDependencies();
}

// 启动应用
main().catch(error => {
  console.error('💥 启动失败:', error.message);
  process.exit(1);
});