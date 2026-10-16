import { MetadataRoute } from 'next';
import { getContent } from '@/lib/content';

export default async function robots(): Promise<MetadataRoute.Robots> {
  let baseUrl = 'https://sv7.dev';
  try {
    const data = await getContent();
    if (data.settings?.canonicalUrl) {
      baseUrl = data.settings.canonicalUrl.replace(/\/$/, '');
    }
  } catch (e) {
    // fallback to default
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
