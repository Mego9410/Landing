// Growth playbook pages (Oct 2026): the taper explainer, a comparison, and "stopping Mounjaro" week by week. They go
// live without an email of their own (email: false) so subscribers keep getting two guides a week; the Sunday digest
// can still include them. House rules apply in full: these pages explain and point to the prescriber; they never say
// how or when to stop, taper or change a dose.
import { S } from "./sources";
import type { Guide } from "./types";

const D = "2026-10-11";
const PRESCRIBER = "Steadie never advises on doses, tapering or stopping. Any change to your medicine is a decision for you and your prescriber, who knows your health and your dose.";
const MOVE_SAFELY = "Check with your GP first if you have a health condition. Stop if anything hurts, you feel dizzy or have chest pain.";
const WEEKS = ["stopping-mounjaro-week-1", "stopping-mounjaro-week-2", "stopping-mounjaro-week-3", "stopping-mounjaro-week-4"];

export const GROWTH: Guide[] = [
  {
    slug: "tapering-off-wegovy-and-mounjaro",
    title: "Tapering off Wegovy or Mounjaro: what it means and what to ask",
    metaTitle: "Tapering off Wegovy or Mounjaro: UK doses explained",
    description: "What tapering a weight-loss injection means, the UK dose steps for Wegovy and Mounjaro, what the evidence says, and the questions to ask your prescriber.",
    category: "Coming off",
    keywords: ["wegovy taper schedule", "tapering off mounjaro", "how to taper off wegovy", "mounjaro doses uk", "wegovy doses uk", "coming down on mounjaro dose"],
    published: D, updated: D, email: false,
    summary: [
      "Tapering means coming down through lower doses before stopping, rather than stopping from your current dose.",
      "Wegovy steps up from 0.25 mg to 2.4 mg a week (7.2 mg for some people); Mounjaro from 2.5 mg to 15 mg a week. A taper would move back down those steps.",
      "There's little trial evidence yet on whether tapering helps keep weight off. Whether to taper, and how, is for you and your prescriber.",
      "Whatever you decide, the habits you build while the medicine is still working are what carry you afterwards.",
    ],
    sections: [
      { heading: "What tapering means", blocks: [
        "When people talk about tapering a GLP-1, they mean coming down through lower doses over some weeks before the last injection, instead of stopping from the dose they're on. Some prescribers suggest it; others plan a straight stop. Both happen in UK practice.",
        { note: PRESCRIBER, tone: "butter" },
      ] },
      { heading: "The UK dose steps", blocks: [
        "Both medicines start low and step up every four weeks or more, so the body can get used to them. Knowing the steps makes a conversation about coming down easier to follow.",
        "**Wegovy (semaglutide), once a week:** 0.25 mg, then 0.5 mg, 1 mg, 1.7 mg and 2.4 mg. Since January 2026 the UK regulator has also approved 7.2 mg for some adults with obesity, after at least four weeks on 2.4 mg.",
        "**Mounjaro (tirzepatide), once a week:** 2.5 mg, then 5 mg, 7.5 mg, 10 mg, 12.5 mg and 15 mg, going up by 2.5 mg at a time.",
        "Your own dose may sit at any of these steps. Some people stay on a lower dose because it works well for them or because of side effects.",
      ] },
      { heading: "What the evidence says", blocks: [
        "The big trials looked at what happens when the medicine stops: in the STEP 1 extension, people regained about two-thirds of the weight they'd lost within a year of stopping semaglutide, and in SURMOUNT-4 people switched from tirzepatide to a placebo regained about 14% of their body weight over a year. You can see what those averages mean at your numbers with our [weight regain calculator](/tools/weight-regain).",
        "Those trials compared stopping with carrying on. They didn't test a gradual taper against a straight stop, and there isn't strong trial evidence yet either way. Anyone who tells you a taper definitely prevents regain is going further than the research.",
        "What the research does support is the routine around the medicine: protein, strength exercise, regular meals and support for at least a year after treatment ends, which is what NICE recommends.",
      ] },
      { heading: "Questions to ask your prescriber", blocks: [
        { list: [
          "Would you suggest coming down gradually, or stopping from my current dose? Why?",
          "If we taper, what would the steps be, and how long would each last?",
          "What should I look out for, and when should I get in touch?",
          "What follow-up will I have in the year after my last dose?",
          "If my weight starts to come back, what are my options?",
        ] },
        "There are more in [questions to ask before stopping](/guides/questions-to-ask-before-stopping-weight-loss-injections).",
      ] },
      { heading: "Using a taper well", blocks: [
        "If you do come down gradually, the weeks of a taper are a good time to practise the routines that will carry you afterwards, while appetite is still partly quietened:",
        { list: [
          "Build each meal around protein, about 25 to 30 g. See [protein after a GLP-1](/guides/protein-after-glp-1).",
          "Put two short strength sessions in the diary each week. See [strength training after a GLP-1](/guides/strength-training-after-glp-1).",
          "Learn your rough maintenance number with the [maintenance calorie calculator](/tools/maintenance-calories).",
          "Notice your hungriest time of day and plan a snack for it.",
        ] },
        "The same routines matter just as much if you stop at once. See [tapering vs stopping all at once](/guides/tapering-vs-stopping-weight-loss-injections).",
      ] },
    ],
    faqs: [
      { q: "Should I taper off Wegovy or Mounjaro?", a: "That's a decision for you and your prescriber. Some prescribers suggest coming down through lower doses; others plan a straight stop. There isn't strong trial evidence yet that one keeps weight off better than the other." },
      { q: "What are the Wegovy doses in the UK?", a: "Wegovy is weekly and steps up from 0.25 mg to 0.5 mg, 1 mg, 1.7 mg and 2.4 mg. Since January 2026, 7.2 mg is also approved for some adults with obesity after at least four weeks on 2.4 mg." },
      { q: "What are the Mounjaro doses in the UK?", a: "Mounjaro is weekly and goes from 2.5 mg up to 15 mg in steps of 2.5 mg: 2.5, 5, 7.5, 10, 12.5 and 15 mg." },
      { q: "Does tapering stop weight coming back?", a: "It hasn't been shown to in large trials. What helps most is the routine around it: protein, strength exercise, regular meals, everyday activity and support for a year after treatment." },
    ],
    sources: [S.nhsSemaglutide, S.nhsTirzepatide, S.mhraWegovy72, S.step1, S.surmount4, S.niceQs212, S.bdaResource],
    related: ["tapering-vs-stopping-weight-loss-injections", "questions-to-ask-before-stopping-weight-loss-injections", "stopping-wegovy", "stopping-mounjaro"],
  },
  {
    slug: "tapering-vs-stopping-weight-loss-injections",
    title: "Tapering vs stopping all at once: weight-loss injections compared",
    metaTitle: "Tapering vs stopping Wegovy or Mounjaro all at once",
    description: "Coming down gradually or stopping from your current dose: how the two approaches compare, what the evidence says, and what matters whichever you choose.",
    category: "Coming off",
    keywords: ["tapering vs stopping wegovy", "stop mounjaro cold turkey", "should i taper off mounjaro", "stopping wegovy suddenly", "taper or stop weight loss injection"],
    published: D, updated: D, email: false,
    summary: [
      "Tapering means stepping down through lower doses first; stopping all at once means the last injection is at your current dose.",
      "Neither has been shown in large trials to keep weight off better than the other.",
      "Your prescriber will weigh up your dose, side effects and health to suggest which suits you.",
      "The routines you build matter more than the route: protein, strength, regular meals and a calm eye on your weight trend.",
    ],
    sections: [
      { heading: "The two approaches side by side", blocks: [
        { list: [
          "**Tapering:** a few weeks or months on lower doses before the last injection. Appetite may return more gradually. It takes longer, and means more prescriptions and pens.",
          "**Stopping all at once:** the last injection is at your current dose. Simpler, and quicker. Because these medicines take several weeks to leave the body, the change is still gradual rather than overnight.",
        ] },
        "Both are used in UK practice. Neither is the right answer for everyone.",
        { note: PRESCRIBER, tone: "butter" },
      ] },
      { heading: "What the evidence says", blocks: [
        "The large trials, STEP 1 for semaglutide and SURMOUNT-4 for tirzepatide, compared stopping the medicine with carrying on. On average, much of the weight came back within a year of stopping. They didn't compare a gradual taper with a straight stop, so there isn't strong evidence yet that tapering changes the long-term result.",
        "You can see what the trial averages mean at your numbers with the [weight regain calculator](/tools/weight-regain).",
      ] },
      { heading: "Things your prescriber may weigh up", blocks: [
        { list: [
          "Your current dose and how long you've been on it.",
          "Side effects you had when stepping up.",
          "Other health conditions, especially type 2 diabetes.",
          "Cost and supply, if you pay privately.",
          "How confident you feel about the routines that will replace the medicine's effect.",
        ] },
        "See the full list of [questions to ask before stopping](/guides/questions-to-ask-before-stopping-weight-loss-injections), and how the UK dose steps work in [tapering off Wegovy or Mounjaro](/guides/tapering-off-wegovy-and-mounjaro).",
      ] },
      { heading: "What matters whichever you choose", blocks: [
        { list: [
          "**Start routines before the last dose**, while appetite is still quiet. See [building habits before you stop](/guides/building-habits-before-you-stop).",
          "**Protein at every meal** and **two short strength sessions a week**.",
          "**Know your rough maintenance calories**: try the [maintenance calorie calculator](/tools/maintenance-calories).",
          "**Watch a 7-day average**, not single weigh-ins, and act early and kindly if it drifts.",
        ] },
        { note: MOVE_SAFELY, tone: "sage" },
      ] },
    ],
    faqs: [
      { q: "Is it safe to stop Mounjaro or Wegovy all at once?", a: "Your prescriber is the right person to answer this for you. In the large trials, people stopped from their full dose. If you have type 2 diabetes, stopping can affect blood sugar, so talk to your diabetes team first." },
      { q: "Is tapering better than stopping cold turkey?", a: "There isn't strong trial evidence either way yet. What makes the biggest difference is the routine you build around stopping." },
      { q: "Will my appetite come back faster if I stop all at once?", a: "These medicines take several weeks to leave the body, so appetite returns gradually either way. Many people notice it building over the first month." },
    ],
    sources: [S.step1, S.surmount4, S.nhsSemaglutide, S.nhsTirzepatide, S.niceQs212, S.bdaResource],
    related: ["tapering-off-wegovy-and-mounjaro", "coming-off-glp-1", "first-month-after-stopping-glp-1", "questions-to-ask-before-stopping-weight-loss-injections"],
  },
  {
    slug: WEEKS[0],
    title: "Stopping Mounjaro, week 1: set up your anchors",
    metaTitle: "Stopping Mounjaro week 1: what to expect and what to do",
    description: "The first week after your last Mounjaro injection: why it often feels much the same, and the four small routines worth setting up now.",
    category: "Coming off",
    keywords: ["stopping mounjaro week 1", "first week after last mounjaro injection", "after last mounjaro dose", "what happens week after stopping mounjaro"],
    published: D, updated: D, email: false,
    summary: [
      "Tirzepatide lasts for days after each injection, so the first week after your last dose often feels much the same.",
      "That calm is the best time to set up routines: protein at breakfast, a meal rhythm, two strength sessions and a daily walk.",
      "Expect changes to arrive over weeks, not overnight.",
    ],
    sections: [
      { heading: "What's happening this week", blocks: [
        "Mounjaro (tirzepatide) is a once-weekly medicine that stays in the body for days. In the first week after your last injection there's still plenty of it working, so appetite usually stays quiet. Most people notice little change yet.",
        "This guide is part of a week-by-week series. For the whole first month on one page, see [the first month after stopping](/guides/first-month-after-stopping-glp-1).",
        { note: PRESCRIBER, tone: "butter" },
      ] },
      { heading: "This week's four anchors", blocks: [
        { list: [
          "**Protein at breakfast.** Eggs, Greek yoghurt, or overnight oats made with milk. See [high-protein breakfasts](/guides/high-protein-breakfasts-uk).",
          "**A meal rhythm.** Three meals at roughly the same times. It makes hunger easier to predict when it comes back.",
          "**Two strength sessions in the diary.** Twenty minutes is enough. See [strength training after a GLP-1](/guides/strength-training-after-glp-1).",
          "**A daily walk.** Ten minutes after a meal counts.",
        ] },
      ] },
      { heading: "A simple day in week 1", blocks: [
        { list: [
          "Breakfast: two eggs on wholegrain toast, or yoghurt with berries and oats.",
          "Lunch: a palm-sized portion of chicken, fish, tofu or beans, with salad or veg and some carbs.",
          "Afternoon: a ten-minute walk.",
          "Dinner: protein first, then veg, then carbs, at a similar time each day.",
        ] },
        "It doesn't need to be perfect. The point is a pattern you can lean on in weeks 2 and 3.",
      ] },
      { heading: "Before week 2", blocks: [
        "Know your rough maintenance calories: it shows the gap between your old normal and the new one. Try the [maintenance calorie calculator](/tools/maintenance-calories). Then read [week 2](/guides/stopping-mounjaro-week-2).",
        { note: MOVE_SAFELY, tone: "sage" },
      ] },
    ],
    faqs: [
      { q: "Will I feel different the week after my last Mounjaro injection?", a: "Usually not much. Tirzepatide lasts for days in the body, so most people notice changes building over the following weeks instead." },
      { q: "What should I eat in the first week after stopping Mounjaro?", a: "Regular meals built around protein, about 25 to 30 g each, with fibre from veg, beans, oats and wholegrains." },
    ],
    sources: [S.nhsTirzepatide, S.surmount4, S.bdaResource, S.nhsActivity],
    related: ["stopping-mounjaro-week-2", "stopping-mounjaro", "first-month-after-stopping-glp-1", "protein-after-glp-1"],
  },
  {
    slug: WEEKS[1],
    title: "Stopping Mounjaro, week 2: when hunger starts to stir",
    metaTitle: "Stopping Mounjaro week 2: hunger coming back",
    description: "Two weeks after your last Mounjaro injection: why hunger may start to return, how to spot your hungriest time, and a simple plan for it.",
    category: "Coming off",
    keywords: ["stopping mounjaro week 2", "two weeks after stopping mounjaro", "hunger after stopping mounjaro", "appetite back after mounjaro"],
    published: D, updated: D, email: false,
    summary: [
      "As tirzepatide clears, many people notice hunger starting to stir in the second week.",
      "It's expected, and it isn't a sign anything has gone wrong.",
      "Find your hungriest time of day and plan a protein snack for it.",
    ],
    sections: [
      { heading: "What's happening this week", blocks: [
        "By the second week after your last injection, there's less tirzepatide in your body. Some people start to feel hungrier, or find portions that felt big now feel ordinary. Others notice little until week 3. Both are normal.",
        "More on why in [appetite after stopping](/guides/appetite-after-stopping-glp-1).",
        { note: PRESCRIBER, tone: "butter" },
      ] },
      { heading: "Find your hungry hour", blocks: [
        "For a few days, notice when hunger is loudest. For many people it's mid-afternoon or the evening. Once you know, you can plan for it instead of meeting it unprepared.",
        { list: [
          "**Mid-afternoon:** have a protein snack ready, such as yoghurt, a boiled egg, edamame or a small handful of nuts. See [high-protein snacks](/guides/high-protein-snacks-uk).",
          "**Evenings:** eat dinner a little earlier, and make it protein first.",
          "**Weekends:** a later breakfast can make lunch easier; plan both.",
        ] },
      ] },
      { heading: "Fullness takes time", blocks: [
        "Fullness signals take a while to arrive. Eating sitting down, without a screen, and pausing for ten minutes before seconds gives them a chance. See [eating slowly and fullness](/guides/eating-slowly-and-fullness).",
      ] },
      { heading: "Before week 3", blocks: [
        "Keep the two strength sessions going: they help protect muscle as appetite returns. Then read [week 3](/guides/stopping-mounjaro-week-3), or go back to [week 1](/guides/stopping-mounjaro-week-1).",
      ] },
    ],
    faqs: [
      { q: "When does hunger come back after stopping Mounjaro?", a: "Many people notice it starting in the second or third week after their last injection, building over the first month. It varies from person to person." },
      { q: "Is it normal to feel hungrier two weeks after stopping Mounjaro?", a: "Yes. As the medicine leaves your body, appetite returns towards how it was before. Planning protein-rich meals and a snack for your hungriest time helps." },
    ],
    sources: [S.nhsTirzepatide, S.surmount4, S.bdaResource, S.jointAdvisory],
    related: ["stopping-mounjaro-week-3", "stopping-mounjaro-week-1", "appetite-after-stopping-glp-1", "stopping-mounjaro"],
  },
  {
    slug: WEEKS[2],
    title: "Stopping Mounjaro, week 3: food noise and favourite foods",
    metaTitle: "Stopping Mounjaro week 3: food noise coming back",
    description: "Three weeks after your last Mounjaro injection: food noise and old favourites may come back. Calm ways to handle it, including if-then plans.",
    category: "Coming off",
    keywords: ["stopping mounjaro week 3", "food noise after stopping mounjaro", "cravings after mounjaro", "three weeks after stopping mounjaro"],
    published: D, updated: D, email: false,
    summary: [
      "By week 3 many people notice more thoughts about food, and favourites they'd gone off appealing again.",
      "That's biology returning, not a lack of effort.",
      "A simple if-then plan for your trickiest moment makes it easier to handle.",
    ],
    sections: [
      { heading: "What's happening this week", blocks: [
        "Three weeks after the last injection, much of the medicine's effect on appetite has faded for many people. \"Food noise\", the background chatter about food, can get louder, and foods like sweets or rich dishes may appeal again.",
        "See [cravings after stopping](/guides/cravings-after-stopping-glp-1) for more on why.",
        { note: PRESCRIBER, tone: "butter" },
      ] },
      { heading: "Make an if-then plan", blocks: [
        "An if-then plan links a tricky moment to one small action you've chosen in advance. Pick your loudest moment and write one down:",
        { list: [
          "If I want something sweet after dinner, then I'll have yoghurt with berries first and see how I feel in ten minutes.",
          "If I'm snacking while cooking, then I'll have a glass of water and a handful of the veg I'm chopping.",
          "If I've had a hard day, then I'll go for a ten-minute walk before deciding what to eat.",
        ] },
        "It doesn't mean never having the food you want. It means you decide, rather than the noise.",
      ] },
      { heading: "Meals out and takeaways", blocks: [
        "Choose a protein-led main, share a side, and stop at comfortable rather than full. See [eating out after a GLP-1](/guides/eating-out-after-glp-1).",
      ] },
      { heading: "Before week 4", blocks: [
        "Keep up the meal rhythm and the strength sessions. Then read [week 4](/guides/stopping-mounjaro-week-4), or go back to [week 2](/guides/stopping-mounjaro-week-2).",
        { note: "If thoughts about food or your body start to feel overwhelming, talk to your GP, or contact Beat, the UK's eating disorder charity.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "Does food noise come back after stopping Mounjaro?", a: "For many people, yes, over the first few weeks as tirzepatide leaves the body. An if-then plan for your trickiest moment and regular protein-rich meals help." },
      { q: "Why do I want sweet foods again after stopping Mounjaro?", a: "GLP-1 medicines often quieten interest in rich and sweet foods. As the medicine clears, those preferences can come back towards how they were before." },
    ],
    sources: [S.nhsTirzepatide, S.surmount4, S.bdaResource, S.beat],
    related: ["stopping-mounjaro-week-4", "stopping-mounjaro-week-2", "cravings-after-stopping-glp-1", "stopping-mounjaro"],
  },
  {
    slug: WEEKS[3],
    title: "Stopping Mounjaro, week 4: your new normal and your weight trend",
    metaTitle: "Stopping Mounjaro week 4: a month on, what now?",
    description: "A month after your last Mounjaro injection: how to read your weight trend calmly, review what's working, and plan the months ahead.",
    category: "Coming off",
    keywords: ["stopping mounjaro week 4", "one month after stopping mounjaro", "weight gain after stopping mounjaro first month", "a month off mounjaro"],
    published: D, updated: D, email: false,
    summary: [
      "By the end of the first month, many people say their appetite feels close to how it was before treatment.",
      "Look at a 7-day average weight, not single days, which can jump by a kilo or more.",
      "A short review now (what's easy, what's hard, one change for next month) keeps things steady.",
    ],
    sections: [
      { heading: "What's happening this week", blocks: [
        "Four weeks after the last injection, most of the tirzepatide has left the body for many people, and appetite is closer to its old level. This is when routines matter most, because they carry you when motivation dips.",
        { note: PRESCRIBER, tone: "butter" },
      ] },
      { heading: "Reading your weight trend", blocks: [
        "Day-to-day weight jumps around with water, salt, sleep and hormones. A 7-day average shows the real trend. Many people find it helps to set a small \"steady zone\" just above their lowest weight and only act if the average sits above it for a couple of weeks. See [weight after stopping](/guides/weight-after-stopping-glp-1).",
        "If weighing doesn't help you, it's fine to skip it and track habits, hunger and how your clothes fit instead.",
        "Curious what the research found about regain? The [weight regain calculator](/tools/weight-regain) shows the trial averages at your numbers, and what helps.",
      ] },
      { heading: "Your one-month review", blocks: [
        { list: [
          "Which routines felt easy? Keep them exactly as they are.",
          "Which felt hard? Make them smaller rather than dropping them.",
          "What's one change for next month? Just one.",
        ] },
      ] },
      { heading: "The months ahead", blocks: [
        "NICE says people should be offered support for at least a year after a weight-loss medicine ends. Ask your GP or weight service what's available. Our [stopping Mounjaro guide](/guides/stopping-mounjaro) covers the bigger picture, and you can go back to [week 3](/guides/stopping-mounjaro-week-3) any time.",
        { note: MOVE_SAFELY, tone: "sage" },
      ] },
    ],
    faqs: [
      { q: "Is it normal to put on weight a month after stopping Mounjaro?", a: "Some regain is common after stopping. Look at a 7-day average rather than single days, and if it's drifting, go back to the basics: protein first, regular meals, strength twice a week and more walking. Talk to your GP if you're worried." },
      { q: "How long does Mounjaro take to leave your body?", a: "Tirzepatide is taken once a week and lasts for days after each injection, so it takes several weeks after the last dose to clear. Most people notice changes gradually over the first month." },
    ],
    sources: [S.nhsTirzepatide, S.surmount4, S.surmount4Acc, S.niceQs212, S.bdaResource],
    related: ["stopping-mounjaro", "weight-after-stopping-glp-1", "stopping-mounjaro-week-3", "keep-weight-off-after-glp-1"],
  },
];
