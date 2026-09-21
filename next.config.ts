import type { NextConfig } from "next";
const config: NextConfig = {
  serverExternalPackages: ["@electric-sql/pglite", "postgres"],
  devIndicators: false,
};
export default config;
