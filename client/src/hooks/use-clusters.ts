import { useQuery } from '@tanstack/react-query';
import { Article } from '@shared/schema';

interface Cluster {
  name: string;
  pillarArticle: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage: string;
  } | null;
}

export function useClusters() {
  return useQuery<Cluster[]>({
    queryKey: ['/api/clusters'],
  });
}

export function useClusterArticles(clusterName: string | null | undefined) {
  return useQuery<Article[]>({
    queryKey: ['/api/articles', { cluster: clusterName }],
    enabled: !!clusterName,
  });
}

export function usePillarArticles() {
  return useQuery<Article[]>({
    queryKey: ['/api/articles', { isPillar: true }],
  });
}