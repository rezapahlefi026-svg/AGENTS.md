export function resolveDatabaseUrl() {
  for (const name of ["DATABASE_URL", "STORAGE_DATABASE_URL", "POSTGRES_PRISMA_URL"]) {
    const value = process.env[name]?.trim();
    if (value && /^postgres(?:ql)?:\/\//i.test(value)) return value;
  }
}

export function requireDatabaseUrl() {
  const url = resolveDatabaseUrl();
  if (!url) {
    throw new Error("Atur URL PostgreSQL melalui DATABASE_URL, STORAGE_DATABASE_URL, atau POSTGRES_PRISMA_URL.");
  }
  return url;
}

export function databaseSchema(url) {
  return new URL(url).searchParams.get("schema") || "public";
}
