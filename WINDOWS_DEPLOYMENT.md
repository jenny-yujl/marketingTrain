# Windows环境部署指南

## 巨量千川直播推广教学系统 - Windows版本

### 系统要求

- **Node.js**: 版本 16 或更高 ([下载链接](https://nodejs.org/))
- **操作系统**: Windows 10/11
- **端口要求**: 确保端口 3000 和 5000 未被占用

### 快速启动

#### 方式1: 一键启动（推荐）
双击 `start-full-windows.bat` 文件，选择启动选项：
- [1] 启动完整系统 (前端 + 后端)
- [2] 仅启动前端 (端口: 3000)
- [3] 仅启动后端 (端口: 5000)

#### 方式2: 分别启动服务
```bash
# 启动完整系统
start-windows.bat

# 仅启动前端
start-frontend-windows.bat

# 仅启动后端
start-backend-windows.bat
```

#### 方式3: 使用npm命令
```bash
# 安装依赖
npm install

# 启动前端 (端口: 3000)
npm run dev:frontend

# 启动后端 (端口: 5000)
npm run dev:backend

# 启动Windows版本
npm run dev:windows
```

### 访问地址

- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:5000
- **API文档**: http://localhost:5000/api

### 端口配置

#### 前端端口: 3000
- Vite开发服务器运行在此端口
- 支持热重载和快速刷新
- 自动代理API请求到后端

#### 后端端口: 5000
- Express服务器运行在此端口
- 提供RESTful API接口
- 处理数据库操作

### 项目结构

```
qianchuan-teaching-system/
├── client/                 # 前端React应用
├── server/                 # 后端Express服务器
├── shared/                 # 共享类型和模式
├── database_schema.sql     # 数据库结构文件
├── start-full-windows.bat  # 完整启动脚本
├── start-frontend-windows.bat # 前端启动脚本
├── start-backend-windows.bat  # 后端启动脚本
├── start-windows.js        # Node.js启动脚本
├── vite.local.config.ts    # Vite本地配置
└── package.local.json      # 本地包配置
```

### 数据库配置

#### PostgreSQL设置
1. 安装PostgreSQL ([下载链接](https://www.postgresql.org/download/windows/))
2. 创建数据库
3. 运行数据库脚本:
```bash
psql -U username -d database_name -f database_schema.sql
```

#### 环境变量
在项目根目录创建 `.env` 文件:
```
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
NODE_ENV=development
PORT=5000
```

### 功能特性

#### 教学模块
- **营销目标设置**: 品牌曝光、潜客收集、直播带货
- **推广场景**: 直播间推广、视频推广、信息流推广
- **商品设置**: 商品关联、价格配置、优惠设置
- **用户定向**: 年龄、性别、地域、兴趣、行为定向
- **预算排期**: 预算分配、投放时间、出价策略

#### 技术特性
- **实时预览**: 即时查看配置效果
- **数据持久化**: PostgreSQL数据库存储
- **响应式设计**: 支持不同屏幕尺寸
- **模块化架构**: 易于扩展和维护

### 故障排除

#### 常见问题

**1. 端口被占用**
```bash
# 查看端口占用
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# 终止进程
taskkill /PID <进程ID> /F
```

**2. Node.js未找到**
- 下载并安装最新版Node.js
- 重启命令提示符
- 验证安装: `node --version`

**3. 依赖安装失败**
```bash
# 清除缓存
npm cache clean --force

# 删除node_modules重新安装
rmdir /s node_modules
npm install
```

**4. 数据库连接错误**
- 检查PostgreSQL服务是否启动
- 验证数据库连接信息
- 确认防火墙设置

### 开发调试

#### 启用调试模式
```bash
# 设置调试环境变量
set DEBUG=express:*
set NODE_ENV=development

# 启动应用
npm run dev:windows
```

#### 查看日志
- 前端日志: 浏览器开发者工具控制台
- 后端日志: 命令提示符窗口
- 数据库日志: PostgreSQL日志文件

### 生产部署

#### 构建生产版本
```bash
# 构建前端
npm run build

# 启动生产服务器
npm start
```

#### 系统服务配置
使用 `pm2` 或 Windows服务管理器配置系统服务，确保应用自动启动。

### 技术支持

- **项目仓库**: [GitHub链接]
- **问题反馈**: [Issues链接]
- **技术文档**: 参考 `replit.md` 和 `LOCAL_DEPLOYMENT.md`

### 版本更新

定期检查更新并备份数据：
```bash
# 备份数据库
pg_dump database_name > backup.sql

# 更新代码
git pull origin main

# 重新安装依赖
npm install
```

---

**注意**: 本系统专为教学目的设计，模拟真实的直播推广平台操作流程，帮助学生理解电商直播推广的完整工作流程。