import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Replace these values with your actual Sanity project details
export const projectId = 'your-project-id';
export const dataset = 'production';
export const apiVersion = '2023-03-04'; // Use today's date or the version you're targeting

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if you need to fetch the latest data
});

// Helper function to generate image URLs
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Helper functions for fetching data
export async function getCategories() {
  return client.fetch(`*[_type == "category"] | order(name asc)`);
}

export async function getCategoryBySlug(slug: string) {
  return client.fetch(
    `*[_type == "category" && slug.current == $slug][0]`,
    { slug }
  );
}

export async function getArticles({ 
  featured, 
  category, 
  tag, 
  limit 
}: { 
  featured?: boolean, 
  category?: string, 
  tag?: string, 
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

export async function getContentSections(articleId: string) {
  return client.fetch(`
    *[_type == "contentSection" && articleId._ref == $articleId] | order(position asc)
  `, { articleId });
}

export async function getMediaFiles(articleId?: string) {
  let query = '*[_type == "mediaFile"]';
  
  if (articleId) {
    query += `[article._ref == $articleId]`;
    return client.fetch(query, { articleId });
  }
  
  return client.fetch(query);
}

export async function getResources(articleId?: string) {
  let query = '*[_type == "resource"]';
  
  if (articleId) {
    query += `[article._ref == $articleId]`;
    return client.fetch(query, { articleId });
  }
  
  return client.fetch(query);
}

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