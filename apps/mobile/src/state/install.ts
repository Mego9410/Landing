// Facts about this install of the app, kept on the phone only and never in the plan backup: a random install ID (for
// the funnel counts), when the app was first opened, and when the App Store review prompt was last shown. Deleting
// the app, or "Delete everything", starts afresh.
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Install {
  id: string;
  firstOpenAt: string;
  /** Set on a fresh install, so app_first_open is counted once. */
  isNew?: boolean;
  reviewAskedAt?: string | null;
  /** Funnel events sent once per install. */
  paidSent?: boolean;
  week1Sent?: boolean;
  /** The cancellation the "why are you leaving" card was answered or closed for (its end date), so it shows once. */
  lapseFor?: string | null;
}

const KEY = "steadie.install.v1";
let loaded: Promise<Install> | null = null;

/** A random version 4 UUID. Not used for anything secret, so Math.random is fine. */
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    return (ch === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** This install's record, made on first use. `startedOn` (when onboarding finished) backdates the first open for
 *  people who had the app before this record existed. */
export function install(startedOn?: string | null): Promise<Install> {
  loaded ??= (async () => {
    const raw = await AsyncStorage.getItem(KEY).catch(() => null);
    if (raw) { try { return JSON.parse(raw) as Install; } catch { /* make a new one */ } }
    const now = new Date().toISOString();
    const first = startedOn && `${startedOn}T12:00:00.000Z` < now ? `${startedOn}T12:00:00.000Z` : now;
    const fresh: Install = { id: uuid(), firstOpenAt: first, isNew: !startedOn, reviewAskedAt: null };
    await AsyncStorage.setItem(KEY, JSON.stringify(fresh)).catch(() => {});
    return fresh;
  })();
  return loaded;
}

export async function updateInstall(patch: Partial<Install>) {
  const next = { ...(await install()), ...patch };
  loaded = Promise.resolve(next);
  await AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
}

/** Forgets this install (after "Delete everything"), so the next open is a fresh one. */
export async function resetInstall() {
  loaded = null;
  await AsyncStorage.removeItem(KEY).catch(() => {});
}
