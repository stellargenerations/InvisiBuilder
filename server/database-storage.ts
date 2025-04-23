import { IStorage } from './storage';
import { db } from './db';
import {
  User, InsertUser,
  Category, InsertCategory,
  Topic, InsertTopic,
  Article, InsertArticle,
  MediaFile, InsertMediaFile,
  Resource, InsertResource,
  ContentSection, InsertContentSection,
  Subscriber, InsertSubscriber,
  Contact, InsertContact,
  users, categories, topics, articles, mediaFiles, resources, contentSections, subscribers, contacts
} from '@shared/schema';
import { eq, like, or, and, inArray, desc, SQL } from 'drizzle-orm';

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Topics (formerly Categories)
  async getTopics(): Promise<Topic[]> {
    try {
      return await db.select().from(topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
      return [];
    }
  }

  // For backward compatibility
  async getCategories(): Promise<Category[]> {
    return this.getTopics();
  }

  async getTopicBySlug(slug: string): Promise<Topic | undefined> {
    const [topic] = await db.select().from(topics).where(eq(topics.slug, slug));
    return topic;
  }

  // For backward compatibility
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return this.getTopicBySlug(slug);
  }

  async getTopicById(id: number): Promise<Topic | undefined> {
    const [topic] = await db.select().from(topics).where(eq(topics.id, id));
    return topic;
  }

  // For backward compatibility
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.getTopicById(id);
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const [topic] = await db.insert(topics).values(insertTopic).returning();
    return topic;
  }

  // For backward compatibility
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    return this.createTopic(insertCategory);
  }

  async updateTopic(id: number, updateData: Partial<InsertTopic>): Promise<Topic | undefined> {
    const [topic] = await db
      .update(topics)
      .set(updateData)
      .where(eq(topics.id, id))
      .returning();
    return topic;
  }

  // For backward compatibility
  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    return this.updateTopic(id, updateData);
  }

  async deleteTopic(id: number): Promise<boolean> {
    const result = await db.delete(topics).where(eq(topics.id, id));
    return true; // If no error was thrown, consider it successful
  }

  // For backward compatibility
  async deleteCategory(id: number): Promise<boolean> {
    return this.deleteTopic(id);
  }

  // Articles
  async getArticles(options: {
    featured?: boolean;
    category?: string;  // Keeping for backward compatibility
    topic?: string;     // Preferred parameter name
    tag?: string;
    search?: string;
    limit?: number;
  } = {}): Promise<Article[]> {
    try {
      let query = db.select().from(articles);

      // Apply filters
      const conditions = [];
      
      if (options.featured !== undefined) {
        conditions.push(eq(articles.featured, options.featured));
      }
      
      // Prioritize topic parameter (preferred) but fall back to category for backward compatibility
      const topicValue = options.topic || options.category;
      if (topicValue) {
        conditions.push(eq(articles.category, topicValue));
      }
      
      if (options.tag && articles.tags) {
        // Safe handling for tags as array
        const tagCondition = SQL`${articles.tags}::text LIKE ${'%' + options.tag + '%'}`;
        conditions.push(tagCondition);
      }
      
      if (options.search) {
        conditions.push(
          or(
            like(articles.title, `%${options.search}%`),
            like(articles.excerpt, `%${options.search}%`)
          )
        );
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      // Apply limits
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      // Execute query
      const articlesData = await query.orderBy(desc(articles.publishedDate));
      
      // Enhance with related data
      const enhancedArticles = await Promise.all(
        articlesData.map(article => this.enhanceArticle(article))
      );
      
      return enhancedArticles;
    } catch (error) {
      console.error("Error fetching articles:", error);
      return [];
    }
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    
    if (!article) {
      return undefined;
    }
    
    return await this.enhanceArticle(article);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
    
    if (!article) {
      return undefined;
    }
    
    return await this.enhanceArticle(article);
  }

  async getArticlePreview(): Promise<Article | undefined> {
    // Explicitly use featured=true to get only genuinely featured articles
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.featured, true))
      .limit(1);
    
    if (!article) {
      // Fallback: if no featured article is found, just return the most recent one
      const [recentArticle] = await db
        .select()
        .from(articles)
        .orderBy(desc(articles.publishedDate))
        .limit(1);
        
      if (!recentArticle) {
        return undefined;
      }
      
      return await this.enhanceArticle(recentArticle);
    }
    
    return await this.enhanceArticle(article);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db.insert(articles).values(insertArticle).returning();
    return article;
  }

  async updateArticle(id: number, updateData: Partial<InsertArticle>): Promise<Article | undefined> {
    const [article] = await db
      .update(articles)
      .set(updateData)
      .where(eq(articles.id, id))
      .returning();
    
    if (!article) {
      return undefined;
    }
    
    return await this.enhanceArticle(article);
  }

  async deleteArticle(id: number): Promise<boolean> {
    await db.delete(articles).where(eq(articles.id, id));
    return true;
  }

  private async enhanceArticle(article: Article): Promise<Article> {
    // Get content sections
    const contentSectionsList = await db
      .select()
      .from(contentSections)
      .where(eq(contentSections.articleId, article.id))
      .orderBy(contentSections.order);

    // Get media files
    const mediaFilesList = await db
      .select()
      .from(mediaFiles)
      .where(eq(mediaFiles.articleId, article.id));

    // Categorize media files
    const videoFiles = mediaFilesList.filter(file => file.type === 'video');
    const audioFiles = mediaFilesList.filter(file => file.type === 'audio');
    const images = mediaFilesList.filter(file => file.type === 'image');

    // Get resources
    const resourcesList = await db
      .select()
      .from(resources)
      .where(eq(resources.articleId, article.id));

    // Get related articles - using simple logic for now
    let relatedArticlesList: Article[] = [];
    if (article.category) {
      relatedArticlesList = await db
        .select()
        .from(articles)
        .where(
          and(
            eq(articles.category, article.category),
            article.id ? eq(articles.id, article.id) : undefined
          )
        )
        .limit(3);
    }

    return {
      ...article,
      contentSections: contentSectionsList,
      videoFiles,
      audioFiles,
      images,
      resources: resourcesList,
      relatedArticles: relatedArticlesList
    };
  }

  // Media Files
  async getMediaFiles(articleId?: number): Promise<MediaFile[]> {
    if (articleId) {
      return await db.select().from(mediaFiles).where(eq(mediaFiles.articleId, articleId));
    }
    return await db.select().from(mediaFiles);
  }

  async getMediaFileById(id: number): Promise<MediaFile | undefined> {
    const [mediaFile] = await db.select().from(mediaFiles).where(eq(mediaFiles.id, id));
    return mediaFile;
  }

  async createMediaFile(insertMediaFile: InsertMediaFile): Promise<MediaFile> {
    const [mediaFile] = await db.insert(mediaFiles).values(insertMediaFile).returning();
    return mediaFile;
  }

  async deleteMediaFile(id: number): Promise<boolean> {
    await db.delete(mediaFiles).where(eq(mediaFiles.id, id));
    return true;
  }

  // Resources
  async getResources(articleId?: number): Promise<Resource[]> {
    if (articleId) {
      return await db.select().from(resources).where(eq(resources.articleId, articleId));
    }
    return await db.select().from(resources);
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db.insert(resources).values(insertResource).returning();
    return resource;
  }

  async deleteResource(id: number): Promise<boolean> {
    await db.delete(resources).where(eq(resources.id, id));
    return true;
  }

  // Content Sections
  async getContentSections(articleId: number): Promise<ContentSection[]> {
    return await db
      .select()
      .from(contentSections)
      .where(eq(contentSections.articleId, articleId))
      .orderBy(contentSections.order);
  }

  async createContentSection(insertContentSection: InsertContentSection): Promise<ContentSection> {
    const [section] = await db.insert(contentSections).values(insertContentSection).returning();
    return section;
  }

  async updateContentSection(id: number, updateData: Partial<InsertContentSection>): Promise<ContentSection | undefined> {
    const [section] = await db
      .update(contentSections)
      .set(updateData)
      .where(eq(contentSections.id, id))
      .returning();
    return section;
  }

  async deleteContentSection(id: number): Promise<boolean> {
    await db.delete(contentSections).where(eq(contentSections.id, id));
    return true;
  }

  // Newsletter Subscribers
  async getSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers);
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    return subscriber;
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const [subscriber] = await db.insert(subscribers).values(insertSubscriber).returning();
    return subscriber;
  }

  async updateSubscriber(id: number, updateData: Partial<InsertSubscriber>): Promise<Subscriber | undefined> {
    const [subscriber] = await db
      .update(subscribers)
      .set(updateData)
      .where(eq(subscribers.id, id))
      .returning();
    return subscriber;
  }

  async deleteSubscriber(id: number): Promise<boolean> {
    await db.delete(subscribers).where(eq(subscribers.id, id));
    return true;
  }

  // Contact Form Submissions
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  async getContactById(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async updateContactStatus(id: number, status: string): Promise<Contact | undefined> {
    const [contact] = await db
      .update(contacts)
      .set({ status })
      .where(eq(contacts.id, id))
      .returning();
    return contact;
  }

  async deleteContact(id: number): Promise<boolean> {
    await db.delete(contacts).where(eq(contacts.id, id));
    return true;
  }
}