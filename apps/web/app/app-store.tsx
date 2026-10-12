import { appLive, appStoreLink, PLAY_URL, playLive } from "./site";
import styles from "./page.module.css";

/** "Download on the App Store", or a quiet "Coming soon" with no link before launch (appLive). Plain text and no Apple
 *  logo, which Apple's guidelines allow; swap in Apple's official badge artwork (tools.applemarketingtools.com) here
 *  when it's to hand and every button on the site updates. `campaign` names the page in App Store analytics. */
export async function AppStoreButton({ campaign = "home" }: { campaign?: string }) {
  if (!(await appLive())) {
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

/** "Get it on Google Play", or "Coming soon" with no link until NEXT_PUBLIC_PLAY_LIVE is true (playLive). Plain text,
 *  like the App Store button; Google's official badge (play.google.com/intl/en_gb/badges) can replace it later. */
export function GooglePlayButton({ campaign = "home" }: { campaign?: string }) {
  if (!playLive()) {
    return (
      <span className={`${styles.storeBtn} ${styles.storeBtnSoon}`} aria-label="Coming soon to Google Play">
        <small>Coming soon to</small>
        <strong>Google Play</strong>
      </span>
    );
  }
  const href = `${PLAY_URL}&utm_source=website&utm_campaign=${encodeURIComponent(campaign)}`;
  return (
    <a className={styles.storeBtn} href={href} aria-label="Get Steadie on Google Play">
      <small>Get it on</small>
      <strong>Google Play</strong>
    </a>
  );
}

/** Both store buttons side by side (they stack on narrow screens). */
export async function StoreButtons({ campaign = "home" }: { campaign?: string }) {
  return (
    <div className={styles.storeRow}>
      <AppStoreButton campaign={campaign} />
      <GooglePlayButton campaign={campaign} />
    </div>
  );
}
