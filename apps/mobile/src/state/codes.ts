// Discount codes typed on the paywall. Steadie's server checks the code (apps/web/lib/codes.ts) and says which
// RevenueCat offering it shows: the same plans at discounted store prices. Nothing is unlocked by the code itself; the
// purchase still goes through Apple or Google. Off without a server address (EXPO_PUBLIC_API_URL).
import { track } from "./events";
import { install } from "./install";
import { set } from "./store";

const API = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/$/, "");

/** Codes can be typed in: there's a server to check them with. */
export const codesAvailable = () => !!API;

export type Applied = { code: string; label: string; offering: string };

/** Checks a code and, if it's good, keeps it so the paywall shows its prices. Returns a sentence to show if not. */
export async function applyCode(typed: string): Promise<{ ok: true; applied: Applied } | { ok: false; error: string }> {
  const code = typed.trim().toUpperCase().replace(/\s+/g, "");
  if (!code) return { ok: false, error: "Type your code first." };
  if (!API) return { ok: false, error: "Codes can’t be checked just now. Try again later." };
  let res: Response;
  try {
    res = await fetch(`${API}/api/codes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ installId: (await install()).id, code }) });
  } catch {
    return { ok: false, error: "Check your connection and try again." };
  }
  const body = (await res.json().catch(() => null)) as Partial<Applied> & { error?: string } | null;
  if (!res.ok || !body?.offering || !body.code || !body.label) return { ok: false, error: body?.error ?? "That code couldn’t be checked just now. Try again in a moment." };
  const applied = { code: body.code, label: body.label, offering: body.offering };
  set((s) => { s.discount = applied; });
  track("code_applied", { code: applied.code.toLowerCase() });
  return { ok: true, applied };
}

/** Back to the usual prices. */
export const removeCode = () => set((s) => { s.discount = null; });
