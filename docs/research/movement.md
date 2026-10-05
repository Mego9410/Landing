# Landing — Exercise & Strength Research Brief

**Purpose:** Evidence base for the strength/movement layer of Landing, a UK general-wellness iPhone app helping adults keep weight off in the 12 months after stopping a GLP-1 medicine (semaglutide/Wegovy, tirzepatide/Mounjaro).
**Prepared:** 5 October 2026
**Method note:** Research was done via web search. Direct page fetching was blocked by the network proxy for most domains (gov.uk, nhs.uk, pubmed, pmc, acsm.org), so figures below come from search-indexed abstracts, publisher press releases and official summaries. Every claim has an inline URL. Items marked **[UNCERTAIN]** should be checked against the primary source before they go into in-app copy. Nothing here is medical advice. It is input for product design, and a qualified clinician (physio or exercise physiologist) should review the final library and screening wording.

---

## 0. Executive summary (for the product team)

1. **Why strength matters after GLP-1:** after stopping, weight comes back fast. STEP 1 participants regained about two-thirds of their lost weight within a year ([UCL/DOM 2022](https://discovery.ucl.ac.uk/id/eprint/10149199/1/Diabetes%20Obesity%20Metabolism%20-%202022%20-%20Wilding%20-%20Weight%20regain%20and%20cardiometabolic%20effects%20after%20withdrawal%20of%20semaglutide%20.pdf)). A 2025 BMJ meta-analysis found people regain ~0.4 kg/month on average, and ~0.8 kg/month after semaglutide/tirzepatide ([BMJ Group](https://bmjgroup.com/stopping-weight-loss-drugs-linked-to-weight-regain-and-reversal-of-heart-health-markers/)). In one RCT, people who had exercised during treatment kept more weight off after stopping than people who had taken the drug alone ([Lundgren NEJM 2021 via PubMed](https://pubmed.ncbi.nlm.nih.gov/33951361/); [McMaster summary](https://www.mcmasteroptimalaging.org/full-article/plus/healthy-weight-loss-maintenance-exercise-liraglutide-combined-98902)).
2. **Lean mass:** roughly 25–40% of weight lost on these drugs shows up as "lean mass" on DXA, a measure that includes more than muscle ([Healio](https://www.healio.com/news/endocrinology/20250313/about-31-of-weight-lost-by-adults-during-glp1-therapy-comes-from-lean-mass); [Acibadem summary](https://acibademinternational.com/blog/muscle-loss-on-glp-1-medicines-how-much-is-lean-mass-and-how-to-protect-it/)). In older adults who were dieting, resistance training prevented most of the diet-induced lean-mass loss ([Sardeli 2018](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5946208/)).
3. **Dose:** train all major muscle groups ≥2 days/week. Use 1–3 sets per exercise, moderate loads, and stop 1–3 reps short of failure. The biggest gain is going from none to some ([ACSM 2026 position stand coverage](https://www.newswise.com/articles/acsm-unveils-landmark-2026-resistance-training-guidelines-first-update-in-17-years); [2 Minute Medicine](https://www.2minutemedicine.com/landmark-acsm-mcmaster-guidelines-simplify-resistance-training-for-longevity/)). This fits UK CMO guidance (strength ≥2 days, 150 min moderate activity, balance for older adults) ([GOV.UK infographic text](https://www.gov.uk/government/publications/physical-activity-guidelines-adults-and-older-adults/physical-activity-for-adults-and-older-adults-19-and-over-text-of-the-infographic)).
4. **Landing's plan (2 × 25 min, adding an optional third) sits within the evidence.** Once strength is built, one or two sessions a week can maintain it, provided effort stays the same ([Spiering 2021](https://pubmed.ncbi.nlm.nih.gov/33629972/)). That supports the "Steady" phase.
5. **Design principle:** build the library on **movement patterns**, with each exercise tagged by setting/equipment, joint load, impact, floor need, noise and position (standing, seated, floor). Substitution then becomes a lookup.
6. **Safety:** use a short PAR-Q+-style screen. A "yes" leads to "check with your GP first" or to a gentler track, never to exclusion. Use a traffic-light pain rule (0–2 green, 3–5 amber if it settles within 24 h, >5 red). Show red-flag lists for 999/111/GP. Under UK consensus, benefits outweigh risks for people with stable long-term conditions, and routine medical clearance is not needed ([Reid et al. BJSM 2022](https://bjsm.bmj.com/content/56/8/427)).
7. **Regulatory:** keep Landing's intended purpose as general fitness and wellbeing. Do not diagnose, treat or rehabilitate named conditions, and do not personalise exercise "for your knee osteoarthritis". Disclaimers alone do not get an app out of medical device regulation ([MHRA guidance PDF](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1105233/Medical_device_stand-alone_software_including_apps.pdf); [CMS law summary](https://cms.law/en/gbr/legal-updates/mhra-releases-updated-guidance-on-medical-device-software-and-apps)).

---

## 1. Why strength training matters after GLP-1

### 1.1 Weight regain after stopping

- **STEP 1 extension (semaglutide 2.4 mg).** Mean weight loss was 17.3% at week 68. One year after stopping, participants had regained 11.6 percentage points, leaving a net loss of 5.6% (about two-thirds of the loss regained). Cardiometabolic improvements largely reverted ([Wilding et al., Diabetes Obes Metab 2022, UCL repository](https://discovery.ucl.ac.uk/id/eprint/10149199/1/Diabetes%20Obesity%20Metabolism%20-%202022%20-%20Wilding%20-%20Weight%20regain%20and%20cardiometabolic%20effects%20after%20withdrawal%20of%20semaglutide%20.pdf)).
- **SURMOUNT-4 (tirzepatide).** After a 36-week open-label lead-in, participants were randomised to continue or switch to placebo for 52 weeks ([JAMA](https://jamanetwork.com/journals/jama/fullarticle/2812936)). In a post hoc analysis, 82% of those switched to placebo regained more than 25% of the weight they had lost, and blood pressure, lipids, HbA1c and waist measures worsened in step with regain ([ACC journal scan](https://www.acc.org/latest-in-cardiology/journal-scans/2025/12/09/16/51/surmount-4); [Pharmaceutical Journal](https://pharmaceutical-journal.com/article/news/mounjaro-health-benefits-found-to-reverse-one-year-after-stopping-drug)).
- **BMJ 2025 meta-analysis (Oxford; 37 studies, 9,341 people).** Average regain after stopping weight-loss drugs was 0.4 kg/month, with a projected return to baseline weight in about 1.7 years. Regain was faster than after behavioural programmes, and about 0.8 kg/month for semaglutide/tirzepatide ([BMJ Group press release](https://bmjgroup.com/stopping-weight-loss-drugs-linked-to-weight-regain-and-reversal-of-heart-health-markers/); [Oxford Primary Care](https://www.phc.ox.ac.uk/news/weight-regain-after-stopping-weight-loss-drugs-review)).
- **Exercise during treatment improves outcomes after stopping (liraglutide, an older GLP-1).** In Lundgren et al. (NEJM 2021) and the follow-up, those who had done supervised exercise plus liraglutide were more likely to keep ≥10% weight loss one year after treatment ended than those on placebo (OR 7.2) or liraglutide alone (OR 4.2). Regain after stopping liraglutide alone was 6.0 kg greater than after stopping exercise ([McMaster summary](https://www.mcmasteroptimalaging.org/full-article/plus/healthy-weight-loss-maintenance-exercise-liraglutide-combined-98902); [PubMed](https://pubmed.ncbi.nlm.nih.gov/33951361/); [Medical Republic](https://www.medicalrepublic.com.au/exercise-beats-glp-1-ras-for-keeping-weight-off/105940)). **[UNCERTAIN]** This trial used liraglutide and supervised, mostly aerobic/interval exercise. It has not been replicated with semaglutide or tirzepatide.
- **Activity volume for maintenance.** ACSM's 2009 position stand suggests about 200–300 min/week of moderate activity to maintain weight after loss ([Donnelly 2009, PubMed](https://pubmed.ncbi.nlm.nih.gov/19127177/); [OMA summary](https://obesitymedicine.org/how-much-physical-activity-is-needed-for-weight-loss-weight-loss-maintenance-and-weight-gain-prevention/)). NICE NG246 (2025) notes that people who have lost weight "may need to do 60 to 90 minutes of activity a day" to avoid regain ([NICE NG246 physical activity chapter](https://www.nice.org.uk/guidance/NG246/chapter/physical-activity-and-diet); [Diabetes on the Net factsheet](https://diabetesonthenet.com/diabetes-primary-care/factsheet-nice-obesity-whats-new/)). **Product implication:** walking/NEAT is not optional garnish. It is the main lever on energy balance, and strength work protects muscle and function.

### 1.2 Lean mass loss during GLP-1 treatment

- In the STEP 1 DXA substudy (n=140), about 40% of weight lost on semaglutide was lean mass. In SURMOUNT-1, the figure was about 25% on tirzepatide ([Acibadem summary](https://acibademinternational.com/blog/muscle-loss-on-glp-1-medicines-how-much-is-lean-mass-and-how-to-protect-it/); [Patient Care](https://www.patientcareonline.com/view/semaglutide-2-4-mg-reduces-visceral-adiposity-improves-lean-body-mass-to-fat-mass-ratio)). Pooled analyses put it at about 31% ([Healio](https://www.healio.com/news/endocrinology/20250313/about-31-of-weight-lost-by-adults-during-glp1-therapy-comes-from-lean-mass)).
- **Caveats.** DXA "lean mass" includes water, glycogen, organs and liver fat changes, so actual skeletal-muscle loss is smaller. The 20–30% lean share is similar to diet-only weight loss ([Acibadem](https://acibademinternational.com/blog/muscle-loss-on-glp-1-medicines-how-much-is-lean-mass-and-how-to-protect-it/)). The app should avoid scary claims like "you lost lots of muscle". A better framing: "big weight loss usually includes some muscle; strength work helps you keep and rebuild it."
- **Resistance training protects lean mass during energy restriction.** In obese older adults dieting, resistance training (3×/week, 12–24 weeks) prevented about 93.5% of diet-induced lean mass loss ([Sardeli et al. 2018, Nutrients](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5946208/)).
- **GLP-1-specific RCTs are ongoing.** LEAN-PREP (NCT06885736) is testing home resistance training, 3×/week progressing from 1 to 3 sets, ± protein during sema/tirz therapy ([ClinicalTrials.gov](https://clinicaltrials.gov/study/NCT06885736)). PRIME is testing resistance training + 25 g/day protein in adults ≥45 on semaglutide ([Haifa lab](https://ben-porat-lab.welfare.haifa.ac.il/research-projects/prime-study)). **[UNCERTAIN]** As of this search, no published RCT shows resistance training preserves lean mass specifically during semaglutide/tirzepatide. That is inferred from diet-induced weight-loss evidence.
- **Professional consensus.** The joint ACLM/ASN/OMA/TOS advisory "Nutritional Priorities to Support GLP-1 Therapy for Obesity" (2025) lists adequate protein and **resistance training to preserve lean mass** as a core priority ([Obesity Society PDF](https://www.obesity.org/wp-content/uploads/2025/06/Joint_Nutritional-Priorities-to-Support-GLP-1-Therapy-for-Obesity.pdf); [PubMed](https://pubmed.ncbi.nlm.nih.gov/40450457/)). **[UNCERTAIN]** Its exact frequency/sets wording could not be verified.

### 1.3 What dose the evidence supports

**UK CMO guidelines (2019)** ([GOV.UK infographic text](https://www.gov.uk/government/publications/physical-activity-guidelines-adults-and-older-adults/physical-activity-for-adults-and-older-adults-19-and-over-text-of-the-infographic); [GOV.UK full report](https://gov.uk/government/publications/physical-activity-guidelines-uk-chief-medical-officers-report/uk-chief-medical-officers-physical-activity-guidelines); [Bristol news](https://www.bristol.ac.uk/news/2019/september/physical-activity-guidelines.html)):
- Adults: muscle-strengthening activity on **≥2 days/week**, and **≥150 min moderate** (or 75 min vigorous) aerobic activity a week. Break up long sitting. "Some is good, more is better" ([BMJ blog](https://blogs.bmj.com/bmj/2019/09/07/cmos-new-physical-activity-guidelines-demonstrate-under-appreciation-as-a-clinical-approach/)).
- Older adults (65+): additionally do activities that improve **strength, balance and flexibility on ≥2 days/week** to reduce frailty and falls. Examples include dancing, bowls and tai chi ([NHS older adults](https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-older-adults/); [Birmingham](https://www.birmingham.ac.uk/news/2019/top-doctors-release-new-guidance-on-how-to-stay-fit-and-healthy)).
- Muscle and bone decline accelerates from around 50 ([Activity Alliance](https://www.activityalliance.org.uk/news/5260-top-doctors-release-new-guidance-on-how-to-stay-fit-and-healthy)).

**ACSM 2026 resistance training position stand** (137 systematic reviews, >30,000 participants) ([Newswise](https://www.newswise.com/articles/acsm-unveils-landmark-2026-resistance-training-guidelines-first-update-in-17-years); [2 Minute Medicine](https://www.2minutemedicine.com/landmark-acsm-mcmaster-guidelines-simplify-resistance-training-for-longevity/); [Rec Management](https://recmanagement.com/articles/155711/acsm-unveils-landmark-2026-resistance-training-guidelines)):
- Train all major muscle groups **≥2 days/week**. Going from no training to any training gives the biggest benefit.
- Load, volume, frequency and range of motion drive adaptation. Heavy loads (≥~80% 1RM) are best for maximal strength, but a wide range of loads builds muscle when effort is high.
- Training to failure is unnecessary. Stopping 2–3 reps short gave similar results with less injury risk for older adults ([2 Minute Medicine](https://www.2minutemedicine.com/landmark-acsm-mcmaster-guidelines-simplify-resistance-training-for-longevity/)).
- Older adults (60+): 2–3 sessions/week on non-consecutive days.
- **[UNCERTAIN]** Exact set/rep numbers in the 2026 stand could not be read from the primary text. Secondary sources say it moves away from prescriptive formulas.

**Older adults dose-response** (Borde 2015, 25 RCTs, mean age ≥65): the most effective dose was 3 sessions/week, 2–3 sets/exercise, 7–9 reps, 50–70% 1RM ([Borde et al., PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4656698/)). The 7–9 reps were usually moderate loads, not maximal efforts.

**Maintenance dose** (Spiering 2021): strength and size can be maintained for up to 32 weeks with 1 session/week and 1 set/exercise if relative load is kept. Older adults may need 2 sessions/week and 2–3 sets ([PubMed](https://pubmed.ncbi.nlm.nih.gov/33629972/)).

**Short sessions work.** Resistance "exercise snacking" (short home bouts, sometimes several times a day) was feasible in older adults, with 81–97% adherence and 2 minor adverse events in 1,317 sessions ([Deakin pilot RCT](https://dro.deakin.edu.au/articles/journal_contribution/Feasibility_and_acceptability_of_a_remotely_delivered_home-based_pragmatic_resistance_exercise_snacking_intervention_in_community-dwelling_older_adults_a_pilot_randomised_controlled_trial/20584815); [Deakin IPAN](https://ipan.deakin.edu.au/project/exploring-the-possible-benefits-of-exercise-snacking-for-older-adults/)).

### 1.4 Recommended Landing prescription (synthesis — for clinician review)

| Phase | Sessions/wk | Structure (25 min) | Sets × reps | Effort | Progression |
|---|---|---|---|---|---|
| **Land** wk 1–8 | 2 (non-consecutive) | 3 min warm-up; 5–6 exercises covering squat/sit-to-stand, hinge, push, pull, carry or core, balance; 2 min cool-down | Wk 1–2: 1 set × 8–12. Wk 3–8: 2 sets × 8–12 | RPE 5–6/10 at first ("could do 4+ more"), building to RPE 7 (2–3 reps in reserve) | Add reps up to 12–15, then a second set, then move up a level in the pattern (double progression) |
| **Settle** wk 9–26 | 2 + optional 3rd | Same patterns; optional 3rd = 10–20 min "top-up" or balance/mobility | 2–3 sets × 8–15 | RPE 7–8 (1–3 RIR) | Harder variation, more load, slower tempo, pauses. Easier week every ~6 weeks |
| **Steady** wk 27–52 | 2 (1 minimum for a busy week) | Full-body | 1–3 sets | Keep effort (RIR 1–3). Volume can flex down | Keep effort, not volume ([Spiering](https://pubmed.ncbi.nlm.nih.gov/33629972/)) |

Alongside the strength plan:
- **Walking/NEAT:** build towards ≥150 min/week of moderate activity ([CMO](https://www.gov.uk/government/publications/physical-activity-guidelines-adults-and-older-adults/physical-activity-for-adults-and-older-adults-19-and-over-text-of-the-infographic)), and ideally ~200–300 min/week for weight maintenance ([Donnelly 2009](https://pubmed.ncbi.nlm.nih.gov/19127177/)).
- **Balance (all users ≥65, or anyone with falls risk):** two days/week, embedded in warm-ups ([NHS](https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-older-adults/)).

---

## 2. Training settings — so no one is left out

Onboarding should ask "Where will you usually move?" (multi-select) and "What do you have?" (checklist). Each exercise in the library is tagged against these. Users can hold multiple **equipment profiles** (e.g., Home / Gym / Holiday), as Fitbod does ([Fitbod help](https://help.fitbod.me/hc/en-us/articles/360004429814-How-Fitbod-Creates-Your-Workout)).

| # | Setting | Equipment assumed | Typical exercises by pattern | Pros | Cons | How to progress |
|---|---|---|---|---|---|---|
| 1 | **Bodyweight, home** | Floor space, wall, sturdy chair | Squat: sit-to-stand, bodyweight squat. Hinge: glute bridge, hip hinge to wall. Push: wall/incline/knee press-up. Pull: towel isometric row, prone "Y/T" raises, doorframe row **[check safety]**. Lunge: split squat, step-back lunge. Core: dead bug, bird dog, plank. Balance: tandem stand | Free, private, no travel | Hard to load legs and pull. Plateaus sooner | Reps → tempo (3 s down) → pauses → range (deficit) → unilateral (single-leg bridge, split squat → Bulgarian) → reduced leverage (incline → floor press-up) |
| 2 | **Small space / flat-friendly** (quiet, no jumping) | ≤2 m², mat | As above but all **no-impact** and slow. Replace jumps with tempo squats, marching, step-backs | Neighbour-friendly. Joint-friendly | Low cardio intensity | Tempo, isometric holds (wall sit), unilateral, more time under tension. Tag every exercise `impact: none/low/high` and `noise: quiet/moderate` |
| 3 | **Resistance bands** | Loop bands, tube with handles, door anchor | Squat: banded squat. Hinge: band good-morning, band pull-through. Push: band chest press, band overhead press. Pull: band row (door anchor), band pull-apart, band lat pulldown (anchored high). Core: Pallof press. Carry: N/A | Cheap, portable, very good for **pulling** at home. Strength gains similar to weights ([Lopes 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6383082/)) | Load hard to quantify. Band snapping risk. Door anchor needs a safe door | Thicker band, step further from anchor, double band, more reps/tempo |
| 4 | **Household items** | Water bottles/milk cartons, backpack with books, shopping bags, chair, stairs, towel, tins | Squat: backpack goblet squat, chair sit-to-stand. Hinge: backpack Romanian deadlift. Push: chair-supported incline press-up. Pull: backpack bent-over row, towel row. Lunge: step-ups on bottom stair. Carry: shopping-bag farmer's carry. Calves: stair heel raises (as in [Rathleff protocol](https://bjsm.bmj.com/content/49/10/638)) | Familiar, zero cost, "real life" framing | Awkward grip. Load capped. Chair stability risk | Add books, slower tempo, single-arm/leg. **Safety copy:** chair against a wall, no wheels |
| 5 | **Adjustable dumbbells / kettlebells at home** | 1 pair adjustable DBs or 1–2 KBs, ± bench | Goblet squat, DB Romanian deadlift, floor/bench press, DB overhead press, one-arm row, split squat, step-up, suitcase/farmer's carry, KB deadlift | Measurable progressive overload. Compact | Cost (£50–£300). Heavy lower-body loading eventually limited | Add 1–2 kg when the top of the rep range is hit for all sets (double progression) |
| 6 | **Full commercial gym** | Machines, cables, free weights, barbells | Leg press, hack/goblet squat, trap-bar deadlift, hip thrust, chest press machine, cable row, lat pulldown, shoulder press machine, cable Pallof press, sled push | Most loadable. Machines are stable and good for novices and older adults | Cost, intimidation, travel. Technique needs on barbells | Machine increments. Move machine → cable → free weight as confidence grows. Show "machine is fine" messaging |
| 7 | **Outdoor / park** | Bench, steps, railings, outdoor gym kit, paths | Bench step-ups, bench incline press-up, railing row (low bar), bench sit-to-stand, hill walking, park outdoor-gym leg press | Free, social, daylight, nature benefits | Weather, wet surfaces, privacy | Higher step, steeper incline, add backpack load |
| 8 | **Chair-based / seated** (low mobility, wheelchair users, high fall risk) | Sturdy chair without wheels, ± band/bottles | Seated knee extension, seated march, sit-to-stand with hands (where possible), seated band row, seated chest press with band, seated overhead press with bottles, seated heel/toe raises, seated trunk rotation | Accessible. Improves grip, arm-curl and 30-s chair-stand scores in older adults ([Klempel 2021 meta-analysis](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7920319/)). NHS provides seated programmes ([NHS strength exercises](https://www.nhs.uk/live-well/exercise/strength-exercises/); [Torbay chair programme](https://www.torbayandsouthdevon.nhs.uk/uploads/chair-based-home-exercise-programme.pdf)) | Less lower-limb loading | More reps, slower tempo, band resistance, then progress towards supported sit-to-stand and standing work |
| 9 | **Pool / aquatic** | Pool access, ± aqua dumbbells/noodle | Water walking, squats in chest-deep water, step-ups on pool steps, aqua-dumbbell push/pull, standing leg swings, kickboard kicks | Off-loads joints. Good for OA, high body weight, fibromyalgia. Improves strength in older adults (SMD 0.56, 13 RCTs) with benefit at 2–3×/week ([Bayesian MA 2025](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12741266/); [aquatic MA](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12930738/)) | Access, cost, changing-room barriers. Less bone loading | Faster movement (water drag ∝ speed), larger surface area (gloves/dumbbells), deeper water for less support or shallower for more load |
| 10 | **Walking / step-based (NEAT)** | Phone/watch | Brisk walks (NHS Active 10: 10-min brisk bouts) ([App Store](https://apps.apple.com/gb/app/nhs-active-10-walking-tracker/id1204295312)), stairs, gardening, carrying shopping, Couch to 5K for those who want to run | Most accessible. Large energy-balance contribution. Mortality benefit plateaus around **6,000–8,000 steps/day for ≥60s** and 8,000–10,000 for younger adults ([Paluch 2022, Lancet Public Health](https://discovery.ucl.ac.uk/id/eprint/10170017/1/1-s2.0-S2468266721003029-main.pdf)) | Does not build much muscle in most people | +500–1,000 steps/day per week from personal baseline, then add brisk minutes and hills |
| 11 | **Class-based** (Pilates, yoga, circuits, aqua, tai chi, dance, ESCAPE-pain) | Leisure centre/community | — | Social, supervised. Tai chi may reduce falls ~19% ([Cochrane 2019](https://www.cochrane.org/news/new-cochrane-review-assesses-benefits-and-harms-exercise-preventing-falls-older-people-living)). NICE lists mind–body (Pilates/yoga) group programmes as an option for back pain ([NG59 summary](https://www.iatrox.com/shared/6a6018ea524dee74d26876c1/what-are-the-most-effective-types-of-exercise-programmes-for-patients-with-)) | Variable load. Pilates/yoga alone may not progressively load big muscle groups | See below |

**How Landing could account for classes:**
- Let users **log an external session** with type + duration + perceived effort.
- Map the type to patterns credited: circuits/bodypump = full strength session; Pilates = core + partial strength; yoga = mobility + balance (+ light strength for flows); aqua = strength-lite + aerobic; tai chi/dance = balance + aerobic.
- If a class counts as a strength session, the app removes one Landing session that week instead of stacking extra load.
- If the class is low-load (yoga), the app keeps the strength session but may shorten it.
- Credit balance minutes for ≥65s.
- Tone: "Your Thursday Pilates counts — we've moved your core work into it."

---

## 3. Movement-pattern exercise library

### 3.1 Data model (per exercise)
`pattern`, `level (1–6)`, `settings[]`, `equipment[]`, `position (standing/seated/floor/kneeling/supine/prone/water)`, `impact (none/low/high)`, `noise`, `joint_load {knee, hip, lumbar, shoulder, wrist, ankle}: low/med/high`, `spine_flexion_loaded: bool`, `overhead: bool`, `floor_transfer_required: bool`, `wrist_extension_weightbearing: bool`, `balance_demand: low/med/high`, `cues`, `common_mistakes`, `easier_id`, `harder_id`, `same_level_alternatives[]`.

These tags let the app filter for **condition flags** (e.g., `wrist_flag` → exclude `wrist_extension_weightbearing`, swap to fist/handle/forearm versions; `osteoporosis_flag` → exclude `spine_flexion_loaded`). Flags come from *user-reported preferences* ("I'd rather avoid kneeling" / "my wrists don't like weight on them"), not diagnoses (see §6).

### 3.2 Progression ladders (Level 1 = easiest)

| Pattern | L1 | L2 | L3 | L4 | L5 | L6 | Seated / low-mobility version | Notes |
|---|---|---|---|---|---|---|---|---|
| **Squat** | Sit-to-stand from high chair, hands on thighs | Sit-to-stand, arms crossed (NHS) ([NHS](https://www.nhs.uk/live-well/exercise/strength-exercises/)) | Box squat to lower chair / bodyweight squat to box | Goblet squat (bottle/backpack/DB/KB) | Tempo goblet squat 3-1-1 / heavier goblet | Leg press (gym) / barbell or safety-bar squat | Seated knee extension; seated sit-to-stand partial | Knee pain: limit depth to pain-free box height |
| **Hinge** | Glute bridge (floor) or standing hip hinge with hands on wall | Hip hinge with dowel/broom | Band pull-through / backpack Romanian deadlift | DB/KB Romanian deadlift | KB deadlift from block / trap-bar deadlift | Single-leg RDL (supported) / hip thrust | Seated forward lean with neutral spine ("good morning" seated) | Osteoporosis: hinge from hips, neutral spine ([ROS consensus](https://bjsm.bmj.com/content/56/15/837)) |
| **Push – horizontal** | Wall press-up | Kitchen-counter incline press-up | Low-chair / stair incline press-up | Knee press-up | Full press-up / DB floor press | DB bench press / chest press machine → barbell bench | Seated band chest press; seated bottle chest press | Wrist issue: push-up handles, fists, DBs, or machine |
| **Push – vertical** | Wall slides | Seated bottle overhead press | Band overhead press | Half-kneeling DB press | Standing DB press | Machine shoulder press / landmine press | Seated bottle press | Shoulder pain: landmine/angled press, partial range |
| **Pull – horizontal** | Towel/door isometric row; prone "Y/T" on bed | Band row seated | Band row standing / backpack bent-over row | One-arm DB row (hand on chair) | Inverted row under sturdy table/park bar (high bar) | Cable row / chest-supported row machine | Seated band row | Usually the hardest pattern at home: recommend a band |
| **Pull – vertical** | Band pull-apart overhead | Seated band lat pulldown (anchored high) | Kneeling band pulldown | Assisted pull-up machine / lat pulldown light | Lat pulldown | Assisted → full chin-up | Seated band pulldown | Shoulder pain: neutral grip, below-pain range |
| **Lunge / single-leg** | Supported split-stance hold | Supported split squat (hand on chair) | Step-up onto bottom stair (Versus Arthritis) ([VA](https://versusarthritis.org/about-arthritis/exercising-with-arthritis/exercises-for-healthy-joints/exercises-for-the-knees)) | Reverse lunge / higher step-up | DB split squat / walking lunge | Rear-foot-elevated (Bulgarian) split squat | Seated single-leg knee extension | Knee OA: step-ups and split squats in pain-free range. Avoid deep lunges if they flare it ([VA sheet](https://www.versusarthritis.org/media/21787/kneepain-exercise-sheet.pdf)) |
| **Carry** | Walk holding one bottle each hand | Shopping-bag farmer's carry | Suitcase carry (one side) | DB/KB farmer's carry | Heavier / longer carries | Front-rack or overhead carry (gym) | Seated weighted hold / suitcase hold | Real-life transfer ("carrying shopping" is cited by CMO) ([Bristol](https://www.bristol.ac.uk/news/2019/september/physical-activity-guidelines.html)) |
| **Core – anti-extension** | Supine heel slides / dead-bug arms only | Dead bug | Incline plank (hands on counter) | Knee plank → plank | Plank with reach / bear crawl hold | Ab wheel from knees | Seated brace with band | Prefer over sit-ups for osteoporosis ([ROS](https://www.endocrinology.org/media/3591/final-consensus-statement_strong-steady-and-straight_dec18.pdf)) |
| **Core – anti-rotation / lateral** | Seated brace | Bird dog (or standing bird dog against wall) | Side-lying knee side-plank | Pallof press (band/cable) | Side plank | Single-arm carry / half-kneeling cable chop | Seated Pallof press | Bird dog good for back pain |
| **Balance** | Feet together, hand on counter | Semi-tandem → tandem stance with support | Single-leg stance with support | Heel-toe walking (tandem walk), sideways walking | Single-leg stance eyes open, no support / reaching | Single-leg stance on cushion, eyes closed only if safe | Seated weight shifts, seated reaching (NHS) | Otago uses tandem stance/walk, single-leg stance, backward/side walking ([Otago overview](https://ebc.tamhsc.edu/program/otago-exercise-program)) |
| **Calf / ankle** | Seated heel raise | Standing two-leg heel raise holding counter | Slow two-leg heel raise on step | Single-leg heel raise holding support | Single-leg heel raise with towel under toes, 3-2-3 tempo | Weighted (backpack) single-leg heel raise ([Rathleff](https://bjsm.bmj.com/content/49/10/638)) | Seated heel/toe raises | Supports balance and plantar heel pain |

### 3.3 Substitution rules (priority order)
1. **Same pattern, same level, available equipment** (e.g., goblet squat DB → goblet squat backpack).
2. **Same pattern, same level, lower joint load** for the flagged area (e.g., knee flag: reverse lunge → step-up to low step → box squat).
3. **Same pattern, one level down** if the user rated the last attempt "too hard" or reported pain >5/10.
4. **Position swap** (floor → standing or seated) if `floor_transfer_required` and the user reports difficulty getting down/up.
5. **Adjacent pattern** only if the whole pattern is excluded (e.g., overhead push excluded → extra horizontal push + pull-apart).
6. Never substitute in **higher impact** or **higher balance demand** than the original without user opt-in.

---

## 4. Injuries and conditions

### 4.1 Overarching evidence and principles
- **Benefits outweigh risks.** The UK Moving Medicine consensus (BJSM 2022) concluded that for people with long-term conditions, "the benefits of increasing activity levels far outweigh the risks". When activity increases gradually, serious adverse events are very rare, and **pre-participation medical clearance is not necessary for stable long-term conditions**. It includes symptom-specific statements on MSK pain, fatigue, breathlessness, cardiac chest pain, palpitations, dysglycaemia, cognitive impairment and falls ([BJSM](https://bjsm.bmj.com/content/56/8/427); [Moving Medicine](https://movingmedicine.ac.uk/riskconsensus)).
- **Language.** The CSP's "Love Activity, Hate Exercise?" research found the word "exercise" triggers strong negative emotions in 40–70-year-olds with long-term conditions, while people talk warmly about activities they enjoy ([CSP](https://csp.org.uk/node/1251204); [ARMA](https://arma.uk.net/?p=23981)). Landing's gentle tone fits; prefer "movement", "strength sessions", "activity".
- **Pain-monitoring (traffic-light) model**, adapted from Thomeé 1997 and widely used by physios ([Physiotutors](https://www.physiotutors.com/?p=8188); [AAU PDF](https://vbn.aau.dk/ws/files/310039257/907.full.pdf)):
  - **Green 0–2/10:** carry on.
  - **Amber 3–5/10:** acceptable, if it settles back to usual by the next morning (within 24 h) and is not worse week on week. Keep the same level.
  - **Red >5/10, or pain that lingers >24 h / builds week on week:** go down a level or swap the exercise next time. If repeated, suggest seeing a GP/physio.
  - Some NHS physio leaflets use a lower ceiling (e.g., ≤4/10 for frozen shoulder programmes) ([Pure Physio](https://purephysiotherapy.co.uk/exercise-plans/early-frozen-shoulder-exercise-programme)). **Recommendation:** use 0–3 green, 4–5 amber, ≥6 red in-app, to be conservative.
  - NICE OA guidance explicitly says joint pain may increase when starting exercise but regular exercise is beneficial ([NICE NG226](https://www.nice.org.uk/guidance/ng226/chapter/Recommendations)). Normalise mild discomfort without dismissing pain.
- **Post-session check-in:** "How did your joints feel? None / mild & settled / still sore next day / sharp or worrying". The answer drives the next session's level.

### 4.2 Universal red flags (shown in-app; stop exercising)
**Call 999** if, during or after activity, you have ([NHS heart attack symptoms](https://www.nhs.uk/conditions/heart-attack/symptoms/)):
- chest pain, pressure, tightness or squeezing, possibly spreading to the arm, jaw, neck or back;
- severe breathlessness;
- fainting or collapse;
- pale, grey or blue lips or skin;
- signs of stroke (face drooping, arm weakness, speech problems).

**Call 999 / go to A&E** for back pain with ([Sussex Community NHS – CES](https://www.sussexcommunity.nhs.uk/patients-and-visitors/resources/patient-resources/mechanical-low-back-pain/cauda-equina-syndrome-ces); [NHS Resolution](https://resolution.nhs.uk/wp-content/uploads/2020/07/Did-you-know-Cauda-Equina.pdf)):
- numbness around the genitals, buttocks or back passage;
- new difficulty passing urine, or leaking urine or faeces;
- leg weakness or numbness in both legs.

**NHS 111 / urgent GP:**
- chest discomfort that comes on with exertion and settles with rest (possible angina) ([NHS](https://www.nhs.uk/conditions/heart-attack/));
- new palpitations, dizziness or near-fainting;
- a hot, swollen, red joint;
- calf pain with swelling (possible clot);
- a sudden injury with inability to bear weight;
- unexplained weight loss or night pain with back pain;
- a hypo that does not resolve.

**See your GP / physio (routine):**
- pain that stays red-zone for two sessions running;
- pain that is getting worse week on week;
- a new limp;
- recurrent falls.

### 4.3 Condition-by-condition adaptation table

*All of the following are framed for the app as **user-reported preferences and comfort settings**, not medical prescriptions (see §6).*

| Condition | Typical swaps / avoid | Preferred regressions | Red flags / refer | Evidence / source |
|---|---|---|---|---|
| **Knee pain / knee OA** | Avoid jumping, deep loaded squats, deep lunges and kneeling if painful. Swap lunge → step-up or box squat. Leg press with limited depth fine | Sit-to-stand, box squat to pain-free height, seated straight-leg raise (hold 10 s × 10), step-ups, heel raises, cycling/pool | Hot, swollen joint; locking/giving way after injury; can't weight-bear | NICE NG226: offer tailored therapeutic exercise (strengthening + aerobic) to all with OA ([NICE](https://www.nice.org.uk/guidance/ng226/chapter/Recommendations)); Versus Arthritis exercises ([VA](https://versusarthritis.org/about-arthritis/exercising-with-arthritis/exercises-for-healthy-joints/exercises-for-the-knees)); ESCAPE-pain 6-wk programme (>190 sites) ([Versus Arthritis](https://versusarthritis.org/research/research-achievements/escape-pain-exercise-to-reduce-the-pain-of-osteoarthritis)) |
| **Lower back pain (non-specific)** | Keep moving. Avoid prolonged loaded flexion if it hurts. Swap deadlift → hip bridge / band pull-through. Machine/supported rows instead of bent-over rows | Bird dog, dead bug, glute bridge, walking, hip hinge drill | Cauda equina signs (999); fever, unexplained weight loss, history of cancer, trauma, night pain (GP) | NICE NG59: consider group exercise (biomechanical, aerobic, mind–body or combination) ([NG59 summary](https://www.iatrox.com/shared/6a6018ea524dee74d26876c1/what-are-the-most-effective-types-of-exercise-programmes-for-patients-with-)); NG59 updated July 2026 ([Physitrack](https://www.physitrack.com/en-gb/insights/nice-low-back-pain-guideline-update-2026)) **[UNCERTAIN: confirm exact 2026 changes]** |
| **Shoulder pain / rotator cuff-related / "impingement"** | Reduce overhead loading. Swap overhead press → landmine or incline press, or band press below shoulder height. Neutral-grip pulls. Avoid behind-neck movements | Band external rotation, wall slides, band rows, isometric holds; build load gradually | Sudden weakness after fall (possible tear); shoulder pain with chest symptoms (999) | NHS physio leaflets: graded loading lets tendons adapt; pacing helps ([Leics Partnership](https://leicspart.nhs.uk/wp-content/uploads/2024/08/589-Rotator-cuff-related-shoulder-pain.pdf); [Berkshire](https://www.berkshirehealthcare.nhs.uk/media/109514468/rotator-cuff-physio-leaflet-berkshire-healthcare.pdf)) |
| **Frozen shoulder** | Do not force end range. Exclude overhead and behind-back loaded moves on the affected side | Pendulums, gentle range within comfort (≤4/10), rows in comfortable range | Night pain plus systemic symptoms; diabetes users: tell GP (frozen shoulder is more common with diabetes) **[UNCERTAIN—not sourced here]** | Pain ≤4/10 guidance from physio programme ([Pure Physio](https://purephysiotherapy.co.uk/exercise-plans/early-frozen-shoulder-exercise-programme)) |
| **Hip pain / hip OA** | Avoid deep flexion if painful. Wide-stance squats may be uncomfortable | Glute bridge, sit-to-stand, side-lying hip abduction, step-ups, pool | Groin pain after fall in older adult (possible fracture; can't weight-bear = 999/A&E) | NICE NG226 applies to hip OA ([NICE](https://www.nice.org.uk/guidance/ng226/chapter/Recommendations)) |
| **Hip replacement** | In the first 6–8 weeks (esp. posterior approach) avoid bending the hip >90°, crossing legs, twisting. Seat height so hip is above knee. **Follow surgical team's rules; exclude from the programme until discharged by them** | After clearance: sit-to-stand from raised seat, bridges, step-ups, walking | Dislocation signs: sudden severe pain, leg shortening/rotation (999) | NHS OT leaflet ([West Suffolk](https://www.wsh.nhs.uk/CMS-Documents/Patient-leaflets/OccupationalTherapy/5577-1JointProtectionfollowingHipSurgery-PosteriorApproach.pdf)). Precautions vary by approach and surgeon **[UNCERTAIN—don't encode as rules]** |
| **Wrist / hand (arthritis, carpal tunnel)** | Avoid weight-bearing in wrist extension (press-ups, planks on hands, all-fours). Use fists, push-up handles, DBs, forearm planks, machines. Use thick-grip or straps where grip hurts | Wall push with fists, forearm incline plank, machine chest press, band work with loops around forearms | Numbness/weakness in the hand that's worsening (GP) | Practitioner consensus **[UNCERTAIN—limited formal guidance]** |
| **Ankle / foot / plantar fasciitis** | Reduce impact and long standing. Swap brisk walking → cycling/pool for a period if painful | Heel raises building to slow single-leg heel raises with towel under toes (3 s up, 2 s hold, 3 s down; 12RM → 8RM over weeks), calf/foot strength | Sudden "kick in the calf" (Achilles rupture, A&E); calf swelling + pain (clot, 111) | Rathleff 2015: high-load heel raises beat stretching at 3 months ([BJSM](https://bjsm.bmj.com/content/49/10/638)) |
| **Neck pain** | Avoid loaded neck flexion (sit-ups pulling on head), heavy shrugs, overhead if aggravating | Rows, band pull-aparts, chin tucks, walking | Neck pain with arm weakness/numbness both sides, balance or bladder problems, after trauma (urgent) | **[UNCERTAIN—sourced from general physio practice; add specific NHS source before use]** |
| **Recent surgery (any)** | Pause the programme. Resume only after the surgical team's advice (often ~6 weeks for many operations; varies). Abdominal surgery: avoid heavy lifting and loaded core until cleared | Walking as advised by the team | Wound redness/discharge, fever, calf pain/swelling, breathlessness (111/999) | Defer to clinicians. App asks "Any surgery in the last 3 months?" → pause/GP |
| **Hypermobility (HSD/hEDS)** | Avoid end-range stretching and "hanging" on joints. Prefer controlled, slower tempo, mid-range strength, closed-chain work | Bands, slow tempo, balance/proprioception, Pilates-style control | Repeated dislocations, new neuro symptoms (GP) | NHS leaflets: strengthening and proprioception are among the most effective treatments; progress takes months ([NHS Grampian](https://www.nhsgrampian.org/globalassets/foidocument/foi-public-documents1---all-documents/What-is-joint-hypermobility-leaflet.pdf); [Hull](https://www.hey.nhs.uk/patient-leaflet/hypermobility-spectrum-disorders/)) |
| **Osteoporosis / osteopenia** | Avoid high-degree loaded spinal flexion (sit-ups, crunches, toe-touches), twisting under load. Avoid high impact if previous vertebral or multiple fragility fractures | Progressive strength + moderate impact (if no vertebral fracture), back-extensor work (prone Superman-lite, rows), balance. "Hinge not bend" | New sudden back pain after minor strain (possible vertebral fracture, GP) | ROS "Strong, Steady and Straight" consensus ([BJSM](https://bjsm.bmj.com/content/56/15/837); [Endocrine Soc PDF](https://www.endocrinology.org/media/3591/final-consensus-statement_strong-steady-and-straight_dec18.pdf)); LIFTMOR: supervised heavy training was safe and improved BMD in low bone mass ([JBMR](https://academic.oup.com/jbmr/article/33/2/211/7605709)). Heavy lifting should be supervised and not app-prescribed |
| **Pregnancy / postnatal** | **Exclude from the core programme and refer.** GLP-1 medicines are not used in pregnancy, so pregnancy may coincide with stopping **[confirm with clinical advisor]**. Postnatal: start gently; pelvic floor exercises daily; build back to strength 2×/week | Walking, pelvic floor, gentle strength once cleared (e.g., after 6–8 wk check) | Bleeding, pelvic pain, leaking, heaviness/dragging (GP/midwife) | UK CMO pregnancy and postnatal infographics ([GOV.UK](https://www.gov.uk/government/publications/physical-activity-guidelines-pregnancy-and-after-childbirth); [postnatal text](https://www.gov.uk/government/publications/physical-activity-guidelines-pregnancy-and-after-childbirth/physical-activity-for-women-after-childbirth-birth-to-12-months-text-of-the-infographic)) |
| **High blood pressure** | Don't hold breath (Valsalva). Exhale on effort. Avoid very heavy maximal lifts and long heavy isometrics. Moderate loads, more reps | Any controlled strength work. Isometric wall-sits and handgrip lower BP, the largest effect of any exercise mode (−8.2/−4 mmHg) ([Edwards BJSM 2023 via Healio](https://www.healio.com/news/primary-care/20230817/running-wall-sits-most-effective-exercises-for-high-blood-pressure)) | Resting BP >180/110: don't start until controlled and discuss with GP ([JOI](https://www.joionline.net/library/exercising-with-high-blood-pressure/)) **[UNCERTAIN—commonly cited threshold; confirm against UK source]**; severe headache, vision change (999) | Valsalva BP spikes during heavy lifts ([PubMed 3980383](https://pubmed.ncbi.nlm.nih.gov/3980383/)) |
| **Type 2 diabetes** | Hypo risk mainly if on **insulin or sulfonylureas (e.g., gliclazide)**. Check glucose before/after if advised; carry fast-acting carbs. Exercise can lower glucose for up to 48 h. Foot checks if neuropathy; avoid barefoot impact | Any. Strength + walking both help glucose | Hypo not resolving, confusion (999); foot wounds (GP/podiatry) | NHS Cambridge pre-exercise glucose leaflet ([CUH](https://cuh.nhs.uk/patient-information/pre-exercise-blood-glucose-levels)); Diabetes UK Know Diabetes ([Know Diabetes](https://www.knowdiabetes.org.uk/be-healthier/move-more/exercise-and-staying-safe/)); Frimley ([FHFT](https://www.fhft.nhs.uk/patients-and-visitors/patient-information-library/diabetes-and-exercise)). **Don't give glucose thresholds in-app.** Say "follow your diabetes team's advice" |
| **Heart conditions** (angina, previous MI, heart failure, arrhythmia, valve disease) | **GP / cardiac rehab first** if new or unstable. If stable and cleared: moderate effort (talk test), no breath-holding, longer warm-up/cool-down | Cardiac rehab is the right route post-event | Chest pain, breathlessness out of proportion, palpitations, dizziness → stop; 999 if it persists | BHF cardiac rehab resources and helpline 0808 802 1234 ([BHF](https://www.bhf.org.uk/informationsupport/publications/health-at-work/health-at-work-resistance-band-exercise-sheet)); Moving Medicine symptom statements ([BJSM](https://bjsm.bmj.com/content/56/8/427)) |
| **Balance problems / falls risk** | Support available for all standing exercises (counter/chair). Avoid eyes-closed and unsupported single-leg until progressed. Seated options. Avoid floor work if getting up is hard | Otago-style strength + balance; tandem stance → tandem walk; sit-to-stand | Recurrent or unexplained falls, dizziness, blackouts (GP) | Cochrane: exercise cuts falls rate 23%; balance + functional 24%; multicomponent ~34% ([Cochrane](https://www.cochrane.org/news/new-cochrane-review-assesses-benefits-and-harms-exercise-preventing-falls-older-people-living)); Otago: 3×/wk, ~35% falls reduction in high-risk groups ([TAMHSC](https://ebc.tamhsc.edu/program/otago-exercise-program)); ROS recommends ≥3 h/week strength-and-balance for fallers, ideally supervised ([BJSM blog](https://blogs.bmj.com/bjsm/2023/10/30/steady-and-straight-uk-consensus-statement-on-physical-activity-and-exercise-for-osteoporosis/)) |
| **Very high body weight / mobility limits** | Avoid floor transfers, prone and supine floor work, high-impact, unsupported single-leg. Use wall/counter versions, seated, pool. Check chair weight rating | Wall press, counter press, sit-to-stand from higher seat, seated band rows, pool walking, short walks | Calf swelling, breathlessness at rest, chest pain | General low-impact advice ([Healthline](https://www.healthline.com/health/obesity-and-mobility)); ACSM Exercise is Medicine mobility flyer ([ACSM](https://acsm.org/wp-content/uploads/EIM_Being-Active-With-Mobility-Limitations_Flyer_English.pdf)). Evidence base is thin **[UNCERTAIN]** |
| **Inflammatory arthritis (RA etc.)** | During flares: range of motion and gentle isometrics; reduce load. Between flares: normal progressive strength | Bands, pool, machines | Hot swollen joints, fever (rheumatology/GP) | Versus Arthritis general guidance ([VA](https://versusarthritis.org/about-arthritis/exercising-with-arthritis/exercises-for-healthy-joints/exercises-for-the-knees)) **[UNCERTAIN—RA-specific source not retrieved]** |
| **Fibromyalgia** | Start very low; progress slowly; avoid boom-and-bust. Pool is well tolerated | Aerobic + strengthening (land or water), 2–3×/week | Worsening symptoms for days after (scale back) | EULAR: exercise is the only "strong for" recommendation ([Aberdeen](https://www.abdn.ac.uk/iahs/academic/epidemiology/our-research/plain-language-summaries/fibromyalgia-management/); [Moving Medicine](https://movingmedicine.ac.uk/slide_extra/dyk-msk-eular-fibromyalgia/)) |
| **ME/CFS / long COVID with post-exertional malaise** | **Do not apply the standard progression.** NICE NG206 says don't offer programmes with fixed incremental increases (e.g., graded exercise therapy). Activity must stay within energy limits, overseen by an ME/CFS specialist team. **Recommend exclusion from the progression engine; offer "pace-only" mode or refer** | — | Any worsening after activity | NICE NG206 ([P3 Pharmacy](https://www.p3pharmacy.co.uk/news/813707-nice-publishes-delayed-guideline-on-me-cfs); [Technology Networks](https://www.technologynetworks.com/proteomics/news/health-body-scraps-graded-exercise-therapy-recommendation-for-mecfs-355265)) |

### 4.4 Pre-exercise screening for Landing

**Background:**
- PAR-Q+ is the standard self-screen. It starts with 7 yes/no questions, and a "yes" leads to follow-up questions ([PAR-Q+ 2025 form](https://southlake.ca/wp-content/uploads/2025/02/PARQPlus2025-Form-fillable.pdf)). The core seven cover:
  1. heart condition or high BP;
  2. chest pain at rest, in daily activities or during activity;
  3. loss of balance from dizziness, or loss of consciousness, in the last 12 months;
  4. another chronic condition diagnosed (other than heart disease/BP);
  5. currently taking prescribed medicines for a chronic condition;
  6. a bone, joint or soft-tissue problem that could be made worse by being more active;
  7. a doctor has said you should only do medically supervised activity.
  
  **[UNCERTAIN—wording paraphrased; license and use official text if reproducing]** ([topend summary](https://new.topendsports.com/fitness/parq.htm)).
- ACSM's 2015 screening algorithm focuses on current activity level, signs/symptoms or known cardiovascular/metabolic/renal disease, and desired intensity. It dropped risk-factor counting because it led to too many GP referrals ([ACSM blog](https://www.acsm.org/blog-detail/acsm-certified-blog/2018/02/01/exercise-preparticipation-screening-removing-barriers-initiating-exercise); [URI](https://digitalcommons.uri.edu/kinesiology_facpubs/180)).
- The UK consensus says routine clearance isn't needed for stable conditions ([Reid BJSM 2022](https://bjsm.bmj.com/content/56/8/427)).

**Recommended Landing flow (≈90 seconds):**
1. **"Stop and check first" questions.** Any YES → show "Please check with your GP (or cardiac/diabetes team) before starting the strength sessions. You can still use the habits." Offer to remind them in 1–2 weeks.
   - Chest pain/discomfort with activity or at rest, or unexplained breathlessness.
   - Fainting or blackouts, or dizziness that made you lose balance, in the last 12 months.
   - A heart condition, heart attack, heart surgery/stent, or heart failure diagnosed or changed in the last 12 months, or not yet assessed for exercise.
   - Surgery in the last 3 months, or a doctor told you not to exercise or to exercise only under supervision.
   - Currently pregnant, or gave birth in the last 12 weeks.
   - Told your blood pressure is very high and not yet controlled.
2. **"Gentler track" questions** (YES → pre-set preferences, not exclusion):
   - Type 2 diabetes on insulin or gliclazide-type tablets → show hypo safety card; "follow your diabetes team's advice on checking glucose".
   - Joint or back pain that affects daily life (choose areas: knees, hips, back, shoulders, wrists/hands, ankles/feet, neck) → set joint-load filters.
   - Osteoporosis or a broken bone from a minor fall since age 50 → filter loaded flexion and impact; "Strong, Steady, Straight" content.
   - Falls in the last year / worried about falling → supported standing, balance focus, seated option.
   - Difficulty getting up from the floor → no floor exercises.
   - ME/CFS or post-exertional symptoms → pacing mode, no auto-progression.
   - Very flexible joints / frequent sprains → control-focused ladder.
3. **Current activity level** (none / some / regular) → starting level.
4. **Re-screen** every 12 weeks and whenever the user reports a red-flag answer in a check-in.

---

## 5. How apps adapt plans

### 5.1 Substitution logic in practice
- **Fitbod** scores 800+ exercises on muscle recovery (0–100% per muscle, based on the last 48–72 h), available equipment (multiple gym profiles), and goal. It learns from skips, swaps, "too easy/hard" ratings and "recommend more/less/exclude" ([Fitbod help](https://help.fitbod.me/hc/en-us/articles/360004429814-How-Fitbod-Creates-Your-Workout); [Fitbod blog](https://fitbod.me/blog/fitbod-algorithm)).
- **Hevy / Strong** are loggers. Users build routines and the apps provide rest timers, warm-up/failure set tagging, and progress graphs. Adaptation is left to the user ([Hevy help](https://help.hevyapp.com/hc/en-us/articles/33106320824727-Everything-You-Need-to-Know-About-the-Hevy-App-2025-Features-Guide); [Hevy rest timer](https://www.hevyapp.com/features/workout-rest-timer/)).
- **Future / Caliber** use human coaches who write and modify plans based on logged progress, with chat and weekly reviews ([TechCrunch on Caliber](https://techcrunch.com/2020/10/13/caliber-with-2-2-million-in-seed-funding-launches-a-fitness-coaching-platform); [Garage Gym Reviews](https://www.garagegymreviews.com/equipment/caliber-strength-training)). **[UNCERTAIN—Future's specific adaptation mechanics not retrieved]**
- **Apple Fitness+** is a video library filtered by trainer, time (5–45 min), workout type and music, with many no/low-equipment strength classes. There's no individual progression engine ([Apple Newsroom](https://www.apple.com/newsroom/2020/12/apple-fitness-plus-the-future-of-fitness-launches-december-14/); [iMore](https://imore.com/how-filter-workouts-apple-fitness-plus)).
- **Joe Wicks / The Body Coach** offers low-impact, 10-min over-60s and chair workouts, with cues to swap moves (e.g., marching instead of jumping) and to shorten work intervals ([Fit&Well](https://www.fitandwell.com/news/joe-wicks-10-minute-joint-friendly-workout-is-perfect-for-active-seniors); [Fit&Well chair](https://fitandwell.com/news/over-60-build-upper-body-strength-with-this-10-minute-chair-workout)).
- **NHS Active 10** tracks brisk minutes in 10-minute units ([App Store](https://apps.apple.com/gb/app/nhs-active-10-walking-tracker/id1204295312)). **NHS Couch to 5K** is 3 runs/week over 9 weeks, and users are explicitly told it is fine to repeat a week ([Dudley ICB](https://dudleyci.co.uk/services/nhs-better-health-get-active-app); [HealthUnlocked C25K community](https://healthunlocked.com/couchto5k/posts/144009269/week-1-advice)). This "repeat a week, no shame" model fits Landing's tone.
- **Missed-session handling in newer apps:** iFIT eases users back with easier sessions after a missed week. Trainwell/MyoAdapt replan rather than pushing the calendar ([Trainwell blog](https://www.trainwell.net/blog/the-best-fitness-app-for-people-who-keep-quitting-workout-programs-2026); [iFIT TechCrunch](https://techcrunch.com/?p=2662804)).

### 5.2 UK GLP-1 provider programmes with exercise
- **Juniper (UK, launched 2022).** "Weight Reset Programme" with a **Strength Program** built on three pillars: Fuel (high protein), Burn (Zone 2 walking + short Zone 4), and Build (low-impact strength from 10 min/day), in a 10-level framework ([Eucalyptus blog](https://eucalyptus.health/blog/moving-beyond-weight-loss); [Second Nature comparison](https://www.secondnature.io/guides/weight-loss-programmes/juniper-vs-second-nature)).
- **Voy.** Health coaching (diet, exercise, lifestyle) plus app habit tracking. No dedicated strength programme was found ([Voy](https://start.joinvoy.com/how-it-works)). **[UNCERTAIN]**
- **Numan.** One-to-one coaching, with coaches who may be exercise physiologists. Knowledge Hub includes exercise content ([Numan help](https://help.numan.com/en/articles/11509962-what-s-included-in-numan-s-health-coaching); [Numan app](https://help.numan.com/en/articles/9925361-what-can-you-do-in-the-numan-app)).
- **Boots Online Doctor.** Coach App (with Liva Healthcare) offering nutrition and fitness coaching, plus a **free 12-month aftercare programme for people who have stopped medication**. This is the closest direct competitor to Landing's positioning ([Boots newsroom](https://www.boots-uk.com/newsroom/news/boots-online-doctor-launches-specialist-coaching-app-to-support-a-long-term-healthy-lifestyle/); [Kamcity](https://www.kamcity.com/namnews/uk-and-ireland/healthbeauty/boots-introduces-weight-loss-clinics/)).
- **Second Nature.** Habit coaching with registered dietitians, including "movement" guidance ([Second Nature](https://www.secondnature.io/weight-loss-medication)).
- **Gap:** none of these appear to offer a **setting-aware, joint-aware, pattern-based strength progression for the 12 months after stopping**. Landing's niche looks defensible. **[UNCERTAIN—based on public marketing pages]**

### 5.3 Autoregulation, deloads, session length, missed sessions — Landing rules

**Effort scale (in-app wording).** "How many more could you have done with good form?"
- "Lots (5+)" = too easy → next time go up a level or add reps.
- "A few (2–4)" = right.
- "1 or none" = hard → keep or go down.

RIR-based RPE scales were validated by Zourdos/Helms. Novices are less accurate, especially further from failure ([Zourdos 2016, PubMed](https://pubmed.ncbi.nlm.nih.gov/26049792/) **[UNCERTAIN—PMID inferred; see AUT repository](https://openrepository.aut.ac.nz/items/efef3b25-6701-4fb5-bb82-55fcd2a26027/full)**; [Stronger by Science](https://www.strongerbyscience.com/reps-in-reserve)). For deconditioned beginners, use plain-language bands and aim for 2–4 in reserve. Don't ask for failure (ACSM 2026: failure not needed) ([2 Minute Medicine](https://www.2minutemedicine.com/landmark-acsm-mcmaster-guidelines-simplify-resistance-training-for-longevity/)).

**Double progression.** Each exercise has a rep range (e.g., 8–12). When all sets hit 12 with "a few left", the next session adds load or moves up a level and restarts at 8.

**Deloads.** Coaches typically deload every 4–6 weeks for ~1 week with fewer sets and reps ([Bell et al. 2023 Delphi, Sports Med Open](https://shura.shu.ac.uk/32417/1/s40798-023-00633-0.pdf)). Those coaches work with athletes. For Landing's novices, the suggestions are:
- an "easier week" (1 set, same exercises) every ~6–8 weeks in Settle/Steady;
- an automatic easier week after illness, a red-zone pain report, or a missed week. **[Design judgement, not trial evidence]**

**Session length options.** Same patterns, different volume.
- **10 min:** 3 exercises × 1–2 sets, superset, minimal rest. Counts as a session in the Steady phase ([Spiering](https://pubmed.ncbi.nlm.nih.gov/33629972/)) and as a "top-up" in Land.
- **20–25 min (default):** 5–6 exercises × 2 sets.
- **30+ min:** 6–8 exercises × 2–3 sets + balance block.

The evidence supports "something beats nothing" ([Newswise ACSM](https://www.newswise.com/articles/acsm-unveils-landmark-2026-resistance-training-guidelines-first-update-in-17-years)) and exercise snacking ([Deakin](https://dro.deakin.edu.au/articles/journal_contribution/Feasibility_and_acceptability_of_a_remotely_delivered_home-based_pragmatic_resistance_exercise_snacking_intervention_in_community-dwelling_older_adults_a_pilot_randomised_controlled_trial/20584815)).

**Missed sessions (gentle, non-punishing).**
- **Missed 1 session:** slide the week; no change in level. Copy: "No problem — your next session is ready when you are."
- **Missed 1–2 weeks:** first session back at the same level, but 1 set. Return to normal if it felt "right".
- **Missed 3+ weeks:** step back one level per pattern for one week (strength is largely retained for weeks; see Spiering), then rebuild.
- **Never:** streak-loss shaming, "you failed", or calorie-burn compensation.
- **Two bad weeks in a row** → offer a 10-minute plan as the default.

**Pain-driven adaptation.**
- Amber → keep the level.
- Red → that exercise drops one level next time, and the user is offered a swap (same pattern, lower joint load).
- Red twice on the same body area → suggest GP/physio and switch that area to a "comfort mode" (lowest-load ladder).

**Progression gating for older or deconditioned users.**
- Balance progressions only advance if the user ticks "felt steady".
- Floor exercises are offered only if the user says they can get down and up comfortably.

---

## 6. Safety and regulatory notes (UK)

### 6.1 MHRA — staying a general wellness app
- **Medical device software** is software intended for the diagnosis, prevention, monitoring, treatment or alleviation of disease, or of an injury or disability, among other purposes. Whether an app qualifies depends on its **intended purpose**, as shown by its labelling, instructions, **promotional materials, app-store description and social media** ([MHRA guidance PDF](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1105233/Medical_device_stand-alone_software_including_apps.pdf); [GOV.UK collection](https://www.gov.uk/government/publications/medical-devices-software-applications-apps); [Stevens & Bolton](https://stevens-bolton.com/site/insights/articles/when-is-an-app-a-medical-device-mhra-publishes-new-guidance)).
- "In general, monitors for fitness, health or wellbeing are unlikely to be considered a medical device." Non-personalised general advice also generally falls outside the definition ([CMS law summary](https://cms.law/en/gbr/legal-updates/mhra-releases-updated-guidance-on-medical-device-software-and-apps); [SCL](https://www.scl.org/3340-dr-download-apps-and-wearables-as-medical-devices/)).
- **Disclaimers** such as "not a medical device" do not get an app out of regulation if its function and claims are medical ([CMS](https://cms.law/en/gbr/legal-updates/mhra-releases-updated-guidance-on-medical-device-software-and-apps)).
- Indicative words that push towards device status include "diagnose", "monitors", "calculates", "detects", "alarms", "interpret" and "treat" ([BSI](https://compliancenavigator.bsigroup.com/en/medicaldeviceblog/uk-guidance-on-stand-alone-medical-device-software-including-apps-issued)).

**Implications for Landing:**
1. **Do not** market it as preventing weight regain *as a treatment for obesity*, or as managing any condition (OA, diabetes, hypertension, osteoporosis). **[UNCERTAIN—"obesity" is a disease; claims like "helps prevent weight regain after Wegovy" may be borderline. Get a regulatory opinion. Safer framing: "build habits and strength for life after GLP-1s".]**
2. **Do not** generate exercise plans described as *rehabilitation* for a named diagnosis (e.g., "your knee OA programme"). Personalising exercises to a diagnosed condition in order to alleviate it is a medical purpose.
   - Instead, use **comfort preferences** ("Knees: go easy on deep bending and kneeling"), applied as generic filters.
   - Any condition-specific education should be non-personalised and signpost NHS or charity resources (Versus Arthritis, ROS, BHF, Diabetes UK).
3. **Do not** interpret biometrics: no "your BP is too high to train", no glucose thresholds, no heart-rate zone medical alerts. Screening should **signpost** ("check with your GP"), not decide clinical eligibility from measurements.
4. **Do not** adjust or advise on medication, including stopping or restarting GLP-1s.
5. **Advertising.** The CAP Code allows medical claims only for licensed medicines or conformity-marked devices. The ASA has acted against health apps for implied medical claims, and against BetterMe for exaggerating what an exercise programme could do ([ASA HealthTracker ruling](https://www.asa.org.uk/rulings/healthtracker-apps-a26-1327464-healthtracker-apps.html); [ASA Novabeyond ruling](https://www.asa.org.uk/rulings/novabeyond-ltd-a26-1327482-novabeyond-ltd.html); [Osborne Clarke on BetterMe](https://marketinglaw.osborneclarke.com/advertising-regulation/betterme-seek-better-ads-for-a-healthier-marketing-strategy/); [ASA healthcare claims advice](https://www.asa.org.uk/advice-online/healthcare-medicinal-claims.html)). Avoid "preserve your muscle", "stop regain" and percentage outcome claims without robust evidence for *Landing itself*.
6. **Clinical safety.** DCB0129/DCB0160 apply to health IT used in NHS settings. They probably don't apply to a consumer wellness app, but a lightweight hazard log is good practice. **[UNCERTAIN—check if pursuing NHS partnerships]**

### 6.2 Suggested wording

| Avoid | Prefer |
|---|---|
| "Treat your knee arthritis" / "Rehab plan" | "Knee-friendly options" / "Gentler on your knees" |
| "Prevent muscle loss from Mounjaro" | "Strength sessions to help you feel strong and keep active" |
| "Safe for heart patients" | "If you have a heart condition, check with your GP or cardiac team before starting" |
| "Your BP is too high to exercise" | "If you've been told your blood pressure is very high and it isn't yet under control, please speak to your GP before starting strength sessions" |
| "Push through the pain" | "Mild discomfort that settles by tomorrow is usually OK. If it's sharp or still there the next day, we'll make it easier" |
| "You missed your workout" | "Life happens — your next session is ready when you are" |
| "Burn off that meal" | "Moving helps your body and mood" |
| "Diagnose / monitor / detect" | "Track / note / notice" |

**Standard in-app safety footer (draft):**
> Landing offers general fitness and wellbeing guidance, not medical advice. If you have a health condition, are pregnant, have recently had surgery, or are unsure whether exercise is right for you, check with your GP first. Stop and call 999 if you have chest pain, severe breathlessness or feel faint. For other worrying symptoms, contact NHS 111.

---

## 7. Open questions / items to verify
1. Exact sets/reps/intensity text of the **ACSM 2026 resistance training position stand** (primary paper not accessible).
2. Exact physical activity recommendations in the **2025 ACLM/ASN/OMA/TOS GLP-1 advisory**.
3. Whether any **published RCT** (2025–2026) shows resistance training preserves lean mass during or after semaglutide/tirzepatide (LEAN-PREP and PRIME are ongoing).
4. A UK-specific source for the **180/110 mmHg** threshold. Consider simply using "very high and not yet controlled → GP".
5. Licensing for reproducing **PAR-Q+** wording (it is copyrighted; use own wording or license it).
6. A **regulatory opinion** on "after GLP-1 / weight regain" claims under MHRA intended purpose and CAP Code.
7. **Clinical sign-off** of the exercise library and red-flag copy by a HCPC-registered physiotherapist.
8. Specific details of **Future**'s and **Voy**'s exercise adaptation, which were not verified.
