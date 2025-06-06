import { Express, Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import * as markdownApi from './markdown-api';

export async function registerRoutes(app: Express): Promise<Server> {
  // Topic routes (formerly categories)
  app.get("/api/topics", async (_req: Request, res: Response) => {
    try {
      const topics = await markdownApi.getAllCategories();
      res.json(topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
      res.status(500).json({ message: "Error fetching topics" });
    }
  });

  // Keep the categories endpoint for backward compatibility
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await markdownApi.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  app.get("/api/topics/:slug", async (req: Request, res: Response) => {
    try {
      const topic = await markdownApi.getCategoryBySlug(req.params.slug);

      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      res.json(topic);
    } catch (error) {
      console.error(`Error fetching topic ${req.params.slug}:`, error);
      res.status(500).json({ message: "Error fetching topic" });
    }
  });

  // Keep the categories endpoint for backward compatibility
  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const category = await markdownApi.getCategoryBySlug(req.params.slug);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      console.error(`Error fetching category ${req.params.slug}:`, error);
      res.status(500).json({ message: "Error fetching category" });
    }
  });

  // Article routes
  // The order of these routes is important - more specific routes should come first

  app.get("/api/articles/preview", async (_req: Request, res: Response) => {
    try {
      const articles = await markdownApi.getAllArticles();

      if (!articles || articles.length === 0) {
        return res.status(404).json({ message: "No articles found" });
      }

      // Return the first featured article as preview or the most recent one
      // By sorting the articles, we ensure we get the most recent one if no featured article is found
      const previewArticle = articles.find(article => article.featured === true) || articles[0];

      if (!previewArticle) {
        return res.status(404).json({ message: "Article not found" });
      }

      // Log the preview article being returned
      console.log("Returning preview article:", previewArticle.title);

      res.json(previewArticle);
    } catch (error) {
      console.error("Error fetching preview article:", error);
      res.status(500).json({ message: "Error fetching preview article" });
    }
  });

  app.get("/api/articles/slug/:slug", async (req: Request, res: Response) => {
    try {
      // Convert the slug to kebab-case format used in filenames
      const formattedSlug = req.params.slug
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with hyphens
        .replace(/[^\w\-]+/g, '')       // Remove special characters
        .replace(/\-\-+/g, '-')         // Replace multiple hyphens with single hyphen
        .replace(/^-+/, '')             // Remove leading hyphens
        .replace(/-+$/, '');            // Remove trailing hyphens

      console.log(`Looking for article with slug: ${formattedSlug}`);
      const article = await markdownApi.getArticleBySlug(formattedSlug);

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.json(article);
    } catch (error) {
      console.error(`Error fetching article ${req.params.slug}:`, error);
      res.status(500).json({ message: "Error fetching article" });
    }
  });

  app.get("/api/articles/:id", async (req: Request, res: Response) => {
    try {
      // Convert the ID to kebab-case format used in filenames
      const formattedId = req.params.id
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with hyphens
        .replace(/[^\w\-]+/g, '')       // Remove special characters
        .replace(/\-\-+/g, '-')         // Replace multiple hyphens with single hyphen
        .replace(/^-+/, '')             // Remove leading hyphens
        .replace(/-+$/, '');            // Remove trailing hyphens

      console.log(`Looking for article with ID: ${formattedId}`);
      const article = await markdownApi.getArticleBySlug(formattedId);

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.json(article);
    } catch (error) {
      console.error(`Error fetching article ${req.params.id}:`, error);
      res.status(500).json({ message: "Error fetching article" });
    }
  });

  // Generic articles endpoint (must come after the specific routes to avoid conflict)
  app.get("/api/articles", async (req: Request, res: Response) => {
    try {
      const { category, topic, tag, search } = req.query;

      let articles;

      if (topic || category) {
        // Use topic parameter first, fall back to category for backward compatibility
        const topicSlug = (topic || category) as string;
        articles = await markdownApi.getArticlesByCategory(topicSlug);
      } else if (tag) {
        articles = await markdownApi.getArticlesByTag(tag as string);
      } else if (search) {
        articles = await markdownApi.searchArticles(search as string);
      } else {
        articles = await markdownApi.getAllArticles();
      }

      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Error fetching articles" });
    }
  });

  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const { name, email, message } = req.body;

      // Store contact in a JSON file for simplicity
      // This is just a placeholder - in a real app, you might want to use a database
      const contactData = {
        id: Date.now(),
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
        status: 'new'
      };

      // You could save this to a JSON file or implement a proper storage mechanism
      console.log("Contact form submission:", contactData);

      res.status(201).json({ success: true, message: "Contact form submitted successfully" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Error submitting contact form" });
    }
  });

  app.post("/api/newsletter/subscribe", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Store subscriber in a JSON file for simplicity
      // This is just a placeholder - in a real app, you might want to use a database
      const subscriberData = {
        id: Date.now(),
        email,
        subscribedAt: new Date().toISOString(),
        status: 'active'
      };

      // You could save this to a JSON file or implement a proper storage mechanism
      console.log("Newsletter subscription:", subscriberData);

      res.status(201).json({ success: true, message: "Subscribed to newsletter successfully" });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Error subscribing to newsletter" });
    }
  });

  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const results = await markdownApi.searchArticles(query as string);
      res.json(results);
    } catch (error) {
      console.error("Error searching content:", error);
      res.status(500).json({ message: "Error searching content" });
    }
  });

  // Admin API routes for content management
  app.post("/api/topics", async (req: Request, res: Response) => {
    try {
      const topicData = req.body;
      const newTopic = await markdownApi.createCategory(topicData);
      res.status(201).json(newTopic);
    } catch (error) {
      console.error("Error creating topic:", error);
      res.status(500).json({ message: "Error creating topic" });
    }
  });

  // Keep the categories endpoint for backward compatibility
  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const categoryData = req.body;
      const newCategory = await markdownApi.createCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Error creating category" });
    }
  });

  app.put("/api/topics/:slug", async (req: Request, res: Response) => {
    try {
      const updatedTopic = await markdownApi.updateCategory(req.params.slug, req.body);
      res.json(updatedTopic);
    } catch (error) {
      console.error(`Error updating topic ${req.params.slug}:`, error);
      res.status(500).json({ message: "Error updating topic" });
    }
  });

  // Keep the categories endpoint for backward compatibility
  app.put("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const updatedCategory = await markdownApi.updateCategory(req.params.slug, req.body);
      res.json(updatedCategory);
    } catch (error) {
      console.error(`Error updating category ${req.params.slug}:`, error);
      res.status(500).json({ message: "Error updating category" });
    }
  });

  app.delete("/api/topics/:slug", async (req: Request, res: Response) => {
    try {
      const result = await markdownApi.deleteCategory(req.params.slug);

      if (!result) {
        return res.status(404).json({ message: "Topic not found" });
      }

      res.json({ success: true, message: "Topic deleted successfully" });
    } catch (error) {
      console.error(`Error deleting topic ${req.params.slug}:`, error);
      res.status(500).json({ message: "Error deleting topic" });
    }
  });

  // Keep the categories endpoint for backward compatibility
  app.delete("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const result = await markdownApi.deleteCategory(req.params.slug);

      if (!result) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      console.error(`Error deleting category ${req.params.slug}:`, error);
      res.status(500).json({ message: "Error deleting category" });
    }
  });

  app.post("/api/articles", async (req: Request, res: Response) => {
    try {
      const articleData = req.body;
      const newArticle = await markdownApi.createArticle(articleData);
      res.status(201).json(newArticle);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Error creating article" });
    }
  });

  app.put("/api/articles/:slug", async (req: Request, res: Response) => {
    try {
      const updatedArticle = await markdownApi.updateArticle(req.params.slug, req.body);
      res.json(updatedArticle);
    } catch (error) {
      console.error(`Error updating article ${req.params.slug}:`, error);
      res.status(500).json({ message: "Error updating article" });
    }
  });

  app.delete("/api/articles/:slug", async (req: Request, res: Response) => {
    try {
      const result = await markdownApi.deleteArticle(req.params.slug);

      if (!result) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.json({ success: true, message: "Article deleted successfully" });
    } catch (error) {
      console.error(`Error deleting article ${req.params.slug}:`, error);
      res.status(500).json({ message: "Error deleting article" });
    }
  });

  // Media and resource endpoints could be implemented with file-based storage
  // This is beyond the scope of this example but would involve similar patterns

  const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`[express] serving on port ${process.env.PORT || 5000}`);
  });

  return server;
}