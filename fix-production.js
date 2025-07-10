#!/usr/bin/env node
// 修复生产环境构建问题

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔧 修复生产环境构建');

try {
  // 1. 确保目录结构存在
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  if (!fs.existsSync('dist/public')) {
    fs.mkdirSync('dist/public', { recursive: true });
  }

  // 2. 创建最小前端页面
  console.log('📄 创建前端页面...');
  fs.writeFileSync('dist/public/index.html', `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>巨量千川直播推广教学系统</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .container { max-width: 1000px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; color: white; margin-bottom: 40px; }
        .header h1 { font-size: 2.5rem; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .header p { opacity: 0.9; font-size: 1.1rem; margin: 10px 0; }
        .card { background: white; border-radius: 12px; padding: 30px; margin: 20px 0; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .api-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .api-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
        .api-card h4 { color: #1e40af; margin: 0 0 15px 0; }
        button { background: #1e40af; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.2s; }
        button:hover { background: #1d4ed8; transform: translateY(-1px); }
        button:disabled { background: #94a3b8; cursor: not-allowed; }
        .result-area { background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px; font-family: 'Monaco', monospace; font-size: 13px; line-height: 1.5; max-height: 400px; overflow-y: auto; margin-top: 20px; }
        .success { color: #10b981; }
        .error { color: #ef4444; }
        .info { color: #3b82f6; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status-online { background: #dcfce7; color: #166534; }
        .footer { text-align: center; color: white; margin-top: 40px; opacity: 0.8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 巨量千川直播推广教学系统</h1>
            <p>Professional Advertising Campaign Management Platform</p>
            <div class="status-badge status-online">生产环境运行中</div>
        </div>
        
        <div class="card">
            <h3>📡 API接口测试面板</h3>
            <div class="api-grid">
                <div class="api-card">
                    <h4>📋 活动管理</h4>
                    <button onclick="testGetCampaigns()" id="btn-campaigns">获取活动列表</button>
                    <button onclick="testCreateCampaign()" id="btn-create">创建测试活动</button>
                </div>
                <div class="api-card">
                    <h4>📦 产品管理</h4>
                    <button onclick="testGetProducts()" id="btn-products">获取产品列表</button>
                    <button onclick="clearResults()" id="btn-clear">清空结果</button>
                </div>
            </div>
            
            <div class="result-area" id="results">
                <div class="info">[系统] 等待API测试...</div>
            </div>
        </div>
        
        <div class="card">
            <h3>🔧 系统信息</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div><strong>运行环境:</strong> 生产环境</div>
                <div><strong>后端框架:</strong> Node.js + Express</div>
                <div><strong>数据库:</strong> MySQL + Drizzle ORM</div>
                <div><strong>服务端口:</strong> 5000</div>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2025 巨量千川直播推广教学系统 | Powered by Node.js & MySQL</p>
        </div>
    </div>

    <script>
        const results = document.getElementById('results');
        let testCount = 0;
        
        function log(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            const className = type === 'success' ? 'success' : type === 'error' ? 'error' : 'info';
            const div = document.createElement('div');
            div.className = className;
            div.innerHTML = \`[\${timestamp}] \${message}\`;
            results.appendChild(div);
            results.scrollTop = results.scrollHeight;
            console.log(\`[\${type.toUpperCase()}] \${message}\`);
        }
        
        function setButtonState(buttonId, loading) {
            const btn = document.getElementById(buttonId);
            btn.disabled = loading;
            if (loading) {
                btn.textContent = btn.textContent.replace(/^/, '⏳ ');
            } else {
                btn.textContent = btn.textContent.replace('⏳ ', '');
            }
        }
        
        async function testGetCampaigns() {
            setButtonState('btn-campaigns', true);
            log('🔍 正在获取活动列表...');
            
            try {
                const response = await fetch('/api/campaigns');
                const data = await response.json();
                
                if (response.ok) {
                    log(\`✅ 获取成功: 找到 \${data.length} 个活动\`, 'success');
                    if (data.length > 0) {
                        log(\`📝 最新活动: \${data[0].name} (状态: \${data[0].status})\`);
                    } else {
                        log('📊 数据库为空，可以创建测试活动');
                    }
                } else {
                    log(\`❌ 获取失败: \${response.status} \${response.statusText}\`, 'error');
                }
            } catch (error) {
                log(\`💥 网络错误: \${error.message}\`, 'error');
            } finally {
                setButtonState('btn-campaigns', false);
            }
        }
        
        async function testCreateCampaign() {
            setButtonState('btn-create', true);
            testCount++;
            log(\`➕ 正在创建测试活动 #\${testCount}...\`);
            
            const testData = {
                name: \`API测试活动_\${testCount}_\${Date.now()}\`,
                marketingGoal: "商品推广",
                optimizationTarget: "转化量",
                priority: "高",
                promotionScenario: "直播间推广",
                placements: ["直播间"],
                deviceTypes: ["移动设备"],
                ageRange: "18-35",
                gender: "不限",
                location: "全国",
                interests: ["直播", "购物"],
                behaviors: ["视频观看", "购买行为"],
                campaignType: "持续投放",
                totalBudget: 1000 + (testCount * 100),
                dailyBudget: 100 + (testCount * 10),
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
                    log(\`✅ 创建成功: ID=\${result.id}, 名称=\${result.name}\`, 'success');
                    log(\`💰 预算: 总预算¥\${result.totalBudget}, 日预算¥\${result.dailyBudget}\`);
                } else {
                    const error = await response.json();
                    log(\`❌ 创建失败: \${error.message || response.statusText}\`, 'error');
                }
            } catch (error) {
                log(\`💥 创建错误: \${error.message}\`, 'error');
            } finally {
                setButtonState('btn-create', false);
            }
        }
        
        async function testGetProducts() {
            setButtonState('btn-products', true);
            log('📦 正在获取产品列表...');
            
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                
                if (response.ok) {
                    log(\`✅ 获取成功: 找到 \${data.length} 个产品\`, 'success');
                    if (data.length > 0) {
                        const product = data[0];
                        log(\`🛍️ 示例产品: \${product.name} - 现价¥\${product.currentPrice}\`);
                    }
                } else {
                    log(\`❌ 获取失败: \${response.status} \${response.statusText}\`, 'error');
                }
            } catch (error) {
                log(\`💥 网络错误: \${error.message}\`, 'error');
            } finally {
                setButtonState('btn-products', false);
            }
        }
        
        function clearResults() {
            results.innerHTML = '<div class="info">[系统] 结果已清空</div>';
            testCount = 0;
        }
        
        // 页面加载时自动测试
        window.addEventListener('load', () => {
            log('🚀 巨量千川推广系统已启动');
            log('💡 点击按钮测试API功能');
            
            // 2秒后自动测试获取活动
            setTimeout(() => {
                log('🔄 自动执行初始测试...');
                testGetCampaigns();
            }, 2000);
        });
    </script>
</body>
</html>`);

  // 3. 修复后端构建 - 手动处理 import.meta.dirname
  console.log('⚙️ 构建后端服务器...');
  
  // 读取服务器源代码
  const indexContent = fs.readFileSync('server/index.ts', 'utf8');
  
  // 构建后端，但是在构建时添加特殊处理
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --define:import.meta.dirname=\'"/app/dist"\'', { 
    stdio: 'inherit'
  });
  
  // 4. 手动修复构建后的文件中的路径问题
  console.log('🔧 修复路径问题...');
  let distContent = fs.readFileSync('dist/index.js', 'utf8');
  
  // 替换所有可能的路径问题
  distContent = distContent.replace(
    /import\.meta\.dirname/g,
    'process.cwd() + "/dist"'
  );
  
  // 特别处理 serveStatic 函数中的路径
  distContent = distContent.replace(
    /path\.resolve\([^,]+,\s*"public"\)/g,
    'path.resolve(process.cwd(), "dist", "public")'
  );
  
  fs.writeFileSync('dist/index.js', distContent);
  
  console.log('✅ 修复完成');
  console.log('📁 构建文件:');
  
  const distFiles = fs.readdirSync('dist');
  const publicFiles = fs.readdirSync('dist/public');
  
  console.log('  dist:', distFiles.join(', '));
  console.log('  public:', publicFiles.join(', '));
  
  console.log('\n🚀 可以运行: PORT=5001 NODE_ENV=production node dist/index.js');

} catch (error) {
  console.error('❌ 修复失败:', error.message);
  process.exit(1);
}