import { router } from "expo-router";
import { TextInput, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Mark } from "@/components/Mark";
import { OnbScreen } from "@/components/Onboarding";
import { set, useApp } from "@/state/store";
import { space, textStyle, useColors } from "@/theme";

/** 2 · What should I call you? Optional. */
export default function Name() {
  const s = useApp(), c = useColors();
  const name = s.name.trim();
  const next = () => router.push("/onboarding/before");
  return (
    <OnbScreen route="name" footer={<>
      <Button label="Continue" variant="brand" block onPress={next} />
      <Button label="I’d rather not say" variant="quiet" onPress={() => { set((st) => { st.name = ""; }); next(); }} style={{ alignSelf: "center" }} />
    </>}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: space[3], marginTop: space[4] }}>
        <Mark height={90} hole={c.surface} />
        <View style={{ marginBottom: 40, backgroundColor: c.surfaceRaised, borderRadius: 22, paddingVertical: 14, paddingHorizontal: 18, shadowColor: "#6b4a30", shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 2 }}>
          <AppText weight="700" accessibilityRole="header" style={{ fontSize: 17 }}>What should I call you?</AppText>
        </View>
      </View>
      <View style={{ gap: space[2], marginTop: space[5] }}>
        <AppText weight="800" color="inkMuted" style={{ fontSize: 14 }}>Your first name</AppText>
        <TextInput accessibilityLabel="Your first name" value={s.name} onChangeText={(v) => set((st) => { st.name = v.slice(0, 30); })} placeholder="First name" placeholderTextColor={c.inkMuted}
          autoComplete="given-name" textContentType="givenName" autoCapitalize="words" returnKeyType="done" onSubmitEditing={next}
          style={[textStyle("bodyLg", "700"), { minHeight: 58, borderRadius: 18, borderWidth: 2, borderColor: name ? c.apricotInk : c.line, backgroundColor: c.surfaceRaised, paddingHorizontal: 18, fontSize: 20, color: c.ink }]} />
      </View>
      {name ? (
        <View accessibilityLiveRegion="polite" style={{ flexDirection: "row", gap: 10, alignItems: "center", marginTop: space[4], backgroundColor: c.apricot, borderRadius: 18, padding: 14, paddingHorizontal: space[4] }}>
          <Mark height={34} color={c.apricotInk} hole={c.apricot} ground={false} />
          <AppText weight="800" color="onPastel" style={{ fontSize: 17, flex: 1 }}>Lovely to meet you, {name}.</AppText>
        </View>
      ) : null}
    </OnbScreen>
  );
}
