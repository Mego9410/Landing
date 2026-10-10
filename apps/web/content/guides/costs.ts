import { S } from "./sources";
import type { Guide } from "./types";

// The cost of weight-loss jabs in the UK. Prices here are list prices from public reporting, checked on the date
// below; recheck them, and the "nothing announced" lines, whenever these guides are updated.
const D = "2026-10-09";

export const COSTS: Guide[] = [
  {
    slug: "weight-loss-jab-price-rise-uk",
    title: "Weight-loss jab prices in the UK: what's changed and what you can do",
    metaTitle: "Weight-loss jab price rise UK: what you can do",
    description: "Mounjaro's UK price rose by up to 170% in 2025, and private prices still change. What happened, what's announced for 2026, and practical steps if your jab costs more.",
    category: "Coming off",
    keywords: ["mounjaro price rise uk", "weight loss jab price increase", "wegovy price uk", "can't afford mounjaro", "mounjaro price 2026", "glp-1 cost uk"],
    published: D, updated: D,
    summary: [
      "Eli Lilly raised the UK list price of Mounjaro from 1 September 2025: the top dose went from £122 to £330 a month, a rise of up to 170%.",
      "As of 9 October 2026, no further UK list price rise has been announced for Mounjaro or Wegovy. Private pharmacies still set their own prices, and these can change at any time.",
      "On the NHS, you pay the usual prescription charge, whatever the list price.",
      "If cost is a worry, talk to your prescriber early, check what you're really paying, and never buy from unregulated sellers.",
    ],
    sections: [
      { heading: "What happened to Mounjaro's price", blocks: [
        "In August 2025, Eli Lilly announced that the UK list price of Mounjaro (tirzepatide) would rise from 1 September 2025. Monthly list prices had been £92 to £122, depending on the dose. They rose to between £133 and £330. The biggest jump was for the highest dose, from £122 to £330, a rise of about 170%.",
        "Lilly said it had first set the UK price well below the European average to speed up access, and that it was now bringing the price more in line with other countries. Reports at the time linked the change to pressure from the US government on drug prices.",
        "Private pharmacies set their own retail prices on top of the list price, so what people actually paid varied. Many paid much more from September 2025, and some moved provider or started thinking about coming off sooner than they'd planned.",
      ] },
      { heading: "Is another price rise coming?", blocks: [
        "As of 9 October 2026, neither Eli Lilly nor Novo Nordisk (which makes Wegovy) has announced a new UK list price rise. Novo Nordisk has announced lower list prices in the US from January 2027, but that doesn't apply to the UK.",
        "That doesn't mean your price will stay the same. Private pharmacies change their own prices, introductory offers end after the first month or two, and the price usually goes up as the dose does. New options are arriving too: the MHRA authorised a Wegovy tablet in June 2026 and Lilly's orforglipron tablet in August 2026, and their UK prices are still settling.",
        { note: "We'll update this guide if a new UK price change is announced. Check the date at the top.", tone: "sky" },
      ] },
      { heading: "If you get your jab on the NHS", blocks: [
        "NHS patients pay the standard prescription charge in England, or nothing in Scotland, Wales and Northern Ireland, whatever the list price. The 2025 rise didn't change what NHS patients pay.",
        "NHS access to tirzepatide is being rolled out in stages over several years, starting with people who have the highest BMI and several weight-related health conditions. If you're paying privately, it's worth asking your GP whether you might qualify now or later. There's more on NHS limits in [NHS weight-loss injections and time limits](/guides/nhs-weight-loss-injections-time-limit).",
      ] },
      { heading: "What you can do if your jab costs more", blocks: [
        { list: [
          "**Talk to your prescriber early.** If you can't keep paying, tell them before you run out, not after. They can talk you through your options, which might include a different treatment, a different provider or stopping, and how to do any of these safely.",
          "**Check what you're really paying.** Compare the full monthly cost at your current and next dose, including consultation and delivery fees, and what happens to the price after any first-month offer.",
          "**Don't change how you use your pens to make them last.** Splitting doses, spacing injections out or using leftover medicine without your prescriber's advice can be unsafe.",
          "**Never buy from social media, beauty salons or unregulated websites.** The MHRA has warned about fake weight-loss pens, some of which have put people in hospital. Only use a UK-registered pharmacy with a prescription: you can check any pharmacy, including online ones, on the General Pharmaceutical Council register.",
          "**Plan for the year after now, whatever you decide.** If cost means you'll stop sooner than expected, putting habits in place while your appetite is still quiet makes the biggest difference. See [stopping because of the cost](/guides/stopping-weight-loss-jabs-because-of-cost).",
        ] },
        { note: "Steadie doesn't give advice about medicines, doses or stopping. Those decisions are for you and your prescriber.", tone: "butter" },
      ] },
      { heading: "If you've already had to stop", blocks: [
        "You're not alone, and it isn't something you've done wrong. Hunger usually returns over the weeks after the last dose, and some weight often comes back, but habits make a real difference. Start with [what happens when you stop](/guides/what-happens-when-you-stop-weight-loss-injections) and [keeping weight off after a GLP-1](/guides/keep-weight-off-after-glp-1).",
      ] },
    ],
    faqs: [
      { q: "Is Mounjaro going up in price again?", a: "As of 9 October 2026, Eli Lilly hasn't announced another UK list price rise. The big rise was on 1 September 2025. Private pharmacies set their own prices, so check yours before each order." },
      { q: "Did the price rise affect NHS patients?", a: "No. NHS patients pay the standard prescription charge in England, and nothing in Scotland, Wales and Northern Ireland, whatever the list price." },
      { q: "Has Wegovy gone up in price?", a: "Novo Nordisk hasn't announced a UK list price rise for Wegovy. Retail prices still differ between pharmacies and change over time." },
      { q: "Can I make my pens last longer to save money?", a: "Don't change how you use your medicine without your prescriber's advice. If cost is a problem, tell your prescriber; they can talk you through safe options." },
      { q: "Is it safe to buy cheaper jabs online?", a: "Only from a UK-registered pharmacy with a prescription. The MHRA has warned about fake pens sold online and on social media. Check a pharmacy on the General Pharmaceutical Council register, and report anything suspicious through the Yellow Card scheme." },
    ],
    sources: [S.lillyPrice, S.cpeMounjaro, S.niceTa1026, S.nhsTirzepatide, S.mhraFakePens, S.gphcRegister, S.yellowCard],
    related: ["stopping-weight-loss-jabs-because-of-cost", "nhs-weight-loss-injections-time-limit", "questions-to-ask-before-stopping-weight-loss-injections", "coming-off-glp-1"],
  },
  {
    slug: "stopping-weight-loss-jabs-because-of-cost",
    title: "Stopping weight-loss jabs because of the cost: how to plan the year after",
    metaTitle: "Stopping weight-loss jabs because of cost: a plan",
    description: "If the price means you're coming off Mounjaro or Wegovy sooner than planned, here's how to prepare: what to ask, what to set up before your last dose, and low-cost habits that help.",
    category: "Coming off",
    keywords: ["stopping mounjaro because of cost", "can't afford weight loss jab", "coming off mounjaro price rise", "keep weight off after stopping jab cheap"],
    published: D, updated: D,
    summary: [
      "Many people stop a weight-loss jab because of the cost. It's a common reason, and planning makes the year after easier.",
      "Agree how and when to stop with your prescriber, before you run out.",
      "Use the last weeks, while appetite is still quiet, to set up protein-first meals, two strength sessions a week and a daily walk.",
      "The habits with the best evidence are also some of the cheapest: home strength work, walking and budget protein foods.",
    ],
    sections: [
      { heading: "Start with your prescriber", blocks: [
        "Tell your prescriber that cost is the reason, and do it before your last pen runs out. They can tell you how and when to stop safely, check anything that needs checking (especially if you take other medicines or have type 2 diabetes), and talk you through other options if you want them.",
        "Our list of [questions to ask before stopping](/guides/questions-to-ask-before-stopping-weight-loss-injections) is a good starting point.",
        { note: "If you take a GLP-1 for type 2 diabetes, stopping can affect your blood sugar. Talk to your diabetes team before changing anything.", tone: "butter" },
      ] },
      { heading: "What to expect", blocks: [
        "As the medicine leaves your body over a few weeks, hunger and \"food noise\" usually come back. In trials, people regained a good share of the weight within a year on average, though some kept most of it off. That's biology, not a lack of effort. More in [what happens when you stop](/guides/what-happens-when-you-stop-weight-loss-injections).",
      ] },
      { heading: "Set things up before your last dose", blocks: [
        "The weeks before you stop are the easiest time to build routines, because appetite is still low:",
        { list: [
          "**Pick three go-to breakfasts and lunches** built around protein. See [high-protein breakfasts](/guides/high-protein-breakfasts-uk).",
          "**Start two short strength sessions a week**, if they're right for you. Twenty-five minutes at home with a chair is enough to begin. See [strength training after a GLP-1](/guides/strength-training-after-glp-1).",
          "**Build a daily walk** into something you already do, like the school run or a lunch break.",
          "**Decide how you'll keep an eye on things**: a weekly weigh-in, how your clothes fit, or how hungry you feel.",
        ] },
        "There's a step-by-step version in [building habits before you stop](/guides/building-habits-before-you-stop).",
      ] },
      { heading: "Habits that cost very little", blocks: [
        "The habits with the best evidence for keeping weight off don't need expensive kit or foods:",
        { list: [
          "**Budget protein:** eggs, tinned fish, beans and lentils, frozen chicken, Greek-style yoghurt, cottage cheese and tofu. Aim for a palm-sized portion at each meal. See [protein after a GLP-1](/guides/protein-after-glp-1).",
          "**Fibre for fullness:** oats, wholegrains, frozen veg and tinned pulses are cheap and keep you fuller for longer.",
          "**Strength at home:** sit-to-stands from a chair, wall press-ups and rows with a backpack need no gym.",
          "**Walking:** free, and it does steady work between strength sessions. See [walking to keep weight off](/guides/walking-to-keep-weight-off).",
          "**Sleep:** short nights turn up appetite for many people. See [sleep, stress and appetite](/guides/sleep-stress-and-appetite).",
        ] },
      ] },
      { heading: "Ask about support", blocks: [
        "NICE says people should be offered at least a year of support after a weight-loss medicine ends. Ask your prescriber or GP what's available locally, including NHS weight-management services.",
        "Steadie is a 12-month plan built for this year: protein-first meals, short strength sessions shown by people of all ages and sizes, three small habits a week and a calm plan if weight starts to drift. It doesn't give advice about medicines.",
      ] },
    ],
    faqs: [
      { q: "Can I stop Mounjaro straight away if I can't afford it?", a: "Talk to your prescriber first. They'll tell you how and when to stop based on your dose and health. Steadie doesn't give advice about stopping or changing doses." },
      { q: "Will I regain the weight if I stop because of cost?", a: "Many people regain some weight after stopping, whatever the reason. In trials, about two-thirds came back within a year on average, but some people kept most of it off. Protein, strength exercise and regular meals give you the best chance." },
      { q: "What's the cheapest way to keep weight off after a jab?", a: "Protein at every meal from budget foods like eggs, beans and tinned fish, two strength sessions a week at home, and a daily walk. None of these need a gym or special products." },
    ],
    sources: [S.step1, S.surmount4, S.bmjReview, S.niceQs212, S.niceNews, S.lundgren, S.bdaResource, S.nhsActivity],
    related: ["weight-loss-jab-price-rise-uk", "building-habits-before-you-stop", "protein-after-glp-1", "keep-weight-off-after-glp-1"],
  },
];
