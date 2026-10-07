import type { Metadata } from "next";
import Link from "next/link";
import home from "../page.module.css";
import styles from "../guides/guides.module.css";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { SITE_NAME } from "../site";

export const metadata: Metadata = {
  title: { absolute: `Editorial policy · ${SITE_NAME}` },
  description: "How Steadie writes its guides about life after GLP-1 weight-loss medicines: sources, accuracy, what we never advise on, and corrections.",
  alternates: { canonical: "/editorial-policy" },
};

/** How the guides are written, so readers (and search engines) can judge them. Keep it true to what we actually do. */
export default function EditorialPolicy() {
  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <div className={home.wrap}>
          <article className={styles.body}>
            <p className={styles.kicker}>About our guides</p>
            <h1 className={styles.title}>Editorial policy</h1>
            <p>Steadie&apos;s guides help people in the UK through the year after a GLP-1 weight-loss medicine. This page explains how we write them.</p>
            <h2>What we cover, and what we never do</h2>
            <p>We write about food, movement, habits, appetite and keeping weight steady. We never give advice about medicines: not when or how to stop, not doses, not switching. Those decisions belong to your prescriber, and every guide says so.</p>
            <h2>Where our information comes from</h2>
            <p>We base guides on published research (such as the STEP 1 and SURMOUNT-4 trials), UK guidance from NICE and the NHS, and resources from professional bodies like the British Dietetic Association. Every guide lists its sources, and we only state what those sources say.</p>
            <h2>How guides are checked</h2>
            <p>Guides are written by the Steadie team and checked against their sources before publishing. They are general information, not medical advice, and are not reviewed by a clinician. If you have a health condition, follow the advice of your own healthcare team.</p>
            <h2>Language</h2>
            <p>We write in plain UK English, kindly. Weight regain after these medicines is common and is biology, not a failing, and we write that way. We avoid language that shames, and we signpost Beat, the UK&apos;s eating disorder charity, where it may help.</p>
            <h2>Brand names</h2>
            <p>We use names like Wegovy, Ozempic and Mounjaro so people can find information about the medicine they took. They are trademarks of their owners (Novo Nordisk and Eli Lilly). Steadie isn&apos;t connected with either company and doesn&apos;t promote any medicine.</p>
            <h2>Updates and corrections</h2>
            <p>Each guide shows when it was last updated. We review guides when new research or guidance is published. If you spot something wrong, email [EDITORIAL EMAIL] and we&apos;ll put it right.</p>
            <p><Link href="/guides">Read the guides</Link> · <Link href="/about">About Steadie</Link></p>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
