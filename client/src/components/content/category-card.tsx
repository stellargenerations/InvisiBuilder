import { Link } from "wouter";
import { Category } from "@shared/schema";

interface CategoryCardProps {
  category: any; // Using any for Sanity data structure
}

// Helper function to get slug from Sanity structure
const getCategorySlug = (category: any) => {
  if (!category) return '';
  
  // Handle both string and object types for backward compatibility
  if (typeof category.slug === 'string') {
    return category.slug;
  }
  
  // Handle Sanity object structure with current property
  if (category.slug && category.slug.current) {
    return category.slug.current;
  }
  
  return '';
};

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'video':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    case 'chart-line':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      );
    case 'shield-alt':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'robot':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
  }
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  // Handle articleCount - default to 0 if not available
  const articleCount = category.articleCount || 0;
  
  return (
    <Link href={`/articles?category=${getCategorySlug(category)}`}>
      <a className="group">
        <div className="bg-neutral-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition duration-150 h-full flex flex-col">
          <div className="w-16 h-16 bg-primary-light text-white rounded-full flex items-center justify-center mx-auto mb-4">
            {getCategoryIcon(category.icon)}
          </div>
          <h3 className="font-heading font-semibold text-xl mb-3 text-neutral-900 group-hover:text-primary-dark transition duration-150">{category.name}</h3>
          <p className="text-neutral-800 text-sm flex-grow">{category.description}</p>
          <div className="mt-4 text-primary-dark group-hover:text-primary transition duration-150">
            <span className="text-sm font-medium">{articleCount} Article{articleCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default CategoryCard;
