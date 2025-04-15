import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Article, Category } from "@shared/schema";
import ContentCard from "@/components/content/content-card";
import { Helmet } from "react-helmet";

const ContentList = () => {
  const [location] = useLocation();
  const [filters, setFilters] = useState<{
    category?: string;
    tag?: string;
    search?: string;
  }>({});

  // Parse query parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const newFilters: {
      category?: string;
      tag?: string;
      search?: string;
    } = {};
    
    if (params.has('category')) {
      newFilters.category = params.get('category')!;
    }
    
    if (params.has('tag')) {
      newFilters.tag = params.get('tag')!;
    }
    
    if (params.has('search')) {
      newFilters.search = params.get('search')!;
    }
    
    setFilters(newFilters);
  }, [location]);

  // Construct API query parameters based on filters
  const queryParams = new URLSearchParams();
  if (filters.category) queryParams.append('category', filters.category);
  if (filters.tag) queryParams.append('tag', filters.tag);
  if (filters.search) queryParams.append('search', filters.search);
  
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: [`/api/articles?${queryParams.toString()}`],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const getPageTitle = () => {
    if (filters.search) return `Search Results: ${filters.search} | Invisibuilder`;
    if (filters.tag) return `Content Tagged with ${filters.tag} | Invisibuilder`;
    if (filters.category) {
      const category = categories?.find(c => c.slug === filters.category);
      return category ? `${category.name} | Invisibuilder` : 'Content | Invisibuilder';
    }
    return 'All Content | Invisibuilder';
  };

  const getPageDescription = () => {
    if (filters.search) return `Search results for "${filters.search}" on Invisibuilder.`;
    if (filters.tag) return `Content tagged with "${filters.tag}" on Invisibuilder.`;
    if (filters.category) {
      const category = categories?.find(c => c.slug === filters.category);
      return category ? category.description : 'Browse all content on Invisibuilder.';
    }
    return 'Explore articles, tutorials, and resources for solopreneurs who prefer to work behind the scenes.';
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
      </Helmet>
      
      <div className="py-12 bg-gradient-to-b from-neutral-200 to-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-heading font-bold text-neutral-900">
              {filters.search ? `Search Results: "${filters.search}"` : 
               filters.tag ? `Content Tagged with "${filters.tag}"` :
               filters.category ? (categories?.find(c => c.slug === filters.category)?.name || 'Content') :
               'All Content'}
            </h1>
          </div>
        </div>
      </div>
      
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters section */}
          <div className="mb-8 flex flex-wrap gap-4">
            {/* Filter chips */}
            {Object.entries(filters).map(([key, value]) => (
              value && (
                <div key={key} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-200">
                  <span className="mr-1">{key}:</span>
                  <span className="font-semibold">{value}</span>
                </div>
              )
            ))}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-neutral-100 rounded-lg overflow-hidden shadow-md animate-pulse">
                  <div className="w-full h-48 bg-neutral-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-neutral-200 rounded mb-4"></div>
                    <div className="h-4 bg-neutral-200 rounded mb-4"></div>
                    <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map(article => (
                <ContentCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No content found</h3>
              <p className="text-neutral-600">
                {filters.search ? 'Try different search terms or browse our categories below.' :
                 filters.tag ? 'This tag doesn\'t have any content yet. Explore other tags or categories.' :
                 filters.category ? 'This category doesn\'t have any content yet. Check back soon!' :
                 'No content available yet. Check back soon!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ContentList;
