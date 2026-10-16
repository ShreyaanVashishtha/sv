import { MetadataRoute } from 'next';
import { getContent } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let baseUrl = 'https://sv7.dev';
  try {
    const data = await getContent();
    if (data.settings?.canonicalUrl) {
      baseUrl = data.settings.canonicalUrl.replace(/\/$/, '');
    }
  } catch (e) {
    // fallback to default
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/photography`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];
}
