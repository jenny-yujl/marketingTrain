# GitHub 代码推送指南

## 📋 当前Git状态

- **仓库地址**: https://github.com/jenny-yujl/marketingTrain
- **用户配置**: jenny-yujl (1256923758@qq.com)
- **当前分支**: main
- **工作树状态**: 干净 (所有更改已提交)

## 🚀 推送代码到GitHub

### 检查当前状态
```bash
git status
git log --oneline -5  # 查看最近5次提交
```

### 如果有新的更改需要提交
```bash
# 添加所有更改
git add .

# 提交更改
git commit -m "feat: 修复本地部署ERR_INVALID_ARG_TYPE错误，完善MySQL数据库支持"

# 推送到GitHub
git push origin main
```

### 一键推送脚本
创建 `push-to-github.sh`:
```bash
#!/bin/bash

echo "🔄 准备推送代码到GitHub..."

# 检查Git状态
git status

# 添加所有更改
echo "📝 添加所有更改..."
git add .

# 检查是否有更改需要提交
if git diff --staged --quiet; then
    echo "ℹ️ 没有新的更改需要提交"
else
    echo "💾 提交更改..."
    git commit -m "update: $(date '+%Y-%m-%d %H:%M:%S') 更新项目代码"
fi

# 推送到GitHub
echo "🚀 推送到GitHub..."
git push origin main

echo "✅ 代码推送完成！"
echo "🌐 查看仓库: https://github.com/jenny-yujl/marketingTrain"
```

## 📦 项目当前包含的主要功能

### ✅ 已完成的功能
- 巨量千川直播推广管理系统
- MySQL数据库架构支持
- 内存存储作为fallback
- 本地部署解决方案
- 修复了ERR_INVALID_ARG_TYPE错误
- 自动MySQL连接字符串格式修正

### 📁 主要文件结构
```
├── client/               # 前端React应用
├── server/               # 后端Express服务器
│   ├── index.ts         # Replit环境服务器
│   ├── local.ts         # 本地部署服务器
│   ├── db.ts            # 数据库连接
│   └── storage.ts       # 存储抽象层
├── shared/schema.ts      # 数据库Schema
├── start-local.js        # 本地启动脚本
├── stop-local.sh         # 本地停止脚本
├── vite.local.config.ts  # 本地Vite配置
└── 文档文件/
    ├── README_DATABASE_SETUP.md
    ├── LOCAL_DEPLOYMENT.md
    └── 本地部署配置说明.md
```

## 🔧 推送前检查清单

- [ ] 确保所有敏感信息已排除(.gitignore)
- [ ] 测试本地部署功能正常
- [ ] 确认数据库连接配置无误
- [ ] 检查文档是否最新

## 🌐 GitHub仓库信息

- **仓库名**: marketingTrain
- **所有者**: jenny-yujl
- **可见性**: 公开
- **主分支**: main

## 📞 如果遇到问题

1. **认证问题**: 确保GitHub Token或SSH密钥配置正确
2. **推送被拒绝**: 先执行 `git pull origin main` 同步远程更改
3. **冲突解决**: 使用 `git merge` 或 `git rebase` 解决冲突

推送完成后，您的代码将在GitHub上可见，其他开发者可以克隆和贡献代码。