import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { Lockup } from "./lockup";
import { PrototypeLink } from "./prototype-link";
import { WaitlistForm } from "./waitlist-form";

const PHASES = [
  { name: "Land", weeks: "Weeks 1–8", tone: "sky", text: "Your appetite starts to come back. Protein at every meal and two short strength sessions a week." },
  { name: "Settle", weeks: "Weeks 9–26", tone: "sage", text: "Meal structure that fits your week, eating out without overthinking it, and a plan for cravings." },
  { name: "Steady", weeks: "Weeks 27–52", tone: "lilac", text: "The routines are yours now. Fewer prompts, and a check-in each month." },
] as const;

const FEATURES = [
  { title: "Three small habits a week", text: "Protein at breakfast, a strength session, a pause before seconds. Swap one if it doesn't suit your week.", icon: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', tone: "sage" },
  { title: "A weekly landing score", text: "It rewards steady habits, not weight loss. If things shift, you get a gentle nudge and a lighter reset week.", icon: '<path d="M4 19.5h16"/><path d="M5 15l4.5-4.5 3.5 3 6-6"/>', tone: "apricot" },
  { title: "Short strength sessions", text: "Twenty-five minutes, at home or the gym. Muscle helps your body hold steady after the jab.", icon: '<path d="M7 8v8M17 8v8M4 10.5v3M20 10.5v3M7 12h10"/>', tone: "sky" },
  { title: "A coach for tricky days", text: "Quick high-protein ideas, plans for meals out, and help talking through a harder day.", icon: '<path d="M7 4.5h10a3 3 0 0 1 3 3v5.5a3 3 0 0 1-3 3h-5.5L7.5 19.5V16H7a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3z"/>', tone: "lilac" },
];

const PROMISES = [
  { title: "No goal weight", text: "We help you hold steady. Landing notices gentle drift early and offers a lighter week, never a telling-off." },
  { title: "Numbers only if they help", text: "Safe mode hides weight entirely and builds your score from habits and hunger." },
  { title: "Your prescriber stays in charge", text: "Landing never gives advice about doses or stopping. It makes a one-page summary you can take to appointments." },
  { title: "Your data stays yours", text: "Stored in the UK and EU. Never sold, and never used for ads. Delete everything in one tap." },
];

const FAQS = [
  { q: "Is Landing medical advice?", a: "No. Landing is a general wellness app for building food, activity and eating habits. It doesn't diagnose or treat anything, and decisions about medication are always for your prescriber." },
  { q: "Who is it for?", a: "Adults who have stopped a weight-loss jab, are stopping soon, or want a plan ready for when they do." },
  { q: "When can I use it?", a: "Landing is coming to iPhone first. Join the waitlist and we'll email you once when it opens." },
  { q: "What will it cost?", a: "There will be a 7-day free trial. We'll share the price before launch." },
];

function Icon({ paths }: { paths: string }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: paths }} />;
}

export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.wrap}>
          <Link href="/" aria-label="Landing home"><Lockup /></Link>
          <a className={styles.headerCta} href="#join">Join the waitlist</a>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={`${styles.wrap} ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>For life after weight-loss jabs</p>
              <h1 className={styles.display}>Keep what you&apos;ve worked for.</h1>
              <p className={styles.lede}>A 12-month habit plan for the year after you stop a weight-loss jab. Protein, strength and steady routines, at your pace.</p>
              <div id="join" className={styles.heroForm}><WaitlistForm /></div>
              <p className={styles.small}>Coming to iPhone first.</p>
            </div>
            <div className={styles.heroArt} aria-hidden="true">
              <span className={styles.shapeLilac} />
              <span className={styles.shapeSky} />
              <span className={styles.shapeButter} />
              <span className={styles.shapeGround} />
              <span className={styles.shapeSun} />
              <div className={styles.phone}>
                <Image src="/today.png" alt="" width={780} height={1688} sizes="(max-width: 900px) 260px, 300px" priority />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="plan-title">
          <div className={styles.wrap}>
            <h2 id="plan-title" className={styles.h2}>A plan in three phases</h2>
            <p className={styles.sectionLede}>Your plan counts from your last injection. Each week brings three small habits and two short sessions, nothing more.</p>
            <ol className={styles.phases}>
              {PHASES.map((p) => (
                <li key={p.name} className={`${styles.phase} ${styles[p.tone]}`}>
                  <span className={styles.phaseWeeks}>{p.weeks}</span>
                  <h3 className={styles.h3}>{p.name}</h3>
                  <p>{p.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sunk}`} aria-labelledby="inside-title">
          <div className={styles.wrap}>
            <h2 id="inside-title" className={styles.h2}>What&apos;s in it</h2>
            <ul className={styles.features}>
              {FEATURES.map((f) => (
                <li key={f.title} className={styles.feature}>
                  <span className={`${styles.featureIcon} ${styles[f.tone]}`}><Icon paths={f.icon} /></span>
                  <h3 className={styles.h3}>{f.title}</h3>
                  <p className={styles.muted}>{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="side-title">
          <div className={`${styles.wrap} ${styles.split}`}>
            <div>
              <h2 id="side-title" className={styles.h2}>On your side</h2>
              <p className={styles.sectionLede}>You&apos;ve paid a lot and worked hard. Landing is built to feel like a soft place to land, not another diet app.</p>
            </div>
            <dl className={styles.promises}>
              {PROMISES.map((p) => (
                <div key={p.title} className={styles.promise}>
                  <dt className={styles.promiseTitle}>{p.title}</dt>
                  <dd className={styles.muted}>{p.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className={styles.cta} aria-labelledby="cta-title">
          <div className={`${styles.wrap} ${styles.ctaInner}`}>
            <h2 id="cta-title" className={styles.h2}>Be first to try Landing</h2>
            <p>One email when it opens. No spam, no countdowns.</p>
            <WaitlistForm tone="apricot" />
          </div>
        </section>

        <section className={styles.section} aria-labelledby="faq-title">
          <div className={`${styles.wrap} ${styles.narrow}`}>
            <h2 id="faq-title" className={styles.h2}>Questions</h2>
            <div className={styles.faqs}>
              {FAQS.map((f) => (
                <details key={f.q} className={styles.faq}>
                  <summary>{f.q}</summary>
                  <p className={styles.muted}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.wrap} ${styles.footerInner}`}>
          <Image src="/landing-mark.svg" alt="" width={40} height={35} />
          <p className={styles.muted}>Landing is a general wellness app. It does not diagnose, treat or monitor any medical condition, and it does not give advice about medication, doses or stopping treatment.</p>
          <p className={styles.footerLinks}><Link href="/privacy">Privacy</Link><span>© {new Date().getFullYear()} [YOUR COMPANY NAME]</span></p>
        </div>
      </footer>
      <PrototypeLink />
    </>
  );
}
