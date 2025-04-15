import {
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  mediaFiles, type MediaFile, type InsertMediaFile,
  resources, type Resource, type InsertResource,
  contentSections, type ContentSection, type InsertContentSection,
  articles, type Article, type InsertArticle,
  subscribers, type Subscriber, type InsertSubscriber,
  contacts, type Contact, type InsertContact
} from "@shared/schema";

// Modify the interface with any CRUD methods you might need
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Articles
  getArticles(options?: {
    featured?: boolean;
    category?: string;
    tag?: string;
    search?: string;
    limit?: number;
  }): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticlePreview(): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;

  // Media Files
  getMediaFiles(articleId?: number): Promise<MediaFile[]>;
  getMediaFileById(id: number): Promise<MediaFile | undefined>;
  createMediaFile(mediaFile: InsertMediaFile): Promise<MediaFile>;
  deleteMediaFile(id: number): Promise<boolean>;

  // Resources
  getResources(articleId?: number): Promise<Resource[]>;
  getResourceById(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  deleteResource(id: number): Promise<boolean>;

  // Content Sections
  getContentSections(articleId: number): Promise<ContentSection[]>;
  createContentSection(section: InsertContentSection): Promise<ContentSection>;
  updateContentSection(id: number, section: Partial<InsertContentSection>): Promise<ContentSection | undefined>;
  deleteContentSection(id: number): Promise<boolean>;

  // Newsletter Subscribers
  getSubscribers(): Promise<Subscriber[]>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  updateSubscriber(id: number, subscriber: Partial<InsertSubscriber>): Promise<Subscriber | undefined>;
  deleteSubscriber(id: number): Promise<boolean>;

  // Contact Form Submissions
  getContacts(): Promise<Contact[]>;
  getContactById(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContactStatus(id: number, status: string): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private articles: Map<number, Article>;
  private mediaFiles: Map<number, MediaFile>;
  private resources: Map<number, Resource>;
  private contentSections: Map<number, ContentSection>;
  private subscribers: Map<number, Subscriber>;
  private contacts: Map<number, Contact>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private articleIdCounter: number;
  private mediaFileIdCounter: number;
  private resourceIdCounter: number;
  private contentSectionIdCounter: number;
  private subscriberIdCounter: number;
  private contactIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.articles = new Map();
    this.mediaFiles = new Map();
    this.resources = new Map();
    this.contentSections = new Map();
    this.subscribers = new Map();
    this.contacts = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.articleIdCounter = 1;
    this.mediaFileIdCounter = 1;
    this.resourceIdCounter = 1;
    this.contentSectionIdCounter = 1;
    this.subscriberIdCounter = 1;
    this.contactIdCounter = 1;

    // Initialize with default data
    this.initializeData();
  }

  // Initialize storage with sample data
  private initializeData() {
    // Create categories
    const contentCreationCategory = this.createCategory({
      name: "Content Creation",
      description: "Tools and techniques for creating engaging content without revealing your identity.",
      slug: "content-creation",
      icon: "video",
      articleCount: 12
    });

    const monetizationCategory = this.createCategory({
      name: "Monetization",
      description: "Strategies for generating income while protecting your privacy and personal information.",
      slug: "monetization",
      icon: "chart-line",
      articleCount: 18
    });

    const privacyToolsCategory = this.createCategory({
      name: "Privacy Tools",
      description: "Software and services to protect your identity while running your online business.",
      slug: "privacy-tools",
      icon: "shield-alt",
      articleCount: 15
    });

    const automationCategory = this.createCategory({
      name: "Automation",
      description: "Systems and processes to automate your business operations and scale efficiently.",
      slug: "automation",
      icon: "robot",
      articleCount: 9
    });

    // Create sample articles
    const article1 = this.createArticle({
      title: "Building Faceless YouTube Channels: A Complete Guide",
      slug: "building-faceless-youtube-channels",
      excerpt: "Learn how to create, grow, and monetize YouTube channels without ever showing your face or revealing your identity.",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=600&h=400&q=80",
      publishedDate: new Date("2023-05-15"),
      updatedDate: new Date("2023-05-15"),
      categoryId: contentCreationCategory.id,
      category: "Strategy",
      readTime: "12 min",
      tags: ["youtube", "faceless-content", "monetization"],
      featured: true,
      status: "published"
    });

    // Create content sections for article 1
    this.createContentSection({
      title: "Introduction to Faceless YouTube",
      content: "<p>Creating a successful YouTube channel traditionally required putting yourself in front of the camera. However, a growing trend of 'faceless' channels is proving that you can build a thriving audience without ever revealing your identity.</p><p>This comprehensive guide will walk you through every step of creating, growing, and monetizing a faceless YouTube channel in 2023 and beyond.</p>",
      order: 1,
      articleId: article1.id
    });

    this.createContentSection({
      title: "Choosing Your Niche",
      content: "<p>The key to a successful faceless channel is selecting the right niche. Some content categories lend themselves naturally to faceless presentation, including:</p><ul><li>Stock market and investment analysis</li><li>Software tutorials and reviews</li><li>Data visualization and infographics</li><li>News compilation and analysis</li><li>Historical documentaries</li></ul><p>The ideal niche should have strong viewer interest but not require your face or personality as the main attraction.</p>",
      order: 2,
      articleId: article1.id
    });

    this.createContentSection({
      title: "Content Production Strategies",
      content: "<p>There are several proven formats for faceless content that engage viewers effectively:</p><ol><li>Screen recordings with voiceover</li><li>Animated explainers</li><li>Stock footage compilation with narration</li><li>Text-based slideshows with background music</li><li>AI-generated voiceovers (though human is preferred)</li></ol><p>Your production quality must be exceptionally high to compensate for the lack of personal connection. Focus on valuable information presented clearly and professionally.</p>",
      order: 3,
      articleId: article1.id
    });

    // Create media files for article 1
    this.createMediaFile({
      title: "Setting Up An Anonymous YouTube Channel",
      url: "https://example.com/videos/anonymous-youtube-setup.mp4",
      type: "video",
      description: "This video walks through the technical and legal setup required to operate a YouTube channel without revealing personal details.",
      thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&h=450&q=80",
      duration: "8:42",
      articleId: article1.id
    });

    this.createMediaFile({
      title: "Interview: Anonymous YouTube Creator",
      url: "https://example.com/audio/anonymous-creator-interview.mp3",
      type: "audio",
      description: "Listen to an interview with a successful faceless YouTube creator who generates over $50,000 monthly.",
      duration: "12:34",
      articleId: article1.id
    });

    // Create resources for article 1
    this.createResource({
      title: "Legal Structure Cheatsheet",
      description: "PDF guide to business structures that maximize privacy",
      url: "https://example.com/resources/legal-structure-cheatsheet.pdf",
      type: "pdf",
      articleId: article1.id
    });

    this.createResource({
      title: "YouTube Channel Starter Template",
      description: "Channel art and thumbnail templates for anonymous creators",
      url: "https://example.com/resources/youtube-templates.zip",
      type: "download",
      articleId: article1.id
    });

    // Create article 2
    const article2 = this.createArticle({
      title: "5 Anonymous Payment Processors for Digital Entrepreneurs",
      slug: "anonymous-payment-processors",
      excerpt: "Discover secure payment solutions that allow you to sell digital products without compromising your personal information.",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&h=400&q=80",
      publishedDate: new Date("2023-04-28"),
      updatedDate: new Date("2023-04-28"),
      categoryId: monetizationCategory.id,
      category: "Tools",
      readTime: "8 min",
      tags: ["payments", "privacy", "digital-products"],
      featured: true,
      status: "published"
    });

    // Create content for article 2
    this.createContentSection({
      title: "Why Payment Privacy Matters",
      content: "<p>For many digital entrepreneurs, maintaining personal privacy extends beyond content creation to financial transactions. Standard payment processors often require extensive personal information, potentially exposing your identity.</p><p>This guide examines five payment solutions that prioritize privacy while still providing reliable service for your digital business.</p>",
      order: 1,
      articleId: article2.id
    });

    // Create media for article 2
    this.createMediaFile({
      title: "Privacy-Focused Payment Setup",
      url: "https://example.com/videos/private-payment-setup.mp4",
      type: "video",
      description: "Step-by-step walkthrough of setting up anonymous payment processing.",
      thumbnail: "https://images.unsplash.com/photo-1559067096-49ebca3406aa?auto=format&fit=crop&w=800&h=450&q=80",
      duration: "10:15",
      articleId: article2.id
    });

    // Create article 3
    const article3 = this.createArticle({
      title: "Automating Your Business: Work Less, Earn More",
      slug: "automating-your-business",
      excerpt: "Step-by-step guide to setting up automation systems that let you generate income with minimal ongoing effort.",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&h=400&q=80",
      publishedDate: new Date("2023-05-03"),
      updatedDate: new Date("2023-05-03"),
      categoryId: automationCategory.id,
      category: "Automation",
      readTime: "15 min",
      tags: ["automation", "passive-income", "productivity"],
      featured: true,
      status: "published"
    });

    // Create special preview article
    const previewArticle = this.createArticle({
      title: "Starting an Anonymous Digital Agency",
      slug: "anonymous-digital-agency",
      excerpt: "The traditional advice for starting a service-based business often revolves around personal branding, networking events, and putting yourself in the spotlight. But what if that approach doesn't align with your personality or preferences?",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1508830524289-0adcbe822b40?auto=format&fit=crop&w=1200&h=600&q=80",
      publishedDate: new Date("2023-04-20"),
      updatedDate: new Date("2023-04-20"),
      categoryId: privacyToolsCategory.id,
      category: "Business Strategy",
      readTime: "14 min",
      tags: ["agency", "services", "anonymity"],
      featured: false,
      status: "published"
    });

    // Create content sections for preview article
    this.createContentSection({
      title: "Introduction",
      content: "<p>The traditional advice for starting a service-based business often revolves around personal branding, networking events, and putting yourself in the spotlight. But what if that approach doesn't align with your personality or preferences?</p><p>In this comprehensive guide, we'll explore how to build a successful digital agency while maintaining your privacy and working entirely behind the scenes.</p>",
      order: 1,
      articleId: previewArticle.id
    });

    this.createContentSection({
      title: "Why Anonymous Agency Models Work",
      content: "<p>Contrary to popular belief, clients care more about results than knowing your personal details. By focusing on delivering exceptional work rather than building a personal brand, you can attract high-quality clients who value performance over personality.</p>",
      order: 2,
      articleId: previewArticle.id
    });

    this.createContentSection({
      title: "Legal and Business Structure",
      content: "<p>Setting up the right business structure is crucial for maintaining anonymity while operating legally. Options include:</p><ul><li>Single-member LLCs with privacy protection</li><li>Using registered agent services</li><li>Operating in privacy-friendly jurisdictions</li><li>Creating a business entity separate from your personal identity</li></ul><p>Each approach has different implications for taxes, liability, and privacy.</p>",
      order: 3,
      articleId: previewArticle.id
    });

    // Create media for preview article
    this.createMediaFile({
      title: "Setting Up An Anonymous Agency",
      url: "https://example.com/videos/anonymous-agency-setup.mp4",
      type: "video",
      description: "This video walks through the technical and legal setup required to operate an agency without revealing personal details.",
      thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&h=450&q=80",
      duration: "8:42",
      articleId: previewArticle.id
    });

    this.createMediaFile({
      title: "Interview: Anonymous Agency Owner",
      url: "https://example.com/audio/anonymous-agency-interview.mp3",
      type: "audio",
      description: "Listen to an interview with a successful agency owner who maintains complete anonymity with clients.",
      duration: "12:34",
      articleId: previewArticle.id
    });

    // Create resources for preview article
    this.createResource({
      title: "Legal Structure Cheatsheet",
      description: "PDF guide to business structures that maximize privacy",
      url: "https://example.com/resources/legal-structure-cheatsheet.pdf",
      type: "pdf",
      articleId: previewArticle.id
    });

    this.createResource({
      title: "Agency Website Starter Template",
      description: "Code template for a privacy-focused agency site",
      url: "https://example.com/resources/agency-website-template.zip",
      type: "code",
      articleId: previewArticle.id
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    for (const category of this.categories.values()) {
      if (category.slug === slug) {
        return category;
      }
    }
    return undefined;
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updatedCategory = { ...category, ...updateData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Article methods
  async getArticles(options: {
    featured?: boolean;
    category?: string;
    tag?: string;
    search?: string;
    limit?: number;
  } = {}): Promise<Article[]> {
    let articles = Array.from(this.articles.values());

    // Apply filters
    if (options.featured !== undefined) {
      articles = articles.filter(article => article.featured === options.featured);
    }

    if (options.category) {
      const categorySlug = options.category.toLowerCase();
      articles = articles.filter(article => {
        // Check if the article belongs to this category
        const cat = this.categories.get(article.categoryId || 0);
        return cat?.slug === categorySlug || article.category?.toLowerCase() === options.category?.toLowerCase();
      });
    }

    if (options.tag) {
      const tag = options.tag.toLowerCase();
      articles = articles.filter(article => 
        article.tags?.some(t => t.toLowerCase() === tag)
      );
    }

    if (options.search) {
      const search = options.search.toLowerCase();
      articles = articles.filter(article => 
        article.title.toLowerCase().includes(search) || 
        article.excerpt.toLowerCase().includes(search) ||
        article.content?.toLowerCase().includes(search) ||
        article.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Sort by published date, newest first
    articles.sort((a, b) => 
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );

    // Apply limit
    if (options.limit) {
      articles = articles.slice(0, options.limit);
    }

    // Enhance articles with related data
    const enhancedArticles: Article[] = await Promise.all(
      articles.map(async article => this.enhanceArticle(article))
    );

    return enhancedArticles;
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    return this.enhanceArticle(article);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    for (const article of this.articles.values()) {
      if (article.slug === slug) {
        return this.enhanceArticle(article);
      }
    }
    return undefined;
  }

  async getArticlePreview(): Promise<Article | undefined> {
    // Get article with "anonymous-digital-agency" slug which is our preview article
    const previewArticle = Array.from(this.articles.values()).find(a => a.slug === "anonymous-digital-agency");
    if (!previewArticle) return undefined;
    
    return this.enhanceArticle(previewArticle);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.articleIdCounter++;
    const article: Article = { ...insertArticle, id };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: number, updateData: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;

    const updatedArticle = { ...article, ...updateData };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: number): Promise<boolean> {
    return this.articles.delete(id);
  }

  // Helper method to add related data to an article
  private async enhanceArticle(article: Article): Promise<Article> {
    // Get content sections for this article
    const sections = Array.from(this.contentSections.values())
      .filter(section => section.articleId === article.id)
      .sort((a, b) => a.order - b.order);

    // Get media files for this article
    const allMediaFiles = Array.from(this.mediaFiles.values())
      .filter(media => media.articleId === article.id);
    
    // Split media files by type
    const videoFiles = allMediaFiles.filter(media => media.type === 'video');
    const audioFiles = allMediaFiles.filter(media => media.type === 'audio');
    const images = allMediaFiles.filter(media => media.type === 'image');

    // Get resources for this article
    const articleResources = Array.from(this.resources.values())
      .filter(resource => resource.articleId === article.id);

    // Get related articles (simple implementation - just get other articles)
    const relatedArticles = Array.from(this.articles.values())
      .filter(a => a.id !== article.id && a.categoryId === article.categoryId)
      .slice(0, 3);
    
    const enhancedRelatedArticles = relatedArticles.map(a => ({
      id: a.id,
      title: a.title,
      excerpt: a.excerpt,
      featuredImage: a.featuredImage,
      slug: a.slug
    }));

    return {
      ...article,
      contentSections: sections,
      videoFiles,
      audioFiles,
      images,
      resources: articleResources,
      relatedArticles: enhancedRelatedArticles as any
    };
  }

  // Media File methods
  async getMediaFiles(articleId?: number): Promise<MediaFile[]> {
    let files = Array.from(this.mediaFiles.values());
    
    if (articleId !== undefined) {
      files = files.filter(file => file.articleId === articleId);
    }
    
    return files;
  }

  async getMediaFileById(id: number): Promise<MediaFile | undefined> {
    return this.mediaFiles.get(id);
  }

  async createMediaFile(insertMediaFile: InsertMediaFile): Promise<MediaFile> {
    const id = this.mediaFileIdCounter++;
    const mediaFile: MediaFile = { ...insertMediaFile, id, createdAt: new Date() };
    this.mediaFiles.set(id, mediaFile);
    return mediaFile;
  }

  async deleteMediaFile(id: number): Promise<boolean> {
    return this.mediaFiles.delete(id);
  }

  // Resource methods
  async getResources(articleId?: number): Promise<Resource[]> {
    let resources = Array.from(this.resources.values());
    
    if (articleId !== undefined) {
      resources = resources.filter(resource => resource.articleId === articleId);
    }
    
    return resources;
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.resourceIdCounter++;
    const resource: Resource = { ...insertResource, id, createdAt: new Date() };
    this.resources.set(id, resource);
    return resource;
  }

  async deleteResource(id: number): Promise<boolean> {
    return this.resources.delete(id);
  }

  // Content Section methods
  async getContentSections(articleId: number): Promise<ContentSection[]> {
    return Array.from(this.contentSections.values())
      .filter(section => section.articleId === articleId)
      .sort((a, b) => a.order - b.order);
  }

  async createContentSection(insertContentSection: InsertContentSection): Promise<ContentSection> {
    const id = this.contentSectionIdCounter++;
    const section: ContentSection = { ...insertContentSection, id };
    this.contentSections.set(id, section);
    return section;
  }

  async updateContentSection(id: number, updateData: Partial<InsertContentSection>): Promise<ContentSection | undefined> {
    const section = this.contentSections.get(id);
    if (!section) return undefined;

    const updatedSection = { ...section, ...updateData };
    this.contentSections.set(id, updatedSection);
    return updatedSection;
  }

  async deleteContentSection(id: number): Promise<boolean> {
    return this.contentSections.delete(id);
  }

  // Newsletter Subscribers methods
  async getSubscribers(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values());
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    for (const subscriber of this.subscribers.values()) {
      if (subscriber.email.toLowerCase() === email.toLowerCase()) {
        return subscriber;
      }
    }
    return undefined;
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.subscriberIdCounter++;
    const subscriber: Subscriber = { 
      ...insertSubscriber, 
      id, 
      status: 'active', 
      createdAt: new Date() 
    };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }

  async updateSubscriber(id: number, updateData: Partial<InsertSubscriber>): Promise<Subscriber | undefined> {
    const subscriber = this.subscribers.get(id);
    if (!subscriber) return undefined;

    const updatedSubscriber = { ...subscriber, ...updateData };
    this.subscribers.set(id, updatedSubscriber);
    return updatedSubscriber;
  }

  async deleteSubscriber(id: number): Promise<boolean> {
    return this.subscribers.delete(id);
  }

  // Contact Form Submissions methods
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async getContactById(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactIdCounter++;
    const contact: Contact = { 
      ...insertContact, 
      id, 
      status: 'new', 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContactStatus(id: number, status: string): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;

    const updatedContact = { ...contact, status };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  async deleteContact(id: number): Promise<boolean> {
    return this.contacts.delete(id);
  }
}

import { DatabaseStorage } from './database-storage';

// Use the DatabaseStorage implementation for persistent storage
export const storage = new DatabaseStorage();
