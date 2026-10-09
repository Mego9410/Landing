// The database: Better Auth's tables (user, session, account, verification, rate limits), each person's synced app
// data, and the website waitlist. Postgres on Neon in production; an embedded Postgres (PGlite) for local work.
// After changing this file, run `pnpm --filter @landing/web db:generate` to write a migration.
import { bigint, bigserial, boolean, index, integer, jsonb, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

const created = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updated = () => timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: created(),
  updatedAt: updated(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: created(),
  updatedAt: updated(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: created(),
  updatedAt: updated(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: created(),
  updatedAt: updated(),
});

export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

/** Each person's app data as one document. `revision` goes up by one on every save, so two phones can't silently
 *  overwrite each other: a save based on an old revision is refused and the phone decides what to keep. */
export const appState = pgTable("app_state", {
  userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  data: jsonb("data").notNull(),
  revision: integer("revision").notNull(),
  updatedAt: updated(),
});

export const waitlist = pgTable("waitlist", {
  email: text("email").primaryKey(),
  status: text("status"),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
  createdAt: created(),
});

/** Consent to keep health information in the backup (UK GDPR special category data): which wording, when it was given,
 *  and when it was withdrawn. Written by the sync API; withdrawing deletes the backup. */
export const healthConsent = pgTable("health_consent", {
  userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  version: text("version").notNull(),
  givenAt: timestamp("given_at", { withTimezone: true }).notNull(),
  withdrawnAt: timestamp("withdrawn_at", { withTimezone: true }),
  updatedAt: updated(),
});

/** A minimal, first-party funnel: named app events with a random install ID, no health values and no free text. */
export const events = pgTable("events", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  createdAt: created(),
  installId: text("install_id").notNull(),
  userId: text("user_id"),
  name: text("name").notNull(),
  props: jsonb("props"),
}, (t) => [index("events_name_created_idx").on(t.name, t.createdAt), index("events_install_idx").on(t.installId)]);

/** Why people cancelled, from the one-question card after a cancellation. */
export const lapseFeedback = pgTable("lapse_feedback", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  createdAt: created(),
  installId: text("install_id").notNull(),
  userId: text("user_id"),
  reason: text("reason").notNull(),
  note: text("note"),
});

/** Email choices kept by us rather than Resend: the weekly recap (off unless turned on). */
export const emailPrefs = pgTable("email_prefs", {
  userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  weeklyRecap: boolean("weekly_recap").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Which weekly recaps have gone out (week = that Sunday's date), so a re-run never sends one twice. */
export const recapSent = pgTable("recap_sent", {
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  week: text("week").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.userId, t.week] })]);
