// Light, dark or the phone's own setting. Set app-wide through Appearance, so every useColorScheme (and the status bar,
// keyboard and system sheets) follows the choice. The choice is also kept under its own small key, read before the
// intro plays, so the intro is in the app's colours rather than the phone's. Not on web, which has no native
// appearance to set.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, Platform } from "react-native";
import type { Theme } from "./store";

const KEY = "steadie.theme.v1";

/** The phone's own mode as the app launched, before any choice is applied: what the native launch screen showed. */
export const launchScheme: "light" | "dark" = Appearance.getColorScheme() === "dark" ? "dark" : "light";

function set(theme: Theme | undefined) {
  if (Platform.OS === "web") return;
  try { Appearance.setColorScheme(theme === "light" || theme === "dark" ? theme : "unspecified"); } catch {}
}

/** Applies a choice and remembers it for the next launch. */
export function applyTheme(theme: Theme | undefined) {
  set(theme);
  AsyncStorage.setItem(KEY, theme ?? "system").catch(() => {});
}

/** At launch: applies the saved choice. Gives up after a moment so a slow read never holds the app. */
export async function loadTheme() {
  const saved = await Promise.race([AsyncStorage.getItem(KEY).catch(() => null), new Promise<null>((r) => setTimeout(() => r(null), 400))]);
  if (saved === "light" || saved === "dark") set(saved);
}
