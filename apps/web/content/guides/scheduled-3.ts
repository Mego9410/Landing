import { S } from "./sources";
import type { Guide, Source } from "./types";

// Extra sources for this batch, each checked to load (HTTP 200) before citing.
const nhsMenoSymptoms: Source = { label: "NHS: symptoms of menopause and perimenopause", url: "https://www.nhs.uk/conditions/menopause-and-perimenopause/symptoms/" };
const nhsMenoSelfCare: Source = { label: "NHS: things you can do to help menopause and perimenopause symptoms", url: "https://www.nhs.uk/conditions/menopause-and-perimenopause/things-you-can-do/" };
const nhsMenoTreatment: Source = { label: "NHS: treatment for menopause and perimenopause", url: "https://www.nhs.uk/conditions/menopause-and-perimenopause/treatment/" };
const nhsHrt: Source = { label: "NHS: hormone replacement therapy (HRT)", url: "https://www.nhs.uk/medicines/hormone-replacement-therapy-hrt/" };
const nhsEatingDisorders: Source = { label: "NHS: eating disorders overview", url: "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/behaviours/eating-disorders/overview/" };
const nhsTalkingTherapies: Source = { label: "NHS Talking Therapies for anxiety and depression", url: "https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/nhs-talking-therapies/" };
const beatHelplines: Source = { label: "Beat: helplines and support", url: "https://www.beateatingdisorders.org.uk/get-information-and-support/get-help-for-myself/i-need-support-now/helplines/" };
const nhsBodyDysmorphia: Source = { label: "NHS: body dysmorphic disorder (BDD)", url: "https://www.nhs.uk/mental-health/conditions/body-dysmorphia/" };
const emmCbt: Source = { label: "NHS Every Mind Matters: self-help CBT techniques", url: "https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/" };
const nhsFiveSteps: Source = { label: "NHS: 5 steps to mental wellbeing", url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/" };
const nhsEightTips: Source = { label: "NHS: 8 tips for healthy eating", url: "https://www.nhs.uk/live-well/eat-well/how-to-eat-a-balanced-diet/eight-tips-for-healthy-eating/" };
const nhsWater: Source = { label: "NHS: water, drinks and your health", url: "https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/water-drinks-nutrition/" };
const nhsStrength: Source = { label: "NHS: strength exercises", url: "https://www.nhs.uk/live-well/exercise/strength-exercises/" };

export const SCHEDULED_3: Guide[] = [
  {
    slug: "emotional-eating-after-glp-1",
    title: "Emotional eating after a GLP-1: when food becomes comfort again",
    metaTitle: "Emotional eating after stopping Wegovy or Mounjaro",
    description: "Why eating for comfort, stress or boredom can return after weight-loss injections, and kind, practical ways to notice triggers and pause.",
    category: "Keeping it off",
    keywords: ["emotional eating after stopping wegovy", "comfort eating after mounjaro", "stress eating after weight loss injections", "boredom eating after ozempic", "food noise and emotions"],
    published: "2026-10-27", updated: "2026-10-27",
    summary: [
      "GLP-1 medicines quieten appetite, and for many people that includes eating for comfort.",
      "As the medicine wears off, old patterns around stress, tiredness and boredom can come back.",
      "Noticing your triggers, taking a short pause and having other comforts ready all help.",
      "Being kind to yourself works better than strict rules. If eating feels out of control, Beat can help.",
    ],
    sections: [
      { heading: "Why comfort eating can come back", blocks: [
        "While you were taking a GLP-1, the medicine turned down appetite and, for many people, the pull towards food when they were stressed, tired or bored. Some people describe it as the first time food felt quiet. As the medicine leaves your body over several weeks, that quiet often fades and older habits can return. See [hunger after stopping](/guides/appetite-after-stopping-glp-1).",
        "This isn't a sign that you've done anything wrong. Eating for comfort is very human. Food is quick, it's soothing, and it's often been there for a long time. The aim isn't to never eat for comfort. It's to notice when it's happening and to have a few more choices.",
      ] },
      { heading: "Notice your triggers", blocks: [
        "Emotional eating usually has a pattern. Many people find it's linked to certain feelings, times of day or places. For a week or two, it can help to jot down a few words when you eat outside a meal: the time, how you were feeling and what was going on.",
        { list: [
          "**Stress:** a hard day at work, money worries, a difficult conversation.",
          "**Tiredness:** after a short night, many people reach for quick energy. See [sleep, stress and appetite](/guides/sleep-stress-and-appetite).",
          "**Boredom:** evenings in front of the TV, or waiting around.",
          "**Loneliness or low mood:** food as company, or as a small reward.",
          "**Habit:** the biscuit tin with every cup of tea, or snacking while cooking.",
        ] },
        "You're not looking for something to fix straight away. Seeing the pattern on paper often makes it feel less mysterious and more manageable.",
      ] },
      { heading: "Try a short pause", blocks: [
        "When you notice the urge to eat and you're not sure it's hunger, give yourself a short pause before deciding. It doesn't need to be long.",
        { list: [
          "Ask: am I hungry in my body, or am I stressed, tired or bored?",
          "Have a glass of water or a hot drink first.",
          "Wait ten minutes and do something else, then check in again.",
          "If you still want the food, have a portion on a plate, sit down and enjoy it.",
        ], ordered: true },
        "The pause isn't a test. Sometimes you'll eat anyway, and that's fine. Over time, the pause gives you a moment to choose rather than acting on autopilot. Urges, like [cravings](/guides/cravings-after-stopping-glp-1), often rise and fall if you give them a little time.",
      ] },
      { heading: "Have other comforts ready", blocks: [
        "If food has been your main way to unwind, it helps to have a short list of other things that soothe you. Write it down so it's there when you need it.",
        { list: [
          "A walk round the block, or ten minutes outside.",
          "A bath, a shower or a change into comfy clothes.",
          "Calling or messaging a friend.",
          "Music, a podcast or a few pages of a book.",
          "A few slow breaths, or a short breathing exercise.",
          "Going to bed a little earlier on a tiring day.",
        ] },
        "Regular meals with protein help too, because arriving at the evening very hungry makes everything harder. See [protein after a GLP-1](/guides/protein-after-glp-1).",
      ] },
      { heading: "Be kind to yourself", blocks: [
        "Harsh self-talk after eating for comfort tends to make the next urge stronger, not weaker. Try talking to yourself as you would to a friend: that was a hard day, it makes sense you wanted something comforting, and the next meal is just the next meal.",
        "If stress, low mood or anxiety are behind a lot of your eating, the feelings themselves deserve care. Self-help techniques based on CBT can help some people, and NHS Talking Therapies can be accessed without a GP referral in England. Your GP can also talk through support.",
      ] },
      { heading: "When to get support", blocks: [
        { note: "If eating often feels out of control, you eat large amounts and feel distressed afterwards, or you're worried about your eating or your body, you deserve support. Talk to your GP, or contact Beat, the UK's eating disorder charity, which runs helplines.", tone: "sky" },
        "Steadie's check-ins let you note how you're feeling alongside your habits, which can make patterns easier to spot over time.",
      ] },
    ],
    faqs: [
      { q: "Why am I comfort eating again after stopping Wegovy?", a: "Semaglutide quietens appetite and, for many people, the urge to eat for comfort. As it wears off, older patterns around stress, tiredness and boredom can return. It's common and not a sign you've done anything wrong." },
      { q: "How do I know if it's emotional hunger or real hunger?", a: "Physical hunger tends to build gradually and any filling food will do. Emotional hunger often comes on suddenly, wants something specific and is linked to a feeling. A short pause and a drink can help you tell the difference." },
      { q: "Is it okay to eat for comfort sometimes?", a: "Yes. Food is part of comfort and celebration for most people. The aim is to have other options too, so food isn't the only way you cope." },
      { q: "Where can I get help with emotional eating in the UK?", a: "Your GP is a good first step. Beat, the UK's eating disorder charity, runs helplines, and NHS Talking Therapies can help with stress, anxiety and low mood." },
    ],
    sources: [S.bdaResource, S.nhsSemaglutide, S.nhsTirzepatide, emmCbt, nhsTalkingTherapies, nhsEatingDisorders, S.beat, beatHelplines],
    related: ["cravings-after-stopping-glp-1", "sleep-stress-and-appetite", "appetite-after-stopping-glp-1", "body-image-after-weight-loss"],
  },
  {
    slug: "body-image-after-weight-loss",
    title: "Body image after weight loss: when your body changes faster than you do",
    metaTitle: "Body image after weight loss on Wegovy or Mounjaro",
    description: "Why your body can change faster than the way you see it after weight-loss injections, from loose skin to fear of regain, and gentle ways to cope.",
    category: "Keeping it off",
    keywords: ["body image after weight loss", "loose skin after mounjaro", "still feel fat after weight loss", "fear of regaining weight after wegovy", "body image after ozempic"],
    published: "2026-11-20", updated: "2026-11-20",
    summary: [
      "Weight can change quickly on a GLP-1, and the way you see yourself often takes longer to catch up.",
      "Loose skin, new clothes sizes and worry about regain are all common feelings.",
      "Focusing on what your body can do, not only how it looks, helps many people.",
      "If thoughts about your body feel overwhelming, your GP, Beat and Mind can help.",
    ],
    sections: [
      { heading: "When your body changes faster than your mind", blocks: [
        "Weight loss on a GLP-1 can happen over months rather than years. Many people find the picture they carry in their head doesn't keep up. You might still reach for your old size, avoid mirrors or photos, or feel surprised by your reflection. Others feel pleased and unsettled at the same time.",
        "All of this is normal. How we see our bodies is built over many years, and it rarely shifts as quickly as the scales. Giving yourself time is part of the process.",
      ] },
      { heading: "Loose skin and clothes", blocks: [
        "After losing a lot of weight, some people notice loose or softer skin, often around the tummy, arms or thighs. How much depends on things like age, genetics and how much weight changed. It can be upsetting, especially when you expected to feel only relief.",
        "Strength exercise won't remove loose skin, but building muscle can change how your body feels and moves. See [strength training after a GLP-1](/guides/strength-training-after-glp-1). If loose skin is causing rashes, soreness or problems day to day, mention it to your GP.",
        "Clothes can be a surprisingly emotional part of this. A few practical ideas:",
        { list: [
          "Buy a small number of things that fit now, rather than a whole new wardrobe.",
          "Try charity shops or swap with friends while your size settles.",
          "Keep a couple of favourite older pieces if they mean something to you. You don't have to clear everything at once.",
          "Notice what feels comfortable, not just what size it says on the label.",
        ] },
      ] },
      { heading: "Fear of regain", blocks: [
        "Many people worry about weight coming back after stopping a GLP-1, especially as appetite returns. Some weight change is common, and day-to-day ups and downs are mostly water, not fat. See [your weight after stopping](/guides/weight-after-stopping-glp-1).",
        "If weighing yourself makes the fear louder, you don't have to do it. How your clothes fit, your energy and whether your routines are holding are useful signals too. Leaning on a few steady habits, like protein at meals and regular movement, often feels calmer than watching every number. See [how to keep weight off](/guides/keep-weight-off-after-glp-1).",
      ] },
      { heading: "Focus on what your body can do", blocks: [
        "Shifting some attention from how your body looks to what it does can soften harsh thoughts. Many people find this easier to feel than to think.",
        { list: [
          "Notice small wins: climbing the stairs without stopping, carrying the shopping, playing with children or grandchildren.",
          "Keep a short note of things your body let you do this week.",
          "Try a type of movement you enjoy, such as walking with a friend, swimming or dancing in the kitchen. See [walking and everyday activity](/guides/walking-to-keep-weight-off).",
          "Unfollow accounts that leave you feeling worse about your body, and follow some that feel kinder.",
        ] },
        "If you do any exercise, check with your GP first if you have a health condition, and stop if anything hurts, you feel dizzy or have chest pain.",
      ] },
      { heading: "Be gentle with the words you use", blocks: [
        "Notice how you talk about your body, out loud and in your head. Would you say the same to a friend? Swapping a harsh phrase for a neutral one (\"this is my tummy\" rather than something cruel) can feel small, but small changes add up.",
        "It can also help to tell someone you trust how you're feeling. Many people keep these thoughts to themselves, and saying them out loud often makes them lighter.",
      ] },
      { heading: "When to get support", blocks: [
        { note: "If thoughts about your body or weight take up a lot of your day, you're checking mirrors or avoiding them constantly, or you're worried about your eating, please talk to your GP. Beat, the UK's eating disorder charity, has helplines, and Mind, the mental health charity, has information and support. NHS Talking Therapies can be accessed without a GP referral in England.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "Why do I still feel big after losing weight?", a: "The way you see your body builds up over years and often takes longer to change than your weight does. It's very common after fast weight loss, and it usually eases with time." },
      { q: "Will loose skin go away after Mounjaro?", a: "It varies from person to person, depending on things like age, genetics and how much weight changed. If loose skin causes soreness or rashes, talk to your GP." },
      { q: "How do I stop worrying about regaining weight?", a: "Focusing on a few steady habits, looking at trends over weeks rather than single days, and choosing not to weigh if it doesn't help can all make the worry quieter." },
    ],
    sources: [nhsBodyDysmorphia, nhsEatingDisorders, S.beat, beatHelplines, nhsTalkingTherapies, S.step1, S.cmoGuidelines],
    related: ["emotional-eating-after-glp-1", "weight-after-stopping-glp-1", "keep-weight-off-after-glp-1", "strength-training-after-glp-1"],
  },
  {
    slug: "eating-slowly-and-fullness",
    title: "Eating slowly and noticing fullness after a GLP-1",
    metaTitle: "Eating slowly and fullness after weight-loss jabs",
    description: "How to notice fullness again after months of quiet appetite on a GLP-1, with simple tips for eating more slowly and leaving meals comfortably satisfied.",
    category: "Keeping it off",
    keywords: ["how to eat slowly", "fullness signals after stopping wegovy", "how to know when you're full", "mindful eating after mounjaro", "eating too fast"],
    published: "2026-12-11", updated: "2026-12-11",
    summary: [
      "On a GLP-1, fullness came quickly. After stopping, you may need to notice it again.",
      "Fullness signals take a little while to arrive, so eating more slowly gives them time.",
      "Putting your cutlery down, a smaller plate and protein and veg first all help.",
      "Aim for comfortably satisfied, not stuffed, and be patient as you relearn your signals.",
    ],
    sections: [
      { heading: "Why fullness can feel unfamiliar", blocks: [
        "GLP-1 medicines slow how quickly your stomach empties and boost the signals that tell your brain you've had enough. Many people found a few mouthfuls felt like plenty. As the medicine leaves your body, those signals weaken and fullness takes longer to arrive. See [hunger after stopping](/guides/appetite-after-stopping-glp-1).",
        "After months of not needing to listen for fullness, it can feel unfamiliar. The good news is that it's a skill, and it gets easier with practice.",
      ] },
      { heading: "Why eating slowly helps", blocks: [
        "Your gut and brain take a little while to register what you've eaten. If you eat quickly, it's easy to finish a large plate before the \"that's enough\" feeling turns up. Eating more slowly gives fullness time to catch up with you.",
        "Slowing down also tends to make food more enjoyable. You taste more, notice textures and feel more satisfied by the same meal.",
      ] },
      { heading: "Practical ways to slow down", blocks: [
        { list: [
          "**Put your cutlery down** between mouthfuls, and pick it up again once you've swallowed.",
          "**Sit at a table** rather than eating on the sofa, at your desk or standing in the kitchen.",
          "**Turn off screens** for at least part of the meal, so you notice what you're eating.",
          "**Use a smaller plate or bowl.** A full smaller plate often feels more satisfying than a half-empty large one.",
          "**Start with protein and veg.** Protein is filling, and vegetables add bulk. See [protein after a GLP-1](/guides/protein-after-glp-1).",
          "**Have water with your meal.** Sipping between mouthfuls naturally slows the pace, and the NHS suggests 6 to 8 glasses of fluid a day.",
          "**Chew well** and notice the taste before reaching for the next forkful.",
          "**Eat with others** when you can. Conversation slows things down.",
        ] },
      ] },
      { heading: "Learn your fullness signals", blocks: [
        "A simple scale can help. Before and partway through a meal, rate how you feel from 1 (very hungry) to 5 (comfortably full). Many people find it useful to aim for around 4: no longer hungry, satisfied, but not uncomfortable.",
        "Signs you're getting there include food tasting a little less exciting, your pace slowing on its own, or a sense that you could stop. Fullness can be subtle at first. Halfway through, pause for a minute and check in.",
        "If you're not sure, wait ten minutes before going back for more. If you're still hungry, have some. This isn't about leaving food on principle. It's about giving yourself the information to decide. For more on serving sizes, see [portion sizes without counting](/guides/portion-sizes-without-counting).",
      ] },
      { heading: "When it's hard", blocks: [
        "Some days you'll eat quickly, or past full. That's normal. Busy lunches, family meals and celebrations don't always leave room for slow eating, and one meal never undoes a steady week.",
        "If you often arrive at meals very hungry, eating fast is almost automatic. Regular meals and a protein snack at your hungriest time of day can take the edge off. Tiredness can make slow eating harder too. See [sleep, stress and appetite](/guides/sleep-stress-and-appetite).",
        { note: "If eating often feels out of control, or you feel very distressed after meals, talk to your GP or contact Beat, the UK's eating disorder charity.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "How do I know when I'm full after stopping Mounjaro?", a: "Fullness may take longer to notice as tirzepatide wears off. Eating more slowly, pausing halfway and rating your hunger from 1 to 5 can help you spot it." },
      { q: "Does eating slowly really help?", a: "Fullness signals take a little while to reach your brain, so eating more slowly gives them time to arrive. Many people also find they enjoy their food more." },
      { q: "Should I drink water with meals?", a: "Sipping water with a meal can slow your pace and helps you stay hydrated. The NHS suggests 6 to 8 glasses of fluid a day." },
    ],
    sources: [S.nhsSemaglutide, S.nhsTirzepatide, S.bdaResource, S.paddonJones, nhsEightTips, nhsWater, S.eatwell, S.beat],
    related: ["appetite-after-stopping-glp-1", "portion-sizes-without-counting", "protein-after-glp-1", "emotional-eating-after-glp-1"],
  },
  {
    slug: "menopause-and-weight-after-glp-1",
    title: "Menopause and weight after a GLP-1: what changes and what helps",
    metaTitle: "Menopause and weight after Wegovy or Mounjaro",
    description: "Why perimenopause and menopause can change weight and body shape after weight-loss injections, and how sleep, strength, protein and your GP can help.",
    category: "Keeping it off",
    keywords: ["menopause weight gain after wegovy", "perimenopause and mounjaro", "menopause belly fat", "menopause weight after stopping weight loss injections", "strength training menopause"],
    published: "2026-12-22", updated: "2026-12-22",
    summary: [
      "Weight gain during perimenopause and menopause is common, often around the stomach and upper body.",
      "Hot flushes and poor sleep can make appetite and routines harder to manage.",
      "Strength exercise, protein at meals and regular sleep routines help many women.",
      "Talk to your GP about symptoms and treatment options, including HRT. That's a decision for you and them.",
    ],
    sections: [
      { heading: "Why menopause can change your weight", blocks: [
        "Perimenopause is the time leading up to menopause, when hormone levels change and periods become irregular. Menopause is when periods have stopped. The NHS notes that weight gain during perimenopause and menopause is common, and that it often happens around the stomach and upper body.",
        "Many women also notice their body shape changing even when their weight stays similar. Muscle tends to decline with age unless we work to keep it, which matters because some of the weight lost on a GLP-1 is lean mass too. See [muscle loss on a GLP-1](/guides/muscle-loss-on-glp-1).",
        "If you're coming off a GLP-1 around the same time, it can feel like several things are changing at once: appetite returning, hormones shifting and sleep being disrupted. None of this is a personal shortcoming. It's a lot, and it's worth being kind to yourself.",
      ] },
      { heading: "Sleep and hot flushes", blocks: [
        "Hot flushes and night sweats can wake you up, and poor sleep can leave you irritable, tired and craving quick energy. Many people find they're hungrier after a short night. See [sleep, stress and appetite](/guides/sleep-stress-and-appetite).",
        { list: [
          "Keep to a regular sleep routine where you can, which the NHS suggests for menopause symptoms.",
          "Keep the bedroom cool, with layers you can throw off.",
          "Wear light, breathable nightwear.",
          "Notice whether alcohol, caffeine or spicy food late in the day seem to make flushes worse for you.",
          "Try relaxing things such as yoga, tai chi or a few slow breaths before bed.",
        ] },
      ] },
      { heading: "Strength exercise: the big one", blocks: [
        "The NHS suggests regular exercise during menopause, with a focus on weight-bearing exercise to build strength, which can help protect against weakening bones. Strength work also helps you keep muscle, which supports everyday life and how you feel in your body.",
        "UK guidance for all adults is muscle-strengthening activity on at least two days a week. Two short sessions at home are a good start. See [strength training after a GLP-1](/guides/strength-training-after-glp-1) and [strength training for older adults](/guides/strength-training-older-adults). Walking adds weight-bearing movement too.",
        { note: "Check with your GP first if you have a health condition, and stop if anything hurts, you feel dizzy or have chest pain.", tone: "butter" },
      ] },
      { heading: "Protein, calcium and everyday food", blocks: [
        "Protein at every meal helps with fullness and, alongside strength exercise, helps protect muscle. A palm-sized portion, about 25 to 30 g, at each meal is a simple target. See [protein after a GLP-1](/guides/protein-after-glp-1).",
        "The NHS also suggests calcium-rich foods such as milk, yoghurt and kale to help keep bones healthy. Some easy meals cover both:",
        { list: [
          "Greek-style yoghurt or skyr with berries and seeds.",
          "Tinned sardines or salmon (with the soft bones) on wholemeal toast.",
          "Cottage cheese with oatcakes and tomatoes.",
          "Tofu stir-fry with greens.",
          "Porridge made with milk.",
        ] },
        "If you have kidney disease or have been given protein advice by your healthcare team, follow their advice rather than general amounts.",
      ] },
      { heading: "Talk to your GP about symptoms", blocks: [
        "If perimenopause or menopause symptoms are affecting your sleep, mood, work or relationships, talk to your GP, a nurse or a pharmacist. The NHS says the main treatment for those who need it is hormone replacement therapy (HRT), and there are other options too. Whether any treatment is right for you is a conversation for you and your doctor, not something a guide can decide.",
        "It can help to note your symptoms for a few weeks before the appointment: hot flushes, sleep, mood, periods and anything else that has changed. Mention any medicines you take or have recently stopped, including a GLP-1. If you have type 2 diabetes, your diabetes team should know about any changes too. See [questions to ask before stopping](/guides/questions-to-ask-before-stopping-weight-loss-injections) for the kind of list that helps.",
        { note: "This is general information, not medical advice. Decisions about HRT, other menopause treatments or your GLP-1 medicine are for you and your prescriber.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "Is weight gain normal during menopause?", a: "Yes. The NHS says weight gain during perimenopause and menopause is common, often around the stomach and upper body." },
      { q: "What exercise helps most during menopause?", a: "The NHS suggests regular exercise with a focus on weight-bearing strength work, which can help protect your bones. Two strength sessions a week plus walking is a good start." },
      { q: "Should I take HRT after stopping Mounjaro?", a: "That's a decision for you and your GP or prescriber. Talk to them about your symptoms and the options available, and mention any medicines you take or have stopped." },
      { q: "Does poor sleep from night sweats affect appetite?", a: "Many people feel hungrier and crave quick energy after a short night. A cool bedroom and a regular sleep routine can help, and your GP can talk through treatment for night sweats." },
    ],
    sources: [nhsMenoSymptoms, nhsMenoSelfCare, nhsMenoTreatment, nhsHrt, S.cmoGuidelines, S.paddonJones, S.jointAdvisory, nhsStrength],
    related: ["strength-training-after-glp-1", "protein-after-glp-1", "sleep-stress-and-appetite", "muscle-loss-on-glp-1"],
  },
  {
    slug: "small-habits-that-stick",
    title: "Small habits that stick: a gentle way to change after a GLP-1",
    metaTitle: "Small habits that stick: how to build them gently",
    description: "How to make small habits last after weight-loss injections: tie them to routines you already have, keep them tiny, and plan for off days.",
    category: "Keeping it off",
    keywords: ["how to make habits stick", "small healthy habits", "habit stacking", "healthy habits after stopping wegovy", "building habits after mounjaro"],
    published: "2026-12-25", updated: "2026-12-25",
    summary: [
      "Small habits you can keep beat a big overhaul you can't.",
      "Tie each new habit to something you already do every day.",
      "Make it tiny, plan for off days, and start with a few at a time.",
      "Missing a day is normal. What matters is coming back to it.",
    ],
    sections: [
      { heading: "Why small beats big", blocks: [
        "When the medicine has been doing a lot of the work on appetite, it's tempting to replace it with a big new plan all at once. Big plans are exciting, but they're also easy to drop when life gets busy. Small habits are easier to start, easier to keep and easier to come back to after a busy week.",
        "And if you're reading this on Christmas Day: there's nothing to start today. Enjoy it. This is one to come back to whenever you're ready.",
      ] },
      { heading: "Tie habits to what you already do", blocks: [
        "The easiest habits ride on routines you already have. Instead of \"I'll walk more\", try \"after I drop the kids at school, I'll walk for ten minutes\". The existing routine becomes your reminder.",
        { list: [
          "After I put the kettle on in the morning, I'll get the yoghurt and berries out.",
          "After dinner, I'll walk round the block.",
          "While the kettle boils, I'll do five sit-to-stands from a kitchen chair.",
          "When I sit down for lunch, I'll put my phone in another room.",
          "After I brush my teeth at night, I'll put my phone on charge outside the bedroom.",
        ] },
      ] },
      { heading: "Make it tiny", blocks: [
        "A habit that feels almost too easy is much more likely to last. You can always do more on a good day, but the tiny version is what you count.",
        { list: [
          "One protein food at breakfast, rather than a whole new meal plan. See [high-protein breakfasts](/guides/high-protein-breakfasts-uk).",
          "A ten-minute walk, rather than a daily hour. See [walking and everyday activity](/guides/walking-to-keep-weight-off).",
          "One set of a strength move, rather than a full workout. See [strength training at home](/guides/strength-training-at-home-no-equipment).",
          "A glass of water with each meal.",
        ] },
        "If you're adding movement, check with your GP first if you have a health condition, and stop if anything hurts, you feel dizzy or have chest pain.",
      ] },
      { heading: "Three habits a week, not a whole new life", blocks: [
        "Rather than changing everything, choose up to three small habits for the week ahead. Many people find a mix works well: one food habit, one movement habit and one for rest or calm.",
        "At the end of the week, check in. Which ones felt easy? Which ones didn't happen, and why? Keep what's working, make the tricky ones smaller, and only add something new once the first few feel like part of your day. This is the same idea as [building habits before you stop](/guides/building-habits-before-you-stop), and it works just as well afterwards.",
      ] },
      { heading: "Plan for off days", blocks: [
        "Off days are part of life: illness, a late night, a family visit, a hard week at work. The habits that last are the ones with a plan for those days.",
        { list: [
          "Decide on a \"minimum version\" of each habit, like a five-minute walk or just the yoghurt.",
          "If you miss a day, aim to pick it up at the next chance rather than waiting for Monday.",
          "Notice what got in the way, without judging it. That's useful information.",
          "Remember that one missed day doesn't undo a steady week.",
        ] },
      ] },
      { heading: "Be kind to yourself", blocks: [
        "Habits grow faster with encouragement than with criticism. Notice what you did, not just what you didn't. A short weekly check-in, written down or in Steadie, can help you see how much you're doing. For the bigger picture, see [how to keep weight off](/guides/keep-weight-off-after-glp-1).",
      ] },
    ],
    faqs: [
      { q: "How do I make a new habit stick?", a: "Tie it to something you already do every day, make it small enough to do even on a busy day, and have a plan for what you'll do if you miss one." },
      { q: "How many habits should I start at once?", a: "Up to three a week is plenty for most people. Once they feel easy, you can add more." },
      { q: "What if I miss a day?", a: "That's normal. Pick the habit up at the next chance rather than waiting for a fresh start. One missed day doesn't undo a steady week." },
    ],
    sources: [S.niceQs212, S.bdaResource, S.cmoGuidelines, S.nhsActivity, nhsFiveSteps, nhsEightTips],
    related: ["building-habits-before-you-stop", "keep-weight-off-after-glp-1", "new-year-without-a-diet", "walking-to-keep-weight-off"],
  },
  {
    slug: "new-year-without-a-diet",
    title: "A calm New Year after a weight-loss jab, without a diet",
    metaTitle: "New Year without a diet after weight-loss jabs",
    description: "Why crash diets and January extremes tend to backfire after weight-loss injections, and how to set steady habits for the year ahead instead.",
    category: "Keeping it off",
    keywords: ["new year diet after wegovy", "january weight loss after mounjaro", "new year resolutions weight", "healthy new year without dieting", "after christmas weight gain"],
    published: "2027-01-01", updated: "2027-01-01",
    summary: [
      "January often brings pressure to diet hard. After a GLP-1, extremes tend to backfire.",
      "Very strict eating can make hunger louder and risks losing muscle.",
      "Steady habits work better: protein, strength exercise, walking and regular meals.",
      "A kind weekly check-in beats a dramatic fresh start.",
    ],
    sections: [
      { heading: "January pressure", blocks: [
        "After the festive break, the messages start: new year, new you, crash diets and month-long challenges. If you've come off a weight-loss jab, or are thinking about it, that pressure can feel strong, especially if your weight has moved over Christmas.",
        "A few days of rich food and late nights don't undo months of steady habits. Much of the change you see on the scales after a holiday is water, salt and food in your system rather than fat. See [your weight after stopping](/guides/weight-after-stopping-glp-1).",
      ] },
      { heading: "Why crash diets and extremes backfire", blocks: [
        "After a GLP-1, appetite often returns and your body is already pushing back after weight loss. Cutting right back on food tends to make hunger and food noise louder, not quieter. Many people find a hard January is followed by a hungry, tired February. See [hunger after stopping](/guides/appetite-after-stopping-glp-1).",
        "Fast weight loss also means some of what's lost is lean mass, which includes muscle. Very strict eating with little protein can add to that. Muscle helps you stay strong for everyday life, so protecting it matters more than a quick drop on the scales.",
        "Extremes are also hard to keep up. When the rules are very strict, a single off day can feel like the whole plan has gone, which makes it easy to give up altogether.",
      ] },
      { heading: "What to do instead: steady habits", blocks: [
        "The habits with the best evidence for holding steady after a GLP-1 aren't dramatic. They're the everyday basics, done most days. Pick two or three for January.",
        { list: [
          "**Protein at each meal.** A palm-sized portion, about 25 to 30 g, helps with fullness and muscle. See [protein after a GLP-1](/guides/protein-after-glp-1).",
          "**Strength exercise twice a week.** Two short home sessions are plenty to start. See [strength training after a GLP-1](/guides/strength-training-after-glp-1).",
          "**Walking most days.** UK guidance is at least 150 minutes of moderate activity a week, in any amounts. See [walking and everyday activity](/guides/walking-to-keep-weight-off).",
          "**Regular meals with fibre.** Vegetables, beans, lentils, oats and wholegrains help you feel full.",
          "**A steady bedtime.** Short nights make hunger harder to manage.",
        ] },
        "If you're adding exercise, check with your GP first if you have a health condition, and stop if anything hurts, you feel dizzy or have chest pain.",
      ] },
      { heading: "Set intentions, not rules", blocks: [
        "Instead of \"no sugar in January\" or \"lose a stone by spring\", try intentions you can actually do each week: \"yoghurt and fruit for breakfast on weekdays\", \"a walk after Sunday lunch\", \"two strength sessions\". They're about actions, not outcomes, so they're within your control.",
        "Keep foods you love in your week. Planned treats are part of a steady way of eating. See [small habits that stick](/guides/small-habits-that-stick) for ways to make new habits last.",
      ] },
      { heading: "Kind check-ins", blocks: [
        "Once a week, take five minutes to look back. What went well? What got in the way? What's one small thing to try next week? If you weigh yourself, look at the 7-day average rather than single days, and remember that weighing is optional.",
        "Steadie's weekly check-in is built around this kind of calm review, with habits at the centre rather than the scales.",
        { note: "If January diet talk brings up worrying thoughts about food or your body, Beat, the UK's eating disorder charity, has helplines. If you're still taking a GLP-1 or have type 2 diabetes, talk to your prescriber before making big changes to how you eat.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "Should I go on a diet in January after stopping Wegovy?", a: "Crash diets tend to make hunger louder and risk losing muscle. Steady habits like protein at meals, strength exercise, walking and regular meals usually work better." },
      { q: "I gained weight over Christmas after stopping Mounjaro. What should I do?", a: "Much of the change after a holiday is water and salt rather than fat. Go back to your everyday habits, look at the trend over a couple of weeks, and be kind to yourself." },
      { q: "What's a good New Year resolution after weight-loss injections?", a: "Pick two or three small, specific habits, like protein at breakfast, two strength sessions a week and a daily walk, and check in kindly each week." },
    ],
    sources: [S.step1, S.bmjReview, S.lundgren, S.cmoGuidelines, S.nhsActivity, S.jointAdvisory, S.bdaResource, S.beat],
    related: ["keep-weight-off-after-glp-1", "small-habits-that-stick", "weight-after-stopping-glp-1", "protein-after-glp-1"],
  },
];
