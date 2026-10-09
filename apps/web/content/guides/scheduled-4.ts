import { S } from "./sources";
import type { Guide, Source } from "./types";

// Sources used only in this batch. Each URL was checked and read before citing.
const nhsAlcoholUnits: Source = { label: "NHS: alcohol units", url: "https://www.nhs.uk/live-well/alcohol-advice/calculating-alcohol-units/" };
const nhsAlcoholCalories: Source = { label: "NHS: calories in alcohol", url: "https://www.nhs.uk/live-well/alcohol-advice/calories-in-alcohol/" };
const nhsCuttingDown: Source = { label: "NHS: tips on cutting down on alcohol", url: "https://www.nhs.uk/live-well/alcohol-advice/tips-on-cutting-down-alcohol/" };
const nhsAlcoholSupport: Source = { label: "NHS: alcohol support, including Drinkline", url: "https://www.nhs.uk/live-well/alcohol-advice/alcohol-support/" };
const nhsObesityTreatment: Source = { label: "NHS: overweight and obesity in adults, treatments and weight management programmes", url: "https://www.nhs.uk/conditions/obesity/treatment/" };
const mhraWegovyTablet: Source = { label: "MHRA: first GLP-1 tablet for weight loss approved in the UK (11 June 2026)", url: "https://www.gov.uk/government/news/first-glp-1-tablet-for-weight-loss-approved-in-the-uk" };
const mhraOrforglipron: Source = { label: "MHRA: UK first in Europe to authorise orforglipron for weight management and type 2 diabetes (10 August 2026)", url: "https://www.gov.uk/government/news/uk-first-in-europe-to-authorise-orforglipron-for-weight-management-and-type-2-diabetes" };
const nhsJetLag: Source = { label: "NHS: jet lag", url: "https://www.nhs.uk/conditions/jet-lag/" };

const MOVE_SAFELY = "Check with your GP first if you have a health condition. Stop if anything hurts, you feel dizzy or have chest pain.";

export const SCHEDULED_4: Guide[] = [
  {
    slug: "first-month-after-stopping-glp-1",
    title: "The first month after stopping a GLP-1: what to expect, week by week",
    metaTitle: "First month after stopping Wegovy or Mounjaro",
    description: "What many people notice in the weeks after their last dose of a weight-loss injection, and simple routines to lean on in each week of the first month.",
    category: "Coming off",
    keywords: ["first month after stopping wegovy", "weeks after stopping mounjaro", "what to expect after last wegovy injection", "after stopping ozempic week by week", "life after weight loss injections"],
    published: "2026-10-13", updated: "2026-10-13",
    summary: [
      "GLP-1 medicines take several weeks to clear after the last dose, so changes tend to arrive gradually.",
      "Many people notice hunger and food noise creeping back over the first month.",
      "A few simple routines, set up in week one, give you something steady to lean on.",
      "When and how treatment ends is a decision for you and your prescriber.",
    ],
    sections: [
      { heading: "Why the first month feels different", blocks: [
        "Semaglutide (Wegovy, Ozempic) and tirzepatide (Mounjaro) last for days in the body after each dose, so their effects fade over several weeks rather than overnight. That's why the first month after your last dose is often a slow shift rather than a sudden change.",
        "Everyone is different. Some people notice very little for a couple of weeks; others feel hungrier quite soon. The outline below is a rough guide to what many people describe, not a timetable. For the bigger picture, see [what happens when you stop](/guides/what-happens-when-you-stop-weight-loss-injections).",
        { note: "This guide is about the weeks after treatment has ended. Never change or stop a medicine without talking to your prescriber first. If you have type 2 diabetes, your GP or diabetes team will want to plan any medicine change with you.", tone: "butter" },
      ] },
      { heading: "Week 1: set up your anchors", blocks: [
        "Many people feel much the same in the first week, because the medicine is still working. That makes it a good time to put a few routines in place while things feel calm.",
        { list: [
          "**Protein at breakfast.** Eggs, Greek yoghurt or overnight oats made with milk. See [high-protein breakfasts](/guides/high-protein-breakfasts-uk).",
          "**A rough meal rhythm.** Three meals at similar times, with a planned snack if you need one.",
          "**Two strength sessions in the diary.** Short is fine. See [strength training after a GLP-1](/guides/strength-training-after-glp-1).",
          "**A daily walk.** Ten minutes after a meal counts.",
        ] },
      ] },
      { heading: "Weeks 2 and 3: hunger starts to return", blocks: [
        "As the medicine clears, many people notice portions that used to feel big now feel ordinary, and thoughts about food come back more often. Some find foods they had gone off, like sweets or rich dishes, appeal again.",
        "This is expected, and it isn't a sign that anything has gone wrong. It helps to know your hungriest time of day and plan for it: a protein snack ready for mid-afternoon, or dinner a little earlier if evenings are hard. See [appetite after stopping](/guides/appetite-after-stopping-glp-1).",
        "Pausing for ten minutes before seconds gives fullness time to arrive. Eating sitting down, without a screen, makes it easier to notice.",
        "Some people also notice their digestion going back to how it was before treatment. Fibre from oats, beans, lentils, wholegrains, fruit and veg helps with fullness and regularity. Build it up slowly and drink plenty. If anything about your digestion worries you, ask your pharmacist or GP.",
      ] },
      { heading: "Week 4: settle into a new normal", blocks: [
        "By the end of the first month, many people say their appetite feels closer to how it was before treatment. This is when routines matter most, because they carry you when motivation dips.",
        "If you weigh yourself, look at a 7-day average rather than single days, which can jump around by a kilo or more. See [your weight after stopping](/guides/weight-after-stopping-glp-1). If weighing doesn't help you, it's fine to skip it and track habits instead.",
        "A short check-in at the end of the month helps: which routines felt easy, which felt hard, and what one small change would help next month?",
      ] },
      { heading: "Looking after yourself along the way", blocks: [
        "The first month can bring mixed feelings: relief, worry, frustration. All are normal. Be as kind to yourself as you would be to a friend in the same spot.",
        "NICE says people should be offered support for at least a year after a weight-loss medicine ends. Ask your GP or weight service what's available near you. Steadie is designed to help with this year too, alongside your NHS care.",
        { note: MOVE_SAFELY, tone: "sage" },
        { note: "If thoughts about food or your body start to feel overwhelming, talk to your GP, or contact Beat, the UK's eating disorder charity.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "How long does it take for Wegovy to leave your body?", a: "Semaglutide lasts about a week between doses, so it takes several weeks after the last dose to clear. Most people notice changes gradually over the first month." },
      { q: "When does hunger come back after stopping Mounjaro?", a: "Many people notice it within a few weeks of their last dose. Planning protein-rich meals and a snack for your hungriest time of day helps." },
      { q: "Is it normal to feel anxious after stopping weight-loss injections?", a: "Yes, many people do. Having a few simple routines in place, and support from your GP or weight service, can make the first month feel steadier." },
    ],
    sources: [S.nhsSemaglutide, S.nhsTirzepatide, S.step1, S.niceQs212, S.bdaResource, S.nhsActivity, S.beat],
    related: ["coming-off-glp-1", "appetite-after-stopping-glp-1", "building-habits-before-you-stop", "keep-weight-off-after-glp-1"],
  },
  {
    slug: "alcohol-after-stopping-glp-1",
    title: "Alcohol after stopping a GLP-1: appetite, units and nights out",
    metaTitle: "Alcohol after stopping Wegovy or Mounjaro: what to know",
    description: "How drinking can affect appetite and food choices after weight-loss injections, the UK low-risk guideline, and easy tips for nights out.",
    category: "Keeping it off",
    keywords: ["alcohol after stopping wegovy", "drinking after mounjaro", "alcohol and weight maintenance", "how many units a week uk", "night out tips weight loss"],
    published: "2026-11-03", updated: "2026-11-03",
    summary: [
      "Some people find they want a drink more again once a GLP-1 wears off.",
      "Drinks carry calories, and many people find drinking makes them hungrier and less likely to stick to their plans.",
      "The UK low-risk guideline is no more than 14 units a week, spread over 3 or more days.",
      "Eating first, alternating with water and choosing smaller drinks make nights out easier.",
    ],
    sections: [
      { heading: "Why alcohol can feel different now", blocks: [
        "While they were taking a GLP-1, some people noticed they drank less or enjoyed it less. As the medicine wears off, that can change, along with appetite. See [appetite after stopping](/guides/appetite-after-stopping-glp-1).",
        "There's no need for strict rules. It just helps to know how drinking tends to affect eating, so you can plan for it.",
        "It can also help to notice when and why you drink. A glass with friends on a Saturday feels very different from a drink at the end of every stressful day. Neither is wrong, but the second is often worth a gentle look, because stress can turn up appetite too.",
      ] },
      { heading: "Alcohol and appetite", blocks: [
        "Drinks contain calories of their own: the NHS says a 175ml glass of 12% wine can contain up to 158 calories and a pint of 5% beer up to 222. Mixers can add more.",
        "Many people also find a few drinks make them hungrier, and make the chips, crisps or late-night takeaway harder to say no to. Alcohol affects judgement, so plans made earlier in the day can feel less important. That's not a personal weakness; it's what alcohol does.",
        "Drinking can also disrupt sleep, and after a poor night many people feel hungrier the next day. See [sleep, stress and appetite](/guides/sleep-stress-and-appetite).",
      ] },
      { heading: "The UK low-risk guideline", blocks: [
        "To keep health risks from alcohol low, the NHS advises men and women not to regularly drink more than **14 units a week**, spread over **3 or more days**, with several drink-free days each week.",
        "14 units is roughly 6 pints of average-strength beer or 6 medium glasses of wine. A pint of strong lager is about 3 units; a 125ml glass of 12% wine is about 1.5.",
      ] },
      { heading: "Tips for nights out", blocks: [
        { list: [
          "**Eat first.** A meal with protein before you go out, such as chicken, eggs, fish or beans, means you don't arrive hungry. See [protein after a GLP-1](/guides/protein-after-glp-1).",
          "**Alternate.** Have water or a soft drink between alcoholic ones.",
          "**Go smaller.** A bottle instead of a pint, a small glass of wine instead of a large, or a lower-strength drink.",
          "**Drink at your own pace.** Rounds can mean drinking more than you meant to.",
          "**Decide on food now.** If you'll want something on the way home, pick it in advance rather than at midnight.",
          "**Plan the morning after.** A protein breakfast, plenty of water and a walk help the next day feel normal again.",
          "**Have a way home sorted.** Knowing when you'll leave makes it easier to pace the evening.",
        ] },
        "Eating out is part of the same picture. See [eating out after a GLP-1](/guides/eating-out-after-glp-1).",
      ] },
      { heading: "Planning your week", blocks: [
        "Rather than deciding drink by drink, many people find it easier to plan the week. Pick the occasions that matter most to you, such as a meal out or a friend's birthday, and keep other evenings drink-free. The NHS suggests setting a limit before you start and having several drink-free days each week.",
        { list: [
          "**Try lower-strength or alcohol-free options.** Alcohol-free beers and gin alternatives are easy to find in UK supermarkets and pubs.",
          "**Stretch a drink.** The NHS suggests adding a splash of soda water to white wine so the same units last longer.",
          "**Keep a non-alcoholic routine.** A sparkling water with lime, or a cup of tea, can mark the end of the day just as well.",
          "**Tell a friend.** The NHS notes that cutting down with someone else's support can make it easier to stick to.",
        ] },
      ] },
      { heading: "If drinking worries you", blocks: [
        "If you're drinking more than you'd like, or using alcohol to cope, you're not alone and support is available. Talk to your GP, or call Drinkline, the free national alcohol helpline.",
        { note: "If you have type 2 diabetes or take other medicines, ask your GP or pharmacist how alcohol might affect them.", tone: "butter" },
      ] },
    ],
    faqs: [
      { q: "Can I drink alcohol after stopping Wegovy?", a: "Many people do. It helps to stay within the UK low-risk guideline of no more than 14 units a week, spread over 3 or more days, and to eat before drinking. Ask your pharmacist if you have questions about your own health." },
      { q: "Does alcohol make you hungrier?", a: "Many people find it does, and that it makes plans around food easier to let slide. Eating a protein-rich meal first and alternating with water both help." },
      { q: "How many units are in a pint?", a: "It depends on strength. The NHS says a pint of strong lager has about 3 units and a lower-strength one just over 2." },
    ],
    sources: [nhsAlcoholUnits, nhsAlcoholCalories, nhsCuttingDown, nhsAlcoholSupport, S.bdaResource],
    related: ["eating-out-after-glp-1", "appetite-after-stopping-glp-1", "sleep-stress-and-appetite", "christmas-after-weight-loss-jab"],
  },
  {
    slug: "nhs-support-after-weight-loss-injections",
    title: "NHS support after weight-loss injections: what's available and how to ask",
    metaTitle: "NHS support after weight-loss injections end",
    description: "What NICE says about support after a weight-loss medicine ends, the kinds of NHS weight management services that exist, and how to ask your GP.",
    category: "Coming off",
    keywords: ["nhs support after wegovy", "support after stopping weight loss injections", "nhs weight management service", "nhs digital weight management programme", "what happens after nhs mounjaro ends"],
    published: "2026-11-06", updated: "2026-11-06",
    summary: [
      "NICE says people should be offered support for at least 12 months after a weight-loss medicine ends.",
      "The NHS offers weight management programmes, and some areas let you refer yourself.",
      "What's available varies by area, so ask your GP or weight service.",
      "A short list of questions makes that conversation easier.",
    ],
    sections: [
      { heading: "What NICE says", blocks: [
        "NICE's quality standard on overweight and obesity says people should be offered wraparound care alongside weight-loss medicines, and support for at least 12 months after the medicine ends. NICE has said people need help to keep weight off once treatment stops, because weight often returns.",
        "The NHS website also says that after you stop taking weight-loss medicines you should be offered support to help you stay a healthy weight. For why this matters, see [what happens when you stop](/guides/what-happens-when-you-stop-weight-loss-injections).",
        "In practice, good support after treatment might include regular check-ins, help building everyday routines around food and activity, and a plan for what to do if weight starts to return.",
        { note: "Quality standards describe what good care looks like. They don't guarantee a particular service in every area, so what you're offered may differ.", tone: "butter" },
      ] },
      { heading: "The kinds of NHS support that exist", blocks: [
        "A GP can give advice about managing your weight and refer you on. According to the NHS, weight management programmes might include:",
        { list: [
          "one-to-one coaching",
          "cognitive behavioural therapy (CBT)",
          "group support",
          "online exercise classes",
          "healthy eating advice and recipes",
        ] },
        "If you have health conditions affected by your weight, such as high blood pressure or type 2 diabetes, the NHS says you may be offered specialist support such as the NHS digital weight management programme. People who need more help may be referred to a specialist weight management service.",
      ] },
      { heading: "Finding services near you", blocks: [
        "You might be able to refer yourself to a local weight management programme without seeing a GP. The NHS suggests:",
        { list: [
          "checking your GP surgery website, or asking at reception",
          "checking your integrated care board (ICB) website",
          "searching online for NHS weight management services near you",
        ] },
        "If you were treated through a specialist weight service, ask them first. They should know what follow-up is planned. If you were treated privately, your GP can still talk to you about local options.",
      ] },
      { heading: "How to ask your GP", blocks: [
        "It helps to book an appointment with a clear reason, such as \"support after finishing a weight-loss medicine\", and bring a few questions:",
        { list: [
          "What support is available locally now that my treatment has ended?",
          "Can I be referred, or can I refer myself?",
          "Are there health checks I should have, such as blood pressure or blood sugar?",
          "Who should I contact if my weight starts to change quickly or I'm struggling?",
        ] },
        "Writing your questions down beforehand, and noting the answers during the appointment, makes it easier to remember what was agreed. It's fine to ask the GP to repeat or explain anything that isn't clear.",
        "For more questions to take along, see [questions to ask before stopping](/guides/questions-to-ask-before-stopping-weight-loss-injections). If you're nearing the end of NHS treatment, [the NHS time limit](/guides/nhs-weight-loss-injections-time-limit) explains how it works.",
      ] },
      { heading: "If there's a wait, or no local service", blocks: [
        "Services differ across the country, and some have waiting lists. If that's the case where you live, you can still ask your GP about health checks and keep an eye on how you're doing in the meantime. Your community pharmacist can also be a good first point of contact for questions about medicines.",
        "Free NHS information on eating well and staying active, including the UK physical activity guidelines, can help you keep routines going while you wait.",
      ] },
      { heading: "Support you can build yourself", blocks: [
        "Whatever is available locally, the habits with the best evidence are the same: [protein at every meal](/guides/protein-after-glp-1), [strength exercise](/guides/strength-training-after-glp-1) twice a week, regular meals, walking and good sleep. Steadie is built around these for the year after treatment, alongside your NHS care, never instead of it.",
        { note: "If you're worried about your eating, talk to your GP. Beat, the UK's eating disorder charity, also has a helpline.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "Does the NHS give support after Wegovy ends?", a: "NICE says people should be offered support for at least 12 months after a weight-loss medicine ends. What's available varies by area, so ask your GP or weight service." },
      { q: "Can I refer myself to an NHS weight management programme?", a: "In some areas, yes. Check your GP surgery website, your integrated care board's website, or search for NHS weight management services near you." },
      { q: "I had weight-loss injections privately. Can I get NHS support?", a: "Your GP can talk to you about local options and any health checks you might need. Availability depends on where you live and your health." },
    ],
    sources: [S.niceQs212, S.niceNews, nhsObesityTreatment, S.niceTa875, S.niceTa1026, S.nhsActivity, S.beat],
    related: ["nhs-weight-loss-injections-time-limit", "questions-to-ask-before-stopping-weight-loss-injections", "coming-off-glp-1", "first-month-after-stopping-glp-1"],
  },
  {
    slug: "weight-loss-tablets-uk",
    title: "Weight-loss tablets in the UK: GLP-1 pills explained",
    metaTitle: "Weight-loss tablets UK: GLP-1 pills explained (2026)",
    description: "The GLP-1 tablets authorised for weight management in the UK in 2026, how tablets differ from injections, and what to know about NHS and private use.",
    category: "Basics",
    keywords: ["weight loss tablets uk", "wegovy tablet uk", "orforglipron uk", "foundayo uk", "glp-1 pill uk"],
    published: "2026-11-27", updated: "2026-11-27",
    summary: [
      "As of November 2026, two GLP-1 tablets have been authorised for weight management in the UK.",
      "Both are prescription-only and, at the time of writing, available privately rather than on the NHS.",
      "Tablets are taken daily, and each has its own instructions to follow.",
      "Whether any medicine suits you is a decision for you and your prescriber.",
    ],
    sections: [
      { heading: "Which tablets are authorised?", blocks: [
        "The UK medicines regulator, the MHRA, has authorised two GLP-1 tablets for weight management:",
        { list: [
          "**Semaglutide tablet (Wegovy):** authorised in June 2026. It contains the same active ingredient as Wegovy injections.",
          "**Orforglipron (Foundayo):** made by Eli Lilly and authorised in August 2026. It's a daily GLP-1 tablet that the MHRA also authorised for type 2 diabetes.",
        ] },
        "Both are authorised for adults with a BMI of 30 or above, or a BMI between 27 and 30 with at least one weight-related health condition, alongside a reduced-calorie diet and more physical activity. For how these medicines work, see [what are GLP-1 medicines?](/guides/what-are-glp-1-medicines)",
      ] },
      { heading: "How tablets differ from injections", blocks: [
        "Injections like Wegovy and Mounjaro are given once a week. The tablets are taken once a day. Like the injections, they start at a low dose that's increased over months, with at least a month at each step.",
        "A daily tablet means a daily routine, which suits some people and not others. Some prefer not to inject; others find one weekly dose easier to remember. These are personal things worth raising with your prescriber, who can weigh them alongside your health.",
        "Tablets can come with rules about how to take them, for example around food and drink, and these differ between products. Follow the patient information leaflet and your prescriber's instructions.",
        "The most common side effects reported by the MHRA are similar to those of injections, mainly stomach and gut symptoms such as feeling sick, diarrhoea and constipation.",
      ] },
      { heading: "NHS or private?", blocks: [
        "When it authorised each tablet, the MHRA said it was not available on the NHS at that point, and that decisions on NHS use would follow the usual process, including an appraisal by NICE. NICE already has appraisals for the injections, such as TA875 for semaglutide injections.",
        "Both tablets can be prescribed privately. UK prices are still settling, so check costs carefully before starting. For more on costs, see [the weight-loss jab price rise](/guides/weight-loss-jab-price-rise-uk).",
        { note: "All GLP-1 medicines are prescription-only. Only buy them from a registered pharmacy with a prescription. Medicines from unregulated sellers can be fake or unsafe.", tone: "butter" },
      ] },
      { heading: "Is a tablet right for me?", blocks: [
        "That's a question for your prescriber, who knows your health history and other medicines. Steadie doesn't recommend any medicine, or switching between medicines. Never change or stop a medicine without talking to your prescriber first.",
        "If you have type 2 diabetes, any change to your diabetes medicines should be planned with your GP or diabetes team.",
        "With the injections, trials have shown appetite and weight tend to return when treatment ends, and the habits that help afterwards are the same: protein, strength exercise, regular meals and movement. See [what happens when you stop](/guides/what-happens-when-you-stop-weight-loss-injections) and the [GLP-1 glossary](/guides/glp-1-glossary) for terms you might hear.",
      ] },
      { heading: "Questions to ask your prescriber", blocks: [
        "If you're curious about tablets, a few questions can help you get clear answers for your own situation:",
        { list: [
          "Is a tablet suitable for me, given my health and other medicines?",
          "How would I take it, and what happens if I miss a dose?",
          "What side effects should I look out for, and who do I contact about them?",
          "What does it cost, and is the price likely to change?",
          "What support is there for eating, activity and routines alongside it, and after it ends?",
        ] },
        "If you think you're having a side effect from any medicine, talk to your doctor, pharmacist or nurse. You can also report it to the MHRA's Yellow Card scheme.",
      ] },
      { heading: "A note on changing information", blocks: [
        { note: "This information may change. Prices, availability and NHS decisions on weight-loss tablets are still developing, so check with your pharmacist or prescriber for the latest.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "Is there a weight-loss tablet in the UK?", a: "Yes. As of November 2026, the MHRA has authorised a Wegovy (semaglutide) tablet and orforglipron (Foundayo) for weight management. Both are prescription-only." },
      { q: "Can I get the Wegovy tablet on the NHS?", a: "When it was authorised, the MHRA said it was not available on the NHS and that NHS use would depend on processes including a NICE appraisal. Check with your GP or pharmacist for the latest." },
      { q: "Are weight-loss tablets better than injections?", a: "Neither is simply better. They're taken differently and suit different people. Your prescriber can talk you through the options for you." },
    ],
    sources: [mhraWegovyTablet, mhraOrforglipron, S.nhsSemaglutide, S.niceTa875, S.mhraFakePens, S.gphcRegister, S.yellowCard],
    related: ["what-are-glp-1-medicines", "glp-1-glossary", "weight-loss-jab-price-rise-uk", "what-happens-when-you-stop-weight-loss-injections"],
  },
  {
    slug: "christmas-after-weight-loss-jab",
    title: "Christmas after weight-loss jabs: a relaxed way to enjoy it",
    metaTitle: "Christmas after weight-loss jabs: enjoy it calmly",
    description: "Enjoy Christmas food after stopping a GLP-1 without all-or-nothing thinking: protein at breakfast, keeping walks, drinks, family comments and January.",
    category: "Keeping it off",
    keywords: ["christmas after stopping wegovy", "christmas after mounjaro", "festive eating weight maintenance", "christmas food without overeating", "january after christmas weight"],
    published: "2026-12-08", updated: "2026-12-08",
    summary: [
      "Christmas is a few special days, not a test. A week or two of different eating never undoes a steady year.",
      "Protein at breakfast and a daily walk keep the season feeling steady.",
      "Enjoy the food you love, on a plate, sitting down.",
      "In January, pick your routines back up without punishment.",
    ],
    sections: [
      { heading: "Let go of all-or-nothing", blocks: [
        "It's easy to think Christmas has to be either strict or a free-for-all. Neither tends to feel good. A middle way works better: enjoy the meals and treats that matter to you, and keep a couple of small anchors that make the rest of the day easier.",
        "If this is your first Christmas since stopping a GLP-1, your appetite may feel bigger than last year. That's expected. See [appetite after stopping](/guides/appetite-after-stopping-glp-1).",
      ] },
      { heading: "Two anchors for the festive days", blocks: [
        { list: [
          "**Protein at breakfast.** Scrambled eggs with smoked salmon, Greek yoghurt with clementines, or a bacon sandwich with an egg. It helps fullness through a long day of grazing. See [high-protein breakfasts](/guides/high-protein-breakfasts-uk).",
          "**A daily walk.** A Boxing Day walk is a tradition for a reason. Even 15 minutes after the big meal helps you feel better. See [walking to keep weight off](/guides/walking-to-keep-weight-off).",
        ] },
        { note: MOVE_SAFELY, tone: "sage" },
      ] },
      { heading: "Parties, drinks and the busy weeks", blocks: [
        "December is often more than one big day. Work parties, buffets, school events and late nights can stretch across several weeks. A little planning keeps them enjoyable:",
        { list: [
          "Have a protein-rich snack before a party, so you don't arrive starving.",
          "At a buffet, fill a plate once with what you most want, then step away from the table.",
          "Keep your usual mealtimes on quieter days, rather than skipping meals to save up.",
          "Protect sleep where you can. After late nights, many people feel hungrier the next day, so an early night between parties really helps.",
        ] },
        "Festive drinking adds up quickly, and many people find it makes them hungrier. Eating first, alternating with water and having a few drink-free days all help. The UK low-risk guideline is no more than 14 units a week, spread over 3 or more days. See [alcohol after stopping a GLP-1](/guides/alcohol-after-stopping-glp-1).",
        "None of this needs to be perfect. If one evening runs late and the food and drinks flow, the next morning is just a normal morning: a protein breakfast, a glass of water and some fresh air.",
      ] },
      { heading: "Enjoying the food", blocks: [
        { list: [
          "**Turkey first.** Christmas dinner is already built around protein. Start with the turkey and a good helping of veg.",
          "**Plate your treats.** Mince pies, chocolates and cheese taste better on a plate, sitting down, than from the tin on the way past.",
          "**Pause before seconds.** Give it ten minutes, then decide.",
          "**Leftovers are fine.** Turkey sandwiches and bubble and squeak are easy protein-rich lunches.",
        ] },
        "If cravings feel loud, they usually pass within about 15 to 20 minutes. See [cravings after stopping](/guides/cravings-after-stopping-glp-1).",
      ] },
      { heading: "When family comment", blocks: [
        "Comments about your weight, your plate or your old medicine can sting, even when meant kindly. You don't owe anyone an explanation. A few phrases can help:",
        { list: [
          "\"I'm doing well, thanks. How's your year been?\"",
          "\"I'm full for now, maybe later.\"",
          "\"I'd rather not talk about my weight today.\"",
        ] },
        "If someone keeps pushing, it's fine to step away for a few minutes or a short walk. It can also help to have one person on your side who knows what you'd rather not discuss and can change the subject for you.",
      ] },
      { heading: "January without punishment", blocks: [
        "There's no need for a crash diet or extreme exercise in January. Just pick your usual routines back up: protein at meals, regular eating times, your strength sessions and walks. Look at the trend over a few weeks rather than one weigh-in. See [your weight after stopping](/guides/weight-after-stopping-glp-1).",
        { note: "If food or your body feels hard to think about over the holidays, you're not alone. Beat, the UK's eating disorder charity, has a helpline, and your GP can help too.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "Will Christmas undo my progress after stopping Mounjaro?", a: "A few days of different eating doesn't undo months of steady habits. Picking routines back up in January matters far more than any one meal." },
      { q: "How do I handle comments about my weight at Christmas?", a: "You don't have to explain anything. A short, friendly change of subject or stepping away for a moment are both fine." },
      { q: "Should I diet in January?", a: "There's no need for anything extreme. Going back to protein at meals, regular eating and your usual activity is usually enough." },
    ],
    sources: [S.bdaResource, S.nhsActivity, nhsAlcoholUnits, nhsCuttingDown, S.nhsSleep, S.beat],
    related: ["eating-out-after-glp-1", "cravings-after-stopping-glp-1", "alcohol-after-stopping-glp-1", "keep-weight-off-after-glp-1"],
  },
  {
    slug: "holidays-and-travel-after-glp-1",
    title: "Holidays and travel after a GLP-1: enjoy the trip, keep it simple",
    metaTitle: "Holidays after stopping Wegovy or Mounjaro: easy tips",
    description: "How to enjoy hotel breakfasts, all-inclusives and travel after stopping a GLP-1, stay active, handle jet lag and settle back into routine at home.",
    category: "Keeping it off",
    keywords: ["holiday after stopping wegovy", "all inclusive after mounjaro", "travel weight maintenance", "hotel breakfast high protein", "jet lag and appetite"],
    published: "2026-12-15", updated: "2026-12-15",
    summary: [
      "A holiday is for enjoying. A week or two away doesn't undo steady habits.",
      "A protein-first breakfast and plenty of walking do most of the work.",
      "Jet lag and late nights can turn up hunger, so rest where you can.",
      "Back home, pick up your routines in the first few days, without punishment.",
    ],
    sections: [
      { heading: "A relaxed plan for being away", blocks: [
        "Holidays change everything at once: meals, sleep, activity and drinks. Trying to keep every routine going usually isn't realistic, and it isn't the point. Choose one or two anchors and let the rest be a holiday.",
        "If this is your first trip since stopping a GLP-1, your appetite may be bigger than on your last holiday. That's expected. See [appetite after stopping](/guides/appetite-after-stopping-glp-1).",
      ] },
      { heading: "Travel days", blocks: [
        "Airports, stations and motorway services can make travel days the hardest part. Long gaps between meals often lead to arriving starving. A little preparation helps:",
        { list: [
          "Eat a proper meal with protein before you set off.",
          "Pack a couple of snacks, such as a handful of nuts, a protein bar or some fruit, for delays.",
          "At the airport, look for options built around protein: an egg or chicken sandwich, a salad box or a pot of yoghurt.",
          "Carry an empty water bottle to fill once you're through security.",
        ] },
        "On long trips, get up and move around when you can. Stretching and walking the aisle on a flight, or stopping for a short walk on a drive, helps you arrive feeling better.",
      ] },
      { heading: "Hotel breakfasts and buffets", blocks: [
        "A good breakfast sets you up for a day of sightseeing. Start with the protein, then add what you fancy:",
        { list: [
          "eggs any way, with smoked salmon, ham or cheese",
          "Greek yoghurt with fruit and a few nuts",
          "beans, mushrooms and tomatoes alongside a cooked breakfast",
          "a pastry if you want one, on the plate alongside, not instead",
        ] },
        "At all-inclusives, walk the whole buffet before choosing, use a normal-sized plate, and sit down to eat. Everything will be there again tomorrow, so there's no need to try it all at once. See [eating out after a GLP-1](/guides/eating-out-after-glp-1).",
      ] },
      { heading: "Staying active without trying", blocks: [
        "Holidays often mean more walking than home: exploring a town, a coastal path, a swim. That all counts towards the UK guidance of at least 150 minutes of moderate activity a week. See [walking to keep weight off](/guides/walking-to-keep-weight-off).",
        "If you want to keep strength work going, a short bodyweight session in your room takes ten minutes: squats, wall press-ups and lunges. Two short sessions across the week is plenty to keep the habit ticking over.",
        { note: MOVE_SAFELY + " In hot weather, drink plenty and avoid exercising in the hottest part of the day.", tone: "sage" },
      ] },
      { heading: "Drinks, jet lag and sleep", blocks: [
        "Holiday drinks add up, and many people find alcohol makes them hungrier. Alternating with water and eating first both help. See [alcohol after stopping a GLP-1](/guides/alcohol-after-stopping-glp-1).",
        "Jet lag disturbs sleep, and the NHS notes it can also change appetite. The NHS suggests:",
        { list: [
          "drinking plenty of water during the flight, and not too much caffeine or alcohol",
          "changing to the new time zone as quickly as you can",
          "going outside in daylight, which helps your body clock adjust",
          "sleeping at night rather than napping in the day",
        ] },
        "After a short night, a protein breakfast and a walk in daylight are good first steps. See [sleep, stress and appetite](/guides/sleep-stress-and-appetite).",
      ] },
      { heading: "Coming home", blocks: [
        "The first few days back are when routines are easiest to pick up. Do a simple food shop, plan a few protein-rich meals, and put your next strength session in the diary. No need to make up for anything.",
        "The scales may be up straight after a trip, often from salt, travel and different food. Look at the trend over a couple of weeks rather than one weigh-in. See [your weight after stopping](/guides/weight-after-stopping-glp-1).",
        { note: "If you have type 2 diabetes or take regular medicines, ask your pharmacist for travel advice before you go.", tone: "butter" },
      ] },
    ],
    faqs: [
      { q: "How do I enjoy an all-inclusive holiday after stopping Wegovy?", a: "Start meals with protein, look at the whole buffet before choosing, and sit down to eat. Enjoy the treats you most want, and keep walking each day." },
      { q: "Does jet lag affect appetite?", a: "It can. The NHS notes jet lag can change appetite and disturb sleep. Getting daylight and moving to local mealtimes and bedtimes helps." },
      { q: "I gained weight on holiday. What should I do?", a: "Pick your usual routines back up and look at the trend over a couple of weeks. Some of the change is often water and salt, which settles." },
    ],
    sources: [nhsJetLag, S.nhsActivity, S.cmoGuidelines, nhsCuttingDown, S.nhsSleep, S.bdaResource],
    related: ["eating-out-after-glp-1", "walking-to-keep-weight-off", "sleep-stress-and-appetite", "alcohol-after-stopping-glp-1"],
  },
];
