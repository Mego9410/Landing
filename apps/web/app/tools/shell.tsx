import Link from "next/link";
import type { ReactNode } from "react";
import home from "../page.module.css";
import guides from "../guides/guides.module.css";
import { productPageFor } from "../guides/end-cta";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { abs, appLive, appStoreLink, availability, campaign, ldJson, ORGANIZATION, PRICE } from "../site";
import { TOOLS, type Tool } from "./list";
import styles from "./tools.module.css";

const long = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * The frame every tool page shares: breadcrumb, title, the answer in a sentence or two (what search snippets and AI
 * summaries quote), the calculator, the explanation, FAQs (as FAQPage data), the App Store card, sources and the
 * medicines disclaimer. The calculator itself is a client component passed as `children`.
 */
export async function ToolShell({ tool, answer, children, body, faqs, sources }: {
  tool: Tool; answer: ReactNode; children: ReactNode; body: ReactNode;
  faqs: { q: string; a: string }[]; sources: { label: string; url: string }[];
}) {
  const live = await appLive();
  const others = TOOLS.filter((t) => t.slug !== tool.slug);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION,
      { "@type": "WebApplication", name: tool.title, url: abs(`/tools/${tool.slug}`), description: tool.description, applicationCategory: "HealthApplication", operatingSystem: "Any", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" }, publisher: { "@id": ORGANIZATION["@id"] }, dateModified: tool.updated, inLanguage: "en-GB" },
      { "@type": "FAQPage", url: abs(`/tools/${tool.slug}`), mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
        { "@type": "ListItem", position: 2, name: "Tools", item: abs("/tools") },
        { "@type": "ListItem", position: 3, name: tool.title, item: abs(`/tools/${tool.slug}`) },
      ] },
    ],
  };
  return (
    <>
      <SiteHeader page={`tool-${tool.slug}`} />
      <main className={guides.page}>
        <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
        <div className={home.wrap}>
          <nav aria-label="Breadcrumb" className={guides.crumbs}>
            <Link href="/">Home</Link><span aria-hidden="true">›</span><Link href="/tools">Tools</Link><span aria-hidden="true">›</span><span aria-current="page">{tool.title}</span>
          </nav>
          <article className={guides.body}>
            <p className={guides.kicker}>Free tool</p>
            <h1 className={guides.title}>{tool.title}</h1>
            <p className={guides.meta}>By the Steadie team · Updated <time dateTime={tool.updated}>{long(tool.updated)}</time></p>
            <div className={styles.answer}>{answer}</div>
            <div className={styles.tool}>{children}</div>
            {body}
            {faqs.length ? (
              <section aria-labelledby="questions">
                <h2 id="questions">Common questions</h2>
                <div className={guides.faqs}>{faqs.map((f) => <details key={f.q} className={guides.faq}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
              </section>
            ) : null}
            <aside className={guides.endCta} aria-label="Steadie for iPhone">
              <p className={guides.endHook}>Steadie turns this into a calm 12-month plan: meals, short strength sessions and a two-minute daily check-in.</p>
              {live ? (
                <>
                  <a className={guides.ctaButton} href={appStoreLink(campaign("tool-end", tool.slug), productPageFor(tool.slug))}>Try Steadie free for 7 days</a>
                  <span className={guides.endSmall}>On iPhone. Then {PRICE.yearly} a year or {PRICE.monthly} a month; cancel any time in your iPhone settings.{availability(live).soonAndroid}</span>
                </>
              ) : <span className={guides.endSoon}>Coming soon to iPhone and Android</span>}
            </aside>
            {others.length ? (
              <section aria-labelledby="more-tools">
                <h2 id="more-tools">More free tools</h2>
                <ul>{others.map((t) => <li key={t.slug}><Link href={`/tools/${t.slug}`}>{t.title}</Link>: {t.blurb}</li>)}</ul>
              </section>
            ) : null}
            <section aria-labelledby="sources">
              <h2 id="sources">Sources</h2>
              <ol className={guides.sources}>{sources.map((s) => <li key={s.url}><a href={s.url} rel="noopener">{s.label}</a></li>)}</ol>
            </section>
            <p className={guides.disclaimer}>
              This tool gives general information, not medical advice, and its numbers are estimates. Steadie never gives advice about medication, doses or stopping treatment: talk to your prescriber, GP or pharmacist about those. Read how we write in our <Link href="/editorial-policy">editorial policy</Link>.
            </p>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
