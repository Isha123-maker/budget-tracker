import type { NextConfig } from "next";
// @ts-expect-error This package does not provide TypeScript declarations.
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(new PrismaPlugin());
    }

    return config;
  },
};

export default nextConfig;