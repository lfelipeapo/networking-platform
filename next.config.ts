import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000, // 25 seconds
    pagesBufferLength: 2,
  },
};

export default nextConfig;
