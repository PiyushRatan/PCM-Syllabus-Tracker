import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow running dev server from any host in the IDE
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
  experimental: {
    allowedDevOrigins: ['*'],
  },
};

export default nextConfig;
