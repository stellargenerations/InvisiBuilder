import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Article, Category } from '@shared/schema';
import ContentCard from '@/components/content/content-card';
import CategoryCard from '@/components/content/category-card';
import Breadcrumbs from '@/components/ui/breadcrumb';
import { Helmet } from 'react-helmet';

const ArticlesPage = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const categoryParam = searchParams.get('category');
  const tagParam = searchParams.get('tag');
  const searchParam = searchParams.get('search');
  
  const [activeFilter, setActiveFilter] = useState<string | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam || '');
  
  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles', activeFilter, tagParam, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeFilter) params.append('category', activeFilter);
      if (tagParam) params.append('tag', tagParam);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/articles?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch articles');
      return response.json();
    }
  });
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Update filter when URL params change
  useEffect(() => {
    if (categoryParam) {
      setActiveFilter(categoryParam);
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [categoryParam, searchParam]);
  
  const handleCategoryFilter = (categorySlug: string | null) => {
    setActiveFilter(activeFilter === categorySlug ? null : categorySlug);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useEffect and query
  };
  
  return (
    <>
      <Helmet>
        <title>Articles | Invisibuilder</title>
        <meta name="description" content="Browse all articles and content on Invisibuilder" />
      </Helmet>
      
      {/* Breadcrumb navigation */}
      <div className="bg-neutral-100 py-4 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Articles' }
            ]} 
          />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-2">
              {tagParam ? `Articles tagged: ${tagParam}` : 
               activeFilter ? `Articles in: ${activeFilter}` : 
               searchQuery ? `Search results for: ${searchQuery}` : 
               'Browse All Content'}
            </h1>
            <p className="text-lg text-neutral-800">
              {tagParam || activeFilter || searchQuery ? 
                'Filtered content based on your selection' : 
                'Explore our collection of articles, guides, and resources'}
            </p>
          </div>
          
          <div className="w-full md:w-auto mt-6 md:mt-0">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content..."
                className="px-4 py-2 border border-neutral-300 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-primary-dark text-white px-4 py-2 rounded-r-md hover:bg-primary transition duration-150"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </div>
        </div>
        
        {/* Categories filter */}
        {categories && categories.length > 0 && !tagParam && !searchQuery && (
          <div className="mb-12">
            <h2 className="text-xl font-heading font-semibold mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <CategoryCard 
                  key={category._id || category.id || `category-${index}`} 
                  category={category} 
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Filter pills/tags */}
        {(activeFilter || tagParam) && (
          <div className="flex items-center mb-8">
            <span className="text-sm text-neutral-700 mr-2">Active filters:</span>
            {activeFilter && (
              <button 
                onClick={() => handleCategoryFilter(null)} 
                className="inline-flex items-center px-3 py-1 bg-primary-light text-white rounded-full text-sm mr-2"
              >
                {activeFilter}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            {tagParam && (
              <button 
                onClick={() => window.location.href = '/articles'} 
                className="inline-flex items-center px-3 py-1 bg-primary-light text-white rounded-full text-sm"
              >
                Tag: {tagParam}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Search results or article grid */}
        {articlesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-neutral-100 rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="w-full h-48 bg-neutral-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-neutral-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-5/6 mb-6"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {articles && articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <ContentCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-neutral-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-heading font-semibold mb-2">No content found</h2>
                <p className="text-neutral-800 mb-4">
                  {searchQuery 
                    ? `No articles matching "${searchQuery}"` 
                    : activeFilter 
                      ? `No articles in the ${activeFilter} category` 
                      : tagParam 
                        ? `No articles with the tag "${tagParam}"` 
                        : 'No articles available at the moment'}
                </p>
                {(searchQuery || activeFilter || tagParam) && (
                  <a href="/articles" className="inline-flex items-center text-primary-dark hover:text-primary transition duration-150">
                    View all content
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ArticlesPage;