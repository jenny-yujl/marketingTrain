# 本地服务器部署指南

## 环境要求

- Node.js 18+ 
- npm 或 yarn
- Git

## 本地部署步骤

### 1. 下载项目代码

从Replit下载或复制所有项目文件到本地目录。

### 2. 安装依赖

```bash
npm install
```

### 3. 修改配置文件

#### 修改 vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist/public",
    rollupOptions: {
      input: "./client/index.html",
    },
  },
});
```

#### 修改 package.json 添加本地脚本

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "dev:frontend": "vite --config vite.config.ts",
    "dev:backend": "NODE_ENV=development tsx server/index.ts --local",
    "build": "vite build && tsc -p tsconfig.json --outDir dist",
    "start": "node dist/index.js",
    "local": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\""
  }
}
```

### 4. 修改服务器配置

创建 `server/local.ts`:

```typescript
import express from "express";
import path from "path";
import { registerRoutes } from "./routes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static("dist/public"));

// API routes
registerRoutes(app);

// Serve frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 5. 安装额外依赖

```bash
npm install concurrently --save-dev
```

### 6. 运行项目

#### 开发模式（推荐）
```bash
npm run local
```
这会同时启动前端（端口3000）和后端（端口5000）

#### 生产模式
```bash
npm run build
npm start
```

### 7. 访问应用

- 开发模式：http://localhost:3000
- 生产模式：http://localhost:5000

## 数据库配置（可选）

如果需要持久化数据，可以配置PostgreSQL：

1. 安装PostgreSQL
2. 创建数据库
3. 设置环境变量：
   ```bash
   export DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
   ```
4. 运行迁移：
   ```bash
   npx drizzle-kit push:pg
   ```

## 注意事项

1. 确保端口3000和5000未被占用
2. 如果使用防火墙，需要开放相应端口
3. 生产环境建议使用PM2或类似工具管理进程
4. 可以使用nginx反向代理来提高性能

## 故障排除

### 端口占用
```bash
# 查看端口占用
lsof -i :3000
lsof -i :5000

# 杀死占用进程
kill -9 <PID>
```

### 权限问题
```bash
# 给执行权限
chmod +x node_modules/.bin/*
```

### 模块找不到
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```