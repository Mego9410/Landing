import Link from "next/link";
import { Lockup } from "./lockup";
import { APP_LIVE, appStoreLink, ORG_NAME } from "./site";
import styles from "./page.module.css";

// The header and footer for every page. On the home page the section links are in-page anchors; elsewhere they point
// back to the home page.
const SECTIONS = [["how", "How it works"], ["support", "What's included"], ["pricing", "Pricing"], ["faqs", "FAQs"]] as const;

const GUIDE_LINKS = [
  ["/guides/coming-off-glp-1", "Coming off a GLP-1"],
  ["/guides/keep-weight-off-after-glp-1", "Keeping weight off"],
  ["/guides/what-happens-when-you-stop-weight-loss-injections", "What happens when you stop"],
  ["/guides/protein-after-glp-1", "Protein after a GLP-1"],
  ["/guides/strength-training-after-glp-1", "Strength training"],
  ["/guides/weight-loss-jab-price-rise-uk", "Jab prices"],
  ["/guides", "All guides"],
] as const;

export function SiteHeader({ home = false }: { home?: boolean }) {
  const at = (id: string) => (home ? `#${id}` : `/#${id}`);
  return (
    <>
      <aside className={styles.announce} aria-label="Announcement">
        {APP_LIVE ? <><span>Now on iPhone.</span> <a href={appStoreLink("top-bar")}>Try it free for 7 days</a></> : <span>Coming soon to iPhone.</span>}
      </aside>
      <header className={styles.header}>
        <div className={`${styles.wrap} ${styles.headerInner}`}>
          <Link href="/" aria-label="Steadie home" className={styles.logo}><Lockup /></Link>
          <nav className={styles.navLinks} aria-label="Main">
            {SECTIONS.slice(0, 2).map(([id, label]) => <a key={id} href={at(id)}>{label}</a>)}
            <Link href="/guides">Guides</Link>
            {SECTIONS.slice(2).map(([id, label]) => <a key={id} href={at(id)}>{label}</a>)}
          </nav>
          {APP_LIVE ? <a className={styles.navCta} href={appStoreLink("header")}>Download</a> : <span className={styles.navSoon}>Coming soon</span>}
        </div>
      </header>
    </>
  );
}

export function SiteFooter({ home = false }: { home?: boolean }) {
  const at = (id: string) => (home ? `#${id}` : `/#${id}`);
  return (
    <footer className={styles.footer}>
      <div className={`${styles.wrap} ${styles.footerGrid}`}>
        <div className={styles.footerBrand}>
          <Lockup />
          <p className={styles.muted}>Keep what you&apos;ve worked for.</p>
        </div>
        <nav aria-label="Steadie">
          <p className={styles.footerHead}>Steadie</p>
          {SECTIONS.map(([id, label]) => <a key={id} href={at(id)}>{label}</a>)}
          <Link href="/about">About us</Link>
          <Link href="/support">Support</Link>
        </nav>
        <nav aria-label="Guides">
          <p className={styles.footerHead}>Guides</p>
          {GUIDE_LINKS.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <nav aria-label="Legal">
          <p className={styles.footerHead}>Legal</p>
          <Link href="/editorial-policy">Editorial policy</Link>
          <Link href="/privacy">Website privacy notice</Link>
          <Link href="/app-privacy">App privacy policy</Link>
          <Link href="/terms">Terms of use</Link>
        </nav>
      </div>
      <div className={`${styles.wrap} ${styles.footerSmall}`}>
        <p>Steadie is a general wellness app. It does not diagnose, treat or monitor any medical condition, and it does not give advice about medication, doses or stopping treatment. Wegovy and Ozempic are trademarks of Novo Nordisk, and Mounjaro of Eli Lilly; Steadie isn&apos;t connected with either company.</p>
        {home ? <p id="ref-1">1. Wilding JPH, et al. Weight regain and cardiometabolic effects after withdrawal of semaglutide: the STEP 1 trial extension. Diabetes, Obesity and Metabolism. 2022;24(8):1553–1564.</p> : null}
        <p>© {new Date().getFullYear()} {ORG_NAME}</p>
      </div>
    </footer>
  );
}
