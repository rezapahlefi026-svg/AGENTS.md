import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import { resolveDatabaseUrl } from "./lib/database-url.mjs";

const url = resolveDatabaseUrl();
if (url) process.env.DATABASE_URL = url;

export default defineConfig({
  schema: "prisma/schema.prisma",
  ...(url ? { datasource: { url: env("DATABASE_URL") } } : {}),
});
