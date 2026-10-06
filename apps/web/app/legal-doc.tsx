import Link from "next/link";
import type { LegalDoc } from "@landing/content/legal";
import styles from "./page.module.css";

/** A legal page (app privacy policy or terms), from the text shared with the app. */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <main className={styles.section}>
      <div className={`${styles.wrap} ${styles.narrow}`} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Link href="/">← Back to Landing</Link>
        <h1 className={styles.h2}>{doc.title}</h1>
        <p className={styles.muted}>Last updated {doc.updated}.</p>
        <p>{doc.intro}</p>
        {doc.sections.map((s) => (
          <section key={s.heading} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h2 className={styles.h3}>{s.heading}</h2>
            {s.paras.map((p) => <p key={p}>{p}</p>)}
          </section>
        ))}
      </div>
    </main>
  );
}
