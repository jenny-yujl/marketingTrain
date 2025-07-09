import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  marketingGoal: text("marketing_goal").notNull(),
  optimizationTarget: text("optimization_target").notNull(),
  priority: text("priority").notNull(),
  promotionScenario: text("promotion_scenario").notNull(),
  placements: jsonb("placements").$type<string[]>().notNull().default([]),
  deviceTypes: jsonb("device_types").$type<string[]>().notNull().default([]),
  productId: integer("product_id"),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }),
  hasTimeLimitedDiscount: boolean("has_time_limited_discount").default(false),
  discountPercentage: integer("discount_percentage").default(0),
  hasFullReduction: boolean("has_full_reduction").default(false),
  fullReductionThreshold: decimal("full_reduction_threshold", { precision: 10, scale: 2 }),
  fullReductionAmount: decimal("full_reduction_amount", { precision: 10, scale: 2 }),
  ageRange: text("age_range").notNull(),
  gender: text("gender").notNull(),
  location: text("location").notNull(),
  interests: jsonb("interests").$type<string[]>().notNull().default([]),
  behaviors: jsonb("behaviors").$type<string[]>().notNull().default([]),
  campaignType: text("campaign_type").notNull(),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  totalBudget: decimal("total_budget", { precision: 10, scale: 2 }).notNull(),
  dailyBudget: decimal("daily_budget", { precision: 10, scale: 2 }).notNull(),
  biddingStrategy: text("bidding_strategy").notNull(),
  clickBid: decimal("click_bid", { precision: 10, scale: 2 }).notNull(),
  weeklySchedule: jsonb("weekly_schedule").$type<boolean[]>().notNull().default([]),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
