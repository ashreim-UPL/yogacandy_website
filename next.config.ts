import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // If you are deploying to a subfolder like /yogacandy/, uncomment the next line:
  // basePath: '/yogacandy',
};

export default nextConfig;