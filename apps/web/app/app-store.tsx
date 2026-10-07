import { APP_STORE_URL } from "./site";
import styles from "./page.module.css";

/** "Download on the App Store". Plain text and no Apple logo, which Apple's guidelines allow; swap in Apple's official
 *  badge artwork (tools.applemarketingtools.com) here when it's to hand and every button on the site updates. */
export function AppStoreButton() {
  return (
    <a className={styles.storeBtn} href={APP_STORE_URL} aria-label="Download Steadie on the App Store">
      <small>Download on the</small>
      <strong>App Store</strong>
    </a>
  );
}
