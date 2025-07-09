# 跨平台部署指南

## 巨量千川直播推广教学系统 - 跨平台版本

### 支持的操作系统

- ✅ **Windows 10/11** (x64, ARM64)
- ✅ **Linux** (Ubuntu 18.04+, CentOS 7+, Debian 9+)
- ✅ **macOS** (10.14+, Apple Silicon & Intel)

### 系统要求

- **Node.js**: 版本 16.0 或更高
- **npm**: 版本 7.0 或更高
- **内存**: 最少 2GB RAM
- **存储**: 最少 1GB 可用空间
- **端口**: 3000 (前端) 和 5000 (后端) 需要空闲

---

## 快速启动

### 🚀 方式一: 自动检测平台启动

```bash
# 跨平台自动启动脚本
node start-cross-platform.js
```

### 🖥️ 方式二: Windows专用启动

```batch
# 双击执行 或 在命令行运行
start-full-windows.bat

# PowerShell
.\start-windows.bat

# 命令提示符
start-windows.bat
```

### 🐧 方式三: Linux/Unix专用启动

```bash
# 给脚本执行权限
chmod +x start-linux.sh

# 启动系统
./start-linux.sh

# 或使用bash
bash start-linux.sh
```

---

## 详细安装步骤

### Windows环境

#### 1. 安装Node.js
- 访问 [nodejs.org](https://nodejs.org/)
- 下载LTS版本 (推荐)
- 运行安装程序，选择"Add to PATH"

#### 2. 验证安装
```batch
node --version
npm --version
```

#### 3. 启动项目
```batch
# 克隆项目后进入目录
cd qianchuan-teaching-system

# 一键启动
start-full-windows.bat
```

### Linux环境

#### 1. 安装Node.js (Ubuntu/Debian)
```bash
# 使用NodeSource仓库
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 或使用包管理器
sudo apt update
sudo apt install nodejs npm
```

#### 2. 安装Node.js (CentOS/RHEL)
```bash
# 使用NodeSource仓库
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install nodejs npm

# 或使用dnf (Fedora)
sudo dnf install nodejs npm
```

#### 3. 启动项目
```bash
cd qianchuan-teaching-system
./start-linux.sh
```

### macOS环境

#### 1. 安装Node.js
```bash
# 使用Homebrew (推荐)
brew install node

# 或下载安装包
# 访问 nodejs.org 下载macOS安装包
```

#### 2. 启动项目
```bash
cd qianchuan-teaching-system
./start-linux.sh  # macOS使用Linux脚本
```

---

## 配置文件说明

### 端口配置

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端 | 3000 | Vite开发服务器 |
| 后端 | 5000 | Express API服务器 |

### 环境变量

创建 `.env` 文件：
```bash
# 数据库配置
DATABASE_URL=postgresql://username:password@localhost:5432/qianchuan_db

# 服务器配置
NODE_ENV=development
PORT=5000

# 前端配置
VITE_API_BASE_URL=http://localhost:5000
```

### 配置文件对应关系

| 文件 | 用途 | 平台 |
|------|------|------|
| `vite.local.config.ts` | 前端配置 | 全平台 |
| `package.local.json` | 本地包配置 | 全平台 |
| `start-cross-platform.js` | 跨平台启动 | 全平台 |
| `start-full-windows.bat` | Windows启动 | Windows |
| `start-linux.sh` | Linux启动 | Linux/macOS |

---

## 数据库配置

### PostgreSQL安装

#### Windows
1. 下载PostgreSQL: https://www.postgresql.org/download/windows/
2. 运行安装程序
3. 记住设置的密码

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS
```bash
brew install postgresql
brew services start postgresql
```

### 数据库初始化

```bash
# 创建数据库
createdb qianchuan_db

# 导入结构 (如果有database_schema.sql)
psql qianchuan_db < database_schema.sql

# 或使用数据库推送
npm run db:push
```

---

## 故障排除

### 常见问题

#### 1. 端口占用
```bash
# Windows - 查看端口占用
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Linux/macOS - 查看端口占用
lsof -i :3000
lsof -i :5000

# 终止进程
# Windows
taskkill /PID <进程ID> /F

# Linux/macOS
kill -9 <进程ID>
```

#### 2. Node.js版本问题
```bash
# 检查版本
node --version

# 如果版本过低，更新Node.js
# Windows: 重新下载安装
# Linux: 使用版本管理器
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

#### 3. 权限问题 (Linux/macOS)
```bash
# 给启动脚本执行权限
chmod +x start-linux.sh

# 如果npm权限问题
sudo chown -R $(whoami) ~/.npm
```

#### 4. 依赖安装失败
```bash
# 清除缓存
npm cache clean --force

# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install

# Windows删除命令
rmdir /s node_modules
del package-lock.json
npm install
```

#### 5. 数据库连接问题
- 检查PostgreSQL服务是否启动
- 验证数据库连接字符串
- 确认防火墙设置
- 检查数据库用户权限

---

## 开发指南

### 目录结构
```
qianchuan-teaching-system/
├── client/                    # 前端React应用
│   ├── src/
│   │   ├── components/        # UI组件
│   │   ├── pages/            # 页面组件
│   │   ├── hooks/            # 自定义钩子
│   │   └── lib/              # 工具库
├── server/                    # 后端Express服务
│   ├── routes.ts             # API路由
│   ├── storage.ts            # 数据存储
│   └── index.ts              # 服务器入口
├── shared/                    # 共享类型定义
│   └── schema.ts             # 数据库模式
└── 配置文件...
```

### 开发命令

```bash
# 安装依赖
npm install

# 开发模式 (跨平台)
node start-cross-platform.js

# 仅启动前端
npx vite --config vite.local.config.ts --port 3000

# 仅启动后端
npx cross-env PORT=5000 NODE_ENV=development tsx server/index.ts

# 构建生产版本
npm run build

# 数据库操作
npm run db:push
```

### 技术栈

#### 前端
- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Vite** - 构建工具
- **Wouter** - 路由管理
- **TanStack Query** - 状态管理

#### 后端
- **Node.js** - 运行时
- **Express** - Web框架
- **TypeScript** - 类型安全
- **Drizzle ORM** - 数据库ORM
- **PostgreSQL** - 数据库

---

## 生产部署

### 构建应用
```bash
npm run build
```

### 使用PM2管理进程
```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs
```

### Docker部署 (可选)
```dockerfile
# 创建Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 许可证与支持

- **许可证**: MIT License
- **技术支持**: 参考项目文档
- **问题反馈**: GitHub Issues
- **更新日志**: CHANGELOG.md

---

**注意**: 本系统是巨量千川广告平台的教学版本，专门为电商直播推广教学设计，帮助学生理解和掌握数字营销的实际操作流程。