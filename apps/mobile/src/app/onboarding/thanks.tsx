import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "@/components/AppText";
import { Button, useBrand } from "@/components/Button";
import { Mark } from "@/components/Mark";
import { readable } from "@/components/Screen";
import { addDays, fmt, isoDate } from "@/data/dates";
import { accountsAvailable, useAccount } from "@/state/account";
import { useApp } from "@/state/store";
import { space, useColors } from "@/theme";

/** 24 · Thank you, after the trial starts: a note from the founder and the trial's dates. */
export default function Thanks() {
  const s = useApp(), c = useColors(), brand = useBrand(), insets = useSafeAreaInsets(), { account } = useAccount();
  const name = s.name.trim(), sub = s.subscription;
  const end = sub?.until ? isoDate(new Date(sub.until)) : null;
  const dates = sub?.trial && end
    ? `Your trial runs until ${fmt.short(end)}.${s.settings.trialReminder !== false ? ` We’ll remind you on ${fmt.short(addDays(end, -2))}.` : ""}`
    : sub?.active && end ? `Your plan renews on ${fmt.short(end)}.` : null;
  const next = () => (accountsAvailable() && !account ? router.replace({ pathname: "/onboarding/account", params: { from: "onboarding" } }) : router.replace("/"));
  return (
    <View style={{ flex: 1, backgroundColor: brand }}>
      <View style={[{ flex: 1, alignItems: "center", justifyContent: "center", gap: 22, paddingHorizontal: 28, paddingTop: insets.top }, readable]}>
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Mark height={130} color="#FBF1E4" hole={brand} /></View>
        <AppText variant="display" accessibilityRole="header" color="onPastel" style={{ textAlign: "center", fontSize: 40, lineHeight: 44 }}>{name ? `You’re all set, ${name}` : "You’re all set"}</AppText>
        <AppText weight="600" color="onPastel" style={{ textAlign: "center", fontSize: 18, lineHeight: 27 }}>Thank you for trusting us with this year. We built Steadie for exactly this moment, and we’re glad you’re here.</AppText>
        <AppText weight="800" color="onPastel" style={{ fontSize: 15 }}>Oliver, founder of Steadie</AppText>
      </View>
      <View style={{ backgroundColor: c.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 22, paddingHorizontal: space[6], paddingBottom: insets.bottom + space[6], gap: 10 }}>
        {dates ? <AppText variant="caption" weight="700" color="inkMuted" style={{ textAlign: "center", fontSize: 14 }}>{dates}</AppText> : null}
        <Button label="Continue" variant="ink" block onPress={next} />
      </View>
    </View>
  );
}
