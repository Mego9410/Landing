import { Fredoka_500Medium, Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { router, Stack, type Href } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Toast } from "@/components/Toast";
import { startBackup } from "@/state/account";
import { watchDay } from "@/state/rollover";
import { startBilling } from "@/state/subscription";
import { hydrate } from "@/state/store";
import { useColors } from "@/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});

// Sheets open over the screen they belong to.
const SHEET = { presentation: "modal" as const };

/** Opens the screen a tapped notification points to (its `data.url`), whether the tap launched the app or found it open.
 *  Each tap is handled once. */
function NotificationLinks() {
  const last = Notifications.useLastNotificationResponse();
  const handled = useRef<string | null>(null);
  useEffect(() => {
    if (!last || last.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
    const id = `${last.notification.request.identifier}:${last.notification.date}`;
    const url = last.notification.request.content.data?.url;
    if (handled.current === id || typeof url !== "string") return;
    handled.current = id;
    setTimeout(() => router.push(url as Href), 0);
  }, [last]);
  return null;
}

export default function RootLayout() {
  const c = useColors();
  const [loaded, error] = useFonts({ Fredoka_500Medium, Fredoka_600SemiBold, Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stop: (() => void) | undefined, stopBackup: (() => void) | undefined, gone = false;
    hydrate().finally(() => {
      stop = watchDay(); startBilling().catch(() => {}); setReady(true);
      startBackup().then((s) => { if (gone) s(); else stopBackup = s; }).catch(() => {});
    });
    return () => { gone = true; stop?.(); stopBackup?.(); };
  }, []);
  useEffect(() => {
    if ((loaded || error) && ready) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error, ready]);

  if ((!loaded && !error) || !ready) return null;
  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.surface } }}>
        <Stack.Screen name="meals/pick" options={SHEET} />
        <Stack.Screen name="meals/add" options={SHEET} />
        <Stack.Screen name="quick-log" options={SHEET} />
        <Stack.Screen name="swap-habit" options={SHEET} />
        <Stack.Screen name="journal/index" options={SHEET} />
      </Stack>
      <Toast />
      <NotificationLinks />
    </View>
  );
}
