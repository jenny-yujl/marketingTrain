# MySQL数据库使用指南

## 📁 生成的SQL文件

我为您生成了以下MySQL数据库文件：

### 1. database_mysql.sql (完整版)
- **用途**: 生产环境使用
- **MySQL版本**: 5.7.5+
- **包含**: 完整表结构、索引、注释、示例数据、存储过程、视图
- **特点**: 
  - 详细的中文注释
  - 性能优化索引
  - 外键约束
  - 示例存储过程
  - 数据库管理建议
  - 版本兼容性检查

### 2. database_simple.sql (简化版)  
- **用途**: 快速测试和开发
- **MySQL版本**: 5.7.5+
- **包含**: 基本表结构和示例数据
- **特点**: 
  - 精简的建表语句
  - 基础示例数据
  - 易于理解和修改

### 3. check-mysql-version.sql (版本检查)
- **用途**: 验证MySQL版本兼容性
- **功能**: 
  - 检查MySQL版本
  - 测试JSON功能
  - 验证字符集支持
  - 完整兼容性报告

## 🔧 使用步骤

### 1. 创建数据库
```sql
CREATE DATABASE qianchuan_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qianchuan_system;
```

### 2. 导入表结构
```bash
# 方法1: 使用完整版
mysql -u your_username -p qianchuan_system < database_mysql.sql

# 方法2: 使用简化版
mysql -u your_username -p qianchuan_system < database_simple.sql
```

### 3. 验证MySQL版本兼容性
```bash
# 运行版本检查脚本
mysql -u your_username -p your_database < check-mysql-version.sql
```

### 4. 验证导入
```sql
-- 检查表是否创建成功
SHOW TABLES;

-- 检查表结构
DESCRIBE products;
DESCRIBE campaigns;

-- 检查示例数据
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM campaigns;
```

## 🗂️ 数据库结构

### products 表（产品信息）
- `id`: 主键，自增
- `name`: 产品名称
- `description`: 产品描述
- `image`: 产品图片URL
- `original_price`: 原价
- `current_price`: 现价
- `category`: 产品分类

### campaigns 表（广告活动）
- `id`: 主键，自增
- `name`: 活动名称
- `marketing_goal`: 营销目标
- `optimization_target`: 优化目标
- `priority`: 优先级
- `promotion_scenario`: 推广场景
- `placements`: 投放位置（JSON数组）
- `device_types`: 设备类型（JSON数组）
- `product_id`: 关联产品ID（外键）
- `age_range`: 目标年龄范围
- `gender`: 目标性别
- `location`: 地理位置
- `interests`: 兴趣标签（JSON数组）
- `behaviors`: 行为标签（JSON数组）
- `campaign_type`: 活动类型
- `start_time`: 开始时间
- `end_time`: 结束时间
- `total_budget`: 总预算
- `daily_budget`: 日预算
- `bidding_strategy`: 出价策略
- `click_bid`: 点击出价
- `weekly_schedule`: 周时间安排（JSON数组）
- `status`: 活动状态
- `created_at`: 创建时间
- `updated_at`: 更新时间

## 🔗 连接配置

### 在项目中使用
更新您的 `MYSQL_DATABASE_URL` 环境变量：

```bash
# 本地MySQL
MYSQL_DATABASE_URL=mysql://username:password@localhost:3306/qianchuan_system

# 云端MySQL（如PlanetScale）
MYSQL_DATABASE_URL=mysql://username:password@host:3306/database_name
```

### 测试连接
```bash
# 使用项目的测试脚本
node scripts/setup-database.js
```

## 📊 示例查询

### 查看所有活跃活动
```sql
SELECT * FROM campaigns WHERE status = 'active';
```

### 查看活动和关联产品
```sql
SELECT c.name as campaign_name, p.name as product_name, c.total_budget
FROM campaigns c
LEFT JOIN products p ON c.product_id = p.id
ORDER BY c.created_at DESC;
```

### 统计不同状态的活动数量
```sql
SELECT status, COUNT(*) as count 
FROM campaigns 
GROUP BY status;
```

## 🛠️ 维护建议

### 备份数据库
```bash
mysqldump -u username -p qianchuan_system > backup_$(date +%Y%m%d).sql
```

### 定期优化
```sql
-- 分析表统计信息
ANALYZE TABLE campaigns, products;

-- 优化表
OPTIMIZE TABLE campaigns, products;
```

## 🔒 安全建议

1. **创建专用用户**:
```sql
CREATE USER 'qianchuan_app'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON qianchuan_system.* TO 'qianchuan_app'@'%';
```

2. **启用SSL连接**
3. **定期更新密码**
4. **限制IP访问**

## 🌐 云端部署推荐

- **PlanetScale**: 免费层，GitHub集成
- **AWS RDS**: 企业级，可扩展
- **DigitalOcean**: 简单易用
- **阿里云RDS**: 国内优化

选择云端服务后，将连接字符串配置到项目的环境变量中即可。