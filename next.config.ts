import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {},
    mdxRs: true,
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*'
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
