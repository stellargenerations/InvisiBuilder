import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { Link } from "wouter";
import MediaPlayer from "@/components/content/media-player";
import AudioPlayer from "@/components/content/audio-player";

const ContentPreview = () => {
  const { data: previewArticle, isLoading } = useQuery<Article>({
    queryKey: ['/api/articles/preview'],
  });

  if (isLoading || !previewArticle) {
    return (
      <section className="py-16 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-neutral-900">How Our Content Works</h2>
            <p className="mt-4 text-lg text-neutral-800 max-w-3xl mx-auto">
              Invisibuilder articles combine text, video, images, and audio to provide the most comprehensive learning experience.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-7/12">
                  <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4"></div>
                </div>
                <div className="w-full lg:w-5/12">
                  <div className="bg-neutral-200 h-64 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-neutral-900">How Our Content Works</h2>
          <p className="mt-4 text-lg text-neutral-800 max-w-3xl mx-auto">
            Invisibuilder articles combine text, video, images, and audio to provide the most comprehensive learning experience.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-7/12">
                <h3 className="font-heading font-bold text-2xl md:text-3xl mb-4 text-neutral-900">
                  {previewArticle.title}
                </h3>
                
                <div className="prose prose-lg max-w-none text-neutral-800">
                  <p>{previewArticle.excerpt}</p>
                  
                  {previewArticle.contentSections && previewArticle.contentSections.length > 0 && (
                    <>
                      <h4 className="font-heading font-semibold text-xl text-neutral-900 mt-6 mb-3">
                        {previewArticle.contentSections[0].title}
                      </h4>
                      
                      <p>{previewArticle.contentSections[0].content}</p>
                      
                      {previewArticle.audioFiles && previewArticle.audioFiles.length > 0 && (
                        <div className="my-6 bg-neutral-100 p-4 rounded-lg">
                          <div className="flex items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            <h5 className="font-heading font-medium text-lg">Audio Insight</h5>
                          </div>
                          
                          <AudioPlayer 
                            title={previewArticle.audioFiles[0].title} 
                            duration={previewArticle.audioFiles[0].duration} 
                            src={previewArticle.audioFiles[0].url} 
                          />
                        </div>
                      )}
                      
                      <p>
                        The video below demonstrates how to set up your agency website without using personal information while still establishing credibility...
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="w-full lg:w-5/12">
                {previewArticle.videoFiles && previewArticle.videoFiles.length > 0 && (
                  <div className="bg-neutral-100 rounded-lg overflow-hidden shadow-sm">
                    <MediaPlayer 
                      type="video"
                      src={previewArticle.videoFiles[0].url}
                      title={previewArticle.videoFiles[0].title}
                      description={previewArticle.videoFiles[0].description}
                      thumbnail={previewArticle.videoFiles[0].thumbnail}
                      duration={previewArticle.videoFiles[0].duration}
                    />
                  </div>
                )}
                
                <div className="mt-6 space-y-4">
                  {previewArticle.resources && previewArticle.resources.map((resource, index) => (
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
            </div>
            
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  {previewArticle.tags && previewArticle.tags.map((tag, index) => (
                    <Link key={index} href={`/content?tag=${tag}`}>
                      <div className="text-sm text-neutral-800 cursor-pointer inline-flex items-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        {tag}
                      </div>
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
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href={`/content/${previewArticle.id}`}>
            <div className="inline-flex items-center font-medium text-primary-dark hover:text-primary transition duration-150 cursor-pointer">
              View Full Article
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContentPreview;
