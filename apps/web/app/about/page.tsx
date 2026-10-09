import Link from "next/link";
import home from "../page.module.css";
import styles from "../guides/guides.module.css";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { abs, CONTACT_EMAIL, ldJson, ORG_NAME, ORGANIZATION, pageMetadata } from "../site";

export const metadata = pageMetadata("About us", "Steadie is a UK wellness app with a 12-month plan for the year after stopping a GLP-1 weight-loss medicine. Who we are and what we believe.", "/about");

export default function About() {
  const ld = { "@context": "https://schema.org", "@graph": [ORGANIZATION, { "@type": "AboutPage", url: abs("/about"), name: "About Steadie", about: { "@id": ORGANIZATION["@id"] } }] };
  return (
    <>
      <SiteHeader page="about" />
      <main className={styles.page}>
        <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
        <div className={home.wrap}>
          <article className={styles.body}>
            <p className={styles.kicker}>About us</p>
            <h1 className={styles.title}>A soft place to land after the jab</h1>
            <p>Weight-loss injections like Wegovy and Mounjaro have helped many people. But when they stop, appetite comes back, and in trials most people regained a good share of the weight within a year. That&apos;s biology, not a lack of effort. NICE says people should be offered at least a year of support afterwards.</p>
            <p>Steadie is that year of support, in an app: a 12-month plan of small weekly habits, short strength sessions at home, easy high-protein meals, a one-minute morning check-in, and a calm weekly score that rewards steady routines rather than weight loss.</p>
            <h2>What we believe</h2>
            <ul>
              <li>Keeping weight steady is hard for biological reasons, and nobody should feel ashamed when it is.</li>
              <li>Protein, strength, routine and sleep make the biggest difference, so that&apos;s what we focus on.</li>
              <li>Numbers should only be there when they help. Safe mode hides weight entirely.</li>
              <li>Your prescriber stays in charge of your medicine. We never advise on it.</li>
              <li>Your data is yours. It lives on your phone, with a private backup if you sign in, and is never sold.</li>
            </ul>
            <h2>Our guides</h2>
            <p>Our <Link href="/guides">guides</Link> cover what happens when you stop a GLP-1, appetite, protein, strength and keeping weight off, with sources for everything. Read how we write them in our <Link href="/editorial-policy">editorial policy</Link>.</p>
            <h2>Contact</h2>
            <p>{ORG_NAME} · <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
