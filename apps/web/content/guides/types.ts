// Guides: Landing's articles for people coming off GLP-1 weight-loss medicines, written for search and for reading.
//
// House rules for every guide (they follow the brand guide and the medicines rules):
// - Never tell anyone how or when to stop, taper or change a medicine. That's for their prescriber; say so plainly.
// - General information, not medical advice. Cite sources, and only claim what the source says.
// - UK English, kind and calm. No "cheat", "fail", "willpower", "back on track" or "goal weight".
// - Brand names (Wegovy, Ozempic, Mounjaro) only to describe what people are searching for, never to promote.
//
// Inline text supports [link text](/guides/slug) and **bold**.

export type Block =
  | string
  | { list: string[]; ordered?: boolean }
  | { note: string; tone?: "sky" | "butter" | "sage" };

export interface Section { heading: string; blocks: Block[] }
export interface Source { label: string; url: string }
export interface Faq { q: string; a: string }

export type Category = "Coming off" | "Keeping it off" | "Food" | "Movement" | "Basics";

export interface Guide {
  slug: string;
  /** The page heading. */
  title: string;
  /** The <title>, under 60 characters where possible, with the main search phrase first. */
  metaTitle: string;
  /** The meta description, about 150 characters. */
  description: string;
  category: Category;
  /** Search phrases the guide answers, for keywords and internal planning. */
  keywords: string[];
  published: string;
  updated: string;
  /** Three or four lines at the top: the answer, fast. */
  summary: string[];
  sections: Section[];
  faqs: Faq[];
  sources: Source[];
  related: string[];
  /** A pillar guide heads its topic and is shown first. */
  pillar?: boolean;
}
