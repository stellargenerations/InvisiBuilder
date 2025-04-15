import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSchema, newsletterSubscriptionSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - prefix all routes with /api
  
  // Get all categories
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get category by slug
  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Get all articles with optional filters
  app.get("/api/articles", async (req: Request, res: Response) => {
    try {
      const { featured, category, tag, search, limit } = req.query;
      
      const options: {
        featured?: boolean;
        category?: string;
        tag?: string;
        search?: string;
        limit?: number;
      } = {};
      
      if (featured !== undefined) {
        options.featured = featured === "true";
      }
      
      if (category && typeof category === "string") {
        options.category = category;
      }
      
      if (tag && typeof tag === "string") {
        options.tag = tag;
      }
      
      if (search && typeof search === "string") {
        options.search = search;
      }
      
      if (limit && typeof limit === "string") {
        options.limit = parseInt(limit, 10);
      }
      
      const articles = await storage.getArticles(options);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  // Get article by ID
  app.get("/api/articles/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }
      
      const article = await storage.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Get preview article
  app.get("/api/articles/preview", async (_req: Request, res: Response) => {
    try {
      const article = await storage.getArticlePreview();
      
      if (!article) {
        return res.status(404).json({ message: "Preview article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching preview article:", error);
      res.status(500).json({ message: "Failed to fetch preview article" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const validationResult = insertContactSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const contact = await storage.createContact(validationResult.data);
      res.status(201).json({ success: true, contact });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Subscribe to newsletter
  app.post("/api/newsletter/subscribe", async (req: Request, res: Response) => {
    try {
      const validationResult = newsletterSubscriptionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Check if email already exists
      const existingSubscriber = await storage.getSubscriberByEmail(validationResult.data.email);
      
      if (existingSubscriber) {
        if (existingSubscriber.status === 'active') {
          return res.status(400).json({ message: "Email is already subscribed" });
        } else {
          // Reactivate the subscription
          const updated = await storage.updateSubscriber(existingSubscriber.id, { 
            status: 'active',
            consent: validationResult.data.consent
          });
          return res.status(200).json({ success: true, subscriber: updated });
        }
      }
      
      // Create new subscriber
      const subscriber = await storage.createSubscriber({
        email: validationResult.data.email,
        consent: validationResult.data.consent,
        status: 'active'
      });
      
      res.status(201).json({ success: true, subscriber });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Search articles
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const articles = await storage.getArticles({ search: q });
      res.json(articles);
    } catch (error) {
      console.error("Error searching articles:", error);
      res.status(500).json({ message: "Failed to search articles" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
