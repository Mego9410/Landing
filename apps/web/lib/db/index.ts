// One database connection for the server. With DATABASE_URL (Neon, set by the Vercel integration) it uses Neon's
// HTTP driver. Without it, outside production, it uses an embedded Postgres in .data/ and applies the migrations,
// so `pnpm dev` works with no setup.
import { mkdirSync } from "node:fs";
import path from "node:path";
import * as schema from "./schema";

type Db = Awaited<ReturnType<typeof connect>>;
let db: Promise<Db> | undefined;

async function connect() {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    return drizzle(neon(url), { schema });
  }
  if (process.env.NODE_ENV === "production" && process.env.VERCEL) throw new Error("DATABASE_URL isn't set. Add the Neon integration in Vercel.");
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  const dir = process.env.PGLITE_DIR || path.join(process.cwd(), ".data", "pglite");
  mkdirSync(path.dirname(dir), { recursive: true });
  const client = new PGlite(dir);
  const local = drizzle(client, { schema });
  await migrate(local, { migrationsFolder: path.join(process.cwd(), "lib", "db", "migrations") });
  return local as unknown as ReturnType<typeof import("drizzle-orm/neon-http").drizzle<typeof schema>>;
}

export function getDb(): Promise<Db> {
  return (db ??= connect());
}
export { schema };
