import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Header } from "@/components/ui";
import { LESSONS, phaseOf } from "@/data/content";
import { set, useApp, weekOf } from "@/state/store";
import { toast } from "@/state/toast";
import { radius, space, useColors } from "@/theme";

/** PL3 This week's lesson. */
export default function Lesson() {
  const s = useApp(), c = useColors();
  const week = weekOf(s), phase = phaseOf(week), lesson = LESSONS[phase.key];
  return (
    <Screen contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <Header fallback="/week" right={<AppText variant="caption" color="inkMuted">3 minute read</AppText>} />
      <View accessible={false} style={{ height: 120, borderRadius: radius.lg, backgroundColor: c.lilac, overflow: "hidden" }}>
        <View style={{ position: "absolute", left: 30, bottom: -40, width: 110, height: 110, borderRadius: 55, backgroundColor: c.apricot }} />
        <View style={{ position: "absolute", right: 40, top: 24, width: 120, height: 40, borderRadius: 20, backgroundColor: c.surfaceRaised, opacity: 0.7 }} />
      </View>
      <View style={{ gap: 6 }}>
        <AppText variant="label" color="apricotInk">WEEK {week} · {phase.name.toUpperCase()}</AppText>
        <AppText variant="title">{lesson.title}</AppText>
      </View>
      {lesson.paras.map((p) => <AppText key={p} variant="bodyLg">{p}</AppText>)}
      <Card tone="sky" style={{ gap: 8 }}>
        <AppText variant="label" color="onPastel">TRY THIS WEEK</AppText>
        {lesson.tries.map((t) => <AppText key={t} color="onPastel">{t}</AppText>)}
      </Card>
      <Button label={s.lessonsRead[week] ? "Done" : "Mark as read"} block onPress={() => {
        if (!s.lessonsRead[week]) { set((st) => { st.lessonsRead[week] = true; }); toast("Lesson marked as read."); }
        router.back();
      }} />
    </Screen>
  );
}
