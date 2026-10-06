import { S } from "./sources";
import type { Guide } from "./types";

const D = "2026-10-06";

export const KEEPING: Guide[] = [
  {
    slug: "keep-weight-off-after-glp-1",
    pillar: true,
    title: "How to keep weight off after stopping a GLP-1",
    metaTitle: "How to keep weight off after Wegovy or Mounjaro",
    description: "The habits with the best evidence for holding steady after weight-loss injections: protein, strength, regular meals, movement, sleep, and a plan for drift.",
    category: "Keeping it off",
    keywords: ["keep weight off after wegovy", "how to maintain weight after mounjaro", "maintain weight loss after glp-1", "weight maintenance after weight loss injections"],
    published: D, updated: D,
    summary: [
      "Weight often comes back after stopping because appetite returns. It's biology, and it can be managed.",
      "Protein at every meal and strength exercise twice a week protect muscle and help with fullness.",
      "Regular meals, fibre, walking and sleep make hunger easier to live with.",
      "A calm plan for if weight starts to drift stops small changes becoming big ones.",
    ],
    sections: [
      { heading: "Why holding steady is hard after a GLP-1", blocks: [
        "Your body adapts to weight loss: appetite hormones shift and you need a little less energy than before. While you're on a GLP-1 the medicine dampens that pull. When it stops, the pull returns. That's why regain is so common, and why it isn't about willpower. See [what happens when you stop](/guides/what-happens-when-you-stop-weight-loss-injections).",
        "The good news: some people do hold most of their loss, and the habits below have good evidence behind them.",
      ] },
      { heading: "1. Protein first, at every meal", blocks: [
        "Protein helps you feel fuller for longer and helps protect muscle. A palm-sized portion, about 25 to 30 g, at each meal is a simple target. Start with breakfast, the meal most often light on protein. Read [protein after a GLP-1](/guides/protein-after-glp-1) and get [breakfast ideas](/guides/high-protein-breakfasts-uk).",
      ] },
      { heading: "2. Strength exercise, twice a week", blocks: [
        "Part of the weight lost on these medicines is lean mass, which includes muscle. Strength work twice a week helps you keep and rebuild it, and in one trial people who exercised during treatment kept more weight off after stopping. Two sessions of about 25 minutes at home is plenty. See [strength training after a GLP-1](/guides/strength-training-after-glp-1).",
      ] },
      { heading: "3. Regular meals with fibre", blocks: [
        "A rough rhythm of meals makes hunger easier to predict and plan for. Fibre from beans, lentils, oats, wholegrains, fruit and veg adds bulk and fullness. Build it up slowly, with plenty to drink.",
      ] },
      { heading: "4. Move more, every day", blocks: [
        "UK guidance is at least 150 minutes of moderate activity a week plus strength work on two days. Walking is the easiest way to get there. See [walking and everyday activity](/guides/walking-to-keep-weight-off).",
      ] },
      { heading: "5. Sleep and stress", blocks: [
        "After a short night, many people feel hungrier. Stress can do the same. A steady bedtime and a few calming routines make everything else easier. See [sleep, stress and appetite](/guides/sleep-stress-and-appetite).",
      ] },
      { heading: "6. A calm plan for drift", blocks: [
        "Use a 7-day average rather than single weigh-ins, and set a small steady zone just above your lowest weight. If the average sits above it for a couple of weeks, go back to the basics for a week: protein first, regular meals, two sessions, more walking. See [weight after stopping](/guides/weight-after-stopping-glp-1).",
        { note: "If you notice worrying thoughts about food or your body, Beat, the UK's eating disorder charity, has a helpline. You can also skip weighing altogether.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "Can you keep weight off after stopping Wegovy or Mounjaro?", a: "Some people do. Regain is common, but protein, strength exercise, regular meals, activity and good sleep improve your chances." },
      { q: "What should I eat after stopping a GLP-1?", a: "Meals built around protein, with vegetables, fibre-rich carbs and plenty to drink. Regular meals help hunger feel more predictable." },
      { q: "How much exercise do I need to keep weight off?", a: "UK guidance is at least 150 minutes of moderate activity a week and strength exercise on two days. Many people find walking plus two short strength sessions a good start." },
    ],
    sources: [S.step1, S.surmount4Acc, S.bmjReview, S.lundgren, S.niceQs212, S.cmoGuidelines, S.nhsActivity, S.jointAdvisory, S.bdaResource, S.beat],
    related: ["coming-off-glp-1", "protein-after-glp-1", "strength-training-after-glp-1", "weight-after-stopping-glp-1"],
  },
  {
    slug: "appetite-after-stopping-glp-1",
    title: "Hunger after stopping a GLP-1: why it comes back and what helps",
    metaTitle: "Hunger after stopping Wegovy or Mounjaro: what helps",
    description: "Why appetite and food noise return after weight-loss injections, when it usually happens, and practical ways to make hunger easier to live with.",
    category: "Keeping it off",
    keywords: ["hungry after stopping wegovy", "appetite after stopping mounjaro", "food noise after stopping ozempic", "hunger after weight loss injection"],
    published: D, updated: D,
    summary: [
      "GLP-1 medicines quieten appetite. When they leave your body, hunger and food noise usually come back within weeks.",
      "It's expected, not a sign anything has gone wrong.",
      "Protein, fibre, regular meals and a plan for your hungriest time of day help most.",
    ],
    sections: [
      { heading: "Why hunger comes back", blocks: [
        "GLP-1 medicines copy a gut hormone that signals fullness and slow down how quickly your stomach empties. Semaglutide and tirzepatide take several weeks to clear after your last dose. As they do, fullness signals weaken, portions start to feel smaller and thoughts about food can return. Some people describe it as the volume on \"food noise\" going back up.",
      ] },
      { heading: "When it happens", blocks: [
        "Most people notice changes within a few weeks of their last dose, and the first couple of months are often the hardest. Food preferences can shift back too: some people who went off rich or sugary foods find they enjoy them again.",
      ] },
      { heading: "What helps", blocks: [
        { list: [
          "**Protein first.** Start meals with the protein. It helps fullness. See [protein after a GLP-1](/guides/protein-after-glp-1).",
          "**Fibre and volume.** Vegetables, soups, beans and lentils fill you up for fewer calories.",
          "**Regular meals.** Knowing when you'll next eat makes hunger easier to sit with.",
          "**A plan for your hungriest time.** Many people find mid-afternoon or evening hardest. Have a protein snack ready.",
          "**Drink first.** Thirst can feel like hunger. A glass of water is a quick check.",
          "**Pause before seconds.** Fullness takes a little while to arrive. Wait ten minutes, then decide.",
        ] },
      ] },
      { heading: "Is it real hunger?", blocks: [
        "Rating hunger from 1 (very hungry) to 5 (comfortably full) before you eat helps you notice the difference between physical hunger and eating out of tiredness, stress or habit. Both are human. Noticing gives you a moment to choose. See [cravings after stopping](/guides/cravings-after-stopping-glp-1).",
      ] },
    ],
    faqs: [
      { q: "How long after stopping Wegovy does hunger come back?", a: "Usually within a few weeks, as semaglutide leaves the body over several weeks after the last dose." },
      { q: "Will food noise come back after Mounjaro?", a: "Many people notice thoughts about food return as tirzepatide clears. Regular, protein-rich meals and a plan for hungry times help." },
    ],
    sources: [S.bdaResource, S.jointAdvisory, S.paddonJones, S.nhsSemaglutide, S.nhsTirzepatide],
    related: ["cravings-after-stopping-glp-1", "protein-after-glp-1", "keep-weight-off-after-glp-1", "sleep-stress-and-appetite"],
  },
  {
    slug: "weight-after-stopping-glp-1",
    title: "Your weight after stopping a GLP-1: fluctuations, trends and a steady zone",
    metaTitle: "Weight going up after stopping Mounjaro or Wegovy?",
    description: "Why the scales jump around after stopping weight-loss injections, how to read a 7-day trend, and a calm way to notice drift early.",
    category: "Keeping it off",
    keywords: ["weight going up after stopping mounjaro", "weight fluctuation after stopping wegovy", "gained weight after stopping ozempic", "how often should I weigh myself"],
    published: D, updated: D,
    summary: [
      "Day-to-day weight changes by a kilo or more with water, salt, sleep and hormones.",
      "A 7-day average shows the real trend.",
      "A small steady zone above your lowest weight tells you when, and only when, to act.",
      "Weighing is optional. If it doesn't help you, other signals work too.",
    ],
    sections: [
      { heading: "Why the scales jump around", blocks: [
        "A salty meal, a drink, a short night, a hard workout or your menstrual cycle can move the scales by a kilo or more overnight. None of that is fat. When appetite returns after stopping a GLP-1, you may also carry a little more food and water day to day. Reacting to every number is exhausting and tells you very little.",
      ] },
      { heading: "Use a 7-day average", blocks: [
        "If you weigh yourself, do it at the same time a few mornings a week and look at the average across seven days. The average smooths out the noise and shows which way things are really heading.",
      ] },
      { heading: "Set a steady zone", blocks: [
        "Pick a small range, for example up to 2% above your lowest weight. While your 7-day average sits inside it, you're holding steady, whatever single days say. If the average sits above it for a couple of weeks, that's your cue to go back to basics for a week, not to panic. See [how to keep weight off](/guides/keep-weight-off-after-glp-1).",
      ] },
      { heading: "If you'd rather not weigh yourself", blocks: [
        "You don't have to. How your clothes fit, how hungry you feel, your energy and whether your routines are holding are all useful signals. Landing's safe mode hides weight completely and builds your weekly score from habits and check-ins instead.",
        { note: "If thoughts about your weight or food feel overwhelming, Beat, the UK's eating disorder charity, has a helpline you can talk to.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "Is it normal to gain weight after stopping Mounjaro?", a: "Yes, some regain is common as appetite returns. Look at the trend over weeks, not single days, and lean on protein, strength exercise and regular meals." },
      { q: "How often should I weigh myself after stopping?", a: "If it helps you, a few mornings a week at the same time, looking at the 7-day average. If it doesn't help, you can skip it." },
    ],
    sources: [S.step1, S.bmjReview, S.niceQs212, S.beat],
    related: ["keep-weight-off-after-glp-1", "what-happens-when-you-stop-weight-loss-injections", "appetite-after-stopping-glp-1"],
  },
  {
    slug: "cravings-after-stopping-glp-1",
    title: "Cravings after stopping a GLP-1: how to ride them out",
    metaTitle: "Cravings after stopping Ozempic, Wegovy or Mounjaro",
    description: "Why cravings feel stronger after weight-loss injections, how long a craving lasts, and kind, practical ways to handle them.",
    category: "Keeping it off",
    keywords: ["cravings after stopping ozempic", "sugar cravings after stopping wegovy", "emotional eating after mounjaro", "food noise after glp-1"],
    published: D, updated: D,
    summary: [
      "Cravings often return as GLP-1 medicines wear off. That's normal.",
      "A craving tends to rise and fall within about 15 to 20 minutes.",
      "Planned treats, protein-rich meals and non-food comforts help more than strict rules.",
    ],
    sections: [
      { heading: "Why cravings come back", blocks: [
        "GLP-1 medicines quieten the brain's interest in food, including the pull of sweet and rich foods. As the medicine wears off, that pull returns. It can feel stronger by contrast, after months of not noticing it.",
      ] },
      { heading: "A craving is a wave", blocks: [
        "Most cravings build, peak and fade within about 15 to 20 minutes, especially if you do something else in the meantime: a short walk, a drink, a call or finishing a task.",
        "If you still want the food afterwards, have a portion on a plate, sit down and enjoy it. A planned treat is very different from grazing, and it isn't a slip.",
      ] },
      { heading: "Make cravings less likely", blocks: [
        { list: [
          "Eat regular meals with protein, so you don't arrive at the evening ravenous.",
          "Keep a few favourite treats in portions rather than big bags.",
          "Notice your patterns: tiredness, stress and evenings are common triggers. See [sleep, stress and appetite](/guides/sleep-stress-and-appetite).",
          "Have a short list of non-food comforts ready: a bath, a walk, music, ten minutes outside.",
        ] },
      ] },
      { heading: "When it feels like more than cravings", blocks: [
        { note: "If eating feels out of control, or you're using food to cope most of the time, you deserve support. Talk to your GP, or contact Beat, the UK's eating disorder charity.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "Why do I crave sugar after stopping Wegovy?", a: "Semaglutide reduces interest in sweet and rich foods for many people. As it wears off, that interest often returns. Regular protein-rich meals and planned treats help." },
      { q: "How long does a craving last?", a: "Often about 15 to 20 minutes before it eases, especially if you do something else." },
    ],
    sources: [S.bdaResource, S.beat],
    related: ["appetite-after-stopping-glp-1", "sleep-stress-and-appetite", "keep-weight-off-after-glp-1"],
  },
  {
    slug: "sleep-stress-and-appetite",
    title: "Sleep, stress and appetite after weight-loss injections",
    metaTitle: "Sleep, stress and hunger after weight-loss injections",
    description: "How short nights and stressful weeks turn up appetite, and simple routines that make holding steady easier after a GLP-1.",
    category: "Keeping it off",
    keywords: ["sleep and appetite", "stress eating after wegovy", "tired and hungry", "sleep weight maintenance"],
    published: D, updated: D,
    summary: [
      "After a short night, many people feel hungrier and reach for quick energy.",
      "Stress changes appetite for many people and makes routines slip.",
      "A steady bedtime and one or two anchor habits on hard days help more than strict rules.",
    ],
    sections: [
      { heading: "Sleep and hunger", blocks: [
        "Many people notice they're hungrier and crave quick energy after a poor night. It's a common pattern, and it can matter more once a GLP-1 is no longer damping appetite. Tracking how you slept alongside how hungry you felt is a simple way to see whether it's true for you.",
        { list: [
          "Keep a similar bedtime and wake time on most days.",
          "Wind down for half an hour without screens.",
          "Keep the bedroom cool, dark and quiet.",
          "Leave caffeine for the morning.",
        ] },
      ] },
      { heading: "Stress and eating", blocks: [
        "When life is busy or hard, comfort eating and skipped routines are human, not a failure. Rather than trying to keep everything going, pick one or two anchors: protein at breakfast and a short walk, for example. Doing the minimum on a hard week still counts.",
      ] },
      { heading: "When to get support", blocks: [
        "If low mood, anxiety or stress are affecting your eating or sleep for more than a couple of weeks, talk to your GP. NHS talking therapies can be accessed without a GP referral in England.",
      ] },
    ],
    faqs: [
      { q: "Does poor sleep make you hungrier?", a: "Many people feel hungrier and crave quick energy after a short night. A steadier sleep routine often helps appetite feel more manageable." },
    ],
    sources: [S.nhsSleep, S.bdaResource],
    related: ["appetite-after-stopping-glp-1", "cravings-after-stopping-glp-1", "keep-weight-off-after-glp-1"],
  },
  {
    slug: "eating-out-after-glp-1",
    title: "Eating out and takeaways after a GLP-1",
    metaTitle: "Eating out and takeaways after weight-loss jabs",
    description: "Enjoy meals out and takeaways after stopping a GLP-1: how to choose, why one meal never undoes a steady week, and easy fakeaways.",
    category: "Keeping it off",
    keywords: ["eating out after wegovy", "takeaway after weight loss injection", "restaurant tips weight maintenance", "fakeaway high protein"],
    published: D, updated: D,
    summary: [
      "Meals out and takeaways belong in your plan. One meal never undoes a steady week.",
      "Look at the menu beforehand and choose a protein-first main.",
      "Takeaway portions vary hugely, so sharing or saving half is easy.",
      "A quick homemade fakeaway is often cheaper, faster and higher in protein.",
    ],
    sections: [
      { heading: "Before you go", blocks: [
        "Looking at the menu in advance takes the pressure off choosing at the table. Pick a main built around protein, add a side of veg or salad, and decide on extras when you get there.",
      ] },
      { heading: "At the table", blocks: [
        { list: [
          "Start with the protein on your plate.",
          "Eat slowly enough to notice when you've had enough.",
          "If you drink alcohol, alternate with water and eat first.",
          "Enjoy it. The next meal is just the next meal.",
        ] },
      ] },
      { heading: "Takeaways", blocks: [
        "Takeaway portions can vary enormously: Nesta's testing found the same \"regular\" pizza ranged from 600 to 2,300 calories between shops. Sharing a main, adding a side salad or saving half for tomorrow are easy wins.",
        "A homemade fakeaway (chicken tikka with microwave rice, a quick egg-fried rice with prawns, a lean beef burger) is often faster than delivery and higher in protein. Landing's meal plan includes takeaway nights and fakeaways for exactly this.",
      ] },
    ],
    faqs: [
      { q: "Can I still have takeaways after stopping Mounjaro?", a: "Yes. Plan them into your week, choose a protein-first main, and share or save half if portions are big." },
    ],
    sources: [S.nesta, S.bdaResource],
    related: ["keep-weight-off-after-glp-1", "protein-after-glp-1", "cravings-after-stopping-glp-1"],
  },
];
