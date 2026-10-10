"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

export type FanScreen = { src: string; alt: string; title: string; text: string; dark?: string };

/**
 * Real app screens as a fan of tilted phones. They start stacked and spread out when the section scrolls into view;
 * hovering or focusing one straightens and lifts it. A screen with a `dark` image sweeps between light and dark mode.
 * On narrow screens the fan becomes a swipeable row. Reduce Motion shows the spread fan with no movement.
 */
export function ScreenFan({ screens }: { screens: FanScreen[] }) {
  const root = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    // Reduce Motion: open straight away (after this render, so the effect doesn't set state synchronously).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { queueMicrotask(() => setOpen(true)); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOpen(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const mid = (screens.length - 1) / 2;
  return (
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
  );
}
