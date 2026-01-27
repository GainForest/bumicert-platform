import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Turn react strict mode off
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "climateai.org",
      },
      {
        protocol: "https",
        hostname: "cdn.bsky.app",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // // Configure for Turbopack (default in Next.js 16)
  // turbopack: {},
  // // Webpack config for when using --webpack flag
  // webpack: (config, { webpack }) => {
  //   // Ignore test files and test dependencies using webpack's IgnorePlugin
  //   config.plugins = [
  //     ...(config.plugins || []),
  //     new webpack.IgnorePlugin({
  //       resourceRegExp: /^tap$/,
  //     }),
  //     new webpack.IgnorePlugin({
  //       resourceRegExp: /^tape$/,
  //     }),
  //     new webpack.IgnorePlugin({
  //       resourceRegExp: /^why-is-node-running$/,
  //     }),
  //     new webpack.IgnorePlugin({
  //       resourceRegExp: /^@react-native-async-storage\/async-storage$/,
  //     }),
  //     new webpack.IgnorePlugin({
  //       checkResource(resource: string) {
  //         // Ignore test files in node_modules
  //         if (resource.includes("node_modules")) {
  //           if (
  //             resource.includes("/test/") ||
  //             resource.match(/\.test\.(js|mjs|ts|tsx)$/)
  //           ) {
  //             return true;
  //           }
  //         }
  //         return false;
  //       },
  //     }),
  //   ];

  //   return config;
  // },
  // // Externalize test-related packages to prevent bundling
  // serverExternalPackages: [
  //   "tap",
  //   "tape",
  //   "why-is-node-running",
  //   "@react-native-async-storage/async-storage",
  // ],
};

export default nextConfig;
