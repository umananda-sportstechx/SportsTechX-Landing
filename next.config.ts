import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Every other image is a local asset extracted from the .fig. These two
    // are live: the newsletter issue's hero from Beehiiv, and the podcast's
    // cover art from Spotify (which serves it off several CDN hosts).
    remotePatterns: [
      { protocol: 'https', hostname: 'media.beehiiv.com' },
      { protocol: 'https', hostname: '**.spotifycdn.com' },
      { protocol: 'https', hostname: 'i.scdn.co' },
    ],
  },
};

export default nextConfig;
