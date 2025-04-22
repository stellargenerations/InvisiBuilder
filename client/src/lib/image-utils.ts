/**
 * Simple utility to handle image URLs
 * This replaces the Sanity urlFor function
 */

interface ImageSource {
  _type?: string;
  asset?: {
    _ref?: string;
    url?: string;
  };
  url?: string;
}

interface ImageBuilder {
  width: (width: number) => ImageBuilder;
  height: (height: number) => ImageBuilder;
  url: () => string;
}

/**
 * A simple replacement for Sanity's urlFor function
 * This handles both string URLs and object-based image references
 */
export function urlFor(source: ImageSource | string): ImageBuilder {
  // Default image if nothing is provided
  const defaultImage = 'https://source.unsplash.com/random/1200x630?placeholder';
  
  // Handle string URLs directly
  if (typeof source === 'string') {
    return createImageBuilder(source);
  }
  
  // Handle object-based image references
  if (source && typeof source === 'object') {
    // If there's a direct URL property, use that
    if (source.url) {
      return createImageBuilder(source.url);
    }
    
    // If it's a Sanity-style asset reference, extract the URL
    if (source.asset && source.asset.url) {
      return createImageBuilder(source.asset.url);
    }
  }
  
  // Fallback to default image
  return createImageBuilder(defaultImage);
}

/**
 * Creates an image builder object that mimics Sanity's image builder API
 */
function createImageBuilder(baseUrl: string): ImageBuilder {
  // For simplicity, we're not actually modifying the URL
  // In a real implementation, you might want to use a service like Cloudinary
  // that supports URL-based transformations
  return {
    width: () => createImageBuilder(baseUrl),
    height: () => createImageBuilder(baseUrl),
    url: () => baseUrl
  };
}
