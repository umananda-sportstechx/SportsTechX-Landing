import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Every other image is a local asset extracted from the .fig. These are
    // live: the newsletter issue's hero from Beehiiv, the podcast's thumbnail
    // from YouTube, and the newest report's cover from Supabase storage.
    remotePatterns: [
      { protocol: 'https', hostname: 'media.beehiiv.com' },
      // Latest episode thumbnail off the STX Allstars playlist. Replaces the
      // Spotify hosts, which served a 640x640 square cover that could not sit
      // in a 16:9 slot uncropped; lib/podcast.ts went with them.
      { protocol: 'https', hostname: 'i.ytimg.com' },
      // CMS partner photos and testimonial avatars, from the admin panel,
      // and report covers from /api/reports.
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};

export default nextConfig;
