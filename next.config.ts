import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.113"],

  experimental: {
    serverActions: {
      bodySizeLimit: "300mb",
    },

    middlewareClientMaxBodySize: "300mb",
  },
};

export default nextConfig;