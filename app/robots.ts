import type { MetadataRoute } from 'next';
import { SITE_URL } from './layout';

/**
 * The answer-engine crawlers are let through deliberately: the landing page is
 * the front door and benefits more from being quotable than the app hub does.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Bingbot'], allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
