import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "lucide-react": "lucide-react/dist/cjs/lucide-react.js",
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "lucide-react": "lucide-react/dist/cjs/lucide-react.js",
    },
  },
  allowedDevOrigins: ["192.168.243.3", "192.168.242.195", "192.168.243.10", "localhost:3000"],
};

export default nextConfig;
