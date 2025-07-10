import { mysqlTable, text, varchar, int, tinyint, timestamp, decimal } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const campaigns = mysqlTable("campaigns", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  marketingGoal: varchar("marketing_goal", { length: 100 }).notNull(),
  optimizationTarget: varchar("optimization_target", { length: 100 }).notNull(),
  priority: varchar("priority", { length: 50 }).notNull(),
  promotionScenario: varchar("promotion_scenario", { length: 100 }).notNull(),
  placements: text("placements").notNull(), // JSON格式字符串
  deviceTypes: text("device_types").notNull(), // JSON格式字符串
  productId: int("product_id"),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }),
  hasTimeLimitedDiscount: tinyint("has_time_limited_discount").default(0),
  discountPercentage: int("discount_percentage").default(0),
  hasFullReduction: tinyint("has_full_reduction").default(0),
  fullReductionThreshold: decimal("full_reduction_threshold", { precision: 10, scale: 2 }),
  fullReductionAmount: decimal("full_reduction_amount", { precision: 10, scale: 2 }),
  ageRange: varchar("age_range", { length: 50 }).notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  interests: text("interests").notNull(), // JSON格式字符串
  behaviors: text("behaviors").notNull(), // JSON格式字符串
  campaignType: varchar("campaign_type", { length: 100 }).notNull(),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  totalBudget: decimal("total_budget", { precision: 10, scale: 2 }).notNull(),
  dailyBudget: decimal("daily_budget", { precision: 10, scale: 2 }).notNull(),
  biddingStrategy: varchar("bidding_strategy", { length: 100 }).notNull(),
  clickBid: decimal("click_bid", { precision: 10, scale: 2 }).notNull(),
  weeklySchedule: text("weekly_schedule").notNull(), // JSON格式字符串
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = mysqlTable("products", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 500 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // 将TEXT字段转换为JSON数组处理
  placements: z.union([z.array(z.string()), z.string()]).transform(val => 
    typeof val === 'string' ? val : JSON.stringify(val)
  ),
  deviceTypes: z.union([z.array(z.string()), z.string()]).transform(val => 
    typeof val === 'string' ? val : JSON.stringify(val)
  ),
  interests: z.union([z.array(z.string()), z.string()]).transform(val => 
    typeof val === 'string' ? val : JSON.stringify(val)
  ),
  behaviors: z.union([z.array(z.string()), z.string()]).transform(val => 
    typeof val === 'string' ? val : JSON.stringify(val)
  ),
  weeklySchedule: z.union([z.array(z.boolean()), z.string()]).transform(val => 
    typeof val === 'string' ? val : JSON.stringify(val)
  ),
  // 将TINYINT字段转换为布尔值处理
  hasTimeLimitedDiscount: z.union([z.boolean(), z.number()]).transform(val => 
    typeof val === 'boolean' ? (val ? 1 : 0) : val
  ),
  hasFullReduction: z.union([z.boolean(), z.number()]).transform(val => 
    typeof val === 'boolean' ? (val ? 1 : 0) : val
  ),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
