/**
 * Sample Sanity Content Creation Script
 * 
 * This script creates sample content in your Sanity.io project.
 * 
 * Prerequisites:
 * - SANITY_PROJECT_ID environment variable
 * - SANITY_DATASET environment variable
 * - SANITY_API_TOKEN environment variable (with write permissions)
 */

const { createClient } = require('@sanity/client');
require('dotenv').config();

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
    current: str,
  };
}

// Sample data
const sampleCategories = [
  {
    _type: 'category',
    name: 'Web Development',
    slug: createSlug('web-development'),
    description: 'Articles about web development technologies and practices',
    icon: 'code',
  },
  {
    _type: 'category',
    name: 'Design',
    slug: createSlug('design'),
    description: 'UI/UX design principles and best practices',
    icon: 'brush',
  },
  {
    _type: 'category',
    name: 'Business',
    slug: createSlug('business'),
    description: 'Business strategy and entrepreneurship',
    icon: 'briefcase',
  },
];

// Create categories
async function createCategories() {
  console.log('Creating categories...');
  
  const categories = {};
  
  for (const category of sampleCategories) {
    try {
      const result = await sanityClient.create(category);
      categories[category.slug.current] = result._id;
      console.log(`Created category: ${category.name}`);
    } catch (error) {
      console.error(`Error creating category ${category.name}:`, error.message);
    }
  }
  
  return categories;
}

// Create a sample article
async function createSampleArticle(categoryId) {
  const article = {
    _type: 'article',
    title: 'Getting Started with Sanity.io',
    slug: createSlug('getting-started-with-sanity'),
    excerpt: 'Learn how to use Sanity.io as a powerful headless CMS for your web projects.',
    category: {
      _type: 'reference',
      _ref: categoryId,
    },
    content: [
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'Introduction to Sanity',
          },
        ],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Sanity.io is a headless CMS that offers a flexible and customizable approach to content management. Unlike traditional CMS platforms, Sanity separates the content from its presentation, allowing developers to build applications with any frontend technology while maintaining a structured content backend.',
          },
        ],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'Key Features',
          },
        ],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Some of the key features that make Sanity stand out include:',
          },
        ],
      },
      {
        _type: 'block',
        style: 'bullet',
        listItem: 'bullet',
        children: [
          {
            _type: 'span',
            text: 'Customizable studio built with React',
          },
        ],
      },
      {
        _type: 'block',
        style: 'bullet',
        listItem: 'bullet',
        children: [
          {
            _type: 'span',
            text: 'Real-time collaborative editing',
          },
        ],
      },
      {
        _type: 'block',
        style: 'bullet',
        listItem: 'bullet',
        children: [
          {
            _type: 'span',
            text: 'Powerful APIs for content delivery',
          },
        ],
      },
      {
        _type: 'block',
        style: 'bullet',
        listItem: 'bullet',
        children: [
          {
            _type: 'span',
            text: 'Flexible content modeling',
          },
        ],
      },
    ],
    publishedDate: new Date().toISOString(),
    readTime: '5 min read',
    tags: ['CMS', 'Web Development', 'Content Management'],
    featured: true,
    status: 'published',
  };
  
  try {
    const result = await sanityClient.create(article);
    console.log(`Created article: ${article.title}`);
    return result._id;
  } catch (error) {
    console.error(`Error creating article:`, error.message);
    return null;
  }
}

// Create content section
async function createContentSection(articleId) {
  const section = {
    _type: 'contentSection',
    title: 'Getting Started',
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
            text: 'To get started with Sanity, you need to install the Sanity CLI and create a new project.',
          },
        ],
        style: 'normal',
      },
    ],
  };
  
  try {
    const result = await sanityClient.create(section);
    console.log(`Created content section: ${section.title}`);
    return result._id;
  } catch (error) {
    console.error(`Error creating content section:`, error.message);
    return null;
  }
}

// Main function
async function createSampleContent() {
  console.log('Creating sample content in Sanity...');
  
  // Create categories first
  const categories = await createCategories();
  
  if (Object.keys(categories).length === 0) {
    console.error('Failed to create categories. Aborting.');
    return;
  }
  
  // Create a sample article in the Web Development category
  const webDevCategoryId = categories['web-development'];
  const articleId = await createSampleArticle(webDevCategoryId);
  
  if (!articleId) {
    console.error('Failed to create article. Aborting.');
    return;
  }
  
  // Create a content section for the article
  await createContentSection(articleId);
  
  console.log('Sample content creation complete!');
}

// Run the script
createSampleContent().catch(error => {
  console.error('Content creation failed:', error);
  process.exit(1);
});