// A few funnel events (app opened, onboarding finished, trial started...), sent to Steadie's own server: no
// third-party analytics. Each carries the random install ID, the event name and, at most, a short code such as which
// plan; never health values or anything typed. Signed in, the server attaches the account. Queued on the phone and sent
// in small batches, so nothing is lost offline, and nothing at all is sent in demo mode or without a server address.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { install } from "./install";
import { get } from "./store";

export type EventName =
  | "app_first_open" | "onboarding_started" | "onboarding_completed" | "consent_given" | "paywall_viewed" | "trial_started"
  | "purchase_completed" | "subscription_paid" | "restore_completed" | "check_in_completed" | "week_1_completed"
  | "notification_permission_granted" | "notification_permission_denied" | "account_deleted";
type Props = Record<string, string | number | boolean>;
interface Queued { name: EventName; at: string; props?: Props }

const API = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const KEY = "steadie.events.v1";
const MAX_QUEUE = 200, BATCH = 25;
let queue: Queued[] | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
let sending: Promise<void> | null = null;
let token: () => Promise<string | null> = async () => null;

/** The account module hands over how to read the sign-in token, so events can be linked when signed in. */
export function eventsTokenFrom(fn: () => Promise<string | null>) { token = fn; }

async function load(): Promise<Queued[]> {
  if (queue) return queue;
  const raw = await AsyncStorage.getItem(KEY).catch(() => null);
  try { queue = raw ? (JSON.parse(raw) as Queued[]) : []; } catch { queue = []; }
  return queue;
}
const persist = () => AsyncStorage.setItem(KEY, JSON.stringify(queue ?? [])).catch(() => {});

/** Records an event. Never throws and never waits for the network. */
export function track(name: EventName, props?: Props) {
  if (!API || get().demo) return;
  const e: Queued = { name, at: new Date().toISOString(), ...(props ? { props } : {}) };
  load().then((q) => {
    q.push(e);
    if (q.length > MAX_QUEUE) q.splice(0, q.length - MAX_QUEUE);
    persist();
    clearTimeout(timer);
    timer = setTimeout(() => { flushEvents().catch(() => {}); }, 2000);
  }).catch(() => {});
}

/** Sends what's queued, a batch at a time. Stops quietly on any failure and tries again with the next event or open. */
export function flushEvents(): Promise<void> {
  if (!API) return Promise.resolve();
  sending ??= (async () => {
    try {
      const q = await load();
      const { id } = await install(get().startedOn);
      while (q.length) {
        const batch = q.slice(0, BATCH);
        const t = await token().catch(() => null);
        const r = await fetch(`${API}/api/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Origin: "steadie://", ...(t ? { Authorization: `Bearer ${t}` } : {}) },
          body: JSON.stringify({ installId: id, events: batch }),
        });
        if (r.status === 429 || r.status >= 500) break;
        q.splice(0, batch.length); // sent, or refused as invalid (which retrying won't fix)
        await persist();
      }
    } catch { /* offline: try later */ } finally { sending = null; }
  })();
  return sending;
}
