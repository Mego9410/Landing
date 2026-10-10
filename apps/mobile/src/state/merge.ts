// Deciding between this phone's copy and the backup. Kept free of React Native so it can be tested on its own.
import type { AppState } from "./store";

/** restore: take the backup. upload: back up this phone. ask: both have a plan and they've never met, so the person
 *  picks. none: nothing worth doing (demo mode, or neither has finished onboarding). */
export type Choice = "restore" | "upload" | "ask" | "none";

/** Where this phone and the backup stood at the last sync: the revision this phone last saw, when it synced, and the
 *  backup's revision now. */
export interface Sync { revision: number; syncedAt: string | null; serverRevision: number }

/** `linked` is true once this phone has backed up to this account before, so its changes follow on from the backup. */
export function decide(local: AppState, server: AppState | null, linked: boolean, sync?: Sync): Choice {
  if (local.demo) return "none";
  if (!server?.onboarded) return local.onboarded ? "upload" : "none";
  if (!local.onboarded) return "restore";
  if (!linked) return "ask";
  // The backup has moved on since this phone last synced, and nothing has changed here since: take it, whatever the
  // two clocks say.
  if (sync && sync.serverRevision > sync.revision && (local.savedAt ?? "") <= (sync.syncedAt ?? "")) return "restore";
  return (server.savedAt ?? "") > (local.savedAt ?? "") ? "restore" : "upload";
}

/** A backup made ready for this phone. Apple Health permission belongs to each phone, so it's asked for again; the
 *  newer acceptance of the health information is kept. The subscription status is this phone's own (it comes from the
 *  App Store on this phone), so a backup never brings an old one with it. */
export function forThisPhone(server: AppState, local: AppState): AppState {
  const disclaimer = local.disclaimer && (!server.disclaimer || local.disclaimer.version > server.disclaimer.version) ? local.disclaimer : server.disclaimer;
  return { ...server, demo: false, disclaimer, subscription: local.subscription ?? null, settings: { ...server.settings, appleHealth: false } };
}

/** A short description of a copy, for choosing between two: "12 days logged, 30 weigh-ins". */
export function describe(s: AppState): string {
  const days = Object.keys(s.days).length, weights = s.weights.length;
  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
  return `${plural(days, "day", "days")} logged, ${plural(weights, "weigh-in", "weigh-ins")}`;
}
