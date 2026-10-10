import { router } from "expo-router";
import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Lede, OnbScreen, Opt, Title } from "@/components/Onboarding";
import { sessionsPaused } from "@/state/health";
import { set, useApp } from "@/state/store";
import { radius, space, useColors } from "@/theme";

const DAYS = [["M", "Mon"], ["T", "Tue"], ["W", "Wed"], ["T", "Thu"], ["F", "Fri"], ["S", "Sat"], ["S", "Sun"]];

/** 16 · Which days could you fit in 20 minutes of strength, and where. The days set the session reminders (switched on
 *  in Settings); gym sessions aren't built yet, so the gym choice says so. */
export default function Strength() {
  const s = useApp(), c = useColors();
  const days = s.settings.reminders.sessions.days, at = s.story.strengthAt;
  const toggleDay = (d: number) => set((st) => { const r = st.settings.reminders.sessions; r.days = r.days.includes(d) ? r.days.filter((x) => x !== d) : [...r.days, d].sort(); });
  return (
    <OnbScreen route="strength" footer={<Button label="Continue" variant="brand" block onPress={() => router.push("/onboarding/helps")} />}>
      <Title>Which days could you fit in 20 minutes of strength?</Title>
      <Lede>{sessionsPaused(s) ? "Two a week is the aim, once your GP is happy. Pick days now and we’ll be ready." : "Two a week is the aim. Strength helps protect muscle while your appetite settles."}</Lede>
      <View style={{ flexDirection: "row", gap: 6, marginTop: space[3] }}>
        {DAYS.map(([short, long], i) => {
          const on = days.includes(i);
          return (
            <Pressable key={long} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={long} onPress={() => { Haptics.selectionAsync().catch(() => {}); toggleDay(i); }}
              style={{ flex: 1, minHeight: 64, borderRadius: 18, alignItems: "center", justifyContent: "center", gap: 2, backgroundColor: on ? c.lilac : c.surfaceRaised, borderWidth: 1.5, borderColor: on ? c.lilac : c.line }}>
              <AppText weight="800" color={on ? "onPastel" : "ink"} style={{ fontSize: 18 }} maxFontSizeMultiplier={1.2}>{short}</AppText>
              <AppText weight="800" color={on ? "onPastel" : "inkMuted"} style={{ fontSize: 12 }} maxFontSizeMultiplier={1.2}>{long}</AppText>
            </Pressable>
          );
        })}
      </View>
      <AppText weight="800" style={{ fontSize: 16, marginTop: space[4] }}>Where?</AppText>
      <View accessibilityRole="radiogroup" accessibilityLabel="Where" style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}><Opt label="At home" on={at === "home"} onPress={() => set((st) => { st.story.strengthAt = "home"; })}>
          <AppText variant="caption" weight="600" color={at === "home" ? "onPastel" : "inkMuted"}>Just a chair to start</AppText>
        </Opt></View>
        <View style={{ flex: 1 }}><Opt label="At a gym" on={at === "gym"} onPress={() => set((st) => { st.story.strengthAt = "gym"; })}>
          <AppText variant="caption" weight="600" color={at === "gym" ? "onPastel" : "inkMuted"}>Home sessions work there too. Gym versions are on the way.</AppText>
        </Opt></View>
      </View>
      <View style={{ flexDirection: "row", gap: space[2], alignItems: "center", marginTop: space[2], padding: space[3], borderRadius: radius.md, backgroundColor: c.surfaceSunk }}>
        <Icon name={at === "gym" ? "gym" : "home"} size={18} color={c.ink} />
        <AppText variant="caption" style={{ flex: 1 }}>{days.length ? `${days.length} ${days.length === 1 ? "day" : "days"} a week. You can change them any time.` : "Pick a day or two, or skip for now."}</AppText>
      </View>
    </OnbScreen>
  );
}
