import type { NextConfig } from "next";

/**
 * Next.js configuration with development enhancements.
 * - allowedDevOrigins: permits local network access during dev.
 */
const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.113"],
};

export default nextConfig;
