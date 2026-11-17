import type { NextConfig } from "next";

const config: NextConfig = {
  agentRules: false,
  experimental: { serverActions: { bodySizeLimit: "4.25mb" } },
  allowedDevOrigins: ["127.0.0.1"],
};

export default config;
