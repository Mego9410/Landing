// The tables added after launch (health consent, funnel events, cancellation feedback), created on first use if they
// don't exist yet, so production doesn't depend on someone running `db:migrate` first. Same SQL as
// migrations/0001_nosy_black_crow.sql, which stays the record for `db:migrate`.
import { sql } from "drizzle-orm";
import { getDb } from "./index";

const STATEMENTS = [
  sql`CREATE TABLE IF NOT EXISTS "events" ("id" bigserial PRIMARY KEY NOT NULL, "created_at" timestamp with time zone DEFAULT now() NOT NULL, "install_id" text NOT NULL, "user_id" text, "name" text NOT NULL, "props" jsonb)`,
  sql`CREATE TABLE IF NOT EXISTS "health_consent" ("user_id" text PRIMARY KEY NOT NULL REFERENCES "public"."user"("id") ON DELETE cascade, "version" text NOT NULL, "given_at" timestamp with time zone NOT NULL, "withdrawn_at" timestamp with time zone, "updated_at" timestamp with time zone DEFAULT now() NOT NULL)`,
  sql`CREATE TABLE IF NOT EXISTS "lapse_feedback" ("id" bigserial PRIMARY KEY NOT NULL, "created_at" timestamp with time zone DEFAULT now() NOT NULL, "install_id" text NOT NULL, "user_id" text, "reason" text NOT NULL, "note" text)`,
  sql`CREATE INDEX IF NOT EXISTS "events_name_created_idx" ON "events" USING btree ("name","created_at")`,
  sql`CREATE INDEX IF NOT EXISTS "events_install_idx" ON "events" USING btree ("install_id")`,
];

let ready: Promise<void> | undefined;
/** Makes sure the post-launch tables exist (once per server instance). */
export function ensureExtraTables() {
  return (ready ??= (async () => {
    const db = await getDb();
    for (const q of STATEMENTS) await db.execute(q);
  })().catch((e) => { ready = undefined; throw e; }));
}
