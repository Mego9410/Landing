// Content types for the food library. The simple CMS (plan §7.1) will save files in these shapes; for now the data
// lives in TypeScript so the compiler and scripts/check.ts catch mistakes before a dietitian ever sees them.

/** The 14 allergens UK food law requires us to name (FSA). */
export type Allergen =
  | "celery" | "gluten" | "crustaceans" | "eggs" | "fish" | "lupin" | "milk"
  | "molluscs" | "mustard" | "peanuts" | "sesame" | "soya" | "sulphites" | "tree-nuts";

/** What an ingredient is, for diet rules. "plant" covers everything that isn't animal. */
export type Kind = "beef" | "lamb" | "pork" | "poultry" | "fish" | "shellfish" | "egg" | "dairy" | "plant";

export type Aisle =
  | "Fruit and veg" | "Meat and fish" | "Dairy and eggs" | "Chilled" | "Bakery" | "Frozen"
  | "Tins and jars" | "Rice, pasta and grains" | "World foods" | "Store cupboard";

export interface Ingredient {
  id: string;
  name: string;
  /** The word for it in a recipe name ("chicken" in "Chicken tikka traybake"), so a swap can rename the dish. */
  short?: string;
  /** Per 100 g as used (drained for tins, dry for pasta and lentils): protein, carbs, fibre (AOAC), fat, salt. */
  per100: { protein: number; carbs: number; fibre: number; fat: number; salt: number };
  kind: Kind;
  allergens: Allergen[];
  /** Counts towards the 80 g veg portion in a main. */
  veg?: boolean;
  /** Onion, garlic, potato and other root vegetables, which a Jain diet leaves out. */
  root?: boolean;
  /** Oil, salt, pepper, stock, a curry paste, soy sauce, dried herbs and spices, garlic: not on the shopping count. */
  pantry?: boolean;
  /** Cold-smoked or uncooked foods NHS pregnancy advice says to avoid, unless cooked until steaming hot. */
  pregnancyAvoid?: boolean;
  /** Lactose-free, or naturally almost free of it (hard cheese, Parmesan in pesto). Other dairy contains lactose. */
  lactoseFree?: boolean;
  aisle: Aisle;
  /** How it's bought: one "unit" gives `size` grams as used, so the shopping list can say "2 tins", not "480 g". */
  buy?: { unit: string; plural?: string; size: number };
  /** For things counted, not weighed: grams in one (an egg, a wrap, a slice). */
  each?: { name: string; plural?: string; grams: number };
}

export type Slot = "breakfast" | "lunch" | "dinner" | "snack";

export type Collection =
  | "no-cook" | "store-cupboard" | "batch" | "fakeaway" | "microwave" | "one-pan" | "on-the-go" | "gentle" | "family";

export type Cuisine =
  | "British" | "South Asian" | "Chinese" | "Thai" | "Japanese" | "Mexican" | "Italian" | "Mediterranean"
  | "Middle Eastern" | "Caribbean" | "West African" | "Eastern European" | "American";

/** Kit a recipe needs. "tray" means an oven or an air fryer. */
export type Kit = "hob" | "tray" | "microwave" | "kettle" | "none";

export interface Line {
  /** Ingredient id. */
  i: string;
  /** Grams per portion. */
  g: number;
  /** "To serve" or "if you like": left out of the Easy count and the shopping list's must-haves. */
  optional?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  slot: Slot;
  /** One sentence for cards. */
  blurb: string;
  /** Portions the method makes. Batch recipes make 4 or more. */
  serves: number;
  /**
   * Honest minutes from opening the fridge to food on the table. Washing up isn't included: `washUp` counts the items
   * instead. `active` is hands-on time: getting things out, chopping, stirring, plating. `wait` is time the oven, hob
   * or microwave works while you're free, including any oven preheat the prep doesn't cover (a fan oven takes about
   * 10 minutes to reach 200°C). Times assume a fan oven where a recipe offers an air fryer too. Estimates until a real
   * cook times each recipe.
   */
  time: { active: number; wait: number };
  /** Hands-on minutes: the same as time.active. */
  handsOn: number;
  /** Minutes until it's on the table: active + wait. */
  total: number;
  /** Anything done ahead that the times don't include, such as defrosting overnight. */
  ahead?: string;
  kit: Kit[];
  /** Items to wash up. */
  washUp: number;
  collections: Collection[];
  cuisine: Cuisine;
  /** Estimated cost a portion at 2026 prices: 1 is under £1.50, 2 is £1.50 to £2.50, 3 is over £2.50. To verify. */
  cost: 1 | 2 | 3;
  /** Chilli heat, for people who can't face spicy food at the moment. */
  spicy?: boolean;
  ingredients: Line[];
  steps: string[];
  /**
   * Swaps the method can't take, by ingredient: the only substitutes allowed, or [] for none (boiled eggs can't
   * become tofu). Without an entry, any vetted swap is fine and the method gets a "use X where it says Y" note.
   */
  only?: Record<string, string[]>;
  fridgeDays: number;
  freezes: boolean;
  /** A store-cupboard version, in a sentence, where one makes sense. */
  storeCupboard?: string;
  /**
   * Sign-off. Everything starts as a draft; only the dietitian (and the cook, for timings) moves a recipe to approved,
   * through the CMS. The app shows approved recipes only. The prototype shows drafts with a label.
   */
  review: { status: "draft" | "in-review" | "approved"; by?: string; on?: string; timedBy?: string };
}

/** A tagged substitute for an ingredient (plan §5.4). `ratio` scales the grams; the engine recalculates nutrition. */
export interface Swap {
  to: string;
  ratio: number;
  /** Shown beside the swap, such as "less protein, so we add a top-up". */
  note?: string;
}
