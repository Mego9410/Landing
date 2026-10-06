# Plan: movement, food and shopping

How Landing will offer strength sessions that suit everyone, easy meals that beat a takeaway, and a path from "I'll
have that meal" to a supermarket basket. Written 5 October 2026 from three research briefs, and updated the same day
with the decisions in section 10:

- [Movement research](research/movement.md): evidence, training settings, exercise library, injuries and conditions, safety and regulation
- [Food research](research/food.md): nutrition after stopping a GLP-1, easy-meal design, meal library, dietary needs, safe mode, recipe data
- [Supermarket research](research/supermarkets.md): what each UK grocer allows, aggregators, product matching, legal risk

The research was done through web search; some primary sites (NICE, NHS, PubMed) blocked direct fetching, so every
brief marks claims to verify. Nothing in this plan is medical advice. A physiotherapist and a registered dietitian
must sign off the content before launch (section 8).

---

## 1. The short version

1. **Movement is built on movement patterns, not workouts.** Twelve patterns (squat, hinge, push, pull, carry, core,
   balance and so on), each with six levels and a seated version. Every exercise is tagged by setting, equipment,
   joint load, impact, noise and position, so the app can build a session for anyone and swap any exercise in one tap.
   About 150 exercises at launch covers 11 training settings, from a chair at home to a full gym.
2. **Injuries and conditions become comfort preferences, not diagnoses.** "Go easy on my knees" filters out deep
   bending and kneeling; it does not create a "knee arthritis programme". This keeps Landing a wellness app under MHRA
   rules and still gives people a plan that fits their body. A short screen sends a few people to their GP first and
   puts others on a gentler track; nobody is simply turned away.
3. **Every meal meets an "easier than a takeaway" standard:** 15 minutes hands-on or less, 6 shopping ingredients or
   fewer, one pan, tray, bowl or a microwave, and at least 25 g protein for a main. About 120 recipes at launch,
   including 12 "fakeaways" of the UK's favourite takeaways.
4. **Every recipe is a base plus tagged swaps.** Protein, allergens and diet tags are recalculated on each swap, so one
   recipe serves vegans, coeliacs, halal and kosher eaters, people with nut allergies, people with only a microwave and
   so on. If a swap drops protein, the app adds a top-up. A recipe whose method can't take a swap (boiled eggs can't
   become tofu) is left out for that person instead.
5. **No UK supermarket offers a public API to fill a basket.** At launch we ship the hard, valuable part ourselves (the
   weekly plan, a merged shopping list with pack sizes, pantry and leftovers) and hand off to the big five: search
   links and a shopping-mode checklist for Tesco, Sainsbury's and Asda, and an aisle-ordered list for Aldi and Lidl,
   which have no online shop. Shopping is there to make life easier, not to earn money: no affiliate links, no
   sponsored products. One-tap baskets wait for direct deals with the supermarkets; we won't use a third-party basket
   service in the meantime.
6. **Safe mode runs through all of it:** no numbers, no weight features, no streaks, hand-portion language and a Beat
   signpost, switched on by the user or by screening.
7. **Exercise demos are illustrated loops we make ourselves,** shown by a cast of six people that each user can choose
   from (or mix). The first 80 (every level of every pattern, plus the seated versions) are built:
   `packages/motion`, with a [gallery](../packages/motion/gallery.html).

---

## 2. What the research tells us

- **Weight comes back fast after stopping, so the first months matter most.** About two-thirds of weight lost on
  semaglutide was regained within a year in STEP 1; a 2026 BMJ meta-analysis puts average regain at about 0.4 kg a
  month, roughly four times faster than after diet and activity programmes. Some people do hold their loss (about 1 in
  6 in SURMOUNT-4). Tone: "this is biology, not willpower".
- **NICE says people should get at least 12 months of support after a weight-loss medicine ends** (QS212, August 2025),
  including routines and an action plan for when weight starts to return. That is Landing's scope exactly. Many NHS
  users stop because of a rule (the 2-year limit, or under 5% loss at 6 months), not by choice.
- **Strength:** 2 sessions a week, 1 to 3 sets, stopping 1 to 3 reps short of failure, is enough (UK CMO guidance, ACSM
  2026). Once built, strength holds with 1 to 2 sessions a week at the same effort. Landing's 2 × 25 minutes fits.
- **Walking does the heavy lifting for weight.** Maintenance needs roughly 200 to 300 minutes of activity a week, so
  steps and brisk minutes belong in the plan, not as an extra.
- **Food:** protein at each meal (about 25 to 30 g, or 1.0 to 1.2 g/kg a day), fibre built up gradually towards 30 g,
  low energy density, mostly minimally processed food, few liquid calories, regular meals. No calorie targets.
- **"Easy" is the real competitor.** Most people want to spend under 20 minutes on an evening meal; a takeaway order
  averages about £27 against about £2 a portion for a fakeaway. Meal-kit timings that are wrong (Gousto's "10-minute"
  meals took reviewers 30) destroy trust.
- **Supermarkets:** Tesco's developer API is gone and nothing replaced it; basket access only exists through private
  deals (Whisk, Cherrypick, Guardian and Ocado). Tesco is trialling its own AI meal planner that fills its basket.
  Aldi and Lidl have no online shop to send a basket to.

---

## 3. Principles that apply everywhere

1. **Preferences, not diagnoses.** Ask what people want to avoid ("kneeling", "weight on my wrists", "jumping"), never
   which condition they have, except for the few safety questions in section 4.2.
2. **Nobody is left out.** Every session has a seated path; every recipe has a microwave, store-cupboard or no-cook
   path where it can; every diet is a filter plus swaps, not a separate plan.
3. **Never block, always offer.** A swap that lowers protein still happens, with a friendly top-up suggestion. A missed
   week is met with an easier session, never a streak loss.
4. **Honest numbers.** Real total times, "approx." on nutrition and prices, dates on prices.
5. **Same voice as the brand.** Plain UK English, no "cheat", "burn", "bad food" or "back on track", no exclamation
   marks about weight, medication questions always go to the prescriber.
6. **Content is data, engines are code.** Exercises, recipes and swaps live as reviewed content; the app's session
   builder, planner and list builder are tested code that reads it (section 7).

---

## 4. Movement

### 4.1 Onboarding additions (about 2 minutes)

| Question | Options | Used for |
| --- | --- | --- |
| Where will you usually move? (pick any) | At home, small space or flat (quiet, no jumping), at a gym, outdoors or park, in a pool, seated or with limited mobility | Settings for exercise selection |
| What do you have? (checklist) | Nothing, a sturdy chair, stairs, resistance bands, dumbbells or kettlebells, a bench, water bottles or a backpack | Equipment profile. People can keep several (Home, Gym, Away) and switch per session |
| How long do you want sessions to be? | 10, 20 or 30 minutes | Session template |
| How active are you now? | Not much, some, regularly | Starting level per pattern |
| Anything we should go easy on? | Knees, hips, back, shoulders, wrists and hands, ankles and feet, neck; "getting down to the floor"; "balance" | Comfort filters |
| The safety screen | See 4.2 | GP-first or gentler track |

### 4.2 The safety screen (our own wording, modelled on PAR-Q+)

PAR-Q+ is copyrighted, so we write our own questions and have a physio review them.

- **Check with your GP first** (any yes): chest pain or unexplained breathlessness; fainting or blackouts in the last
  12 months; a heart condition diagnosed or changed in the last 12 months; surgery in the last 3 months, or told to
  exercise only under supervision; blood pressure very high and not yet controlled. The habits and food still work;
  strength sessions wait, with an offer to remind them in a week or two.
- **Refer on, then continue if they choose** (pregnant or gave birth in the last 12 weeks; kidney disease): see 4.2.1.
- **Gentler track** (any yes, sets preferences, never excludes): diabetes treated with insulin or gliclazide-type
  tablets (hypo safety card, "follow your diabetes team's advice"); joint or back pain that affects daily life (comfort
  filters); osteoporosis or a broken bone from a minor fall since 50 (no loaded bending forward, no impact); falls in
  the last year (supported standing, balance focus, seated option); can't easily get down to the floor (no floor
  work); ME/CFS or feeling much worse after activity (pacing mode with no automatic progression, as NICE NG206
  requires); very flexible joints (control-focused ladders).
- **Re-screen** every 12 weeks and whenever a check-in answer raises a red flag.

#### 4.2.1 Pregnancy and kidney disease: refer on, with a disclaimer to continue

Decided 5 October 2026. Anyone who says they are pregnant, gave birth in the last 12 weeks, or has kidney disease:

1. Sees a calm referral screen: why it matters, and who to talk to first (midwife or GP for pregnancy; kidney team or
   GP for kidney disease), with a "Remind me later" option.
2. Can carry on only by ticking a box: "I've read this. I'll check with my [midwife / kidney team], and I agree to the
   [terms and conditions] and [health disclaimer]." The button stays disabled until the box is ticked. We store the
   answer, the wording version and the time, and ask again if the wording changes or at the 12-week re-screen.
3. Carries on with the adaptations still on, whatever they tick. Pregnancy: safe mode for food, pregnancy-safe food
   filter, protein targets and top-ups off, no weight features, and exercise rules the physio sets (for example no
   lying flat on the back later in pregnancy, no heavy lifting or breath-holding). Kidney disease: protein targets and
   top-ups off, low-salt mode on, and "follow your kidney team's advice" on food screens.
4. Can withdraw at any time in settings, which turns strength sessions off again.

The lawyer and the regulatory adviser review the screen, the checkbox wording and the terms before launch. Under UK
law a disclaimer can't exclude liability for injury caused by negligence, so the adaptations and the referral are
what protect people; the checkbox records an informed choice.

### 4.3 The exercise library

- **Patterns:** squat, hinge, horizontal push, vertical push, horizontal pull, vertical pull, lunge or single leg,
  carry, core (front), core (side and rotation), balance, calf and ankle.
- **Ladders:** six levels per pattern plus a seated version. Example, squat: sit-to-stand from a high chair → arms
  crossed → box squat → goblet squat (bottle, backpack or dumbbell) → slow goblet squat → leg press or barbell squat.
  The full table is in [movement research §3.2](research/movement.md).
- **Settings covered:** bodyweight at home, small space, bands, household items, home dumbbells or kettlebells, full
  gym, outdoors, seated, pool, walking, classes.
- **Tags on every exercise:** pattern, level, settings, equipment, position (standing, seated, floor, water), impact,
  noise, load on each joint (knee, hip, lower back, shoulder, wrist, ankle), loaded forward bending, overhead,
  needs floor transfer, weight through extended wrists, balance demand, cues, common mistakes, easier and harder
  versions.
- **Launch size:** about 150 exercises (12 patterns × 6 levels, with roughly two setting variants each). Each needs a
  short looping demo, 2 to 3 cues and one common mistake. Plus about 15 warm-up and balance moves.
- **Demos:** illustrated loops made in house (decided 5 October 2026), shown by a cast of six adults aged 38 to 63
  in four body shapes, drawn from the brand's shapes in profile with no eyes or mouth (research:
  [character.md](research/character.md)). People pick who shows them the moves in sign-up and can change it in
  Settings; the default is "Mix it up", a different person each session. The first 80 loops are built in
  `packages/motion`, with props (chair, counter, step, bench, band, bottles, bags, dumbbells, kettlebell, machines).
  They draw live from one small script on the web and in the prototype, and with react-native-svg in the Expo app.
  Reduce Motion and the "Still pictures" setting show still frames. Each exercise is a few lines of keyframes, so the
  setting variants and warm-ups are quick to add. The physio reviews every loop with the cues.

### 4.4 How a session is built

1. **Template by phase and length.** Land: squat, hinge, horizontal push, horizontal pull, carry or core, balance
   (balance is mandatory for people over 65 or with falls risk). Settle and Steady rotate vertical push and pull,
   single leg and the other core pattern in.
2. **For each pattern, pick the exercise** at the person's current level that matches today's equipment profile and
   passes their comfort filters. If none passes, apply the swap rules below.
3. **Sets, reps and effort from the phase table:** Land weeks 1 to 2, 1 set of 8 to 12; weeks 3 to 8, 2 sets; Settle 2
   to 3 sets of 8 to 15; Steady 1 to 3 sets keeping effort. A 10-minute session is 3 exercises × 1 to 2 sets; 30
   minutes adds a balance block.
4. **Swap rules, in order:** same pattern and level with equipment they have → same level with lower load on the
   flagged joint → one level down → change position (floor to standing or seated) → a neighbouring pattern only if
   the whole pattern is filtered out. Never swap in something with more impact or balance demand without asking.

### 4.5 How a plan adapts

- **Effort question after each exercise:** "How many more could you have done?" Lots (5+), a few (2 to 4) or 1 or
  none. Double progression: when every set reaches the top of the range with "a few" left, move up a level or add
  weight next time.
- **Joint check after each session:** none, mild and settled, still sore next day, sharp or worrying. Traffic light:
  0 to 3 carry on; 4 to 5 fine if it settles within 24 hours, keep the level; 6 or more, or lingering, step that
  exercise down and offer a gentler swap. The same area twice in the red: suggest a GP or physio and switch that area
  to its lowest-load ladder.
- **Missed sessions:** one missed, nothing changes; 1 to 2 weeks, come back at the same level with 1 set; 3 weeks or
  more, one level down for a week. Two hard weeks in a row, offer the 10-minute plan.
- **Easier weeks:** one every 6 to 8 weeks in Settle and Steady, and automatically after illness, a red pain report
  or a missed week.
- **Pacing mode** (ME/CFS, post-exertional symptoms): same library, no automatic progression, person sets the pace.

### 4.6 Walking, classes and the rest of the week

- **Steps:** take a week's baseline from Apple Health, then suggest +500 to 1,000 a day each week towards about
  7,000 to 10,000 (6,000 to 8,000 for over-60s), plus brisk 10-minute bouts.
- **Classes:** "log something else" with type, length and effort. Circuits or bodypump count as a strength session
  and replace one Landing session that week; Pilates counts as core; yoga, tai chi and dance count as balance.
  Copy: "Your Thursday Pilates counts. We've moved your core work into it."

### 4.7 Safety copy

Red-flag lists for 999, 111 and GP (chest pain, severe breathlessness, fainting, stroke signs, cauda equina signs,
calf swelling, a hot swollen joint, hypos that don't resolve) are in [movement research §4.2](research/movement.md),
along with the draft safety footer and an "avoid this, say this" wording table. No biometric interpretation, no
glucose or blood pressure thresholds, no "rehab" or "prevents muscle loss" claims.

---

## 5. Food

### 5.1 What we aim for (and show)

- **Protein anchor at every meal:** "a palm-sized portion, about 25 to 30 g", plus a protein snack. Grams shown only
  outside safe mode. Targets based on a reference weight, not current weight, for people with a high BMI (clinical lead
  to confirm).
- **Fibre ramp:** about 5 g more each week until about 30 g, with fluids, because GLP-1 constipation is common.
- **No calorie targets at all.** Plate guide instead: half veg or salad, a quarter protein, a quarter starchy carbs.
- **Drinks and alcohol cards**, "ordering well" cards for takeaway nights, and a weekend-consistency nudge.

### 5.2 The Easy standard (every recipe passes all of these)

1. 15 minutes hands-on or less, 20 total (tiers: 5, 10, 15, 20 minutes). Batch recipes may take longer but make 4+
   portions.
2. 6 shopping ingredients or fewer, plus an assumed pantry (oil, salt, pepper, stock, a curry paste or soy sauce,
   dried herbs, garlic).
3. One pan, one tray (oven or air fryer), one bowl, or microwave only.
4. 3 items of washing up or fewer.
5. Protein at least 25 g for mains, 15 g for breakfasts, 10 g for snacks; at least one portion of veg in every main.
6. A budget tag at £2.50 a portion or less.
7. A store-cupboard version where it makes sense.
8. Says whether it keeps (fridge days) and freezes.
9. Timed honestly by someone cooking it, washing up included.

### 5.3 The meal library at launch (about 120 recipes)

| Slot | Count | Includes |
| --- | --- | --- |
| Breakfast | 20 | Yoghurt bowls, overnight oats, microwave eggs, beans and eggs, tofu scramble, on-the-go options |
| Lunch | 25 | Tuna and bean salad, wraps, grain pouch bowls, soup plus protein, jacket potatoes, no-cook boxes |
| Dinner | 40 | 12 fakeaways (chow mein, egg-fried rice, tikka traybake, chana masala, air-fryer fish and chips, wrap pizza, shawarma, smash burger, crunchy chicken, poke, Thai green curry, bagel), traybakes, 10-minute chilli, stir-fries, batch-and-freeze |
| Snacks | 20 | Egg pots, skyr, cottage cheese, edamame, chicken pieces, protein milk |
| Meal deals | 6 formulas | "Main with 20 g+ protein + protein snack + protein or zero drink", held as formulas, not products |

Collections cut across slots: no-cook, store-cupboard, batch and freeze, fakeaway, microwave only, one pan, 5
ingredients, budget, family, single portion, gentle on the stomach, and cultural collections (South Asian, Caribbean,
West African, Chinese, Middle Eastern, Eastern European). Starting lists are in [food research §3](research/food.md).

### 5.4 Swaps and dietary needs

Each recipe has slots (protein, carb base, veg, sauce or dairy, topping). Each slot has a default and tagged
substitutes, each carrying diet tags, the 14 FSA allergens plus "may contain", the protein change, the prep change and
the cost change. Examples: chicken (about 38 g) → firm tofu (about 20 g, top-up offered) → paneer → Quorn (contains
egg in most lines) → chickpeas (about 9 g, big drop); Greek yoghurt → soya high-protein yoghurt (fine) → coconut
yoghurt (almost no protein, warn).

| Need | What the app does |
| --- | --- |
| Vegetarian, vegan, pescatarian | Filters plus swaps; plant meals use double pulses or soya to reach 25 g; B12, iodine and calcium notes for vegans |
| Halal, kosher, Hindu vegetarian, Jain | Tag rules: no pork or alcohol; no meat with dairy and no shellfish; no egg; no root vegetables (onion and garlic swapped for asafoetida). "Check certification" for halal and kosher meat |
| Gluten-free, coeliac | Two tags: "gluten-free ingredients" and "coeliac-safe" (with cross-contamination guidance); tamari for soy sauce |
| Dairy-free, lactose intolerance | Lactose-free dairy keeps protein; soya is the only plant milk or yoghurt with comparable protein |
| Allergies (all 14 FSA allergens) | Hard filter on every ingredient, never "probably fine", always "check labels"; peanuts, tree nuts and sesame kept separate |
| Low FODMAP, IBS | A "gentler on the gut" tag only; no elimination programme; signpost GP or dietitian |
| Type 2 diabetes | Carb-aware tag with fist-sized portions; hypo-awareness copy for insulin or gliclazide; no medication advice |
| High blood pressure, cholesterol | Low-salt mode (reduced-salt stock and soy, flags over 1.5 g salt a portion); heart-friendly tag (oats, soya, beans, oily fish) |
| Kidney disease, pregnancy | Refer on, continue with a disclaimer checkbox (4.2.1); protein targets and top-ups switched off; pregnancy-safe food filter; low-salt mode for kidney disease |
| Reflux, food aversions after GLP-1 | Gentle tag and a dinner-timing nudge; a "foods I can't face right now" list, rechecked after 8 weeks |
| Budget, low skill, family, single person, microwave or kettle only, shift work | Cost per portion, skill level 0 to 3, build-your-own family formats, partial-pack planning, equipment filters, shift-anchored meal times |

### 5.5 The weekly planner

- **Plan 3 to 4 dinners, not 7.** Real weeks include leftovers, a takeaway and eating out; a planned takeaway night
  is part of the plan.
- **Ingredient overlap:** the planner prefers meals that reuse open packs (half a tin of beans, the rest of the
  coriander) and adds a "use it up" day.
- **Planned leftovers:** Tuesday's double chilli becomes Wednesday's jacket potato filling.
- **One-tap "swap this meal"** for something with similar effort and protein.
- **Hunger-aware timing:** the hungriest times from onboarding get a planned protein snack.
- **Pick next week, the week before** (built 6 October 2026): start from an empty week or from suggestions, choose
  each meal (a recipe, leftovers, a takeaway night or nothing), then get one shopping list for the week. Each
  ingredient is added up across the dishes that use it, and each dish's share is shown under the total.

### 5.6 Safe mode for food

No grams or calories, "protein-rich" ticks and hand portions instead; weight features hidden; no streaks; no "lighter
option" swaps (preferences and allergies only); regular-eating framing ("eat every 3 to 4 hours"); Beat helpline in
the menu. Turned on by the user at any time, by screening answers, or by under-18 or pregnancy flags. Turning it off
asks for confirmation and shows the Beat link. SCOFF misses about half of cases, so it is only one trigger.

### 5.7 Nutrition data

- **Generic foods:** CoFID 2021, the UK government dataset (licence to confirm; a CoFID API appeared in 2026).
- **Branded convenience items:** a curated table of about 150 UK products we rely on (pouches, yoghurts, wraps), read
  from pack labels and reviewed, or a paid UK database such as Nutritics.
- **Open Food Facts:** barcode lookup only, kept separate from our database to avoid its share-alike licence (legal
  advice needed).
- Nutrition shown as "approx." in whole grams, recalculated on every swap and serving change.

### 5.8 What's built (6 October 2026)

- **[`packages/content`](../packages/content/):** 70 draft recipes (14 breakfasts, 15 lunches, 30 dinners including 12
  fakeaways and 11 batch recipes, 11 snacks), about 120 ingredients and the swap lists. A check holds every recipe to
  the Easy standard. Nutrition values and costs are approximate and unverified, and every recipe is marked draft
  until the dietitian and the cook sign it off.
- **[`packages/engine`](../packages/engine/):** fits recipes to each person, sets the week's aims from the phase and
  goal, plans the week (5.5), swaps meals and builds the shopping list. It has tests.
- **The prototype:** two new onboarding steps (how you eat; your kitchen and your week) and a goal question. Also this
  week's meals, recipes with swaps explained, the recipe library, the shopping list, food preferences in Settings, and
  a "Tonight" card on Today. Drafts show a label.

Proposed while building, for the team to decide:

1. **The goal question offers "Hold steady", "Build strength" and "Feel fuller for longer".** There's no weight-loss
   goal, in line with "no goal weight" on the waitlist site. Safe mode always plans for holding steady.
2. **Tray bakes may run to 25 minutes in total** when 10 minutes or less is hands-on (six recipes). Otherwise they
   fail the 20-minute rule.
3. **Recipes can limit their swaps** when the method can't take one (4 above). Until the CMS has method variants for
   each swap, a swapped recipe shows "use the tofu where the method says eggs".
4. **The daily protein guide is 1.0 to 1.2 g/kg of a reference weight** (1.2 to 1.5 to build strength), or 90 to 120 g
   a day without one. The clinical lead to confirm.

---

## 6. Shopping and supermarkets

### 6.1 The big five at launch

Decided 5 October 2026: the five largest supermarkets by share, plus "Somewhere else" for everyone else.

| Supermarket | Share | One-tap basket now? | Launch hand-off |
| --- | --- | --- | --- |
| Tesco | 27.8% | No (private deals only; building its own planner) | Search links, shopping mode |
| Sainsbury's | ~15% | No (has partnered with Whisk and Cherrypick before) | Search links, shopping mode |
| Asda | 11.5% | No | Search links, shopping mode |
| Aldi | ~10.8% | No online shop (Deliveroo pilot in 8 stores) | List in Aldi aisle order, to print or share |
| Lidl | 8.7% | No online shop | List in Lidl aisle order, to print or share |
| Somewhere else | | | Plain list grouped by aisle type, to print, share or send to Apple Reminders |

Morrisons (8.4%) is a close sixth and the easiest to add later: Morrisons on Amazon takes a cart link today. Market
shares are Worldpanel, 12 weeks to September 2026, from press summaries; check them before using externally. Search
link formats must be tested on each site and in each supermarket's app before launch.

### 6.2 What the person sees

1. In settings: "Where do you usually shop?" (one main supermarket, optional second).
2. On a meal: **Add ingredients**. The ingredients go into Landing's weekly list, merged with the rest of the week,
   rounded to packs, with pantry items they already have left off.
3. On the list: **Shop at [supermarket]**. What happens depends on the supermarket:
   - **Tesco, Sainsbury's and Asda, at launch:** shopping mode. The list stays on screen and each item opens that
     supermarket's search (in its app if it supports the link, otherwise in a browser where the person is already
     signed in). They tick items off as they add them.
   - **Later, once a supermarket agrees a direct deal:** one tap fills the basket at that supermarket.
   - **Aldi, Lidl or somewhere else:** list grouped in aisle order, to print, share, or send to Apple Reminders.
4. A weekly cost shown as "about £X, estimate, checked [date]".
5. No affiliate tags, tracking links or sponsored products anywhere in the flow (decided 5 October 2026). The links go
   straight to the supermarket.

### 6.3 Phases

| Phase | When | What ships | Cost |
| --- | --- | --- | --- |
| **1. Launch, no partnerships** | Built alongside the meal planner, about 8 to 12 weeks of engineering | Ingredient taxonomy (about 1,500 to 3,000 ingredients, each with a search term for Tesco, Sainsbury's and Asda); merged list with pack rounding, pantry and leftovers; shopping mode; aisle maps for Aldi and Lidl; exports (share sheet, clipboard, Apple Reminders, printable by aisle); estimated cost from a simple price table refreshed monthly | Engineering time |
| **2. Direct deals** | 6 to 18 months, once there are tens of thousands of weekly planners | Approach Sainsbury's first (it has worked with recipe-to-basket partners before), then Tesco through dunnhumby, then Asda. Ask for a basket endpoint so one tap fills their basket. No third-party basket service in between (decided 5 October 2026). Any commercial terms are a later decision; for now the aim is ease for the user | Business development and legal review |

**We will not** store anyone's supermarket password or session, run automated browsers against supermarket sites, or
depend on scraped prices without a licence. That carries Computer Misuse Act, database right, GDPR and App Review
risk, and the supermarkets actively block it.

---

## 7. How we build it

### 7.1 Where things live in the repo

| Path | What |
| --- | --- |
| `packages/content` (started, 5.8) | Exercises, ladders, recipes, ingredients, swaps and aisle maps as data files (JSON), validated by a schema in CI. Edited through the CMS below, never by hand in production |
| Simple CMS (new, decided 5 October 2026) | A web editor for the physio, the dietitian and the cook from day one: forms per content type, a draft → in review → approved status with the reviewer's name and date, and a preview of the exercise loop or recipe card. Pick a git-backed CMS that saves to `packages/content` (Keystatic, Decap or Tina, chosen in weeks 1 to 2), so every change still gets schema checks, history and a pull request, and nobody needs to learn GitHub. Hosted behind sign-in, at `/admin` on the web app or as its own small app |
| `packages/motion` (built) | The exercise loops: figure, props, the 80 exercise animations, and renderers for SVG and React Native |
| `packages/engine` (started, 5.8) | Pure TypeScript with unit tests: session builder, progression rules, swap resolver, nutrition calculator, weekly planner, list aggregator and pack optimiser, supermarket hand-off links. Shared by the Expo app, the prototype and the web |
| `apps/web` API routes | Saving plans and lists, price table, supermarket search links, later the partner basket calls (keys stay on the server) |
| Database (Supabase, already named in the privacy screen) | User profiles, equipment profiles, comfort flags, diet profile, pattern levels, session logs, meal plans, shopping lists, household sharing |
| `apps/prototype` | Add the new screens with dummy data first, to agree flows before Expo |

### 7.2 Core data (simplified)

- **Exercise:** pattern, level, settings, equipment, position, impact, noise, joint loads, flags (floor, overhead,
  wrist, forward bending), balance demand, cues, media, easier, harder, alternatives.
- **Recipe:** slot, collections, servings, hands-on and total time, skill, equipment, washing-up count, slots with
  default and substitutes, steps per equipment, leftovers, cost, cultural tags, safe-mode copy.
- **Ingredient:** UK name and synonyms, CoFID code, nutrients per 100 g, cooked yield, allergens and may-contain, diet
  flags, aisle, storage, pack sizes, typical price with date, unit conversions, pantry staple flag, search term per
  supermarket.
- **Profiles:** settings and equipment profiles, comfort flags, safety answers, diet and allergies, dislikes and
  aversions, kitchen equipment, household size, budget, skill, supermarket, safe mode.

### 7.3 The coach

The coach (Claude) can only suggest exercises and swaps from the library and the vetted swap lists, never invent
them. Medication questions keep the prescriber redirect. Allergy answers always end with "check the label".

---

## 8. People and sign-off

| Who | For | When |
| --- | --- | --- |
| HCPC-registered physiotherapist | Exercise library, ladders, swap rules, screen wording, red flags, pain rules | Before content goes into the app; spot checks after |
| Registered dietitian (BDA) | Protein and fibre guidance, the Easy standard, swap tables, diet notes, kidney, diabetes and pregnancy handling | Same |
| Eating-disorder specialist, ideally via Beat | Safe mode, language rules, screening triggers | Before beta |
| Regulatory adviser | MHRA intended purpose, App Store and marketing wording (ASA/CAP), whether "after GLP-1" claims are borderline | Before the App Store listing is written |
| Tech lawyer | Terms and conditions, the health disclaimer and the continue checkbox (4.2.1), data licences (CoFID, Open Food Facts, price feeds), DMCC price display, GDPR for health data and consent records, later the supermarket contracts | Before launch |
| A real cook | Times every recipe, with washing up, at the stated tier | Before each recipe ships |

We write our own screening questions rather than licensing PAR-Q+ or SCOFF wording.

---

## 9. Roadmap

| Weeks | Milestone |
| --- | --- |
| 1 to 2 | Book the physio, dietitian, regulatory and legal reviews; write the content schemas; choose and set up the CMS |
| 3 to 8 | Content v1 in the CMS: 150 exercises (80 loops are done; add setting variants and warm-ups), 60 recipes with swaps, 1,500 ingredients; build `packages/engine` with tests; add the new flows, including the refer-on screen, to the prototype with dummy data for testing |
| 9 to 14 | Clinical review and fixes; Expo screens for sessions, meal plan, list and shopping mode; Supabase tables; exports and aisle maps; recipes to 120 |
| 15 to 18 | TestFlight beta with about 50 people across settings, diets and supermarkets; measure sessions done, meals planned, lists used, hand-off taps |
| After launch | More recipes and cultural collections; Ramadan mode; Morrisons as a sixth supermarket; first partnership conversations with Sainsbury's and Tesco |

---

## 10. Decisions made (5 October 2026)

1. **Pregnancy and kidney disease:** refer on, and let people continue only after ticking a disclaimer box that links
   to the terms and conditions. Adaptations stay on either way (4.2.1).
2. **Demo media:** illustrated loops in the brand's shapes, made in house. The first 80 are built (4.3).
3. **Supermarkets at launch:** the big five, Tesco, Sainsbury's, Asda, Aldi and Lidl, plus "Somewhere else" (6.1).
4. **Revenue from shopping:** none for now. No affiliate links and no sponsored matches; it is there for ease.
5. **Third-party basket services:** wait for direct deals with the supermarkets (6.3).
6. **Content tooling:** a simple CMS for the clinicians from the start, saving reviewed files to the repo (7.1).

---

## 11. Risks

| Risk | What we do |
| --- | --- |
| Hand-off feels clunky without one-tap baskets | Make shopping mode fast (big tick boxes, item order by aisle, remember the last product chosen); use hand-off numbers to make the case to supermarkets for direct deals |
| Someone continues past the refer-on screen and gets hurt | Adaptations stay on whatever they tick; clear referral copy; legal review of the terms; re-ask at every re-screen |
| Tesco builds the same thing into its app | Our edge is the whole 12 months (movement, habits, safe mode, every supermarket), not the basket |
| Content mistakes (allergens, unsafe exercise) | Schema validation, clinical sign-off, "check labels" everywhere, hard allergen filters |
| Drifting into medical device territory | Preferences not diagnoses, no biometric interpretation, wording table, regulatory review of store copy |
| Recipes that aren't really easy | The Easy standard, timed by a real cook, honest totals |
| Eating-disorder harm | Safe mode, no calorie targets, number-free copy, Beat review |
| Prices out of date | "Estimate, checked [date]" labels; the supermarket's own page is always the final price |

---

## 12. Still to verify

From the research briefs, before anything goes into in-app copy: exact NICE NG246 and QS212 wording; the ACSM 2026
set and rep text; whether any GLP-1-specific strength trial has reported (LEAN-PREP, PRIME); the CoFID and Open Food
Facts licences; current Worldpanel shares; Tesco, Sainsbury's and Asda search link formats and app link support; Aldi
and Lidl aisle layouts; which git-backed CMS suits clinicians best; the Beat helpline number; and verified protein and price values for the 150 core products. For the meal library: every ingredient's nutrition
against CoFID 2021 or the pack, every recipe's cost, and every recipe's timing by a real cook. Full lists are at the end
of each research brief.
