import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Header } from "@/components/ui";
import { lessonByKey } from "@/data/lessons";
import { lessonNow, lessonRead, markLessonRead } from "@/state/plans";
import { set, stageLabel, stageOf, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { radius, space, useColors } from "@/theme";

/** PL3 This week's lesson, or the one a link names (`key`: w12, r3, y5 — see lessons.ts). */
export default function Lesson() {
  const s = useApp(), c = useColors(), q = useLocalSearchParams<{ key?: string }>();
  const now = lessonNow(s), key = q.key && lessonByKey(q.key) ? q.key : now.key;
  const lesson = lessonByKey(key) ?? now.lesson, read = lessonRead(s, key), phase = stageOf(s);
  return (
    <Screen header={<Header fallback="/week" right={<AppText variant="caption" color="inkMuted">3 minute read</AppText>} title={lesson.title} titleAfter={170} />} contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ height: 120, borderRadius: radius.lg, backgroundColor: c.lilac, overflow: "hidden" }}>
        <View style={{ position: "absolute", left: 30, bottom: -40, width: 110, height: 110, borderRadius: 55, backgroundColor: c.apricot }} />
        <View style={{ position: "absolute", right: 40, top: 24, width: 120, height: 40, borderRadius: 20, backgroundColor: c.surfaceRaised, opacity: 0.7 }} />
      </View>
      <View style={{ gap: 6 }}>
        <AppText variant="label" color="apricotInk">{stageLabel(s).toUpperCase()} · {phase.name.toUpperCase()}</AppText>
        <AppText variant="title">{lesson.title}</AppText>
      </View>
      {lesson.paras.map((p) => <AppText key={p} variant="bodyLg">{p}</AppText>)}
      <Card tone="sky" style={{ gap: 8 }}>
        <AppText variant="label" color="onPastel">TRY THIS WEEK</AppText>
        {lesson.tries.map((t) => <AppText key={t} color="onPastel">{t}</AppText>)}
      </Card>
      <Button label={read ? "Done" : "Mark as read"} block onPress={() => {
        if (!read) { set((st) => markLessonRead(st, key)); toast("Lesson marked as read."); }
        router.back();
      }} />
    </Screen>
  );
}
