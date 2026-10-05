import prelaunch from "../prelaunch.json";
import styles from "./page.module.css";

// Temporary, for testing before launch: a floating button to the clickable prototype at /prototype/.
// Turn it off with showPrototype: false in prelaunch.json; the build then removes /prototype too.
export function PrototypeLink() {
  if (!prelaunch.showPrototype) return null;
  return (
    <a className={styles.prototypeLink} href="/prototype">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="6.5" y="2.5" width="11" height="19" rx="3" /><path d="M11 18.5h2" />
      </svg>
      Preview the app
    </a>
  );
}
