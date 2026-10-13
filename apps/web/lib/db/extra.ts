// The tables added after launch (health consent, funnel events, cancellation feedback, email choices, sent recaps, discount codes), created on first use if they
// don't exist yet, so production doesn't depend on someone running `db:migrate` first. Same SQL as
// migrations/0001_nosy_black_crow.sql and 0002_glorious_shotgun.sql, which stay the record for `db:migrate`.
import { sql } from "drizzle-orm";
import { getDb } from "./index";

const STATEMENTS = [
  sql`CREATE TABLE IF NOT EXISTS "events" ("id" bigserial PRIMARY KEY NOT NULL, "created_at" timestamp with time zone DEFAULT now() NOT NULL, "install_id" text NOT NULL, "user_id" text, "name" text NOT NULL, "props" jsonb)`,
  sql`CREATE TABLE IF NOT EXISTS "health_consent" ("user_id" text PRIMARY KEY NOT NULL REFERENCES "public"."user"("id") ON DELETE cascade, "version" text NOT NULL, "given_at" timestamp with time zone NOT NULL, "withdrawn_at" timestamp with time zone, "updated_at" timestamp with time zone DEFAULT now() NOT NULL)`,
  sql`CREATE TABLE IF NOT EXISTS "lapse_feedback" ("id" bigserial PRIMARY KEY NOT NULL, "created_at" timestamp with time zone DEFAULT now() NOT NULL, "install_id" text NOT NULL, "user_id" text, "reason" text NOT NULL, "note" text)`,
  sql`CREATE TABLE IF NOT EXISTS "email_prefs" ("user_id" text PRIMARY KEY NOT NULL REFERENCES "public"."user"("id") ON DELETE cascade, "weekly_recap" boolean DEFAULT false NOT NULL, "updated_at" timestamp with time zone DEFAULT now() NOT NULL)`,
  sql`CREATE TABLE IF NOT EXISTS "recap_sent" ("user_id" text NOT NULL REFERENCES "public"."user"("id") ON DELETE cascade, "week" text NOT NULL, "sent_at" timestamp with time zone DEFAULT now() NOT NULL, CONSTRAINT "recap_sent_user_id_week_pk" PRIMARY KEY("user_id","week"))`,
  // The growth scorecard on /admin: one row per week (filled at the Monday review) and the change log.
  sql`CREATE TABLE IF NOT EXISTS "scorecard_weeks" ("week_start" date PRIMARY KEY NOT NULL, "search_impressions" integer, "search_conv_pct" numeric, "downloads" integer, "install_trial_pct" numeric, "trial_paid_pct" numeric, "active_payers" integer, "net_mrr_gbp" numeric, "rating" numeric, "rating_count" integer, "web_clicks" integer, "top10_keywords" integer, "updated_at" timestamp with time zone DEFAULT now() NOT NULL)`,
  sql`CREATE TABLE IF NOT EXISTS "growth_changes" ("id" bigserial PRIMARY KEY NOT NULL, "day" date NOT NULL, "change" text NOT NULL, "why" text, "result" text, "created_at" timestamp with time zone DEFAULT now() NOT NULL)`,
  sql`INSERT INTO "growth_changes" ("day", "change", "why", "result") SELECT * FROM (VALUES
    ('2026-10-11'::date, 'Onboarding events per screen, plus quiz_completed and plan_viewed (first-party, screen names only)', 'Week 0: measure where onboarding loses people before building v2', 'Read once the build with the events is live'),
    ('2026-10-11'::date, 'Sitemap submitted in Search Console for the getsteadieapp.com domain property', 'Week 0: get guides indexed', 'Check indexed pages in two weeks'),
    ('2026-10-11'::date, 'Listing baseline recorded; new title, subtitle and keywords held for 1.0.1', '1.0 is waiting for App Review; changing it would lose the queue spot', 'Submit 1.0.1 straight after approval')
  ) AS seed WHERE NOT EXISTS (SELECT 1 FROM "growth_changes")`,
  // Mail received at getsteadieapp.com and whether it was forwarded (lib/inbound.ts). Kept 90 days.
  sql`CREATE TABLE IF NOT EXISTS "inbound_emails" ("email_id" text PRIMARY KEY NOT NULL, "received_at" timestamp with time zone NOT NULL, "from_addr" text, "subject" text, "status" text NOT NULL, "attempts" integer DEFAULT 0 NOT NULL, "last_error" text, "forwarded_at" timestamp with time zone, "alerted_at" timestamp with time zone, "updated_at" timestamp with time zone DEFAULT now() NOT NULL)`,
  // Discount codes (lib/codes.ts): each points the app's paywall at a RevenueCat offering with discounted store prices.
  sql`CREATE TABLE IF NOT EXISTS "discount_codes" ("code" text PRIMARY KEY NOT NULL, "label" text NOT NULL, "offering" text NOT NULL, "active" boolean DEFAULT true NOT NULL, "starts_at" timestamp with time zone, "ends_at" timestamp with time zone, "max_uses" integer, "uses" integer DEFAULT 0 NOT NULL, "note" text, "created_at" timestamp with time zone DEFAULT now() NOT NULL, "updated_at" timestamp with time zone DEFAULT now() NOT NULL)`,
  sql`CREATE TABLE IF NOT EXISTS "discount_code_uses" ("code" text NOT NULL REFERENCES "discount_codes"("code") ON DELETE cascade, "install_id" text NOT NULL, "created_at" timestamp with time zone DEFAULT now() NOT NULL, CONSTRAINT "discount_code_uses_pk" PRIMARY KEY("code","install_id"))`,
  // Free access given from /admin, for the record: who, for how long, by whom.
  sql`CREATE TABLE IF NOT EXISTS "free_access_grants" ("id" bigserial PRIMARY KEY NOT NULL, "app_user_id" text NOT NULL, "duration" text NOT NULL, "note" text, "granted_by" text NOT NULL, "created_at" timestamp with time zone DEFAULT now() NOT NULL)`,
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
