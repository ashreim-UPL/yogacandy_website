export const dynamic = 'force-static';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/auth/callback', '/api/', '/admin/'],
      },
    ],
    sitemap: 'https://www.yogacandy.info/sitemap.xml',
  };
}
