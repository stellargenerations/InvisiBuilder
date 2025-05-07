import { useClusterArticles, useClusters } from '@/hooks/use-clusters';
import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { ChevronRight } from 'lucide-react';

export function ClusterView() {
  const { data: clusters, isLoading: isClustersLoading } = useClusters();
  const [activeCluster, setActiveCluster] = useState<string | null>(null);
  const { data: articles, isLoading: isArticlesLoading } = useClusterArticles(activeCluster);

  // Set the first cluster as active when data is loaded
  if (clusters && clusters.length > 0 && !activeCluster) {
    setActiveCluster(clusters[0].name);
  }

  if (isClustersLoading) {
    return <div className="p-8 text-center">Loading clusters...</div>;
  }

  if (!clusters || clusters.length === 0) {
    return <div className="p-8 text-center">No content clusters found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">Content Clusters</h2>
      <Tabs 
        defaultValue={activeCluster || clusters[0].name} 
        onValueChange={setActiveCluster}
        className="w-full"
      >
        <TabsList className="mb-6 flex flex-wrap">
          {clusters.map((cluster) => (
            <TabsTrigger key={cluster.name} value={cluster.name} className="px-4 py-2">
              {cluster.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {clusters.map((cluster) => (
          <TabsContent key={cluster.name} value={cluster.name} className="pt-4">
            {cluster.pillarArticle && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">Pillar Article</h3>
                <Card className="p-6 bg-slate-50 dark:bg-slate-900 border-l-4 border-primary">
                  <h4 className="text-xl font-bold mb-2">{cluster.pillarArticle.title}</h4>
                  <p className="mb-4 text-muted-foreground">{cluster.pillarArticle.excerpt}</p>
                  <Link href={`/${cluster.pillarArticle.slug}`}>
                    <Button variant="default" size="sm">
                      Read Full Guide <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </div>
            )}

            <h3 className="text-2xl font-semibold mb-4">Articles in this Cluster</h3>
            {isArticlesLoading ? (
              <div className="p-4 text-center">Loading articles...</div>
            ) : !articles || articles.length === 0 ? (
              <div className="p-4 text-center">No articles found in this cluster.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles
                  .filter(article => !article.isPillar) // Filter out pillar articles as they're shown separately above
                  .map((article) => (
                    <Card key={article.id} className="overflow-hidden flex flex-col h-full">
                      <div 
                        className="h-48 bg-cover bg-center" 
                        style={{ backgroundImage: `url(${article.featuredImage})` }}
                      />
                      <div className="p-4 flex flex-col flex-grow">
                        <h4 className="text-lg font-bold mb-2">{article.title}</h4>
                        <p className="text-muted-foreground mb-4 flex-grow">{article.excerpt}</p>
                        <Link href={`/${article.slug}`}>
                          <Button variant="outline" size="sm">
                            Read Article
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}