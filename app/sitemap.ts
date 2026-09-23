import type { MetadataRoute } from 'next';

import { SITE_URL as BASE } from './layout';

/** Add routes here as they appear. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/terms-of-service`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/imprint`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
