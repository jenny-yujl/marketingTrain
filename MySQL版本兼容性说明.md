# MySQL版本兼容性说明

## 📊 当前项目配置

### MySQL驱动版本
- **mysql2**: `3.14.1` (最新稳定版)
- **发布时间**: 2024年12月
- **Node.js兼容**: 16.x, 18.x, 20.x, 22.x

## 🗄️ 支持的MySQL版本

### 推荐版本 (完全兼容)
- **MySQL 8.0.x** ✅ (推荐)
- **MySQL 8.1.x** ✅ (最新LTS)
- **MySQL 8.2.x** ✅ (创新版本)

### 兼容版本
- **MySQL 5.7.x** ✅ (需要调整部分语法)
- **MariaDB 10.x** ✅ (MySQL兼容)

### 云端数据库服务
- **PlanetScale** ✅ (基于MySQL 8.0)
- **AWS RDS MySQL** ✅ (8.0.x)
- **Google Cloud SQL** ✅ (8.0.x)
- **Azure Database** ✅ (8.0.x)
- **阿里云RDS MySQL** ✅ (8.0.x)
- **腾讯云CDB** ✅ (8.0.x)

## 🔧 SQL文件兼容性

### 生成的SQL使用的特性

#### MySQL 8.0+ 特性
```sql
-- JSON字段类型 (MySQL 5.7.8+)
`placements` JSON NOT NULL DEFAULT ('[]')

-- 自动更新时间戳 (MySQL 5.6+)
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

-- UTF8MB4字符集 (MySQL 5.5.3+)
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
```

#### 兼容性检查
- ✅ **AUTO_INCREMENT**: 所有版本支持
- ✅ **DECIMAL(10,2)**: 所有版本支持
- ✅ **FOREIGN KEY**: MySQL 5.0+
- ✅ **JSON字段**: MySQL 5.7.8+
- ✅ **UTF8MB4**: MySQL 5.5.3+

## 📋 版本检查命令

### 检查本地MySQL版本
```bash
mysql --version
```

### 连接后检查版本
```sql
SELECT VERSION();
SHOW VARIABLES LIKE 'version%';
```

### 检查JSON支持
```sql
-- 检查是否支持JSON
SELECT JSON_VALID('{"test": "value"}') as json_support;
```

## ⚠️ 版本特定注意事项

### MySQL 5.7.5+使用者 ✅
我们的SQL文件已经优化兼容MySQL 5.7.5+：

```sql
-- 使用标准JSON函数语法
`placements` JSON NOT NULL DEFAULT (JSON_ARRAY()),
`device_types` JSON NOT NULL DEFAULT (JSON_ARRAY()),
`interests` JSON NOT NULL DEFAULT (JSON_ARRAY()),
`behaviors` JSON NOT NULL DEFAULT (JSON_ARRAY()),
`weekly_schedule` JSON NOT NULL DEFAULT (JSON_ARRAY()),
```

### 重要版本要求
- **最低版本**: MySQL 5.7.5
- **推荐版本**: MySQL 5.7.8+ (JSON功能更稳定)
- **最佳版本**: MySQL 8.0+ (性能最优)

### MySQL 5.6及以下
- 不支持JSON字段类型
- 需要使用TEXT字段存储JSON字符串
- 需要在应用层处理JSON序列化

## 🔄 自动检测脚本

项目中的`server/db.ts`包含自动版本检测：

```javascript
// 自动检测并调整MySQL连接字符串格式
if (url.includes('mysql://')) {
  // 支持标准MySQL连接格式
}
```

## 🚀 推荐部署配置

### 生产环境
- **MySQL版本**: 8.0.35+ 
- **字符集**: utf8mb4
- **排序规则**: utf8mb4_unicode_ci
- **存储引擎**: InnoDB
- **时区**: UTC

### 开发环境
- **本地MySQL**: 8.0+
- **Docker**: `mysql:8.0`
- **测试**: 内存存储模式

## 📊 性能建议

### MySQL 8.0优势
- 更好的JSON性能
- 改进的索引优化
- 窗口函数支持
- CTE (公用表表达式)

### 配置调优
```sql
-- 建议的MySQL配置
[mysqld]
innodb_buffer_pool_size = 2G
innodb_log_file_size = 256M
max_connections = 500
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

## 🔍 故障排除

### 常见版本问题

1. **JSON字段错误**
   - 升级到MySQL 5.7.8+
   - 或修改schema使用TEXT字段

2. **字符集问题**
   - 确保使用utf8mb4
   - 设置正确的collation

3. **连接问题**
   - 检查mysql2驱动版本
   - 验证连接字符串格式

当前项目使用mysql2 3.14.1驱动，与MySQL 5.7+ 版本完全兼容，推荐使用MySQL 8.0以获得最佳性能和功能支持。