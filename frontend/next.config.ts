import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [process.env.HOSTNAME || "localhost"],
};

export default nextConfig;