"use client";
import { useState } from "react";
import styles from "./admin.module.css";

/** Sign in to the dashboard with a code sent by email (the same sign-in as the app). Only ADMIN_EMAILS get in. */
export function AdminLogin({ signedInAs }: { signedInAs?: string }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const post = (path: string, body: object) => fetch(`/api/auth${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), credentials: "include" });
  async function send(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    const r = await post("/email-otp/send-verification-otp", { email: email.trim(), type: "sign-in" }).catch(() => null);
    setBusy(false);
    if (r?.ok) setSent(true); else setError("Couldn't send a code. Check the address and try again.");
  }
  async function verify(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    const r = await post("/sign-in/email-otp", { email: email.trim(), otp: code.trim() }).catch(() => null);
    setBusy(false);
    if (r?.ok) window.location.reload(); else setError("That code didn't work. Check it, or send a new one.");
  }
  return (
    <div className={styles.login}>
      <h1 className={styles.title}>Steadie dashboard</h1>
      {signedInAs ? <p className={styles.error}>{signedInAs} isn&apos;t on the dashboard list. Sign in with an admin address.</p> : null}
      {!sent ? (
        <form onSubmit={send} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label className={styles.muted} htmlFor="email">Your email</label>
          <input id="email" className={styles.input} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className={styles.button} disabled={busy}>{busy ? "Sending…" : "Send me a code"}</button>
        </form>
      ) : (
        <form onSubmit={verify} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p className={styles.muted}>We&apos;ve emailed a six-digit code to {email.trim()}.</p>
          <input className={styles.input} inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} aria-label="Six-digit code" />
          <button className={styles.button} disabled={busy}>{busy ? "Checking…" : "Sign in"}</button>
          <button type="button" className={`${styles.button} ${styles.ghost}`} onClick={() => setSent(false)}>Use a different email</button>
        </form>
      )}
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
    </div>
  );
}

export function SignOut() {
  return (
    <button className={`${styles.button} ${styles.ghost}`} onClick={() => fetch("/api/auth/sign-out", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}", credentials: "include" }).then(() => window.location.reload())}>
      Sign out
    </button>
  );
}
