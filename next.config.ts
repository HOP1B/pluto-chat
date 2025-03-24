import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    ABLY_API_KEY: process.env.ABLY_API_KEY,
  },
};

export default nextConfig;
