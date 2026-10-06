import { Fredoka_500Medium, Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Toast } from "@/components/Toast";
import { hydrate } from "@/state/store";
import { useColors } from "@/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});

// Sheets open over the screen they belong to.
const SHEET = { presentation: "modal" as const };

export default function RootLayout() {
  const c = useColors();
  const [loaded, error] = useFonts({ Fredoka_500Medium, Fredoka_600SemiBold, Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold });
  const [ready, setReady] = useState(false);

  useEffect(() => { hydrate().finally(() => setReady(true)); }, []);
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
      </Stack>
      <Toast />
    </View>
  );
}
