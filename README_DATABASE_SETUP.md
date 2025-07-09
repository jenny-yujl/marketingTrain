# MySQL数据库设置指南

## 当前问题

您的MYSQL_DATABASE_URL格式不正确：

**错误格式：**
```
mysql://root:root:mysql-v1:3306/pgdata
```

**正确格式：**
```
mysql://root:root@mysql-v1:3306/pgdata
```

**关键差异：** 密码后面应该用 `@` 而不是 `:`

## 修复步骤

### 方法1：修正现有连接字符串

1. 打开Replit左侧的 🔒 "Secrets" 面板
2. 找到 `MYSQL_DATABASE_URL`
3. 将值改为：`mysql://root:root@mysql-v1:3306/pgdata`
4. 点击保存
5. 重启应用

### 方法2：获取新的MySQL数据库

如果您需要新的MySQL数据库，推荐以下服务：

#### PlanetScale（推荐 - 有免费层）
1. 访问 https://planetscale.com/
2. 注册账户
3. 创建新数据库
4. 获取连接字符串
5. 在Secrets中设置MYSQL_DATABASE_URL

#### Railway
1. 访问 https://railway.app/
2. 创建项目，添加MySQL服务
3. 获取连接URL

#### 本地MySQL（如果您有）
```
mysql://root:您的密码@localhost:3306/数据库名
```

## 验证连接

修复后运行验证脚本：
```bash
node scripts/setup-database.js
```

## 成功标志

修复后重启应用，您应该看到：
- "检测到MySQL连接字符串格式错误，正在自动修复..."
- "修复后的连接字符串格式正确"
- "正在连接MySQL数据库..."
- "✅ MySQL数据库连接成功！"

## 当前状态

✅ 应用正常运行（使用内存存储）
✅ MySQL架构已准备就绪
❌ 需要修正连接字符串格式

修正连接字符串后，数据将自动保存到MySQL数据库。