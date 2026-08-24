import type { MetadataRoute } from 'next';

/** One page, so one entry. Add routes here as they appear. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://sportstechx.com', changeFrequency: 'weekly', priority: 1 }];
}
