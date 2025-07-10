-- ================================================
-- 巨量千川直播推广教学系统 MySQL 数据库结构
-- 生成时间: 2025-01-09
-- 版本: 1.0
-- 要求MySQL版本: 5.7.5+ (使用TEXT和TINYINT保证最大兼容性)
-- ================================================

-- 检查MySQL版本兼容性
SELECT 
    CASE 
        WHEN VERSION() >= '5.7.5' THEN '✅ MySQL版本兼容 - 使用TEXT和TINYINT字段'
        ELSE '❌ 需要MySQL 5.7.5或更高版本'
    END as version_check,
    VERSION() as current_version;

-- 创建数据库（如果需要）
-- CREATE DATABASE IF NOT EXISTS qianchuan_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE qianchuan_system;

-- ================================================
-- 产品表 (products)
-- 存储产品信息，包括名称、描述、价格等
-- ================================================

CREATE TABLE IF NOT EXISTS `products` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` TEXT NOT NULL COMMENT '产品名称',
    `description` TEXT NOT NULL COMMENT '产品描述',
    `image` TEXT NOT NULL COMMENT '产品图片URL',
    `original_price` DECIMAL(10, 2) NOT NULL COMMENT '原价',
    `current_price` DECIMAL(10, 2) NOT NULL COMMENT '现价',
    `category` TEXT NOT NULL COMMENT '产品分类'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品信息表';

-- ================================================
-- 广告活动表 (campaigns)
-- 存储广告活动的所有配置信息
-- ================================================

CREATE TABLE IF NOT EXISTS `campaigns` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` TEXT NOT NULL COMMENT '活动名称',
    `marketing_goal` TEXT NOT NULL COMMENT '营销目标',
    `optimization_target` TEXT NOT NULL COMMENT '优化目标',
    `priority` TEXT NOT NULL COMMENT '优先级',
    `promotion_scenario` TEXT NOT NULL COMMENT '推广场景',
    `placements` TEXT NOT NULL DEFAULT '[]' COMMENT '投放位置数组(JSON格式字符串)',
    `device_types` TEXT NOT NULL DEFAULT '[]' COMMENT '设备类型数组(JSON格式字符串)',
    `product_id` INT NULL COMMENT '关联产品ID',
    `original_price` DECIMAL(10, 2) NULL COMMENT '产品原价',
    `current_price` DECIMAL(10, 2) NULL COMMENT '产品现价',
    `has_time_limited_discount` TINYINT(1) DEFAULT 0 COMMENT '是否有限时折扣(0=否,1=是)',
    `discount_percentage` INT DEFAULT 0 COMMENT '折扣百分比',
    `has_full_reduction` TINYINT(1) DEFAULT 0 COMMENT '是否有满减(0=否,1=是)',
    `full_reduction_threshold` DECIMAL(10, 2) NULL COMMENT '满减门槛',
    `full_reduction_amount` DECIMAL(10, 2) NULL COMMENT '满减金额',
    `age_range` TEXT NOT NULL COMMENT '年龄范围',
    `gender` TEXT NOT NULL COMMENT '性别',
    `location` TEXT NOT NULL COMMENT '地理位置',
    `interests` TEXT NOT NULL DEFAULT '[]' COMMENT '兴趣标签数组(JSON格式字符串)',
    `behaviors` TEXT NOT NULL DEFAULT '[]' COMMENT '行为标签数组(JSON格式字符串)',
    `campaign_type` TEXT NOT NULL COMMENT '活动类型',
    `start_time` TIMESTAMP NULL COMMENT '开始时间',
    `end_time` TIMESTAMP NULL COMMENT '结束时间',
    `total_budget` DECIMAL(10, 2) NOT NULL COMMENT '总预算',
    `daily_budget` DECIMAL(10, 2) NOT NULL COMMENT '日预算',
    `bidding_strategy` TEXT NOT NULL COMMENT '出价策略',
    `click_bid` DECIMAL(10, 2) NOT NULL COMMENT '点击出价',
    `weekly_schedule` TEXT NOT NULL DEFAULT '[]' COMMENT '周时间安排数组(JSON格式字符串)',
    `status` TEXT NOT NULL DEFAULT 'draft' COMMENT '活动状态',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    -- 外键约束
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL,
    
    -- 索引
    INDEX `idx_product_id` (`product_id`),
    INDEX `idx_status` (`status`(10)),
    INDEX `idx_created_at` (`created_at`),
    INDEX `idx_campaign_type` (`campaign_type`(20))
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='广告活动表';

-- ================================================
-- 插入示例数据
-- ================================================

-- 插入示例产品数据
INSERT INTO `products` (`name`, `description`, `image`, `original_price`, `current_price`, `category`) VALUES
('直播专用补光灯', '专业直播补光设备，三色温可调，亮度无级调节', '/images/products/light.jpg', 299.00, 199.00, '直播设备'),
('高清直播摄像头', '1080P高清画质，自动对焦，内置降噪麦克风', '/images/products/camera.jpg', 599.00, 399.00, '直播设备'),
('专业直播麦克风', '电容式麦克风，高保真音质，支持实时监听', '/images/products/microphone.jpg', 399.00, 299.00, '音频设备'),
('直播背景布', '可折叠便携式背景布，多种颜色可选', '/images/products/backdrop.jpg', 99.00, 69.00, '直播配件'),
('美颜直播软件', '实时美颜滤镜，支持虚拟背景，一键直播', '/images/products/software.jpg', 299.00, 199.00, '直播软件');

-- 插入示例活动数据
INSERT INTO `campaigns` (`name`, `marketing_goal`, `optimization_target`, `priority`, `promotion_scenario`, `placements`, `device_types`, `product_id`, `original_price`, `current_price`, `has_time_limited_discount`, `discount_percentage`, `age_range`, `gender`, `location`, `interests`, `behaviors`, `campaign_type`, `total_budget`, `daily_budget`, `bidding_strategy`, `click_bid`, `weekly_schedule`, `status`) VALUES
('双十一直播设备促销', '商品推广', '转化量', '高', '直播间推广', '["直播间", "信息流"]', '["移动设备", "桌面设备"]', 1, 299.00, 199.00, 1, 33, '18-35', '不限', '一线城市', '["直播", "摄影", "科技数码"]', '["电商购物", "视频观看"]', '商品推广', 10000.00, 500.00, '最低成本', 1.50, '[1, 1, 1, 1, 1, 1, 1]', 'active'),
('直播间引流活动', '直播间引流', '直播间人数', '中', '视频推广', '["短视频", "信息流"]', '["移动设备"]', 2, 599.00, 399.00, 1, 33, '20-40', '不限', '全国', '["直播", "娱乐", "购物"]', '["视频观看", "直播互动"]', '直播推广', 5000.00, 200.00, '成本控制', 2.00, '[1, 1, 1, 1, 1, 0, 0]', 'active');

-- ================================================
-- 创建视图（可选）
-- ================================================

-- 活动详情视图（包含产品信息）
CREATE OR REPLACE VIEW `campaign_details` AS
SELECT 
    c.*,
    p.name as product_name,
    p.description as product_description,
    p.image as product_image,
    p.category as product_category
FROM `campaigns` c
LEFT JOIN `products` p ON c.product_id = p.id;

-- ================================================
-- 存储过程示例（可选）
-- ================================================

DELIMITER //

-- 获取活动统计信息
CREATE PROCEDURE `GetCampaignStats`()
BEGIN
    SELECT 
        COUNT(*) as total_campaigns,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_campaigns,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_campaigns,
        COUNT(CASE WHEN status = 'paused' THEN 1 END) as paused_campaigns,
        SUM(total_budget) as total_budget_sum,
        AVG(daily_budget) as avg_daily_budget
    FROM campaigns;
END //

-- 更新活动状态
CREATE PROCEDURE `UpdateCampaignStatus`(
    IN campaign_id INT,
    IN new_status VARCHAR(20)
)
BEGIN
    UPDATE campaigns 
    SET status = new_status, updated_at = CURRENT_TIMESTAMP 
    WHERE id = campaign_id;
END //

DELIMITER ;

-- ================================================
-- 索引优化建议
-- ================================================

-- 如果需要按时间范围查询活动，可以添加复合索引
-- ALTER TABLE campaigns ADD INDEX idx_time_range (start_time, end_time);

-- 如果需要按预算范围查询，可以添加索引
-- ALTER TABLE campaigns ADD INDEX idx_budget (total_budget, daily_budget);

-- ================================================
-- 数据库用户权限设置示例（可选）
-- ================================================

-- 创建应用专用用户
-- CREATE USER 'qianchuan_app'@'%' IDENTIFIED BY 'your_secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON qianchuan_system.* TO 'qianchuan_app'@'%';
-- FLUSH PRIVILEGES;

-- ================================================
-- 备份和恢复说明
-- ================================================

-- 备份数据库
-- mysqldump -u username -p qianchuan_system > qianchuan_backup.sql

-- 恢复数据库
-- mysql -u username -p qianchuan_system < qianchuan_backup.sql

-- ================================================
-- 完成
-- ================================================