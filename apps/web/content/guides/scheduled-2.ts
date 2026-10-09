import type { Guide } from "./types";
import { S } from "./sources";

// Extra sources for this batch. Each URL was checked to return 200 before it was added.
const nhsOlderAdults = { label: "NHS: physical activity guidelines for older adults", url: "https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-older-adults/" };
const nhsSitting = { label: "NHS: sitting exercises", url: "https://www.nhs.uk/live-well/exercise/sitting-exercises/" };
const nhsBalance = { label: "NHS: balance exercises", url: "https://www.nhs.uk/live-well/exercise/balance-exercises/" };
const nhsStrengthEx = { label: "NHS: strength exercises", url: "https://www.nhs.uk/live-well/exercise/strength-exercises/" };
const nhsFalls = { label: "NHS: falls", url: "https://www.nhs.uk/conditions/falls/" };
const nhsEatwellPage = { label: "NHS: the Eatwell Guide", url: "https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/" };
const bnfPortions = { label: "British Nutrition Foundation: portion sizes", url: "https://www.nutrition.org.uk/creating-a-healthy-diet/portion-sizes/" };
const nhsDigestion = { label: "NHS: good foods to help your digestion", url: "https://www.nhs.uk/live-well/eat-well/digestive-health/good-foods-to-help-your-digestion/" };
const nhsConstipation = { label: "NHS: constipation", url: "https://www.nhs.uk/conditions/constipation/" };
const nhsJointPain = { label: "NHS: joint pain", url: "https://www.nhs.uk/symptoms/joint-pain/" };
const nhsKneePain = { label: "NHS: knee pain", url: "https://www.nhs.uk/symptoms/knee-pain/" };
const nhsBackPain = { label: "NHS: back pain", url: "https://www.nhs.uk/conditions/back-pain/" };
const nhsOsteoarthritis = { label: "NHS: osteoarthritis, treatment and support", url: "https://www.nhs.uk/conditions/osteoarthritis/treatment/" };

const SAFETY = "Check with your GP first if you have a health condition. Stop if anything hurts, you feel dizzy or have chest pain.";

export const SCHEDULED_2: Guide[] = [
  {
    slug: "muscle-loss-on-glp-1",
    title: "Muscle loss on a GLP-1: why it happens and how to protect it",
    metaTitle: "Muscle loss on GLP-1s: why it happens and what helps",
    description: "Why some of the weight lost on Wegovy or Mounjaro is muscle, why that matters for strength and later life, and how protein and strength work help.",
    category: "Movement",
    keywords: ["muscle loss on glp-1", "muscle loss ozempic", "losing muscle on mounjaro", "lean mass wegovy", "how to keep muscle on weight loss injections"],
    published: "2026-10-16", updated: "2026-10-16",
    summary: [
      "Some of the weight lost on GLP-1 medicines is lean mass, which includes muscle.",
      "That's true of most fast weight loss, not just these medicines.",
      "Muscle matters for everyday strength, balance and staying independent as you get older.",
      "Protein at each meal and strength exercise twice a week are the two things that help most.",
    ],
    sections: [
      { heading: "What's actually lost when you lose weight", blocks: [
        "When you lose weight, you don't only lose fat. Some of what goes is lean mass, which includes muscle. This happens with most weight loss, and it can be more noticeable when weight comes off quickly, as it often does on semaglutide or tirzepatide.",
        "Eating much less is part of why. GLP-1 medicines quieten appetite, so many people eat smaller meals and less protein than before. If you're also less active, your body has fewer reasons to hold on to muscle.",
        "None of this means the medicine has done you harm. It's a reason to pay attention to two things alongside it: what you eat and how you move.",
      ] },
      { heading: "Why muscle matters", blocks: [
        { list: [
          "**Everyday strength.** Muscle is what gets you up from a chair, up the stairs and home with the shopping.",
          "**Balance and falls.** Stronger legs and hips help you stay steady on your feet.",
          "**Metabolism.** Muscle supports your metabolism.",
          "**Later life.** We naturally lose some muscle as we get older. Starting from a stronger base makes a real difference in your 60s, 70s and beyond.",
        ] },
        "There's also a link with keeping weight off. In one trial, people who exercised during treatment kept more weight off after stopping than those who took the medicine alone. See [what happens when you stop](/guides/what-happens-when-you-stop-weight-loss-injections).",
      ] },
      { heading: "Protein: a palm at every meal", blocks: [
        "Protein gives your body what it needs to keep and rebuild muscle, and it's the most filling of the nutrients. A simple target is a palm-sized portion, about 25 to 30 g, at each meal. Research suggests that's a useful amount for muscle at a meal, especially as we get older.",
        "Expert groups suggest about 1.0 to 1.2 g of protein per kg of body weight a day for older adults, and a recent joint advisory for people using GLP-1 medicines suggests a similar range. You don't need to count: eggs, Greek yoghurt, cottage cheese, chicken, tinned fish, beans, lentils and tofu all count. See [protein after a GLP-1](/guides/protein-after-glp-1) and [high-protein breakfasts](/guides/high-protein-breakfasts-uk).",
        { note: "If you have kidney disease, are pregnant, or have been given protein advice by your healthcare team, follow their advice rather than these general amounts.", tone: "butter" },
      ] },
      { heading: "Strength work: twice a week", blocks: [
        "Protein on its own isn't enough. Muscle needs a reason to stay, and strength exercise gives it one. UK guidance is muscle-strengthening activity on at least two days a week, alongside at least 150 minutes of moderate activity such as brisk walking.",
        "You don't need a gym. Sit-to-stands from a chair, wall press-ups, step-ups and carrying shopping bags all count. Two sessions of about 25 minutes is plenty to start. Try the [no-equipment home routine](/guides/strength-training-at-home-no-equipment), or read [strength training after a GLP-1](/guides/strength-training-after-glp-1) for the bigger picture.",
        { note: SAFETY, tone: "sky" },
      ] },
      { heading: "Whether you're still on it or coming off", blocks: [
        "Protein and strength work help while you're taking a GLP-1 and after you stop. The earlier you start, the more muscle you have to carry with you. If you're thinking about coming off, these are good habits to build now; see [building habits before you stop](/guides/building-habits-before-you-stop).",
        "Decisions about your medicine, including whether and when to stop, are for you and your prescriber. If you have type 2 diabetes, any change to your medicines needs their input.",
      ] },
    ],
    faqs: [
      { q: "Do Wegovy and Mounjaro cause muscle loss?", a: "Some of the weight lost on semaglutide or tirzepatide is lean mass, which includes muscle. That's true of most fast weight loss. Protein and strength exercise help protect it." },
      { q: "How do I stop losing muscle on a GLP-1?", a: "Aim for a palm-sized portion of protein, about 25 to 30 g, at each meal, and do strength exercise on at least two days a week. Walking helps too." },
      { q: "Can I rebuild muscle after weight loss?", a: "Yes. Muscle responds to strength exercise and enough protein at any age. Start gently and build up over weeks." },
      { q: "Do I need protein shakes to keep muscle?", a: "No. Everyday foods like eggs, yoghurt, fish, chicken, beans and tofu are enough. A protein drink can be handy on the go." },
    ],
    sources: [S.jointAdvisory, S.paddonJones, S.protAge, S.lundgren, S.cmoGuidelines, S.nhsActivity, S.bdaResource],
    related: ["strength-training-after-glp-1", "protein-after-glp-1", "strength-training-at-home-no-equipment", "strength-training-older-adults"],
  },
  {
    slug: "strength-training-at-home-no-equipment",
    title: "Strength training at home with no equipment: a 25-minute beginner routine",
    metaTitle: "Strength training at home, no equipment: 25-min plan",
    description: "A simple 25-minute beginner strength routine using a chair, a wall and your shopping bags, how to make it harder over time, and how often to do it.",
    category: "Movement",
    keywords: ["strength training at home no equipment", "beginner home workout uk", "home strength workout for beginners", "exercise after wegovy at home", "chair exercises strength"],
    published: "2026-10-23", updated: "2026-10-23",
    summary: [
      "You can build real strength at home with a chair, a wall, a stair and a few bags.",
      "Six moves, about 25 minutes, twice a week is a good start.",
      "Make it harder slowly: more reps, then slower reps, then a heavier bag.",
      "Check with your GP first if you have a health condition, and stop if anything hurts.",
    ],
    sections: [
      { heading: "Why bother with strength at home", blocks: [
        "Some of the weight lost on GLP-1 medicines is lean mass, which includes muscle. Strength exercise is how you keep and rebuild it. See [muscle loss on a GLP-1](/guides/muscle-loss-on-glp-1).",
        "UK guidance is muscle-strengthening activity on at least two days a week. A home routine takes away the travel, the cost and the worry about being watched, which makes it easier to keep going.",
      ] },
      { heading: "What you need", blocks: [
        { list: [
          "A sturdy chair without wheels.",
          "A clear bit of wall.",
          "The bottom stair, or a sturdy low step.",
          "A backpack you can put tins or bottles of water in.",
          "Two shopping bags with handles.",
        ] },
        "Wear comfortable clothes and shoes with a good grip, and keep some water nearby.",
      ] },
      { heading: "The 25-minute routine", blocks: [
        "Warm up for three or four minutes first: march on the spot, roll your shoulders, swing your arms. Then do each move for about 10 reps, rest for a minute, and go round the circuit two or three times.",
        { list: [
          "**Sit-to-stand:** sit on the front of the chair, feet flat, and stand up tall, then sit back down slowly. Easier: push off with your hands.",
          "**Wall press-up:** hands on the wall at shoulder height, step your feet back, bend your elbows to bring your chest towards the wall, then push away.",
          "**Step-up:** step up onto the bottom stair with one foot, push through that heel to stand tall, step down. Swap legs. Hold the banister if you like.",
          "**Glute bridge:** lie on your back with knees bent and feet flat. Push through your heels to lift your hips, pause, lower slowly.",
          "**Backpack row:** put a few tins in a backpack. With one hand on the chair and a slight bend forward, pull the bag up towards your hip, then lower. Do both sides.",
          "**Farmer carry:** pick up two shopping bags, one in each hand, stand tall and walk slowly up and down the room or hallway for about 30 seconds.",
        ], ordered: true },
        "Finish with a few minutes of gentle stretching and slow walking.",
        { note: SAFETY, tone: "butter" },
      ] },
      { heading: "How hard should it feel?", blocks: [
        "Aim to finish each set feeling you could have done a couple more reps, but not many. The NHS describes strength work as doing an activity to the point where you need a short rest before repeating it.",
        "Feeling worked, or a little stiff the next day, is normal. Sharp pain isn't: stop, use the easier version, or skip that move. If you have sore knees, hips or back, see [exercise with joint pain](/guides/exercise-with-joint-pain).",
      ] },
      { heading: "How to make it harder over time", blocks: [
        "When a move starts to feel easy, change one thing at a time, every week or two:",
        { list: [
          "**More reps:** go from 10 to 12, then 15.",
          "**Slower reps:** take three seconds to lower in each sit-to-stand or press-up.",
          "**More weight:** add another tin or bottle to the backpack or bags.",
          "**Harder versions:** sit-to-stand without hands, press-ups on the kitchen worktop instead of the wall, a single-leg bridge.",
          "**One more round:** build up from two circuits to three.",
        ] },
      ] },
      { heading: "Twice a week, and keep walking", blocks: [
        "Put two sessions in your diary on days that are usually quiet, such as Tuesday and Saturday mornings. Walking on other days adds up to the 150 minutes of moderate activity UK guidance suggests; see [walking and everyday activity](/guides/walking-to-keep-weight-off).",
        "Pair it with protein at each meal to give your muscles what they need. See [protein after a GLP-1](/guides/protein-after-glp-1). If you'd like sessions that adjust to you, Steadie can help with that.",
      ] },
    ],
    faqs: [
      { q: "Can you build strength at home without equipment?", a: "Yes. Moves like sit-to-stands, wall press-ups, step-ups and bridges use your body weight, and bags or a backpack add load when you need more." },
      { q: "How often should a beginner do strength training?", a: "UK guidance is muscle-strengthening activity on at least two days a week. Two home sessions of about 25 minutes is a good start." },
      { q: "Is it normal to ache after strength exercise?", a: "Feeling a little stiff for a day or two is normal, especially at first. Sharp pain, dizziness or chest pain are signs to stop and get advice." },
    ],
    sources: [S.cmoGuidelines, S.nhsActivity, nhsStrengthEx, nhsOlderAdults, S.lundgren, S.jointAdvisory],
    related: ["strength-training-after-glp-1", "muscle-loss-on-glp-1", "walking-to-keep-weight-off", "exercise-with-joint-pain"],
  },
  {
    slug: "strength-training-older-adults",
    title: "Strength and balance for older adults after weight loss",
    metaTitle: "Strength training for older adults after weight loss",
    description: "Why strength and balance matter in your 60s and 70s after weight loss, what UK guidance says, and gentle seated and standing exercises to start with.",
    category: "Movement",
    keywords: ["strength training for older adults", "exercise for over 60s uk", "balance exercises for older people", "chair exercises for seniors", "muscle loss after weight loss older adults"],
    published: "2026-11-13", updated: "2026-11-13",
    summary: [
      "We lose some muscle naturally with age, and some of the weight lost on GLP-1s is muscle too.",
      "UK guidance for people aged 65 and over is strength, balance and flexibility work on at least two days a week.",
      "Stronger legs and better balance lower the risk of falls and help you stay independent.",
      "You can start seated. Speak to your GP first if you haven't exercised for a while.",
    ],
    sections: [
      { heading: "Why this matters more in your 60s and 70s", blocks: [
        "Muscle naturally declines as we get older. When you lose weight, some of what goes is lean mass, which includes muscle. Put the two together and it's worth giving your muscles a bit of extra attention. See [muscle loss on a GLP-1](/guides/muscle-loss-on-glp-1).",
        "Strength and balance are what let you get up from a low chair, carry the shopping, manage the stairs and catch yourself if you trip. They're the foundations of staying independent.",
      ] },
      { heading: "What UK guidance says", blocks: [
        "The UK Chief Medical Officers' guidelines, summarised by the NHS, say adults aged 65 and over should aim to:",
        { list: [
          "Be physically active every day, even if it's just light activity.",
          "Do activities that improve strength, balance and flexibility on at least two days a week.",
          "Do at least 150 minutes of moderate activity a week, such as walking, water aerobics or riding a bike.",
          "Break up long periods of sitting with some movement.",
        ] },
        "The NHS also says that if you've fallen or are worried about falling, exercises for strength, balance and flexibility will help you feel stronger and more confident on your feet.",
      ] },
      { heading: "Start seated", blocks: [
        "If you haven't done much for a while, seated exercises are a gentle way in. Use a solid chair without wheels or arms, where you can sit with your feet flat on the floor.",
        { list: [
          "**Hip marching:** sit upright, hold the sides of the chair and lift one knee, then the other.",
          "**Leg straightening:** straighten one leg out in front, hold for a moment, lower slowly. Swap legs.",
          "**Ankle circles and heel raises:** lift your heels off the floor, then your toes.",
          "**Arm raises:** lift a tin of beans in each hand up to shoulder height and lower slowly.",
          "**Sit-to-stand:** when you feel ready, stand up from the chair and sit back down with control, using your hands if needed.",
        ] },
        "The NHS has free illustrated sitting, strength and balance routines, and suggests building up slowly and doing them at least twice a week.",
      ] },
      { heading: "Add balance", blocks: [
        "Do balance work near a kitchen worktop or a sturdy chair you can hold.",
        { list: [
          "**Sideways walking:** a few steps to one side, then back.",
          "**Heel-to-toe walk:** walk in a line, placing one heel just in front of the other toes.",
          "**Single-leg stand:** hold the worktop and lift one foot slightly off the floor. Try a few seconds each side, then build up.",
        ] },
        "Activities like tai chi, yoga and dancing count too, and many people enjoy doing them in a local class.",
        { note: SAFETY, tone: "butter" },
      ] },
      { heading: "Protein matters more with age", blocks: [
        "Muscle needs protein as well as exercise. Expert groups suggest older adults aim for about 1.0 to 1.2 g of protein per kg of body weight a day, and a palm-sized portion, about 25 to 30 g, at each meal is an easy way to get there. Eggs, yoghurt, milk, fish, chicken, beans and lentils all help. See [protein after a GLP-1](/guides/protein-after-glp-1).",
        { note: "If you have kidney disease or have been given protein advice by your healthcare team, follow their advice rather than these general amounts.", tone: "sky" },
      ] },
      { heading: "If you've had a fall", blocks: [
        "See your GP if you've had a fall or you're worried about your balance. They can check your balance and may refer you to a falls service, which can include strength and balance training, a home safety check and a review of your medicines. In some areas you can refer yourself.",
        "For a fuller plan, see [strength training after a GLP-1](/guides/strength-training-after-glp-1) and [walking and everyday activity](/guides/walking-to-keep-weight-off).",
      ] },
    ],
    faqs: [
      { q: "Is it safe to start strength training in my 70s?", a: "For most people, yes, and it's one of the best things you can do. Speak to your GP first if you haven't exercised for a while or have a health condition, and start gently." },
      { q: "How often should older adults do strength and balance exercises?", a: "UK guidance for people aged 65 and over is activities that improve strength, balance and flexibility on at least two days a week." },
      { q: "Can chair exercises build strength?", a: "Yes, especially if you're starting out. Seated moves and sit-to-stands strengthen your legs, and you can add standing and balance work as you get stronger." },
      { q: "Do I need more protein as I get older?", a: "Expert groups suggest about 1.0 to 1.2 g per kg of body weight a day for older adults. If you have kidney disease, follow your healthcare team's advice." },
    ],
    sources: [S.cmoGuidelines, nhsOlderAdults, nhsSitting, nhsBalance, nhsFalls, S.protAge, S.paddonJones, S.jointAdvisory],
    related: ["muscle-loss-on-glp-1", "strength-training-after-glp-1", "exercise-with-joint-pain", "protein-after-glp-1"],
  },
  {
    slug: "exercise-with-joint-pain",
    title: "Exercise with joint pain: moving with sore knees, hips or back",
    metaTitle: "Exercise with joint pain: knees, hips and back",
    description: "How to stay active with sore knees, hips or back after weight loss: low-impact options, simple pain rules, and when to see a GP or physio.",
    category: "Movement",
    keywords: ["exercise with joint pain", "exercise with bad knees", "low impact exercise for knee pain", "exercise with back pain uk", "exercise with hip pain"],
    published: "2026-12-04", updated: "2026-12-04",
    summary: [
      "Sore joints are common, and moving usually helps more than resting completely.",
      "Low-impact options like swimming, cycling and seated strength work are kinder to knees, hips and backs.",
      "Some mild aching can be expected. Sharp or worsening pain is a sign to stop and get advice.",
      "See a GP or physio if pain stops you doing everyday things or isn't getting better.",
    ],
    sections: [
      { heading: "Why moving usually helps", blocks: [
        "It can feel natural to rest a sore joint. But the NHS advises not to stop moving a painful joint completely, and for back pain to stay active and not stay in bed for long periods. For osteoarthritis, the NHS describes exercise as one of the most important treatments, whatever your age or fitness.",
        "Stronger muscles support your joints, and losing weight can take some strain off them too. That's one reason [strength exercise](/guides/strength-training-after-glp-1) is worth keeping up after a GLP-1.",
      ] },
      { heading: "Low-impact options", blocks: [
        { list: [
          "**Swimming and water exercise.** The water supports your weight. Water aerobics classes are a gentle start.",
          "**Cycling.** A bike or exercise bike moves your knees and hips without the jolt of each step.",
          "**Walking on flat ground.** Shorter, more frequent walks are often easier than one long one. See [walking and everyday activity](/guides/walking-to-keep-weight-off).",
          "**Seated strength.** Leg straightening, hip marching and arm raises from a chair build strength with little load on the joints.",
          "**Tai chi, yoga and pilates.** Slow, controlled movement for strength, balance and flexibility.",
        ] },
      ] },
      { heading: "Adapting strength work", blocks: [
        "Most strength moves have a gentler version:",
        { list: [
          "**Sore knees:** sit-to-stand from a higher chair, or only go part of the way down. Swap step-ups for seated leg straightening.",
          "**Sore hips:** keep movements smaller, and try glute bridges lying down instead of deep squats.",
          "**Sore back:** keep your back straight, lift from your legs, and start with wall press-ups and bridges.",
        ] },
        "Move slowly and with control, and stay within a range that feels comfortable. The [home routine](/guides/strength-training-at-home-no-equipment) shows easier versions of each move.",
      ] },
      { heading: "Simple pain rules", blocks: [
        { list: [
          "Some mild aching or stiffness during or after exercise is common, especially when you're starting out.",
          "Sharp pain, pain that keeps getting worse as you go, or swelling afterwards are signs to stop that move.",
          "If a joint is noticeably worse the next day, do less next time or try a gentler version.",
          "Build up slowly. Doing too much too soon is more likely to cause a flare than the exercise itself.",
          "Speak to a pharmacist or GP about which painkiller, if any, is right for you.",
        ] },
        { note: SAFETY, tone: "butter" },
      ] },
      { heading: "When to see a GP or physio", blocks: [
        "The NHS suggests seeing a GP if joint pain:",
        { list: [
          "Stops you doing normal activities or affects your sleep.",
          "Is getting worse or keeps coming back.",
          "Hasn't improved after two weeks of looking after it at home (for knee or back pain, after a few weeks).",
          "Comes with stiffness that lasts more than 30 minutes after you wake up.",
        ] },
        "In many areas you can refer yourself to NHS physiotherapy or musculoskeletal (MSK) services without seeing a GP first. A physio can give you an exercise plan that fits your joints.",
        { note: "Get urgent help from NHS 111 if a joint is hot and swollen, you feel unwell or have a high temperature, or you can't put weight on it. Call 999 or go to A&E for back pain with numbness or weakness in both legs, changes to your bladder or bowels, or chest pain.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "Should I exercise with knee pain?", a: "Usually, gentle movement helps. Low-impact options like cycling, swimming and seated strength work are kinder to knees. See a GP or physio if pain doesn't improve within a few weeks or stops you doing everyday things." },
      { q: "What's the best exercise for bad joints?", a: "There's no single best one. Swimming, water aerobics, cycling and gentle strength work are good places to start. Pick something you enjoy and can do regularly." },
      { q: "Can I see a physio without a GP referral?", a: "In many areas, yes. NHS musculoskeletal (MSK) services often accept self-referrals for back and joint problems." },
    ],
    sources: [nhsJointPain, nhsKneePain, nhsBackPain, nhsOsteoarthritis, nhsOlderAdults, nhsSitting, S.cmoGuidelines],
    related: ["strength-training-at-home-no-equipment", "strength-training-older-adults", "walking-to-keep-weight-off", "strength-training-after-glp-1"],
  },
  {
    slug: "portion-sizes-without-counting",
    title: "Portion sizes without counting: the hand and plate method",
    metaTitle: "Portion sizes without counting calories: a hand guide",
    description: "A simple way to judge portions using your hand and your plate, built on the UK Eatwell Guide, so meals stay balanced without counting calories.",
    category: "Food",
    keywords: ["portion sizes without counting calories", "hand portion guide", "portion control uk", "eatwell guide portions", "how much should i eat after wegovy"],
    published: "2026-11-17", updated: "2026-11-17",
    summary: [
      "Your hand is a handy, always-with-you guide to portions.",
      "A rough plate: a palm of protein, a fist of starchy carbs, two handfuls of veg and a thumb of fats.",
      "It follows the balance in the UK Eatwell Guide, without counting calories.",
      "It's a starting point. Adjust to your hunger, your activity and your healthcare team's advice.",
    ],
    sections: [
      { heading: "Why portions feel confusing after a GLP-1", blocks: [
        "On a GLP-1, many people eat much smaller meals without trying. As the medicine leaves your body and [appetite comes back](/guides/appetite-after-stopping-glp-1), it can be hard to know what a normal portion looks like.",
        "Counting every calorie works for some people, but many find it tiring and hard to keep up. A simpler guide you can use at any meal, at home or out, is often easier to live with.",
      ] },
      { heading: "The hand method", blocks: [
        "Your hand grows with you, so bigger people get bigger portions and smaller people smaller ones. The British Nutrition Foundation uses hand measures as a practical way to estimate portions. A rough guide for a main meal:",
        { list: [
          "**A palm of protein:** chicken, fish, tofu, eggs, lean mince, or a couple of big spoons of beans or lentils. That's about 25 to 30 g of protein for many foods.",
          "**A fist of starchy carbs:** rice, pasta, potatoes, bread or other grains, choosing wholegrain or skin-on where you can.",
          "**Two handfuls of vegetables:** cooked or raw, fresh, frozen or tinned. More is fine.",
          "**A thumb of fats:** olive or rapeseed oil, butter, cheese, nuts or seeds.",
        ] },
        "These are rough. If you're very active or hungry, add a little more starch or protein. If you're less active, keep the veg generous and the extras small.",
      ] },
      { heading: "How it fits the Eatwell Guide", blocks: [
        "The Eatwell Guide is the UK's picture of a balanced diet. It suggests fruit and vegetables make up just over a third of what we eat, starchy foods just over a third, with some protein foods, some dairy or alternatives, and small amounts of unsaturated oils.",
        "You don't need to hit that balance at every meal, the NHS says: try to get it right over a day or even a week. The hand method is just an easy way to nudge each plate in that direction.",
      ] },
      { heading: "What it looks like on a plate", blocks: [
        { list: [
          "**Breakfast:** two eggs on a slice of wholemeal toast with grilled tomatoes and mushrooms.",
          "**Lunch:** a jacket potato about the size of your fist with tuna and sweetcorn, and a big side salad.",
          "**Dinner:** a salmon fillet, a fist of new potatoes, and two handfuls of broccoli and green beans.",
          "**Vegetarian:** a chickpea and spinach curry with a fist of brown rice and a spoon of yoghurt.",
        ] },
        "For more ideas, see [high-protein breakfasts](/guides/high-protein-breakfasts-uk) and [protein after a GLP-1](/guides/protein-after-glp-1).",
      ] },
      { heading: "Let hunger have a say", blocks: [
        "Portions are a guide, not a rule. Eat slowly, and check in halfway: are you still hungry, or just finishing because it's there? It's fine to stop, and fine to have more veg or protein if you're still hungry. See [eating slowly and fullness](/guides/eating-slowly-and-fullness).",
        "Eating out? The same hand guide works with restaurant plates. See [eating out after a GLP-1](/guides/eating-out-after-glp-1).",
        { note: "If you notice worrying thoughts about food, portions or your body, Beat, the UK's eating disorder charity, has a helpline. If you have diabetes or another condition, your healthcare team's advice comes first.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "How can I control portions without counting calories?", a: "Use your hand as a guide: a palm of protein, a fist of starchy carbs, two handfuls of veg and a thumb of fats at a main meal, then adjust to your hunger." },
      { q: "What is a portion of protein?", a: "Roughly the size and thickness of your palm, which is about 25 to 30 g of protein for foods like chicken, fish or tofu." },
      { q: "Do I need to follow the Eatwell Guide at every meal?", a: "No. The NHS says to aim for the balance over a day or even a week, not at every single meal." },
    ],
    sources: [nhsEatwellPage, S.eatwell, bnfPortions, S.bdaResource, S.paddonJones, S.beat],
    related: ["protein-after-glp-1", "keep-weight-off-after-glp-1", "appetite-after-stopping-glp-1", "eating-slowly-and-fullness"],
  },
  {
    slug: "fibre-after-glp-1",
    title: "Fibre after a GLP-1: why it helps and easy ways to get more",
    metaTitle: "Fibre after Wegovy or Mounjaro: why it helps",
    description: "How fibre helps fullness and digestion after weight-loss injections, the UK 30 g a day guideline, easy food swaps, and why to build up slowly with fluids.",
    category: "Food",
    keywords: ["fibre after glp-1", "high fibre foods uk", "how much fibre a day uk", "constipation on wegovy", "fibre to feel full"],
    published: "2026-11-24", updated: "2026-11-24",
    summary: [
      "UK guidance is 30 g of fibre a day for adults, but most of us get about 20 g.",
      "Fibre adds bulk and fullness, and helps keep your digestion regular.",
      "Small swaps add up: wholegrain bread, oats, beans, lentils, fruit and veg.",
      "Build up slowly and drink plenty, or you may feel bloated.",
    ],
    sections: [
      { heading: "Why fibre matters now", blocks: [
        "As a GLP-1 leaves your body, [appetite tends to come back](/guides/appetite-after-stopping-glp-1). Fibre-rich foods like beans, lentils, oats, vegetables and wholegrains add bulk to meals, which helps you feel full.",
        "Fibre also helps digestion and helps prevent constipation, which many people notice while taking these medicines. And the NHS links eating plenty of fibre with a lower risk of heart disease, stroke, type 2 diabetes and bowel cancer.",
      ] },
      { heading: "How much do you need?", blocks: [
        "UK government guidelines say adults should aim for 30 g of fibre a day. Most adults get about 20 g, so most of us have room to add more.",
        "You don't need to count. The NHS gives examples of what a day can look like:",
        { list: [
          "**Breakfast:** two slices of wholemeal toast with peanut butter and an orange, around 8 g.",
          "**Lunch:** wholemeal spaghetti with a lentil and tomato sauce, around 11 g.",
          "**Dinner:** grilled chicken, a skin-on baked potato, carrots and green beans, around 11 g.",
        ] },
        "On food labels, a food counts as high in fibre if it has 6 g or more per 100 g.",
      ] },
      { heading: "Easy swaps", blocks: [
        { list: [
          "White bread to wholemeal or granary, or a higher-fibre white loaf.",
          "Sugary cereal to porridge oats, plain wholewheat biscuits or plain shredded wholegrain.",
          "White pasta and rice to wholewheat pasta, brown rice or bulgur wheat.",
          "Peeled potatoes to jacket or new potatoes with the skins on.",
          "A tin of beans, lentils or chickpeas stirred into stews, curries, soups and salads.",
          "Crisps or biscuits to fruit, veg sticks with hummus, oatcakes or a small handful of unsalted nuts.",
        ] },
        "Many of these also bring protein: beans, lentils, chickpeas and edamame do both jobs. See [protein after a GLP-1](/guides/protein-after-glp-1).",
      ] },
      { heading: "Build up slowly, and drink plenty", blocks: [
        "If you add a lot of fibre at once, you may feel bloated or windy. Add one swap at a time over a few weeks so your gut can adjust.",
        "Fluids matter too. The NHS explains that fibre acts like a sponge, absorbing water, and without enough fluid it can't do its job. A glass of water with each meal is an easy habit. The Eatwell Guide suggests 6 to 8 cups or glasses of fluid a day as a guide.",
        "Get fibre from a mix of foods rather than one source. If cereals and grains make you bloated, the NHS suggests getting more of your fibre from fruit and vegetables instead.",
      ] },
      { heading: "When to get advice", blocks: [
        { note: "See your GP or pharmacist if constipation, bloating or tummy pain doesn't settle, or you notice blood in your poo, a lasting change in your bowel habits, or weight loss you can't explain. If you have a bowel condition such as IBS or Crohn's, follow your healthcare team's advice about fibre.", tone: "butter" },
        "Fibre sits alongside the other basics: protein at each meal, regular meals and plenty of movement. See [how to keep weight off after a GLP-1](/guides/keep-weight-off-after-glp-1) for the bigger picture.",
      ] },
    ],
    faqs: [
      { q: "How much fibre should I eat a day in the UK?", a: "UK guidelines say adults should aim for 30 g a day. Most adults get about 20 g." },
      { q: "Does fibre help you feel full?", a: "Fibre-rich foods like beans, lentils, oats, wholegrains, fruit and vegetables add bulk to meals, which helps fullness." },
      { q: "Why do I feel bloated when I eat more fibre?", a: "Adding a lot at once can cause bloating and wind. Build up slowly over a few weeks and drink plenty of fluids." },
      { q: "Can fibre help with constipation on Wegovy or Mounjaro?", a: "Fibre and fluids help keep digestion regular. If constipation doesn't settle, speak to your pharmacist or GP." },
    ],
    sources: [S.nhsFibre, nhsDigestion, nhsConstipation, nhsEatwellPage, S.bdaResource, S.nhsSemaglutide, S.nhsTirzepatide],
    related: ["protein-after-glp-1", "appetite-after-stopping-glp-1", "portion-sizes-without-counting", "keep-weight-off-after-glp-1"],
  },
];
