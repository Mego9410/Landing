import { router } from "expo-router";
import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Icon, type IconName } from "@/components/Icon";
import { Bubble, OnbScreen, Title } from "@/components/Onboarding";
import { accountsAvailable, useAccount } from "@/state/account";
import { afterPlan } from "@/state/onboarding";
import { billingEnabled } from "@/state/subscription";
import { set, useApp } from "@/state/store";
import { radius, space, useColors } from "@/theme";

const MOODS: { id: string; label: string; icon: IconName; reply: string }[] = [
  { id: "calm", label: "Calm", icon: "smile", reply: "Lovely. Let’s keep that going." },
  { id: "wobbly", label: "A bit wobbly", icon: "heart", reply: "Wobbly days are part of it." },
  { id: "anxious", label: "Anxious", icon: "heart", reply: "That’s understandable at the start. We’ll go one day at a time." },
  { id: "good", label: "Good", icon: "star", reply: "Great start." },
];

/** 22 · First check-in (optional): one question, then on to the plan. */
export default function FirstCheckin() {
  const s = useApp(), c = useColors(), { account } = useAccount();
  const mood = MOODS.find((m) => m.id === s.story.mood);
  const r = s.settings.reminders.checkIn, name = s.name.trim();
  const tomorrow = r.on ? ` Tomorrow’s check-in will be ready at ${r.hour}:${String(r.minute).padStart(2, "0")}.` : "";
  const billing = billingEnabled() && !s.demo;
  const next = afterPlan({ billing, subscribed: !!s.subscription?.active, accounts: accountsAvailable(), signedIn: !!account });
  return (
    <OnbScreen route="first-checkin" footer={<Button label={billing && !s.subscription?.active ? "Unlock my plan" : "Continue"} variant="brand" block onPress={() => router.push(next)} />}>
      <View style={{ alignSelf: "flex-start", backgroundColor: c.sage, borderRadius: radius.full, paddingVertical: 5, paddingHorizontal: 11 }}>
        <AppText weight="800" color="onPastel" style={{ fontSize: 13 }}>Your first check-in · 20 seconds</AppText>
      </View>
      <Title>How are you feeling this morning?</Title>
      <View accessibilityRole="radiogroup" accessibilityLabel="How you’re feeling" style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: space[3] }}>
        {MOODS.map((m) => {
          const on = s.story.mood === m.id;
          return (
            <Pressable key={m.id} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={m.label}
              onPress={() => { Haptics.selectionAsync().catch(() => {}); set((st) => { st.story.mood = m.id; }); }}
              style={({ pressed }) => ({ flexBasis: "47%", flexGrow: 1, minHeight: 104, borderRadius: 22, alignItems: "center", justifyContent: "center", gap: space[2], backgroundColor: on ? c.sage : c.surfaceRaised, borderWidth: 1.5, borderColor: on ? c.sage : c.line, opacity: pressed ? 0.85 : 1 })}>
              <Icon name={m.icon} size={26} color={on ? c.onPastel : c.ink} />
              <AppText weight="800" color={on ? "onPastel" : "ink"} style={{ fontSize: 16 }}>{m.label}</AppText>
            </Pressable>
          );
        })}
      </View>
      {mood ? <View style={{ marginTop: space[3] }} accessibilityLiveRegion="polite"><Bubble size={56}>{`${name ? `Thanks, ${name}. ` : "Thanks. "}${mood.reply}${tomorrow}`}</Bubble></View> : null}
    </OnbScreen>
  );
}
