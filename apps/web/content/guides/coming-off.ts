import { S } from "./sources";
import type { Guide } from "./types";

const D = "2026-10-06";

export const COMING_OFF: Guide[] = [
  {
    slug: "coming-off-glp-1",
    pillar: true,
    title: "Coming off a GLP-1: what to expect and how to keep the weight off",
    metaTitle: "Coming off GLP-1 weight-loss jabs: a UK guide",
    description: "Thinking about coming off Wegovy, Mounjaro or another GLP-1? What happens to appetite and weight, what to plan with your prescriber, and the habits that help.",
    category: "Coming off",
    keywords: ["coming off glp-1", "how to get off glp-1", "stopping weight loss injections", "coming off weight loss jab", "life after weight loss injections"],
    published: D, updated: D,
    summary: [
      "Stopping a GLP-1 is a decision to make with your prescriber, who can tell you how and when to stop safely.",
      "Appetite usually returns within weeks, and in trials most people regained a good share of the weight within a year. That's biology, not a lack of effort.",
      "Protein at every meal, two short strength sessions a week, regular meals and plenty of walking are the habits with the best evidence for holding steady.",
      "NICE says people should be offered at least a year of support after a weight-loss medicine ends. Plan yours before your last dose.",
    ],
    sections: [
      { heading: "First, the part only your prescriber can do", blocks: [
        "If you're searching for how to get off a GLP-1, the most important step is a conversation with whoever prescribes it: your GP, a specialist weight service or an online pharmacy's prescriber. They know your dose, your health and any other medicines you take, and they can tell you how and when to stop.",
        "This guide doesn't tell you how to stop, reduce or change a dose. It covers everything around that decision: what tends to happen afterwards, what to ask, and the routines that make the year after easier.",
        { note: "If you take a GLP-1 for type 2 diabetes, stopping can affect your blood sugar. Talk to your diabetes team before changing anything.", tone: "butter" },
      ] },
      { heading: "What usually happens when you stop", blocks: [
        "GLP-1 medicines such as semaglutide (Wegovy) and tirzepatide (Mounjaro) quieten appetite and slow how quickly your stomach empties. They leave your body over several weeks, and as they do, hunger and interest in food usually come back. Read more in [appetite after stopping](/guides/appetite-after-stopping-glp-1).",
        "In the STEP 1 trial extension, people who stopped semaglutide had regained about two-thirds of the weight they'd lost within a year. In SURMOUNT-4, people switched from tirzepatide to a placebo regained about 14% of their body weight over a year. A review of 37 studies in The BMJ found an average regain of about 0.4 kg a month after stopping.",
        "Those are averages, not predictions for you. In SURMOUNT-4, about one in six people who stopped regained less than a quarter of what they'd lost. There's more detail in [what happens when you stop](/guides/what-happens-when-you-stop-weight-loss-injections).",
      ] },
      { heading: "Plan the year after, before your last dose", blocks: [
        "NICE's quality standard says people should be offered support for at least a year after a weight-loss medicine or programme ends, including help building routines and a plan for what to do if weight starts to return.",
        "The weeks before and just after your last dose are a good time to set things up, while appetite is still quiet:",
        { list: [
          "Agree a plan with your prescriber, including follow-up and who to contact if you're struggling.",
          "Choose a few go-to breakfasts and lunches built around protein.",
          "Start two short strength sessions a week, if they're right for you.",
          "Decide how you'll keep an eye on things: a weekly weigh-in, how your clothes fit, or how hungry you feel.",
        ] },
        "Our guide to [building habits before you stop](/guides/building-habits-before-you-stop) goes step by step, and there's a list of [questions to ask your prescriber](/guides/questions-to-ask-before-stopping-weight-loss-injections).",
      ] },
      { heading: "The habits with the best evidence", blocks: [
        "**Protein at every meal.** It helps you feel fuller and helps protect muscle. A palm-sized portion, about 25 to 30 g, at each meal is a simple target. See [protein after a GLP-1](/guides/protein-after-glp-1).",
        "**Strength exercise twice a week.** Some of the weight lost on these medicines is lean mass, which includes muscle. Strength work helps you keep and rebuild it. In one trial, people who exercised alongside treatment kept more weight off after stopping. See [strength training after a GLP-1](/guides/strength-training-after-glp-1).",
        "**Regular meals with fibre.** A rough daily rhythm makes hunger easier to predict, and fibre from beans, oats, wholegrains, fruit and veg adds fullness.",
        "**Plenty of everyday movement.** Walking does steady work between strength sessions. See [walking and everyday activity](/guides/walking-to-keep-weight-off).",
        "**Sleep and stress.** Short nights and stressful weeks turn up appetite for many people. See [sleep, stress and appetite](/guides/sleep-stress-and-appetite).",
      ] },
      { heading: "Watching your weight without worrying about it", blocks: [
        "Day-to-day weight jumps around by a kilo or more with water, salt, sleep and hormones. A 7-day average shows the real trend. Many people find it helpful to set a small \"steady zone\" just above their lowest weight and only act if the average sits above it for a couple of weeks. More in [weight after stopping](/guides/weight-after-stopping-glp-1).",
        "If weighing yourself makes things harder, you don't have to. Habits, hunger and how your clothes fit are useful signals too.",
      ] },
      { heading: "If weight starts to come back", blocks: [
        "It's common, and it's nothing to blame yourself for. Go back to the basics that worked: protein first, regular meals, two strength sessions and more walking. Talk to your prescriber or GP if you're worried; they can talk you through your options, including whether further treatment is right for you.",
        { note: "If eating feels hard or out of control, Beat, the UK's eating disorder charity, has a helpline you can talk to.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "How do I come off a GLP-1 safely?", a: "Talk to your prescriber. They'll tell you how and when to stop based on your dose, your health and any other medicines. Steadie doesn't give advice about stopping or changing doses, but can help with the food, movement and habits around it." },
      { q: "Will I put weight back on after stopping?", a: "Many people do regain some weight: in trials, around two-thirds of the weight lost came back within a year on average. Some people hold most of it. Protein, strength exercise, regular meals and activity give you the best chance." },
      { q: "How long does it take for appetite to come back?", a: "Usually within a few weeks of the last dose, as the medicine leaves your body. Semaglutide and tirzepatide take several weeks to clear completely." },
      { q: "Is there support after stopping on the NHS?", a: "NICE says people should be offered at least 12 months of support after a weight-loss medicine ends. Ask your prescriber or GP what's available locally." },
    ],
    sources: [S.step1, S.surmount4, S.surmount4Acc, S.bmjReview, S.niceQs212, S.niceNews, S.lundgren, S.bdaResource, S.beat],
    related: ["what-happens-when-you-stop-weight-loss-injections", "questions-to-ask-before-stopping-weight-loss-injections", "keep-weight-off-after-glp-1", "appetite-after-stopping-glp-1"],
  },
  {
    slug: "what-happens-when-you-stop-weight-loss-injections",
    title: "What happens when you stop weight-loss injections?",
    metaTitle: "What happens when you stop weight-loss injections?",
    description: "What the trials show about appetite, weight and health after stopping Wegovy or Mounjaro, in plain English, and what helps.",
    category: "Coming off",
    keywords: ["what happens when you stop wegovy", "what happens when you stop mounjaro", "stopping weight loss injections side effects", "weight regain after stopping semaglutide"],
    published: D, updated: D,
    summary: [
      "Appetite usually comes back over the weeks after your last dose as the medicine leaves your body.",
      "In trials, people regained around two-thirds of the weight they'd lost within a year of stopping, on average.",
      "Improvements in blood pressure, cholesterol and blood sugar tended to fade as weight returned.",
      "Some people keep most of their loss. Habits around protein, strength and routine make a real difference.",
    ],
    sections: [
      { heading: "Your appetite returns", blocks: [
        "GLP-1 medicines mimic a gut hormone that tells your brain you've had enough and slows your stomach. When you stop, those effects fade over several weeks. Semaglutide (Wegovy, Ozempic) lasts about a week in the body between doses and tirzepatide (Mounjaro) about five days, so it takes a few weeks for them to clear.",
        "Most people notice hunger, portion sizes and \"food noise\" creeping back during this time. It can feel sudden after months of not thinking about food. It's expected, and planning for it helps. See [appetite after stopping](/guides/appetite-after-stopping-glp-1).",
      ] },
      { heading: "Weight: what the research found", blocks: [
        { list: [
          "**STEP 1 extension (semaglutide):** people lost an average of 17.3% of their weight over 68 weeks. A year after stopping, they had regained 11.6 percentage points, leaving them 5.6% below where they started.",
          "**SURMOUNT-4 (tirzepatide):** after 36 weeks on treatment, people switched to placebo regained about 14% of their body weight over the next year, while those who carried on lost a further 5.5%.",
          "**A review of 37 studies in The BMJ:** average regain was about 0.4 kg a month after stopping, faster than after diet and activity programmes on their own.",
        ] },
        "The lifestyle support in STEP 1 stopped at the same time as the medicine. That's one reason NICE now recommends at least a year of support after treatment ends.",
      ] },
      { heading: "Health markers", blocks: [
        "In these trials, improvements in blood pressure, cholesterol and blood sugar largely went back towards where they started as weight returned. If you have other health conditions, your GP may want to check these after you stop.",
      ] },
      { heading: "Not everyone regains", blocks: [
        "Averages hide a range. In SURMOUNT-4, about one in six people who stopped regained less than a quarter of the weight they'd lost. People who had exercised during treatment have been shown to keep more weight off after stopping.",
        "So it's worth putting routines in place: [protein at every meal](/guides/protein-after-glp-1), [strength exercise](/guides/strength-training-after-glp-1) and [regular, filling meals](/guides/keep-weight-off-after-glp-1).",
      ] },
      { heading: "Side effects when stopping", blocks: [
        "Stopping a GLP-1 doesn't usually cause withdrawal symptoms in the way some medicines do. The changes people notice are mostly the medicine's effects wearing off: more hunger, bigger portions, and for some, digestion going back to how it was. If anything worries you, talk to your prescriber or pharmacist.",
      ] },
    ],
    faqs: [
      { q: "How quickly does weight come back after stopping Wegovy?", a: "In the STEP 1 trial, most of the regain happened in the first months after stopping, and about two-thirds of the lost weight had returned after a year on average. Everyone is different." },
      { q: "Does Mounjaro weight come back?", a: "In SURMOUNT-4, people switched from tirzepatide to placebo regained about 14% of their body weight over a year on average. Some regained much less." },
      { q: "Are there withdrawal symptoms?", a: "Not usually. Most changes are the medicine's effects wearing off, especially appetite returning. Ask your pharmacist or prescriber about anything that concerns you." },
    ],
    sources: [S.step1, S.surmount4, S.surmount4Acc, S.bmjReview, S.oxfordReview, S.niceQs212, S.lundgren, S.nhsSemaglutide, S.nhsTirzepatide],
    related: ["coming-off-glp-1", "appetite-after-stopping-glp-1", "weight-after-stopping-glp-1", "keep-weight-off-after-glp-1"],
  },
  {
    slug: "stopping-wegovy",
    title: "Stopping Wegovy: what to expect and how to stay steady",
    metaTitle: "Stopping Wegovy: what to expect afterwards (UK)",
    description: "Coming off Wegovy (semaglutide)? What happens to hunger and weight, the NHS two-year limit, and the habits that help you hold steady.",
    category: "Coming off",
    keywords: ["stopping wegovy", "coming off wegovy", "life after wegovy", "wegovy weight regain", "wegovy 2 year limit nhs"],
    published: D, updated: D,
    summary: [
      "Wegovy is semaglutide for weight management. Your prescriber will tell you how and when to stop.",
      "Hunger usually returns over the weeks after your last dose; semaglutide takes several weeks to leave your body.",
      "On the NHS, NICE recommends Wegovy for up to two years.",
      "Protein, strength exercise and regular meals are the best-evidenced ways to hold on to what you've achieved.",
    ],
    sections: [
      { heading: "Why people stop Wegovy", blocks: [
        "Some people reach the end of an NHS course, which NICE limits to up to two years. Others stop because of cost, side effects, pregnancy plans, or because they and their prescriber decide it's time. Whatever the reason, the decision and the way you stop are for you and your prescriber.",
        { note: "Wegovy is a trademark of Novo Nordisk. Steadie isn't connected with Novo Nordisk and doesn't give advice about medication.", tone: "sky" },
      ] },
      { heading: "The first weeks after your last dose", blocks: [
        "Semaglutide stays in the body for about a week after each dose and takes several weeks to clear completely. As it does, most people notice their appetite and interest in food returning. Having easy, protein-rich meals ready before this happens makes it much easier. See [appetite after stopping](/guides/appetite-after-stopping-glp-1).",
      ] },
      { heading: "What the STEP 1 trial showed", blocks: [
        "In the STEP 1 extension, people lost an average of 17.3% of their body weight on semaglutide. A year after stopping, they'd regained about two-thirds of it. Their lifestyle support stopped at the same time, which is one reason NICE now recommends at least a year of support afterwards. Read more in [what happens when you stop](/guides/what-happens-when-you-stop-weight-loss-injections).",
      ] },
      { heading: "Your plan for life after Wegovy", blocks: [
        { list: [
          "Talk to your prescriber about stopping, follow-up and who to contact.",
          "Build meals around protein: [how much and where from](/guides/protein-after-glp-1).",
          "Start two short [strength sessions](/guides/strength-training-after-glp-1) a week.",
          "Keep walking, and keep meals regular.",
          "Use a 7-day average, not single weigh-ins, to [keep an eye on weight](/guides/weight-after-stopping-glp-1).",
        ], ordered: true },
      ] },
    ],
    faqs: [
      { q: "How long can I take Wegovy on the NHS?", a: "NICE recommends semaglutide for weight management for up to two years, through specialist weight management services. Check with your prescriber what applies to you." },
      { q: "Can I just stop taking Wegovy?", a: "Talk to your prescriber before stopping. They'll advise you on how and when, and on follow-up." },
      { q: "Will I regain weight after Wegovy?", a: "Many people regain some weight; in the STEP 1 trial it was about two-thirds of the loss within a year, on average. Habits around protein, strength and routine help." },
    ],
    sources: [S.step1, S.niceTa875, S.niceQs212, S.nhsSemaglutide, S.bdaResource],
    related: ["coming-off-glp-1", "nhs-weight-loss-injections-time-limit", "appetite-after-stopping-glp-1", "protein-after-glp-1"],
  },
  {
    slug: "stopping-mounjaro",
    title: "Coming off Mounjaro: what to expect and how to hold steady",
    metaTitle: "Coming off Mounjaro: what to expect (UK guide)",
    description: "Stopping Mounjaro (tirzepatide)? What the SURMOUNT-4 trial found, how appetite changes, and practical habits for the months after.",
    category: "Coming off",
    keywords: ["coming off mounjaro", "stopping mounjaro", "life after mounjaro", "mounjaro weight regain", "what happens when you stop mounjaro"],
    published: D, updated: D,
    summary: [
      "Mounjaro is tirzepatide. Your prescriber will tell you how and when to stop.",
      "Appetite usually returns within a few weeks of your last dose.",
      "In SURMOUNT-4, people who stopped regained about 14% of their body weight over a year on average; about one in six regained much less.",
      "Protein, strength and steady routines give you the best chance of holding on to your progress.",
    ],
    sections: [
      { heading: "About Mounjaro", blocks: [
        "Tirzepatide acts on two gut hormone signals, GLP-1 and GIP, which reduce appetite. It stays in the body for about five days between doses and clears over a few weeks after the last one.",
        { note: "Mounjaro is a trademark of Eli Lilly. Steadie isn't connected with Eli Lilly and doesn't give advice about medication.", tone: "sky" },
      ] },
      { heading: "What SURMOUNT-4 found", blocks: [
        "After 36 weeks on tirzepatide, people were split into two groups. Those who carried on lost a further 5.5% of their weight over the next year. Those switched to a placebo regained about 14%. But about one in six of the people who stopped regained less than a quarter of what they'd lost, and their health markers stayed largely steady.",
        "That's the honest picture: regain is common, and it isn't inevitable.",
      ] },
      { heading: "Before you stop", blocks: [
        "Agree the plan with your prescriber, including follow-up. Then use the weeks around your last dose, while appetite is still quiet, to set up routines. See [building habits before you stop](/guides/building-habits-before-you-stop) and [questions to ask your prescriber](/guides/questions-to-ask-before-stopping-weight-loss-injections).",
      ] },
      { heading: "The months after", blocks: [
        { list: [
          "Protein at every meal: [how much and where from](/guides/protein-after-glp-1).",
          "Two short [strength sessions](/guides/strength-training-after-glp-1) a week.",
          "Regular meals, with fibre, so hunger is easier to predict.",
          "A plan for evenings and weekends, when [cravings](/guides/cravings-after-stopping-glp-1) are often strongest.",
          "A calm way to [watch your weight](/guides/weight-after-stopping-glp-1): a 7-day average and a small steady zone.",
        ] },
      ] },
    ],
    faqs: [
      { q: "How quickly does appetite come back after Mounjaro?", a: "Usually within a few weeks of the last dose, as tirzepatide clears from the body." },
      { q: "Do you gain weight after stopping Mounjaro?", a: "Many people regain some weight. In SURMOUNT-4 the average was about 14% of body weight over a year, but about one in six people regained much less." },
      { q: "Should I reduce my Mounjaro dose before stopping?", a: "That's a question for your prescriber. Steadie doesn't give advice about doses or stopping medicines." },
    ],
    sources: [S.surmount4, S.surmount4Acc, S.niceTa1026, S.niceQs212, S.nhsTirzepatide],
    related: ["coming-off-glp-1", "what-happens-when-you-stop-weight-loss-injections", "cravings-after-stopping-glp-1", "strength-training-after-glp-1"],
  },
  {
    slug: "stopping-ozempic",
    title: "Stopping Ozempic or semaglutide: what to know",
    metaTitle: "Stopping Ozempic: what to know first (UK)",
    description: "Ozempic is a diabetes medicine; Wegovy is semaglutide for weight. What changes when you stop, why your diabetes team comes first, and habits that help.",
    category: "Coming off",
    keywords: ["stopping ozempic", "coming off ozempic", "ozempic weight regain", "life after ozempic", "ozempic vs wegovy"],
    published: D, updated: D,
    summary: [
      "In the UK, Ozempic is licensed for type 2 diabetes. Wegovy is the semaglutide medicine licensed for weight management.",
      "If you take Ozempic for diabetes, talk to your diabetes team before stopping: your blood sugar may change.",
      "Appetite usually returns over a few weeks after stopping semaglutide.",
      "Protein, strength exercise and regular meals help with weight after stopping either medicine.",
    ],
    sections: [
      { heading: "Ozempic and Wegovy: the same medicine, different uses", blocks: [
        "Both contain semaglutide. Ozempic is licensed in the UK to treat type 2 diabetes; Wegovy is licensed for weight management, at a different dose. People often use the name Ozempic for both.",
        { note: "Ozempic and Wegovy are trademarks of Novo Nordisk. Steadie isn't connected with Novo Nordisk and doesn't give advice about medication.", tone: "sky" },
      ] },
      { heading: "If you have diabetes", blocks: [
        "Stopping a diabetes medicine can change your blood sugar. Please talk to your GP, diabetes nurse or prescriber before stopping, so they can plan any changes to your treatment and how you'll check your levels.",
      ] },
      { heading: "Appetite and weight after semaglutide", blocks: [
        "Whatever it was prescribed for, semaglutide quietens appetite, and that effect fades over the weeks after stopping. In the STEP 1 trial of semaglutide for weight management, people regained about two-thirds of their weight loss within a year of stopping, on average. See [what happens when you stop](/guides/what-happens-when-you-stop-weight-loss-injections).",
      ] },
      { heading: "What helps", blocks: [
        "The same habits help whichever brand you took: [protein at every meal](/guides/protein-after-glp-1), [strength exercise](/guides/strength-training-after-glp-1), regular meals with fibre, walking, and a calm way to [watch your weight](/guides/weight-after-stopping-glp-1).",
      ] },
    ],
    faqs: [
      { q: "Is Ozempic the same as Wegovy?", a: "Both are semaglutide. In the UK, Ozempic is licensed for type 2 diabetes and Wegovy for weight management." },
      { q: "Can I stop Ozempic suddenly?", a: "Talk to your diabetes team or prescriber first. Stopping can affect blood sugar, and they'll plan the right approach for you." },
    ],
    sources: [S.nhsSemaglutide, S.step1, S.niceTa875],
    related: ["stopping-wegovy", "coming-off-glp-1", "what-happens-when-you-stop-weight-loss-injections"],
  },
  {
    slug: "nhs-weight-loss-injections-time-limit",
    title: "The NHS time limit on weight-loss injections, and what comes after",
    metaTitle: "NHS weight-loss injection time limit: what happens after",
    description: "Why NHS Wegovy is limited to two years, how Mounjaro is reviewed, and the support NICE says you should get after treatment ends.",
    category: "Coming off",
    keywords: ["wegovy 2 year limit nhs", "nhs weight loss injection time limit", "what happens after 2 years of wegovy", "mounjaro nhs 6 months 5%"],
    published: D, updated: D,
    summary: [
      "NICE recommends Wegovy (semaglutide) for weight management on the NHS for up to two years.",
      "For Mounjaro (tirzepatide), NICE asks for treatment to be reviewed if you haven't lost at least 5% of your weight after six months.",
      "NICE also says people should get at least a year of support after a weight-loss medicine ends.",
      "Rules change, so check the current guidance and what applies to you with your prescriber.",
    ],
    sections: [
      { heading: "Wegovy on the NHS", blocks: [
        "NICE's technology appraisal for semaglutide (TA875) recommends it for managing overweight and obesity for a maximum of two years, alongside a reduced-calorie diet and increased physical activity, through specialist weight management services.",
        "So many people on NHS Wegovy will reach a planned end to treatment. Knowing the date gives you time to prepare. See [building habits before you stop](/guides/building-habits-before-you-stop).",
      ] },
      { heading: "Mounjaro on the NHS", blocks: [
        "NICE's appraisal for tirzepatide (TA1026) sets out who can get it and says stopping should be considered if people haven't lost at least 5% of their weight after six months on the highest dose they can tolerate. Your prescriber will explain how it applies to you.",
      ] },
      { heading: "Support after treatment", blocks: [
        "NICE's quality standard on overweight and obesity says people should be offered support for at least a year after a weight-loss medicine or programme ends. That includes regular feedback, help building routines, and a plan for if weight starts to return. Ask your GP or weight service what's available near you.",
        "Steadie is built to be that kind of support: a 12-month plan of small habits, short strength sessions and easy meals, alongside your NHS care, never instead of it.",
      ] },
    ],
    faqs: [
      { q: "Why is Wegovy limited to two years on the NHS?", a: "NICE's appraisal looked at the evidence and cost-effectiveness available and recommended semaglutide for a maximum of two years for weight management." },
      { q: "What happens after the two years?", a: "Treatment stops, and NICE says you should be offered at least a year of support afterwards. Talk to your weight service about your plan." },
    ],
    sources: [S.niceTa875, S.niceTa1026, S.niceQs212, S.niceNews],
    related: ["stopping-wegovy", "stopping-mounjaro", "coming-off-glp-1", "questions-to-ask-before-stopping-weight-loss-injections"],
  },
  {
    slug: "questions-to-ask-before-stopping-weight-loss-injections",
    title: "Questions to ask your prescriber before stopping weight-loss injections",
    metaTitle: "Questions to ask before stopping weight-loss jabs",
    description: "A printable list of questions to take to your GP or prescriber before coming off Wegovy, Mounjaro or another GLP-1.",
    category: "Coming off",
    keywords: ["questions to ask before stopping wegovy", "talk to gp about stopping mounjaro", "how to stop weight loss injections safely"],
    published: D, updated: D,
    summary: [
      "Your prescriber is the right person to plan how and when you stop.",
      "Going in with questions written down helps you get what you need from a short appointment.",
      "Ask about follow-up, other medicines, health checks and what support is available afterwards.",
    ],
    sections: [
      { heading: "About stopping", blocks: [
        { list: [
          "Is now a good time for me to stop, and why?",
          "How should I stop: all at once, or another way? What's right for my dose?",
          "Do any of my other medicines need to change when I stop?",
          "Is there anything I should look out for in the weeks afterwards?",
        ] },
      ] },
      { heading: "About your health", blocks: [
        { list: [
          "Should we check my blood pressure, cholesterol or blood sugar after I stop, and when?",
          "I have [a condition]. Does anything change for me?",
          "If I'm planning a pregnancy, what do I need to know about timing?",
        ] },
      ] },
      { heading: "About support", blocks: [
        { list: [
          "What support is available locally for the year after stopping?",
          "Who do I contact if I'm struggling with hunger, eating or my mood?",
          "If my weight starts to come back, what are my options?",
        ] },
      ] },
      { heading: "Take your own notes", blocks: [
        "It helps to bring a short summary of how things have gone: your weight trend, habits and how hungry you've felt. Steadie makes a one-page summary for your prescriber from what you log. It never gives medical advice; it just helps the conversation.",
      ] },
    ],
    faqs: [
      { q: "Who should I talk to about stopping a weight-loss injection?", a: "Whoever prescribes it: your GP, specialist weight service or the online pharmacy's prescriber. Your pharmacist can also answer questions about the medicine." },
    ],
    sources: [S.niceQs212, S.nhsSemaglutide, S.nhsTirzepatide],
    related: ["coming-off-glp-1", "building-habits-before-you-stop", "nhs-weight-loss-injections-time-limit"],
  },
  {
    slug: "building-habits-before-you-stop",
    title: "Still on a GLP-1? Build these habits before you stop",
    metaTitle: "Still on Wegovy or Mounjaro? Habits to build now",
    description: "The weeks before your last dose are the easiest time to build routines. Six habits to start while appetite is still quiet.",
    category: "Coming off",
    keywords: ["preparing to come off wegovy", "preparing to stop mounjaro", "habits while on glp-1", "what to do before stopping weight loss injections"],
    published: D, updated: D,
    summary: [
      "While the medicine still quietens appetite, it's easier to try new meals and routines.",
      "Start with protein at breakfast and two short strength sessions a week.",
      "Have a plan for your hungriest time of day before hunger returns.",
    ],
    sections: [
      { heading: "Why start now", blocks: [
        "Habits take a few weeks to settle. If you start them while your appetite is still quiet, they're already part of your week when hunger comes back. Many people find this much easier than starting from scratch after their last dose.",
      ] },
      { heading: "Six habits to start", blocks: [
        { list: [
          "**Protein at breakfast.** Eggs, Greek yoghurt, skyr or cottage cheese. It's the meal most people miss. See [high-protein breakfasts](/guides/high-protein-breakfasts-uk).",
          "**Protein at every meal.** A palm-sized portion. See [protein after a GLP-1](/guides/protein-after-glp-1).",
          "**Two strength sessions a week.** 25 minutes at home is plenty. See [strength training](/guides/strength-training-after-glp-1).",
          "**A short walk after one meal a day.** Easy to attach to something you already do.",
          "**Regular meal times.** A rough rhythm makes hunger easier to plan for.",
          "**Notice your hungry times.** Mid-afternoon and evening are common. Have a protein snack ready.",
        ], ordered: true },
      ] },
      { heading: "And one conversation", blocks: [
        "Agree a plan with your prescriber about when and how you'll stop, and what follow-up you'll have. Our [list of questions](/guides/questions-to-ask-before-stopping-weight-loss-injections) can help.",
      ] },
    ],
    faqs: [
      { q: "Can I start Steadie while I'm still on my jab?", a: "Yes. Many people start building routines before their last dose, so they're in place when appetite returns." },
    ],
    sources: [S.niceQs212, S.bdaResource, S.lundgren],
    related: ["coming-off-glp-1", "protein-after-glp-1", "strength-training-after-glp-1", "questions-to-ask-before-stopping-weight-loss-injections"],
  },
];
