import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Turn react strict mode off
  reactStrictMode: false,
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
