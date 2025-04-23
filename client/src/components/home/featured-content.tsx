import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ContentCard from "@/components/content/content-card";
import { Link } from "wouter";
import { queryClient } from "@/lib/queryClient";

const FeaturedContent = () => {
  // Invalidate the cache when the component mounts
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["/api/articles?featured=true"] });
  }, []);
  
  // Using the Article type from our schema
  const {
    data: articles,
    isLoading,
    error,
  } = useQuery<any[]>({
    queryKey: ["/api/articles?featured=true"],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <section id="latest-content" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-neutral-900">
              Featured Content
            </h2>
            <p className="mt-4 text-lg text-neutral-800 max-w-3xl mx-auto">
              Comprehensive guides and strategies for building profitable online ventures while staying behind the scenes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-neutral-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-150 animate-pulse"
              >
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
        </div>
      </section>
    );
  }

  return (
    <section id="latest-content" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-neutral-900">
            Featured Content
          </h2>
          <p className="mt-4 text-lg text-neutral-800 max-w-3xl mx-auto">
            Comprehensive guides and strategies for building profitable online
            ventures while staying behind the scenes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles && articles.length > 0 ? (
            articles.map((article) => (
              <ContentCard
                key={article.id || `article-${article.slug}`}
                article={article}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p>No featured content available yet. Check back soon!</p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link href="/content">
            <div className="inline-flex items-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary-dark hover:bg-neutral-200 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light cursor-pointer">
              View All Content
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedContent;
