import type { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { radius, space, useColors } from "@/theme";
import { AppText } from "./AppText";
import { Icon, type IconName } from "./Icon";

// The props expo-router passes to a custom tab bar.
type BottomTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>["tabBar"]>>[0];

const ICON_FOR: Record<string, IconName> = { index: "today", plan: "plan", progress: "progress", coach: "coach" };

/** The floating four-tab bar: the active tab sits in an apricot pill (lilac for Coach). Labels always show. */
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ position: "absolute", left: space[3], right: space[3], bottom: Math.max(insets.bottom, space[3]), alignItems: "center" }}>
      {/* Full width on iPhone; a centred bar on iPad. */}
      <View style={{ width: "100%", maxWidth: 560, flexDirection: "row", backgroundColor: c.surfaceRaised, borderRadius: radius.xl, paddingTop: space[2], paddingBottom: space[3], paddingHorizontal: space[3],
        shadowColor: "#6b4a30", shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 }}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const label = descriptors[route.key].options.title ?? route.name;
          const pill = focused ? (route.name === "coach" ? c.lilac : c.apricot) : "transparent";
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              onPress={() => {
                const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
              }}
              style={{ flex: 1, alignItems: "center", gap: 2, minHeight: 48 }}>
              <View style={{ width: 56, height: 32, borderRadius: radius.full, backgroundColor: pill, alignItems: "center", justifyContent: "center" }}>
                <Icon name={ICON_FOR[route.name] ?? "today"} size={22} color={focused ? c.onPastel : c.inkMuted} />
              </View>
              <AppText variant="caption" weight="700" color={focused ? "ink" : "inkMuted"} maxFontSizeMultiplier={1.4} numberOfLines={1}>{label}</AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
