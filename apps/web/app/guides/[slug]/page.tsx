import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { liveGuide, liveGuides, relatedGuides } from "@/content/guides";
import home from "../../page.module.css";
import { SiteFooter, SiteHeader } from "../../site-chrome";
import { abs, appLive, appStoreLink, campaign, ldJson, ORGANIZATION, SITE_NAME } from "../../site";
import styles from "../guides.module.css";
import { GuideArt } from "../art";
import { GuideEndCta } from "../end-cta";
import { anchor, Blocks, plain } from "../rich";

// Guides published so far are built ahead; scheduled ones appear on their day (refreshed hourly, and by the daily cron).
export const revalidate = 3600;
export function generateStaticParams() {
  return liveGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = liveGuide((await params).slug);
  if (!g) return {};
  const url = `/guides/${g.slug}`;
  return {
    title: { absolute: `${g.metaTitle} · ${SITE_NAME}` },
    description: g.description,
    keywords: g.keywords,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: g.title, description: g.description, siteName: SITE_NAME, locale: "en_GB", publishedTime: g.published, modifiedTime: g.updated, section: g.category, tags: g.keywords },
    twitter: { card: "summary_large_image", title: g.title, description: g.description },
  };
}

const long = (iso: string) => new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const live = await appLive();
  const g = liveGuide((await params).slug);
  if (!g) notFound();
  const url = abs(`/guides/${g.slug}`);
  const words = JSON.stringify(g.sections).split(/\s+/).length;
  const minutes = Math.max(2, Math.round(words / 220));
  const related = relatedGuides(g);

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION,
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: g.title,
        description: g.description,
        inLanguage: "en-GB",
        datePublished: g.published,
        dateModified: g.updated,
        mainEntityOfPage: url,
        image: abs(`/guides/${g.slug}/opengraph-image`),
        author: { "@id": ORGANIZATION["@id"] },
        publisher: { "@id": ORGANIZATION["@id"] },
        articleSection: g.category,
        keywords: g.keywords.join(", "),
        isAccessibleForFree: true,
        citation: g.sources.map((s) => ({ "@type": "CreativeWork", name: s.label, url: s.url })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
          { "@type": "ListItem", position: 2, name: "Guides", item: abs("/guides") },
          { "@type": "ListItem", position: 3, name: g.title, item: url },
        ],
      },
      ...(g.faqs.length ? [{
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: g.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })),
      }] : []),
    ],
  };

  return (
    <>
      <SiteHeader page={g.slug} />
      <main className={styles.page}>
        <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
        <div className={home.wrap}>
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <Link href="/">Home</Link><span aria-hidden="true">›</span><Link href="/guides">Guides</Link><span aria-hidden="true">›</span><span aria-current="page">{g.category}</span>
          </nav>
          <div className={styles.article}>
            <article className={styles.body}>
              <p className={styles.kicker}>{g.category}</p>
              <h1 className={styles.title}>{g.title}</h1>
              <p className={styles.meta}>By the Steadie team · Updated <time dateTime={g.updated}>{long(g.updated)}</time> · {minutes} minute read</p>
              <GuideArt guide={g} className={styles.heroArt} />
              <div className={styles.summary}>
                <p>The short version</p>
                <ul>{g.summary.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
              {g.sections.map((s) => (
                <section key={s.heading} aria-labelledby={anchor(s.heading)}>
                  <h2 id={anchor(s.heading)}>{s.heading}</h2>
                  <Blocks blocks={s.blocks} />
                </section>
              ))}
              {g.faqs.length ? (
                <section aria-labelledby="questions">
                  <h2 id="questions">Common questions</h2>
                  <div className={styles.faqs}>
                    {g.faqs.map((f) => <details key={f.q} className={styles.faq}><summary>{f.q}</summary><p>{plain(f.a)}</p></details>)}
                  </div>
                </section>
              ) : null}
              <GuideEndCta guide={g} />
              <section aria-labelledby="sources">
                <h2 id="sources">Sources</h2>
                <ol className={styles.sources}>{g.sources.map((s) => <li key={s.url}><a href={s.url} rel="noopener">{s.label}</a></li>)}</ol>
              </section>
              <p className={styles.disclaimer}>
                This guide is general information, not medical advice. Steadie never gives advice about medication, doses or stopping treatment: talk to your prescriber, GP or pharmacist about those. In an emergency, call 999. Read how we write guides in our <Link href="/editorial-policy">editorial policy</Link>.
              </p>
              {related.length ? (
                <section className={styles.related} aria-labelledby="related">
                  <h2 id="related">Keep reading</h2>
                  <ul className={styles.cards}>
                    {related.map((r) => <li key={r.slug}><Link className={styles.card} href={`/guides/${r.slug}`}><GuideArt guide={r} className={styles.cardArt} /><strong>{r.title}</strong><span>{r.description}</span></Link></li>)}
                  </ul>
                </section>
              ) : null}
            </article>
            <aside className={styles.aside} aria-label="On this page">
              <nav className={styles.toc} aria-label="Contents">
                <p>On this page</p>
                <ol>{g.sections.map((s) => <li key={s.heading}><a href={`#${anchor(s.heading)}`}>{s.heading}</a></li>)}</ol>
              </nav>
              <div className={styles.cta}>
                <strong>A 12-month plan for the year after</strong>
                <span>Small habits, short strength sessions and easy meals, on your side. {live ? "On iPhone, with 7 days free." : "Coming soon to iPhone."}</span>
                {live ? <a className={styles.ctaButton} href={appStoreLink(campaign("guide", g.slug))}>Download Steadie</a> : null}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
