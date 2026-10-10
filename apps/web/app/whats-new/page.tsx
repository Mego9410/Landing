import home from "../page.module.css";
import styles from "../guides/guides.module.css";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { ldJson, ORGANIZATION, pageMetadata } from "../site";

// What's new in the app, newest release first. Keep each entry word for word in step with the App Store release notes
// (App Store Connect → the version → What's New in This Version).
export const metadata = pageMetadata("What's new", "What's new in Steadie: the latest updates to the iPhone app, newest first.", "/whats-new");

type Release = { version: string; month: string; intro: string; sections: { title: string; items: string[] }[] };

const RELEASES: Release[] = [
  {
    version: "1.0.2",
    month: "October 2026",
    intro: "A bigger, calmer Steadie, built to keep every week feeling fresh.",
    sections: [
      { title: "A warmer welcome", items: [
        "A new start that gets to know you: where you are with your jab, how you’re feeling and what matters most to you.",
        "Make a simple plan for when food noise gets loud, and pick your strength days before you begin.",
        "See your first week, built from your answers, before you decide.",
        "Choose how weight appears: shown, as a trend only, or not at all, in stone and pounds or kilos.",
        "A clear trial timeline shows when we’ll remind you and when you’ll be charged.",
        "Set up your account after you start, not before.",
      ] },
      { title: "A year that fits you", items: [
        "Still on your last few jabs? You now start with a short “Getting ready” stretch, and can tell us when you’ve had your last one in Settings.",
        "Your 12 months count from when you begin, wherever you start from.",
        "After week 52, a gentle year two keeps going, with new lessons.",
      ] },
      { title: "Something new each month", items: [
        "Every four weeks, “Your month” looks back at your check-ins, sessions and the habit you kept most, then lets you keep, change or swap a habit.",
        "This week’s lesson and a fresh tip now sit on Today.",
      ] },
      { title: "More to eat", items: [
        "56 new recipes, with far more choice for vegan, vegetarian, gluten-free, dairy-free and soya-free plans, microwave-only kitchens and tight budgets.",
        "Your meal plan remembers recent weeks, so favourites rest before coming back. Mark meals “Have it again” or “Not for me” and the plan learns.",
        "Swapped ingredients now read correctly in every recipe step.",
      ] },
      { title: "More ways to move", items: [
        "101 new exercises, including standing and seated options and moves using things you have at home.",
        "Each new block brings moves you haven’t done yet.",
      ] },
      { title: "Cook along", items: ["Two timers in one step now run on their own."] },
      { title: "Your progress", items: ["A 12-week view of your steady score and a “Your strength year” card show how far you’ve come."] },
      { title: "Your way", items: [
        "Safe mode is now called Habit Only mode.",
        "Choose light, dark or match your phone in Settings.",
        "A calmer launch screen, plus lots of small fixes.",
      ] },
    ],
  },
];

export default function WhatsNew() {
  return (
    <>
      <SiteHeader page="whats-new" />
      <main className={styles.page}>
        <script type="application/ld+json" dangerouslySetInnerHTML={ldJson({ "@context": "https://schema.org", "@graph": [ORGANIZATION] })} />
        <div className={home.wrap}>
          <article className={styles.body}>
            <p className={styles.kicker}>What&apos;s new</p>
            <h1 className={styles.title}>What&apos;s new in Steadie</h1>
            <p>The latest updates to the app, newest first. Update Steadie from the App Store to get them.</p>
            {RELEASES.map((r) => (
              <section key={r.version} aria-labelledby={`v${r.version}`}>
                <h2 id={`v${r.version}`}>Version {r.version} · {r.month}</h2>
                <p><strong>{r.intro}</strong></p>
                {r.sections.map((s) => (
                  <div key={s.title}>
                    <h3>{s.title}</h3>
                    <ul>{s.items.map((i) => <li key={i}>{i}</li>)}</ul>
                  </div>
                ))}
              </section>
            ))}
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
