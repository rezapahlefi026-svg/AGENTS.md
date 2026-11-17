import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { databaseSchema, requireDatabaseUrl } from "./database-url.mjs";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function createPrisma() {
  const connectionString = requireDatabaseUrl();
  const adapter = new PrismaPg({ connectionString, max: 2 }, {
    schema: databaseSchema(connectionString),
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
