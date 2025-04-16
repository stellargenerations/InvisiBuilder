import fs from 'fs-extra';
import { join } from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { glob } from 'glob';

// Define types for our content
export interface Article {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  publishedDate: string;
  updatedDate?: string;
  author?: string;
  category?: string;
  categories?: string[];
  tags?: string[];
  featured?: boolean;
  coverImage?: string;
  _id?: string;
  readTime?: number;
  [key: string]: any; // For any additional properties
}

export interface Category {
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  articleCount?: number;
  _id?: string;
  [key: string]: any; // For any additional properties
}

const articlesDirectory = join(process.cwd(), 'content/articles');
const categoriesDirectory = join(process.cwd(), 'content/categories');

// Article functions
export async function getAllArticles(): Promise<Article[]> {
  const articleFiles = await glob('*.md', { cwd: articlesDirectory });
  
  const articles = await Promise.all(
    articleFiles.map(async (filename) => {
      const slug = filename.replace(/\.md$/, '');
      const article = await getArticleBySlug(slug);
      return article as Article;
    })
  );
  
  // Filter out null values and sort articles by date in descending order
  return articles
    .filter((article): article is Article => article !== null)
    .sort((a, b) => {
      if ((a.publishedDate || '') < (b.publishedDate || '')) {
        return 1;
      } else {
        return -1;
      }
    });
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const fullPath = join(articlesDirectory, `${slug}.md`);
  
  try {
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Convert markdown to HTML
    const processedContent = await remark()
      .use(html)
      .process(content);
    
    const htmlContent = processedContent.toString();
    
    return {
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      content: htmlContent,
      publishedDate: data.publishedDate || new Date().toISOString(),
      ...data,
    } as Article;
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter(article => 
    article.category === categorySlug || 
    (article.categories && article.categories.includes(categorySlug))
  );
}

export async function getArticlesByTag(tag: string): Promise<Article[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter(article => 
    article.tags && article.tags.includes(tag)
  );
}

export async function searchArticles(query: string): Promise<Article[]> {
  const allArticles = await getAllArticles();
  const lowerCaseQuery = query.toLowerCase();
  
  return allArticles.filter(article => 
    article.title.toLowerCase().includes(lowerCaseQuery) ||
    article.excerpt.toLowerCase().includes(lowerCaseQuery) ||
    (article.content && article.content.toLowerCase().includes(lowerCaseQuery))
  );
}

// Category functions
export async function getAllCategories(): Promise<Category[]> {
  const categoryFiles = await glob('*.md', { cwd: categoriesDirectory });
  
  const categories = await Promise.all(
    categoryFiles.map(async (filename) => {
      const slug = filename.replace(/\.md$/, '');
      const category = await getCategoryBySlug(slug);
      return category;
    })
  );
  
  // Filter out null values and sort by name
  return categories
    .filter((category): category is Category => category !== null)
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const fullPath = join(categoriesDirectory, `${slug}.md`);
  
  try {
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    // Count articles in this category
    const articles = await getArticlesByCategory(slug);
    const articleCount = articles.length;
    
    return {
      slug,
      name: data.name || '',
      description: data.description || '',
      icon: data.icon || '',
      articleCount,
      ...data,
    } as Category;
  } catch (error) {
    console.error(`Error reading category ${slug}:`, error);
    return null;
  }
}

// File operations
export async function createArticle(articleData: Partial<Article> & { slug: string; title: string }): Promise<Article | null> {
  const { slug, title, content, ...metadata } = articleData;
  
  // Create frontmatter
  const frontmatter = {
    title,
    ...metadata,
  };
  
  // Create file content with frontmatter and markdown content
  const fileContent = matter.stringify(content || '', frontmatter);
  
  // Write to file
  const filePath = join(articlesDirectory, `${slug}.md`);
  await fs.writeFile(filePath, fileContent, 'utf8');
  
  return await getArticleBySlug(slug);
}

export async function updateArticle(slug: string, articleData: Partial<Article>): Promise<Article | null> {
  const existingArticle = await getArticleBySlug(slug);
  
  if (!existingArticle) {
    throw new Error(`Article with slug "${slug}" not found`);
  }
  
  const { content, ...metadata } = articleData;
  
  // Create frontmatter
  const frontmatter = {
    ...existingArticle,
    ...metadata,
  };
  
  // Create file content with frontmatter and markdown content
  const fileContent = matter.stringify(
    content || existingArticle.content || '', 
    frontmatter
  );
  
  // Write to file
  const filePath = join(articlesDirectory, `${slug}.md`);
  await fs.writeFile(filePath, fileContent, 'utf8');
  
  return await getArticleBySlug(slug);
}

export async function deleteArticle(slug: string): Promise<boolean> {
  const filePath = join(articlesDirectory, `${slug}.md`);
  
  try {
    await fs.remove(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting article ${slug}:`, error);
    return false;
  }
}

export async function createCategory(categoryData: Partial<Category> & { slug: string; name: string }): Promise<Category | null> {
  const { slug, name, ...metadata } = categoryData;
  
  // Create frontmatter
  const frontmatter = {
    name,
    ...metadata,
  };
  
  // Create file content with frontmatter and empty content
  const fileContent = matter.stringify('', frontmatter);
  
  // Write to file
  const filePath = join(categoriesDirectory, `${slug}.md`);
  await fs.writeFile(filePath, fileContent, 'utf8');
  
  return await getCategoryBySlug(slug);
}

export async function updateCategory(slug: string, categoryData: Partial<Category>): Promise<Category | null> {
  const existingCategory = await getCategoryBySlug(slug);
  
  if (!existingCategory) {
    throw new Error(`Category with slug "${slug}" not found`);
  }
  
  // Create frontmatter
  const frontmatter = {
    ...existingCategory,
    ...categoryData,
  };
  
  // Create file content with frontmatter and empty content
  const fileContent = matter.stringify('', frontmatter);
  
  // Write to file
  const filePath = join(categoriesDirectory, `${slug}.md`);
  await fs.writeFile(filePath, fileContent, 'utf8');
  
  return await getCategoryBySlug(slug);
}

export async function deleteCategory(slug: string): Promise<boolean> {
  const filePath = join(categoriesDirectory, `${slug}.md`);
  
  try {
    await fs.remove(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting category ${slug}:`, error);
    return false;
  }
}