import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { newsletterSubscriptionSchema } from "@shared/schema";
import * as sanityApi from "./sanity-api";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - prefix all routes with /api
  
  // Get all categories
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await sanityApi.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get category by slug
  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const category = await sanityApi.getCategoryBySlug(req.params.slug);
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
      
      const articles = await sanityApi.getArticles(options);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  // Get article by ID
  app.get("/api/articles/:id", async (req: Request, res: Response) => {
    try {
      const article = await sanityApi.getArticleById(req.params.id);
      
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
      const article = await sanityApi.getArticleBySlug(req.params.slug);
      
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
      const article = await sanityApi.getArticlePreview();
      
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
      // Basic validation for contact form
      const contactSchema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        subject: z.string().min(2),
        message: z.string().min(5)
      });
      
      const validationResult = contactSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const contact = await sanityApi.createContact(validationResult.data);
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
      const existingSubscriber = await sanityApi.getSubscriberByEmail(validationResult.data.email);
      
      if (existingSubscriber) {
        if (existingSubscriber.status === 'active') {
          return res.status(400).json({ message: "Email is already subscribed" });
        } else {
          // Reactivate the subscription
          const updated = await sanityApi.updateSubscriber(existingSubscriber._id, { 
            status: 'active',
            preferences: existingSubscriber.preferences || []
          });
          return res.status(200).json({ success: true, subscriber: updated });
        }
      }
      
      // Create new subscriber
      const subscriber = await sanityApi.createSubscriber({
        email: validationResult.data.email,
        name: '',
        status: 'active',
        preferences: []
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
      
      const results = await sanityApi.searchContent(q);
      res.json(results);
    } catch (error) {
      console.error("Error searching content:", error);
      res.status(500).json({ message: "Failed to search content" });
    }
  });

  // ADMIN API ENDPOINTS
  // Create category
  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      // Basic validation for category
      const categorySchema = z.object({
        name: z.string().min(2),
        slug: z.string().optional(),
        description: z.string(),
        icon: z.string()
      });
      
      const validationResult = categorySchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Create slug if not provided
      const categoryData = validationResult.data;
      if (!categoryData.slug) {
        categoryData.slug = {
          _type: 'slug',
          current: categoryData.name.toLowerCase().replace(/\s+/g, '-')
        };
      } else if (typeof categoryData.slug === 'string') {
        categoryData.slug = {
          _type: 'slug',
          current: categoryData.slug
        };
      }
      
      const category = await sanityApi.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Update category
  app.put("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      
      // Basic validation for update data
      const categoryUpdateSchema = z.object({
        name: z.string().min(2).optional(),
        description: z.string().optional(),
        icon: z.string().optional()
      });
      
      const validationResult = categoryUpdateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const updatedCategory = await sanityApi.updateCategory(id, validationResult.data);
      
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
      const id = req.params.id;
      
      const result = await sanityApi.deleteCategory(id);
      
      if (!result) {
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
      console.log("Creating article with data:", JSON.stringify(req.body));
      
      // Basic validation for article
      const articleSchema = z.object({
        title: z.string().min(2),
        slug: z.any().optional(),
        excerpt: z.string(),
        category: z.any(), // We'll handle the reference format below
        author: z.string(),
        publishedDate: z.any(),
        featured: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
        readTime: z.number().optional(),
        mainImage: z.any().optional()
      });
      
      // Set defaults for all required fields if not provided
      const dataWithDefaults = {
        featured: false,
        tags: [],
        readTime: 5,
        publishedDate: new Date().toISOString(),
        ...req.body
      };
      
      const validationResult = articleSchema.safeParse(dataWithDefaults);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        console.error("Article validation failed:", errorMessage);
        console.error("Validation errors:", JSON.stringify(validationResult.error.errors));
        return res.status(400).json({ 
          message: errorMessage,
          errors: validationResult.error.errors,
          receivedData: dataWithDefaults
        });
      }
      
      // Format data for Sanity
      const articleData = {...validationResult.data};
      
      // Create slug if not provided
      if (!articleData.slug) {
        articleData.slug = {
          _type: 'slug',
          current: articleData.title.toLowerCase().replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
        };
      } else if (typeof articleData.slug === 'string') {
        articleData.slug = {
          _type: 'slug',
          current: articleData.slug
        };
      }
      
      // Format category reference
      if (articleData.category && typeof articleData.category === 'string') {
        articleData.category = {
          _type: 'reference',
          _ref: articleData.category
        };
      } else if (articleData.category && typeof articleData.category === 'number') {
        // For migration compatibility
        const categoryId = await sanityApi.getCategoryById(articleData.category.toString());
        if (categoryId) {
          articleData.category = {
            _type: 'reference',
            _ref: categoryId._id
          };
        }
      }
      
      const article = await sanityApi.createArticle(articleData);
      console.log("Article created successfully with ID:", article._id);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Failed to create article", error: error.message });
    }
  });

  // Update article
  app.put("/api/articles/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      
      // Basic validation for article update
      const articleUpdateSchema = z.object({
        title: z.string().min(2).optional(),
        excerpt: z.string().optional(),
        category: z.any().optional(),
        author: z.string().optional(),
        publishedDate: z.any().optional(),
        updatedDate: z.any().optional(),
        featured: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
        readTime: z.number().optional(),
        mainImage: z.any().optional()
      });
      
      const validationResult = articleUpdateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Format data for Sanity
      const articleData = {...validationResult.data};
      
      // Set updated date
      if (!articleData.updatedDate) {
        articleData.updatedDate = new Date().toISOString();
      }
      
      // Format category reference if needed
      if (articleData.category && typeof articleData.category === 'string') {
        articleData.category = {
          _type: 'reference',
          _ref: articleData.category
        };
      }
      
      const updatedArticle = await sanityApi.updateArticle(id, articleData);
      
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
      const id = req.params.id;
      
      const result = await sanityApi.deleteArticle(id);
      
      if (!result) {
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
      const articleId = req.query.articleId as string;
      const mediaFiles = await sanityApi.getMediaFiles(articleId);
      res.json(mediaFiles);
    } catch (error) {
      console.error("Error fetching media files:", error);
      res.status(500).json({ message: "Failed to fetch media files" });
    }
  });

  // Create media file
  app.post("/api/media", async (req: Request, res: Response) => {
    try {
      // Basic validation for media file
      const mediaFileSchema = z.object({
        title: z.string().min(2),
        description: z.string().optional(),
        fileType: z.string(),
        file: z.any(), // We'll handle this special field
        altText: z.string().optional(),
        articleId: z.string().optional()
      });
      
      const validationResult = mediaFileSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Format data for Sanity
      const mediaData = {...validationResult.data};
      
      // Format article reference if needed
      if (mediaData.articleId) {
        mediaData.article = {
          _type: 'reference',
          _ref: mediaData.articleId
        };
        delete mediaData.articleId;
      }
      
      const mediaFile = await sanityApi.createMediaFile(mediaData);
      res.status(201).json(mediaFile);
    } catch (error) {
      console.error("Error creating media file:", error);
      res.status(500).json({ message: "Failed to create media file" });
    }
  });

  // Delete media file
  app.delete("/api/media/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      
      const result = await sanityApi.deleteMediaFile(id);
      
      if (!result) {
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
      const articleId = req.query.articleId as string;
      const resources = await sanityApi.getResources(articleId);
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  // Create resource
  app.post("/api/resources", async (req: Request, res: Response) => {
    try {
      // Basic validation for resource
      const resourceSchema = z.object({
        title: z.string().min(2),
        description: z.string().optional(),
        url: z.string().url(),
        resourceType: z.string(),
        icon: z.string().optional(),
        articleId: z.string().optional()
      });
      
      const validationResult = resourceSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Format data for Sanity
      const resourceData = {...validationResult.data};
      
      // Format article reference if needed
      if (resourceData.articleId) {
        resourceData.article = {
          _type: 'reference',
          _ref: resourceData.articleId
        };
        delete resourceData.articleId;
      }
      
      const resource = await sanityApi.createResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      console.error("Error creating resource:", error);
      res.status(500).json({ message: "Failed to create resource" });
    }
  });

  // Delete resource
  app.delete("/api/resources/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      
      const result = await sanityApi.deleteResource(id);
      
      if (!result) {
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
      const articleId = req.query.articleId as string;
      
      if (!articleId) {
        return res.status(400).json({ message: "Article ID is required" });
      }
      
      const sections = await sanityApi.getContentSections(articleId);
      res.json(sections);
    } catch (error) {
      console.error("Error fetching content sections:", error);
      res.status(500).json({ message: "Failed to fetch content sections" });
    }
  });

  // Create content section
  app.post("/api/sections", async (req: Request, res: Response) => {
    try {
      // Basic validation for content section
      const contentSectionSchema = z.object({
        title: z.string().min(2),
        articleId: z.string(),
        position: z.number().int().positive(),
        content: z.any() // This will be a Portable Text field in Sanity
      });
      
      const validationResult = contentSectionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Format data for Sanity
      const sectionData = {...validationResult.data};
      
      // Format article reference
      sectionData.articleId = {
        _type: 'reference',
        _ref: sectionData.articleId
      };
      
      // Convert content to Portable Text if it's a string
      if (typeof sectionData.content === 'string') {
        sectionData.content = [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: sectionData.content,
              },
            ],
            style: 'normal',
          },
        ];
      }
      
      const section = await sanityApi.createContentSection(sectionData);
      res.status(201).json(section);
    } catch (error) {
      console.error("Error creating content section:", error);
      res.status(500).json({ message: "Failed to create content section" });
    }
  });

  // Update content section
  app.put("/api/sections/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      
      // Basic validation for content section update
      const contentSectionUpdateSchema = z.object({
        title: z.string().min(2).optional(),
        position: z.number().int().positive().optional(),
        content: z.any().optional() // This will be a Portable Text field in Sanity
      });
      
      const validationResult = contentSectionUpdateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Format data for Sanity
      const sectionData = {...validationResult.data};
      
      // Convert content to Portable Text if it's a string
      if (typeof sectionData.content === 'string') {
        sectionData.content = [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: sectionData.content,
              },
            ],
            style: 'normal',
          },
        ];
      }
      
      const updatedSection = await sanityApi.updateContentSection(id, sectionData);
      
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
      const id = req.params.id;
      
      const result = await sanityApi.deleteContentSection(id);
      
      if (!result) {
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
      const subscribers = await sanityApi.getSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });

  // Create subscriber
  app.post("/api/subscribers", async (req: Request, res: Response) => {
    try {
      // Basic validation for subscriber
      const subscriberSchema = z.object({
        email: z.string().email(),
        name: z.string().optional(),
        status: z.string().optional(),
        preferences: z.array(z.string()).optional()
      });
      
      const validationResult = subscriberSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Set defaults
      const subscriberData = {
        status: 'active',
        ...validationResult.data
      };
      
      const subscriber = await sanityApi.createSubscriber(subscriberData);
      res.status(201).json(subscriber);
    } catch (error) {
      console.error("Error creating subscriber:", error);
      res.status(500).json({ message: "Failed to create subscriber" });
    }
  });

  // Update subscriber
  app.put("/api/subscribers/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      
      // Basic validation for subscriber update
      const subscriberUpdateSchema = z.object({
        name: z.string().optional(),
        status: z.string().optional(),
        preferences: z.array(z.string()).optional()
      });
      
      const validationResult = subscriberUpdateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const updatedSubscriber = await sanityApi.updateSubscriber(id, validationResult.data);
      
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
      const id = req.params.id;
      
      const result = await sanityApi.deleteSubscriber(id);
      
      if (!result) {
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
      const contacts = await sanityApi.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  // Update contact status
  app.put("/api/contacts/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      
      // Basic validation for contact update
      const contactUpdateSchema = z.object({
        status: z.string().optional(),
        notes: z.string().optional()
      });
      
      const validationResult = contactUpdateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const contact = await sanityApi.getContactById(id);
      
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      
      const updatedContact = await sanityApi.updateContactStatus(id, validationResult.data);
      
      if (!updatedContact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      
      res.json(updatedContact);
    } catch (error) {
      console.error("Error updating contact:", error);
      res.status(500).json({ message: "Failed to update contact" });
    }
  });

  // Delete contact
  app.delete("/api/contacts/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      
      const result = await sanityApi.deleteContact(id);
      
      if (!result) {
        return res.status(404).json({ message: "Contact not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  // Create the HTTP server
  const server = createServer(app);
  return server;
}