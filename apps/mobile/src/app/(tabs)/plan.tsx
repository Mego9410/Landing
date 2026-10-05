import { useState } from "react";
import { Pressable, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { ExerciseAnimation } from "@/components/ExerciseAnimation";
import { PortList } from "@/components/PortNote";
import { Screen } from "@/components/Screen";
import { radius, space, useColors } from "@/theme";

// This week's Strength B, as in the prototype. The full plan screens are still to be ported.
const MOVES = [
  { id: "squat-4", name: "Goblet squat" },
  { id: "hinge-1", name: "Glute bridge" },
  { id: "push-2", name: "Counter press-up" },
  { id: "row-4", name: "One-arm row" },
  { id: "core-2", name: "Dead bug" },
];

export default function Plan() {
  const c = useColors();
  const [move, setMove] = useState(MOVES[0]);
  return (
    <Screen contentContainerStyle={{ gap: space[4] }}>
      <AppText variant="title" accessibilityRole="header">Your plan</AppText>
      <Card tone="sky" style={{ padding: 0, overflow: "hidden" }}>
        <ExerciseAnimation id={move.id} />
      </Card>
      <AppText variant="heading">{move.name}</AppText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
        {MOVES.map((m) => (
          <Pressable
            key={m.id}
            onPress={() => setMove(m)}
            accessibilityRole="button"
            accessibilityState={{ selected: m.id === move.id }}
            style={{ backgroundColor: m.id === move.id ? c.apricot : c.surfaceSunk, borderRadius: radius.full, height: 36, paddingHorizontal: space[3], justifyContent: "center" }}
          >
            <AppText variant="label" color={m.id === move.id ? "onPastel" : "ink"}>{m.name}</AppText>
          </Pressable>
        ))}
      </View>
      <PortList screens={["PL1 Your plan", "PL2 Week detail", "PL3 Lesson", "PL4 New phase"]} />
    </Screen>
  );
}
