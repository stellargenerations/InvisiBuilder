/**
 * PostgreSQL to Sanity.io Migration Script
 * 
 * This script migrates data from our PostgreSQL database to Sanity.io.
 * Make sure to set up the following environment variables before running:
 * - DATABASE_URL: PostgreSQL connection string
 * - SANITY_PROJECT_ID: Your Sanity project ID
 * - SANITY_DATASET: Your Sanity dataset name (usually "production")
 * - SANITY_API_TOKEN: A token with write permissions
 */

import { createClient } from '@sanity/client';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Sanity client
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2023-03-04',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Initialize PostgreSQL client
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// Load schemas dynamically
import * as schema from '../shared/schema.js' assert { type: 'json' };

// Map of PostgreSQL IDs to Sanity document IDs
const idMap = {
  categories: {},
  articles: {},
  mediaFiles: {},
  resources: {},
  contentSections: {},
  subscribers: {},
  contacts: {},
};

// Helper function to create a Sanity slug from a string
function createSlug(str) {
  return {
    _type: 'slug',
    current: str,
  };
}

// Migration functions for each content type
async function migrateCategories() {
  console.log('Migrating categories...');
  
  try {
    const categories = await db.select().from(schema.categories);
    
    for (const category of categories) {
      // Create the Sanity document
      const sanityCategory = {
        _type: 'category',
        name: category.name,
        slug: createSlug(category.slug),
        description: category.description,
        icon: category.icon,
        articleCount: category.articleCount || 0,
      };
      
      // Create in Sanity
      const result = await sanityClient.create(sanityCategory);
      
      // Store the ID mapping
      idMap.categories[category.id] = result._id;
      
      console.log(`Migrated category: ${category.name}`);
    }
    
    console.log(`Migrated ${categories.length} categories`);
  } catch (error) {
    console.error('Error migrating categories:', error);
  }
}

async function migrateArticles() {
  console.log('Migrating articles...');
  
  try {
    const articles = await db.select().from(schema.articles);
    
    for (const article of articles) {
      // Create the Sanity document
      const sanityArticle = {
        _type: 'article',
        title: article.title,
        slug: createSlug(article.slug),
        excerpt: article.excerpt,
        category: {
          _type: 'reference',
          _ref: idMap.categories[article.categoryId],
        },
        author: article.author,
        publishedDate: article.publishedDate,
        updatedDate: article.updatedDate,
        featured: article.featured || false,
        tags: article.tags || [],
        readTime: article.readTime || 5,
        views: article.views || 0,
        // We'll handle images separately due to Sanity's asset handling
      };
      
      // Create in Sanity
      const result = await sanityClient.create(sanityArticle);
      
      // Store the ID mapping
      idMap.articles[article.id] = result._id;
      
      console.log(`Migrated article: ${article.title}`);
    }
    
    console.log(`Migrated ${articles.length} articles`);
  } catch (error) {
    console.error('Error migrating articles:', error);
  }
}

async function migrateContentSections() {
  console.log('Migrating content sections...');
  
  try {
    const sections = await db.select().from(schema.contentSections);
    
    for (const section of sections) {
      // Create the Sanity document
      const sanitySection = {
        _type: 'contentSection',
        title: section.title,
        articleId: {
          _type: 'reference',
          _ref: idMap.articles[section.articleId],
        },
        position: section.position,
        content: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: section.content,
              },
            ],
            style: 'normal',
          },
        ],
      };
      
      // Create in Sanity
      const result = await sanityClient.create(sanitySection);
      
      // Store the ID mapping
      idMap.contentSections[section.id] = result._id;
      
      console.log(`Migrated content section: ${section.title}`);
    }
    
    console.log(`Migrated ${sections.length} content sections`);
  } catch (error) {
    console.error('Error migrating content sections:', error);
  }
}

async function migrateMediaFiles() {
  console.log('Migrating media files...');
  
  try {
    const mediaFiles = await db.select().from(schema.mediaFiles);
    
    for (const mediaFile of mediaFiles) {
      // For actual migration, you would need to upload the files to Sanity
      // Here we're just creating placeholder references
      const sanityMediaFile = {
        _type: 'mediaFile',
        title: mediaFile.title,
        description: mediaFile.description || '',
        fileType: mediaFile.fileType,
        // This is a placeholder. In practice, you'd need to upload the file to Sanity
        file: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: `file-${uuidv4()}-pdf`,
          },
        },
        altText: mediaFile.altText || '',
        article: mediaFile.articleId ? {
          _type: 'reference',
          _ref: idMap.articles[mediaFile.articleId],
        } : undefined,
        createdAt: mediaFile.createdAt || new Date().toISOString(),
      };
      
      // Create in Sanity
      const result = await sanityClient.create(sanityMediaFile);
      
      // Store the ID mapping
      idMap.mediaFiles[mediaFile.id] = result._id;
      
      console.log(`Migrated media file: ${mediaFile.title}`);
    }
    
    console.log(`Migrated ${mediaFiles.length} media files`);
  } catch (error) {
    console.error('Error migrating media files:', error);
  }
}

async function migrateResources() {
  console.log('Migrating resources...');
  
  try {
    const resources = await db.select().from(schema.resources);
    
    for (const resource of resources) {
      // Create the Sanity document
      const sanityResource = {
        _type: 'resource',
        title: resource.title,
        description: resource.description || '',
        url: resource.url,
        resourceType: resource.resourceType,
        icon: resource.icon || '',
        article: resource.articleId ? {
          _type: 'reference',
          _ref: idMap.articles[resource.articleId],
        } : undefined,
        createdAt: resource.createdAt || new Date().toISOString(),
      };
      
      // Create in Sanity
      const result = await sanityClient.create(sanityResource);
      
      // Store the ID mapping
      idMap.resources[resource.id] = result._id;
      
      console.log(`Migrated resource: ${resource.title}`);
    }
    
    console.log(`Migrated ${resources.length} resources`);
  } catch (error) {
    console.error('Error migrating resources:', error);
  }
}

async function migrateSubscribers() {
  console.log('Migrating subscribers...');
  
  try {
    const subscribers = await db.select().from(schema.subscribers);
    
    for (const subscriber of subscribers) {
      // Create the Sanity document
      const sanitySubscriber = {
        _type: 'subscriber',
        email: subscriber.email,
        name: subscriber.name || '',
        subscriptionDate: subscriber.subscriptionDate || new Date().toISOString(),
        status: subscriber.status || 'active',
        preferences: subscriber.preferences || [],
        lastEmailSent: subscriber.lastEmailSent,
      };
      
      // Create in Sanity
      const result = await sanityClient.create(sanitySubscriber);
      
      // Store the ID mapping
      idMap.subscribers[subscriber.id] = result._id;
      
      console.log(`Migrated subscriber: ${subscriber.email}`);
    }
    
    console.log(`Migrated ${subscribers.length} subscribers`);
  } catch (error) {
    console.error('Error migrating subscribers:', error);
  }
}

async function migrateContacts() {
  console.log('Migrating contacts...');
  
  try {
    const contacts = await db.select().from(schema.contacts);
    
    for (const contact of contacts) {
      // Create the Sanity document
      const sanityContact = {
        _type: 'contact',
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        submittedAt: contact.submittedAt || new Date().toISOString(),
        status: contact.status || 'new',
        notes: contact.notes || '',
      };
      
      // Create in Sanity
      const result = await sanityClient.create(sanityContact);
      
      // Store the ID mapping
      idMap.contacts[contact.id] = result._id;
      
      console.log(`Migrated contact: ${contact.email}`);
    }
    
    console.log(`Migrated ${contacts.length} contacts`);
  } catch (error) {
    console.error('Error migrating contacts:', error);
  }
}

// Main migration function
async function migrateAll() {
  console.log('Starting migration from PostgreSQL to Sanity.io...');
  
  // Migration happens in sequence to preserve references
  await migrateCategories();
  await migrateArticles();
  await migrateContentSections();
  await migrateMediaFiles();
  await migrateResources();
  await migrateSubscribers();
  await migrateContacts();
  
  // Save the ID mapping to a file for reference
  fs.writeFileSync(
    path.join(__dirname, 'id-mapping.json'),
    JSON.stringify(idMap, null, 2)
  );
  
  console.log('Migration complete! ID mapping saved to id-mapping.json');
  
  // Close the PostgreSQL connection
  await pool.end();
}

// Run the migration
migrateAll().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});