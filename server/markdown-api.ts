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
  try {
    const articleFiles = await glob('*.md', { cwd: articlesDirectory });

    if (!articleFiles || articleFiles.length === 0) {
      console.log("No article files found in directory:", articlesDirectory);
      return [];
    }

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
  } catch (error) {
    console.error("Error getting all articles:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const fullPath = join(articlesDirectory, `${slug}.md`);

  try {
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Return the raw markdown content instead of converting to HTML
    // This allows the client to render it using ReactMarkdown

    return {
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      content: content,
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
  const categorySlugLower = categorySlug.toLowerCase();

  return allArticles.filter(article => {
    // Check the category field (string)
    if (article.category && article.category.toLowerCase() === categorySlugLower) {
      return true;
    }

    // Check the categories array (legacy)
    if (article.categories && Array.isArray(article.categories)) {
      if (article.categories.some(cat => cat.toLowerCase() === categorySlugLower)) {
        return true;
      }
    }

    // Check the topics array
    if (article.topics && Array.isArray(article.topics)) {
      if (article.topics.some(topic => topic.toLowerCase() === categorySlugLower)) {
        return true;
      }
    }

    return false;
  });
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
  try {
    // First, get categories from files (if any)
    const categoryFiles = await glob('*.md', { cwd: categoriesDirectory });

    let fileCategories: (Category | null)[] = [];

    if (categoryFiles && categoryFiles.length > 0) {
      fileCategories = await Promise.all(
        categoryFiles.map(async (filename) => {
          const slug = filename.replace(/\.md$/, '');
          const category = await getCategoryBySlug(slug);
          return category;
        })
      );
    } else {
      console.log("No category files found in directory:", categoriesDirectory);
    }

    const fileCategoriesFiltered = fileCategories
      .filter((category): category is Category => category !== null);

    // Then, extract unique topics from articles
    const dynamicCategories = await getDynamicCategoriesFromArticles();

    // Merge both sets, prioritizing file-based categories when there's a slug conflict
    const fileCategorySlugs = new Set(fileCategoriesFiltered.map(cat => cat.slug));
    const mergedCategories = [
      ...fileCategoriesFiltered,
      ...dynamicCategories.filter(cat => !fileCategorySlugs.has(cat.slug))
    ];

    // Sort by name
    return mergedCategories.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } catch (error) {
    console.error("Error getting all categories:", error);
    return [];
  }
}

/**
 * Extracts unique topics from all articles and creates category objects for them
 */
export async function getDynamicCategoriesFromArticles(): Promise<Category[]> {
  try {
    // Get all articles
    const articles = await getAllArticles();

    // Extract all topics from articles
    const topicsMap = new Map<string, { count: number, name: string }>();

    articles.forEach(article => {
      // Handle both category string and topics array
      if (article.category) {
        const topicName = article.category;
        const slug = topicName.toLowerCase().replace(/\s+/g, '-');

        if (topicsMap.has(slug)) {
          const existing = topicsMap.get(slug)!;
          existing.count += 1;
        } else {
          topicsMap.set(slug, { count: 1, name: topicName });
        }
      }

      // Handle topics array if present
      if (article.topics && Array.isArray(article.topics)) {
        article.topics.forEach(topicName => {
          const slug = topicName.toLowerCase().replace(/\s+/g, '-');

          if (topicsMap.has(slug)) {
            const existing = topicsMap.get(slug)!;
            existing.count += 1;
          } else {
            topicsMap.set(slug, { count: 1, name: topicName });
          }
        });
      }
    });

    // Convert to Category objects
    const categories: Category[] = [];

    for (const [slug, data] of topicsMap.entries()) {
      categories.push({
        slug,
        name: data.name,
        description: `Articles about ${data.name}`,
        icon: getIconForTopic(data.name),
        articleCount: data.count,
        _id: `dynamic-topic-${slug}`
      });
    }

    return categories;
  } catch (error) {
    console.error("Error getting dynamic categories from articles:", error);
    return [];
  }
}

/**
 * Assigns an appropriate icon based on the topic name
 */
function getIconForTopic(topicName: string): string {
  // Map common topics to appropriate icons
  const iconMap: Record<string, string> = {
    'marketing': 'bullhorn',
    'content': 'file-alt',
    'video': 'video',
    'audio': 'headphones',
    'business': 'briefcase',
    'finance': 'dollar-sign',
    'technology': 'laptop-code',
    'design': 'palette',
    'social media': 'share-alt',
    'seo': 'search',
    'analytics': 'chart-line',
    'strategy': 'chess',
    'tools': 'tools',
    'privacy': 'shield-alt',
    'security': 'lock',
    'monetization': 'money-bill',
    'automation': 'robot'
  };

  // Check for exact matches
  const lowerTopic = topicName.toLowerCase();
  if (iconMap[lowerTopic]) {
    return iconMap[lowerTopic];
  }

  // Check for partial matches
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerTopic.includes(key)) {
      return icon;
    }
  }

  // Default icon
  return 'bookmark';
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

  // If content is HTML, try to convert it back to markdown for storage
  // For now, we'll just use it as is, assuming it's already markdown
  const markdownContent = content || '';

  // Create file content with frontmatter and markdown content
  const fileContent = matter.stringify(markdownContent, frontmatter);

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

  // Use the provided content or fall back to existing content
  const markdownContent = content || existingArticle.content || '';

  // Create file content with frontmatter and markdown content
  const fileContent = matter.stringify(markdownContent, frontmatter);

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