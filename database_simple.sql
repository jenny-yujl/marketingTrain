-- ================================================
-- 巨量千川系统 - 简化版MySQL建表语句
-- 要求MySQL版本: 5.0+ (使用TEXT和TINYINT兼容更多版本)
-- ================================================

-- 版本检查
SELECT VERSION() as mysql_version;

-- 产品表
CREATE TABLE `products` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `image` VARCHAR(500) NOT NULL,
    `original_price` DECIMAL(10, 2) NOT NULL,
    `current_price` DECIMAL(10, 2) NOT NULL,
    `category` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 广告活动表
CREATE TABLE `campaigns` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `marketing_goal` VARCHAR(100) NOT NULL,
    `optimization_target` VARCHAR(100) NOT NULL,
    `priority` VARCHAR(50) NOT NULL,
    `promotion_scenario` VARCHAR(100) NOT NULL,
    `placements` TEXT NOT NULL,
    `device_types` TEXT NOT NULL,
    `product_id` INT NULL,
    `original_price` DECIMAL(10, 2) NULL,
    `current_price` DECIMAL(10, 2) NULL,
    `has_time_limited_discount` TINYINT(1) DEFAULT 0,
    `discount_percentage` INT DEFAULT 0,
    `has_full_reduction` TINYINT(1) DEFAULT 0,
    `full_reduction_threshold` DECIMAL(10, 2) NULL,
    `full_reduction_amount` DECIMAL(10, 2) NULL,
    `age_range` VARCHAR(50) NOT NULL,
    `gender` VARCHAR(20) NOT NULL,
    `location` VARCHAR(100) NOT NULL,
    `interests` TEXT NOT NULL,
    `behaviors` TEXT NOT NULL,
    `campaign_type` VARCHAR(100) NOT NULL,
    `start_time` TIMESTAMP NULL,
    `end_time` TIMESTAMP NULL,
    `total_budget` DECIMAL(10, 2) NOT NULL,
    `daily_budget` DECIMAL(10, 2) NOT NULL,
    `bidding_strategy` VARCHAR(100) NOT NULL,
    `click_bid` DECIMAL(10, 2) NOT NULL,
    `weekly_schedule` TEXT NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'draft',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入示例产品
INSERT INTO `products` VALUES
(1, '直播补光灯', '专业直播补光设备', '/images/light.jpg', 299.00, 199.00, '直播设备'),
(2, '高清摄像头', '1080P高清直播摄像头', '/images/camera.jpg', 599.00, 399.00, '直播设备'),
(3, '专业麦克风', '电容式直播麦克风', '/images/mic.jpg', 399.00, 299.00, '音频设备');

-- 插入示例活动
INSERT INTO `campaigns` (`name`, `marketing_goal`, `optimization_target`, `priority`, `promotion_scenario`, `product_id`, `original_price`, `current_price`, `age_range`, `gender`, `location`, `campaign_type`, `total_budget`, `daily_budget`, `bidding_strategy`, `click_bid`) VALUES
('双十一促销', '商品推广', '转化量', '高', '直播间推广', 1, 299.00, 199.00, '18-35', '不限', '全国', '商品推广', 10000.00, 500.00, '最低成本', 1.50);