import { View } from "react-native";
import { space } from "@/theme";
import { AppText } from "./AppText";
import { Card } from "./Card";
import { Screen } from "./Screen";

/** A placeholder tab that lists the designs still to port from the prototype. */
export function PortNote({ title, screens }: { title: string; screens: string[] }) {
  return (
    <Screen>
      <AppText variant="title" accessibilityRole="header">{title}</AppText>
      <PortList screens={screens} />
    </Screen>
  );
}

/** Just the list of designs still to port, for a screen that is partly built. */
export function PortList({ screens }: { screens: string[] }) {
  return (
    <Card tone="sunk" style={{ gap: space[3] }}>
      <AppText variant="label" color="inkMuted">TO PORT FROM THE PROTOTYPE</AppText>
      <View style={{ gap: space[2] }}>
        {screens.map((s) => <AppText key={s}>{s}</AppText>)}
      </View>
      <AppText variant="caption" color="inkMuted">See apps/prototype and designs/app-screens for the screens, copy and states.</AppText>
    </Card>
  );
}
