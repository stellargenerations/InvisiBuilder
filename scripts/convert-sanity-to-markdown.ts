import fs from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';
import { createClient } from '@sanity/client';

// Sanity client setup
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'invisibuilder',
  useCdn: false, // Set to `true` for production
  apiVersion: '2023-05-03', // Use the latest API version
  token: process.env.SANITY_API_TOKEN, // Only needed for write operations
});

// Directory paths
const contentDir = path.join(process.cwd(), 'content');
const articlesDir = path.join(contentDir, 'articles');
const categoriesDir = path.join(contentDir, 'categories');

// Ensure directories exist
fs.ensureDirSync(articlesDir);
fs.ensureDirSync(categoriesDir);

// Helper function to create slug from string
function createSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Convert Portable Text to Markdown (simplified version)
function portableTextToMarkdown(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) {
    return '';
  }

  return blocks
    .map(block => {
      // Handle different block types
      if (block._type === 'block') {
        // Basic text blocks
        let text = block.children
          .map((child: any) => {
            let childText = child.text || '';
            
            // Apply marks (bold, italic, etc.)
            if (child.marks && child.marks.length > 0) {
              child.marks.forEach((mark: string) => {
                if (mark === 'strong') childText = `**${childText}**`;
                if (mark === 'em') childText = `*${childText}*`;
                if (mark === 'code') childText = '`' + childText + '`';
                // Handle other marks as needed
              });
            }
            
            return childText;
          })
          .join('');

        // Apply block style
        switch (block.style) {
          case 'h1': return `# ${text}`;
          case 'h2': return `## ${text}`;
          case 'h3': return `### ${text}`;
          case 'h4': return `#### ${text}`;
          case 'h5': return `##### ${text}`;
          case 'h6': return `###### ${text}`;
          case 'blockquote': return `> ${text}`;
          // Handle other block styles
          default: return text;
        }
      } else if (block._type === 'image') {
        // Handle images
        const imgUrl = block.asset && block.asset._ref 
          ? `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID}/${process.env.SANITY_DATASET}/${block.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`
          : '';
        
        return `![${block.alt || ''}](${imgUrl})`;
      } else if (block._type === 'code') {
        // Handle code blocks
        return '```' + (block.language || '') + '\n' + (block.code || '') + '\n```';
      } else if (block._type === 'markdown') {
        // Pass through existing markdown
        return block.markdownText || '';
      }
      
      // Default for unknown block types
      return '';
    })
    .join('\n\n');
}

// Convert Sanity categories to markdown files
async function convertCategories() {
  try {
    console.log('Converting categories...');
    
    // Fetch all categories from Sanity
    const query = '*[_type == "category"]';
    const categories = await client.fetch(query);
    
    for (const category of categories) {
      const { name, description, icon, slug, _id } = category;
      const categorySlug = slug?.current || createSlug(name);
      
      // Create frontmatter
      const frontmatter = {
        name,
        description: description || '',
        icon: icon || '',
        _id,
      };
      
      // Convert to YAML frontmatter format
      const yamlFrontmatter = Object.entries(frontmatter)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n');
      
      // Create markdown file content
      const fileContent = `---\n${yamlFrontmatter}\n---\n`;
      
      // Write to file
      const filePath = path.join(categoriesDir, `${categorySlug}.md`);
      await fs.writeFile(filePath, fileContent, 'utf8');
      
      console.log(`Converted category: ${name}`);
    }
    
    console.log(`Converted ${categories.length} categories`);
  } catch (error) {
    console.error('Error converting categories:', error);
  }
}

// Convert Sanity articles to markdown files
async function convertArticles() {
  try {
    console.log('Converting articles...');
    
    // Fetch all articles from Sanity
    const query = '*[_type == "article"]';
    const articles = await client.fetch(query);
    
    for (const article of articles) {
      const { 
        title, 
        slug, 
        excerpt, 
        publishedDate, 
        updatedDate, 
        author, 
        category,
        tags,
        featured,
        coverImage,
        content,
        contentSections,
        _id
      } = article;
      
      const articleSlug = slug?.current || createSlug(title);
      
      // Convert content to markdown
      let markdownContent = '';
      
      if (content && content.length > 0) {
        // If using Portable Text directly
        markdownContent = portableTextToMarkdown(content);
      } else if (contentSections && contentSections.length > 0) {
        // If using content sections
        for (const section of contentSections) {
          // Add section title if exists
          if (section.title) {
            markdownContent += `## ${section.title}\n\n`;
          }
          
          // Add section content based on type
          if (section._type === 'textSection' && section.text) {
            markdownContent += portableTextToMarkdown(section.text) + '\n\n';
          } else if (section._type === 'markdownSection' && section.markdownText) {
            markdownContent += section.markdownText + '\n\n';
          } else if (section._type === 'imageSection' && section.image) {
            const imgUrl = section.image.asset && section.image.asset._ref 
              ? `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID}/${process.env.SANITY_DATASET}/${section.image.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`
              : '';
            
            markdownContent += `![${section.caption || ''}](${imgUrl})\n\n`;
            
            if (section.caption) {
              markdownContent += `*${section.caption}*\n\n`;
            }
          }
        }
      }
      
      // Create frontmatter
      const frontmatter: any = {
        title,
        excerpt: excerpt || '',
        publishedDate: publishedDate || new Date().toISOString(),
        updatedDate: updatedDate || new Date().toISOString(),
        author: author?.name || '',
        featured: !!featured,
        _id,
      };
      
      // Add category reference
      if (category && category._ref) {
        frontmatter.category = category._ref;
      }
      
      // Add tags
      if (tags && Array.isArray(tags)) {
        frontmatter.tags = tags;
      }
      
      // Add cover image
      if (coverImage && coverImage.asset && coverImage.asset._ref) {
        frontmatter.coverImage = `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID}/${process.env.SANITY_DATASET}/${coverImage.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`;
      }
      
      // Convert to YAML frontmatter format
      const yamlFrontmatter = Object.entries(frontmatter)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n');
      
      // Create markdown file content
      const fileContent = `---\n${yamlFrontmatter}\n---\n\n${markdownContent}`;
      
      // Write to file
      const filePath = path.join(articlesDir, `${articleSlug}.md`);
      await fs.writeFile(filePath, fileContent, 'utf8');
      
      console.log(`Converted article: ${title}`);
    }
    
    console.log(`Converted ${articles.length} articles`);
  } catch (error) {
    console.error('Error converting articles:', error);
  }
}

// Main conversion function
async function convertSanityToMarkdown() {
  try {
    console.log('Starting conversion from Sanity to Markdown...');
    
    // Convert categories first (articles may reference them)
    await convertCategories();
    
    // Then convert articles
    await convertArticles();
    
    console.log('Conversion completed successfully!');
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

// Run the conversion
convertSanityToMarkdown();