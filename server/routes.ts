import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSchema, newsletterSubscriptionSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { initializeDatabase } from "./db-init";
import { 
  insertArticleSchema, 
  insertCategorySchema, 
  insertContentSectionSchema, 
  insertMediaFileSchema, 
  insertResourceSchema, 
  insertSubscriberSchema 
} from "@shared/schema";

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

  // Get article by slug
  app.get("/api/articles/slug/:slug", async (req: Request, res: Response) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching article by slug:", error);
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

  // ADMIN API ENDPOINTS
  // Create category
  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const validationResult = insertCategorySchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const category = await storage.createCategory(validationResult.data);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Update category
  app.put("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const validationResult = insertCategorySchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const updatedCategory = await storage.updateCategory(id, validationResult.data);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  // Delete category
  app.delete("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(404).json({ message: "Category not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Create article
  app.post("/api/articles", async (req: Request, res: Response) => {
    try {
      const validationResult = insertArticleSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const article = await storage.createArticle(validationResult.data);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  // Update article
  app.put("/api/articles/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }
      
      const validationResult = insertArticleSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const updatedArticle = await storage.updateArticle(id, validationResult.data);
      
      if (!updatedArticle) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(updatedArticle);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  // Delete article
  app.delete("/api/articles/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }
      
      const success = await storage.deleteArticle(id);
      
      if (!success) {
        return res.status(404).json({ message: "Article not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Get all media files
  app.get("/api/media", async (req: Request, res: Response) => {
    try {
      const articleId = req.query.articleId ? parseInt(req.query.articleId as string, 10) : undefined;
      const mediaFiles = await storage.getMediaFiles(articleId);
      res.json(mediaFiles);
    } catch (error) {
      console.error("Error fetching media files:", error);
      res.status(500).json({ message: "Failed to fetch media files" });
    }
  });

  // Create media file
  app.post("/api/media", async (req: Request, res: Response) => {
    try {
      const validationResult = insertMediaFileSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const mediaFile = await storage.createMediaFile(validationResult.data);
      res.status(201).json(mediaFile);
    } catch (error) {
      console.error("Error creating media file:", error);
      res.status(500).json({ message: "Failed to create media file" });
    }
  });

  // Delete media file
  app.delete("/api/media/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid media file ID" });
      }
      
      const success = await storage.deleteMediaFile(id);
      
      if (!success) {
        return res.status(404).json({ message: "Media file not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting media file:", error);
      res.status(500).json({ message: "Failed to delete media file" });
    }
  });

  // Get all resources
  app.get("/api/resources", async (req: Request, res: Response) => {
    try {
      const articleId = req.query.articleId ? parseInt(req.query.articleId as string, 10) : undefined;
      const resources = await storage.getResources(articleId);
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  // Create resource
  app.post("/api/resources", async (req: Request, res: Response) => {
    try {
      const validationResult = insertResourceSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const resource = await storage.createResource(validationResult.data);
      res.status(201).json(resource);
    } catch (error) {
      console.error("Error creating resource:", error);
      res.status(500).json({ message: "Failed to create resource" });
    }
  });

  // Delete resource
  app.delete("/api/resources/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }
      
      const success = await storage.deleteResource(id);
      
      if (!success) {
        return res.status(404).json({ message: "Resource not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting resource:", error);
      res.status(500).json({ message: "Failed to delete resource" });
    }
  });

  // Get content sections for an article
  app.get("/api/sections", async (req: Request, res: Response) => {
    try {
      const articleId = req.query.articleId ? parseInt(req.query.articleId as string, 10) : null;
      
      if (!articleId) {
        return res.status(400).json({ message: "Article ID is required" });
      }
      
      const sections = await storage.getContentSections(articleId);
      res.json(sections);
    } catch (error) {
      console.error("Error fetching content sections:", error);
      res.status(500).json({ message: "Failed to fetch content sections" });
    }
  });

  // Create content section
  app.post("/api/sections", async (req: Request, res: Response) => {
    try {
      const validationResult = insertContentSectionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const section = await storage.createContentSection(validationResult.data);
      res.status(201).json(section);
    } catch (error) {
      console.error("Error creating content section:", error);
      res.status(500).json({ message: "Failed to create content section" });
    }
  });

  // Update content section
  app.put("/api/sections/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid content section ID" });
      }
      
      const validationResult = insertContentSectionSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const updatedSection = await storage.updateContentSection(id, validationResult.data);
      
      if (!updatedSection) {
        return res.status(404).json({ message: "Content section not found" });
      }
      
      res.json(updatedSection);
    } catch (error) {
      console.error("Error updating content section:", error);
      res.status(500).json({ message: "Failed to update content section" });
    }
  });

  // Delete content section
  app.delete("/api/sections/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid content section ID" });
      }
      
      const success = await storage.deleteContentSection(id);
      
      if (!success) {
        return res.status(404).json({ message: "Content section not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting content section:", error);
      res.status(500).json({ message: "Failed to delete content section" });
    }
  });

  // Get all subscribers
  app.get("/api/subscribers", async (_req: Request, res: Response) => {
    try {
      const subscribers = await storage.getSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });

  // Create subscriber
  app.post("/api/subscribers", async (req: Request, res: Response) => {
    try {
      const validationResult = insertSubscriberSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const subscriber = await storage.createSubscriber(validationResult.data);
      res.status(201).json(subscriber);
    } catch (error) {
      console.error("Error creating subscriber:", error);
      res.status(500).json({ message: "Failed to create subscriber" });
    }
  });

  // Update subscriber
  app.put("/api/subscribers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid subscriber ID" });
      }
      
      const validationResult = insertSubscriberSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const updatedSubscriber = await storage.updateSubscriber(id, validationResult.data);
      
      if (!updatedSubscriber) {
        return res.status(404).json({ message: "Subscriber not found" });
      }
      
      res.json(updatedSubscriber);
    } catch (error) {
      console.error("Error updating subscriber:", error);
      res.status(500).json({ message: "Failed to update subscriber" });
    }
  });

  // Delete subscriber
  app.delete("/api/subscribers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid subscriber ID" });
      }
      
      const success = await storage.deleteSubscriber(id);
      
      if (!success) {
        return res.status(404).json({ message: "Subscriber not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      res.status(500).json({ message: "Failed to delete subscriber" });
    }
  });

  // Get all contacts
  app.get("/api/contacts", async (_req: Request, res: Response) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  // Update contact status
  app.put("/api/contacts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid contact ID" });
      }
      
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedContact = await storage.updateContactStatus(id, status);
      
      if (!updatedContact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      
      res.json(updatedContact);
    } catch (error) {
      console.error("Error updating contact status:", error);
      res.status(500).json({ message: "Failed to update contact status" });
    }
  });

  // Delete contact
  app.delete("/api/contacts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid contact ID" });
      }
      
      const success = await storage.deleteContact(id);
      
      if (!success) {
        return res.status(404).json({ message: "Contact not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
