# SEO: guides and search

Landing's website is built to be found by people searching for help coming off GLP-1 weight-loss medicines
(Wegovy, Mounjaro, Ozempic) and keeping the weight off afterwards. This page covers what's in place, the rules for
health content, how to add a guide and what to do at launch.

## What's in place

- **Guides** at `/guides`: 20 articles in five topics (Coming off, Keeping it off, Food, Movement, Basics), four of
  them pillar guides that head their topic. Content lives in `apps/web/content/guides/*.ts`; pages are
  `apps/web/app/guides`. Every guide has a short answer at the top, sections with a table of contents, common
  questions, numbered sources, related guides and a medical disclaimer.
- **Metadata:** a search-led `<title>` and description for every page, canonical URLs, Open Graph and Twitter cards,
  and a generated share image per guide (`/guides/[slug]/opengraph-image`).
- **Structured data (JSON-LD):** Organization and WebSite on the home page; Article (with citations), BreadcrumbList
  and FAQPage on every guide; CollectionPage on the hub; AboutPage on About. Check with Google's
  [Rich Results Test](https://search.google.com/test/rich-results).
- **Discovery:** `sitemap.xml` lists every page with last-updated dates; `robots.txt` allows production only;
  `/guides/feed.xml` is an RSS feed of the guides.
- **Trust pages:** `/about` and `/editorial-policy` say who writes the guides, where the information comes from, that
  they aren't clinically reviewed, and how to report a mistake. Google weighs these heavily for health topics.
- **Internal links:** the header and footer link to the guides on every page, the home page has a guides section, and
  guides link to each other in the text and under "Keep reading". `brokenLinks()` in `content/guides/index.ts`
  checks every internal link points at a real guide.

## Keyword map

| Guide | Main search phrases |
| --- | --- |
| Coming off a GLP-1 (pillar) | coming off GLP-1, how to get off GLP-1, stopping weight loss injections |
| What happens when you stop | what happens when you stop Wegovy / Mounjaro, weight regain after stopping semaglutide |
| Stopping Wegovy | stopping Wegovy, life after Wegovy, Wegovy 2 year limit NHS |
| Coming off Mounjaro | coming off Mounjaro, Mounjaro weight regain |
| Stopping Ozempic | stopping Ozempic, Ozempic vs Wegovy |
| NHS time limit | Wegovy 2 year limit NHS, Mounjaro NHS 6 months 5% |
| Questions for your prescriber | questions to ask before stopping Wegovy |
| Habits before you stop | preparing to come off Wegovy / Mounjaro |
| Keep weight off (pillar) | keep weight off after Wegovy, maintain weight after Mounjaro |
| Appetite after stopping | hungry after stopping Wegovy, food noise after stopping |
| Weight after stopping | weight going up after stopping Mounjaro, weight fluctuation |
| Cravings | cravings after stopping Ozempic, sugar cravings after Wegovy |
| Sleep, stress and appetite | stress eating, sleep and appetite |
| Eating out | eating out after Wegovy, high-protein fakeaway |
| Protein (pillar) | protein after GLP-1, how much protein after Wegovy |
| High-protein breakfasts | high protein breakfast UK |
| Strength training (pillar) | muscle loss Ozempic, strength training after Wegovy |
| Walking | steps a day to keep weight off |
| What are GLP-1 medicines | what is GLP-1, semaglutide vs tirzepatide |
| Glossary | food noise meaning, lean mass |

The home page targets the generic phrases (life after weight-loss jabs, keep weight off after a GLP-1) and doesn't name
brands: naming prescription-only medicines on a marketing page edges towards advertising them, which UK rules restrict.
Guides name brands only to describe what people searched for, with a trademark note.

## Rules for health content

These follow the brand guide and Google's standards for health ("your money or your life") pages:

- **Never** tell anyone how or when to stop, taper or change a medicine. Say it's for their prescriber.
- Only claim what a cited source says. Prefer NICE, NHS, peer-reviewed trials and professional bodies.
- General information, not advice. Every guide carries the disclaimer, and Beat where eating may be hard.
- Plain UK English, kind and calm. No "cheat", "fail", "willpower", "back on track" or "goal weight".
- Keep `updated` honest: change it when a guide is reviewed or changed, not to look fresh.

## Adding a guide

1. Add it to the right file in `apps/web/content/guides/` (or a new file, added to `index.ts`). Pick a slug in the
   words people search for, a `metaTitle` under about 60 characters and a `description` of about 150.
2. Link to it from two or three related guides, in the text and in `related`.
3. Run `pnpm --filter @landing/web build`; the page, its share image, the sitemap and the feed update themselves.

## At launch

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the live domain (canonicals, sitemap and structured data use it).
- [ ] Fill in `[YOUR COMPANY NAME]`, `[EDITORIAL EMAIL]`, `[SUPPORT EMAIL]` and the address on About, the editorial
      policy and the footer.
- [ ] Verify the domain in [Google Search Console](https://search.google.com/search-console) and Bing Webmaster
      Tools, and submit `https://[YOUR DOMAIN]/sitemap.xml`.
- [ ] Test a few guides in the Rich Results Test.
- [ ] Turn off the prototype link (`apps/web/prelaunch.json`) so `/prototype` isn't published.

## What will move rankings next

- **Time and links.** A new domain takes months to rank for competitive health terms. Links from patient forums,
  charities, local NHS weight services, pharmacies and press coverage matter most. Pitch the "what happens when you
  stop" data story to health journalists.
- **Depth on the pillars.** The pillar guides are 400 to 700 words; competitors' are often longer. Expand them as
  real questions come in (Search Console shows the exact searches people use).
- **Expert review.** A named, registered dietitian or doctor reviewing guides would strengthen them for Google
  considerably. The editorial policy currently says guides aren't clinically reviewed; update it if that changes.
- **Note on FAQ results.** Google now shows FAQ rich results mainly for well-known health and government sites, so the
  FAQ markup mostly helps AI answers and other search engines rather than adding a visible dropdown.
