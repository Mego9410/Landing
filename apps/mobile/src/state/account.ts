// Accounts and backup. The app works without an account; signing in (Apple or an emailed code) backs the whole plan
// up to Landing's server so it moves to a new phone. The phone stays the working copy: every change is saved on the
// phone first and backed up a few seconds later, and the backup is checked for newer changes when the app opens.
// Nothing is uploaded until onboarding is finished, so an empty phone can never replace a real backup.
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants, { ExecutionEnvironment } from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { useSyncExternalStore } from "react";
import { AppState as RNAppState, Platform } from "react-native";
import { deleteEverything } from "./data";
import { decide, describe, forThisPhone } from "./merge";
import { applyReminders } from "./reminders";
import { get, migrate, replace, subscribe, type AppState } from "./store";

const API = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const TOKEN_KEY = "landing-token";
const META_KEY = "landing-account";
const PUSH_DELAY = 4000;

export interface Account {
  email: string;
  /** The backup's revision this phone last saw; 0 before the first backup. */
  revision: number;
  /** When the last backup or restore finished. */
  syncedAt: string | null;
  /** True once this phone has backed up to this account, so later changes follow on from the backup. */
  linked: boolean;
}

/** Accounts need the server address; without it (for example an offline preview) sign-in is hidden. */
export const accountsAvailable = () => !!API;

/* ---------- account state ---------- */
type Status = "idle" | "saving" | "offline";
let account: Account | null = null;
let status: Status = "idle";
const listeners = new Set<() => void>();
let snapshot: { account: Account | null; status: Status } = { account, status };
function emit() { snapshot = { account, status }; listeners.forEach((l) => l()); }
function setAccount(next: Account | null) {
  account = next;
  emit();
  (next ? AsyncStorage.setItem(META_KEY, JSON.stringify(next)) : AsyncStorage.removeItem(META_KEY)).catch(() => {});
}
export function useAccount() {
  return useSyncExternalStore((l) => { listeners.add(l); return () => { listeners.delete(l); }; }, () => snapshot, () => snapshot);
}

/* ---------- the token: the Keychain on iPhone, browser storage on the web build ---------- */
const web = Platform.OS === "web";
const readToken = () => (web ? AsyncStorage.getItem(TOKEN_KEY) : SecureStore.getItemAsync(TOKEN_KEY));
const writeToken = (t: string) => (web ? AsyncStorage.setItem(TOKEN_KEY, t) : SecureStore.setItemAsync(TOKEN_KEY, t));
const clearToken = () => (web ? AsyncStorage.removeItem(TOKEN_KEY) : SecureStore.deleteItemAsync(TOKEN_KEY));

/** A friendly message for anything that goes wrong talking to the server. */
export class AccountError extends Error {}

async function call(path: string, init: RequestInit = {}, token?: string | null): Promise<Response> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  // A browser sets Origin itself; the app says where it's from so the server's cross-site check accepts it.
  if (!web) headers.Origin = "landing://";
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    return await fetch(API + path, { ...init, headers: { ...headers, ...(init.headers as Record<string, string>) } });
  } catch {
    throw new AccountError("Couldn't reach Landing. Check your connection and try again.");
  }
}

/* ---------- signing in ---------- */
/** Sends a six-digit code to the email address. */
export async function sendCode(email: string): Promise<void> {
  const r = await call("/api/auth/email-otp/send-verification-otp", { method: "POST", body: JSON.stringify({ email: email.trim().toLowerCase(), type: "sign-in" }) });
  if (r.status === 429) throw new AccountError("That's a few codes in a row. Wait a minute, then try again.");
  if (!r.ok) throw new AccountError("Couldn't send a code to that address. Check it and try again.");
}

/** Signs in with the code from the email. */
export async function verifyCode(email: string, code: string): Promise<Outcome> {
  const r = await call("/api/auth/sign-in/email-otp", { method: "POST", body: JSON.stringify({ email: email.trim().toLowerCase(), otp: code.trim() }) });
  if (r.status === 429) throw new AccountError("Too many tries. Wait a minute, then try again.");
  if (!r.ok) throw new AccountError("That code didn't match, or it's more than 10 minutes old. Check it or send a new one.");
  return signedIn(r);
}

/** Sign in with Apple needs an App Store or development build on an iPhone: Expo Go signs in as Expo's own app. */
export async function appleAvailable(): Promise<boolean> {
  if (Platform.OS !== "ios" || Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return false;
  const Apple = await import("expo-apple-authentication");
  return Apple.isAvailableAsync().catch(() => false);
}

/** Signs in with Apple. Null if the person closes the Apple sheet. */
export async function signInWithApple(): Promise<Outcome | null> {
  const Apple = await import("expo-apple-authentication");
  let token: string | null;
  try {
    const cred = await Apple.signInAsync({ requestedScopes: [Apple.AppleAuthenticationScope.EMAIL] });
    token = cred.identityToken;
  } catch (e) {
    if ((e as { code?: string }).code === "ERR_REQUEST_CANCELED") return null;
    throw new AccountError("Sign in with Apple didn't work. Try again, or use your email instead.");
  }
  if (!token) throw new AccountError("Sign in with Apple didn't work. Try again, or use your email instead.");
  const r = await call("/api/auth/sign-in/social", { method: "POST", body: JSON.stringify({ provider: "apple", idToken: { token } }) });
  if (!r.ok) throw new AccountError("Sign in with Apple didn't work. Try again, or use your email instead.");
  return signedIn(r);
}

/** What signing in did: restored a backup, backed this phone up, found nothing to do yet, or found two plans to pick
 *  between (both this phone and the backup have one). */
export type Outcome = { kind: "restored" | "uploaded" | "none" } | { kind: "ask"; phone: string; backup: string; backupDate: string };

async function signedIn(r: Response): Promise<Outcome> {
  const token = r.headers.get("set-auth-token");
  const body = (await r.json().catch(() => null)) as { user?: { email?: string } } | null;
  if (!token) throw new AccountError("Signing in didn't finish. Try again.");
  await writeToken(token);
  setAccount({ email: body?.user?.email ?? "", revision: 0, syncedAt: null, linked: false });
  return reconcile();
}

/* ---------- backing up and restoring ---------- */
let pending: { data: AppState; revision: number } | null = null; // the backup, while the person picks between two plans
let applying = false;
let timer: ReturnType<typeof setTimeout> | undefined;
let running: Promise<unknown> = Promise.resolve();

/** Runs one backup job at a time, so two can't race each other. */
function queue<T>(job: () => Promise<T>): Promise<T> {
  const next = running.then(job, job);
  running = next.catch(() => {});
  return next;
}

async function fetchBackup(token: string): Promise<{ data: AppState; revision: number } | null | "signed-out"> {
  const r = await call("/api/sync", {}, token);
  if (r.status === 401) return "signed-out";
  if (r.status === 204) return null;
  if (!r.ok) throw new AccountError("Couldn't check your backup.");
  const body = (await r.json()) as { data: Record<string, unknown>; revision: number };
  const data = migrate(body.data);
  return data ? { data, revision: body.revision } : null;
}

/** Takes the backup on this phone and sets up this phone's reminders from it. */
function restore(backup: { data: AppState; revision: number }) {
  const next = forThisPhone(backup.data, get());
  applying = true;
  replace(next);
  applying = false;
  setAccount({ ...account!, revision: backup.revision, syncedAt: new Date().toISOString(), linked: true });
  applyReminders(next).catch(() => {});
}

async function upload(token: string, baseRevision: number): Promise<"done" | "conflict" | "signed-out"> {
  status = "saving"; emit();
  const r = await call("/api/sync", { method: "PUT", body: JSON.stringify({ data: get(), baseRevision }) }, token);
  status = "idle";
  if (r.status === 401) return "signed-out";
  if (r.status === 409) { emit(); return "conflict"; }
  if (!r.ok) { emit(); throw new AccountError("Couldn't back up just now."); }
  const body = (await r.json()) as { revision: number };
  setAccount({ ...account!, revision: body.revision, syncedAt: new Date().toISOString(), linked: true });
  return "done";
}

/** Brings this phone and the backup together: restore, upload, or ask. */
function reconcile(): Promise<Outcome> {
  return queue(async () => {
    const token = await readToken();
    if (!token || !account) return { kind: "none" as const };
    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        const backup = await fetchBackup(token);
        if (backup === "signed-out") { await forget(); return { kind: "none" as const }; }
        if (status === "offline") { status = "idle"; emit(); }
        // Nothing new on the server and nothing changed here: no need to upload again.
        if (backup && account.linked && backup.revision === account.revision && (get().savedAt ?? "") <= (account.syncedAt ?? "")) return { kind: "none" as const };
        const choice = decide(get(), backup?.data ?? null, account.linked);
        if (choice === "restore") { restore(backup!); return { kind: "restored" as const }; }
        if (choice === "ask") {
          pending = backup!;
          return { kind: "ask" as const, phone: describe(get()), backup: describe(backup!.data), backupDate: backup!.data.savedAt ?? "" };
        }
        if (choice === "none") return { kind: "none" as const };
        const done = await upload(token, backup?.revision ?? 0);
        if (done === "signed-out") { await forget(); return { kind: "none" as const }; }
        if (done === "done") return { kind: "uploaded" as const };
        // Another phone backed up in between: look again.
      }
      return { kind: "none" as const };
    } catch (e) {
      status = "offline"; emit();
      throw e instanceof AccountError ? e : new AccountError("Couldn't reach Landing. Your plan is safe on this phone.");
    }
  });
}

/** After "ask": keep the backup (replacing this phone's plan) or keep this phone's plan (replacing the backup). */
export async function choose(keep: "backup" | "phone"): Promise<void> {
  const backup = pending;
  pending = null;
  if (!backup || !account) return;
  if (keep === "backup") { restore(backup); return; }
  // Keep this phone's: upload it over the backup the person saw. If another phone changed it meanwhile, look again.
  setAccount({ ...account, linked: true, revision: backup.revision });
  await queue(async () => {
    const token = await readToken();
    if (token && (await upload(token, backup.revision)) === "signed-out") await forget();
  });
}

/** Backs up now, for "Back up now" in Settings and when the app goes to the background. */
export function backUpNow(): Promise<Outcome> {
  clearTimeout(timer);
  return reconcile();
}

/** Starts watching for changes: called once after the saved state has loaded. */
export async function startBackup(): Promise<() => void> {
  try {
    const raw = await AsyncStorage.getItem(META_KEY);
    if (raw && (await readToken())) { account = JSON.parse(raw) as Account; emit(); } else if (raw) await AsyncStorage.removeItem(META_KEY);
  } catch {
    account = null;
  }
  const quiet = () => {};
  const unsub = subscribe(() => {
    if (applying || !account || get().demo) return;
    clearTimeout(timer);
    timer = setTimeout(() => { reconcile().catch(quiet); }, PUSH_DELAY);
  });
  const app = RNAppState.addEventListener("change", (next) => {
    if (!account) return;
    if (next === "active" || next === "background") backUpNow().catch(quiet);
  });
  if (account) reconcile().catch(quiet);
  return () => { unsub(); app.remove(); clearTimeout(timer); };
}

/* ---------- signing out and deleting ---------- */
async function forget() {
  clearTimeout(timer);
  pending = null;
  await clearToken().catch(() => {});
  setAccount(null);
}

/** Signs out and clears this phone. The backup stays, ready for the next sign-in. Backs up first so nothing is lost. */
export async function signOut(): Promise<void> {
  if (account?.linked) await backUpNow();
  const token = await readToken();
  if (token) await call("/api/auth/sign-out", { method: "POST", body: "{}" }, token).catch(() => {});
  await forget();
  await deleteEverything();
}

/** Deletes the account and the backup on Landing's server, then clears this phone. */
export async function deleteAccount(): Promise<void> {
  const token = await readToken();
  if (token) {
    const r = await call("/api/account", { method: "DELETE" }, token);
    if (!r.ok && r.status !== 401) throw new AccountError("Couldn't delete your account just now. Nothing has been deleted. Try again.");
  }
  await forget();
  await deleteEverything();
}
