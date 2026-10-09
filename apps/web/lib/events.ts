// The app's funnel events: what may be recorded, checked before anything is stored. No third-party analytics: these go
// to our own database (the events table). Names come from a fixed list; props are a few short codes, numbers or
// yes/no values, never free text, health values or anything that identifies someone.

export const EVENT_NAMES = [
  "app_first_open", "onboarding_started", "onboarding_completed", "consent_given", "paywall_viewed", "trial_started",
  "purchase_completed", "subscription_paid", "restore_completed", "check_in_completed", "week_1_completed",
  "notification_permission_granted", "notification_permission_denied", "account_deleted",
] as const;
export type EventName = (typeof EVENT_NAMES)[number];

/** The answers on the cancellation card (lapse_feedback.reason). */
export const LAPSE_REASONS = ["cost", "got_what_i_needed", "not_enough_time", "didnt_suit_me", "other"] as const;

export const MAX_BATCH = 25;
const NAMES = new Set<string>(EVENT_NAMES);
const KEY = /^[a-z_]{1,24}$/;
const CODE = /^[a-z0-9_.-]{1,32}$/i;
// Keys that could carry health or personal information are refused outright, whatever the value.
const BANNED_KEY = /weight|kg|lb|bmi|dose|mg|email|name|phone|note|text|message|address|age|height/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface CleanEvent { name: EventName; at: Date; props: Record<string, string | number | boolean> | null }

/** Up to six props: short codes, whole or decimal numbers, or yes/no. Anything else drops the prop. */
export function cleanProps(raw: unknown): CleanEvent["props"] {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(raw).slice(0, 6)) {
    if (!KEY.test(k) || BANNED_KEY.test(k)) continue;
    if (typeof v === "boolean" || (typeof v === "number" && Number.isFinite(v) && Math.abs(v) < 1e6)) out[k] = v;
    else if (typeof v === "string" && CODE.test(v)) out[k] = v;
  }
  return Object.keys(out).length ? out : null;
}

/** The install ID and the events worth keeping from a request body, or a reason it was refused. */
export function parseEvents(body: unknown, now = new Date()): { installId: string; events: CleanEvent[] } | { error: string } {
  const b = body as { installId?: unknown; events?: unknown } | null;
  if (!b || typeof b.installId !== "string" || !UUID.test(b.installId)) return { error: "Send { installId, events }." };
  if (!Array.isArray(b.events) || !b.events.length) return { error: "No events." };
  if (b.events.length > MAX_BATCH) return { error: `At most ${MAX_BATCH} events at a time.` };
  const events: CleanEvent[] = [];
  for (const e of b.events as { name?: unknown; at?: unknown; props?: unknown }[]) {
    if (!e || typeof e.name !== "string" || !NAMES.has(e.name)) continue;
    // The phone's clock, if it's within the last week and not in the future; otherwise now.
    const t = typeof e.at === "string" ? new Date(e.at) : null;
    const at = t && !Number.isNaN(t.getTime()) && t <= now && now.getTime() - t.getTime() < 7 * 86_400_000 ? t : now;
    events.push({ name: e.name as EventName, at, props: cleanProps(e.props) });
  }
  return { installId: b.installId.toLowerCase(), events };
}

/** A simple per-instance limit on requests per key per minute. The database check per install backs it up. */
const hits = new Map<string, { n: number; reset: number }>();
export function tooMany(key: string, limit = 30, now = Date.now()): boolean {
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  const h = hits.get(key);
  if (!h || h.reset < now) { hits.set(key, { n: 1, reset: now + 60_000 }); return false; }
  h.n++;
  return h.n > limit;
}
