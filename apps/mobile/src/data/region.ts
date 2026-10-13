// UK or US. The app is written once, in UK English; for someone in the US it shows the US words ("shot", "doctor",
// shrimp, zucchini, canned), oven temperatures in Fahrenheit, recipe amounts in ounces and cups, and a US helpline.
// The country comes from the phone's region unless chosen in Settings. Weight units are their own setting.
import { NativeModules, Platform } from "react-native";
import { useSyncExternalStore } from "react";

import { amountFor, localiseFor, type Region } from "./usWords";

export { HELPLINE, type Region } from "./usWords";

/** The phone's region: "us" for a US region (en_US, es_US…), otherwise "uk". */
export function deviceRegion(): Region {
  let tag = "";
  try {
    if (Platform.OS === "ios") {
      const st = NativeModules.SettingsManager?.settings;
      tag = st?.AppleLocale ?? st?.AppleLanguages?.[0] ?? "";
    }
    if (!tag) tag = Intl.DateTimeFormat().resolvedOptions().locale ?? "";
  } catch { /* fall through to the UK */ }
  return /[-_]US\b/i.test(tag) ? "us" : "uk";
}

// The country shown right now, kept outside the plan's state so every piece of text can read it without re-rendering
// on each change to the plan. _layout keeps it in step with the setting.
let current: Region = deviceRegion();
const listeners = new Set<() => void>();
export function setRegion(r: Region) {
  if (r === current) return;
  current = r;
  listeners.forEach((l) => l());
}
export const region = () => current;
export const useRegion = () => useSyncExternalStore((l) => { listeners.add(l); return () => { listeners.delete(l); }; }, () => current, () => current);

/** UK text as someone in the US reads it. Unchanged in the UK. */
export const localise = (text: string, r: Region = current) => localiseFor(text, r);
/** A recipe or shopping amount in US measures (ounces, cups, quarts). Unchanged in the UK. */
export const amount = (text: string, r: Region = current) => amountFor(text, r);
