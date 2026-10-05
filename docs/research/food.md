# Landing: research on food, easy meals and dietary needs after stopping a GLP-1

*Research brief for the Landing iPhone app (UK). Compiled 5 October 2026. Every claim is cited inline. Where something is my estimate or a source is weak, it is marked **[uncertain]** or **[estimate]**. Some primary UK sites (nice.org.uk, yougov.com, the Quadram/CoFID site, Nesta's microsite) blocked direct fetching from this research environment. For those I relied on search-index extracts and secondary reporting, so the exact wording should be checked against the source before it goes into the app or clinical documentation.*

---

## 0. Executive summary (the 10 things that matter most)

1. **Weight regain after stopping is the expected outcome, not a personal failing.** In the STEP 1 extension, people regained about two-thirds of the weight they had lost on semaglutide within a year of stopping. In SURMOUNT-4, people switched to placebo regained about 14% of body weight over 52 weeks. A 2026 BMJ meta-analysis found average regain of about 0.4 kg a month, with a projected return to baseline in about 1.7 years. That is roughly four times faster than regain after behavioural programmes. Landing's tone should start from this fact ("this is biology, not willpower").
2. **NICE's quality standard (August 2025) says people should get at least 12 months of support after a weight-loss medicine or programme ends.** That support includes routines and an action plan for when weight starts to creep back. This matches Landing's 12-month scope closely.
3. **Protein:** aim for about **1.0–1.2 g/kg/day for adults (≥1.2 for older or active people)**, spread as **about 25–30 g per meal**. This combines the PROT-AGE recommendations, the 2025 US joint nutrition advisory (1.0–1.5 g/kg) and Paddon-Jones's work on per-meal distribution. **Fibre:** 30 g a day (SACN), against a UK adult average of about 18–20 g.
4. **Diet patterns with the best evidence for maintenance:** protein at each meal, high fibre, low energy density (veg, soups, pulses), mostly minimally processed food, few liquid calories, regular meals, and moderate alcohol (≤14 units a week). UK RCT data (UCL, *Nature Medicine* 2025) found a minimally processed Eatwell diet roughly doubled weight loss compared with an Eatwell-compliant ultra-processed diet.
5. **Keep muscle:** about 40% of weight lost on semaglutide in the STEP 1 DXA sub-study was lean mass. Protein plus resistance exercise is the main way to protect it. Exercise habits seem to protect against regain after GLP-1s stop.
6. **"Easy" has to beat the takeaway on effort.** Most Britons want to spend under 20 minutes on an evening meal. A typical takeaway order costs about £27, against roughly £1.80–£3 a portion for a home "fakeaway". Landing's default meal should take **≤15 minutes active time, use ≤6 "shopping" ingredients (plus pantry basics), need one pan/tray/bowl or a microwave, and deliver ≥25 g protein**.
7. **Chinese, Indian, fish and chips and pizza are the UK's favourite takeaways** (YouGov). Kebabs, burgers and fried chicken lead many local Just Eat charts. Each one has a quick high-protein fakeaway (section 2.4).
8. **Model each recipe as a base plus tagged swaps (a swap matrix)**, with protein recalculated for each swap. Some swaps cut protein sharply and should trigger a "protein top-up" prompt: coconut yoghurt for Greek yoghurt, chickpeas for chicken, almond milk for dairy milk.
9. **Eating-disorder safety:** Beat warns that numbers (calories, weights, amounts) can become targets. Safe mode should hide numbers and calorie and weight tracking, use plate-based and hand-portion language, and signpost Beat. A SCOFF-style screen is a reasonable trigger but misses many cases (sensitivity in one UK study was about 54%), so users must always be able to choose safe mode themselves.
10. **Data:** build on **CoFID 2021** (UK government dataset) for generic foods. Add **Open Food Facts** (ODbL: share-alike obligations) or a commercial UK database (for example Nutritics GB23) for branded items. Tag the **14 FSA allergens** on every ingredient. Never rely on recipe-level "free-from" claims without cross-contamination warnings.

---

## 1. Nutrition after stopping a GLP-1

### 1.1 What happens to weight and appetite

- **STEP 1 extension (semaglutide 2.4 mg):** mean loss was 17.3% at week 68. After both the drug and the lifestyle intervention stopped, participants regained 11.6 percentage points by week 120 (net loss 5.6%). That is about two-thirds of the weight lost, with cardiometabolic improvements also reverting. The authors conclude that obesity is chronic and that ongoing treatment is needed to keep the benefits ([Wilding et al., *Diabetes Obes Metab* 2022, PMC9542252](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9542252/)). Note that the lifestyle intervention stopped too. Landing would be adding the support that was removed in the trial.
- **SURMOUNT-4 (tirzepatide):** after a 36-week open-label lead-in, people randomised to continue tirzepatide lost a further 5.5%, while those switched to placebo regained 14.0% (about 15 kg) over 52 weeks ([ACC journal scan](https://www.acc.org/latest-in-cardiology/journal-scans/2025/12/09/16/51/surmount-4); [ACG EBGI summary](https://gi.org/journals-publications/ebgi/schoenfeld2_feb2024/)). In the placebo arm, 82% regained at least 25% of the weight they had lost. **About 17.5% (54 of 308) regained less than 25%**, and those people had minimal cardiometabolic worsening ([ACC](https://www.acc.org/latest-in-cardiology/journal-scans/2025/12/09/16/51/surmount-4)). That is a hopeful, honest message: some people do hold most of their loss.
- **BMJ systematic review and meta-analysis (Oxford, published January 2026):** 37 studies, 9,341 participants. Average regain after stopping was 0.4 kg a month, with a projected return to baseline weight by about 1.7 years and cardiometabolic markers back to baseline by about 1.4 years. Regain was 0.3 kg a month faster than after behavioural programmes, regardless of how much weight had been lost ([PubMed 41500720](https://pubmed.ncbi.nlm.nih.gov/41500720/); [BMJ Group press release](https://bmjgroup.com/stopping-weight-loss-drugs-linked-to-weight-regain-and-reversal-of-heart-health-markers/)).
- **Exercise appears protective.** In the Copenhagen S-LITE trial, adding exercise to liraglutide gave the most weight loss during treatment ([Lundgren et al., *NEJM* 2021, PubMed 33951361](https://pubmed.ncbi.nlm.nih.gov/33951361/)). In the one-year off-treatment follow-up, the exercise groups kept more of the benefit than liraglutide alone, which showed the most regain ([Region H research record](https://research.regionh.dk/da/publications/healthy-weight-loss-maintenance-with-exercise-glp-1-receptor-agon/); [PACE-CME summary](https://pace-cme.org/news/weight-loss-maintenance-in-obesity-more-effective-with-glp-1ra-and-exercise-than-either-treatment-alone/2455995)). **[uncertain: I have the follow-up details from secondary summaries only.]**
- **Appetite rebound:** GLP-1s slow gastric emptying and dampen appetite and food "noise". Once the drug washes out (semaglutide's half-life is about a week; the SmPC advises stopping two months before a planned pregnancy because of it ([Pharmaceutical Journal / MHRA](https://pharmaceutical-journal.com/article/news/mhra-urges-women-taking-weight-loss-drugs-urged-to-use-effective-contraception))), hunger signals return. Food preferences can also shift back. Surveys of users report aversions to very fatty (30%) and very sugary (29%) foods while on the drug ([Just Food summary of IFF research](https://www.just-food.com/newsletters/glp1-drugs-taste-perception/); [Scientific American](https://www.scientificamerican.com/article/why-ozempic-and-wegovy-might-change-your-favorite-food)). **Product implication:** the first 4–12 weeks after the last dose are the highest-risk window. Landing should ramp up meal structure and protein-forward "anchor meals" before hunger fully returns.

### 1.2 UK policy context (NICE)

- **NG246 Overweight and obesity management** (published 14 January 2025) says weight-management medicines are used alongside a reduced-calorie diet and increased activity ([NICE NG246 prescribing guide](https://www.nice.org.uk/guidance/ng246/resources/a-guide-for-prescribing-medicines-to-manage-overweight-and-obesity-15299628589/chapter/Medicine-options-for-weight-management-in-adults)). NICE has also published a summary of guidance for GLP-1 RAs and tirzepatide in adults ([NICE TA1152 resource](https://www.nice.org.uk/guidance/ta1152/resources/summary-of-nice-guidance-for-glp1-receptor-agonists-and-tirzepatide-in-adults-pdf-15721582861)). **[Direct NICE fetch was blocked; check the current recommendation numbers.]**
- **Stopping rules:** NHS semaglutide (TA875) is limited to a maximum of 2 years within specialist weight-management services. For both semaglutide and tirzepatide (TA1026), stopping should be considered if less than 5% of initial weight has been lost after 6 months ([NICE TA875 recommendations](https://www.nice.org.uk/guidance/ta875/chapter/1-Recommendations); [NHS medicines resources](https://www.medicinesresources.nhs.uk/semaglutide-for-managing-overweight-and-obesity-guidance-ta875.html); [GPnotebook on tirzepatide](https://gpnotebook.com/pages/diabetes-and-endocrinology/tirzepatide-for-weight-loss)). So many UK users will be **stopping because of a rule, not by choice**, and may feel anxious or resentful. The copy should acknowledge that.
- **Quality standard QS212 (updated 5 August 2025):** people should be offered support for **at least one year after** a weight-loss medicine or programme ends. That support includes regular feedback, help building new routines, and **an action plan to use if weight starts to return**, for example via NHS Better Health, a dietitian, or peer and walking groups ([NICE news](https://nice.org.uk/news/articles/people-need-support-to-keep-weight-off-after-treatment-ends); [Pharmaceutical Journal](https://pharmaceutical-journal.com/article/news/nice-recommends-ongoing-support-when-coming-off-weight-loss-medications); [QS212 statement 6, wraparound care](https://www.nice.org.uk/guidance/qs212/chapter/quality-statement-6-wraparound-care-alongside-medicines-for-weight-management)). **Landing can position itself explicitly as "the 12 months of support NICE says you should get"**, framed as wellness support alongside, not instead of, NHS or clinical care.

### 1.3 Dietary approaches with evidence for maintenance

| Lever | Evidence | What Landing should do |
|---|---|---|
| **Protein** | Higher-protein diets (about 25–30 g a meal, or 18–35% of energy) improve fullness and appetite control and help weight management ([Leidy et al., *AJCN* 2015, via Maastricht repository](https://cris.maastrichtuniversity.nl/en/publications/the-role-of-protein-in-weight-loss-and-maintenance/); [MU news](https://munewsarchives.missouri.edu/expert-comment/2015/0430-for-expert-comment-busy-americans-can-reap-health-benefits-by-balancing-protein-intake-throughout-the-day/index.html)) | A "protein anchor" in every meal and snack |
| **Fibre** | SACN set the adult reference at 30 g a day. UK adults average about 18 g, and only about 9% meet the target ([SACN *Carbohydrates and Health* 2015](https://assets.publishing.service.gov.uk/media/5a7f7cc3ed915d74e622ac2a/SACN_Carbohydrates_and_Health.pdf); [Food Navigator summary](https://foodnavigator.com/Market-Trends/SACN-report-Sugar-in-the-spotlight-but-more-opportunities-for-fibre)) | Tag each recipe with fibre. Aim for about 8–10 g a meal. Default to pulses, oats, wholegrain pouches and frozen veg |
| **Energy density / volume** | People tend to eat a fairly constant *weight* of food, so lowering energy density (water-rich veg, soups, fruit) reduces intake without smaller portions. In one study, eating soup first cut the next meal by 26% ([Penn State, Rolls](https://www.psu.edu/news/research/story/eat-water-lose-weight); [HealthDay](https://www.healthday.com/health-news/nutrition/cut-your-diet-s-energy-density-and-lose-weight-604461.html)) | "Bulk it up" tips (an extra handful of frozen veg) and soup starters. Frame it as *adding*, not cutting |
| **Ultra-processed food** | Hall et al. 2019 (inpatient RCT): an ultra-processed diet led to about 508 kcal a day more intake and 0.9 kg weight gain in 2 weeks ([NIH](https://www.nih.gov/news-events/news-releases/nih-study-finds-heavily-processed-foods-cause-overeating-weight-gain)). UCL 2025 (UK, 55 adults, 8-week crossover, both diets Eatwell-compliant): −2.06% weight on minimally processed food vs −1.05% on UPF ([UCL news](https://www.ucl.ac.uk/news/2025/aug/less-processed-diet-may-be-more-beneficial-weight-loss)) | Favour minimally processed *convenience* items (frozen veg, tinned pulses and fish, plain pouches). Never shame UPF, and accept that some ready-made items (for example a supermarket roast chicken) make healthy eating possible |
| **Liquid calories** | Calories from drinks are poorly compensated. In DiMeglio and Mattes, a sugary drink raised total intake and weight, while the same calories as solid food were offset ([Purdue](https://www.purdue.edu/uns/html4ever/1998/9812.Mattes.beverage.html); [BJN review](https://www.cambridge.org/core/journals/british-journal-of-nutrition/article/liquid-calories-energy-compensation-and-weight-what-we-know-and-what-we-still-need-to-learn/6670D5D4B6DEF2EA30DDCEC612A1D5F7)) | A "drinks" habit card: water, tea and coffee, no-added-sugar drinks; juice or smoothie ≤150 ml a day ([NHS Eatwell Guide](https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/)) |
| **Alcohol** | UK CMO low-risk guideline: no more than 14 units a week, spread over 3 or more days ([Northumbria NHS](https://northumbria.nhs.uk/our-services/your-health-and-wellbeing/alcohol)). Alcohol adds calories and loosens food choices | Eating-out and "night out" plans, no-and-low swaps, never moralising |
| **Meal regularity / structure** | In the National Weight Control Registry, 78% of long-term maintainers ate breakfast every day. They also ate consistently across weekdays and weekends, had about 5 eating occasions a day and weighed themselves weekly ([Wyatt et al. 2002, PubMed 11836452](https://pubmed.ncbi.nlm.nih.gov/11836452/); [Human Kinetics](https://us.humankinetics.com/blogs/excerpt/learning-from-the-national-weight-control-registry)). Observational, US data | "3 meals + 1–2 planned snacks" template, a weekend-consistency nudge, optional weekly weigh-in (off in safe mode) |
| **Eatwell Guide baseline** | Just over a third fruit and veg, just over a third starchy (preferably wholegrain) foods, 2 portions of fish a week (1 oily), 5 A DAY at 80 g a portion ([FSA Eatwell Guide PDF](https://www.food.gov.uk/sites/default/files/media/document/eatwell-guide-master-digital.pdf); [BNF](https://www.nutrition.org.uk/healthyliving/healthydiet)) | A plate model: ½ veg/salad, ¼ protein, ¼ starchy carbs (adapted from Eatwell's thirds to give protein more room; **[design choice, not an official UK plate]**) |

**Additional support for a combined approach:** a joint 2025 advisory from the American College of Lifestyle Medicine, American Society for Nutrition, Obesity Medicine Association and The Obesity Society sets eight priorities. These include nutrient-dense, minimally processed diets, preventing micronutrient deficiencies, and adequate protein with strength training. It notes that people who got structured nutrition support alongside GLP-1 therapy were more likely to keep weight off after stopping ([Obesity Society](https://obesity.org/nutritional-priorities-to-support-glp-1-therapy-for-obesity); [PubMed 40450457](https://pubmed.ncbi.nlm.nih.gov/40450457/)). This is US guidance, but it is the most specific consensus available.

**UK dietetic resource:** the BDA has produced *Medications for obesity: a guide to eating and living well*, hosted as a NICE NG246 resource. It covers protein, preserving muscle, micronutrients and long-term changes after stopping ([NICE-hosted BDA resource](https://www.nice.org.uk/guidance/ng246/resources/british-dietetic-association-medications-for-obesity-resource-15734840941); [BDA development note](https://www.bda.uk.com/resource/development-of-nutrition-resources-for-people-taking-medications-for-obesity.html); [BNF two-page summary](https://www.nutrition.org.uk/media/d13gxgrk/two-page-summary-weight-loss-medications_final.pdf)). Landing should line up its messaging with this resource and could link to it.

### 1.4 Protein targets

| Population | Target | Source |
|---|---|---|
| Healthy adults, general reference | 0.75 g/kg/day (UK RNI) **[from memory of COMA/DH 1991 DRVs; verify]** | UK DRVs |
| Adults >65 | **1.0–1.2 g/kg/day**; ≥1.2 if active; 1.2–1.5 with acute or chronic illness; **except** severe CKD (eGFR <30, not on dialysis) | [PROT-AGE, Bauer et al. 2013](https://researchexperts.utmb.edu/en/publications/evidence-based-recommendations-for-optimal-dietary-protein-intake/) |
| On or coming off GLP-1 (weight loss and maintenance) | **1.0–1.5 g/kg/day** (US joint advisory); a commonly cited dietetic range is 1.2–1.5 | [Joint advisory](https://obesity.org/nutritional-priorities-to-support-glp-1-therapy-for-obesity); [BDA/NICE resource search summary](https://www.nice.org.uk/guidance/ta875/resources/british-dietetic-association-medications-for-obesity-resource-pdf-20392353859525) |
| Per meal | **About 25–30 g** maximally stimulates muscle protein synthesis in young and older adults. Below about 20 g, the response is blunted in older people. Even distribution (30/30/30) gave 25% higher 24-hour synthesis than skewed intake (10/15/65) | [Paddon-Jones & Rasmussen, PMC2760315](https://pmc.ncbi.nlm.nih.gov/articles/PMC2760315/); [Whole Foods Magazine summary of Mamerow 2014](https://www.wholefoodsmagazine.com/articles/7703-balanced-protein-servings-increases-muscle-synthesis) |

**Practical rule for the app:** use **reference body weight, not current weight**, for people with a high BMI. Using actual weight over-estimates protein needs. A common clinical approach is to use an adjusted body weight or a weight equal to BMI 25 **[clinical convention; not found in a UK guideline in this research, so flag for the clinical lead]**. Simpler still, and safer for a wellness app: **"aim for a palm-sized portion of protein (about 25–30 g) at each meal, plus a protein snack"**, which comes to about 90–120 g a day for most adults. Show grams only outside safe mode.

### 1.5 Muscle, hydration, constipation and nutrient gaps

- **Muscle:** in the STEP 1 DXA sub-study, about 39–40% of weight lost was lean mass. Lean mass includes water, glycogen and organ tissue, so true muscle loss is smaller ([Acibadem summary](https://acibademinternational.com/blog/muscle-loss-on-glp-1-medicines-how-much-is-lean-mass-and-how-to-protect-it/)). **[secondary source; the original is Wilding et al. *NEJM* 2021 supplementary DXA data]**. Resistance training 2–3 times a week roughly halves lean loss during energy restriction (same source). Landing should pair protein with simple strength "moves" (sit-to-stand, wall press-ups, carrying shopping), framed as wellness, not exercise prescription.
- **Hydration:** 6–8 cups or glasses of fluid a day, with water, lower-fat milk, tea and coffee all counting. Aim for pale-yellow urine and drink more in heat or when active ([NHS Eatwell Guide](https://www.nhs.uk/live-well/eat-well/the-eatwell-guide/); [BCUHB NHS Wales](https://bcuhb.nhs.wales/health-advice/preparing-for-treatment/prehab-and-diet/eatwell-guide/fluids)).
- **Constipation:** common on GLP-1s and often lingers. NHS self-help advice is to increase fibre *gradually* with plenty of fluid and activity, because a sudden increase causes bloating ([South West London ICB self-care](https://swlimo.southwestlondon.icb.nhs.uk/wp-content/uploads/2021/06/Self-care-briefing-Infrequent-Constipation-V1-November-2018.pdf); [UHCW dietetics](https://www.uhcw.nhs.uk/download/clientfiles/files/Patient%20Information%20Leaflets/Clinical%20Support%20Services/Dietetics/Constipation.pdf)). UK GLP-1 provider advice also suggests starting lower and building up slowly ([Medicspot](https://www.medicspot.co.uk/weight-loss/nutrition/fibre-on-glp1)). **Product:** a "fibre ramp" setting that adds about 5 g a week until 30 g is reached.
- **Micronutrients:** reviews report that GLP-1 users are prone to shortfalls in **vitamin D, iron and B vitamins (including B12)**, as well as protein, fibre and potassium, because they eat less, have GI side effects, and possibly absorb some nutrients less well (a 2025 pilot study suggested semaglutide reduced iron absorption) ([Harvard Health](https://content.health.harvard.edu/blog/study-taking-glp-1-drugs-may-increase-risk-of-key-nutrient-deficiencies); [ACSH](https://www.acsh.org/news/2026/01/15/six-nutrients-watch-when-glp-1s-mean-smaller-meals-49918)). **[Evidence is early and mostly observational.]** Practical UK points:
  - **Vitamin D:** UK government advice is for everyone to consider 10 µg a day in autumn and winter **[standard PHE/SACN advice; not re-fetched here]**.
  - **B12:** a risk for vegans (fortified foods or a supplement are the only reliable sources) ([NHS vegan diet](https://www.nhs.uk/live-well/eat-well/how-to-eat-a-balanced-diet/the-vegan-diet/)) and for metformin users **[known metformin–B12 interaction per BNF; verify]**.
  - **Iron:** women of reproductive age, plant-based eaters, and anyone eating little red meat. Pair plant iron with vitamin C.
  - Landing should **not** recommend specific supplements or doses beyond public-health advice. It should prompt "talk to your GP or pharmacist if you're feeling unusually tired", which fits the general wellness positioning.

### 1.6 A safe, non-restrictive approach (guardrails)

- **No calorie targets below a safe floor.** The NHS 12-week plan uses 1,900 kcal a day for men and 1,400 for women as weight-*loss* allowances ([NHS plan via HealthUnlocked/NHS](https://healthunlocked.com/nhsweightloss/posts/135389374/help-with-interpreting-the-bmi-calorie-intake-range)). Diets of ≤800 kcal a day (VLCDs) are a clinical intervention only and are not routinely offered ([NIHR evidence](https://evidence.nihr.ac.uk/alert/a-total-diet-replacement-programme-helped-obese-people-lose-weight-and-keep-weight-off/)). Landing is about **maintenance**, so if it shows energy at all, it should never show a target below about 1,400 kcal (women) or 1,900 kcal (men). Better still, it should avoid personal calorie targets entirely and use plate and portion guidance.
- **Additive framing:** "add a protein, add a veg, add water" rather than "cut out".
- **No "good/bad", "cheat", "clean", "junk", "sin", "guilt-free", "earn it/burn it"** language. Use neutral words: "everyday foods", "sometimes foods", "foods you enjoy".
- **Flexibility:** an 80/20 or "most meals" framing, and planned enjoyment (a takeaway night is part of the plan).

---

## 2. Designing meals that are actually easier than a takeaway

### 2.1 What we're competing with

- **Frequency and cost:** UK adults order a takeaway about twice a month on average, but **21% order 3–4 times a week**. The average order is about **£27**. Gen Z spend about £78 a month and Millennials about £66 ([Aqua consumer survey](https://www.aquacard.co.uk/building-better-credit/cost-of-a-friday-night)). **[Commercial survey, so the method is unverified.]**
- **Household spending:** restaurants and hotels (which includes takeaways) are 7% of UK household spending, still below the 9% seen before the pandemic ([ONS Family Spending FYE 2024](https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/expenditure/bulletins/familyspendingintheuk/april2023tomarch2024)). Cost-of-living pressure is real, and 59% say they now order less often ([Aqua](https://www.aquacard.co.uk/building-better-credit/cost-of-a-friday-night)).
- **What's ordered:** Britain's favourite takeaway is Chinese (25%), then Indian (17%), fish and chips (16%), pizza (12%), with Thai and kebabs at 3% each and chicken and burgers at 2%. Under-25s favour pizza and over-65s favour fish and chips ([YouGov](https://business.yougov.com/content/34032-what-britains-favourite-takeaway)). In Just Eat's town-level reports, kebabs (especially chicken kebab) and sweet and sour chicken often top the charts ([Slough Observer / Just Eat](https://www.sloughobserver.co.uk/news/17591795.slough-residents-love-a-kebab-takeaway-new-report-from-just-eat-finds/); [Oxford Times](https://www.oxfordtimes.co.uk/news/17575120.just-eat-reveals-oxfords-top-10-takeaway-dishes/)) **[these local reports date from about 2019]**. Deliveroo's 2025 UK top items were dominated by bagels, burger meal deals and sandwiches ([Restaurant Online](https://www.restaurantonline.co.uk/Article/2025/11/04/deliveroo-reveals-most-popular-delivery-items-of-2025)). In other words, "handheld" food (bagels, wraps, burgers) is a big category too.
- **Energy and portions:** Nesta lab-tested 600 meals from independent takeaways. A "regular/medium" pepperoni pizza ranged from **600 to 2,300 kcal** ([Nesta project page](https://nesta.org.uk/project/testing-the-calories-of-the-uks-favourite-takeaway-foods)). In Liverpool, three-quarters of the takeaway meals studied exceeded 1,125 kcal ([MRC Epidemiology briefing](https://www.mrc-epid.cam.ac.uk/wp-content/uploads/2023/08/Health_Committee_Childhood_Obesity_April18_Takeaways_child_obesity.pdf)). In NDNS data, adults who ate takeaway meals at home at least weekly took in 63–87 kcal a day more than those who rarely did ([Goffe et al. 2017, PMC5610411](https://pmc.ncbi.nlm.nih.gov/articles/PMC5610411)). **Landing must never call takeaways "bad".** The message is "here's a quicker, cheaper, higher-protein version, and here's how to order well when you do get one".

### 2.2 Time, skill and confidence

- The majority of Brits want to spend under 20 minutes preparing an evening meal. A third say 20 minutes is all they can spare, and 22% spend 15 minutes or less ([Housewares Live](https://housewareslive.net/dinner-dash-a-quarter-of-brits-serve-supper-in-15-minutes/); [Häfele survey](https://www.hafele.co.uk/en/info/about-haefele/latest-news/kitchen-personalities/39612/)).
- Only about one in three Britons feel very confident cooking from scratch without a recipe ([YouGov headline](https://yougov.com/en-gb/articles/43386-how-confident-are-britons-kitchen)). About one in five cite lack of cooking knowledge as a barrier, and 54% don't enjoy cooking ([Grimsby Telegraph survey report](https://www.grimsbytelegraph.co.uk/whats-on/food-drink/brits-lack-basic-cooking-skills-4685351)). **[Commercial polls; treat the numbers as indicative.]**
- Meal-kit benchmarks: SimplyCook promises **20 minutes** using its kit plus **4–6 of your own ingredients** ([SimplyCook](https://www.simplycook.com/landing)). Gousto's "10-minute meals" took reviewers about 30 minutes, and reviewers also complained about packaging ([Expert Reviews](https://www.expertreviews.co.uk/home-garden/gousto-recipe-box-review)). **Lesson: stated times must be honest and include prep and washing up, or trust erodes.**

### 2.3 "Easy meal" design rules (proposed Landing standard)

A Landing "Easy" meal must meet **all** of these:

1. **Time:** ≤15 minutes hands-on and ≤20 minutes total (labelled tiers: **5-min / 10-min / 15-min / 20-min**; batch recipes may take longer but must give ≥4 portions).
2. **Ingredients:** ≤6 "shopping" ingredients, plus an assumed pantry (oil spray, salt, pepper, a stock cube, a jar of curry paste or soy sauce, dried herbs, garlic granules or lazy garlic).
3. **Equipment:** one of: one pan, one tray (oven or air fryer), one bowl (no-cook), or microwave only. A **"no hob/no oven" filter** is essential for students, shift workers, and people in hostels or bedsits.
4. **Washing up:** ≤3 items.
5. **Protein:** ≥25 g a portion for mains, ≥15 g for breakfasts, ≥10 g for snacks.
6. **Fibre and veg:** ≥1 portion of veg (80 g) in every main. Use frozen veg wherever possible because it's cheap, pre-chopped and doesn't go to waste.
7. **Cost:** a target of **≤£2.50 a portion** for "budget" tags **[estimate based on 2025–26 supermarket prices]**.
8. **Shelf-stable fallback:** every recipe has a "store-cupboard version" (for example, fresh chicken becomes tinned chicken, tinned tuna or chickpeas).
9. **Leftovers:** state whether it keeps for 2–3 days in the fridge and whether it freezes.

**UK convenience building blocks (all widely available):** frozen mixed veg, stir-fry mix, spinach and peppers; microwave rice, grain and lentil pouches; tinned chickpeas, beans, lentils, tuna, salmon, mackerel and sardines; supermarket roast or rotisserie chicken and cooked chicken pieces; pre-cooked puy lentils; Greek-style yoghurt, skyr and cottage cheese; eggs and egg pots; wholemeal and high-protein wraps; frozen prawns, fish fillets and edamame; Quorn and tofu; jarred curry pastes, pesto and salsa; bagged salad; pre-chopped onion (frozen); "lazy" garlic and ginger.

### 2.4 Fakeaway versions of the UK's favourite takeaways

*Protein figures are **estimates** from typical UK pack labels and CoFID-type values. They must be recalculated in the recipe engine. Costs are **estimates** at 2025–26 prices.*

| Takeaway | Landing fakeaway | Time | Method | Protein / portion | Est. cost |
|---|---|---|---|---|---|
| **Chinese:** sweet & sour chicken / chicken chow mein | Chicken & veg "chow mein": straight-to-wok noodles (half a pack), 125 g chicken strips, frozen stir-fry veg, soy sauce + a dash of sweet chilli | 12 min | 1 wok | ~35 g | ~£2.50 |
| **Chinese:** egg fried rice | Egg-fried rice: microwave rice pouch, 2 eggs, frozen peas, edamame, spring onion, soy sauce | 8 min | 1 pan | ~25 g | ~£1.60 |
| **Indian:** chicken tikka masala / korma | Chicken tikka traybake: chicken thigh + tikka paste + Greek yoghurt; serve with microwave rice and spinach | 20 min (5 hands-on) | 1 tray / air fryer | ~38 g | ~£2.40 |
| **Indian:** chana masala / dhal | 10-minute chickpea & spinach curry: tinned chickpeas, jarred curry paste, chopped tomatoes, frozen spinach, a dollop of Greek yoghurt or soya yoghurt | 10 min | 1 pan | ~16 g (add paneer or tofu to reach ~28 g) | ~£1.20 |
| **Fish & chips** | Air-fryer fish & chips: frozen white fish fillet (breaded or plain), oven chips or potato wedges, microwave mushy peas | 20 min | air fryer / oven | ~28 g | ~£2.20 |
| **Pizza** | Wrap pizza: wholemeal wrap, passata, mozzarella (light), cooked chicken or tuna, peppers; 6–8 min in oven or air fryer | 10 min | tray | ~30 g | ~£1.80 |
| **Kebab** | Chicken shawarma wrap: cooked chicken pieces or thigh + shawarma spice, wrap, salad, Greek yoghurt + garlic "sauce", chilli sauce | 10 min | 1 pan or no-cook | ~35 g | ~£2.30 |
| **Burger** | Smash-style burger: 5% beef or turkey mince patty, wholemeal bun, light cheese slice, salad; side salad or frozen veg | 12 min | 1 pan | ~35 g | ~£2.50 |
| **Fried chicken** | "Crunchy" chicken: chicken breast dipped in yoghurt then crushed cornflakes + paprika, air-fried; corn on the cob | 20 min | air fryer | ~38 g | ~£2.20 |
| **Sushi / poke** | Salmon poke bowl: microwave rice, smoked salmon or tinned salmon, edamame, cucumber, soy-sesame dressing | 7 min | no-cook / microwave | ~30 g | ~£3.00 |
| **Thai** green curry | Prawn green curry: frozen king prawns, Thai green paste, light coconut milk (half a tin), frozen veg, microwave rice | 12 min | 1 pan | ~25 g | ~£2.80 |
| **Bagel / sandwich** (Deliveroo #1 type) | Smoked salmon & cottage cheese bagel with cucumber | 3 min | no-cook | ~28 g | ~£2.20 |

**Cost evidence:** Finder estimated (2022) the average UK takeaway at about £7.93 a portion against about £1.78 for an air-fryer fakeaway, and a takeaway chicken tikka masala costing up to 333% more than home-cooked ([Finder press release](https://www.finder.com/uk/press-release-just-eat-at-home-a-takeaway-in-the-uk-costs-over-3-times-more-than-a-fakeaway)). A 4-portion home ruby curry cost about £9.03, or about £2.26 a portion ([University of Bath ResLife](https://reslife.bath.ac.uk/story/25777518/favourite-fakeaways-7-chicken-ruby-curry)). **[2022 prices; uprate by about 20–25% for food inflation since then, estimate.]**

**"Ordering well" cards** (for when people do get a takeaway, which is part of real life): choose a tandoori or tikka dish over a creamy one; get boiled rice instead of fried; share a side; order a kebab as a wrap or shish with salad; go for thin-crust pizza with a side salad; ask for chips "regular, not large" or share them. Liverpool and Newcastle work shows smaller-portion boxes (for example "Lite-BITE" at about 600 kcal) are acceptable to customers ([Newcastle University press office](https://www.ncl.ac.uk/press/articles/archive/2019/02/makingtakeawayshealthier)).

---

## 3. Meal library structure

### 3.1 Taxonomy

Primary **meal slot**: Breakfast · Lunch · Dinner · Snack.
Cross-cutting **collections** (tags, so a meal can belong to several): No-cook · Store-cupboard · Batch & freeze · On the go / meal-deal hacks · Fakeaway · Microwave-only · One-pan/one-tray · 5-ingredient · Budget (≤£1.50) · Family-friendly · Single portion · Gentle on the stomach (low fat, small portions, for nausea or reflux).

*All protein values below are **estimates** per portion from typical UK product labels and CoFID-style values (for example, eggs about 6.5 g each, 0% Greek yoghurt about 10 g/100 g, cooked chicken breast about 30 g/100 g, drained tuna about 25 g/100 g, cottage cheese about 9–11 g/100 g, tinned chickpeas about 7 g/100 g). They must be recalculated from the data source chosen in section 7.*

### 3.2 Breakfast (target ≥20–30 g protein)

| # | Meal | Protein | Prep |
|---|---|---|---|
| 1 | Greek yoghurt bowl: 200 g 0% Greek yoghurt + frozen berries + 30 g oats + 1 tbsp seeds | ~27 g | 2 min |
| 2 | Overnight oats: 40 g oats + 150 g skyr + 100 ml milk + grated apple (make 3 at once) | ~25 g | 3 min |
| 3 | Microwave scrambled eggs (3 eggs) on 1 slice wholemeal toast + spinach | ~25 g | 4 min |
| 4 | Cottage cheese & smoked salmon on rye crispbreads + cucumber | ~25 g | 3 min |
| 5 | Baked beans (half a tin) + 2 eggs on 1 slice toast | ~26 g | 6 min |
| 6 | Breakfast wrap: 2 eggs + 2 lean bacon medallions + salsa in a wholemeal wrap | ~30 g | 8 min |
| 7 | Protein porridge: 40 g oats cooked in 250 ml milk, stirred with 100 g skyr | ~25 g | 4 min (microwave) |
| 8 | Peanut butter (1 tbsp) & banana on toast + a 200 g high-protein yoghurt pot | ~28 g | 3 min |
| 9 | Tofu scramble (150 g firm tofu, turmeric, frozen peppers) on toast (vegan) | ~24 g | 8 min |
| 10 | Egg muffins batch (6 eggs + cooked veg + feta; 2 per portion) | ~18 g (add yoghurt to reach ~28 g) | 20 min batch, 1 min reheat |
| 11 | Ready-to-drink protein milk/shake + a piece of fruit (on the go) | ~20–25 g | 0 min |
| 12 | Kippers or tinned mackerel on toast with tomatoes | ~25 g | 5 min |

### 3.3 Lunch (target ≥25–30 g)

| # | Meal | Protein | Prep |
|---|---|---|---|
| 1 | Tuna & bean salad: tinned tuna, half a tin of cannellini beans, red onion, bagged leaves, lemon | ~35 g | 5 min |
| 2 | Chicken & hummus wrap with salad (leftover or ready-cooked chicken) | ~33 g | 4 min |
| 3 | Microwave lentil & feta grain bowl: pouch of lentils/quinoa + feta + roasted peppers from a jar | ~25 g | 3 min |
| 4 | Egg & cress pitta (3 eggs) + cherry tomatoes | ~24 g | 10 min |
| 5 | Prawn & avocado rice bowl (microwave rice, cooked prawns, sweetcorn, sweet chilli) | ~25 g | 5 min |
| 6 | Soup + protein: carton fresh lentil soup + a cottage cheese or ham sandwich | ~28 g | 4 min |
| 7 | Smoked mackerel, beetroot & new potato salad (pouch potatoes) | ~25 g | 5 min |
| 8 | Leftover chilli-filled jacket potato (microwave) | ~30 g | 8 min |
| 9 | Chickpea "tuna" mayo sandwich (mashed chickpeas, light mayo, yoghurt) + soya yoghurt pot (vegan) | ~20 g **(low; top-up prompt)** | 5 min |
| 10 | Halloumi & roasted veg couscous (couscous needs a kettle only) | ~25 g | 10 min |
| 11 | Turkey, cheese & salad bagel | ~30 g | 3 min |
| 12 | Edamame, salmon & noodle salad (straight-to-wok noodles eaten cold) | ~30 g | 5 min |

### 3.4 Dinner (target ≥30 g)

| # | Meal | Protein | Prep |
|---|---|---|---|
| 1 | Chicken tikka traybake with rice & spinach (fakeaway) | ~38 g | 20 min |
| 2 | Salmon, frozen green veg & pesto traybake + microwave new potatoes | ~30 g | 18 min |
| 3 | 10-minute beef or turkey chilli (5% mince, tinned beans, chopped tomatoes, chilli powder) + rice | ~35 g | 15 min |
| 4 | Egg-fried rice with prawns and edamame | ~30 g | 10 min |
| 5 | Quorn or chicken fajita tray + wraps + yoghurt | ~30 g | 15 min |
| 6 | Gnocchi traybake with sausages (chicken or veggie) and peppers | ~25 g | 20 min |
| 7 | Cod in tomato & olive sauce (frozen fillets) + couscous | ~32 g | 15 min |
| 8 | Paneer & pea curry (jar paste, frozen peas, tinned tomatoes) + rice | ~28 g | 15 min |
| 9 | Pork or tofu stir-fry with frozen veg + noodles | ~32 g | 12 min |
| 10 | Chicken & chorizo one-pot rice (microwave rice stirred through at the end) | ~35 g | 15 min |
| 11 | Wrap pizza with chicken or tuna (fakeaway) | ~30 g | 10 min |
| 12 | Lentil bolognese (tinned or pouch lentils + 5% mince 50:50) with wholewheat pasta | ~32 g | 15 min |

### 3.5 Snacks (target ≥10–15 g)

| # | Snack | Protein |
|---|---|---|
| 1 | Egg protein pot (2 eggs + spinach) | ~13 g |
| 2 | 150 g skyr or high-protein yoghurt | ~15–20 g |
| 3 | 2 boiled eggs | ~13 g |
| 4 | Cottage cheese (150 g) + cherry tomatoes / crackers | ~15 g |
| 5 | Cooked chicken pieces (75 g pack) | ~20 g |
| 6 | Edamame (100 g, microwaved from frozen) with chilli salt | ~11 g |
| 7 | Roasted chickpeas (40 g) + an apple | ~7 g **(top-up)** |
| 8 | Lean beef jerky (25 g) | ~12 g |
| 9 | Protein milk drink (250–330 ml) | ~20–25 g |
| 10 | Light cheese + oatcakes + grapes | ~10 g |
| 11 | Tinned tuna/sweetcorn pot | ~20 g |
| 12 | Hummus (60 g) + carrot sticks + 1 tbsp seeds | ~7 g **(top-up)** |

### 3.6 No-cook (≥25 g)

Tuna & bean salad; smoked salmon bagel; chicken shawarma wrap using ready-cooked chicken; Greek yoghurt bowl; cottage cheese & ham crispbread plate; poke bowl with tinned salmon and cold noodles; mackerel & beetroot salad; chickpea, feta & cucumber "Greek" salad with extra tinned chickpeas and lentils; prawn cocktail lettuce cups with a wholemeal roll; tofu & peanut slaw with ready-marinated tofu pieces (vegan); "picnic plate" (cooked chicken, egg, cheese, crudités, hummus); overnight oats.

### 3.7 Store-cupboard (no fresh ingredients)

Tuna pasta (tinned tuna, sweetcorn, passata); chickpea & spinach curry (frozen spinach); bean chilli with rice pouch; sardines on toast; lentil soup made from tinned lentils and tomatoes; baked beans & egg; mackerel & rice "kedgeree" with frozen peas; peanut noodles with frozen edamame; tinned salmon fishcakes using instant mash; corned beef hash (lean, occasional); "dhal" from a red lentil packet (15 min); tinned chicken in white sauce with frozen veg on a jacket potato. **Note:** tinned foods can be high in salt. Prefer "no added salt" options and rinse pulses ([NHS salt](https://www.nhs.uk/live-well/eat-well/food-types/salt-nutrition/)).

### 3.8 Batch & freeze (≥4 portions, ≤30 min active)

Chicken & bean chilli; turkey or lentil bolognese; chickpea & sweet potato curry; chicken tikka traybake (double batch); egg muffins; black bean & beef burritos (wrap and freeze); Moroccan chicken & chickpea stew; red lentil & spinach dhal; turkey meatballs in tomato sauce; overnight oats ×5 (fridge, 3–4 days); fish pie with instant-mash topping; vegetable & bean soup with added red lentils for protein.

### 3.9 On the go / meal-deal hacks (target ≥25–30 g)

UK supermarket meal deals now commonly cost £3.60–£4 at Tesco with Clubcard ([Yorkshire Evening Post](https://www.yorkshireeveningpost.co.uk/lifestyle/food-and-drink/tesco-unveils-popular-meal-deal-choice-of-2024-4937423)) or £3.95 at Sainsbury's ([Sainsbury's corporate](https://corporate.sainsburys.co.uk/news/press-releases/sainsbury-s-launches-all-new-high-protein-range-and-small-but-mighty-meals-to-support-customers-nutritional-goal/)). Tesco's best-selling meal-deal snack has been the **Egg Protein Pot** ([Grocery Gazette](https://www.grocerygazette.co.uk/2025/01/06/tesco-meal-deal-combo/)). Sainsbury's high-protein meal-deal wraps and salads each have **>21 g protein**, and its new high-protein ready meals have **≥31 g at <500 kcal** ([Sainsbury's](https://corporate.sainsburys.co.uk/news/press-releases/sainsbury-s-launches-all-new-high-protein-range-and-small-but-mighty-meals-to-support-customers-nutritional-goal/); [Grocery Gazette](https://www.grocerygazette.co.uk/2026/02/02/sainsburys-rolls-out-high-protein-meal-range/)).

**Meal-deal formula: "Main with ≥20 g + protein snack + protein or zero drink."**

| Combo (example; products change, so the app should hold this as a *formula*, not SKUs) | Est. protein |
|---|---|
| Chicken & bacon / chicken club sandwich + egg protein pot + water or diet drink | ~35–40 g |
| High-protein chicken wrap (>21 g) + cooked chicken bites/pot + sparkling water | ~40 g |
| Tuna sweetcorn sandwich + protein yoghurt / skyr + water | ~35 g |
| Chicken & grain salad + egg pot + protein milk drink (as the "drink") | ~50 g |
| Halloumi or falafel wrap (veggie) + edamame pot + protein milk | ~30–35 g |
| Sushi box (salmon/prawn) + edamame + water (pescatarian, lower protein) | ~20–25 g **(top-up)** |
| Boots/Co-op: Chicken Caesar wrap + protein bar + water | ~30–35 g |

**[All figures are estimates. Ranges vary by product; the in-app scanner or data source should supply exact values.]** Hack tips: swap crisps for an egg pot, cooked chicken, cheese or edamame; swap a sugary drink for a protein milk drink or water; choose "high protein"-flagged mains.

---

## 4. Dietary requirements and tweaks

### 4.1 The swap matrix approach

Each recipe has **slots** (protein, carb base, veg, sauce or dairy, topping). Each slot holds a default ingredient plus tagged substitutes. Each substitute carries:
- `diet_tags` (vegan, vegetarian, pescatarian, halal-able, kosher-able, Jain-ok, no-egg, gluten-free, dairy-free, nut-free, low-FODMAP-ok, etc.)
- `allergens` (14 FSA flags + "may contain")
- `protein_per_portion` delta, recalculated
- `prep_impact` (time and method change, for example "tofu: press 5 min or buy pre-pressed")
- `cost_delta`

**Example: protein slot swaps for 1 portion (approx. protein, estimates):**

| Default → swap | Protein | Notes |
|---|---|---|
| Chicken breast 125 g (cooked) | ~38 g | baseline |
| → Turkey breast 125 g | ~37 g | halal/kosher if certified |
| → Firm tofu 150 g | ~18–22 g | **−16 g → add edamame or a soya yoghurt side** |
| → Tempeh 100 g | ~19–20 g | |
| → Paneer 100 g | ~18–20 g | high saturated fat; vegetarian, not vegan |
| → Quorn pieces 100 g | ~14 g | contains egg (most lines) and milk in some; vegan range exists; mycoprotein can cause reactions **[check pack]** |
| → Seitan 100 g | ~20–25 g | **wheat gluten, not suitable for coeliac** |
| → Chickpeas 120 g (½ tin drained) | ~8–9 g | **big drop → combine with Greek or soya yoghurt, or double to a full tin (~17 g)** |
| → Red lentils (dry 60 g) | ~14 g | |
| → Eggs ×3 | ~19–20 g | not for egg-free Hindu vegetarians or egg allergy |
| → Prawns 150 g | ~25 g | crustacean allergen; not kosher |
| → Tinned tuna 1 tin drained | ~25 g | |

**Dairy slot swaps:** 0% Greek yoghurt 150 g (~15 g) → skyr (~16 g) → **soya "Greek-style"/high-protein soya yoghurt** (~6–10 g, **[varies by brand]**) → **coconut yoghurt (~1 g, warn: almost no protein)** → oat yoghurt (~1–3 g, warn). Dairy milk 200 ml (~7 g) → soya (~6–7 g, fine) → oat or almond (~0.5–2 g, **warn**). Lactose-free dairy has the same protein as dairy.

**Carb slot:** wheat wrap → GF wrap (often lower in protein and fibre) → corn tortilla (GF; check the label for cross-contamination) → lettuce wrap. Pasta → GF pasta, or red lentil or chickpea pasta (higher protein, about 20–25 g/100 g dry, and GF).

**App logic:** if a swap drops a meal below 20 g protein, show a single friendly prompt: *"Swap made. Want a protein top-up? Add a yoghurt pot or a handful of edamame."* Never block the swap.

### 4.2 Requirement-by-requirement notes

**Vegetarian / vegan / pescatarian**
- Watch vitamin B12 (fortified foods or a supplement are the only reliable vegan sources), iodine, calcium (fortified plant milks, calcium-set tofu, tahini), iron, vitamin D, selenium and omega-3 (linseed, walnuts, chia or algae oil) ([NHS vegan diet](https://www.nhs.uk/live-well/eat-well/how-to-eat-a-balanced-diet/the-vegan-diet/)). Organic plant milks are usually *not* fortified **[general dietetic knowledge]**.
- Protein density is lower, so plant meals need **double portions of pulses** or soya-based proteins (tofu, tempeh, edamame, soya mince, soya yoghurt) to reach 25 g.
- Pescatarian: 2 fish portions a week, one oily ([Eatwell](https://www.food.gov.uk/sites/default/files/media/document/eatwell-guide-master-digital.pdf)).

**Halal**
- No pork or pork derivatives (gelatine, some E-numbers, lard) and no alcohol (including cooking wine and some flavourings). Meat must be halal-slaughtered ([Huddersfield halal/kosher study](https://pure.hud.ac.uk/en/publications/the-halal-and-kosher-food-experience-in-the-uk/); [GCPH religious dietary requirements](https://www.gcph.co.uk/assets/000/003/733/religious_dietary_requirements-compressed_original.pdf)).
- App: "halal-friendly" means the recipe has no pork or alcohol and meat is marked "use halal". Flag gelatine in yoghurts and sweets. Ramadan mode: suhoor and iftar meal plans with protein and fibre at suhoor and hydration between iftar and suhoor **[recommended feature; not evidence-reviewed here]**.

**Kosher**
- No pork, shellfish or rabbit; meat must be shechita-slaughtered; **meat and dairy are not mixed** ([GCPH](https://www.gcph.co.uk/assets/000/003/733/religious_dietary_requirements-compressed_original.pdf); [Huddersfield](https://pure.hud.ac.uk/en/publications/the-halal-and-kosher-food-experience-in-the-uk/)).
- App: a "no meat + dairy together" rule flags, for example, a chicken + yoghurt marinade and suggests a swap (tahini or olive oil marinade). Hechsher (certification) is beyond the app's scope, so just say "check certification".

**Hindu vegetarian**
- Often lacto-vegetarian: no meat, fish or **eggs**, dairy is fine. Some (for example orthodox Brahmins) also avoid onion and garlic ([Pew Research](https://www.pewresearch.org/religion/2021/06/29/religion-and-food/); [Brainscape summary of Eastern religious practice](https://brainscape.com/flashcards/topic-7-dietary-practice-of-eastern-reli-4884776/packs/6959360)). Beef is avoided by most non-vegetarian Hindus **[general knowledge]**.
- Protein anchors: paneer, Greek yoghurt or dahi, milk, dal, chana, rajma, soya chunks, tofu. Check "egg-free" status on Quorn and some breads and cakes.

**Jain (basics)**
- Strict vegetarian; avoid **root vegetables** (potato, onion, garlic, carrot, radish, beetroot) and honey. Many avoid eating after sunset, and some avoid certain sprouted or fermented foods ([Pew: 67% of Indian Jains avoid root vegetables](https://www.pewresearch.org/religion/2021/06/29/religion-and-food/)).
- App: a "Jain-ok" tag; swap onion/garlic to asafoetida (hing), potato to plantain or raw banana, or pumpkin. Protein: paneer, dal, yoghurt, tofu. This is a niche tag but cheap to support with tagging.

**Gluten-free / coeliac**
- Only oats labelled gluten-free are suitable. Cross-contamination matters: toaster bags or a separate toaster, separate spreads and condiments, wipe surfaces, clean pans ([Coeliac UK cross-contamination](https://www.coeliac.org.uk/living-with-coeliac-disease/food-and-drink/cooking-at-home/cross-contamination/)).
- Watch: soy sauce (use tamari), stock cubes, seitan (pure gluten), couscous, bulgur, beer-battered fish, many sausages. GF breads and wraps are often lower in fibre and protein.
- Separate tags: **"gluten-free ingredients"** vs **"coeliac-safe"** (needs cross-contamination guidance). Coeliac disease is a medical condition, so add "if you have coeliac disease, follow your dietitian's advice".

**Dairy-free / lactose intolerance**
- Lactose intolerance: lactose-free milk and yoghurt, hard cheeses and Greek yoghurt are often tolerated in small amounts (protein unchanged). Milk *allergy* needs complete avoidance.
- Plant swaps: **soya** is the only common plant milk or yoghurt with comparable protein; oat, almond and coconut are very low. Check calcium and iodine fortification.

**Nut and peanut allergy**
- Separate tree nuts from peanuts (different FSA allergens). Watch pesto (pine nuts and often cashew), satay, some curry pastes (korma), granola and protein bars, and "may contain" labels.
- Seed swaps: sunflower seed butter, toasted seeds. **Sesame** is a separate allergen too.

**The 14 UK allergens (FSA / retained EU FIC 1169/2011):** celery; cereals containing gluten (wheat, rye, barley, oats); crustaceans; eggs; fish; lupin; milk; molluscs; mustard; peanuts; sesame; soya; sulphur dioxide/sulphites (>10 ppm); tree nuts (almond, hazelnut, walnut, Brazil, cashew, pecan, pistachio, macadamia) ([Telford Council summary of FSA list](https://www.telford.gov.uk/info/20500/food/731/allergens); [Erudus](https://erudus.com/editorial/the-food-agenda/the-14-allergens-list)). Natasha's Law (from 1 October 2021) requires full ingredients with allergens emphasised on pre-packed-for-direct-sale foods. "May contain" (precautionary) labelling is largely voluntary and under FSA review ([Label Service](https://labelservice.co.uk/fsa-accelerates-precautionary-allergen-labelling-review-amid-ongoing-natashas-law-enforcement/); [CMS](https://cms.law/en/gbr/legal-updates/Changes-to-food-allergen-labelling-requirements-are-you-ready)). **App rule:** recipes show allergens per ingredient. Brand-specific products always say "check the label". Landing must not claim a recipe is "safe" for an allergy.

**Low-FODMAP / IBS**
- BDA and NICE: first-line advice is general healthy eating (regular meals, adjusting fibre, limiting alcohol, caffeine and fizzy drinks). Low-FODMAP is second-line and **should be dietitian-led** in 3 phases (restriction for 4–6 weeks, reintroduction, personalisation) ([PMC9169760](https://pmc.ncbi.nlm.nih.gov/articles/PMC9169760); [Aprifel/BDA summary](https://aprifel.com/en/global-fv-newsletter-article/practical-advice-on-the-role-of-diet-in-treating-patients-with-irritable-bowel-syndrome)).
- App: offer a "gentler on the gut" tag (limited onion and garlic using garlic-infused oil, firm tofu, lactose-free dairy, rice and oats, tinned and rinsed lentils in small portions). **Do not run a low-FODMAP elimination programme**; signpost to a GP or dietitian instead.

**Type 2 diabetes**
- Carb awareness: spread starchy carbs across meals and pair them with protein and fibre. If someone on **insulin or sulfonylureas (for example gliclazide)** cuts carbs substantially, there is a **hypo risk**, and they should talk to their diabetes team first ([NHS Somerset low-carb guidance](https://nhssomerset.nhs.uk/news/document/type-2-diabetes-medication-low-carbohydrate-diet-pamm-approved); [UH Sussex](https://uhsussex.mixd.co.uk/wp-content/uploads/2023/02/Reducing-Carbohydrates-UHS.pdf)). Some people stopping GLP-1s were on them *for* diabetes and may see blood glucose rise.
- App: a "carb-aware" tag showing carb portions (for example "1 fist of rice") and a profile flag that adds hypo-awareness copy. No dosing or medication advice.

**High blood pressure**
- Adults ≤6 g salt a day (about 1 teaspoon) ([NHS salt](https://www.nhs.uk/live-well/eat-well/food-types/salt-nutrition/)). Watch stock cubes, soy sauce, curry pastes, processed meats, cheese, tinned food with added salt, and takeaway sauces.
- App: a low-salt mode that swaps to reduced-salt stock and soy sauce, uses herbs, lemon and spices, and flags recipes with more than 1.5 g salt a portion (the UK "high" front-of-pack threshold per 100 g is >1.5 g **[per 100 g, not per portion; verify use]**).

**High cholesterol**
- HEART UK: reduce saturated fat; include oats and barley (beta-glucan), soya protein (about 15 g a day lowers cholesterol by about 6%), nuts, plant sterols or stanols, and pulses. The portfolio approach lowers LDL by about 17% compared with a standard plan ([HEART UK](https://heartuk.org.uk/healthy-living/cholesterol-lowering-foods)).
- App: a "heart-friendly" tag limiting paneer, halloumi, processed meat, coconut milk and cheese, and promoting oats, soya, beans and oily fish.

**Kidney disease (CKD)**
- **A high-protein diet can be harmful in CKD.** Stages 3–5 not on dialysis are usually advised moderate protein, while dialysis needs more. A renal dietitian should set the targets ([Guy's & St Thomas'](https://guysandstthomas.nhs.uk/health-information/diet-and-chronic-kidney-disease); [UH Sussex CKD protein leaflet](https://www.uhsussex.nhs.uk/wp-content/uploads/2024/11/2422-Dietary-protein-intake-for-chronic-kidney-disease-2024.pdf); [PROT-AGE exception](https://researchexperts.utmb.edu/en/publications/evidence-based-recommendations-for-optimal-dietary-protein-intake/)).
- App: **onboarding question about kidney disease → turn off protein targets and top-up prompts, show "follow your kidney team's advice", and refer.** Potassium and phosphate restrictions are also outside the app's scope.

**Pregnancy / trying to conceive / breastfeeding**
- The MHRA (June 2025) says GLP-1 medicines must not be used during pregnancy, while trying to conceive, or while breastfeeding. Semaglutide should be stopped at least 2 months before a planned pregnancy ([Pharmaceutical Journal](https://pharmaceutical-journal.com/article/news/mhra-urges-women-taking-weight-loss-drugs-urged-to-use-effective-contraception); [NENC NHS](https://northeastnorthcumbria.nhs.uk/news/regions-nhs-warns-women-that-weight-loss-injections-should-not-be-taken-during-pregnancy-while-trying-to-get-pregnant-or-when-breast-feeding/)). Some users will be stopping *because* they want to conceive.
- Pregnancy is not a time for weight-loss goals. Food safety exclusions apply: unpasteurised and mould-ripened soft cheese unless cooked, raw or undercooked meat and eggs (non-Lion), liver and pâté, shark, swordfish and marlin, and limits on tuna and oily fish ([NHS foods to avoid](https://www.nhs.uk/pregnancy/keeping-well/foods-to-avoid/)).
- App: **a pregnancy flag → switch off maintenance and weight features, offer a pregnancy-safe recipe filter only, and refer to the midwife or GP.** Or exclude pregnant users entirely; the product decision is open.

**Reflux / GORD**
- Smaller, more frequent meals; stop eating 3–4 hours before bed; coffee, alcohol, chocolate, and fatty or spicy foods may worsen it; raise the head of the bed. See a GP if heartburn occurs on most days for 3 weeks or more ([UH Sussex reflux advice](https://www.uhsussex.nhs.uk/wp-content/uploads/2020/03/671.3-Advice-on-Management-of-Gastro-Oesophageal-Reflux-2025.pdf); [SW London ICB](https://swlimo.southwestlondon.icb.nhs.uk/wp-content/uploads/2022/12/Self-Care-Information-for-Patients-Heartburn-and-Indigestion-V1.1.pdf)).
- App: a "gentle" tag (lower fat, mild spice, smaller portions) and a dinner-timing nudge.

**Food aversions after GLP-1**
- Users often went off fatty, greasy, sugary or meaty foods, coffee or alcohol while on the drug ([Just Food / IFF](https://www.just-food.com/newsletters/glp1-drugs-taste-perception/)). App: an onboarding "foods I can't face right now" list that excludes those ingredients and offers bland, cold or lean alternatives (for example cold chicken, yoghurt, eggs, protein milk). Re-check after 8 weeks, as preferences may return.

**Budget-conscious**
- Lean on the cheapest protein-per-pound foods: eggs, tinned fish, dried or tinned pulses, frozen chicken thighs, milk, cottage cheese, own-brand Greek-style yoghurt, red lentils, soya mince. Frozen veg reduces waste. UK households waste about 4.5 million tonnes of edible food a year, worth roughly £250–£700 per household depending on type ([WRAP](https://wrap.ngo/resources/report/courtauld-2025-baseline-and-restated-household-food-waste-figures); [Cardiff journalism / WRAP](https://cardiffjournalism.co.uk/intercardiff/?p=66186)). App: a "£ per portion" tag and a "use it up" planner that reuses half-tins and half-packs across the week.

**Low cooking skill**
- Every recipe gets a skill level (0 = assemble, 1 = microwave or kettle, 2 = one pan, 3 = multiple steps). Use technique micro-videos (for example "how to tell chicken is cooked": no pink and juices run clear, or ≥75 °C). Use visual portion cues.

**Cooking for a family**
- "Build-your-own" formats (fajitas, bowls, wraps, jacket potatoes) let the Landing user build a protein-forward plate while others choose freely. Scale to 2, 4 or 6. "Kid-friendly" tags. Avoid food-policing language around children.

**Single-person portions**
- Single-portion scaling that handles partial packs (½ tin of beans → plan a second recipe using the other ½). Freezer-friendly batches with portion labels.

**Limited kitchen (microwave only, no oven, kettle only)**
- Equipment tags: `microwave`, `kettle`, `air_fryer`, `hob`, `oven`, `none`. Microwave-friendly proteins: eggs (scrambled in a mug), fish fillets (steamed, covered), pouches, pre-cooked chicken, tofu. Kettle: couscous, noodles, instant porridge.

**Shift workers**
- Plan by **"main meal / light meal / snack" anchored to the shift**, not clock time. Night-shift guidance: have a main meal before the shift, a lighter protein meal around midnight and 2–3 a.m., avoid a heavy meal just before sleep, and keep caffeine to the early part of the shift **[general occupational health advice; not specifically cited here, flag for review]**. Grab-and-go boxes and no-cook options matter most.

**Cultural cuisines common in the UK**

| Cuisine | Familiar high-protein, easy anchors | Easy tweaks (never "fix the food") |
|---|---|---|
| South Asian | Tandoori chicken, chana/rajma, dal + paneer, egg bhurji, dahi/raita, keema with peas | More dal than rice on the plate; yoghurt raita for protein; tandoor/air-fryer cooking; chapati count as the carb |
| Caribbean | Jerk chicken (traybake), saltfish & ackee, curry goat (batch), rice & peas (kidney beans), steamed fish | Rice & peas already includes pulses; add more callaloo/greens; air-fry plantain |
| West African | Jollof rice + grilled chicken/fish, egusi (melon-seed protein) with fish, moi moi (bean cake), suya beef, beans & plantain (ewa dodo) | Moi moi and beans are protein- and fibre-rich; pair jollof with a large protein portion and salad |
| Chinese | Steamed fish with ginger, tofu & greens, egg-drop soup, chicken & veg stir-fry | Soy sauce salt (use reduced-salt); more veg and protein, less battered meat |
| Middle Eastern | Shawarma, shish, falafel + hummus, ful medames, shakshuka, labneh | Shish over doner; extra salad; Greek yoghurt or labneh sauce |
| Eastern European | Kefir, twaróg/tvorog (quark), buckwheat (kasha), pierogi with cottage cheese, chicken soup, bigos | Kefir and quark are high in protein; buckwheat is GF and high in fibre; watch sausage and salt |

---

## 5. Eating disorder safety and "safe mode"

### 5.1 Why it matters for Landing

- Beat estimates about **1.25 million** (older figure) and now up to **about 3.5 million** people in the UK are living with an eating disorder ([Beat prevalence](https://www.beateatingdisorders.org.uk/get-information-and-support/about-eating-disorders/how-many-people-eating-disorder-uk/eating-disorder-statistics/)).
- GLP-1 users include people with binge eating disorder and other eating disorders. In one US study, 32% of people with eating disorders had used a weight-loss injection and over 10% had misused one ([ABC/GMA report](https://www.goodmorningamerica.com/wellness/story/glp-1-weight-loss-drugs-misused-patients-eating-134175624)). UK pharmacists have warned that ED safety "cannot be an afterthought" ([Pharmaceutical Journal opinion](https://pharmaceutical-journal.com/article/opinion/the-dark-side-of-the-miracle-jab-why-eating-disorder-safety-cannot-be-an-afterthought)).
- Calorie-counting apps can trigger or worsen ED symptoms. Beat has campaigned for safeguards in the NHS app, welcoming the removal of weight-loss tools for people with a low BMI and clear under-18 restrictions ([Beat on NHS app](https://www.beateatingdisorders.org.uk/news/beat-campaigners-celebrate-improvement-in-nhs-app/); [First Steps ED](https://firststepsed.co.uk/?p=10790)). Beat also opposed mandatory menu calorie labelling ([ITV](https://www.itv.com/news/2023-04-05/calories-on-menus-damaging-for-people-with-eating-disorders-charity-warns)).
- Beat's media guidelines warn against **specific weights, calorie amounts and amounts eaten**, because "such a number would become a target". They also advise against before/after or "lowest weight" imagery and stigmatising language ([Beat media guidelines](https://www.beateatingdisorders.org.uk/media-centre/media-guidelines/); [Journalism.co.uk](https://www.journalism.co.uk/how-journalists-can-sensitively-report-on-eating-disorders/)).

### 5.2 Screening

- **SCOFF** (5 yes/no questions; ≥2 = possible ED) is widely used. In a UK community validation, sensitivity was **53.7%** and specificity **93.5%**, so it misses many cases ([Solmi et al., UCL Discovery](https://discovery.ucl.ac.uk/id/eprint/1458297/)). Use it as **one trigger, not a gate**. **[The SCOFF wording is copyrighted to Morgan et al. 1999 and BMJ; check licensing before embedding it verbatim.]**
- Other triggers for automatic safe mode: self-reported current or past ED; BMI <18.5 (if collected at all); age <18 (exclude); pregnancy; repeated very low logging or frequent weighing behaviour (for example more than once a day); a stated goal of further weight loss below a healthy range.
- Users must always be able to turn safe mode on, and should face friction (a confirmation with a Beat link) when turning it off.

### 5.3 What safe mode changes (proposed)

| Normal mode | Safe mode |
|---|---|
| Protein grams, optional kcal per recipe | **No numbers.** "Protein-rich ✓", hand/plate portion cues |
| Optional weekly weigh-in & trend | Weight features hidden |
| "Hunger & cravings" tools incl. urge-surfing | Reframed toward regular eating, "eat every 3–4 hours", no delaying of meals |
| Streaks | No streaks (avoid compulsive patterns); gentle "welcome back" |
| Meal-deal hacks with protein numbers | Same meals, no numbers |
| Swap prompts for "lighter" options | Off; only preference or allergy swaps |
| Persistent signposting | Beat Helpline in the menu (0808 801 0677 **[verify current number on Beat's site]**), GP |

Language rules (all modes): no "cheat/bad/junk/clean/guilt-free/naughty/sin/earn/burn"; no before/after imagery; no "lowest weight" talk; no body-shape imagery; never praise restriction ("well done for skipping…").

---

## 6. How leading apps handle meal planning and tweaks

| App | What works | Complaints / gaps | Lesson for Landing |
|---|---|---|---|
| **Mealime** | Plans designed so ingredients overlap to cut waste; auto shopping list; ~30-min recipes; diet filters plus "hundreds of individual dislikable ingredients"; free with a $2.99/month Pro tier (nutrition, calorie filters) ([App Store](https://apps.apple.com/US/app/id1079999103); [AppFollow](https://apps.appfollow.io/ios/mealime-meal-plans-recipes/1079999103?country=ca)) | US-centric ingredients and units **[general observation]** | **Ingredient overlap across the week** and **dislike lists** are must-haves |
| **Samsung Food (Whisk)** | AI "personalise recipe" (make it vegan, change skill level or time); 160k+ recipes; imports any web recipe and standardises it into a shopping list ([Engadget](https://www.engadget.com/samsung-debuts-its-own-ai-powered-smart-recipe-app-104521190.html); [Android Central](https://androidcentral.com/apps-software/samsung-food-app-launch)) | AI-generated swaps can be nutritionally or allergen unreliable **[inference]** | AI swaps need to be **constrained to a vetted swap matrix** |
| **Paprika** | Web import, pantry with expiry tracking, **aisle-sorted grocery lists that merge duplicates**, scaling and unit conversion ([App Store](https://apps.apple.com/us/app/-/id1303222868)) | No health or nutrition guidance | Aisle sorting and merging are the benchmark for lists |
| **MyFitnessPal** | Bought Intent (AI meal planning) and launched Meal Planner with auto grocery lists and retailer ordering, including in the UK, on Premium+ ([CO/AI](https://about.getcoai.com/news/myfitnesspal-acquires-intent-to-combine-meal-planning-grocery-list-creation-and-calorie-tracking-in-one-ai-app)) | Calorie-counting focus is linked to ED harm ([First Steps ED](https://firststepsed.co.uk/?p=10790)) | Avoid making logging the core loop |
| **Noom** | GLP-1 Companion: medication tracker, protein goal, photo logging, "Muscle Defense" strength plan, AI Welli meal planner ([Noom FAQ](https://www.noom.com/support/faqs/using-the-app/daily-features/2025/10/glp-1-companion/); [Nutrition Insight](https://www.nutritioninsight.com/news/noom-upgrades-glp-1-weight-management-app-features-as-digital-therapeutics-gain-us-market-traction.html)) | Dynamic calorie goals (not appropriate for Landing's safe-floor principle) | Protein plus strength pairing is now the expected standard |
| **Second Nature (UK)** | Dietitian-supported habit programme with medication; also a non-medication programme from about £33/month ([Second Nature](https://www.secondnature.io/guides/blog/glp1-weight-loss-programme)) | Off-medication maintenance detail not visible publicly | Landing's "after" focus is a gap in the market |
| **Juniper / Voy / Numan (UK)** | Prescribing plus coaching, AI coaches, dietitian access ([Medicspot overview](https://www.medicspot.co.uk/weight-loss/programmes/best-weight-loss-programmes-uk)) | Tied to medication subscriptions; support may stop when prescriptions stop **[inference]** | A partnership or referral opportunity for when users stop |
| **Oviva (NHS Tier 3)** | Remote NHS-funded programme with dietitian and psychology support plus an app ([Pulse PDF](https://pulsetoday.co.uk/wp-content/uploads/trackedfiles/1733492803-tier-3-weight-management-pathway-pulse.pdf)) | Eligibility-limited | Model the NICE "12 months after" pathway |
| **WeightWatchers UK GLP-1 programme** | GLP-1 companion with protein and fibre focus ([WW UK](https://www.weightwatchers.com/uk/how-it-works/glp-1-programme)) | Points systems can feel restrictive **[inference]** | — |
| **Lose It / Yazio** | Logging, recipe libraries, fasting (Yazio) **[not researched in detail here]** | Calorie-centric; fasting features may be risky for ED | Avoid fasting features |
| **SimplyCook** | Kits plus **4–6 own ingredients**, **20 minutes**, letterbox-sized, £9.99 for 4 kits ([SimplyCook](https://www.simplycook.com/landing)) | — | "Flavour kit + a few staples" mirrors Landing's "jar paste + 5 ingredients" |
| **Gousto / HelloFresh** | Pre-portioned, choice of 40+ recipes a week, "10-minute" range ([Expert Reviews](https://www.expertreviews.co.uk/home-garden/gousto-recipe-box-review)) | Times underestimated (10-minute meals took about 30); lots of packaging; delivery and quality issues ([Trustpilot](https://uk.trustpilot.com/review/gousto.co.uk?page=3)) | Honest timings; no subscription needed |

**Evidence on abandonment:** a JMIR scoping review found a **median 70% of health-app users stop within 100 days**, citing time burden, poor user experience and content mismatch ([JMIR 2024 e56897](https://jmir.org/article/export/ris/jmir_v26i1e56897)). Meal-planning app studies show users weigh time saved against the effort of using the app. They report throwing away food not eaten in time, and drop off over unavailable ingredients, long prep and clunky lists ([JMIR mHealth 2021 e22990](https://mhealth.jmir.org/2021/5/e22990/PDF); [Member Kitchens](https://memberkitchens.com/updates/meal-planning-app-user-retention-a-complete-guide)) **[the second source is a commercial blog]**.

**Design takeaways:**
1. Default to a **3–4 dinner plan, not 7**. Real life includes leftovers, takeaways and eating out.
2. Offer **"swap this meal"** in one tap with similar effort and protein.
3. **Reuse ingredients** across the week and include a "use-it-up" day.
4. **Show honest total time.**
5. **No subscription box.** Use UK supermarket staples and an optional online-basket hand-off.

---

## 7. Recipe data model needs

### 7.1 Nutrition data sources (UK)

| Source | What it is | Pros | Cons / licence |
|---|---|---|---|
| **CoFID 2021 (McCance & Widdowson)** | The UK government's integrated food composition dataset (~2,900+ foods, many nutrients), published by PHE (now OHID/DHSC) and hosted by Quadram Institute ([gov.uk](https://www.gov.uk/government/publications/composition-of-foods-integrated-dataset-cofid); [user guide PDF](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/971021/McCance_and_Widdowsons_Composition_of_Foods_integrated_dataset_2021.pdf)) | Authoritative UK generic foods; used in NDNS; free download; a 2026 **CoFID API technical document** has appeared ([Quadram](https://fnnbri.quadram.ac.uk/wp-content/uploads/2026/06/CoFID_API_Technical_Documentation.pdf)) | Generic, not branded; gaps for newer products (for example skyr, Quorn variants). **Licence assumed to be the Open Government Licence; verify.** There is also a separate 2021 labelling dataset ([Quadram labelling](https://fnnbri.quadram.ac.uk/labelling/)) |
| **Nutritics (GB23)** | A commercial database: GB23 = 2,887 foods built on CoFID 2021 plus the Quadram labelling dataset, with gaps filled; API with allergen and diet filters ([Nutritics](https://www.nutritics.com/en/?p=1926); [API](https://nutritics.com/en/product/api)) | UK/IE-specific, allergen-aware, recipe analysis | Paid licence |
| **Open Food Facts** | Crowd-sourced branded product data with a barcode API, no key needed ([OFF API docs](https://openfoodfacts.github.io/documentation/docs/Product-Opener/api/tutorials/license-be-on-the-legal-side/)) | Free; UK barcodes; allergen and Nutri-Score fields | **ODbL: attribution plus share-alike.** If you combine it with your own database, the derived database may have to be open ([OFF ODbL](https://wiki.openfoodfacts.org/ODBL_License)). Data quality varies, so verify before showing allergens |
| **Edamam** | 700k+ foods, 520k UPCs, recipe nutrition API ([GreenChoice comparison](https://about.greenchoicenow.com/nutrition-data-api-comparison)) | Natural-language parsing, diet labels | US-weighted; UK branded coverage **[uncertain]** |
| **Spoonacular** | 365k recipes, 80k products ([Public APIs](https://publicapis.io/alternatives/recipe-food-nutrition-api)) | Recipe plus meal-planning features | US-centric **[uncertain UK coverage]** |
| **Nutritionix** | Natural-language and restaurant/brand database | Good for US restaurant chains | Limited UK coverage **[uncertain]** |

**Recommendation:** use **CoFID as the base for generic ingredients** (with a CoFID code on each ingredient), then add **curated UK branded entries** (manually, from pack labels, for the 100–200 convenience SKUs Landing relies on) or a paid UK database. Use Open Food Facts for *lookup or scanning only*, without merging it into the core database, to avoid share-alike obligations **[legal advice needed]**. Present nutrition as **"approx."** with 0 decimal places, because recipe nutrition is an estimate (cooking losses, brand variation).

### 7.2 Core entities (proposed schema sketch)

```
Ingredient
  id, name_uk, synonyms[], cofid_code?, off_barcode?, brand?
  nutrients_per_100g {kcal, protein_g, carb_g, sugars_g, fibre_g, fat_g, satfat_g, salt_g, + optional micros}
  edible_portion_factor, cooked_yield_factor (raw→cooked)
  allergens[14 FSA flags] + may_contain[] + source_confidence
  diet_flags {vegan, vegetarian, pescatarian, halal_status(no_pork_alcohol|requires_cert), kosher_category(meat|dairy|parve), jain_ok, egg_free, gluten_free, coeliac_safe_requires_label, lactose_free, low_fodmap_portion?}
  aisle (Fresh veg, Chilled meat, Dairy, Bakery, Frozen, Tins & jars, World foods, Dry goods, Drinks)
  storage {fridge|freezer|cupboard}, shelf_life_days_opened, pack_sizes[]
  typical_price_gbp_per_pack (+ date), unit_conversions (1 tin = 400 g, drained 240 g; 1 medium egg = 58 g)
  is_pantry_staple (bool)

Recipe
  id, title, slot[breakfast|lunch|dinner|snack], collections[]
  servings_default, scalable(min,max), single_portion_ok
  time {hands_on_min, total_min}, skill_level 0–3
  equipment[] (microwave, kettle, hob, oven, air_fryer, none), washing_up_items
  slots[] → {slot_name, default_ingredient_id, qty, unit, substitutes[{ingredient_id, qty, tags, notes}]}
  steps[] (with timers, per-equipment variants)
  leftovers {fridge_days, freezable, reheat_instructions}
  cost_per_portion_est, protein_per_portion (computed), fibre_per_portion (computed)
  cultural_tags[], gentle_tag, fakeaway_of?
  safe_mode_copy (number-free description)

UserProfile
  diet_prefs, allergies (14 + custom), dislikes/aversions[], equipment[], household_size,
  budget_band, skill_level, flags {pregnancy, ckd, diabetes_meds_hypo_risk, ed_safe_mode, coeliac}
```

### 7.3 Behaviour rules

- **Nutrition calculation:** sum (qty × nutrients_per_100g × yield factors) ÷ servings. Recompute on every swap. Round protein to the nearest 1 g and fibre to the nearest 0.5 g. Show a range ("about 30 g") where brand variance exceeds 15% **[design suggestion]**.
- **FSA labelling alignment:** UK nutrition labels list energy, fat, saturates, carbohydrate, sugars, protein and salt. Fibre is voluntary. Front-of-pack traffic-light thresholds are per 100 g **[from FSA/DH FOP guidance, not re-fetched]**. Landing should use the same nutrient names and order for familiarity.
- **Allergen tagging:** recipe allergens = union of ingredient allergens + may_contain. Hard-filter a user's allergens, with no "probably fine". Always show "check labels, recipes vary".
- **Portion scaling:** scale linearly, but round to purchasable units (for example 1.5 eggs → 2 eggs; ½ tin flagged as "use the rest in X").
- **Leftovers:** a recipe can generate "planned leftovers" that become a later lunch (for example a double chilli on Tuesday becomes a jacket potato filling on Wednesday).
- **Shopping list aggregation:** merge identical ingredients across recipes, convert to pack sizes, subtract pantry staples the user says they have, and group by **aisle** in typical UK supermarket order. Include a "frozen and tins first" note for budget users. Offer export to a supermarket basket and plain-text sharing.
- **Pantry staples:** a default staple list (oil spray, salt, pepper, stock cubes, soy sauce/tamari, curry paste, dried herbs and spices, garlic granules, tinned tomatoes, oats, rice, pasta), user-editable.
- **Waste reduction:** a planner score that rewards plans reusing open ingredients (Mealime-style overlap).

---

## 8. Open questions and items to verify

1. Exact NICE NG246 recommendation wording on stopping medicines and post-treatment support (nice.org.uk could not be fetched directly in this environment).
2. Licence terms for CoFID 2021 and the new CoFID API (assumed OGL).
3. Protein and price values for specific UK SKUs (all marked as estimates). Build a verified table of about 150 core convenience products.
4. Whether to **exclude** or **adapt** for pregnancy and CKD (recommend: adapt with features turned off plus referral).
5. Beat partnership or review of safe mode, and SCOFF licensing.
6. Clinical sign-off on protein targets for people with high BMI (reference-weight approach) and for older adults.
7. Details of the Copenhagen off-treatment follow-up (secondary sources only).
8. Up-to-date UK takeaway ordering data (Just Eat local data is from about 2019; consider buying a Kantar or Lumina report).
