import { router } from "expo-router";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { Choices, Header } from "@/components/ui";
import { TODAY } from "@/data/dates";
import { set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { radius, space, textStyle, useColors } from "@/theme";

const MEALS = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;

function Field({ label, value, onChange, suffix, error, placeholder }: { label: string; value: string; onChange: (v: string) => void; suffix: string; error?: string; placeholder: string }) {
  const c = useColors();
  return (
    <View style={{ gap: 6, flex: 1 }}>
      <AppText weight="700">{label}</AppText>
      <View style={{ flexDirection: "row", alignItems: "center", height: 56, borderRadius: radius.md, backgroundColor: c.surfaceRaised, paddingHorizontal: space[4], borderWidth: 1.5, borderColor: error ? c.roseInk : c.line }}>
        <TextInput accessibilityLabel={label} value={value} onChangeText={onChange} keyboardType="decimal-pad" placeholder={placeholder} placeholderTextColor={c.inkMuted}
          style={[textStyle("bodyLg"), { flex: 1, color: c.ink }]} />
        <AppText color="inkMuted">{suffix}</AppText>
      </View>
      {error ? <AppText variant="caption" color="roseInk">{error}</AppText> : null}
    </View>
  );
}

/** T2 Quick log: protein for a meal and today's weight, in one go. */
export default function QuickLog() {
  const s = useApp();
  const [meal, setMeal] = useState<string>(MEALS.find((m) => !s.protein[m]) ?? "Snack");
  const [protein, setProtein] = useState("");
  const [weight, setWeight] = useState(String(s.weights.find((w) => w.date === TODAY)?.kg ?? ""));
  const [errors, setErrors] = useState<Record<string, string>>({});
  function save() {
    const e: Record<string, string> = {};
    const g = protein === "" ? null : parseFloat(protein), kg = weight === "" ? null : parseFloat(weight);
    if (g != null && !(g >= 0 && g <= 150)) e.protein = "That looks high for one meal. Check the number and try again.";
    if (kg != null && !(kg >= 30 && kg <= 300)) e.weight = "Enter your weight in kilograms, like 78.4.";
    setErrors(e);
    if (Object.keys(e).length) return;
    set((st) => {
      if (g != null) {
        st.protein[meal] = Math.round(g);
        if (meal === "Breakfast" && g >= 25 && st.habits.ids.includes("protein") && !st.habits.today.protein) { st.habits.today.protein = true; st.habits.done.protein = (st.habits.done.protein ?? 0) + 1; }
      }
      if (kg != null) { st.weights = st.weights.filter((w) => w.date !== TODAY); st.weights.unshift({ date: TODAY, kg: Math.round(kg * 10) / 10, source: "Logged by you" }); }
    });
    toast("Logged. Nice one.");
    router.back();
  }
  return (
    <Screen contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <Header close fallback="/" />
      <AppText variant="title">Quick log</AppText>
      <View style={{ gap: space[2] }}>
        <AppText weight="700">Meal</AppText>
        <Choices label="Meal" options={MEALS.map((m) => ({ id: m, label: m }))} value={meal} onChange={(v) => setMeal(v as string)} />
      </View>
      <Field label={s.settings.safeMode ? "Protein, this meal (optional)" : "Protein, this meal"} value={protein} onChange={setProtein} suffix="g" placeholder="30" error={errors.protein} />
      {s.settings.safeMode ? null : <Field label="Today's weight (optional)" value={weight} onChange={setWeight} suffix="kg" placeholder="78.4" error={errors.weight} />}
      <Button label="Save" block onPress={save} />
    </Screen>
  );
}
