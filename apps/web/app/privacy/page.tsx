import type { Metadata } from "next";
import Link from "next/link";
import styles from "../page.module.css";

export const metadata: Metadata = { title: "Privacy notice", description: "How Landing handles your waitlist sign-up." };

// Placeholder notice for the waitlist only. Have it reviewed and fill in the bracketed details before launch.
export default function Privacy() {
  return (
    <main className={styles.section}>
      <div className={`${styles.wrap} ${styles.narrow}`} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Link href="/">← Back to Landing</Link>
        <h1 className={styles.h2}>Privacy notice for the waitlist</h1>
        <p className={styles.muted}>Last updated [DATE]. This notice covers the waitlist on this website only. The app will have its own privacy policy.</p>
        <h2 className={styles.h3}>What we collect</h2>
        <p>Your email address and, if you choose to tell us, where you are with your jab. We don&apos;t ask for anything else here.</p>
        <h2 className={styles.h3}>Why</h2>
        <p>To email you once when Landing opens, and to understand who is waiting for it. We rely on your consent, which you give by ticking the box.</p>
        <h2 className={styles.h3}>Who sees it</h2>
        <p>[YOUR COMPANY NAME] and the service that stores the list, [WAITLIST PROVIDER]. It is never sold or used for advertising.</p>
        <h2 className={styles.h3}>How long we keep it</h2>
        <p>Until Landing opens and we&apos;ve sent that email, or until you ask us to remove it, whichever comes first.</p>
        <h2 className={styles.h3}>Your rights</h2>
        <p>You can ask to see, correct or delete your details at any time by emailing [PRIVACY EMAIL]. You can also complain to the Information Commissioner&apos;s Office at ico.org.uk.</p>
        <p className={styles.muted}>[YOUR COMPANY NAME] · [REGISTERED ADDRESS] · ICO registration [NUMBER]</p>
      </div>
    </main>
  );
}
