// Over-the-air updates (expo-updates). The app checks for an update every time it opens and downloads it in the
// background; it's used from the next cold start, so nobody's screen changes under them. An update marked critical
// (its app.json `extra.criticalIndex` is higher than the running one's) is applied straight away instead: the app
// reloads once it has downloaded, before anyone gets far. Never in development or Expo Go.
import Constants from "expo-constants";
import * as Updates from "expo-updates";

const criticalIndexOf = (manifest: unknown): number => {
  const m = manifest as { extra?: { expoClient?: { extra?: { criticalIndex?: unknown } } } } | undefined;
  const v = m?.extra?.expoClient?.extra?.criticalIndex;
  return typeof v === "number" ? v : 0;
};
const running = () => {
  const v = (Constants.expoConfig?.extra as { criticalIndex?: unknown } | undefined)?.criticalIndex;
  return typeof v === "number" ? v : 0;
};

/** Looks for a critical update on open and, if there is one, downloads it and restarts into it. */
export async function applyCriticalUpdate() {
  if (__DEV__ || !Updates.isEnabled) return;
  const check = await Updates.checkForUpdateAsync();
  if (!check.isAvailable || criticalIndexOf(check.manifest) <= running()) return;
  const fetched = await Updates.fetchUpdateAsync();
  if (fetched.isNew) await Updates.reloadAsync();
}
