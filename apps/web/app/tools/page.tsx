import Link from "next/link";
import home from "../page.module.css";
import guides from "../guides/guides.module.css";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { abs, ldJson, ORGANIZATION, pageMetadata } from "../site";
import { TOOLS } from "./list";
import styles from "./tools.module.css";

export const metadata = pageMetadata("Free tools for life after weight-loss jabs", "Free calculators for after Mounjaro, Wegovy and other GLP-1 jabs: maintenance calories and what the trials show about weight regain.", "/tools");

export default function Tools() {
  const ld = { "@context": "https://schema.org", "@graph": [ORGANIZATION, { "@type": "CollectionPage", name: "Free tools", url: abs("/tools"), hasPart: TOOLS.map((t) => ({ "@type": "WebApplication", name: t.title, url: abs(`/tools/${t.slug}`) })) }] };
  return (
    <>
      <SiteHeader page="tools" />
      <main className={guides.page}>
        <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
        <div className={home.wrap}>
          <article className={guides.body}>
            <p className={guides.kicker}>Free tools</p>
            <h1 className={guides.title}>Tools for the year after the jab</h1>
            <p>Quick calculators for life after Mounjaro, Wegovy and other GLP-1 medicines. Free, in UK units, and nothing you type is saved.</p>
            <ul className={styles.cards}>
              {TOOLS.map((t) => <li key={t.slug}><Link className={styles.card} href={`/tools/${t.slug}`}><strong>{t.title}</strong><span>{t.blurb}</span></Link></li>)}
            </ul>
            <p>Looking for something to read? See all our <Link href="/guides">guides</Link>.</p>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
