// All guides, in the order the hub shows them, with lookups and a check that every internal link points at a guide.
// Scheduled guides (scheduled-*.ts) are in the list from the start but only go live on their `published` date, in
// London time: pages filter with liveGuides() and refresh hourly, and the daily cron (app/api/cron/guides) emails each
// one on its day.
import { BASICS } from "./basics";
import { COMING_OFF } from "./coming-off";
import { COSTS } from "./costs";
import { FOOD_MOVE } from "./food-move";
import { KEEPING } from "./keeping";
import { SCHEDULED_1 } from "./scheduled-1";
import { SCHEDULED_2 } from "./scheduled-2";
import { SCHEDULED_3 } from "./scheduled-3";
import { SCHEDULED_4 } from "./scheduled-4";
import type { Category, Guide } from "./types";

export type { Block, Category, Faq, Guide, Section, Source } from "./types";

/** Every guide, live or scheduled. Pages should use liveGuides(). */
export const ALL_GUIDES: Guide[] = [...COMING_OFF, ...COSTS, ...KEEPING, ...FOOD_MOVE, ...BASICS,
  ...[...SCHEDULED_1, ...SCHEDULED_2, ...SCHEDULED_3, ...SCHEDULED_4].sort((a, b) => (a.published < b.published ? -1 : 1))];

/** Today's date in London as YYYY-MM-DD, the day guides go live and emails go out. */
export const londonToday = (now = new Date()) => now.toLocaleDateString("en-CA", { timeZone: "Europe/London" });
export const isLive = (g: Guide, today = londonToday()) => g.published <= today;
/** The guides published so far, in hub order. */
export const liveGuides = (today = londonToday()) => ALL_GUIDES.filter((g) => isLive(g, today));
/** The most recently published guides first. */
export const latestGuides = (today = londonToday()) => liveGuides(today).sort((a, b) => (a.published < b.published ? 1 : -1));
export const CATEGORIES: { name: Category; blurb: string }[] = [
  { name: "Coming off", blurb: "What to expect, what to ask your prescriber and how to prepare." },
  { name: "Keeping it off", blurb: "Hunger, cravings, sleep and a calm way to watch your weight." },
  { name: "Food", blurb: "Protein, breakfasts and meals that keep you fuller." },
  { name: "Movement", blurb: "Strength sessions and walking to protect muscle and stay steady." },
  { name: "Basics", blurb: "How GLP-1 medicines work, and the words you'll hear." },
];

const BY_SLUG = new Map(ALL_GUIDES.map((g) => [g.slug, g]));
/** Any guide by slug, including scheduled ones: check isLive() before showing it. */
export const guideBySlug = (slug: string) => BY_SLUG.get(slug);
/** A live guide by slug, or undefined. */
export const liveGuide = (slug: string, today = londonToday()) => { const g = BY_SLUG.get(slug); return g && isLive(g, today) ? g : undefined; };
export const relatedGuides = (g: Guide, today = londonToday()) => g.related.map((s) => liveGuide(s, today)).filter((x): x is Guide => !!x);

/** Every /guides/… link in a guide's text, and every related slug, must point at a real guide. */
export function brokenLinks(): string[] {
  const broken: string[] = [];
  for (const g of ALL_GUIDES) {
    const text = JSON.stringify(g.sections) + JSON.stringify(g.faqs);
    for (const m of text.matchAll(/\]\(\/guides\/([a-z0-9-]+)\)/g)) if (!BY_SLUG.has(m[1])) broken.push(`${g.slug} → ${m[1]}`);
    for (const r of g.related) if (!BY_SLUG.has(r)) broken.push(`${g.slug} → related ${r}`);
  }
  if (new Set(ALL_GUIDES.map((g) => g.slug)).size !== ALL_GUIDES.length) broken.push("duplicate slug");
  return broken;
}
