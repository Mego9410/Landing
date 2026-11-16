import Image from "next/image";
import { RECIPE, type Slot } from "@landing/content";
import styles from "./guides/guides.module.css";

// Photos of meals from the app (public/recipes/<recipe-id>.webp, 720x480, the same photos the app shows). Food guides
// show three in their end card, picked to fit the guide: breakfasts for a breakfast guide, and so on.

const PICKS: Record<Slot, string[]> = {
  breakfast: ["shakshuka", "yoghurt-bowl", "overnight-oats", "salmon-bagel", "potato-egg-hash", "protein-porridge", "beans-eggs-toast", "smoky-beans-mushrooms", "gram-flour-pancakes"],
  lunch: ["greek-chickpea-salad", "halloumi-couscous", "tuna-bean-salad", "lentil-feta-bowl", "prawn-rice-bowl", "red-lentil-soup", "picnic-box", "mackerel-beetroot", "chicken-hummus-wrap", "salmon-noodle-salad"],
  dinner: ["chicken-tikka-traybake", "salmon-poke", "turkey-chilli", "prawn-fried-rice", "halloumi-veg-tray", "salmon-pesto-traybake", "chicken-shawarma", "thai-green-curry", "smash-burger", "red-lentil-dhal", "loaded-sweet-potato", "jerk-chicken-rice-peas"],
  snack: ["hummus-edamame", "apple-pb-yoghurt", "cottage-oatcakes", "skyr-berries", "pb-oat-bites", "mackerel-pate-oatcakes", "chilli-edamame"],
};

/** The home page's Eat tile. */
export const HOME_MEALS = ["chicken-tikka-traybake", "shakshuka", "salmon-poke"];

const hash = (s: string) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
const take = (list: string[], seed: number, n: number) => Array.from({ length: n }, (_, i) => list[(seed + i * 3) % list.length]);

/** Three meals that fit a guide, the same three every time for the same guide. */
export function mealsForGuide(slug: string): string[] {
  const seed = hash(slug);
  const slot = (["breakfast", "lunch", "snack"] as const).find((k) => slug.includes(k)) ?? (/dinner|family/.test(slug) ? "dinner" : null);
  if (slot) return take(PICKS[slot], seed, 3);
  return [PICKS.breakfast, PICKS.lunch, PICKS.dinner].map((list) => list[seed % list.length]);
}

/** A row of meal photos with their names, and the note that the photos are illustrative. */
export function MealPhotos({ ids }: { ids: string[] }) {
  return (
    <div className={styles.meals}>
      <ul className={styles.mealList} aria-label="Meals from the app">
        {ids.map((id) => (
          <li key={id}>
            <Image src={`/recipes/${id}.webp`} alt="" width={720} height={480} sizes="(max-width: 640px) 30vw, 200px" />
            <span>{RECIPE[id]?.name ?? ""}</span>
          </li>
        ))}
      </ul>
      <span className={styles.mealNote}>Photos for illustrative purposes.</span>
    </div>
  );
}