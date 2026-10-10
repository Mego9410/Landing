import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Linking, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Chip, Lede, OnbCard, OnbScreen, TickOpt, Title } from "@/components/Onboarding";
import { HEALTH_QUESTIONS, HEALTH_VERSION, NOTES, REFER } from "@/data/health";
import { applyHealth } from "@/state/health";
import { set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { space, useColors } from "@/theme";

/** 11 · A quick health check (movement plan §4.2): every question answered yes or no. A GP question pauses strength
 *  sessions until they've checked; pregnancy or kidney disease shows a referral note to tick through; gentle answers
 *  adjust sessions; an eating disorder hides weight. Also the 12-weekly re-check from Today or Settings (`?recheck=1`). */
export default function HealthCheck() {
  const s = useApp(), c = useColors();
  const recheck = useLocalSearchParams<{ recheck?: string }>().recheck === "1";
  const [answers, setAnswers] = useState<Record<string, boolean | undefined>>(() => (recheck || s.health.checkedAt ? { ...s.health.answers } : {}));
  const [gpChecked, setGpChecked] = useState(s.health.gpCleared);
  const [referAgreed, setReferAgreed] = useState(!!s.health.referAgreed && s.health.referAgreed.version >= HEALTH_VERSION);
  const [error, setError] = useState("");

  const unanswered = HEALTH_QUESTIONS.filter((q) => answers[q.id] == null).length;
  const gp = HEALTH_QUESTIONS.some((q) => q.kind === "gp" && answers[q.id]);
  const refer = (["pregnant", "kidney"] as const).filter((id) => answers[id]);
  const notes = HEALTH_QUESTIONS.filter((q) => q.kind === "gentle" && answers[q.id]).map((q) => NOTES[q.id]).filter((n): n is string => !!n);

  function save() {
    if (unanswered) { setError(`Answer each question with yes or no. ${unanswered} to go.`); return; }
    if (refer.length && !referAgreed) { setError("Tick the box under the note to carry on, or come back after you’ve checked."); return; }
    if (!s.consent) { router.push("/onboarding/consent"); return; }
    set((st) => {
      applyHealth(st, answers as Record<string, boolean>);
      if (gp) st.health.gpCleared = gpChecked;
      if (refer.length) st.health.referAgreed = { at: new Date().toISOString(), version: HEALTH_VERSION };
    });
    if (recheck) { toast("Thanks. Your plan is up to date."); router.back(); }
    else router.push("/onboarding/numbers");
  }

  return (
    <OnbScreen route={recheck ? undefined : "health"} footer={<>
      {error ? <AppText variant="caption" color="roseInk" style={{ textAlign: "center" }}>{error}</AppText> : null}
      <Button label={recheck ? "Save" : "Continue"} variant="brand" block onPress={save} />
      {recheck ? <Button label="Cancel" variant="quiet" onPress={() => router.back()} style={{ alignSelf: "center" }} /> : null}
    </>}>
      <Title>A quick health check</Title>
      <Lede>{recheck ? "Every 12 weeks we check nothing has changed, so your plan still fits. Private to you." : "So your plan fits you. Private to you."}</Lede>
      <View style={{ gap: 18, marginTop: space[3] }}>
        {HEALTH_QUESTIONS.map((q) => (
          <View key={q.id} style={{ gap: space[2] }}>
            <AppText weight="800" style={{ fontSize: 16, lineHeight: 22 }}>{q.ask}</AppText>
            <View accessibilityRole="radiogroup" accessibilityLabel={q.ask} style={{ flexDirection: "row", gap: space[2] }}>
              <Chip label="Yes" on={answers[q.id] === true} onPress={() => { setError(""); setAnswers((a) => ({ ...a, [q.id]: true })); }} style={{ flex: 1 }} />
              <Chip label="No" on={answers[q.id] === false} onPress={() => { setError(""); setAnswers((a) => ({ ...a, [q.id]: false })); }} style={{ flex: 1 }} />
            </View>
            {q.detail ? <AppText variant="caption" color="inkMuted" style={{ fontSize: 14, lineHeight: 20 }}>{q.detail}</AppText> : null}
          </View>
        ))}
      </View>

      {gp ? (
        <OnbCard style={{ marginTop: space[3], gap: space[3], backgroundColor: c.butter }}>
          <AppText weight="800" color="onPastel">Check with your GP before strength sessions</AppText>
          <AppText color="onPastel">Your food plan and habits start straight away. Strength sessions wait until you tell us you’ve checked, here or from the Workouts screen.</AppText>
          <TickOpt label="My GP is happy for me to do strength exercise" checked={gpChecked} onChange={setGpChecked} />
        </OnbCard>
      ) : null}

      {refer.map((id) => (
        <OnbCard key={id} style={{ marginTop: space[3], gap: space[2], backgroundColor: c.sky }}>
          <AppText weight="800" color="onPastel">Talk to your {REFER[id].who} first</AppText>
          <AppText color="onPastel">{REFER[id].note}</AppText>
        </OnbCard>
      ))}
      {refer.length ? (
        <TickOpt label={`I’ve read this. I’ll check with my ${refer.map((id) => REFER[id].who).join(" and ")}, and I agree to the terms of use and health information.`} checked={referAgreed} onChange={(v) => { setError(""); setReferAgreed(v); }} />
      ) : null}

      {notes.length ? (
        <OnbCard style={{ marginTop: space[3], gap: space[2] }}>
          <AppText weight="800">We’ll adjust your plan</AppText>
          {notes.map((n) => <AppText key={n} color="inkMuted">{n}</AppText>)}
          {answers.eating ? <Button label="Call Beat’s helpline" variant="secondary" onPress={() => Linking.openURL("tel:08088010677")} /> : null}
        </OnbCard>
      ) : null}
    </OnbScreen>
  );
}
