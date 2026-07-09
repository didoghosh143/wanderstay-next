import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/wanderstay-next',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
