import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { APP_PRIVACY, TERMS } from "@landing/content/legal";
import { AppText } from "@/components/AppText";
import { Screen } from "@/components/Screen";
import { Header } from "@/components/ui";
import { space } from "@/theme";

/** The privacy policy or the terms, from the same text as the website's pages. */
export default function Legal() {
  const { doc: id } = useLocalSearchParams<{ doc: string }>();
  const doc = id === "terms" ? TERMS : APP_PRIVACY;
  return (
    <Screen header={<Header fallback="/settings" title={doc.title} />} contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <View style={{ gap: space[2] }}>
        <AppText variant="title" accessibilityRole="header">{doc.title}</AppText>
        <AppText variant="caption" color="inkMuted">Last updated {doc.updated}</AppText>
        <AppText variant="bodyLg">{doc.intro}</AppText>
      </View>
      {doc.sections.map((s) => (
        <View key={s.heading} style={{ gap: space[2] }}>
          <AppText variant="heading">{s.heading}</AppText>
          {s.paras.map((p) => <AppText key={p}>{p}</AppText>)}
        </View>
      ))}
    </Screen>
  );
}
