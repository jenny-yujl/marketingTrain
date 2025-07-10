import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCampaignSchema, insertProductSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Campaign routes
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      console.log("接收到的原始数据:", JSON.stringify(req.body, null, 2));
      const validatedData = insertCampaignSchema.parse(req.body);
      console.log("验证后的数据:", JSON.stringify(validatedData, null, 2));
      const campaign = await storage.createCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      console.error("保存活动失败:", error);
      if (error instanceof z.ZodError) {
        console.error("Zod验证错误:", error.errors);
        return res.status(400).json({ 
          message: "Invalid campaign data", 
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
            received: err.received,
            expected: err.expected
          }))
        });
      }
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.put("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log("更新活动，接收到的原始数据:", JSON.stringify(req.body, null, 2));
      const validatedData = insertCampaignSchema.partial().parse(req.body);
      console.log("验证后的数据:", JSON.stringify(validatedData, null, 2));
      const campaign = await storage.updateCampaign(id, validatedData);
      res.json(campaign);
    } catch (error) {
      console.error("更新活动失败:", error);
      if (error instanceof z.ZodError) {
        console.error("Zod验证错误:", error.errors);
        return res.status(400).json({ 
          message: "Invalid campaign data", 
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
            received: err.received,
            expected: err.expected
          }))
        });
      }
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCampaign(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
