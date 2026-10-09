import { Fredoka_500Medium, Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { router, Stack, type Href } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Toast } from "@/components/Toast";
import { startBackup } from "@/state/account";
import { flushEvents, track } from "@/state/events";
import { install, updateInstall } from "@/state/install";
import { watchDay } from "@/state/rollover";
import { Sentry, sentryOn, startSentry } from "@/state/sentry";
import { startBilling } from "@/state/subscription";
import { get, hydrate } from "@/state/store";
import { space, useColors } from "@/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});
startSentry();

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

/** Shown in place of a screen that hit an error, instead of the app closing. The error has been reported (if Sentry is
 *  on); trying again re-renders, and the plan itself is safe on the phone. */
function Fallback({ resetError }: { resetError: () => void }) {
  const c = useColors();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.surface }} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: space[6], gap: space[4] }}>
      <AppText variant="title" accessibilityRole="header">Something went wrong</AppText>
      <AppText color="inkMuted">That screen didn&apos;t load properly. Your plan and everything you&apos;ve logged are safe on this phone.</AppText>
      <Button label="Try again" block onPress={resetError} />
      <Button label="Go to Today" variant="quiet" onPress={() => { resetError(); setTimeout(() => router.replace("/"), 0); }} style={{ alignSelf: "center" }} />
    </ScrollView>
  );
}

function RootLayout() {
  const c = useColors();
  const [loaded, error] = useFonts({ Fredoka_500Medium, Fredoka_600SemiBold, Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stop: (() => void) | undefined, stopBackup: (() => void) | undefined, gone = false;
    hydrate().finally(() => {
      stop = watchDay(); startBilling().catch(() => {}); setReady(true);
      install(get().startedOn).then((i) => {
        if (i.isNew) { track("app_first_open"); updateInstall({ isNew: false }); }
        flushEvents().catch(() => {});
      }).catch(() => {});
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
      <Sentry.ErrorBoundary fallback={({ resetError }) => <Fallback resetError={resetError} />}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.surface } }}>
        <Stack.Screen name="meals/pick" options={SHEET} />
        <Stack.Screen name="meals/add" options={SHEET} />
        <Stack.Screen name="quick-log" options={SHEET} />
        <Stack.Screen name="swap-habit" options={SHEET} />
        <Stack.Screen name="journal/index" options={SHEET} />
      </Stack>
      </Sentry.ErrorBoundary>
      <Toast />
      <NotificationLinks />
    </View>
  );
}

export default sentryOn() ? Sentry.wrap(RootLayout) : RootLayout;
