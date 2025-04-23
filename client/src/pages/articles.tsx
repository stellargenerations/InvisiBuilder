import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Article, Category } from '@shared/schema';
import ContentCard from '@/components/content/content-card';
import Breadcrumbs from '@/components/ui/breadcrumb';
import { Helmet } from 'react-helmet';

// Helper function to get topic name from slug
const getTopicNameFromSlug = (topics: Category[] | undefined, slug: string | null): string | null => {
  if (!topics || !slug) return null;

  const normalizedSlug = slug.toLowerCase();

  // First try to find by exact slug match
  const topicBySlug = topics.find(t => {
    const topicSlug = t.slug ? t.slug.toLowerCase() : '';
    return topicSlug === normalizedSlug;
  });

  if (topicBySlug) return topicBySlug.name;

  // Then try to find by normalized name match
  const topicByName = topics.find(t => {
    const normalizedName = t.name ? t.name.toLowerCase().replace(/\s+/g, '-') : '';
    return normalizedName === normalizedSlug;
  });

  return topicByName ? topicByName.name : null;
};

const ArticlesPage = () => {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const topicParam = searchParams.get('topic') || searchParams.get('category'); // Support both for backward compatibility
  const tagParam = searchParams.get('tag');
  const searchParam = searchParams.get('search');

  const [activeFilter, setActiveFilter] = useState<string | null>(topicParam);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam || '');
  const [totalArticleCount, setTotalArticleCount] = useState<number>(0);

  // Query for filtered articles
  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles', activeFilter, tagParam, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeFilter) params.append('category', activeFilter); // Using 'category' instead of 'topic' to match server API
      if (tagParam) params.append('tag', tagParam);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/articles?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch articles');
      return response.json();
    }
  });

  // Query for all articles (to get the total count)
  const { data: allArticles, isLoading: allArticlesLoading } = useQuery<Article[]>({
    queryKey: ['allArticles'],
    queryFn: async () => {
      const response = await fetch('/api/articles');
      if (!response.ok) throw new Error('Failed to fetch all articles');
      return response.json();
    },
    staleTime: 60000, // Cache for 1 minute
  });

  // Update total article count whenever allArticles changes
  useEffect(() => {
    if (allArticles) {
      console.log('Setting total article count:', allArticles.length);
      setTotalArticleCount(allArticles.length);
    }
  }, [allArticles]);

  const { data: topics } = useQuery<Category[]>({
    queryKey: ['/api/topics'],
  });

  // Set initial filter state from URL params on component mount
  useEffect(() => {
    console.log('Initial URL params:', { topicParam, searchParam, location });
    if (topicParam) {
      console.log('Setting active filter to:', topicParam);
      setActiveFilter(topicParam);
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Update filter when URL params change
  useEffect(() => {
    // Update the active filter when the URL parameter changes
    console.log('URL params changed:', { topicParam, searchParam, activeFilter });
    setActiveFilter(topicParam || null);

    // Update search query when the URL parameter changes
    setSearchQuery(searchParam || '');
  }, [topicParam, searchParam]);


  const handleTopicFilter = (topicSlug: string | null) => {
    const newFilter = activeFilter === topicSlug ? null : topicSlug;
    setActiveFilter(newFilter);

    // Update the URL to reflect the filter change
    if (newFilter) {
      setLocation(`/articles?topic=${newFilter}`);
    } else {
      setLocation('/articles');
    }
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
               activeFilter && topics ? `Articles in: ${getTopicNameFromSlug(topics, activeFilter) || activeFilter}` :
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

        {/* Topics filter */}
        {topics && topics.length > 0 && !tagParam && !searchQuery && (
          <div className="mb-12">
            <h2 className="text-xl font-heading font-semibold mb-6">Browse by Topic</h2>

            {/* Topic filter buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => handleTopicFilter(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!activeFilter
                  ? 'bg-primary-dark text-white'
                  : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'}`}
              >
                All Topics
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full bg-white text-primary-dark">
                  {totalArticleCount || (allArticles?.length || 0)}
                </span>
              </button>

              {topics.map((topic) => {
                // Calculate article count for this topic
                const topicArticleCount = topic.articleCount || 0;

                // Get normalized slugs for comparison
                const normalizedActiveFilter = activeFilter ? activeFilter.toLowerCase() : '';
                const normalizedTopicSlug = topic.slug ? topic.slug.toLowerCase() : '';
                const normalizedTopicName = topic.name ? topic.name.toLowerCase().replace(/\s+/g, '-') : '';

                // Check if this topic matches the active filter
                const isActive = normalizedActiveFilter &&
                  (normalizedActiveFilter === normalizedTopicSlug ||
                   normalizedActiveFilter === normalizedTopicName);

                console.log('Topic button comparison:', {
                  topicName: topic.name,
                  normalizedTopicName,
                  topicSlug: topic.slug,
                  normalizedTopicSlug,
                  activeFilter,
                  normalizedActiveFilter,
                  isActive
                });

                return (
                  <button
                    key={topic.id || topic.slug}
                    onClick={() => handleTopicFilter(topic.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-dark text-white'
                        : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
                    }`}
                  >
                    {topic.name}
                    <span className={`ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                      isActive
                        ? 'bg-white text-primary-dark'
                        : 'bg-primary-light text-white'
                    }`}>
                      {topicArticleCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter pills/tags */}
        {(activeFilter || tagParam) && (
          <div className="flex items-center mb-8">
            <span className="text-sm text-neutral-700 mr-2">Active filters:</span>
            {activeFilter && topics && (
              <button
                onClick={() => handleTopicFilter(null)}
                className="inline-flex items-center px-3 py-1 bg-primary-light text-white rounded-full text-sm mr-2"
              >
                {/* Display the topic name instead of the slug */}
                {getTopicNameFromSlug(topics, activeFilter) || activeFilter}
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
                      ? `No articles in the ${getTopicNameFromSlug(topics, activeFilter) || activeFilter} topic`
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