import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    ABLY_API_KEY: process.env.ABLY_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
    JWT_SECRET: process.env.JWT_SECRET
  },
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true
  },
};

export default nextConfig;
