#!/usr/bin/env node
// 诊断生产环境问题

console.log('🔍 生产环境诊断');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('当前工作目录:', process.cwd());

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n📁 检查文件结构:');
console.log('__dirname:', __dirname);

// 检查dist目录
const distPath = path.join(__dirname, 'dist');
console.log('dist目录:', fs.existsSync(distPath) ? '存在' : '不存在');

if (fs.existsSync(distPath)) {
  console.log('dist内容:', fs.readdirSync(distPath));
}

// 检查public目录
const publicPath = path.join(distPath, 'public');
console.log('dist/public目录:', fs.existsSync(publicPath) ? '存在' : '不存在');

if (fs.existsSync(publicPath)) {
  console.log('public内容:', fs.readdirSync(publicPath));
}

// 检查服务器文件
const serverPath = path.join(distPath, 'index.js');
console.log('dist/index.js:', fs.existsSync(serverPath) ? '存在' : '不存在');

console.log('\n🌐 网络诊断:');
console.log('预期端口: 5000');
console.log('预期主机: 0.0.0.0');

console.log('\n📋 环境变量检查:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '已设置' : '未设置');
console.log('PORT:', process.env.PORT || '未设置');