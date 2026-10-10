"use client";

import { useRef, useState } from "react";
import styles from "./page.module.css";

/**
 * The intro film. Shows the poster with a play button and loads nothing until someone presses play, then plays with
 * sound and the browser's own controls. Never autoplays.
 */
export function FilmPlayer({ src, poster, title, length }: { src: string; poster: string; title: string; length: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const play = () => {
    const el = video.current;
    if (!el) return;
    setStarted(true);
    el.play().catch(() => setStarted(false));
  };
  return (
    <div className={styles.film}>
      <video ref={video} className={styles.filmVideo} src={src} poster={poster} preload="none" playsInline controls={started}
        aria-label={title} onEnded={() => setStarted(false)} />
      {started ? null : (
        <button type="button" className={styles.filmPlay} onClick={play} aria-label={`Play the film: ${title}, ${length}`}>
          <span className={styles.filmPill}>
            <span className={styles.filmIcon} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
            </span>
            Watch the film<span className={styles.filmLength}>{length}</span>
          </span>
        </button>
      )}
    </div>
  );
}
