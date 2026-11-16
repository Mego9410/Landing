// Recipe photos: a wide one at the top of a recipe, and a small square one in lists. Recipes without a photo show
// nothing (the hero) or the usual meal disc (the thumbnail).
import { Image, View } from "react-native";
import { RECIPE_IMAGES } from "@/data/recipeImages";
import { radius, useColors } from "@/theme";
import { AppText } from "./AppText";
import { Disc } from "./ui";

type Tone = "apricot" | "sage" | "lilac" | "sky" | "butter" | "rose";

/** The photo across the top of a recipe, 3:2, with a note that it's illustrative. Decorative: the recipe's name is
 *  right below it. */
export function RecipeHero({ id }: { id: string }) {
  const c = useColors(), src = RECIPE_IMAGES[id];
  if (!src) return null;
  return (
    <View style={{ gap: 6 }}>
      <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ width: "100%", aspectRatio: 3 / 2, borderRadius: radius.lg, overflow: "hidden", backgroundColor: c.surfaceSunk }}>
        <Image source={src} resizeMode="cover" style={{ width: "100%", height: "100%" }} />
      </View>
      <AppText variant="caption" color="inkMuted">Photo for illustrative purposes.</AppText>
    </View>
  );
}

/** A small rounded square of the photo for list rows, or the meal disc when there's no photo. */
export function RecipeThumb({ id, size = 52, tone = "apricot" }: { id: string; size?: number; tone?: Tone }) {
  const c = useColors(), src = RECIPE_IMAGES[id];
  if (!src) return <Disc icon="meal" tone={tone} size={size} />;
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ width: size, height: size, borderRadius: radius.md, overflow: "hidden", backgroundColor: c.surfaceSunk }}>
      <Image source={src} resizeMode="cover" style={{ width: size, height: size }} />
    </View>
  );
}
