import { S } from "./sources";
import type { Guide } from "./types";

const D = "2026-10-06";

export const BASICS: Guide[] = [
  {
    slug: "what-are-glp-1-medicines",
    title: "What are GLP-1 medicines? A plain-English guide",
    metaTitle: "What are GLP-1 weight-loss medicines? Plain English",
    description: "What GLP-1 medicines like Wegovy, Mounjaro and Ozempic are, how they affect appetite, and why the year after stopping matters.",
    category: "Basics",
    keywords: ["what is glp-1", "glp-1 weight loss injection uk", "semaglutide vs tirzepatide", "how do weight loss injections work"],
    published: D, updated: D,
    summary: [
      "GLP-1 medicines copy a gut hormone that signals fullness and slows the stomach.",
      "Semaglutide (Wegovy, Ozempic) and tirzepatide (Mounjaro) are the most common in the UK.",
      "They reduce appetite while you take them; appetite usually returns after you stop.",
    ],
    sections: [
      { heading: "How they work", blocks: [
        "GLP-1 (glucagon-like peptide-1) is a hormone your gut releases after eating. It tells your brain you've had enough, slows how quickly your stomach empties and helps control blood sugar. GLP-1 medicines copy it and last much longer, so appetite stays lower.",
        "Tirzepatide also acts on a second hormone signal, GIP. Both are weekly injections.",
      ] },
      { heading: "The medicines you'll hear about", blocks: [
        { list: [
          "**Wegovy:** semaglutide, licensed for weight management.",
          "**Ozempic:** semaglutide, licensed in the UK for type 2 diabetes.",
          "**Mounjaro:** tirzepatide, licensed for weight management and type 2 diabetes.",
          "**Saxenda:** liraglutide, an older daily injection.",
        ] },
        { note: "Wegovy, Ozempic and Saxenda are trademarks of Novo Nordisk; Mounjaro of Eli Lilly. Landing isn't connected with either company and doesn't give advice about medication.", tone: "sky" },
      ] },
      { heading: "Why the year after matters", blocks: [
        "Because these medicines work while you take them, appetite and weight often return after stopping. That's why NICE says people should get at least a year of support afterwards. See [coming off a GLP-1](/guides/coming-off-glp-1) and [what happens when you stop](/guides/what-happens-when-you-stop-weight-loss-injections).",
      ] },
    ],
    faqs: [
      { q: "What's the difference between semaglutide and tirzepatide?", a: "Semaglutide acts on the GLP-1 signal; tirzepatide acts on both GLP-1 and GIP. Both reduce appetite and are taken as weekly injections." },
    ],
    sources: [S.nhsSemaglutide, S.nhsTirzepatide, S.niceTa875, S.niceTa1026, S.niceQs212],
    related: ["coming-off-glp-1", "what-happens-when-you-stop-weight-loss-injections", "glp-1-glossary"],
  },
  {
    slug: "glp-1-glossary",
    title: "GLP-1 glossary: the words you'll hear, explained",
    metaTitle: "GLP-1 glossary: food noise, maintenance and more",
    description: "Food noise, lean mass, steady zone, maintenance, titration and more: the terms around weight-loss injections in plain English.",
    category: "Basics",
    keywords: ["food noise meaning", "what is lean mass", "glp-1 terms", "weight maintenance meaning"],
    published: D, updated: D,
    summary: [
      "Short, plain-English definitions of the words people use around weight-loss injections.",
    ],
    sections: [
      { heading: "A to Z", blocks: [
        { list: [
          "**Food noise:** a common way of describing frequent, intrusive thoughts about food. Many people find GLP-1s quieten it, and that it returns after stopping. See [appetite after stopping](/guides/appetite-after-stopping-glp-1).",
          "**GIP:** another gut hormone. Tirzepatide acts on GIP as well as GLP-1.",
          "**GLP-1:** a gut hormone that signals fullness. See [what are GLP-1 medicines](/guides/what-are-glp-1-medicines).",
          "**Lean mass:** everything in your body that isn't fat, including muscle, water and organs. Some of the weight lost on GLP-1s is lean mass. See [strength training](/guides/strength-training-after-glp-1).",
          "**Maintenance:** keeping your weight roughly steady after losing it. See [how to keep weight off](/guides/keep-weight-off-after-glp-1).",
          "**Regain:** weight coming back after stopping treatment. Common, and not a personal failing. See [what happens when you stop](/guides/what-happens-when-you-stop-weight-loss-injections).",
          "**Steady zone:** a small range just above your lowest weight. While your 7-day average sits inside it, you're holding steady. See [weight after stopping](/guides/weight-after-stopping-glp-1).",
          "**Titration:** changing a dose step by step. Decisions about doses are always for your prescriber.",
          "**7-day average:** your average weight across a week. It smooths out day-to-day water changes.",
        ] },
      ] },
    ],
    faqs: [
      { q: "What does food noise mean?", a: "It's a common way of describing frequent, intrusive thoughts about food. Many people find GLP-1 medicines quieten it." },
    ],
    sources: [S.bdaResource, S.nhsSemaglutide],
    related: ["what-are-glp-1-medicines", "appetite-after-stopping-glp-1", "coming-off-glp-1"],
  },
];
