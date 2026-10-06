import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "@/components/AppText";
import { Icon } from "@/components/Icon";
import { coachReply } from "@/data/content";
import { set, useApp } from "@/state/store";
import { radius, space, textStyle, useColors } from "@/theme";

const STARTERS = ["A quick high-protein lunch?", "I'm hungry tonight", "Eating out this weekend", "I had a hard day"];

/** C1–C2 The coach: scripted replies for now, and the prescriber redirect for any medication question. */
export default function Coach() {
  const s = useApp(), c = useColors(), insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const scroll = useRef<ScrollView>(null);
  function send(t: string) {
    const msg = t.trim();
    if (!msg) return;
    const r = coachReply(msg, s.settings.safeMode);
    set((st) => { st.coach.messages.push({ from: "you", text: msg }, { from: "coach", text: r.text, redirect: r.redirect }); });
    setText("");
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.surface }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView ref={scroll} contentContainerStyle={{ paddingTop: insets.top + space[4], paddingHorizontal: 20, paddingBottom: 24, gap: space[3] }}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}>
        <AppText variant="title" accessibilityRole="header">Coach</AppText>
        <AppText color="inkMuted">Ask anything about habits, food and getting through a tricky day. For anything about your medication, your prescriber is the person to ask.</AppText>
        {s.coach.messages.map((m, i) => (
          <View key={i} style={{ alignSelf: m.from === "you" ? "flex-end" : "flex-start", maxWidth: "85%", padding: space[3], borderRadius: radius.lg,
            backgroundColor: m.from === "you" ? c.apricot : m.redirect ? c.butter : c.lilac }}>
            {m.redirect ? <AppText variant="label" color="onPastel" style={{ marginBottom: 4 }}>FOR YOUR PRESCRIBER</AppText> : null}
            <AppText color="onPastel">{m.text}</AppText>
          </View>
        ))}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2], marginTop: space[2] }}>
          {STARTERS.map((t) => (
            <Pressable key={t} accessibilityRole="button" onPress={() => send(t)} style={{ borderRadius: radius.full, paddingHorizontal: space[3], height: 36, justifyContent: "center", borderWidth: 1.5, borderColor: c.line, backgroundColor: c.surfaceRaised }}>
              <AppText variant="caption" weight="700">{t}</AppText>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <View style={{ flexDirection: "row", gap: space[2], paddingHorizontal: 20, paddingTop: space[2], paddingBottom: 112, backgroundColor: c.surface }}>
        <TextInput accessibilityLabel="Message the coach" value={text} onChangeText={setText} onSubmitEditing={() => send(text)} returnKeyType="send"
          placeholder="Ask about food, habits or a hard day" placeholderTextColor={c.inkMuted}
          style={[textStyle("body"), { flex: 1, height: 48, borderRadius: radius.full, paddingHorizontal: space[4], backgroundColor: c.surfaceRaised, color: c.ink, borderWidth: 1.5, borderColor: c.line }]} />
        <Pressable accessibilityRole="button" accessibilityLabel="Send" onPress={() => send(text)} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.lilac, alignItems: "center", justifyContent: "center" }}>
          <Icon name="send" color={c.onPastel} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
