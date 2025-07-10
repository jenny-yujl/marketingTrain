# MySQL 5.7.5+ 兼容性说明（不使用JSON/BOOLEAN）

## 📋 设计原则

虽然MySQL 5.7.5+支持JSON和BOOLEAN字段类型，但为了确保最大兼容性和稳定性，我们采用以下设计策略：

### 🎯 字段类型选择

#### 1. 数组数据 → TEXT字段
**原因**: 避免JSON字段类型兼容性问题
**实现**: 使用TEXT存储JSON格式字符串

```sql
-- 投放位置数组
`placements` TEXT NOT NULL DEFAULT '[]' COMMENT '投放位置数组(JSON格式字符串)'

-- 示例数据
'["直播间", "信息流", "短视频"]'
```

#### 2. 布尔值 → TINYINT(1)
**原因**: TINYINT(1)在所有MySQL版本中表现一致
**实现**: 0表示false，1表示true

```sql
-- 是否有限时折扣
`has_time_limited_discount` TINYINT(1) DEFAULT 0 COMMENT '是否有限时折扣(0=否,1=是)'

-- 示例数据
0  -- 表示 false
1  -- 表示 true
```

## 🗂️ 完整字段映射

### campaigns表字段类型

| 字段名 | 数据类型 | 默认值 | 说明 |
|--------|----------|--------|------|
| `placements` | TEXT | '[]' | 投放位置数组(JSON字符串) |
| `device_types` | TEXT | '[]' | 设备类型数组(JSON字符串) |
| `interests` | TEXT | '[]' | 兴趣标签数组(JSON字符串) |
| `behaviors` | TEXT | '[]' | 行为标签数组(JSON字符串) |
| `weekly_schedule` | TEXT | '[]' | 周时间安排数组(JSON字符串) |
| `has_time_limited_discount` | TINYINT(1) | 0 | 是否有限时折扣 |
| `has_full_reduction` | TINYINT(1) | 0 | 是否有满减 |

## 💻 应用层数据处理

### JSON字符串处理示例

#### Node.js/JavaScript
```javascript
// 存储数组数据
const placements = ['直播间', '信息流'];
const placementsJson = JSON.stringify(placements);
// 结果: '["直播间", "信息流"]'

// 读取数组数据
const result = await db.query('SELECT placements FROM campaigns WHERE id = ?', [1]);
const placements = JSON.parse(result[0].placements);
// 结果: ['直播间', '信息流']
```

#### PHP
```php
// 存储数组数据
$placements = ['直播间', '信息流'];
$placementsJson = json_encode($placements, JSON_UNESCAPED_UNICODE);

// 读取数组数据
$result = mysqli_query($conn, "SELECT placements FROM campaigns WHERE id = 1");
$row = mysqli_fetch_assoc($result);
$placements = json_decode($row['placements'], true);
```

#### Python
```python
import json

# 存储数组数据
placements = ['直播间', '信息流']
placements_json = json.dumps(placements, ensure_ascii=False)

# 读取数组数据
cursor.execute("SELECT placements FROM campaigns WHERE id = %s", (1,))
result = cursor.fetchone()
placements = json.loads(result[0])
```

### 布尔值处理示例

```javascript
// 存储布尔值
const hasDiscount = true;
const hasDiscountInt = hasDiscount ? 1 : 0;

// 读取布尔值
const result = await db.query('SELECT has_time_limited_discount FROM campaigns WHERE id = ?', [1]);
const hasDiscount = result[0].has_time_limited_discount === 1;
```

## 🔍 数据查询示例

### 查询包含特定投放位置的活动
```sql
-- 查询包含"直播间"的活动
SELECT * FROM campaigns 
WHERE placements LIKE '%"直播间"%';

-- 使用正则表达式查询(MySQL 5.7+)
SELECT * FROM campaigns 
WHERE placements REGEXP '"直播间"';
```

### 查询启用折扣的活动
```sql
-- 查询有限时折扣的活动
SELECT * FROM campaigns 
WHERE has_time_limited_discount = 1;

-- 查询没有折扣的活动
SELECT * FROM campaigns 
WHERE has_time_limited_discount = 0;
```

### 统计分析查询
```sql
-- 统计不同投放位置的活动数量
SELECT 
    CASE 
        WHEN placements LIKE '%"直播间"%' THEN '直播间'
        WHEN placements LIKE '%"信息流"%' THEN '信息流'
        WHEN placements LIKE '%"短视频"%' THEN '短视频'
        ELSE '其他'
    END as placement_type,
    COUNT(*) as campaign_count
FROM campaigns
GROUP BY placement_type;

-- 统计启用折扣的活动比例
SELECT 
    SUM(has_time_limited_discount) as discount_campaigns,
    COUNT(*) as total_campaigns,
    ROUND(SUM(has_time_limited_discount) / COUNT(*) * 100, 2) as discount_percentage
FROM campaigns;
```

## ⚡ 性能优化建议

### 索引创建
```sql
-- 为布尔字段创建索引
CREATE INDEX idx_has_discount ON campaigns(has_time_limited_discount);
CREATE INDEX idx_has_reduction ON campaigns(has_full_reduction);

-- 为常用查询字段创建索引
CREATE INDEX idx_status ON campaigns(status);
CREATE INDEX idx_campaign_type ON campaigns(campaign_type);
```

### 全文搜索(MySQL 5.7+)
```sql
-- 为TEXT字段创建全文索引(可选)
ALTER TABLE campaigns ADD FULLTEXT(placements, interests, behaviors);

-- 使用全文搜索
SELECT * FROM campaigns 
WHERE MATCH(placements) AGAINST('直播间' IN NATURAL LANGUAGE MODE);
```

## 🔄 数据迁移脚本

如果从其他字段类型迁移：

```sql
-- 从JSON字段迁移到TEXT字段
UPDATE campaigns SET placements = JSON_UNQUOTE(placements) 
WHERE placements IS NOT NULL AND JSON_VALID(placements);

-- 从BOOLEAN字段迁移到TINYINT(1)
UPDATE campaigns SET has_time_limited_discount = CAST(has_time_limited_discount AS UNSIGNED);
```

## 📊 数据验证

### 验证JSON格式
```sql
-- 检查JSON格式是否正确(MySQL 5.7+)
SELECT id, placements, JSON_VALID(placements) as is_valid_json
FROM campaigns
WHERE JSON_VALID(placements) = 0;
```

### 验证布尔值范围
```sql
-- 检查TINYINT(1)值是否在正确范围
SELECT id, has_time_limited_discount
FROM campaigns
WHERE has_time_limited_discount NOT IN (0, 1);
```

这种设计确保了在MySQL 5.7.5+环境中的最大兼容性和稳定性，同时为应用层提供了清晰的数据处理接口。