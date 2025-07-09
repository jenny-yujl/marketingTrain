-- Database Schema for Advertising Campaign Management System
-- Generated from PostgreSQL database structure
-- 
-- This file contains the complete database schema including:
-- - Table definitions
-- - Primary keys
-- - Default values
-- - Sample data

-- =====================================================
-- CAMPAIGNS TABLE
-- =====================================================
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  marketing_goal TEXT NOT NULL,
  optimization_target TEXT NOT NULL,
  priority TEXT NOT NULL,
  promotion_scenario TEXT NOT NULL,
  placements JSONB NOT NULL DEFAULT '[]'::jsonb,
  device_types JSONB NOT NULL DEFAULT '[]'::jsonb,
  product_id INTEGER,
  original_price DECIMAL(10,2),
  current_price DECIMAL(10,2),
  has_time_limited_discount BOOLEAN DEFAULT false,
  discount_percentage INTEGER DEFAULT 0,
  has_full_reduction BOOLEAN DEFAULT false,
  full_reduction_threshold DECIMAL(10,2),
  full_reduction_amount DECIMAL(10,2),
  age_range TEXT NOT NULL,
  gender TEXT NOT NULL,
  location TEXT NOT NULL,
  interests JSONB NOT NULL DEFAULT '[]'::jsonb,
  behaviors JSONB NOT NULL DEFAULT '[]'::jsonb,
  campaign_type TEXT NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  total_budget DECIMAL(10,2) NOT NULL,
  daily_budget DECIMAL(10,2) NOT NULL,
  bidding_strategy TEXT NOT NULL,
  click_bid DECIMAL(10,2) NOT NULL,
  weekly_schedule JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  current_price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL
);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample products
INSERT INTO products (name, description, image, original_price, current_price, category)
VALUES 
  (
    '高端护肤套装', 
    '包含洁面、水、乳、精华四件套', 
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200', 
    399.00, 
    299.00, 
    '美妆护肤'
  ),
  (
    '智能运动手表', 
    '支持多种运动模式，健康监测', 
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200', 
    1599.00, 
    1299.00, 
    '数码产品'
  ),
  (
    '无线蓝牙耳机', 
    '降噪功能，超长续航', 
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200', 
    799.00, 
    599.00, 
    '数码产品'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- ADDITIONAL CONSTRAINTS AND INDEXES (Optional)
-- =====================================================

-- Add foreign key constraint (optional, depends on your business logic)
-- ALTER TABLE campaigns ADD CONSTRAINT fk_campaigns_product_id 
--   FOREIGN KEY (product_id) REFERENCES products(id);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_product_id ON campaigns(product_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- =====================================================
-- USAGE NOTES
-- =====================================================
-- 
-- 1. JSONB columns (placements, device_types, interests, behaviors, weekly_schedule) 
--    store arrays of strings or booleans as JSON
--
-- 2. DECIMAL columns use precision 10 and scale 2 for monetary values
--
-- 3. The campaigns table supports the complete advertising campaign workflow:
--    - Marketing goals and optimization targets
--    - Product associations and pricing
--    - User targeting (age, gender, location, interests, behaviors)
--    - Budget and scheduling management
--    - Campaign status tracking
--
-- 4. To restore this schema:
--    psql -U username -d database_name -f database_schema.sql
--
-- 5. To backup current data:
--    pg_dump -U username -d database_name > backup.sql