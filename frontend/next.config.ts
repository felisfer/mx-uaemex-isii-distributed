import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: process.env.ALLOWED_HOSTNAMES?.split(","),
};

export default nextConfig;