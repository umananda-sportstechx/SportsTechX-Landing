import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Every other image is a local asset extracted from the .fig; this one is
    // the current newsletter issue's hero, straight off the Beehiiv feed.
    remotePatterns: [{ protocol: 'https', hostname: 'media.beehiiv.com' }],
  },
};

export default nextConfig;
