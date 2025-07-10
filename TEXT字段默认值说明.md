# TEXT字段默认值限制说明

## ⚠️ MySQL字段类型限制

在MySQL中，以下字段类型不能设置默认值：
- `TEXT`
- `BLOB` 
- `GEOMETRY`
- `JSON` (MySQL 5.7+)

## 🔄 解决方案

### 数据库结构调整
移除了所有TEXT字段的默认值设置：

```sql
-- 修改前 (错误)
`placements` TEXT NOT NULL DEFAULT '[]'

-- 修改后 (正确)
`placements` TEXT NOT NULL
```

### 受影响的字段
以下字段移除了默认值：
- `placements` - 投放位置数组
- `device_types` - 设备类型数组  
- `interests` - 兴趣标签数组
- `behaviors` - 行为标签数组
- `weekly_schedule` - 周时间安排数组

## 💻 应用层处理

### 1. 插入数据时必须提供值
```sql
-- 必须为TEXT字段提供值
INSERT INTO campaigns (
    name, placements, device_types, interests, behaviors, weekly_schedule, ...
) VALUES (
    '活动名称', 
    '[]',           -- 空数组
    '["移动设备"]',   -- 设备类型
    '["直播"]',      -- 兴趣标签
    '["观看"]',      -- 行为标签
    '[1,1,1,1,1,0,0]', -- 周安排
    ...
);
```

### 2. 应用代码中的默认值处理

#### Node.js/JavaScript示例
```javascript
// 在应用层提供默认值
function createCampaign(data) {
    const campaign = {
        name: data.name,
        placements: data.placements || '[]',
        device_types: data.device_types || '[]',
        interests: data.interests || '[]',
        behaviors: data.behaviors || '[]',
        weekly_schedule: data.weekly_schedule || '[1,1,1,1,1,1,1]',
        // ... 其他字段
    };
    
    return db.query('INSERT INTO campaigns SET ?', campaign);
}
```

#### PHP示例
```php
function createCampaign($data) {
    $campaign = [
        'name' => $data['name'],
        'placements' => $data['placements'] ?? '[]',
        'device_types' => $data['device_types'] ?? '[]',
        'interests' => $data['interests'] ?? '[]',
        'behaviors' => $data['behaviors'] ?? '[]',
        'weekly_schedule' => $data['weekly_schedule'] ?? '[1,1,1,1,1,1,1]'
    ];
    
    // 执行插入
}
```

#### Python示例
```python
def create_campaign(data):
    campaign = {
        'name': data['name'],
        'placements': data.get('placements', '[]'),
        'device_types': data.get('device_types', '[]'),
        'interests': data.get('interests', '[]'),
        'behaviors': data.get('behaviors', '[]'),
        'weekly_schedule': data.get('weekly_schedule', '[1,1,1,1,1,1,1]')
    }
    
    # 执行插入
```

### 3. ORM框架处理

#### Drizzle ORM
```typescript
// 在schema定义中不设置默认值
export const campaigns = mysqlTable("campaigns", {
    // ... 其他字段
    placements: text("placements").notNull(),
    deviceTypes: text("device_types").notNull(),
    interests: text("interests").notNull(),
    behaviors: text("behaviors").notNull(),
    weeklySchedule: text("weekly_schedule").notNull(),
});

// 在插入时提供默认值
const defaultCampaign = {
    placements: '[]',
    deviceTypes: '[]', 
    interests: '[]',
    behaviors: '[]',
    weeklySchedule: '[1,1,1,1,1,1,1]'
};
```

## 🔧 数据验证

### 检查空值
```sql
-- 检查TEXT字段是否为空
SELECT id, name FROM campaigns 
WHERE placements = '' OR placements IS NULL;

-- 检查JSON格式是否正确(MySQL 5.7+)
SELECT id, name, placements 
FROM campaigns 
WHERE JSON_VALID(placements) = 0;
```

### 数据修复
```sql
-- 为空的TEXT字段设置默认值
UPDATE campaigns 
SET placements = '[]' 
WHERE placements = '' OR placements IS NULL;

UPDATE campaigns 
SET device_types = '[]' 
WHERE device_types = '' OR device_types IS NULL;

UPDATE campaigns 
SET interests = '[]' 
WHERE interests = '' OR interests IS NULL;

UPDATE campaigns 
SET behaviors = '[]' 
WHERE behaviors = '' OR behaviors IS NULL;

UPDATE campaigns 
SET weekly_schedule = '[1,1,1,1,1,1,1]' 
WHERE weekly_schedule = '' OR weekly_schedule IS NULL;
```

## 📋 最佳实践

### 1. 应用层验证
```javascript
function validateCampaignData(data) {
    // 确保必需的TEXT字段有值
    const textFields = ['placements', 'device_types', 'interests', 'behaviors', 'weekly_schedule'];
    
    textFields.forEach(field => {
        if (!data[field]) {
            data[field] = '[]'; // 提供默认空数组
        }
        
        // 验证JSON格式
        try {
            JSON.parse(data[field]);
        } catch (e) {
            throw new Error(`${field} must be valid JSON`);
        }
    });
    
    return data;
}
```

### 2. 数据库触发器(可选)
```sql
-- 创建触发器自动处理空值
DELIMITER //
CREATE TRIGGER campaign_before_insert 
BEFORE INSERT ON campaigns 
FOR EACH ROW 
BEGIN
    IF NEW.placements = '' OR NEW.placements IS NULL THEN
        SET NEW.placements = '[]';
    END IF;
    
    IF NEW.device_types = '' OR NEW.device_types IS NULL THEN
        SET NEW.device_types = '[]';
    END IF;
    
    -- 为其他TEXT字段添加类似逻辑
END //
DELIMITER ;
```

### 3. 前端表单处理
```javascript
// 表单提交前确保TEXT字段有值
function submitCampaign(formData) {
    const processedData = {
        ...formData,
        placements: formData.placements || '[]',
        device_types: formData.device_types || '[]',
        interests: formData.interests || '[]',
        behaviors: formData.behaviors || '[]',
        weekly_schedule: formData.weekly_schedule || '[1,1,1,1,1,1,1]'
    };
    
    return api.createCampaign(processedData);
}
```

通过这些方法，我们可以在应用层妥善处理TEXT字段的默认值，确保数据完整性和一致性。