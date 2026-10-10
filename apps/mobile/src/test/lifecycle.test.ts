/// <reference types="node" />
// The plan's lifecycle: backups that never let an older copy win, subscription status that stays with the phone, and
// honest wording for the trial and renewal reminders. Run with `pnpm --filter @landing/mobile test`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { freshState, get, replace, set, type AppState } from "@/state/store";

const plan = (savedAt: string, extra: Partial<AppState> = {}): AppState => ({ ...freshState(), onboarded: true, savedAt, ...extra });

test("housekeeping saves don't count as a change, so a stale copy can't look newer", () => {
  replace(plan("2026-10-05T09:00:00.000Z"));
  set((s) => { s.lastSeen = "2026-10-06"; }, { quiet: true });
  assert.equal(get().savedAt, "2026-10-05T09:00:00.000Z");
  assert.equal(get().lastSeen, "2026-10-06");
  set((s) => { s.name = "Sam"; });
  assert.ok((get().savedAt ?? "") > "2026-10-05T09:00:00.000Z", "a real change still moves savedAt on");
});

test("backup: a newer backup wins over a phone with nothing new since its last sync", async () => {
  const { decide } = await import("@/state/merge");
  // iPhone edited on Monday and backed up (revision 5). The iPad last synced at revision 4 on Sunday.
  const monday = plan("2026-10-05T18:00:00Z");
  const ipad = plan("2026-10-04T10:00:00Z");
  const sync = { revision: 4, syncedAt: "2026-10-04T10:00:05Z", serverRevision: 5 };
  assert.equal(decide(ipad, monday, true, sync), "restore");
  // Even if the iPad's clock (or an old housekeeping save) made its copy look newer, nothing changed since it synced.
  const clockAhead = plan("2026-10-04T10:00:01Z");
  assert.equal(decide(clockAhead, plan("2026-10-03T00:00:00Z"), true, sync), "restore");
  // A real edit on the iPad since its last sync: the newer of the two wins, as before.
  assert.equal(decide(plan("2026-10-06T08:00:00Z"), monday, true, sync), "upload");
  // Same revision: nothing moved on the server, so this phone's newer copy is backed up.
  assert.equal(decide(plan("2026-10-06T08:00:00Z"), monday, true, { ...sync, revision: 5 }), "upload");
});

test("backup: a restored backup never brings its subscription status with it", async () => {
  const { forThisPhone } = await import("@/state/merge");
  const lapsed = { active: false, checkedAt: "2026-09-01T00:00:00Z", plan: null, ended: true };
  const live = { active: true, checkedAt: "2026-10-10T00:00:00Z", plan: "yearly" as const, until: "2027-10-10T00:00:00Z", willRenew: true };
  // Lapsed on the old phone, subscribed on the new one: still subscribed after restoring.
  assert.equal(forThisPhone(plan("2026-10-01T00:00:00Z", { subscription: lapsed }), plan("2026-10-10T00:00:00Z", { subscription: live })).subscription?.active, true);
  // A stale "active" backup doesn't unlock a phone that hasn't checked with the App Store.
  assert.equal(forThisPhone(plan("2026-10-01T00:00:00Z", { subscription: live }), freshState()).subscription, null);
});

test("trial reminder: says what happens and the price of the plan they chose", async () => {
  const { trialMessage } = await import("@/data/reminders");
  const until = new Date(2026, 9, 16, 14, 30).toISOString();
  const priced = trialMessage(until, { plan: "yearly", price: "£69.99" });
  assert.match(priced.body, /Friday 16 October/);
  assert.match(priced.body, /yearly plan starts at £69\.99 a year/);
  assert.match(trialMessage(until, { plan: "monthly", price: "£12.99" }).body, /monthly plan starts at £12\.99 a month/);
  // Price not known: plain about the plan starting.
  assert.match(trialMessage(until).body, /your Steadie plan starts/);
});

test("renewal note: 9am a week before a yearly plan renews, only for yearly plans that will renew", async () => {
  const { renewalMessage, renewalReminderAt, renewalSoon } = await import("@/data/reminders");
  const until = new Date(2027, 0, 20, 12, 0).toISOString();
  const at = renewalReminderAt(until, new Date(2027, 0, 1).getTime())!;
  assert.equal(at.getDate(), 13); assert.equal(at.getHours(), 9);
  assert.equal(renewalReminderAt(until, new Date(2027, 0, 15).getTime()), null, "never in the past");
  const yearly = { active: true, plan: "yearly" as const, trial: false, until, willRenew: true };
  const near = new Date(2027, 0, 15).getTime(), far = new Date(2026, 11, 1).getTime();
  assert.equal(renewalSoon(yearly, near), true);
  assert.equal(renewalSoon(yearly, far), false);
  assert.equal(renewalSoon({ ...yearly, plan: "monthly" }, near), false);
  assert.equal(renewalSoon({ ...yearly, willRenew: false }, near), false);
  assert.equal(renewalSoon({ ...yearly, trial: true }, near), false);
  assert.match(renewalMessage(until, "£69.99").body, /renews on Wednesday 20 January for £69\.99/);
});
