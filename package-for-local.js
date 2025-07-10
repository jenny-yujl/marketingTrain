#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('📦 准备本地部署包...\n');

// 创建本地部署包的package.json
const localPackageJson = {
  "name": "qianchuan-teaching-system",
  "version": "1.0.0",
  "description": "巨量千川直播推广教学系统",
  "scripts": {
    "install-deps": "npm install",
    "dev": "node start-local.js",
    "build": "vite build --config vite.local.config.ts",
    "start": "node server-production.js",
    "local": "node start-local.js"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-aspect-ratio": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-context-menu": "^2.1.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-hover-card": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-menubar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-toggle": "^1.0.3",
    "@radix-ui/react-toggle-group": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@tanstack/react-query": "^5.8.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "cmdk": "^0.2.0",
    "date-fns": "^2.30.0",
    "drizzle-orm": "^0.29.0",
    "drizzle-zod": "^0.5.1",
    "embla-carousel-react": "^8.0.0-rc19",
    "express": "^4.18.2",
    "framer-motion": "^10.16.4",
    "input-otp": "^1.2.4",
    "lucide-react": "^0.294.0",
    "next-themes": "^0.2.1",
    "react": "^18.2.0",
    "react-day-picker": "^8.9.1",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.47.0",
    "react-icons": "^4.11.0",
    "react-resizable-panels": "^0.0.55",
    "recharts": "^2.8.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.0",
    "wouter": "^2.12.1",
    "zod": "^3.22.4",
    "zod-validation-error": "^1.5.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.8.10",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.16",
    "drizzle-kit": "^0.20.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "tsx": "^4.1.2",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
};

// 写入本地package.json
fs.writeFileSync('package.local.json', JSON.stringify(localPackageJson, null, 2));

console.log('✅ 已创建 package.local.json');
console.log('📋 本地部署文件已准备完成');
console.log('\n🚀 本地部署步骤：');
console.log('1. 将所有文件复制到本地目录');
console.log('2. 重命名 package.local.json 为 package.json');
console.log('3. 运行: npm install');
console.log('4. 运行: npm run dev');
console.log('5. 访问: http://localhost:3000');
console.log('\n📖 详细说明请查看 LOCAL_DEPLOYMENT.md 文件');