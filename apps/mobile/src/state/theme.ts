// Light, dark or the phone's own setting. Set app-wide through Appearance, so every useColorScheme (and the status bar,
// keyboard and system sheets) follows the choice. Not on web, which has no native appearance to set.
import { Appearance, Platform } from "react-native";
import type { Theme } from "./store";

export function applyTheme(theme: Theme | undefined) {
  if (Platform.OS === "web") return;
  try { Appearance.setColorScheme(theme === "light" || theme === "dark" ? theme : "unspecified"); } catch {}
}
