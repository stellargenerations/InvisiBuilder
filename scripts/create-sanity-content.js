/**
 * Sample Sanity Content Creation Script
 * 
 * This script creates sample content in your Sanity.io project.
 * 
 * Prerequisites:
 * - SANITY_PROJECT_ID environment variable
 * - SANITY_DATASET environment variable (usually "invisibuilder")
 * - SANITY_API_TOKEN environment variable (with write permissions)
 */

import { createClient } from '@sanity/client';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

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

// Helper function to create a Sanity slug from a string
function createSlug(str) {
  return {
    _type: 'slug',
    current: str.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  };
}

// Create categories
async function createCategories() {
  console.log('Creating sample categories...');
  
  const categories = [
    {
      _type: 'category',
      name: 'Web Development',
      slug: createSlug('web-development'),
      description: 'Articles about web development technologies and practices',
      icon: 'code',
      articleCount: 0,
    },
    {
      _type: 'category',
      name: 'Design',
      slug: createSlug('design'),
      description: 'Resources and guides for UI/UX design',
      icon: 'palette',
      articleCount: 0,
    },
    {
      _type: 'category',
      name: 'Business',
      slug: createSlug('business'),
      description: 'Tips and strategies for running a successful business',
      icon: 'briefcase',
      articleCount: 0,
    },
  ];
  
  const categoryIds = {};
  
  for (const category of categories) {
    try {
      const result = await sanityClient.create(category);
      categoryIds[category.name] = result._id;
      console.log(`Created category: ${category.name}`);
    } catch (error) {
      console.error(`Error creating category ${category.name}:`, error);
    }
  }
  
  return categoryIds;
}

// Create a sample article
async function createSampleArticle(categoryId) {
  console.log('Creating sample article...');
  
  const article = {
    _type: 'article',
    title: 'Getting Started with Invisibuilder',
    slug: createSlug('getting-started-with-invisibuilder'),
    excerpt: 'Learn how to use Invisibuilder to showcase your integrated content pages with various media types.',
    category: {
      _type: 'reference',
      _ref: categoryId,
    },
    author: 'Invisibuilder Team',
    publishedDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    featured: true,
    tags: ['tutorial', 'getting-started', 'guide'],
    readTime: 5,
    views: 0,
    content: '',
    featuredImage: 'https://source.unsplash.com/random/1200x630?website',
    status: 'published',
  };
  
  try {
    const result = await sanityClient.create(article);
    console.log(`Created article: ${article.title}`);
    return result._id;
  } catch (error) {
    console.error(`Error creating article:`, error);
    return null;
  }
}

// Create content sections for an article
async function createContentSection(articleId) {
  console.log('Creating content sections...');
  
  const sections = [
    {
      _type: 'contentSection',
      title: 'Introduction',
      articleId: {
        _type: 'reference',
        _ref: articleId,
      },
      position: 1,
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Welcome to Invisibuilder! This guide will help you get started with creating and managing content on our platform.',
            },
          ],
          style: 'normal',
        },
      ],
    },
    {
      _type: 'contentSection',
      title: 'Features Overview',
      articleId: {
        _type: 'reference',
        _ref: articleId,
      },
      position: 2,
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Invisibuilder offers a range of features designed to help you showcase your content effectively:',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: '• Content organization with categories and tags',
            },
          ],
          style: 'bullet',
          level: 1,
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: '• Integrated media including images, videos, and documents',
            },
          ],
          style: 'bullet',
          level: 1,
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: '• Advanced search functionality',
            },
          ],
          style: 'bullet',
          level: 1,
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: '• User authentication for content creators',
            },
          ],
          style: 'bullet',
          level: 1,
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: '• Analytics dashboard for tracking content performance',
            },
          ],
          style: 'bullet',
          level: 1,
        },
      ],
    },
    {
      _type: 'contentSection',
      title: 'Getting Started',
      articleId: {
        _type: 'reference',
        _ref: articleId,
      },
      position: 3,
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'To get started with Invisibuilder, follow these simple steps:',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: '1. Sign up for an account',
            },
          ],
          style: 'number',
          level: 1,
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: '2. Create your first category',
            },
          ],
          style: 'number',
          level: 1,
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: '3. Add an article with content sections',
            },
          ],
          style: 'number',
          level: 1,
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: '4. Upload media and resources',
            },
          ],
          style: 'number',
          level: 1,
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: '5. Publish your content',
            },
          ],
          style: 'number',
          level: 1,
        },
      ],
    },
  ];
  
  for (const section of sections) {
    try {
      const result = await sanityClient.create(section);
      console.log(`Created content section: ${section.title}`);
    } catch (error) {
      console.error(`Error creating content section ${section.title}:`, error);
    }
  }
}

// Main function to create sample content
async function createSampleContent() {
  console.log('Creating sample content in Sanity.io...');
  
  try {
    // Create categories
    const categoryIds = await createCategories();
    
    // Create a sample article in the Web Development category
    const articleId = await createSampleArticle(categoryIds['Web Development']);
    
    if (articleId) {
      // Create content sections for the article
      await createContentSection(articleId);
      
      // Create a resource linked to the article
      const resource = {
        _type: 'resource',
        title: 'Invisibuilder Documentation',
        description: 'Official documentation for Invisibuilder',
        url: 'https://docs.example.com/invisibuilder',
        resourceType: 'documentation',
        icon: 'book',
        article: {
          _type: 'reference',
          _ref: articleId,
        },
        createdAt: new Date().toISOString(),
      };
      
      await sanityClient.create(resource);
      console.log('Created resource: Invisibuilder Documentation');
      
      // Create a media file linked to the article
      const mediaFile = {
        _type: 'mediaFile',
        title: 'Invisibuilder Cheatsheet',
        description: 'A quick reference guide for Invisibuilder',
        fileType: 'pdf',
        file: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: `file-${uuidv4()}-pdf`,
          },
        },
        altText: 'Invisibuilder Quick Reference PDF',
        article: {
          _type: 'reference',
          _ref: articleId,
        },
        createdAt: new Date().toISOString(),
      };
      
      await sanityClient.create(mediaFile);
      console.log('Created media file: Invisibuilder Cheatsheet');
    }
    
    console.log('Sample content creation complete!');
  } catch (error) {
    console.error('Error creating sample content:', error);
  }
}

// Run the content creation
createSampleContent();