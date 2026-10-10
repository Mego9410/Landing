"use client";

import { useState, useSyncExternalStore } from "react";
import styles from "./page.module.css";

const PHONE = "(max-width: 640px)";
const subscribe = (cb: () => void) => { const m = window.matchMedia(PHONE); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); };
const isPhone = () => window.matchMedia(PHONE).matches;

/**
 * "Careful by design" as a numbered list. On a computer every row shows in full. On a phone each row is a tap to
 * open, so the section reads as six short headlines rather than a wall of text.
 */
export function CareList({ items }: { items: { title: string; text: string }[] }) {
  const phone = useSyncExternalStore(subscribe, isPhone, () => false);
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ol className={styles.careList}>
      {items.map((c, i) => {
        const shown = !phone || open === i;
        return (
          <li key={c.title} data-open={shown || undefined}>
            <span className={styles.careNum} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <h3>
              {phone ? (
                <button type="button" className={styles.careToggle} aria-expanded={shown} aria-controls={`care-${i}`} onClick={() => setOpen(open === i ? null : i)}>
                  {c.title}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d={shown ? "M5 12h14" : "M12 5v14M5 12h14"} /></svg>
                </button>
              ) : c.title}
            </h3>
            <p id={`care-${i}`} hidden={!shown}>{c.text}</p>
          </li>
        );
      })}
    </ol>
  );
}
