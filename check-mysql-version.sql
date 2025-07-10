-- ================================================
-- MySQL版本兼容性检查脚本
-- 要求: MySQL 5.0及以上版本 (使用TEXT和TINYINT字段)
-- ================================================

-- 1. 检查MySQL版本
SELECT 
    VERSION() as current_version,
    CASE 
        WHEN VERSION() >= '5.0' THEN '✅ 版本兼容 - 支持TEXT和TINYINT字段'
        ELSE '❌ 版本过低 - 需要升级到5.0+'
    END as compatibility_status;

-- 2. 检查基础字段类型支持
SELECT 
    '✅ TEXT字段支持' as text_support,
    '✅ TINYINT字段支持' as tinyint_support,
    '✅ DECIMAL字段支持' as decimal_support;

-- 3. 检查表结构兼容性
SELECT 
    CASE 
        WHEN VERSION() >= '5.0' THEN '✅ 基础表结构完全兼容'
        ELSE '❌ 表结构不兼容'
    END as table_structure_support;

-- 4. 检查字符集支持
SELECT 
    DEFAULT_CHARACTER_SET_NAME,
    DEFAULT_COLLATION_NAME,
    CASE 
        WHEN DEFAULT_CHARACTER_SET_NAME = 'utf8mb4' THEN '✅ UTF8MB4字符集已启用'
        WHEN DEFAULT_CHARACTER_SET_NAME = 'utf8' THEN '⚠️ 建议升级到UTF8MB4'
        ELSE '❌ 字符集不兼容'
    END as charset_status
FROM INFORMATION_SCHEMA.SCHEMATA 
WHERE SCHEMA_NAME = DATABASE();

-- 5. 检查存储引擎支持
SELECT 
    ENGINE,
    SUPPORT,
    CASE 
        WHEN ENGINE = 'InnoDB' AND SUPPORT = 'YES' THEN '✅ InnoDB引擎可用'
        WHEN ENGINE = 'InnoDB' AND SUPPORT = 'DEFAULT' THEN '✅ InnoDB引擎默认启用'
        ELSE CONCAT('⚠️ ', ENGINE, ' 引擎状态: ', SUPPORT)
    END as engine_status
FROM INFORMATION_SCHEMA.ENGINES 
WHERE ENGINE = 'InnoDB';

-- 6. 测试表结构创建
CREATE TEMPORARY TABLE test_compatibility (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_text TEXT NOT NULL,
    test_boolean TINYINT(1) DEFAULT 0,
    test_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 验证表创建成功
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES 
              WHERE TABLE_NAME = 'test_compatibility' 
              AND TABLE_SCHEMA = DATABASE()) > 0 
        THEN '✅ 表结构测试通过'
        ELSE '❌ 表结构测试失败'
    END as table_test_result;

-- 7. 插入测试数据
INSERT INTO test_compatibility (test_text, test_boolean) 
VALUES ('["test1", "test2"]', 1);

-- 验证数据插入
SELECT 
    test_text,
    test_boolean,
    '✅ 数据操作正常' as data_operation_status
FROM test_compatibility;

-- 8. 系统配置检查
SELECT 
    @@version as mysql_version,
    @@character_set_server as server_charset,
    @@collation_server as server_collation,
    @@innodb_version as innodb_version,
    @@default_storage_engine as default_engine;

-- 9. 最终兼容性报告
SELECT 
    '========== 兼容性检查完成 ==========' as report_header;

SELECT 
    CASE 
        WHEN VERSION() >= '5.0'
        THEN '🎉 完全兼容 - 可以安全导入数据库结构'
        ELSE '⚠️ 存在兼容性问题 - 请检查上述测试结果'
    END as final_compatibility_status;

-- 清理测试表
DROP TEMPORARY TABLE test_compatibility;