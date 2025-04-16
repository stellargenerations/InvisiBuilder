import fs from 'fs-extra';
import { join } from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { glob } from 'glob';

const articlesDirectory = join(process.cwd(), 'content/articles');
const categoriesDirectory = join(process.cwd(), 'content/categories');

// Article functions
export async function getAllArticles() {
  const articleFiles = await glob('*.md', { cwd: articlesDirectory });
  
  const articles = await Promise.all(
    articleFiles.map(async (filename) => {
      const slug = filename.replace(/\.md$/, '');
      const article = await getArticleBySlug(slug);
      return article;
    })
  );
  
  // Sort articles by date in descending order
  return articles.sort((a, b) => {
    if (a.publishedDate < b.publishedDate) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getArticleBySlug(slug: string) {
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
      content: htmlContent,
      ...data,
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

export async function getArticlesByCategory(categorySlug: string) {
  const allArticles = await getAllArticles();
  return allArticles.filter(article => 
    article.category === categorySlug || 
    (article.categories && article.categories.includes(categorySlug))
  );
}

export async function getArticlesByTag(tag: string) {
  const allArticles = await getAllArticles();
  return allArticles.filter(article => 
    article.tags && article.tags.includes(tag)
  );
}

export async function searchArticles(query: string) {
  const allArticles = await getAllArticles();
  const lowerCaseQuery = query.toLowerCase();
  
  return allArticles.filter(article => 
    article.title.toLowerCase().includes(lowerCaseQuery) ||
    article.excerpt.toLowerCase().includes(lowerCaseQuery) ||
    (article.content && article.content.toLowerCase().includes(lowerCaseQuery))
  );
}

// Category functions
export async function getAllCategories() {
  const categoryFiles = await glob('*.md', { cwd: categoriesDirectory });
  
  const categories = await Promise.all(
    categoryFiles.map(async (filename) => {
      const slug = filename.replace(/\.md$/, '');
      const category = await getCategoryBySlug(slug);
      return category;
    })
  );
  
  return categories.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCategoryBySlug(slug: string) {
  const fullPath = join(categoriesDirectory, `${slug}.md`);
  
  try {
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    // Count articles in this category
    const articles = await getArticlesByCategory(slug);
    const articleCount = articles.length;
    
    return {
      slug,
      articleCount,
      ...data,
    };
  } catch (error) {
    console.error(`Error reading category ${slug}:`, error);
    return null;
  }
}

// File operations
export async function createArticle(articleData: any) {
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

export async function updateArticle(slug: string, articleData: any) {
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

export async function deleteArticle(slug: string) {
  const filePath = join(articlesDirectory, `${slug}.md`);
  
  try {
    await fs.remove(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting article ${slug}:`, error);
    return false;
  }
}

export async function createCategory(categoryData: any) {
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

export async function updateCategory(slug: string, categoryData: any) {
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

export async function deleteCategory(slug: string) {
  const filePath = join(categoriesDirectory, `${slug}.md`);
  
  try {
    await fs.remove(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting category ${slug}:`, error);
    return false;
  }
}