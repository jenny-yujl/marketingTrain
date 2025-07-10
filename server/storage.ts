import { campaigns, products, type Campaign, type Product, type InsertCampaign, type InsertProduct } from "@shared/schema";
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
  // 将数据库中的TEXT字段转换为应用层格式
  private transformCampaignFromDB(dbCampaign: any): Campaign {
    return {
      ...dbCampaign,
      placements: this.parseJSONField(dbCampaign.placements, []),
      deviceTypes: this.parseJSONField(dbCampaign.deviceTypes, []),
      interests: this.parseJSONField(dbCampaign.interests, []),
      behaviors: this.parseJSONField(dbCampaign.behaviors, []),
      weeklySchedule: this.parseJSONField(dbCampaign.weeklySchedule, []),
      hasTimeLimitedDiscount: Boolean(dbCampaign.hasTimeLimitedDiscount),
      hasFullReduction: Boolean(dbCampaign.hasFullReduction),
    };
  }
  
  // 安全解析JSON字段
  private parseJSONField(value: string | any, defaultValue: any = null): any {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return defaultValue;
      }
    }
    return value || defaultValue;
  }
  async getCampaign(id: number): Promise<Campaign | undefined> {
    const { db } = await import("./db");
    if (!db) throw new Error("Database not connected");
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign ? this.transformCampaignFromDB(campaign) : undefined;
  }

  async getCampaigns(): Promise<Campaign[]> {
    const { db } = await import("./db");
    if (!db) throw new Error("Database not connected");
    const dbCampaigns = await db.select().from(campaigns);
    return dbCampaigns.map(campaign => this.transformCampaignFromDB(campaign));
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const { db } = await import("./db");
    if (!db) throw new Error("Database not connected");
    
    // 处理数据格式转换
    const processedData = {
      ...insertCampaign,
      // 确保TEXT字段为字符串格式
      placements: typeof insertCampaign.placements === 'string' 
        ? insertCampaign.placements 
        : JSON.stringify(insertCampaign.placements || []),
      deviceTypes: typeof insertCampaign.deviceTypes === 'string' 
        ? insertCampaign.deviceTypes 
        : JSON.stringify(insertCampaign.deviceTypes || []),
      interests: typeof insertCampaign.interests === 'string' 
        ? insertCampaign.interests 
        : JSON.stringify(insertCampaign.interests || []),
      behaviors: typeof insertCampaign.behaviors === 'string' 
        ? insertCampaign.behaviors 
        : JSON.stringify(insertCampaign.behaviors || []),
      weeklySchedule: typeof insertCampaign.weeklySchedule === 'string' 
        ? insertCampaign.weeklySchedule 
        : JSON.stringify(insertCampaign.weeklySchedule || []),
    };
    
    const result = await db.insert(campaigns).values(processedData);
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, result[0].insertId));
    
    // 转换返回的数据格式
    return this.transformCampaignFromDB(campaign);
  }

  async updateCampaign(id: number, updateData: Partial<InsertCampaign>): Promise<Campaign> {
    const { db } = await import("./db");
    if (!db) throw new Error("Database not connected");
    
    // 处理数据格式转换
    const processedData: any = { ...updateData, updatedAt: new Date() };
    
    if (updateData.placements) {
      processedData.placements = typeof updateData.placements === 'string' 
        ? updateData.placements 
        : JSON.stringify(updateData.placements);
    }
    if (updateData.deviceTypes) {
      processedData.deviceTypes = typeof updateData.deviceTypes === 'string' 
        ? updateData.deviceTypes 
        : JSON.stringify(updateData.deviceTypes);
    }
    if (updateData.interests) {
      processedData.interests = typeof updateData.interests === 'string' 
        ? updateData.interests 
        : JSON.stringify(updateData.interests);
    }
    if (updateData.behaviors) {
      processedData.behaviors = typeof updateData.behaviors === 'string' 
        ? updateData.behaviors 
        : JSON.stringify(updateData.behaviors);
    }
    if (updateData.weeklySchedule) {
      processedData.weeklySchedule = typeof updateData.weeklySchedule === 'string' 
        ? updateData.weeklySchedule 
        : JSON.stringify(updateData.weeklySchedule);
    }
    
    await db.update(campaigns).set(processedData).where(eq(campaigns.id, id));
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    if (!campaign) throw new Error(`Campaign with id ${id} not found`);
    return this.transformCampaignFromDB(campaign);
  }

  async deleteCampaign(id: number): Promise<void> {
    const { db } = await import("./db");
    if (!db) throw new Error("Database not connected");
    await db.delete(campaigns).where(eq(campaigns.id, id));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const { db } = await import("./db");
    if (!db) throw new Error("Database not connected");
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProducts(): Promise<Product[]> {
    const { db } = await import("./db");
    if (!db) throw new Error("Database not connected");
    return await db.select().from(products);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const { db } = await import("./db");
    if (!db) throw new Error("Database not connected");
    const result = await db.insert(products).values(insertProduct);
    const [product] = await db.select().from(products).where(eq(products.id, result[0].insertId));
    return product;
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

  // 解析数组字段，兼容字符串和数组格式
  private parseArrayField(value: any, defaultValue: any[]): any[] {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : defaultValue;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
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
      placements: this.parseArrayField(insertCampaign.placements, []),
      deviceTypes: this.parseArrayField(insertCampaign.deviceTypes, []),
      interests: this.parseArrayField(insertCampaign.interests, []),
      behaviors: this.parseArrayField(insertCampaign.behaviors, []),
      weeklySchedule: this.parseArrayField(insertCampaign.weeklySchedule, []),
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
      placements: updateData.placements ? this.parseArrayField(updateData.placements, []) : existingCampaign.placements || [],
      deviceTypes: updateData.deviceTypes ? this.parseArrayField(updateData.deviceTypes, []) : existingCampaign.deviceTypes || [],
      interests: updateData.interests ? this.parseArrayField(updateData.interests, []) : existingCampaign.interests || [],
      behaviors: updateData.behaviors ? this.parseArrayField(updateData.behaviors, []) : existingCampaign.behaviors || [],
      weeklySchedule: updateData.weeklySchedule ? this.parseArrayField(updateData.weeklySchedule, []) : existingCampaign.weeklySchedule || [],
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

// 检查数据库连接并选择合适的存储
const checkDatabaseConnection = async () => {
  const { db } = await import("./db");
  return db !== null;
};

// 暂时使用内存存储，稍后可动态切换
export const storage = new MemStorage();
