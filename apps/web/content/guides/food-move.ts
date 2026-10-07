import { S } from "./sources";
import type { Guide } from "./types";

const D = "2026-10-06";

export const FOOD_MOVE: Guide[] = [
  {
    slug: "protein-after-glp-1",
    pillar: true,
    title: "Protein after a GLP-1: how much you need and easy ways to get it",
    metaTitle: "How much protein after weight-loss injections?",
    description: "Why protein matters after Wegovy or Mounjaro, a simple per-meal target, and easy UK foods that get you there without counting everything.",
    category: "Food",
    keywords: ["protein after glp-1", "how much protein after wegovy", "protein on mounjaro", "high protein foods uk", "protein to keep muscle"],
    published: D, updated: D,
    summary: [
      "Protein helps you feel full and helps protect muscle, both of which matter after a GLP-1.",
      "A simple target: a palm-sized portion, about 25 to 30 g, at each meal.",
      "Many guides suggest around 1.0 to 1.2 g per kg of body weight a day for adults; if you have kidney disease or are pregnant, follow your healthcare team's advice.",
    ],
    sections: [
      { heading: "Why protein matters now", blocks: [
        "Protein is the most filling of the nutrients, so meals built around it help with the hunger that returns after a GLP-1. It also helps your body hold on to muscle, and some of the weight lost on these medicines is lean mass, which includes muscle. Protein plus [strength exercise](/guides/strength-training-after-glp-1) is the main way to protect it.",
      ] },
      { heading: "How much protein?", blocks: [
        "Rather than counting grams all day, aim for a palm-sized portion of protein at each meal. That's about 25 to 30 g, the amount research suggests is useful for muscle at a meal, especially as we get older. Three meals and a protein snack comes to roughly 90 to 120 g a day for most adults.",
        "Expert groups suggest about 1.0 to 1.2 g of protein per kg of body weight a day for older adults, and a recent joint advisory for people using GLP-1 medicines suggests a similar range. For people with a high body weight, these are usually worked out from a healthier reference weight rather than current weight.",
        { note: "If you have kidney disease, are pregnant, or have been given protein advice by your healthcare team, follow their advice rather than these general amounts.", tone: "butter" },
      ] },
      { heading: "Easy protein, UK supermarket edition", blocks: [
        { list: [
          "Eggs (about 6 to 7 g each).",
          "Greek-style yoghurt, skyr or high-protein yoghurt pots.",
          "Cottage cheese.",
          "Cooked chicken pieces or a rotisserie chicken.",
          "Tinned tuna, salmon, mackerel or sardines.",
          "Frozen prawns and fish fillets.",
          "Tinned or pouch beans, lentils and chickpeas.",
          "Tofu, tempeh, Quorn and edamame.",
          "Milk, or a protein milk drink when you're on the go.",
        ] },
      ] },
      { heading: "Start with breakfast", blocks: [
        "Breakfast is the meal most often light on protein. Moving some protein there spreads it across the day and helps with mid-morning hunger. See [high-protein breakfasts](/guides/high-protein-breakfasts-uk).",
      ] },
    ],
    faqs: [
      { q: "How much protein should I eat after stopping Wegovy?", a: "A simple target is a palm-sized portion, about 25 to 30 g, at each meal. If you have a health condition, follow your healthcare team's advice." },
      { q: "Do I need protein shakes?", a: "No. Everyday foods like eggs, yoghurt, fish, chicken, beans and tofu are enough. A protein drink can be handy on the go." },
      { q: "Is high protein safe with kidney disease?", a: "If you have kidney disease, follow your kidney team's advice about protein. General targets aren't right for everyone." },
    ],
    sources: [S.paddonJones, S.protAge, S.jointAdvisory, S.bdaResource, S.bnfSummary, S.eatwell],
    related: ["high-protein-breakfasts-uk", "strength-training-after-glp-1", "keep-weight-off-after-glp-1", "appetite-after-stopping-glp-1"],
  },
  {
    slug: "high-protein-breakfasts-uk",
    title: "High-protein breakfasts: 10 quick ideas with 25 g or more",
    metaTitle: "High-protein breakfast ideas (UK): 10 quick ones",
    description: "Ten quick high-protein breakfasts using UK supermarket foods, most in five minutes or less, to keep you fuller after a GLP-1.",
    category: "Food",
    keywords: ["high protein breakfast uk", "quick high protein breakfast", "protein breakfast ideas", "breakfast after weight loss injections"],
    published: D, updated: D,
    summary: [
      "Breakfast is the meal most often light on protein.",
      "Aim for about 25 g at breakfast to help with mid-morning hunger.",
      "Most of these take five minutes or less.",
    ],
    sections: [
      { heading: "Ten breakfasts with about 25 g of protein", blocks: [
        "Protein amounts are approximate and depend on the products you buy.",
        { list: [
          "**Greek yoghurt bowl:** 200 g Greek-style yoghurt or skyr, berries and a spoon of seeds.",
          "**Eggs on toast:** three eggs, scrambled or poached, on wholemeal toast.",
          "**Cottage cheese toast:** cottage cheese on rye with tomatoes and black pepper.",
          "**Protein porridge:** oats made with milk, stirred through with a spoon of Greek yoghurt.",
          "**Overnight oats:** oats, milk and skyr, made the night before.",
          "**Smoked salmon bagel:** a wholemeal bagel with soft cheese and smoked salmon.",
          "**Egg muffins:** eggs baked with spinach and peppers, made ahead for the week.",
          "**Beans on toast plus an egg:** half a tin of beans and a poached egg.",
          "**Tofu scramble:** crumbled tofu fried with spices and spinach.",
          "**On the go:** a protein milk drink and a piece of fruit.",
        ], ordered: true },
      ] },
      { heading: "Make it easy", blocks: [
        "Pick two breakfasts and rotate them for a couple of weeks. Keep the ingredients in every week's shop. Once breakfast is sorted, move on to lunch. See [protein after a GLP-1](/guides/protein-after-glp-1).",
      ] },
    ],
    faqs: [
      { q: "What's a quick high-protein breakfast?", a: "Greek yoghurt or skyr with berries and seeds takes two minutes and gives around 20 to 25 g of protein." },
    ],
    sources: [S.paddonJones, S.eatwell, S.bdaResource],
    related: ["protein-after-glp-1", "keep-weight-off-after-glp-1", "building-habits-before-you-stop"],
  },
  {
    slug: "strength-training-after-glp-1",
    pillar: true,
    title: "Strength training after a GLP-1: protect muscle and stay steady",
    metaTitle: "Strength training after Wegovy or Mounjaro",
    description: "Why muscle matters after weight-loss injections, how much strength exercise you need, and a simple 25-minute home routine for beginners.",
    category: "Movement",
    keywords: ["muscle loss ozempic", "strength training after wegovy", "exercise after mounjaro", "keep muscle on glp-1", "beginner strength workout at home"],
    published: D, updated: D,
    summary: [
      "Some of the weight lost on GLP-1 medicines is lean mass, which includes muscle.",
      "Strength exercise twice a week helps you keep and rebuild it. Once built, strength holds with one or two sessions a week.",
      "Two sessions of about 25 minutes at home are plenty to start.",
      "Stop if anything hurts sharply, and check with your GP first if you have a heart condition or recent surgery.",
    ],
    sections: [
      { heading: "Why muscle matters after a GLP-1", blocks: [
        "When you lose weight quickly, some of what's lost is lean mass, which includes muscle. Muscle helps you stay strong for everyday life (stairs, shopping, getting up from a chair) and supports your metabolism. In one trial, people who exercised during treatment kept more weight off after stopping than those who took the medicine alone.",
      ] },
      { heading: "How much do you need?", blocks: [
        "UK guidance is muscle-strengthening activity on at least two days a week, plus at least 150 minutes of moderate activity. One to three sets of each move, stopping a couple of reps before it gets too hard, is enough. Once you've built strength, keeping it needs less: one or two sessions a week at the same effort.",
      ] },
      { heading: "A simple home session", blocks: [
        "Do each move for 10 reps (or 20 seconds), rest, and repeat two or three times. Most moves have an easier version.",
        { list: [
          "**Sit to stand:** sit back to a chair and stand tall. Easier: use your hands.",
          "**Wall press-up:** hands on a wall at shoulder height, lower slowly.",
          "**Step-up:** step onto the bottom stair, push through the front heel.",
          "**Glute bridge:** lying on your back, push through your heels to lift your hips.",
          "**Band pull-apart or one-arm row:** pull a band apart, or row a bag of shopping.",
          "**Side plank:** on your knees if you need, hips lifted.",
        ], ordered: true },
        "Feeling worked, a little stiff the next day, is normal. Sharp pain isn't: stop and use the easier version, or skip the move.",
      ] },
      { heading: "Check first if…", blocks: [
        { note: "If you have chest pain, unexplained breathlessness, a heart condition diagnosed or changed recently, recent surgery, very high blood pressure that isn't controlled, or you've fainted recently, check with your GP before starting strength exercise.", tone: "butter" },
        "Steadie asks a short health check before you start and adjusts sessions for sore joints, falls and fatigue, starting with easier versions and stepping up gently.",
      ] },
    ],
    faqs: [
      { q: "Does Ozempic cause muscle loss?", a: "Some of the weight lost on semaglutide, as with any fast weight loss, is lean mass, which includes muscle. Protein and strength exercise help protect it." },
      { q: "How often should I do strength training after stopping Mounjaro?", a: "Twice a week is a good target. Once you've built strength, one or two sessions a week helps keep it." },
      { q: "Do I need a gym?", a: "No. A chair, a wall, a stair and a resistance band or a bag of shopping are enough to start." },
    ],
    sources: [S.lundgren, S.cmoGuidelines, S.nhsActivity, S.jointAdvisory, S.bdaResource],
    related: ["walking-to-keep-weight-off", "protein-after-glp-1", "keep-weight-off-after-glp-1"],
  },
  {
    slug: "walking-to-keep-weight-off",
    title: "Walking and everyday activity after a GLP-1",
    metaTitle: "Walking to keep weight off after weight-loss jabs",
    description: "How much activity helps keep weight off after Wegovy or Mounjaro, and easy ways to fit more walking into a busy week.",
    category: "Movement",
    keywords: ["walking to maintain weight loss", "steps a day to keep weight off", "exercise after stopping wegovy", "activity after mounjaro"],
    published: D, updated: D,
    summary: [
      "UK guidance is at least 150 minutes of moderate activity a week, in any amounts.",
      "Walking is the easiest way to get there, and it adds up across the day.",
      "A 10-minute walk after a meal is a simple habit to start with.",
    ],
    sections: [
      { heading: "How much activity?", blocks: [
        "The UK Chief Medical Officers recommend at least 150 minutes of moderate activity a week, such as brisk walking, plus strength exercise on two days. Any amount counts, and more is better. People who keep weight off over time tend to move a lot day to day.",
      ] },
      { heading: "Easy ways to walk more", blocks: [
        { list: [
          "A 10-minute walk after dinner.",
          "Get off a stop early, or park further away.",
          "Take phone calls on foot.",
          "A longer walk at the weekend with someone you like.",
          "Check your steps once to know your starting point, then add a little.",
        ] },
      ] },
      { heading: "Walking and strength work together", blocks: [
        "Walking builds fitness and adds daily movement; [strength exercise](/guides/strength-training-after-glp-1) protects muscle. Together they're the movement side of [keeping weight off](/guides/keep-weight-off-after-glp-1).",
      ] },
    ],
    faqs: [
      { q: "How many steps a day to keep weight off?", a: "There's no single number. UK guidance focuses on at least 150 minutes of moderate activity a week. Many people find adding 2,000 to 3,000 steps to their usual day a realistic start." },
    ],
    sources: [S.cmoGuidelines, S.nhsActivity],
    related: ["strength-training-after-glp-1", "keep-weight-off-after-glp-1", "sleep-stress-and-appetite"],
  },
];
