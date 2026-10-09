import { S } from "./sources";
import type { Guide, Source } from "./types";

// Scheduled food guides, batch 1. Each guide goes live on its own date.
// Extra sources below were checked on 9 October 2026 and returned HTTP 200.

const fsaChilling: Source = { label: "Food Standards Agency: how to chill, freeze and defrost food safely", url: "https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely" };
const fsaCooking: Source = { label: "Food Standards Agency: cooking your food, including using your leftovers", url: "https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food" };
const nhsHealthyEating: Source = { label: "NHS: 8 tips for healthy eating", url: "https://www.nhs.uk/live-well/eat-well/how-to-eat-a-balanced-diet/eight-tips-for-healthy-eating/" };
const nhsFish: Source = { label: "NHS: fish and shellfish", url: "https://www.nhs.uk/live-well/eat-well/food-types/fish-and-shellfish-nutrition/" };
const nhsMeat: Source = { label: "NHS: meat in your diet", url: "https://www.nhs.uk/live-well/eat-well/food-types/meat-nutrition/" };
const nhsDairy: Source = { label: "NHS: dairy and alternatives in your diet", url: "https://www.nhs.uk/live-well/eat-well/food-types/milk-and-dairy-nutrition/" };
const nhsChildWeight: Source = { label: "NHS: advice for parents of healthy-weight children", url: "https://www.nhs.uk/live-well/healthy-weight/childrens-weight/healthy-weight-children-advice-for-parents/" };

export const SCHEDULED_1: Guide[] = [
  {
    slug: "high-protein-lunches-uk",
    title: "High-protein lunches: easy ideas for work and home",
    metaTitle: "High-protein lunch ideas (UK): work and home",
    description: "Easy high-protein lunches for work and home using UK supermarket foods, plus simple meal-deal swaps to keep you fuller through the afternoon.",
    category: "Food",
    keywords: ["high protein lunch ideas uk", "high protein lunch for work", "high protein meal deal", "packed lunch high protein", "lunch after stopping wegovy"],
    published: "2026-10-20", updated: "2026-10-20",
    summary: [
      "Lunch sets up your afternoon. A lunch light on protein can mean a hungry 4pm.",
      "Aim for a palm-sized portion of protein, about 25 to 30 g, plus veg or salad and some fibre.",
      "Leftovers, tins and ready-cooked protein make it quick, at home or at work.",
      "A supermarket meal deal can work well with a few simple swaps.",
    ],
    sections: [
      { heading: "Why lunch matters after a GLP-1", blocks: [
        "As a GLP-1 medicine leaves your body, hunger usually comes back over a few weeks. Many people find the mid-afternoon is when they notice it most. A lunch built around protein and fibre helps you feel fuller for longer, so the afternoon feels calmer. There's more on this in [appetite after stopping](/guides/appetite-after-stopping-glp-1).",
        "The same simple target from breakfast applies: a palm-sized portion of protein, about 25 to 30 g, at each meal. You don't need to count. Once you've done it a few times, you'll know what it looks like. See [protein after a GLP-1](/guides/protein-after-glp-1).",
      ] },
      { heading: "A simple lunch formula", blocks: [
        { list: [
          "**Protein first:** chicken, fish, eggs, beans, lentils, tofu, cottage cheese or yoghurt.",
          "**Veg or salad:** a big handful. Frozen, tinned or bagged all count.",
          "**Some fibre-rich carbs:** wholemeal bread, a jacket potato with the skin on, brown rice, oats or beans.",
          "**Something you enjoy:** a dressing you like, a bit of cheese, pickles or hot sauce.",
        ] },
        "Lunch you look forward to is lunch you'll keep eating.",
      ] },
      { heading: "Ten high-protein lunches", blocks: [
        "Protein amounts are rough and depend on the products and portions you use.",
        { list: [
          "**Tuna and bean salad:** a tin of tuna (about 25 g of protein) with mixed beans, sweetcorn, peppers and a squeeze of lemon.",
          "**Chicken wrap:** ready-cooked chicken pieces, salad and a spoon of hummus in a wholemeal wrap.",
          "**Eggs and pitta:** two or three boiled eggs (about 6 to 7 g each) with a wholemeal pitta, cherry tomatoes and cucumber. Add a yoghurt to top it up.",
          "**Jacket potato:** filled with cottage cheese, tuna or baked beans and a little grated cheese. A microwave makes it a five-minute lunch.",
          "**Last night's dinner:** a portion of chilli, curry or stew, made with extra on purpose. See [easy high-protein dinners](/guides/easy-high-protein-dinners-uk).",
          "**Soup plus protein:** many soups are light on protein, so pair a lentil or bean soup with cheese on toast, an egg or a Greek-style yoghurt.",
          "**Salmon rice bowl:** a pouch of microwave rice, tinned or hot-smoked salmon, edamame, cucumber and a dash of soy sauce.",
          "**Ploughman's plate:** a boiled egg, a slice of ham or cheese, oatcakes, an apple, pickle and salad.",
          "**Greek yoghurt and fruit:** 150 g of Greek-style yoghurt (about 15 g) with fruit and seeds, alongside a cheese and salad sandwich.",
          "**Tofu or Quorn stir-fry:** leftover from dinner, eaten hot or cold.",
        ], ordered: true },
      ] },
      { heading: "Meal-deal swaps", blocks: [
        "Supermarket and high-street meal deals are part of working life for lots of people. They can be a perfectly good lunch with a few tweaks:",
        { list: [
          "**Main:** pick a sandwich, wrap or salad with a clear protein in it, such as chicken, egg, tuna, salmon or beans. Many packs list the protein on the front, which makes comparing quick.",
          "**Snack:** swap crisps or a chocolate bar for a yoghurt or protein pot, boiled eggs, an edamame pot, a cheese snack or fruit.",
          "**Drink:** water, a sugar-free drink or a milk drink. A milk drink adds a little protein too.",
        ] },
        "If the meal deal is a treat you enjoy, keep it. One lunch doesn't decide anything. It's the pattern across the week that counts.",
      ] },
      { heading: "Lunches for work", blocks: [
        "A few minutes of preparation the night before makes the next day easier. Cook a bit extra at dinner, box up a portion and put it straight in the fridge once it's cooled. Keep a few store-cupboard backups at work, such as a tin of tuna, a pouch of rice or a pot of oats.",
        "Keep packed lunches cold until you eat them: use the work fridge, or an insulated bag with an ice pack. If you're reheating, make sure the food is steaming hot all the way through. There's more on this in [meal prep after a GLP-1](/guides/meal-prep-after-glp-1).",
        { note: "If you have kidney disease, are pregnant, or have been given food advice by your healthcare team, follow their advice rather than these general ideas.", tone: "butter" },
      ] },
    ],
    faqs: [
      { q: "What's a quick high-protein lunch for work?", a: "A tuna and bean salad, a chicken wrap or last night's leftovers are all quick. A tin of tuna alone gives about 25 g of protein." },
      { q: "Can a meal deal be high in protein?", a: "Yes. Choose a sandwich or salad with chicken, egg, fish or beans, swap crisps for a yoghurt, eggs or edamame, and check the label on the front of the pack." },
      { q: "How much protein should lunch have?", a: "A simple target is a palm-sized portion, about 25 to 30 g. If you have a health condition, follow your healthcare team's advice." },
      { q: "Are soups filling enough for lunch?", a: "Many soups are lower in protein. Pairing one with eggs, cheese, yoghurt or beans makes it more filling." },
    ],
    sources: [S.paddonJones, S.jointAdvisory, S.bdaResource, S.eatwell, S.nhsFibre, nhsHealthyEating, fsaCooking],
    related: ["protein-after-glp-1", "high-protein-breakfasts-uk", "high-protein-snacks-uk", "meal-prep-after-glp-1"],
  },
  {
    slug: "budget-high-protein-foods-uk",
    title: "Cheap high-protein foods: a UK supermarket guide",
    metaTitle: "Cheap high-protein foods UK: a budget guide",
    description: "The cheaper high-protein foods in UK supermarkets, from eggs and tinned fish to lentils and frozen chicken, and easy ways to make them go further.",
    category: "Food",
    keywords: ["cheap high protein foods uk", "budget high protein meals", "high protein on a budget uk", "cheap protein sources", "high protein shopping list uk"],
    published: "2026-10-30", updated: "2026-10-30",
    summary: [
      "Getting enough protein doesn't need expensive shakes or bars.",
      "Eggs, tins, beans, lentils, frozen chicken and fish, big tubs of yoghurt and milk are among the cheaper sources.",
      "Mixing beans or lentils into meat dishes, buying frozen and batch cooking all stretch your money.",
      "Prices change often, so compare the price per kilo on shelf labels.",
    ],
    sections: [
      { heading: "Protein on a budget is very doable", blocks: [
        "Protein helps you feel full and helps protect muscle, which matters in the year after a GLP-1. See [protein after a GLP-1](/guides/protein-after-glp-1). The good news is that some of the most useful protein foods are also among the cheapest in the supermarket.",
        "If you've stopped your injections because of the cost, or money is tighter for any reason, this list is a good place to start. There's more help in [stopping weight-loss jabs because of the cost](/guides/stopping-weight-loss-jabs-because-of-cost).",
      ] },
      { heading: "The cheaper protein list", blocks: [
        { list: [
          "**Eggs:** about 6 to 7 g of protein each, quick to cook and useful at any meal.",
          "**Tinned fish:** tuna (about 25 g a tin), sardines, mackerel and pilchards. Sardines, mackerel and pilchards are oily fish; tinned tuna doesn't count as oily. Tinned fish can be high in salt, so check the label.",
          "**Beans, lentils and chickpeas:** tinned is convenient, dried is cheaper still. They add fibre too.",
          "**Frozen chicken, fish and prawns:** often cheaper than fresh, and nothing goes off before you use it.",
          "**Chicken thighs:** usually cheaper than breast, and harder to dry out.",
          "**Big tubs of Greek-style or natural yoghurt:** usually cheaper than single pots. 150 g of Greek-style yoghurt has about 15 g of protein.",
          "**Cottage cheese:** good on toast, in a jacket potato or with fruit.",
          "**Milk:** a cheap way to add protein to porridge, overnight oats and drinks.",
          "**Tofu:** often good value, and it soaks up whatever flavours you cook it with.",
          "**Mince:** pork, beef or turkey mince goes a long way, especially mixed with lentils or beans.",
        ] },
      ] },
      { heading: "Ways to make it go further", blocks: [
        { list: [
          "**Half and half:** swap half the mince in a bolognese, chilli or cottage pie for lentils or beans. It's cheaper and adds fibre.",
          "**Check the price per kilo:** shelf labels show it, and it's the fairest way to compare packs of different sizes.",
          "**Try own-brand ranges:** basic and own-brand tins, frozen veg, eggs and yoghurt are often much cheaper.",
          "**Use the freezer:** portion out big packs of chicken or mince and freeze them. Reduced items can be frozen up to the use-by date.",
          "**Cook once, eat twice:** a big pot of chilli or curry makes lunches for the next couple of days.",
          "**Bulk with veg:** frozen and tinned veg are cheap and count towards your 5 A Day.",
        ] },
        { note: "NHS advice is that if you eat more than 90 g of red and processed meat a day, it's worth cutting down to 70 g or less. Beans, lentils, eggs, fish and chicken are good swaps.", tone: "sage" },
      ] },
      { heading: "A low-cost week, roughly", blocks: [
        "Here's how these foods might fit together. Swap in whatever you like and whatever is cheapest that week.",
        { list: [
          "**Breakfasts:** porridge made with milk and a spoon of yoghurt, or eggs on toast. More in [high-protein breakfasts](/guides/high-protein-breakfasts-uk).",
          "**Lunches:** tuna and bean salad, leftover chilli, or cottage cheese on a jacket potato.",
          "**Dinners:** a half-lentil chilli, a chicken thigh traybake, a tofu stir-fry, an omelette with frozen veg, a fish pie made with frozen fish.",
          "**Snacks:** a boiled egg, yoghurt with fruit, or a glass of milk.",
        ] },
        "For more dinner ideas, see [easy high-protein dinners](/guides/easy-high-protein-dinners-uk), and for making a week's cooking easier, [meal prep after a GLP-1](/guides/meal-prep-after-glp-1).",
      ] },
      { heading: "Do you need protein powder?", blocks: [
        "No. Everyday foods are enough for most people, and they bring other things a powder doesn't, such as fibre from beans and lentils, calcium from dairy and omega-3 fats from oily fish. A protein powder or drink can be handy if you're busy, but it tends to cost more for the protein you get than eggs, milk, beans or tins.",
        { note: "If you have kidney disease, are pregnant, or have been given protein advice by your healthcare team, follow their advice rather than these general amounts.", tone: "butter" },
      ] },
    ],
    faqs: [
      { q: "What is the cheapest high-protein food in the UK?", a: "Prices change, but eggs, dried or tinned lentils and beans, tinned fish, milk and frozen chicken are usually among the cheaper sources. Compare the price per kilo on shelf labels." },
      { q: "Are tinned beans a good source of protein?", a: "Yes, and they're high in fibre too. They work well on their own or mixed into meat dishes to make them go further." },
      { q: "Is frozen chicken as good as fresh?", a: "It's a useful option and often cheaper. Defrost it in the fridge and cook it until it's steaming hot all the way through." },
      { q: "Do I need protein shakes to get enough protein?", a: "No. Eggs, milk, yoghurt, fish, chicken, beans and lentils are enough for most people, and usually cheaper." },
    ],
    sources: [S.eatwell, S.nhsFibre, S.bdaResource, nhsFish, nhsMeat, nhsDairy, fsaChilling],
    related: ["protein-after-glp-1", "easy-high-protein-dinners-uk", "meal-prep-after-glp-1", "stopping-weight-loss-jabs-because-of-cost"],
  },
  {
    slug: "high-protein-snacks-uk",
    title: "High-protein snacks for hungry afternoons",
    metaTitle: "High-protein snacks UK: ideas for hungry afternoons",
    description: "Filling high-protein snacks using UK supermarket foods, for when appetite returns after a GLP-1, plus portable ideas for work and days out.",
    category: "Food",
    keywords: ["high protein snacks uk", "healthy snacks to keep you full", "high protein snacks on the go", "snacks after stopping mounjaro", "afternoon hunger"],
    published: "2026-11-10", updated: "2026-11-10",
    summary: [
      "As appetite returns after a GLP-1, many people find the afternoon is their hungriest time.",
      "A planned snack with some protein can bridge a long gap and take the edge off before dinner.",
      "Yoghurt, eggs, cottage cheese, edamame, milk and a small handful of nuts are easy options.",
      "Snacks are optional. If regular meals keep you comfortable, you don't need them.",
    ],
    sections: [
      { heading: "When a snack helps", blocks: [
        "While you were on a GLP-1, you may barely have thought about snacks. As the medicine wears off, hunger usually returns over a few weeks, and a long gap between lunch and dinner can start to feel very long. See [appetite after stopping](/guides/appetite-after-stopping-glp-1).",
        "A planned snack at your hungriest time stops you arriving at dinner ravenous. The key word is planned: deciding in advance what and when makes it much easier than choosing on the spot when you're already very hungry.",
      ] },
      { heading: "What makes a snack filling", blocks: [
        "Protein and fibre are the two things that help most. A snack with some protein in it, perhaps with fruit, veg or wholegrains alongside, tends to keep you going for longer than one that's mostly sugar. Sugary snacks between meals are also harder on your teeth.",
        "Rough protein amounts are given below where they're well known. They depend on the products and portions you buy.",
      ] },
      { heading: "Fridge snacks for home", blocks: [
        { list: [
          "**Greek-style yoghurt or skyr:** 150 g has about 15 g of protein. Add berries or a few seeds.",
          "**Boiled eggs:** about 6 to 7 g each. Boil a batch and keep them in the fridge.",
          "**Cottage cheese:** on oatcakes or rye crackers with cucumber and black pepper.",
          "**Cheese and an apple:** a small piece of cheese with fruit is an old favourite for good reason.",
          "**Hummus and veg sticks:** carrots, peppers and sugar snap peas.",
          "**Leftover chicken or tofu:** a few pieces from last night's dinner.",
          "**A glass of milk or a milky coffee:** a quick way to add a little protein.",
        ] },
      ] },
      { heading: "Portable snacks for work and days out", blocks: [
        { list: [
          "**Edamame pots:** from the chiller or frozen and defrosted.",
          "**Roasted chickpeas:** shop-bought or homemade.",
          "**A small handful of unsalted nuts:** filling, but easy to eat a lot of, so portion them out.",
          "**Protein yoghurt pots or milk drinks:** handy from a supermarket or station shop.",
          "**Tinned fish snack pots:** tuna or salmon with a few crackers.",
          "**Protein bars:** fine sometimes, but check the label, as some are high in sugar.",
          "**Fruit plus something with protein:** a banana and a cheese snack, or an apple and a yoghurt.",
        ] },
        "Keeping one or two of these in your bag or desk drawer means you're not relying on the vending machine. More ideas for the main meal in [high-protein lunches](/guides/high-protein-lunches-uk).",
      ] },
      { heading: "Make a snack feel like a snack", blocks: [
        "A snack eaten standing at the fridge or straight from the packet is easy to lose track of, and it rarely feels satisfying. Put it on a plate or in a bowl, sit down and give it your attention for a few minutes. It sounds small, but many people find it helps them feel they've actually eaten.",
        "Evenings are a common time for snacking that isn't really about hunger. If you notice you're often hungry after dinner, it may be worth adding more protein or veg to the meal itself, or moving your snack to later in the evening rather than adding a second one. See [eating slowly and fullness](/guides/eating-slowly-and-fullness).",
      ] },
      { heading: "Hungry, or something else?", blocks: [
        "Not every urge to snack is hunger. Tiredness, stress, boredom and habit can all feel similar. Before you eat, try rating your hunger from 1 (very hungry) to 5 (comfortably full), and have a glass of water first. If you're still hungry, eat your snack and enjoy it.",
        "If it's not hunger, that's human too. Noticing gives you a moment to choose. There's more in [cravings after stopping](/guides/cravings-after-stopping-glp-1) and [emotional eating after a GLP-1](/guides/emotional-eating-after-glp-1).",
        { note: "If you have type 2 diabetes or take medicine that can cause low blood sugar, ask your diabetes team how snacks fit into your plan. If eating feels out of control, Beat, the UK's eating disorder charity, has a helpline.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "What's a good high-protein snack?", a: "Greek-style yoghurt or skyr, boiled eggs, cottage cheese on oatcakes, edamame or a glass of milk are all quick and filling." },
      { q: "Should I snack after stopping Wegovy or Mounjaro?", a: "Only if it helps. Many people find a planned snack at their hungriest time, often mid-afternoon, makes the evening easier. If regular meals keep you comfortable, you don't need one." },
      { q: "Are protein bars healthy?", a: "Some are, some are high in sugar. Check the label, and treat them as an occasional convenience rather than a staple." },
    ],
    sources: [S.bdaResource, S.jointAdvisory, S.nhsFibre, S.beat, nhsHealthyEating, nhsDairy],
    related: ["appetite-after-stopping-glp-1", "high-protein-lunches-uk", "cravings-after-stopping-glp-1", "protein-after-glp-1"],
  },
  {
    slug: "easy-high-protein-dinners-uk",
    title: "Easy high-protein dinners for busy weeknights",
    metaTitle: "Easy high-protein dinners (UK): 15 to 30 minutes",
    description: "Quick high-protein dinners for weeknights, most ready in 15 to 30 minutes, built around a protein-first plate and easy to batch cook.",
    category: "Food",
    keywords: ["easy high protein dinners uk", "quick high protein meals", "high protein dinner ideas", "high protein family dinners", "batch cook high protein"],
    published: "2026-12-01", updated: "2026-12-01",
    summary: [
      "Build dinner around a palm-sized portion of protein, plenty of veg and some fibre-rich carbs.",
      "Most of these dinners take 15 to 30 minutes and use everyday UK supermarket foods.",
      "Cooking double gives you lunch tomorrow or a meal for the freezer.",
      "A few freezer and cupboard staples mean dinner is possible even on a tired night.",
    ],
    sections: [
      { heading: "The protein-first plate", blocks: [
        "A simple way to build dinner without counting: start with a palm-sized portion of protein (about 25 to 30 g), fill around half the plate with vegetables or salad, then add some fibre-rich carbs such as potatoes with their skins on, brown rice or wholewheat pasta.",
        "Eating the protein first helps with fullness, and so does taking your time. See [eating slowly and fullness](/guides/eating-slowly-and-fullness) and [portion sizes without counting](/guides/portion-sizes-without-counting).",
      ] },
      { heading: "Dinners in about 15 minutes", blocks: [
        { list: [
          "**Prawn stir-fry:** frozen prawns, a bag of stir-fry veg and straight-to-wok noodles, with soy, garlic and ginger.",
          "**Big omelette or frittata:** three eggs with frozen peppers, spinach and a little cheese, with a side salad.",
          "**Egg-fried rice:** microwave rice, frozen peas, two eggs and leftover chicken or prawns.",
          "**Chickpea and spinach curry:** tinned chickpeas, a tin of tomatoes, curry paste and spinach, with a spoon of yoghurt on top.",
          "**Tuna pasta:** wholewheat pasta, a tin of tuna, sweetcorn, cherry tomatoes and a spoon of soft cheese.",
          "**Fajitas:** chicken strips or tofu, peppers and onions, in wraps with salsa and yoghurt instead of sour cream.",
        ] },
      ] },
      { heading: "Dinners in about 30 minutes, good for batch cooking", blocks: [
        { list: [
          "**Chilli:** mince or Quorn with kidney beans and lentils. Freezes well.",
          "**Chicken thigh traybake:** thighs, chunky veg and new potatoes on one tray in the oven.",
          "**Salmon or white fish traybake:** fillets on a bed of veg, with a squeeze of lemon. Fish is good to have twice a week, and NHS advice is to include one portion of oily fish, such as salmon.",
          "**Lentil and chicken dal:** red lentils, spices and tomatoes, with chicken or paneer stirred through.",
          "**Turkey meatballs:** in a tomato and veg sauce, with pasta or rice.",
          "**Cottage pie with lentils:** half mince, half lentils, topped with mash made with the skins on.",
        ] },
        "Make double, then cool the extra, refrigerate it within a couple of hours and eat it within two days, or freeze it. Reheat once only, until it's steaming hot all the way through.",
      ] },
      { heading: "Easy ways to add protein to dinners you already make", blocks: [
        "You don't have to change your favourite meals. Small additions often do the job:",
        { list: [
          "Stir a tin of lentils or beans into a bolognese, soup or stew.",
          "Top a bowl of pasta, rice or noodles with a fried or boiled egg.",
          "Use Greek-style yoghurt in place of cream or sour cream.",
          "Add a handful of frozen prawns or edamame to a stir-fry.",
          "Swap some of the cheese on a jacket potato for cottage cheese or tuna.",
        ] },
      ] },
      { heading: "Staples for tired nights", blocks: [
        "Some nights, cooking is the last thing you want. A few staples make a decent dinner possible in minutes:",
        { list: [
          "**Freezer:** prawns, fish fillets, chicken pieces, mixed veg, spinach and portions of last week's chilli.",
          "**Cupboard:** tinned fish, beans, chickpeas and lentils, tinned tomatoes, microwave rice and wholewheat pasta.",
          "**Fridge:** eggs, Greek-style yoghurt, cheese and a bag of salad.",
        ] },
        "Beans on toast with an egg, or a tin of soup with cheese on toast, is still a perfectly good dinner. So is a takeaway now and then. See [eating out and takeaways](/guides/eating-out-after-glp-1).",
      ] },
      { heading: "Make it work for your week", blocks: [
        "Pick three or four dinners you like and rotate them. Write them on a list and shop for them every week, so the decision is made before you're hungry. If you cook for others, the same meals work for everyone. See [family meals after a GLP-1](/guides/family-meals-after-glp-1).",
        { note: "If you have kidney disease, are pregnant, or have been given food advice by your healthcare team, follow their advice rather than these general ideas.", tone: "butter" },
      ] },
    ],
    faqs: [
      { q: "What's a quick high-protein dinner?", a: "A prawn stir-fry, an omelette with frozen veg, egg-fried rice with prawns or a chickpea curry can all be ready in about 15 minutes." },
      { q: "What high-protein dinners can I batch cook?", a: "Chilli, dal, cottage pie with lentils, meatballs in tomato sauce and curries all freeze well. Cool them, refrigerate within a couple of hours, and reheat until steaming hot." },
      { q: "How much protein should dinner have?", a: "A palm-sized portion, about 25 to 30 g, is a simple target. If you have a health condition, follow your healthcare team's advice." },
      { q: "How long do leftovers keep?", a: "The Food Standards Agency says to eat leftovers within 48 hours, or freeze them if you won't eat them in time, and to reheat them only once." },
    ],
    sources: [S.paddonJones, S.bdaResource, S.eatwell, nhsHealthyEating, nhsFish, nhsMeat, fsaCooking],
    related: ["protein-after-glp-1", "budget-high-protein-foods-uk", "meal-prep-after-glp-1", "high-protein-lunches-uk"],
  },
  {
    slug: "meal-prep-after-glp-1",
    title: "Meal prep after a GLP-1: a simple weekly plan",
    metaTitle: "Meal prep after Wegovy or Mounjaro: a simple plan",
    description: "Simple weekly meal prep to make protein-first meals easy as appetite returns after a GLP-1, with UK food safety basics for storing and reheating.",
    category: "Food",
    keywords: ["meal prep after glp-1", "meal prep for weight maintenance", "easy meal prep uk", "high protein meal prep", "how long do leftovers last"],
    published: "2026-12-18", updated: "2026-12-18",
    summary: [
      "As hunger returns, decisions made when you're already hungry are the hardest. Prep makes them for you.",
      "You don't need 21 matching boxes. Preparing a few building blocks once a week is enough.",
      "Cool food and get it into the fridge within one to two hours, eat leftovers within two days, and reheat until steaming hot.",
      "Keep it flexible: prep is there to help, not to become another rule.",
    ],
    sections: [
      { heading: "Why prep helps after a GLP-1", blocks: [
        "On a GLP-1, many people barely think about food. As the medicine leaves your body over the following weeks, appetite and food noise usually come back. See [appetite after stopping](/guides/appetite-after-stopping-glp-1).",
        "The hardest moments are often when you're hungry, tired and nothing is ready. Having a few things already cooked in the fridge means a protein-first meal is the easy option, not the effortful one. It also fits well with [building habits before you stop](/guides/building-habits-before-you-stop).",
      ] },
      { heading: "Start small", blocks: [
        "You don't have to prep every meal. Pick one or two meals that tend to go wrong, often lunch or the evening after a long day, and prep for those first. Three building blocks are plenty to begin with:",
        { list: [
          "**One protein:** a tray of chicken thighs, a pot of chilli, a batch of boiled eggs or a block of baked tofu.",
          "**One fibre-rich carb:** a pot of lentils, brown rice, new potatoes or overnight oats.",
          "**One tray of veg:** roasted peppers, courgettes, onions and carrots, or a big bowl of chopped salad.",
        ] },
      ] },
      { heading: "A one-hour weekly prep", blocks: [
        "Here's one way to use an hour on a Sunday or whichever day suits you:",
        { list: [
          "Put chicken thighs or tofu and a tray of veg in the oven.",
          "While they cook, boil a pan of eggs and cook a pot of lentils or rice.",
          "Make two or three jars of overnight oats with milk and Greek-style yoghurt. See [high-protein breakfasts](/guides/high-protein-breakfasts-uk).",
          "Wash and chop salad veg and keep them in a box.",
          "Let everything cool, then portion it into containers and get it into the fridge within one to two hours.",
          "Freeze anything you won't eat in the next two days, and label it.",
        ], ordered: true },
        "A few good containers with lids, in sizes that suit one portion, make this much easier. Clear ones help you see what's in the fridge, so less gets forgotten at the back.",
        "Through the week, mix and match: chicken, rice and veg one day; eggs, lentils and salad the next. For ready-made ideas, see [high-protein lunches](/guides/high-protein-lunches-uk) and [easy high-protein dinners](/guides/easy-high-protein-dinners-uk).",
      ] },
      { heading: "Food safety basics", blocks: [
        "Prep only helps if the food stays safe. The Food Standards Agency's advice for home cooking includes:",
        { list: [
          "**Keep your fridge between 0 and 5°C.** A fridge thermometer is the easiest way to check.",
          "**Cool food quickly.** Don't put hot food in the fridge. Cool it at room temperature and refrigerate within one to two hours. Dividing it into smaller portions helps it cool faster.",
          "**Eat leftovers within 48 hours,** or freeze them if you won't eat them in time.",
          "**Reheat until steaming hot all the way through,** stirring as you go, and only reheat food once.",
          "**Defrost in the fridge,** and eat defrosted food within 24 hours.",
          "**Store raw meat, poultry and fish** in sealed containers on the bottom shelf, so nothing drips onto other food.",
        ] },
      ] },
      { heading: "Keep it flexible", blocks: [
        "Some weeks the prep will happen and some weeks it won't. Both are fine. A pack of ready-cooked chicken, a tin of beans and a bag of salad is prep too. If plans change and you eat out instead, freeze what you made.",
        "Steadie's meal plan includes simple prep ideas if you'd like a starting point.",
        { note: "If planning food starts to feel rigid or stressful, or you notice worrying thoughts about eating, talk to your GP, or contact Beat, the UK's eating disorder charity. If you have type 2 diabetes, ask your diabetes team how your meals fit with your medicines.", tone: "sky" },
      ] },
    ],
    faqs: [
      { q: "How long does meal prep last in the fridge?", a: "The Food Standards Agency says to eat leftovers within 48 hours, or freeze them if you won't eat them in time. Keep your fridge between 0 and 5°C." },
      { q: "Can I reheat meal prep more than once?", a: "No. Reheat food only once, until it's steaming hot all the way through." },
      { q: "Do I need to prep every meal?", a: "No. Start with the one or two meals that are hardest for you, often lunch or a busy evening, and prep a few building blocks for those." },
      { q: "What's the easiest protein to meal prep?", a: "Boiled eggs, a tray of chicken thighs, a pot of chilli or a batch of baked tofu are all simple and keep well for a couple of days." },
    ],
    sources: [fsaChilling, fsaCooking, S.bdaResource, S.jointAdvisory, S.eatwell, S.beat],
    related: ["easy-high-protein-dinners-uk", "high-protein-lunches-uk", "budget-high-protein-foods-uk", "building-habits-before-you-stop"],
  },
  {
    slug: "family-meals-after-glp-1",
    title: "Family meals after a GLP-1: one meal for everyone",
    metaTitle: "Family meals after weight-loss jabs: one meal for all",
    description: "How to make one protein-first meal the whole family enjoys after a GLP-1, without separate diet food, and how to talk about food kindly around children.",
    category: "Food",
    keywords: ["family meals after weight loss injection", "healthy family dinners uk", "cooking for family when losing weight", "talking to kids about food", "high protein family meals"],
    published: "2026-12-29", updated: "2026-12-29",
    summary: [
      "You don't need separate food. Protein-first meals with veg and fibre are good family food.",
      "Serve the same dishes and let everyone choose their own portion.",
      "Keep talk about weight and dieting away from the table, especially around children.",
      "Ask partners and family for practical help, not for them to watch what you eat.",
    ],
    sections: [
      { heading: "One meal, not two", blocks: [
        "Cooking a \"diet\" plate for yourself and something different for everyone else is tiring, and it can make food feel like a thing to be managed rather than enjoyed. The meals that help most after a GLP-1, built around protein with plenty of veg and some fibre-rich carbs, are simply good everyday food. See [protein after a GLP-1](/guides/protein-after-glp-1).",
        "The NHS says changes are more likely to stick for children when they're small and involve the whole family. The same is often true for adults.",
      ] },
      { heading: "How to build a family plate", blocks: [
        { list: [
          "**Serve dishes in the middle** and let everyone help themselves, so each person can take the amount that suits them.",
          "**Fill your own plate protein first,** with plenty of veg, then add carbs. Nobody else has to eat the same proportions. See [portion sizes without counting](/guides/portion-sizes-without-counting).",
          "**For children,** the NHS suggests starting with small servings and letting them ask for more, and not making them finish everything on the plate.",
          "**Eat together when you can,** at the table rather than in front of a screen. It's a chance to catch up, and the NHS suggests set mealtimes and eating slowly help children too.",
        ] },
        "From the age of two, children can follow the same Eatwell Guide as adults, so a balanced family meal suits everyone. Very young children have different needs, so follow your health visitor's advice for them.",
      ] },
      { heading: "Family-friendly meals that work", blocks: [
        { list: [
          "**Spaghetti bolognese** with half mince, half lentils, and extra veg in the sauce.",
          "**Fajita night** with chicken or beans, peppers, salsa and yoghurt. Everyone builds their own.",
          "**Fish pie** made with frozen fish and a mash topping.",
          "**Chicken traybake** with potatoes and roasted veg.",
          "**Homemade pizza** on wraps, topped with chicken, ham or extra cheese, and a big salad on the side.",
          "**Breakfast for dinner:** eggs, beans, wholemeal toast and tomatoes.",
          "**Mild chilli or curry** with rice, and yoghurt on the table to cool it down.",
        ] },
        "More quick ideas in [easy high-protein dinners](/guides/easy-high-protein-dinners-uk), and for making the week easier, [meal prep after a GLP-1](/guides/meal-prep-after-glp-1).",
      ] },
      { heading: "Talking about food around children", blocks: [
        "Children learn a lot from watching the adults around them. Eating a range of foods yourself, and being active in ways you enjoy, does more than any lecture.",
        "Many parents find it kinder to keep talk about weight, dieting and \"good\" or \"bad\" foods out of family meals, including talk about their own bodies. Instead, talk about what food does: it gives you energy, helps you grow strong and tastes good. Treats can simply be treats, without comment.",
        "If you'd like support with how you feel about your own body after weight loss, see [body image after weight loss](/guides/body-image-after-weight-loss).",
        { note: "If you're worried about your child's eating or weight, talk to your GP or health visitor. If you have worries about your own eating, or a family member's, Beat, the UK's eating disorder charity, has helplines for adults and young people.", tone: "sky" },
      ] },
      { heading: "Partners and the rest of the household", blocks: [
        "It helps to say what support you'd actually like. That might be sharing the cooking, keeping a favourite treat out of sight, or joining you for an evening walk. It probably isn't someone commenting on your plate. A simple \"I'm building meals around protein at the moment, can we try a few new dinners?\" is often enough.",
        "Celebrations and holidays will still involve special food, and that's part of family life. See [Christmas after a weight-loss jab](/guides/christmas-after-weight-loss-jab).",
      ] },
    ],
    faqs: [
      { q: "Do I need to cook separate meals after stopping a GLP-1?", a: "No. Protein-first meals with plenty of veg and some fibre-rich carbs are good food for the whole family. Serve the same dishes and let everyone choose their portion." },
      { q: "Are high-protein meals suitable for children?", a: "Ordinary family meals with meat, fish, eggs, beans or dairy alongside veg and starchy foods suit children from about age two, in line with the Eatwell Guide. For very young children, follow your health visitor's advice." },
      { q: "How should I talk to my children about food?", a: "Many parents find it helps to focus on energy, strength and enjoyment rather than weight or dieting, and to keep comments about bodies, including their own, away from the table." },
    ],
    sources: [nhsChildWeight, S.eatwell, S.bdaResource, S.beat, nhsHealthyEating],
    related: ["easy-high-protein-dinners-uk", "meal-prep-after-glp-1", "portion-sizes-without-counting", "body-image-after-weight-loss"],
  },
];
