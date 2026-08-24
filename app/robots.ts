import type { MetadataRoute } from 'next';

/**
 * Mirrors the conventions in the app's own robots.txt (STX-WebApp,
 * client/public/robots.txt), including its deliberate choice to let the
 * answer-engine crawlers through — the landing page is the front door and
 * benefits more from being quotable than the hub does.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Bingbot'], allow: '/' },
    ],
    sitemap: 'https://sportstechx.com/sitemap.xml',
  };
}
