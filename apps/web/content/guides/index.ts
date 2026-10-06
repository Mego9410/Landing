// All guides, in the order the hub shows them, with lookups and a check that every internal link points at a guide.
import { BASICS } from "./basics";
import { COMING_OFF } from "./coming-off";
import { FOOD_MOVE } from "./food-move";
import { KEEPING } from "./keeping";
import type { Category, Guide } from "./types";

export type { Block, Category, Faq, Guide, Section, Source } from "./types";

export const GUIDES: Guide[] = [...COMING_OFF, ...KEEPING, ...FOOD_MOVE, ...BASICS];
export const CATEGORIES: { name: Category; blurb: string }[] = [
  { name: "Coming off", blurb: "What to expect, what to ask your prescriber and how to prepare." },
  { name: "Keeping it off", blurb: "Hunger, cravings, sleep and a calm way to watch your weight." },
  { name: "Food", blurb: "Protein, breakfasts and meals that keep you fuller." },
  { name: "Movement", blurb: "Strength sessions and walking to protect muscle and stay steady." },
  { name: "Basics", blurb: "How GLP-1 medicines work, and the words you'll hear." },
];

const BY_SLUG = new Map(GUIDES.map((g) => [g.slug, g]));
export const guideBySlug = (slug: string) => BY_SLUG.get(slug);
export const relatedGuides = (g: Guide) => g.related.map((s) => BY_SLUG.get(s)).filter((x): x is Guide => !!x);

/** Every /guides/… link in a guide's text, and every related slug, must point at a real guide. */
export function brokenLinks(): string[] {
  const broken: string[] = [];
  for (const g of GUIDES) {
    const text = JSON.stringify(g.sections) + JSON.stringify(g.faqs);
    for (const m of text.matchAll(/\]\(\/guides\/([a-z0-9-]+)\)/g)) if (!BY_SLUG.has(m[1])) broken.push(`${g.slug} → ${m[1]}`);
    for (const r of g.related) if (!BY_SLUG.has(r)) broken.push(`${g.slug} → related ${r}`);
  }
  if (new Set(GUIDES.map((g) => g.slug)).size !== GUIDES.length) broken.push("duplicate slug");
  return broken;
}
