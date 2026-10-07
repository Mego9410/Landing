// Applies database migrations to Neon. Run with DATABASE_URL set: `pnpm --filter @landing/web db:migrate`.
// (Locally, without DATABASE_URL, the embedded database migrates itself when the server starts.)
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

const url = process.env.DATABASE_URL;
if (!url) { console.error("Set DATABASE_URL to the Neon connection string first."); process.exit(1); }
await migrate(drizzle(neon(url)), { migrationsFolder: new URL("../lib/db/migrations", import.meta.url).pathname });
console.log("Database is up to date.");
