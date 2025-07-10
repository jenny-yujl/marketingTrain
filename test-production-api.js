#!/usr/bin/env node
// 测试生产环境下的API接口

import fetch from 'node-fetch';

console.log('🧪 测试生产环境API接口');

// 模拟生产环境设置
process.env.NODE_ENV = 'production';

async function testAPI() {
  try {
    console.log('📡 测试 GET /api/campaigns...');
    
    const response = await fetch('http://localhost:5000/api/campaigns', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('状态码:', response.status);
    console.log('响应头:', response.headers.get('content-type'));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API响应成功:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ API响应失败:', errorText);
    }
  } catch (error) {
    console.error('❌ API请求错误:', error.message);
  }
}

// 给服务器启动时间
setTimeout(testAPI, 3000);