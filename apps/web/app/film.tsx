"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

/**
 * The intro film. Plays silently on a loop while it's on screen; clicking it starts the film again from the beginning
 * with sound and the browser's own controls. No autoplay with Reduce Motion or Data Saver on: the poster and the button
 * show instead. A small pause button covers the silent loop (anything that moves on its own needs one).
 */
export function FilmPlayer({ src, poster, title, length }: { src: string; poster: string; title: string; length: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);
  const [paused, setPaused] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    el.muted = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    const io = new IntersectionObserver(([e]) => {
      if (!el.muted) return; // once they've chosen sound, leave playback to them
      if (e.isIntersecting && !userPaused.current) el.play().catch(() => {});
      else if (!e.isIntersecting) el.pause();
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const withSound = () => {
    const el = video.current;
    if (!el) return;
    userPaused.current = false;
    el.muted = false; el.currentTime = 0;
    setSound(true); setPaused(false);
    el.play().catch(() => { el.muted = true; setSound(false); });
  };
  const togglePause = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) { userPaused.current = false; el.play().catch(() => {}); setPaused(false); }
    else { userPaused.current = true; el.pause(); setPaused(true); }
  };
  const ended = () => { const el = video.current; if (!el) return; el.muted = true; setSound(false); };

  return (
    <div className={styles.film}>
      <video ref={video} className={styles.filmVideo} src={src} poster={poster} preload="none" playsInline muted loop={!sound}
        controls={sound} aria-label={title} onEnded={ended} />
      {sound ? null : (
        <>
          <button type="button" className={styles.filmPlay} onClick={withSound} aria-label={`Play the film with sound: ${title}, ${length}`}>
            <span className={styles.filmPill}>
              <span className={styles.filmIcon} aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
                </svg>
              </span>
              Watch with sound<span className={styles.filmLength}>{length}</span>
            </span>
          </button>
          <button type="button" className={styles.filmPause} onClick={togglePause} aria-label={paused ? "Play the silent preview" : "Pause the silent preview"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {paused ? <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
