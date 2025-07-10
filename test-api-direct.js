#!/usr/bin/env node
// 直接测试API问题

import http from 'http';

console.log('🔧 直接测试API问题');

// 测试API响应
function testAPI() {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/campaigns',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('响应数据:', data);
      
      if (res.statusCode === 200) {
        console.log('✅ API工作正常');
      } else {
        console.log('❌ API响应异常');
      }
    });
  });

  req.on('error', (e) => {
    console.error(`❌ 请求失败: ${e.message}`);
  });

  req.end();
}

// 等待服务器启动
setTimeout(testAPI, 2000);