// Discount codes typed on the paywall. Steadie's server checks the code (apps/web/lib/codes.ts) and says what it gives:
// a RevenueCat offering to show (the same plans at discounted store prices, bought through Apple or Google as usual),
// or, for a free-access code, a request the Steadie team approves from /admin. Nothing is unlocked by the code itself.
// Off without a server address (EXPO_PUBLIC_API_URL).
import { track } from "./events";
import { install } from "./install";
import { get, set } from "./store";
import { billingEnabled, subscriberId } from "./subscription";

const API = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/$/, "");

/** Codes can be typed in: there's a server to check them with. */
export const codesAvailable = () => !!API;

export type Applied = { kind: "offering"; code: string; label: string; offering: string } | { kind: "free"; code: string; label: string };

/** Checks a code and, if it's good, keeps it so the paywall shows its prices. Returns a sentence to show if not. */
export async function applyCode(typed: string): Promise<{ ok: true; applied: Applied } | { ok: false; error: string }> {
  const code = typed.trim().toUpperCase().replace(/\s+/g, "");
  if (!code) return { ok: false, error: "Type your code first." };
  if (!API) return { ok: false, error: "Codes can’t be checked just now. Try again later." };
  // The Steadie ID goes with it so a free-access code can be approved for this phone; having had the plan rules out
  // codes for new members.
  const sub = get().subscription, hadPlan = !!(sub?.active || sub?.ended);
  let res: Response;
  try {
    const appUserId = billingEnabled() ? await subscriberId().catch(() => undefined) : undefined;
    res = await fetch(`${API}/api/codes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ installId: (await install()).id, code, appUserId, hadPlan }) });
  } catch {
    return { ok: false, error: "Check your connection and try again." };
  }
  const body = (await res.json().catch(() => null)) as { kind?: string; code?: string; label?: string; offering?: string; error?: string } | null;
  const free = body?.kind === "free";
  if (!res.ok || !body?.code || !body.label || (!free && !body.offering)) return { ok: false, error: body?.error ?? "That code couldn’t be checked just now. Try again in a moment." };
  const applied: Applied = free ? { kind: "free", code: body.code, label: body.label } : { kind: "offering", code: body.code, label: body.label, offering: body.offering! };
  set((s) => {
    if (applied.kind === "free") s.freeRequest = { code: applied.code, label: applied.label, at: new Date().toISOString() };
    else s.discount = { code: applied.code, label: applied.label, offering: applied.offering };
  });
  track("code_applied", { code: applied.code.toLowerCase() });
  return { ok: true, applied };
}

/** Back to the usual prices. */
export const removeCode = () => set((s) => { s.discount = null; });
