"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

export type Screen = { src: string; label: string };

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The hero phone: it floats, tilts a little towards the pointer, and slides through real app screens.
 * Stops cycling when it's off screen or the tab is hidden; with Reduce Motion it stays on the first screen.
 */
export function PhoneTour({ screens, every = 3800 }: { screens: Screen[]; every?: number }) {
  const [i, setI] = useState(0);
  const phone = useRef<HTMLDivElement>(null);
  const visible = useRef(true);

  useEffect(() => {
    if (reduced()) return;
    const el = phone.current;
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; }, { threshold: 0.2 });
    if (el) io.observe(el);
    const t = window.setInterval(() => {
      if (visible.current && !document.hidden) setI((n) => (n + 1) % screens.length);
    }, every);
    return () => { window.clearInterval(t); io.disconnect(); };
  }, [screens.length, every]);

  // A gentle tilt towards the pointer on devices that have one.
  useEffect(() => {
    if (reduced() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = phone.current;
    if (!el) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        el.style.setProperty("--tilt-y", `${(dx * 14).toFixed(2)}deg`);
        el.style.setProperty("--tilt-x", `${(-dy * 10).toFixed(2)}deg`);
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); };
  }, []);

  return (
    <div className={styles.tour}>
      <div ref={phone} className={styles.tourPhone}>
        {screens.map((s, n) => (
          <div key={s.src} className={styles.tourScreen} data-state={n === i ? "on" : n === (i - 1 + screens.length) % screens.length ? "off" : "next"}>
            <Image src={s.src} alt="" width={780} height={1691} sizes="(max-width: 900px) 250px, 290px" priority={n === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}
