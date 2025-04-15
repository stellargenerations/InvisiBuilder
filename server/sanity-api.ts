import { createClient } from '@sanity/client';

// Initialize the Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-03-04', // Use today's date or the version you're targeting
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production
  token: process.env.SANITY_API_TOKEN, // Only required for write operations
});

// Categories
export async function getCategories() {
  return client.fetch(`*[_type == "category"] | order(name asc)`);
}

export async function getCategoryBySlug(slug: string) {
  return client.fetch(
    `*[_type == "category" && slug.current == $slug][0]`,
    { slug }
  );
}

export async function getCategoryById(id: string) {
  return client.fetch(`*[_type == "category" && _id == $id][0]`, { id });
}

export async function createCategory(category: any) {
  return client.create({
    _type: 'category',
    ...category,
  });
}

export async function updateCategory(id: string, category: any) {
  return client.patch(id).set(category).commit();
}

export async function deleteCategory(id: string) {
  return client.delete(id);
}

// Articles
export async function getArticles({ 
  featured, 
  category, 
  tag, 
  search, 
  limit 
}: { 
  featured?: boolean, 
  category?: string, 
  tag?: string, 
  search?: string, 
  limit?: number 
}) {
  let query = '*[_type == "article"]';
  const params: Record<string, any> = {};

  // Add filters
  const filters = [];
  if (featured !== undefined) {
    filters.push('featured == $featured');
    params.featured = featured;
  }
  
  if (category) {
    filters.push('category->slug.current == $category');
    params.category = category;
  }
  
  if (tag) {
    filters.push('$tag in tags');
    params.tag = tag;
  }
  
  if (search) {
    filters.push('(title match $search || excerpt match $search || tags[] match $search)');
    params.search = `*${search}*`;
  }
  
  if (filters.length > 0) {
    query += ` [${filters.join(' && ')}]`;
  }
  
  // Add sorting
  query += ' | order(publishedDate desc)';
  
  // Add limit
  if (limit) {
    query += `[0...${limit}]`;
  }

  // Include references
  query += `{
    ...,
    "slug": slug.current,
    category->,
    "relatedArticles": relatedArticles[]->
  }`;
  
  return client.fetch(query, params);
}

export async function getArticleById(id: string) {
  return client.fetch(`
    *[_type == "article" && _id == $id][0]{
      ...,
      "slug": slug.current,
      category->,
      "relatedArticles": relatedArticles[]->
    }
  `, { id });
}

export async function getArticleBySlug(slug: string) {
  return client.fetch(`
    *[_type == "article" && slug.current == $slug][0]{
      ...,
      "slug": slug.current,
      category->,
      "relatedArticles": relatedArticles[]->
    }
  `, { slug });
}

export async function getArticlePreview() {
  return client.fetch(`
    *[_type == "article"] | order(publishedDate desc)[0]{
      ...,
      "slug": slug.current,
      category->
    }
  `);
}

export async function createArticle(article: any) {
  return client.create({
    _type: 'article',
    ...article,
  });
}

export async function updateArticle(id: string, article: any) {
  return client.patch(id).set(article).commit();
}

export async function deleteArticle(id: string) {
  return client.delete(id);
}

// Content Sections
export async function getContentSections(articleId: string) {
  return client.fetch(`
    *[_type == "contentSection" && articleId._ref == $articleId] | order(position asc)
  `, { articleId });
}

export async function createContentSection(section: any) {
  return client.create({
    _type: 'contentSection',
    ...section,
  });
}

export async function updateContentSection(id: string, section: any) {
  return client.patch(id).set(section).commit();
}

export async function deleteContentSection(id: string) {
  return client.delete(id);
}

// Media Files
export async function getMediaFiles(articleId?: string) {
  let query = '*[_type == "mediaFile"]';
  
  if (articleId) {
    query += `[article._ref == $articleId]`;
    return client.fetch(query, { articleId });
  }
  
  return client.fetch(query);
}

export async function getMediaFileById(id: string) {
  return client.fetch(`*[_type == "mediaFile" && _id == $id][0]`, { id });
}

export async function createMediaFile(mediaFile: any) {
  return client.create({
    _type: 'mediaFile',
    ...mediaFile,
  });
}

export async function deleteMediaFile(id: string) {
  return client.delete(id);
}

// Resources
export async function getResources(articleId?: string) {
  let query = '*[_type == "resource"]';
  
  if (articleId) {
    query += `[article._ref == $articleId]`;
    return client.fetch(query, { articleId });
  }
  
  return client.fetch(query);
}

export async function getResourceById(id: string) {
  return client.fetch(`*[_type == "resource" && _id == $id][0]`, { id });
}

export async function createResource(resource: any) {
  return client.create({
    _type: 'resource',
    ...resource,
  });
}

export async function deleteResource(id: string) {
  return client.delete(id);
}

// Subscribers
export async function getSubscribers() {
  return client.fetch(`*[_type == "subscriber"] | order(subscriptionDate desc)`);
}

export async function getSubscriberByEmail(email: string) {
  return client.fetch(`*[_type == "subscriber" && email == $email][0]`, { email });
}

export async function createSubscriber(subscriber: any) {
  return client.create({
    _type: 'subscriber',
    ...subscriber,
  });
}

export async function updateSubscriber(id: string, subscriber: any) {
  return client.patch(id).set(subscriber).commit();
}

export async function deleteSubscriber(id: string) {
  return client.delete(id);
}

// Contacts
export async function getContacts() {
  return client.fetch(`*[_type == "contact"] | order(submittedAt desc)`);
}

export async function getContactById(id: string) {
  return client.fetch(`*[_type == "contact" && _id == $id][0]`, { id });
}

export async function createContact(contact: any) {
  return client.create({
    _type: 'contact',
    ...contact,
  });
}

export async function updateContactStatus(id: string, status: string) {
  return client.patch(id).set({ status }).commit();
}

export async function deleteContact(id: string) {
  return client.delete(id);
}

// Search across all content
export async function searchContent(term: string) {
  return client.fetch(`
    {
      "articles": *[_type == "article" && (
        title match $term || 
        excerpt match $term || 
        tags[] match $term
      )] | order(publishedDate desc) {
        ...,
        "slug": slug.current,
        category->
      },
      "categories": *[_type == "category" && (
        name match $term || 
        description match $term
      )] | order(name asc) {
        ...,
        "slug": slug.current
      }
    }
  `, { term: `*${term}*` });
}