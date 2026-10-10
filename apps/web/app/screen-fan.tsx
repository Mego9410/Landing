"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

export type FanScreen = { src: string; alt: string; title: string; text: string; dark?: string };

const ROW = "(max-width: 960px)";
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Real app screens as a fan of tilted phones. They start stacked and spread out when the section scrolls into view;
 * hovering or focusing one straightens and lifts it. A screen with a `dark` image sweeps between light and dark mode.
 * On narrow screens the fan becomes a swipeable row with dots, arrows and a "swipe" hint, and it nudges sideways once
 * when it first comes into view so it's clear there's more. Reduce Motion shows the spread fan with no movement.
 */
export function ScreenFan({ screens }: { screens: FanScreen[] }) {
  const root = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [swiped, setSwiped] = useState(false);
  const touched = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    // Reduce Motion: open straight away (after this render, so the effect doesn't set state synchronously).
    if (reduced()) { queueMicrotask(() => setOpen(true)); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setOpen(true); io.disconnect();
      // In the swipeable row, show there's more with one small nudge, unless they've already scrolled.
      if (window.matchMedia(ROW).matches) {
        window.setTimeout(() => {
          if (touched.current || el.scrollLeft > 4) return;
          el.scrollTo({ left: 90, behavior: "smooth" });
          window.setTimeout(() => { if (!touched.current) el.scrollTo({ left: 0, behavior: "smooth" }); }, 650);
        }, 700);
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Which phone is nearest the middle of the row, for the dots.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = el.scrollLeft + el.clientWidth / 2;
        let best = 0, dist = Infinity;
        [...el.children].forEach((c, i) => { const h = c as HTMLElement, d = Math.abs(h.offsetLeft + h.offsetWidth / 2 - mid); if (d < dist) { dist = d; best = i; } });
        setActive(best);
        if (el.scrollLeft > 120) setSwiped(true);
      });
    };
    const mark = () => { touched.current = true; };
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", mark, { passive: true });
    el.addEventListener("touchstart", mark, { passive: true });
    return () => { cancelAnimationFrame(raf); el.removeEventListener("scroll", onScroll); el.removeEventListener("pointerdown", mark); el.removeEventListener("touchstart", mark); };
  }, []);

  const go = (i: number) => {
    const el = root.current;
    if (!el) return;
    touched.current = true;
    const n = Math.max(0, Math.min(screens.length - 1, i)), item = el.children[n] as HTMLElement;
    el.scrollTo({ left: item.offsetLeft - (el.clientWidth - item.offsetWidth) / 2, behavior: reduced() ? "auto" : "smooth" });
  };

  const mid = (screens.length - 1) / 2;
  return (
    <div className={styles.fanWrap}>
      <ul ref={root} className={styles.fan} data-open={open || undefined} aria-label="Screens from the Steadie app" tabIndex={0}>
        {screens.map((s, n) => (
          <li key={s.src} className={styles.fanItem} style={{ "--k": n - mid, "--a": Math.abs(n - mid), "--d": `${Math.abs(n - mid) * 90}ms`, zIndex: 10 - Math.abs(n - mid) } as React.CSSProperties}>
            <div className={styles.fanPhone}>
              <Image src={s.src} alt={s.alt} width={780} height={1691} sizes="(max-width: 900px) 220px, 240px" />
              {s.dark && (
                <div className={styles.fanDark} aria-hidden="true">
                  <Image src={s.dark} alt="" width={780} height={1691} sizes="(max-width: 900px) 220px, 240px" />
                </div>
              )}
            </div>
            <p className={styles.fanCaption}><strong>{s.title}</strong><span>{s.text}</span></p>
          </li>
        ))}
      </ul>
      <div className={styles.fanNav}>
        <button type="button" className={styles.fanArrow} onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous screen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <div className={styles.fanMiddle}>
          <div className={styles.fanDots}>
            {screens.map((s, i) => (
              <button key={s.src} type="button" className={styles.fanDot} aria-current={i === active || undefined} aria-label={`Screen ${i + 1} of ${screens.length}: ${s.title}`} onClick={() => go(i)}><span /></button>
            ))}
          </div>
          <p className={styles.fanHint} data-hide={swiped || undefined} aria-hidden="true">
            Swipe to see all {screens.length}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </p>
        </div>
        <button type="button" className={styles.fanArrow} onClick={() => go(active + 1)} disabled={active === screens.length - 1} aria-label="Next screen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}
