import { Redirect, Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";
import { useApp } from "@/state/store";
import { planLocked } from "@/state/subscription";

export default function TabsLayout() {
  const s = useApp();
  // With billing on, the plan needs an active subscription once onboarding is done. The demo never asks. Other screens
  // are checked in the root layout.
  if (planLocked(s)) return <Redirect href="/paywall" />;
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Today" }} />
      <Tabs.Screen name="plan" options={{ title: "Plan" }} />
      <Tabs.Screen name="progress" options={{ title: "Progress" }} />
      <Tabs.Screen name="coach" options={{ title: "Coach" }} />
    </Tabs>
  );
}
