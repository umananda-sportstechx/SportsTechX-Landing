import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Every image is a local asset extracted from the .fig — no remote patterns needed.
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
