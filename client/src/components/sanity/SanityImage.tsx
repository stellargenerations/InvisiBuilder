import { urlFor } from '@/lib/sanity';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface SanityImageProps {
  image: SanityImageSource;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function SanityImage({ 
  image, 
  alt, 
  width, 
  height, 
  className = '' 
}: SanityImageProps) {
  if (!image) return null;

  let imageUrl = urlFor(image);
  
  if (width) {
    imageUrl = imageUrl.width(width);
  }
  
  if (height) {
    imageUrl = imageUrl.height(height);
  }
  
  return (
    <img 
      src={imageUrl.url()} 
      alt={alt} 
      className={className}
      loading="lazy"
    />
  );
}