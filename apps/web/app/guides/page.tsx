import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, GUIDES } from "@/content/guides";
import home from "../page.module.css";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { abs, ldJson, ORGANIZATION, SITE_NAME } from "../site";
import styles from "./guides.module.css";

const TITLE = "Guides to coming off GLP-1 weight-loss injections";
const DESCRIPTION = "Plain-English, UK guides for life after Wegovy, Mounjaro and Ozempic: what happens when you stop, appetite, protein, strength and keeping weight off.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} · ${SITE_NAME}` },
  description: DESCRIPTION,
  alternates: { canonical: "/guides", types: { "application/rss+xml": "/guides/feed.xml" } },
  openGraph: { type: "website", url: "/guides", title: TITLE, description: DESCRIPTION, siteName: SITE_NAME, locale: "en_GB" },
};

const TONES = ["apricot", "sage", "sky", "lilac"] as const;

export default function Guides() {
  const pillars = GUIDES.filter((g) => g.pillar);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION,
      {
        "@type": "CollectionPage",
        "@id": `${abs("/guides")}#page`,
        name: TITLE,
        description: DESCRIPTION,
        url: abs("/guides"),
        inLanguage: "en-GB",
        publisher: { "@id": ORGANIZATION["@id"] },
        mainEntity: { "@type": "ItemList", itemListElement: GUIDES.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/guides/${g.slug}`), name: g.title })) },
      },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
        { "@type": "ListItem", position: 2, name: "Guides", item: abs("/guides") },
      ] },
    ],
  };
  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
        <div className={home.wrap}>
          <nav aria-label="Breadcrumb" className={styles.crumbs}><Link href="/">Home</Link><span aria-hidden="true">›</span><span aria-current="page">Guides</span></nav>
          <header className={styles.hubHead}>
            <p className={styles.kicker}>Steadie guides</p>
            <h1 className={styles.hubTitle}>Life after weight-loss injections</h1>
            <p className={styles.hubLede}>Clear, kind guides for coming off a GLP-1 like Wegovy or Mounjaro and keeping what you&apos;ve worked for. Based on published research and UK guidance. Decisions about your medicine are always for your prescriber.</p>
          </header>
          <div className={styles.pillars}>
            {pillars.map((g, i) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className={`${styles.pillarCard} ${home[TONES[i % TONES.length]]}`}>
                <strong>{g.title}</strong>
                <span>{g.description}</span>
              </Link>
            ))}
          </div>
          {CATEGORIES.map((c) => {
            const list = GUIDES.filter((g) => g.category === c.name);
            return list.length ? (
              <section key={c.name} className={styles.category} aria-labelledby={`cat-${c.name}`}>
                <div className={styles.categoryHead}>
                  <h2 id={`cat-${c.name}`}>{c.name}</h2>
                  <p className={home.muted}>{c.blurb}</p>
                </div>
                <ul className={styles.cards}>
                  {list.map((g) => <li key={g.slug}><Link className={styles.card} href={`/guides/${g.slug}`}><strong>{g.title}</strong><span>{g.description}</span></Link></li>)}
                </ul>
              </section>
            ) : null;
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
