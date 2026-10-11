// Free tools: see app/tools/page.tsx for the index.
// Steadie's free tools (growth playbook, "Web SEO": pages that do something, which AI summaries can't replace). Each is
// a page at /tools/<slug> with a calculator, a plain-English explanation, FAQs and sources. Guides link to them.
export interface Tool {
  slug: string;
  /** The page heading and card title. */
  title: string;
  /** The <title>, main search phrase first. */
  metaTitle: string;
  description: string;
  /** One line for cards and the guides' "Try a tool" box. */
  blurb: string;
  updated: string;
  keywords: string[];
}

export const TOOLS: Tool[] = [
  {
    slug: "maintenance-calories",
    title: "Maintenance calorie calculator for after a weight-loss jab",
    metaTitle: "Maintenance calorie calculator after Mounjaro or Wegovy",
    description: "Work out roughly how many calories a day keep your weight steady after stopping Mounjaro, Wegovy or another GLP-1. Free, UK units, no sign-up.",
    blurb: "Roughly how much food keeps your weight steady now, in kg or stones.",
    updated: "2026-10-11",
    keywords: ["maintenance calories after mounjaro", "maintenance calorie calculator", "how many calories after stopping wegovy", "calories to maintain weight uk"],
  },
  {
    slug: "weight-regain",
    title: "Weight regain after stopping: what the trials show for you",
    metaTitle: "Weight regain calculator after stopping Mounjaro or Wegovy",
    description: "See what the big trials found about weight regain after stopping semaglutide (Wegovy) or tirzepatide (Mounjaro), applied to your own numbers, and what helps.",
    blurb: "The trial averages for regain after stopping, applied to your numbers.",
    updated: "2026-10-11",
    keywords: ["weight regain after stopping mounjaro", "will i regain weight after wegovy", "weight regain calculator glp-1", "how much weight will i put back on after stopping"],
  },
];

export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);
