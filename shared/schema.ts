import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model for admin users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Category model
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  articleCount: integer("article_count").default(0),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Media file model for various media types
export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(), // video, audio, image, document
  description: text("description"),
  thumbnail: text("thumbnail"),
  duration: text("duration"),
  articleId: integer("article_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMediaFileSchema = createInsertSchema(mediaFiles).omit({
  id: true,
  createdAt: true,
});

export type InsertMediaFile = z.infer<typeof insertMediaFileSchema>;
export type MediaFile = typeof mediaFiles.$inferSelect;

// Resource model for downloadable content
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(), // pdf, code, link
  articleId: integer("article_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

// Article content section model
export const contentSections = pgTable("content_sections", {
  id: serial("id").primaryKey(),
  title: text("title"),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  articleId: integer("article_id").notNull(),
});

export const insertContentSectionSchema = createInsertSchema(contentSections).omit({
  id: true,
});

export type InsertContentSection = z.infer<typeof insertContentSectionSchema>;
export type ContentSection = typeof contentSections.$inferSelect;

// Article model
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content"),
  featuredImage: text("featured_image").notNull(),
  publishedDate: timestamp("published_date").defaultNow(),
  updatedDate: timestamp("updated_date").defaultNow(),
  categoryId: integer("category_id"),
  category: text("category"),
  readTime: text("read_time").default("5 min"),
  tags: text("tags").array(),
  featured: boolean("featured").default(false),
  status: text("status").default("published"), // draft, published
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
}).extend({
  featured: z.boolean().default(false),
  status: z.string().default("published"),
  publishedDate: z.date().optional().default(() => new Date()),
  updatedDate: z.date().optional().default(() => new Date()),
  tags: z.array(z.string()).optional().default([]),
  content: z.string().optional().default(""),
  categoryId: z.number().optional().nullable(),
  category: z.string().optional().nullable(),
  readTime: z.string().optional().default("5 min"),
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect & {
  contentSections?: ContentSection[];
  videoFiles?: MediaFile[];
  audioFiles?: MediaFile[];
  images?: MediaFile[];
  resources?: Resource[];
  relatedArticles?: Article[];
};

// Newsletter subscribers
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  consent: boolean("consent").default(true),
  status: text("status").default("active"), // active, unsubscribed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  createdAt: true,
}).extend({
  status: z.enum(['active', 'unsubscribed']).optional().default('active'),
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

// Contact form submissions
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  status: text("status").default("new"), // new, read, responded
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Custom newsletter subscription schema for form validation
export const newsletterSubscriptionSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  consent: z.boolean().refine(val => val === true, {
    message: "You must agree to receive emails"
  })
});

export type NewsletterSubscription = z.infer<typeof newsletterSubscriptionSchema>;
