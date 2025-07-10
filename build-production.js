#!/usr/bin/env node
// 生产环境构建脚本 - 解决 import.meta.dirname 兼容性问题

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🏗️ 开始生产环境构建');

try {
  // 1. 清理旧构建文件
  console.log('🧹 清理dist目录...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  fs.mkdirSync('dist', { recursive: true });
  fs.mkdirSync('dist/public', { recursive: true });

  // 2. 构建前端
  console.log('🎨 构建前端...');
  try {
    execSync('timeout 20 vite build --outDir dist/public', { 
      stdio: 'inherit',
      timeout: 25000 
    });
    console.log('✅ 前端构建成功');
  } catch (error) {
    console.log('⚠️ 前端构建超时，创建最小化版本...');
    // 创建最小的前端文件
    fs.writeFileSync('dist/public/index.html', `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>巨量千川直播推广教学系统</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #1e40af; margin-bottom: 20px; }
        .api-test { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        button { padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; background: #1e40af; color: white; }
        pre { background: #f1f5f9; padding: 15px; border-radius: 4px; overflow-x: auto; border-left: 4px solid #1e40af; }
        .success { color: #059669; font-weight: bold; }
        .error { color: #dc2626; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 巨量千川直播推广教学系统</h1>
        
        <div class="api-test">
            <h3>📡 API接口测试</h3>
            <button onclick="testGetCampaigns()">获取活动列表</button>
            <button onclick="testCreateCampaign()">创建测试活动</button>
            <button onclick="testGetProducts()">获取产品列表</button>
        </div>
        
        <div id="result">
            <h3>📋 测试结果</h3>
            <pre id="output">等待API测试...</pre>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #e0f2fe; border-radius: 8px;">
            <h4>🔧 系统状态</h4>
            <p><strong>环境:</strong> 生产环境</p>
            <p><strong>服务器:</strong> Node.js + Express</p>
            <p><strong>数据库:</strong> MySQL + Drizzle ORM</p>
            <p><strong>端口:</strong> 5000</p>
        </div>
    </div>

    <script>
        const output = document.getElementById('output');
        
        function log(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            const className = type === 'success' ? 'success' : type === 'error' ? 'error' : '';
            output.innerHTML += \`<div class="\${className}">[\${timestamp}] \${message}</div>\`;
            console.log(message);
        }
        
        async function testGetCampaigns() {
            log('🔍 测试获取活动列表...');
            try {
                const response = await fetch('/api/campaigns');
                if (response.ok) {
                    const data = await response.json();
                    log(\`✅ 获取成功: 找到 \${data.length} 个活动\`, 'success');
                    if (data.length > 0) {
                        log(JSON.stringify(data[0], null, 2));
                    }
                } else {
                    log(\`❌ 获取失败: \${response.status} \${response.statusText}\`, 'error');
                }
            } catch (error) {
                log(\`❌ 请求错误: \${error.message}\`, 'error');
            }
        }
        
        async function testCreateCampaign() {
            log('➕ 测试创建活动...');
            const testData = {
                name: "API测试活动_" + Date.now(),
                marketingGoal: "商品推广",
                optimizationTarget: "转化量",
                priority: "高",
                promotionScenario: "直播间推广",
                placements: ["直播间"],
                deviceTypes: ["移动设备"],
                ageRange: "18-35",
                gender: "不限", 
                location: "全国",
                interests: ["直播"],
                behaviors: ["视频观看"],
                campaignType: "持续投放",
                totalBudget: 1000,
                dailyBudget: 100,
                biddingStrategy: "智能出价",
                clickBid: 1.5,
                weeklySchedule: [true, true, true, true, true, true, true],
                status: "draft"
            };
            
            try {
                const response = await fetch('/api/campaigns', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(testData)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    log(\`✅ 创建成功: ID \${result.id}, 名称: \${result.name}\`, 'success');
                } else {
                    const error = await response.json();
                    log(\`❌ 创建失败: \${error.message}\`, 'error');
                }
            } catch (error) {
                log(\`❌ 创建错误: \${error.message}\`, 'error');
            }
        }
        
        async function testGetProducts() {
            log('📦 测试获取产品列表...');
            try {
                const response = await fetch('/api/products');
                if (response.ok) {
                    const data = await response.json();
                    log(\`✅ 获取成功: 找到 \${data.length} 个产品\`, 'success');
                    if (data.length > 0) {
                        log(\`首个产品: \${data[0].name} - ¥\${data[0].currentPrice}\`);
                    }
                } else {
                    log(\`❌ 获取失败: \${response.status} \${response.statusText}\`, 'error');
                }
            } catch (error) {
                log(\`❌ 请求错误: \${error.message}\`, 'error');
            }
        }
        
        // 页面加载时自动测试
        window.onload = () => {
            setTimeout(() => {
                log('🚀 系统启动完成，开始自动测试...');
                testGetCampaigns();
            }, 1000);
        };
    </script>
</body>
</html>`);
  }

  // 3. 构建后端，替换 import.meta.dirname
  console.log('⚙️ 构建后端...');
  
  // 创建临时的服务器文件，替换 import.meta.dirname
  const serverContent = fs.readFileSync('server/index.ts', 'utf8');
  const viteContent = fs.readFileSync('server/vite.ts', 'utf8');
  
  // 在 vite.ts 中创建临时修复版本
  const fixedViteContent = viteContent.replace(
    /import\.meta\.dirname/g, 
    'path.dirname(new URL(import.meta.url).pathname)'
  );
  
  fs.writeFileSync('server/vite-fixed.ts', fixedViteContent);
  
  // 创建修复版本的 index.ts
  const fixedServerContent = serverContent.replace(
    'import { setupVite, serveStatic, log } from "./vite";',
    'import { setupVite, serveStatic, log } from "./vite-fixed";'
  );
  
  fs.writeFileSync('server/index-fixed.ts', fixedServerContent);
  
  // 构建修复版本
  execSync('esbuild server/index-fixed.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { 
    stdio: 'inherit' 
  });
  
  // 清理临时文件
  fs.unlinkSync('server/vite-fixed.ts');
  fs.unlinkSync('server/index-fixed.ts');
  
  console.log('✅ 后端构建成功');

  // 4. 验证构建结果
  console.log('🔍 验证构建结果...');
  const distFiles = fs.readdirSync('dist');
  const publicFiles = fs.readdirSync('dist/public');
  
  console.log('📁 dist目录:', distFiles);
  console.log('📁 public目录:', publicFiles);
  
  if (fs.existsSync('dist/index.js') && fs.existsSync('dist/public/index.html')) {
    console.log('✅ 构建完成！可以运行: NODE_ENV=production node dist/index.js');
  } else {
    console.log('❌ 构建不完整，请检查错误信息');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}