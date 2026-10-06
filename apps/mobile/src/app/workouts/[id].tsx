import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { castById } from "@landing/motion";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { ExerciseAnimation } from "@/components/ExerciseAnimation";
import { Screen } from "@/components/Screen";
import { Header, List, SessionHealth } from "@/components/ui";
import { sessionFor } from "@/data/sessions";
import { whoFor } from "@/state/demos";
import { sessionNotes, sessionsPaused } from "@/state/health";
import { set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { radius, space, useColors } from "@/theme";

/** W2 Session overview: every move with its loop, sets and cue. Tap a move to watch it. */
export default function SessionOverview() {
  const s = useApp(), c = useColors();
  const { id } = useLocalSearchParams<{ id: "A" | "B" }>();
  const session = sessionFor(s, id === "B" ? "B" : "A");
  const [open, setOpen] = useState(0);
  const move = session.moves[open], who = whoFor(s, `${move.anim}-${id}`);
  return (
    <Screen contentContainerStyle={{ gap: space[4], paddingBottom: 48 }}>
      <Header fallback="/workouts" />
      <AppText variant="title" accessibilityRole="header">{session.name}</AppText>
      <AppText color="inkMuted">{session.minutes} minutes at home · {session.moves.length} exercises · level {session.level} of 3</AppText>
      <SessionHealth paused={sessionsPaused(s)} notes={sessionNotes(s)} onCleared={() => { set((st) => { st.health.gpCleared = true; }); toast("Thanks. Your sessions are ready."); }} />
      <View style={{ borderRadius: radius.lg, backgroundColor: c.sky, overflow: "hidden" }}>
        <ExerciseAnimation id={move.anim} who={who} paused={s.demos.still} />
        <View style={{ position: "absolute", left: 12, top: 12, backgroundColor: c.surfaceRaised, borderRadius: radius.full, paddingHorizontal: 12, height: 30, justifyContent: "center" }}>
          <AppText variant="caption" weight="800">{move.name} · {castById(who).name}</AppText>
        </View>
      </View>
      <List>
        {session.moves.map((m, i) => (
          <Pressable key={m.name} accessibilityRole="button" accessibilityState={{ selected: i === open }} onPress={() => setOpen(i)}
            style={{ paddingVertical: space[3], paddingHorizontal: space[4], gap: 2, borderTopWidth: i ? 1 : 0, borderTopColor: c.line, backgroundColor: i === open ? c.surfaceSunk : "transparent" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <AppText weight="800">{i + 1}. {m.name}</AppText>
              <AppText variant="caption" color="inkMuted">{m.sets} × {m.reps}</AppText>
            </View>
            {i === open ? <AppText variant="caption" color="inkMuted">{m.cue}</AppText> : null}
          </Pressable>
        ))}
      </List>
      <AppText variant="caption" color="inkMuted">Stop if anything hurts sharply, and go easier on any move you need to. A stiff, worked feeling is normal.</AppText>
      {sessionsPaused(s) ? null : <Button label="Start session" icon="play" block onPress={() => router.push({ pathname: "/workouts/run", params: { id: id === "B" ? "B" : "A" } })} />}
    </Screen>
  );
}
