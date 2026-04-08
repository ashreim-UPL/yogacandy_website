export const dynamic = 'force-static';
import { allStyles } from '@/app/data/styles';
import { allArticles } from '@/app/data/articles';
import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.yogacandy.info';

export default function sitemap(): MetadataRoute.Sitemap {
  const styleEntries = allStyles.map((style) => ({
    url: `${BASE_URL}/styles/${style.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const articleEntries = allArticles.map((article) => ({
    url: `${BASE_URL}/articles/${article.id}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/styles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/community`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/auth/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/yoga-wheel`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...styleEntries,
    ...articleEntries,
  ];
}
