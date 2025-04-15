import { useQuery } from "@tanstack/react-query";
import CategoryCard from "@/components/content/category-card";

const CategoriesSection = () => {
  const { data: categories, isLoading, error } = useQuery<any>({
    queryKey: ['/api/categories'],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-neutral-900">Explore Topics</h2>
            <p className="mt-4 text-lg text-neutral-800 max-w-3xl mx-auto">
              Find strategies and guidance for every aspect of your anonymous online business.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-neutral-100 rounded-lg p-6 text-center shadow-sm animate-pulse h-64">
                <div className="w-16 h-16 bg-neutral-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-neutral-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded mb-2 mx-auto"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const defaultCategories = [
    {
      id: 1,
      name: "Content Creation",
      description: "Tools and techniques for creating engaging content without revealing your identity.",
      slug: "content-creation",
      icon: "video",
      articleCount: 12
    },
    {
      id: 2,
      name: "Monetization",
      description: "Strategies for generating income while protecting your privacy and personal information.",
      slug: "monetization",
      icon: "chart-line",
      articleCount: 18
    },
    {
      id: 3,
      name: "Privacy Tools",
      description: "Software and services to protect your identity while running your online business.",
      slug: "privacy-tools",
      icon: "shield-alt",
      articleCount: 15
    },
    {
      id: 4,
      name: "Automation",
      description: "Systems and processes to automate your business operations and scale efficiently.",
      slug: "automation",
      icon: "robot",
      articleCount: 9
    }
  ];

  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-neutral-900">Explore Topics</h2>
          <p className="mt-4 text-lg text-neutral-800 max-w-3xl mx-auto">
            Find strategies and guidance for every aspect of your anonymous online business.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map(category => (
            <CategoryCard key={category._id || category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
