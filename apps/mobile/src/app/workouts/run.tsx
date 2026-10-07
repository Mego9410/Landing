import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { castById } from "@landing/motion";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { ExerciseAnimation } from "@/components/ExerciseAnimation";
import { Screen } from "@/components/Screen";
import { Header, Meter, ToggleRow } from "@/components/ui";
import { sessionFor } from "@/data/sessions";
import { whoFor } from "@/state/demos";
import { logSession } from "@/state/habits";
import { easierFirst } from "@/state/health";
import { useApp } from "@/state/store";
import { radius, space, useColors } from "@/theme";

/** W3 In session: one move at a time, set by set, with the loop playing and an easier version a tap away. */
export default function InSession() {
  const s = useApp(), c = useColors();
  const { id: raw } = useLocalSearchParams<{ id: "A" | "B" }>();
  const id = raw === "B" ? "B" : "A";
  const [session] = useState(() => sessionFor(s, id)); // fixed for the length of the session
  const [move, setMove] = useState(0);
  const [setNo, setSetNo] = useState(1);
  const [paused, setPaused] = useState(false);
  const [easier, setEasier] = useState(() => easierFirst(s));
  const m = session.moves[move];
  const anim = easier && m.easier ? m.easier : m.anim, who = whoFor(s, `${m.anim}-${id}`);
  const steps = session.moves.reduce((a, x) => a + x.sets, 0);
  const doneSteps = session.moves.slice(0, move).reduce((a, x) => a + x.sets, 0) + setNo - 1;
  function next() {
    if (setNo < m.sets) return setSetNo(setNo + 1);
    if (move < session.moves.length - 1) { setMove(move + 1); setSetNo(1); setEasier(easierFirst(s)); return; }
    logSession(id);
    router.replace({ pathname: "/workouts/done", params: { id } });
  }
  return (
    <Screen header={<Header close fallback="/" middle={<AppText variant="caption" color="inkMuted">{session.name} · move {move + 1} of {session.moves.length}</AppText>} />} contentContainerStyle={{ gap: space[4], paddingBottom: 48 }}>
      <Meter value={doneSteps} max={steps} label="Session progress" />
      <View style={{ borderRadius: radius.lg, backgroundColor: c.sky, overflow: "hidden" }}>
        <ExerciseAnimation id={anim} who={who} paused={paused || s.demos.still} />
      </View>
      <View style={{ gap: 4 }}>
        <AppText variant="title">{easier && m.easier ? `${m.name}, easier` : m.name}</AppText>
        <AppText variant="bodyLg">Set {setNo} of {m.sets} · {m.reps}</AppText>
        <AppText color="inkMuted">{m.cue}</AppText>
        <AppText variant="caption" color="inkMuted">Shown by {castById(who).name}</AppText>
      </View>
      {m.easier ? <ToggleRow title="Easier version" sub="Same move, less load" value={easier} onChange={setEasier} /> : null}
      <View style={{ flexDirection: "row", gap: space[2] }}>
        <View style={{ flex: 1 }}><Button label={paused ? "Play" : "Pause"} icon={paused ? "play" : "pause"} variant="secondary" block onPress={() => setPaused(!paused)} /></View>
        <View style={{ flex: 1 }}><Button label={setNo < m.sets ? "Set done" : move < session.moves.length - 1 ? "Next move" : "Finish"} block onPress={next} /></View>
      </View>
    </Screen>
  );
}
