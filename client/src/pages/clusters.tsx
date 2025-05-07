import { ClusterView } from '@/components/content/cluster-view';
import { Helmet } from 'react-helmet';

export default function ClustersPage() {
  return (
    <>
      <Helmet>
        <title>Content Clusters | Faceless Digital Marketing</title>
        <meta name="description" content="Explore our comprehensive content clusters on faceless digital marketing strategies, organized by subject area." />
      </Helmet>
      <div className="min-h-screen">
        <div className="bg-gradient-to-b from-primary/10 to-transparent py-8 md:py-12">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Content Clusters</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Explore our comprehensive guides organized by subject area.
            </p>
          </div>
        </div>
        <ClusterView />
      </div>
    </>
  );
}