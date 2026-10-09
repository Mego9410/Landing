import Image from "next/image";
import Link from "next/link";
import { cast } from "@landing/motion/browser";
import styles from "./page.module.css";
import { Carousel } from "./carousel";
import { ExerciseLoop } from "./exercise-loop";
import { latestGuides, liveGuide, liveGuides } from "@/content/guides";
import { SiteFooter, SiteHeader } from "./site-chrome";
import { abs, ldJson, ORGANIZATION, SITE_NAME } from "./site";
import { PrototypeLink } from "./prototype-link";
import { AppStoreButton } from "./app-store";

// New guides go live on their date (see content/guides), so the home page refreshes hourly to show the latest.
export const revalidate = 3600;

/** The home page's guides: the two newest, the price guide, the pillars, then two favourites, without repeats. */
function homeGuides() {
  const LAUNCH = "2026-10-09";
  const fresh = latestGuides().filter((g) => g.published > LAUNCH).slice(0, 2);
  const picks = [...fresh, liveGuide("weight-loss-jab-price-rise-uk"), ...liveGuides().filter((g) => g.pillar),
    liveGuide("what-happens-when-you-stop-weight-loss-injections"), liveGuide("appetite-after-stopping-glp-1")];
  return [...new Map(picks.filter((g) => !!g).map((g) => [g.slug, g])).values()].slice(0, 8);
}

// Pricing from the paywall design. Confirm before launch; the page says so under the plan.
const PRICE = { yearly: "£69.99", weekly: "£1.35", monthly: "£12.99" };

const ICONS = {
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  strength: '<path d="M7 8v8M17 8v8M4 10.5v3M20 10.5v3M7 12h10"/>',
  meal: '<path d="M4 13h16a8 8 0 0 1-16 0z"/><path d="M9 4.5c0 1.5 1 1.5 1 3M13 4.5c0 1.5 1 1.5 1 3"/>',
  habit: '<rect x="4" y="4.5" width="16" height="15" rx="4"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  score: '<path d="M4 19.5h16"/><path d="M5 15l4.5-4.5 3.5 3 6-6"/>',
  coach: '<path d="M7 4.5h10a3 3 0 0 1 3 3v5.5a3 3 0 0 1-3 3h-5.5L7.5 19.5V16H7a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3z"/>',
  doc: '<path d="M7 3.5h7l4 4v13H7z"/><path d="M14 3.5v4h4M10 12h5M10 15.5h5"/>',
  shield: '<path d="M12 3.5l7 3v5.5c0 4.2-3 7.3-7 8.5-4-1.2-7-4.3-7-8.5V6.5z"/><path d="M9 12l2 2 4-4"/>',
  heart: '<path d="M12 19.5s-7-4.3-7-9.5a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.2-7 9.5-7 9.5z"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="3"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="3"/><path d="M11 18.5h2"/>',
  gift: '<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M12 9v11M4 13h16M12 9c-2-4-6-3-5-1s5 1 5 1zM12 9c2-4 6-3 5-1s-5 1-5 1z"/>',
  person: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M5.6 18.4l1.1-1.1M17.3 6.7l1.1-1.1"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
};
type IconName = keyof typeof ICONS;
function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />;
}

const TRUST: { icon: IconName; text: string }[] = [
  { icon: "gift", text: "7-day free trial" },
  { icon: "heart", text: "A health check before you start" },
  { icon: "shield", text: "Works alongside your prescriber" },
  { icon: "lock", text: "Private backup, never sold" },
  { icon: "phone", text: "Coming to iPhone" },
];

const SUPPORT: { icon: IconName; tone: string; title: string; text: string }[] = [
  { icon: "strength", tone: "sky", title: "Strength for every body", text: "Twenty-five-minute sessions at home that step up gently as you get stronger, with easier versions a tap away." },
  { icon: "meal", tone: "apricot", title: "Meals easier than a takeaway", text: "Fifteen minutes hands-on, six ingredients, one pan. Swaps for every diet and a shopping list for your supermarket." },
  { icon: "habit", tone: "sage", title: "Three small habits a week", text: "Protein at breakfast, a session, a pause before seconds, with a short lesson each week. Swap one if it doesn't suit your week." },
  { icon: "sun", tone: "sky", title: "A one-minute morning check-in", text: "A few questions about yesterday. Over a few weeks, Steadie shows what goes with your fuller, steadier days." },
  { icon: "score", tone: "butter", title: "A weekly steady score", text: "It rewards steady habits, not weight loss, and notices drift early, kindly." },
  { icon: "coach", tone: "lilac", title: "A coach for tricky days", text: "Ideas for meals out, high-protein swaps and a calm word when a day doesn't go to plan." },
  { icon: "doc", tone: "rose", title: "A summary for your prescriber", text: "A one-page update to take to appointments. Steadie never gives advice about doses or stopping." },
  { icon: "bell", tone: "butter", title: "Gentle reminders, and Apple Health", text: "Nudges at times that suit you, never about weight. Bring in your weight and steps from Apple Health if you like." },
];

const STEPS = [
  { title: "Answer a few questions", text: "A few minutes on when you stopped, a quick health check, and how you like to eat. No weigh-in needed." },
  { title: "Get your 12-month plan", text: "Three phases, three small habits a week and short strength sessions that fit your week and your body." },
  { title: "Keep it, with support", text: "A morning check-in, a weekly steady score and a coach for tricky days, with a calm plan if things start to drift." },
];

const PHASES = [
  { name: "Land", weeks: "Weeks 1–8", tone: "sky", text: "Your appetite starts to come back. Protein at every meal and two short strength sessions a week." },
  { name: "Settle", weeks: "Weeks 9–26", tone: "sage", text: "Meal structure that fits your week, eating out without overthinking it, and a plan for cravings." },
  { name: "Steady", weeks: "Weeks 27–52", tone: "lilac", text: "The routines are yours now. Fewer prompts, and a check-in each month." },
] as const;

const BRIEFS: Record<string, { build: string; move: string; ids: string[] }> = {
  maya: { build: "Mid build", move: "Often trains with a chair at home", ids: ["squat-2", "push-2"] },
  dev: { build: "Full build", move: "Back at the gym after a break", ids: ["hinge-4", "row-4"] },
  sue: { build: "Full build", move: "Balance and seated options first", ids: ["balance-3", "press-2"] },
  amira: { build: "Mid build", move: "Bands and dumbbells at home", ids: ["row-3", "lunge-3"] },
  tom: { build: "Slim build", move: "Walks a lot, new to strength", ids: ["push-1", "core-2"] },
  grace: { build: "Fuller build", move: "Low-impact, knee-friendly sessions", ids: ["hinge-1", "squat-3"] },
};

const SAFETY: { icon: IconName; title: string; text: string }[] = [
  { icon: "heart", title: "A health check first", text: "A few questions before you start, and again every 12 weeks. If something needs a word with your GP, strength sessions wait while food and habits carry on." },
  { icon: "strength", title: "Gentler when you need it", text: "Sore joints, a fall or feeling wiped out after activity? Sessions start with the easier version of each move and step up only when you're ready." },
  { icon: "meal", title: "Food that fits your health", text: "Pregnancy, kidney disease, diabetes and high blood pressure each switch on the right food settings. For pregnancy and kidney disease, we suggest who to talk to first." },
];

const PROMISES: { icon: IconName; title: string; text: string }[] = [
  { icon: "heart", title: "No goal weight", text: "We help you hold steady, and help you reset gently if things drift. Never a telling-off." },
  { icon: "habit", title: "Numbers only if they help", text: "Safe mode hides weight entirely and builds your score from habits and check-ins." },
  { icon: "shield", title: "Your prescriber stays in charge", text: "Steadie never gives advice about medication, doses or stopping treatment." },
  { icon: "lock", title: "Your data stays yours", text: "Kept on your phone, with a private backup if you sign in. Never sold, never used for ads. Export it or delete your account in a tap." },
];

const FAQS = [
  { q: "Who is Steadie for?", a: "Adults who have stopped a weight-loss jab such as Wegovy or Mounjaro, are stopping soon, or want a plan ready for when they do." },
  { q: "Is Steadie medical advice?", a: "No. Steadie is a general wellness app for building food, activity and eating habits. It doesn't diagnose or treat anything, and decisions about medication are always for your prescriber." },
  { q: "I'm still on my jab. Can I start now?", a: "Yes. Many people start building the habits before their last injection, so the routines are in place when appetite returns." },
  { q: "Do I have to weigh myself?", a: "No. Weigh-ins are optional, and safe mode hides weight completely. Your weekly score can come from habits and your morning check-ins alone." },
  { q: "I have a health condition. Can I use Steadie?", a: "Steadie gives general guidance, not medical advice. A quick health check at the start suggests checking with your GP, midwife or specialist where it matters, pauses strength sessions until you have, and adjusts food and sessions to suit. It asks again every 12 weeks." },
  { q: "What do I need for the exercises?", a: "Nothing but a chair and a bit of space at home to start. Most moves have an easier version, and sessions step up gently over the weeks as you get stronger." },
  { q: "Does it work with my diet?", a: "Every meal has swaps for vegetarian, vegan, gluten-free, dairy-free, halal and kosher eating, allergies and a microwave-only kitchen." },
  { q: "Where is my data kept?", a: "On your phone. If you sign in, Steadie also keeps a private, encrypted backup so your plan moves with you to a new phone. It's never sold or used for ads, and you can export everything or delete your account from Settings. If you connect Apple Health, that information is only used for your own plan, and never for advertising." },
  { q: "When can I use it, and what will it cost?", a: `Now, on iPhone: download Steadie from the App Store. Both plans start with a 7-day free trial: then ${PRICE.yearly} a year, or ${PRICE.monthly} a month. Cancel any time in your iPhone settings.` },
];

// STEP 1 trial extension (reference 1): mean change in body weight from the start of treatment.
const STEP1 = [
  { week: 0, change: 0, label: "Start" },
  { week: 68, change: -17.3, label: "Week 68, treatment stops" },
  { week: 120, change: -5.6, label: "Week 120" },
];

function RegainChart() {
  const W = 320, H = 170, L = 46, R = 16, T = 14, B = 30;
  const x = (w: number) => L + (w / 120) * (W - L - R);
  const y = (c: number) => T + (-c / 20) * (H - T - B);
  const pts = STEP1.map((p) => `${x(p.week)},${y(p.change)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.chart} role="img" aria-label="Average weight change in the STEP 1 trial: down 17.3% at week 68 when treatment stopped, then down 5.6% at week 120.">
      {[0, -10, -20].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} className={styles.chartGrid} />
          <text x={L - 8} y={y(g) + 4} textAnchor="end" className={styles.chartAxis}>{g === 0 ? "0%" : `−${-g}%`}</text>
        </g>
      ))}
      <text x={x(68) - 8} y={T + 24} textAnchor="end" className={styles.chartAxis}>Treatment stops</text>
      <line x1={x(68)} x2={x(68)} y1={T} y2={H - B} className={styles.chartStop} />
      <polyline points={pts} fill="none" className={styles.chartLine} />
      {STEP1.map((p) => <circle key={p.week} cx={x(p.week)} cy={y(p.change)} r="4.5" className={styles.chartDot} />)}
      <text x={x(68) + 10} y={y(-17.3) + 5} className={styles.chartLabel}>−17.3%</text>
      <text x={x(120) - 4} y={y(-5.6) - 10} textAnchor="end" className={styles.chartLabel}>−5.6%</text>
      {[0, 68, 120].map((w, i) => <text key={w} x={x(w)} y={H - 10} textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"} className={styles.chartAxis}>Week {w}</text>)}
    </svg>
  );
}

const HOME_LD = {
  "@context": "https://schema.org",
  "@graph": [
    ORGANIZATION,
    { "@type": "WebSite", "@id": `${abs("/")}#website`, url: abs("/"), name: SITE_NAME, inLanguage: "en-GB", publisher: { "@id": ORGANIZATION["@id"] } },
    { "@type": "FAQPage", "@id": `${abs("/")}#faq`, mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(HOME_LD)} />

      <SiteHeader home />

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={`${styles.wrap} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className={styles.pill}><span className={styles.pillDot} aria-hidden="true" />For life after weight-loss jabs</p>
            <h1 id="hero-title" className={styles.display}>Keep what you&apos;ve worked&nbsp;for.</h1>
            <p className={styles.lede}>The 12-month plan for the year after you stop a weight-loss jab. Strength, protein and steady habits to keep the weight off, with support on your side.</p>
            <div id="download" className={styles.heroCta}>
              <AppStoreButton />
              <p className={styles.storeNote}>7 days free, then {PRICE.yearly} a year or {PRICE.monthly} a month. For iPhone.</p>
            </div>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <span className={styles.shapeLilac} />
            <span className={styles.shapeSky} />
            <span className={styles.shapeButter} />
            <span className={styles.shapeGround} />
            <span className={styles.shapeSun} />
            <div className={styles.phone}>
              <Image src="/today.png" alt="" width={780} height={1688} sizes="(max-width: 900px) 250px, 290px" priority />
            </div>
            <div className={`${styles.float} ${styles.floatLoop}`}>
              <span className={styles.floatLabel}>Today&apos;s session</span>
              <div className={styles.floatStage}><ExerciseLoop ids={["squat-2", "push-2", "hinge-1", "row-2"]} /></div>
            </div>
            <div className={`${styles.float} ${styles.floatA}`}>
              <span className={styles.scoreNum}>78</span>
              <span><strong>Steady score</strong><br /><span className={styles.muted}>A steady week</span></span>
            </div>
            <div className={`${styles.float} ${styles.floatB}`}>
              <span className={styles.habitTick}><Icon name="check" size={16} /></span>
              <span><strong>Protein at breakfast</strong><br /><span className={styles.muted}>5 of 7 days</span></span>
            </div>
          </div>
        </div>
      </section>


      <main>
        <ul className={styles.trust} aria-label="Why people trust Steadie">
          {TRUST.map((t) => <li key={t.text}><Icon name={t.icon} size={18} />{t.text}</li>)}
        </ul>
        <section className={styles.newsBand} aria-labelledby="prices-title">
          <div className={`${styles.wrap} ${styles.news}`}>
            <div className={styles.newsCopy}>
              <p className={styles.eyebrow}>Jab prices</p>
              <h2 id="prices-title" className={styles.newsTitle}>Paying more for your weight-loss jab?</h2>
              <p className={styles.muted}>Mounjaro&apos;s UK price rose by up to 170% in September 2025, and private prices can still change. What&apos;s happened, what&apos;s been announced, and what you can do.</p>
            </div>
            <div className={styles.newsLinks}>
              <Link className={styles.btnPrimary} href="/guides/weight-loss-jab-price-rise-uk">What you can do</Link>
              <Link className={styles.newsLink} href="/guides/stopping-weight-loss-jabs-because-of-cost">Stopping because of the cost</Link>
            </div>
          </div>
        </section>
        <section className={styles.pillars} aria-labelledby="pillars-title">
          <div className={styles.wrap}>
            <div className={styles.head}>
              <p className={styles.eyebrow}>Built for life after the jab</p>
              <h2 id="pillars-title" className={styles.h2}>Move, eat and stay steady</h2>
            </div>
            <div className={styles.glassGrid}>
              <a href="#cast" className={`${styles.glass} ${styles.glassWide}`}>
                <span className={styles.glassText}><strong>Move</strong><span>Short strength sessions, shown by someone like you</span></span>
                <span className={styles.glassArrow}><Icon name="arrow" size={18} /></span>
                <span className={styles.glassArt}><ExerciseLoop ids={["squat-2", "push-2", "row-2", "lunge-3"]} every={6} /></span>
              </a>
              <a href="#support" className={styles.glass}>
                <span className={styles.glassText}><strong>Eat</strong><span>Meals easier than a takeaway</span></span>
                <span className={styles.glassArrow}><Icon name="arrow" size={18} /></span>
                <span className={styles.mealArt} aria-hidden="true">
                  <span className={styles.bowl}><span /><span /><span /></span>
                  <span className={styles.mealTag}>15 min · 6 ingredients</span>
                </span>
              </a>
              <a href="#how" className={styles.glass}>
                <span className={styles.glassText}><strong>Stay steady</strong><span>A weekly score for habits, not weight</span></span>
                <span className={styles.glassArrow}><Icon name="arrow" size={18} /></span>
                <span className={styles.ringArt} aria-hidden="true"><span>78</span></span>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.dark} aria-labelledby="proof-title">
          <div className={styles.wrap}>
            <div className={styles.head}>
              <p className={styles.eyebrowDark}>Why the year after matters</p>
              <h2 id="proof-title" className={styles.h2}>Weight often comes back after the jab. That&apos;s biology, not willpower.</h2>
            </div>
            <div className={styles.statGrid}>
              <div className={`${styles.statCard} ${styles.statChart}`}>
                <p className={styles.statSmall}>Average weight change in the STEP&nbsp;1&nbsp;trial<sup><a href="#ref-1">1</a></sup></p>
                <RegainChart />
                <p className={styles.statNote}>A year after stopping semaglutide, people had regained about two-thirds of the weight they lost. Muscle, protein and routines are what you can work on.</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statBig}>52</p>
                <p className={styles.statNote}>weeks of plan, counted from your last injection</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statBig}>1</p>
                <p className={styles.statNote}>minute each morning to check in on yesterday</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statBig}>3</p>
                <p className={styles.statNote}>small habits a week. Nothing more.</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statBig}>25</p>
                <p className={styles.statNote}>minute strength sessions, twice a week</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statBig}>6</p>
                <p className={styles.statNote}>people of different ages and sizes to show you the moves</p>
              </div>
            </div>
          </div>
        </section>

        <section id="support" className={styles.section} aria-labelledby="support-title">
          <div className={styles.wrap}>
            <div className={styles.headRow}>
              <h2 id="support-title" className={styles.h2Light}>Support that feels personal,<br /><span className={styles.mutedHead}>not like another diet</span></h2>
            </div>
            <Carousel label="What's included">
              {SUPPORT.map((f) => (
                <li key={f.title} className={styles.slide}>
                  <span className={`${styles.slideArt} ${styles[f.tone]}`}><span className={styles.slideIcon}><Icon name={f.icon} size={44} /></span></span>
                  <h3 className={styles.h3}>{f.title}</h3>
                  <p className={styles.muted}>{f.text}</p>
                </li>
              ))}
            </Carousel>
          </div>
        </section>

        <section id="cast" className={styles.section} aria-labelledby="cast-title">
          <div className={styles.wrap}>
            <div className={styles.headRow}>
              <h2 id="cast-title" className={styles.h2Light}>Shown by someone like you,<br /><span className={styles.mutedHead}>whoever you are</span></h2>
            </div>
            <Carousel label="The movement cast">
              {cast.map((c) => {
                const b = BRIEFS[c.id];
                return (
                  <li key={c.id} className={styles.castCard}>
                    <div className={styles.castStage} aria-hidden="true"><ExerciseLoop ids={b.ids} who={c.id} every={6} /></div>
                    <div className={styles.castMeta}>
                      <span><strong>{c.name}, {c.age}</strong><br /><span className={styles.muted}>{b.build}. {b.move}</span></span>
                    </div>
                  </li>
                );
              })}
            </Carousel>
            <p className={styles.castNote}>Pick who shows you the moves, or mix it up. Every exercise works for every one of them, at six levels and seated. Our cast are illustrated characters, not real members.</p>
          </div>
        </section>

        <section id="how" className={styles.section} aria-labelledby="how-title">
          <div className={styles.wrap}>
            <div className={styles.head}>
              <p className={styles.eyebrow}>How it works</p>
              <h2 id="how-title" className={styles.h2Light}>Three steps to steady</h2>
            </div>
            <ol className={styles.steps}>
              {STEPS.map((s, i) => (
                <li key={s.title} className={styles.step}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <h3 className={styles.h3}>{s.title}</h3>
                  <p className={styles.muted}>{s.text}</p>
                </li>
              ))}
            </ol>
            <ol className={styles.phases} aria-label="Your 12-month plan">
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

        <section id="safety" className={`${styles.section} ${styles.sunk}`} aria-labelledby="safety-title">
          <div className={styles.wrap}>
            <div className={styles.headRow}>
              <h2 id="safety-title" className={styles.h2Light}>Careful by design<br /><span className={styles.mutedHead}>so the plan fits your body</span></h2>
            </div>
            <ul className={styles.experts}>
              {SAFETY.map((e) => (
                <li key={e.title} className={styles.expert}>
                  <span className={styles.expertBadge}><Icon name={e.icon} /></span>
                  <h3 className={styles.h3}>{e.title}</h3>
                  <p className={styles.muted}>{e.text}</p>
                </li>
              ))}
            </ul>
            <ul className={styles.promises}>
              {PROMISES.map((p) => (
                <li key={p.title} className={styles.promise}>
                  <span className={styles.promiseIcon}><Icon name={p.icon} size={20} /></span>
                  <span><strong>{p.title}</strong><br /><span className={styles.muted}>{p.text}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="pricing" className={styles.section} aria-labelledby="price-title">
          <div className={`${styles.wrap} ${styles.split}`}>
            <div className={styles.splitCopy}>
              <p className={styles.eyebrow}>Pricing</p>
              <h2 id="price-title" className={styles.h2Light}>One membership, everything included</h2>
              <p className={styles.sectionLede}>Try everything free for 7 days, on either plan. We remind you before the trial ends, and you can cancel any time in your iPhone settings.</p>
            </div>
            <div className={styles.priceCard}>
              <span className={styles.badge}>7 days free</span>
              <p className={styles.priceName}>Yearly</p>
              <p className={styles.price}>{PRICE.yearly}<span> a year</span></p>
              <p className={styles.muted}>About {PRICE.weekly} a week. Or {PRICE.monthly} a month. Both start with 7 days free.</p>
              <ul className={styles.priceList}>
                {["Your 12-month plan, with a lesson each week", "Strength sessions that step up as you do", "Easy meals, swaps and shopping lists", "A morning check-in and your weekly steady score", "A coach for tricky days", "A summary for your prescriber", "Reminders and Apple Health"].map((x) => (
                  <li key={x}><Icon name="check" size={18} />{x}</li>
                ))}
              </ul>
              <AppStoreButton />
              <p className={styles.fine}>Prices in the UK, including VAT. Charged through your Apple account.</p>
            </div>
          </div>
        </section>

        <section id="guides" className={styles.section} aria-labelledby="guides-title">
          <div className={styles.wrap}>
            <div className={styles.headRow}>
              <h2 id="guides-title" className={styles.h2Light}>Guides for the year after<br /><span className={styles.mutedHead}>clear, kind and sourced</span></h2>
            </div>
            <ul className={styles.guideGrid}>
              {homeGuides().map((g) => (
                <li key={g.slug}><Link className={styles.guideCard} href={`/guides/${g.slug}`}><strong>{g.title}</strong><span>{g.description}</span></Link></li>
              ))}
            </ul>
            <p className={styles.castNote}><Link href="/guides">See all {liveGuides().length} guides</Link></p>
          </div>
        </section>

        <section id="faqs" className={`${styles.section} ${styles.sunk}`} aria-labelledby="faq-title">
          <div className={`${styles.wrap} ${styles.narrow}`}>
            <div className={styles.head}>
              <h2 id="faq-title" className={styles.h2Light}>Questions, answered</h2>
            </div>
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

        <section className={styles.cta} aria-labelledby="cta-title">
          <div className={`${styles.wrap} ${styles.ctaInner}`}>
            <h2 id="cta-title" className={styles.display}>Make this year your steady one</h2>
            <p className={styles.lede}>Try the full plan free for 7 days, on either plan.</p>
            <AppStoreButton />
            <p className={styles.storeNote}>Then {PRICE.yearly} a year or {PRICE.monthly} a month. Cancel any time in your iPhone settings.</p>
          </div>
        </section>
      </main>

      <SiteFooter home />
      <PrototypeLink />
    </>
  );
}
