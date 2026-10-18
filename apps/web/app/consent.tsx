"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState, useSyncExternalStore } from "react";
import styles from "./consent.module.css";

// Google Analytics, only with consent. Nothing from Google loads, and no analytics cookies are set, until someone
// presses Accept. The choice is kept in this browser (localStorage, not a cookie) so we don't ask on every page; the
// footer's "Cookie settings" opens the banner again to change it. Keep app/privacy (SITE_PRIVACY) in step with this.
const GA_ID = "G-T1W38JH2EF";
const KEY = "steadie_analytics_consent";
const OPEN_EVENT = "steadie:cookie-settings";
const CHANGE_EVENT = "steadie:consent-change";

type Choice = "granted" | "denied";

// Where storage is blocked (some private windows), the answer lasts until the page is reloaded.
let fallback: Choice | null = null;

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : fallback;
  } catch {
    return fallback;
  }
}

function writeChoice(c: Choice) {
  fallback = c;
  try { localStorage.setItem(KEY, c); } catch { /* storage blocked: see fallback */ }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange); // a choice made in another tab
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Google's cookies (_ga, _ga_<id>) are set on the site's top domain, so clear them there and on this host. */
function clearAnalyticsCookies() {
  const parts = location.hostname.split(".");
  const domains = ["", ...parts.map((_, i) => "." + parts.slice(i).join("."))];
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  }
}

export function Consent() {
  // "unknown" while rendering on the server, so the banner only appears in the browser, once we can read the answer.
  const choice = useSyncExternalStore(subscribe, readChoice, () => "unknown" as const);
  const [reopened, setReopened] = useState(false);
  const open = choice === null || reopened;

  useEffect(() => {
    const reopen = () => setReopened(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const decide = (c: Choice) => {
    const withdrawing = c === "denied" && choice === "granted";
    writeChoice(c);
    setReopened(false);
    if (withdrawing) {
      // Delete Google's cookies and reload so its script is gone too.
      clearAnalyticsCookies();
      location.reload();
    }
  };

  return (
    <>
      {choice === "granted" && <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </>}
      {open && (
        <section className={styles.banner} role="region" aria-label="Cookie choice">
          <p>
            Can we use Google Analytics cookies to see how people use this site? They&rsquo;re off unless you say yes,
            and you can change your mind any time in Cookie settings at the bottom of the page.{" "}
            <Link href="/privacy">Privacy notice</Link>
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={() => decide("denied")}>No thanks</button>
            <button type="button" className={styles.primary} onClick={() => decide("granted")}>Accept</button>
          </div>
        </section>
      )}
    </>
  );
}

/** The footer link that reopens the banner. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className ?? styles.link} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Cookie settings
    </button>
  );
}
