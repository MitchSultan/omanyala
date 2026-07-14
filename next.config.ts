import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**', // Allows all paths under this domain
      },
      {
        protocol: 'https',
        hostname: '*.example.com', // Allows any subdomain
        pathname: '/assets/**',
      },
    ],
  },
};

export default nextConfig;
