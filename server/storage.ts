import { campaigns, products, type Campaign, type Product, type InsertCampaign, type InsertProduct } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Campaign operations
  getCampaign(id: number): Promise<Campaign | undefined>;
  getCampaigns(): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<InsertCampaign>): Promise<Campaign>;
  deleteCampaign(id: number): Promise<void>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
}

export class DatabaseStorage implements IStorage {
  // Database storage will be implemented when MySQL is configured
  async getCampaign(id: number): Promise<Campaign | undefined> {
    throw new Error("Database storage not available - using memory storage instead");
  }

  async getCampaigns(): Promise<Campaign[]> {
    throw new Error("Database storage not available - using memory storage instead");
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    throw new Error("Database storage not available - using memory storage instead");
  }

  async updateCampaign(id: number, updateData: Partial<InsertCampaign>): Promise<Campaign> {
    throw new Error("Database storage not available - using memory storage instead");
  }

  async deleteCampaign(id: number): Promise<void> {
    throw new Error("Database storage not available - using memory storage instead");
  }

  async getProduct(id: number): Promise<Product | undefined> {
    throw new Error("Database storage not available - using memory storage instead");
  }

  async getProducts(): Promise<Product[]> {
    throw new Error("Database storage not available - using memory storage instead");
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    throw new Error("Database storage not available - using memory storage instead");
  }
}

export class MemStorage implements IStorage {
  private campaigns: Map<number, Campaign>;
  private products: Map<number, Product>;
  private currentCampaignId: number;
  private currentProductId: number;

  constructor() {
    this.campaigns = new Map();
    this.products = new Map();
    this.currentCampaignId = 1;
    this.currentProductId = 1;
    
    // Initialize with sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "高端护肤套装",
        description: "包含洁面、水、乳、精华四件套",
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
        originalPrice: "399.00",
        currentPrice: "299.00",
        category: "美妆护肤",
      },
      {
        name: "智能运动手表",
        description: "支持多种运动模式，健康监测",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
        originalPrice: "1599.00",
        currentPrice: "1299.00",
        category: "数码产品",
      },
      {
        name: "无线蓝牙耳机",
        description: "降噪功能，超长续航",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
        originalPrice: "799.00",
        currentPrice: "599.00",
        category: "数码产品",
      },
    ];

    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  // Campaign operations
  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.currentCampaignId++;
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      productId: insertCampaign.productId || null,
      originalPrice: insertCampaign.originalPrice || null,
      currentPrice: insertCampaign.currentPrice || null,
      fullReductionThreshold: insertCampaign.fullReductionThreshold || null,
      fullReductionAmount: insertCampaign.fullReductionAmount || null,
      startTime: insertCampaign.startTime || null,
      endTime: insertCampaign.endTime || null,
      hasTimeLimitedDiscount: insertCampaign.hasTimeLimitedDiscount || false,
      discountPercentage: insertCampaign.discountPercentage || 0,
      hasFullReduction: insertCampaign.hasFullReduction || false,
      status: insertCampaign.status || "draft",
      placements: Array.isArray(insertCampaign.placements) ? insertCampaign.placements as string[] : [],
      deviceTypes: Array.isArray(insertCampaign.deviceTypes) ? insertCampaign.deviceTypes as string[] : [],
      interests: Array.isArray(insertCampaign.interests) ? insertCampaign.interests as string[] : [],
      behaviors: Array.isArray(insertCampaign.behaviors) ? insertCampaign.behaviors as string[] : [],
      weeklySchedule: Array.isArray(insertCampaign.weeklySchedule) ? insertCampaign.weeklySchedule as boolean[] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: number, updateData: Partial<InsertCampaign>): Promise<Campaign> {
    const existingCampaign = this.campaigns.get(id);
    if (!existingCampaign) {
      throw new Error(`Campaign with id ${id} not found`);
    }

    const updatedCampaign: Campaign = {
      ...existingCampaign,
      ...updateData,
      status: updateData.status || existingCampaign.status || "draft",
      placements: Array.isArray(updateData.placements) ? updateData.placements as string[] : (existingCampaign.placements || []),
      deviceTypes: Array.isArray(updateData.deviceTypes) ? updateData.deviceTypes as string[] : (existingCampaign.deviceTypes || []),
      interests: Array.isArray(updateData.interests) ? updateData.interests as string[] : (existingCampaign.interests || []),
      behaviors: Array.isArray(updateData.behaviors) ? updateData.behaviors as string[] : (existingCampaign.behaviors || []),
      weeklySchedule: Array.isArray(updateData.weeklySchedule) ? updateData.weeklySchedule as boolean[] : (existingCampaign.weeklySchedule || []),
      updatedAt: new Date(),
    };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  async deleteCampaign(id: number): Promise<void> {
    this.campaigns.delete(id);
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      ...insertProduct,
      id,
    };
    this.products.set(id, product);
    return product;
  }
}

export const storage = new MemStorage();
