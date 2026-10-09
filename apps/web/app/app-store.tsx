import { APP_LIVE, appStoreLink } from "./site";
import styles from "./page.module.css";

/** "Download on the App Store", or a quiet "Coming soon" with no link before launch (APP_LIVE). Plain text and no Apple
 *  logo, which Apple's guidelines allow; swap in Apple's official badge artwork (tools.applemarketingtools.com) here
 *  when it's to hand and every button on the site updates. `campaign` names the page in App Store analytics. */
export function AppStoreButton({ campaign = "home" }: { campaign?: string }) {
  if (!APP_LIVE) {
    return (
      <span className={`${styles.storeBtn} ${styles.storeBtnSoon}`} aria-label="Coming soon to the App Store">
        <small>Coming soon to the</small>
        <strong>App Store</strong>
      </span>
    );
  }
  return (
    <a className={styles.storeBtn} href={appStoreLink(campaign)} aria-label="Download Steadie on the App Store">
      <small>Download on the</small>
      <strong>App Store</strong>
    </a>
  );
}
