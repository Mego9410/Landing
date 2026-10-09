import type { Guide } from "@/content/guides";
import { APP_LIVE, appStoreLink, campaign, PRICE } from "../site";
import styles from "./guides.module.css";

// The card at the end of every guide: a one-line hook that fits what the guide was about, then the App Store link.
// Before launch (APP_LIVE false) it keeps the hook and says "Coming soon to iPhone", with no link, like the aside and
// AppStoreButton. Hooks describe the app only: nothing about medicines, doses or stopping, and no promises about weight.

type Topic = "cost" | "comingOff" | "food" | "strength" | "appetite" | "habits" | "occasions" | "keeping" | "basics";

const HOOKS: Record<Topic, string> = {
  cost: `Stopping because of the price? Steadie is ${PRICE.weekly} a week and built for exactly this year.`,
  comingOff: "Planning for life after your last jab? Steadie is a calm 12-month plan built for exactly this year.",
  food: "Want protein to feel easy? Steadie's meals take fifteen minutes hands-on, with a shopping list for your supermarket.",
  strength: "Not sure where to start with strength? Steadie's home sessions need only a chair and step up gently as you do.",
  appetite: "Appetite louder than it used to be? Steadie's one-minute check-in shows what goes with your fuller, steadier days.",
  habits: "Rather build habits than follow rules? Steadie gives you three small ones a week, and no weigh-in is needed.",
  occasions: "Busy days and meals out ahead? Steadie's coach has ready-made ideas, and a calm plan if things drift.",
  keeping: "Want to keep what you've worked for? Steadie notices drift early, kindly, and helps you steady things.",
  basics: "Thinking about the year after the medicine? Steadie is a 12-month plan for exactly that, alongside your prescriber.",
};

// Slug words first (a cost guide sits under "Coming off", a habits guide under "Keeping it off"), then the category.
const BY_SLUG: [RegExp, Topic][] = [
  [/cost|price/, "cost"],
  [/strength|muscle|exercise|walking/, "strength"],
  [/protein|meal|breakfast|lunch|dinner|snack|fibre|portion/, "food"],
  [/appetite|craving|emotional|eating-slowly|sleep-stress/, "appetite"],
  [/habit|body-image|new-year/, "habits"],
  [/eating-out|christmas|holiday|alcohol/, "occasions"],
];
const BY_CATEGORY: Record<Guide["category"], Topic> = { "Coming off": "comingOff", "Keeping it off": "keeping", Food: "food", Movement: "strength", Basics: "basics" };

export const guideTopic = (g: Pick<Guide, "slug" | "category">): Topic => BY_SLUG.find(([re]) => re.test(g.slug))?.[1] ?? BY_CATEGORY[g.category] ?? "basics";

export function GuideEndCta({ guide }: { guide: Pick<Guide, "slug" | "category"> }) {
  return (
    <aside className={styles.endCta} aria-label="Steadie for iPhone">
      <p className={styles.endHook}>{HOOKS[guideTopic(guide)]}</p>
      {APP_LIVE ? (
        <>
          <a className={styles.ctaButton} href={appStoreLink(campaign("guide-end", guide.slug))}>Try Steadie free for 7 days</a>
          <span className={styles.endSmall}>On iPhone. Then {PRICE.yearly} a year or {PRICE.monthly} a month; cancel any time in your iPhone settings.</span>
        </>
      ) : (
        <span className={styles.endSoon}>Coming soon to iPhone</span>
      )}
    </aside>
  );
}
