import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {},
    mdxRs: true,
    serverComponentsExternalPackages: ['mongoose'],
  }
};

export default nextConfig;
