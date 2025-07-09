const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

console.log('🚀 启动巨量千川直播推广教学系统...\n');

// Windows环境检测
const isWindows = os.platform() === 'win32';

function getExecutablePath(command) {
  if (isWindows) {
    // Windows下的可执行文件路径
    const cmdPath = path.join(__dirname, 'node_modules', '.bin', command + '.cmd');
    const batPath = path.join(__dirname, 'node_modules', '.bin', command + '.bat');
    const exePath = path.join(__dirname, 'node_modules', '.bin', command + '.exe');
    
    if (fs.existsSync(cmdPath)) return cmdPath;
    if (fs.existsSync(batPath)) return batPath;
    if (fs.existsSync(exePath)) return exePath;
    return command; // 回退到系统PATH中的命令
  } else {
    return path.join(__dirname, 'node_modules', '.bin', command);
  }
}

function checkNodeAndNpm() {
  return new Promise((resolve, reject) => {
    exec('node --version && npm --version', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ 错误: 未找到Node.js或npm');
        console.log('请确保已安装Node.js: https://nodejs.org/');
        reject(error);
      } else {
        console.log('✅ Node.js和npm检查通过');
        resolve();
      }
    });
  });
}

function installDependencies() {
  return new Promise((resolve, reject) => {
    console.log('📦 正在安装依赖...');
    exec('npm install', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ 依赖安装失败:', error.message);
        reject(error);
      } else {
        console.log('✅ 依赖安装完成\n');
        resolve();
      }
    });
  });
}

async function checkDependencies() {
  try {
    await checkNodeAndNpm();
    
    // 检查是否存在node_modules
    if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
      await installDependencies();
    }
    
    // 检查关键依赖
    const tsxPath = getExecutablePath('tsx');
    const vitePath = getExecutablePath('vite');
    
    if (!fs.existsSync(tsxPath) && !fs.existsSync(vitePath)) {
      console.log('⚠️  检测到缺失关键依赖，正在重新安装...');
      await installDependencies();
    }
    
    startServers();
  } catch (error) {
    console.error('启动失败:', error.message);
    process.exit(1);
  }
}

function startServers() {
  console.log('🔧 启动后端服务器...\n');
  
  // 使用npm script启动，更兼容
  const backend = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: isWindows, // Windows需要shell
    env: { ...process.env, NODE_ENV: 'development', PORT: '5100' }
  });

  backend.on('error', (error) => {
    console.error('❌ 后端启动失败:', error.message);
    console.log('\n💡 尝试手动运行: npm run dev');
    process.exit(1);
  });

  backend.on('close', (code) => {
    console.log(`后端服务器退出: ${code}`);
  });

  // 处理退出信号
  process.on('SIGINT', () => {
    console.log('\n⏹️  正在关闭服务器...');
    backend.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n⏹️  正在关闭服务器...');
    backend.kill();
    process.exit(0);
  });

  console.log('📱 服务器启动中...');
  console.log('🌐 前端地址: http://localhost:3100');
  console.log('🔧 后端API: http://localhost:5100');
  console.log('📖 使用 Ctrl+C 停止服务器\n');
}

// 开始检查依赖并启动服务器
checkDependencies();