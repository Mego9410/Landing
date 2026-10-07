"use client";

import Link from "next/link";
import { useId, useState } from "react";
import styles from "./page.module.css";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done" } | { kind: "error"; message: string };

export function WaitlistForm({ tone = "light" }: { tone?: "light" | "apricot" }) {
  const id = useId();
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState({ kind: "sending" });
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          status: form.get("status") || undefined,
          consent: form.get("consent") === "on",
          company: form.get("company"),
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "We couldn't save that just now. Try again in a minute.");
      setState({ kind: "done" });
    } catch (error) {
      setState({ kind: "error", message: error instanceof Error ? error.message : "Something went wrong. Try again." });
    }
  }

  if (state.kind === "done") {
    return (
      <div className={`${styles.formDone} ${tone === "apricot" ? styles.onApricot : ""}`} role="status">
        <span className={styles.doneTick} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </span>
        <span>
          <strong>You&apos;re on the list.</strong> We&apos;ll email you once when Steadie opens, and that&apos;s it.
        </span>
      </div>
    );
  }

  const sending = state.kind === "sending";
  return (
    <form className={`${styles.form} ${tone === "apricot" ? styles.onApricot : ""}`} onSubmit={onSubmit} noValidate>
      <div className={styles.formRow}>
        <label className="sr-only" htmlFor={`${id}-email`}>Email address</label>
        <input id={`${id}-email`} className={styles.input} name="email" type="email" autoComplete="email" inputMode="email" placeholder="Your email address" required
          aria-invalid={state.kind === "error"} aria-describedby={state.kind === "error" ? `${id}-error` : undefined} />
        <button className={styles.button} type="submit" disabled={sending}>{sending ? "Adding you" : "Join the waitlist"}</button>
      </div>
      <div className={styles.formMeta}>
        <label className={styles.selectLabel} htmlFor={`${id}-status`}>Where are you with your jab? <span className={styles.optional}>(optional)</span></label>
        <select id={`${id}-status`} name="status" className={styles.select} defaultValue="">
          <option value="">Choose one</option>
          <option value="stopped">I&apos;ve stopped</option>
          <option value="soon">I&apos;m stopping soon</option>
          <option value="on">I&apos;m still on it</option>
        </select>
      </div>
      <label className={styles.consent}>
        <input type="checkbox" name="consent" required />
        <span>Email me when Steadie opens, and keep my answer about my jab if I gave one. You can unsubscribe at any time. See our <Link href="/privacy">privacy notice</Link>.</span>
      </label>
      {/* Honeypot for bots: hidden from people and screen readers. */}
      <div aria-hidden="true" className={styles.honeypot}>
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      {state.kind === "error" ? <p id={`${id}-error`} className={styles.error} role="alert">{state.message}</p> : null}
    </form>
  );
}
