import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import MediaPlayer from "@/components/content/media-player";
import AudioPlayer from "@/components/content/audio-player";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { Helmet } from "react-helmet";
import { urlFor } from "@/lib/sanity"; // Import urlFor to handle Sanity images
import { PortableText } from "@portabletext/react";

const ArticlePage = () => {
  const [match, params] = useRoute("/:slug");
  const slug = params?.slug;

  // For routes that have their own components (/about, /contact, etc.), we need to avoid rendering this component
  if (slug === 'about' || slug === 'contact' || slug === 'privacy' || slug === 'articles') {
    return null;
  }

  // Using any for Sanity data structure
  const { data: article, isLoading, error } = useQuery<any>({
    queryKey: [`/api/articles/slug/${slug}`],
    enabled: !!slug,
  });
  
  // Helper function to get category name from Sanity structure
  const getCategoryName = () => {
    if (!article?.category) return null;
    
    // Handle both string and object types for backward compatibility
    if (typeof article.category === 'string') {
      return article.category;
    }
    
    // Handle Sanity object structure
    if (article.category.name) {
      return article.category.name;
    }
    
    return null;
  };
  
  // Helper function to get category slug for links
  const getCategorySlug = () => {
    if (!article?.category) return '';
    
    if (typeof article.category === 'string') {
      return article.category.toLowerCase().replace(/\s+/g, '-');
    }
    
    if (article.category.slug && article.category.slug.current) {
      return article.category.slug.current;
    }
    
    if (article.category.name) {
      return article.category.name.toLowerCase().replace(/\s+/g, '-');
    }
    
    return '';
  };

  useEffect(() => {
    if (article) {
      // Scroll to top when article loads
      window.scrollTo(0, 0);
    }
  }, [article]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4"></div>
          <div className="flex items-center space-x-2 mb-8">
            <div className="h-4 bg-neutral-200 rounded w-24"></div>
            <div className="h-4 bg-neutral-200 rounded w-24"></div>
          </div>
          <div className="h-64 bg-neutral-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12 bg-neutral-100 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/articles">
            <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Browse All Content
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return 'Unknown date';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <>
      <Helmet>
        <title>{article.title} | Invisibuilder</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.featuredImage} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        <meta name="twitter:image" content={article.featuredImage} />
      </Helmet>

      {/* Breadcrumb navigation */}
      <div className="bg-neutral-100 py-4 border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Articles', href: '/articles' },
              { label: article.title }
            ]} 
          />
        </div>
      </div>

      <article className="bg-white">
        {/* Hero section with featured image */}
        <div className="w-full h-64 md:h-96 bg-neutral-900 relative">
          {article.featuredImage && (
            <img 
              src={article.featuredImage._type === 'image' 
                ? urlFor(article.featuredImage).width(1200).url() 
                : article.featuredImage}
              alt={article.title} 
              className="w-full h-full object-cover opacity-70"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900 opacity-80"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
            <div className="max-w-5xl mx-auto">
              {article.category && (
                <Link href={`/articles?category=${getCategorySlug()}`}>
                  <a className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-dark text-white mb-4">
                    {getCategoryName()}
                  </a>
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">{article.title}</h1>
              <div className="flex flex-wrap items-center mt-4 text-sm text-neutral-200">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {formatDate(article.publishedDate)}
                </span>
                <span className="mx-3">•</span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {article.readTime} read
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Article content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-neutral-700 mb-8">{article.excerpt}</p>
            
            {/* Main content */}
            {article.content && (
              <div className="mb-12">
                <PortableText value={article.content} />
              </div>
            )}
            
            {/* Content Sections */}
            {article.contentSections && article.contentSections.map((section, index) => (
              <div key={index} className="mb-12">
                {section.title && (
                  <h2 className="text-2xl font-heading font-semibold mb-4">{section.title}</h2>
                )}
                
                {section.content && typeof section.content === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                ) : (
                  <PortableText value={section.content} />
                )}
                
                {/* Media section */}
                {index === 0 && article.videoFiles && article.videoFiles.length > 0 && (
                  <div className="my-8">
                    <MediaPlayer 
                      type="video"
                      src={article.videoFiles[0].url}
                      title={article.videoFiles[0].title || ''}
                      description={article.videoFiles[0].description || undefined}
                      thumbnail={article.videoFiles[0].thumbnail || undefined}
                      duration={article.videoFiles[0].duration || undefined}
                    />
                  </div>
                )}
                
                {index === 1 && article.audioFiles && article.audioFiles.length > 0 && (
                  <div className="my-6 bg-neutral-100 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <h5 className="font-heading font-medium text-lg">Audio Insight</h5>
                    </div>
                    
                    <AudioPlayer 
                      title={article.audioFiles[0].title || ''} 
                      duration={article.audioFiles[0].duration || '0:00'} 
                      src={article.audioFiles[0].url} 
                    />
                  </div>
                )}
                
                {index === 2 && article.images && article.images.length > 0 && (
                  <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {article.images.slice(0, 2).map((image, imgIndex) => (
                      <MediaPlayer 
                        key={imgIndex}
                        type="image"
                        src={image.url}
                        title={image.title || ''}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Resources section */}
            {article.resources && article.resources.length > 0 && (
              <div className="mt-12 border-t border-neutral-200 pt-8">
                <h3 className="text-xl font-heading font-semibold mb-4">Related Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.resources.map((resource, index) => (
                    <div key={index} className="bg-neutral-100 rounded-lg p-4 flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        {resource.type === 'pdf' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h5 className="font-medium text-base mb-1">{resource.title}</h5>
                        <p className="text-sm text-neutral-800">{resource.description}</p>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-1 text-xs font-medium text-primary-dark hover:text-primary transition duration-150">
                          {resource.type === 'pdf' ? 'Download PDF' : 'View Resource'}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Tags and sharing */}
          <div className="mt-12 pt-6 border-t border-neutral-200">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                {article.tags && article.tags.map((tag, index) => (
                  <Link key={index} href={`/articles?tag=${tag}`}>
                    <a className="text-sm text-neutral-800 hover:text-primary-dark transition duration-150">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline text-primary mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {tag}
                    </a>
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="inline-flex items-center px-3 py-1 border border-primary rounded-md text-sm font-medium text-primary-dark hover:bg-neutral-200 transition duration-150" aria-label="Share on Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  <span className="hidden sm:inline">Twitter</span>
                </button>
                <button className="inline-flex items-center px-3 py-1 border border-primary rounded-md text-sm font-medium text-primary-dark hover:bg-neutral-200 transition duration-150" aria-label="Share on LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                  <span className="hidden sm:inline">LinkedIn</span>
                </button>
                <button className="inline-flex items-center px-3 py-1 border border-primary rounded-md text-sm font-medium text-primary-dark hover:bg-neutral-200 transition duration-150" aria-label="Copy link">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="hidden sm:inline">Copy Link</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Related articles */}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <div className="mt-16 border-t border-neutral-200 pt-12">
              <h3 className="text-2xl font-heading font-semibold mb-8 text-center">You May Also Like</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {article.relatedArticles.map((relatedArticle, index) => (
                  <div key={index} className="bg-neutral-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-150">
                    <Link href={`/${relatedArticle.slug?.current || relatedArticle.slug}`}>
                      <a>
                        <img 
                          src={relatedArticle.featuredImage && relatedArticle.featuredImage._type === 'image' 
                            ? urlFor(relatedArticle.featuredImage).width(600).height(320).url()
                            : relatedArticle.featuredImage}
                          alt={relatedArticle.title} 
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-heading font-semibold text-lg mb-2">{relatedArticle.title}</h4>
                          <p className="text-sm text-neutral-700 line-clamp-2">{relatedArticle.excerpt}</p>
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default ArticlePage;
