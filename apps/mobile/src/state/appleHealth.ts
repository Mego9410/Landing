// Apple Health: reads weight and steps, and saves weigh-ins entered in the app. HealthKit needs a development or App
// Store build, so in Expo Go, on the web and on Android the library isn't loaded at all and `available()` is false.
// Weigh-ins someone types in the app always win over Health's for the same day. Nothing from Health is used for
// anything but the person's own trend and check-in.
import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";
import { addDays, isoDate, today } from "@/data/dates";
import { get, set, type Weight } from "./store";

type HK = typeof import("@kingstinct/react-native-healthkit");
let hk: HK | null | undefined;

function lib(): HK | null {
  if (hk !== undefined) return hk;
  hk = null;
  if (Platform.OS !== "ios" || Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return hk;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const m = require("@kingstinct/react-native-healthkit") as HK;
    if (m.isHealthDataAvailable()) hk = m;
  } catch {
    hk = null;
  }
  return hk;
}

const WEIGHT = "HKQuantityTypeIdentifierBodyMass" as const;
const STEPS = "HKQuantityTypeIdentifierStepCount" as const;
const SOURCE = "Apple Health";

/** True when this build on this phone can talk to Apple Health. */
export const available = () => lib() != null;

/** Asks for permission. Apple doesn't say whether reading was allowed, so this only reports that the prompt ran. */
export async function connect(): Promise<boolean> {
  const m = lib();
  if (!m) return false;
  await m.requestAuthorization({ toRead: [WEIGHT, STEPS], toShare: [WEIGHT] });
  set((s) => { s.settings.appleHealth = true; });
  await syncWeights();
  return true;
}

export function disconnect() {
  set((s) => { s.settings.appleHealth = false; });
}

/** Brings in the last four months of weigh-ins: the latest reading on each day. */
export async function syncWeights(): Promise<number> {
  const m = lib();
  if (!m || !get().settings.appleHealth) return 0;
  const samples = await m.queryQuantitySamples(WEIGHT, { limit: 0, unit: "kg", ascending: true, filter: { date: { startDate: new Date(addDays(today(), -120) + "T00:00:00") } } });
  const byDay = new Map<string, number>();
  for (const x of samples) byDay.set(isoDate(new Date(x.endDate)), Math.round(x.quantity * 10) / 10);
  if (!byDay.size) return 0;
  let added = 0;
  set((s) => {
    const mine = new Set(s.weights.filter((w) => w.source !== SOURCE).map((w) => w.date));
    const kept: Weight[] = s.weights.filter((w) => w.source !== SOURCE || !byDay.has(w.date));
    for (const [date, kg] of byDay) if (!mine.has(date)) { kept.push({ date, kg, source: SOURCE }); added++; }
    s.weights = kept.sort((a, b) => (a.date < b.date ? 1 : -1));
  });
  return added;
}

/** Saves a weigh-in typed in the app to Apple Health, if connected. Failures are quiet: the app has it either way. */
export async function saveWeight(kg: number) {
  const m = lib();
  if (!m || !get().settings.appleHealth) return;
  const now = new Date();
  await m.saveQuantitySample(WEIGHT, "kg", kg, now, now).catch(() => undefined);
}

/** Steps on a day, or null if Health isn't connected or has nothing. */
export async function stepsOn(day: string): Promise<number | null> {
  const m = lib();
  if (!m || !get().settings.appleHealth) return null;
  const start = new Date(day + "T00:00:00"), end = new Date(addDays(day, 1) + "T00:00:00");
  const r = await m.queryStatisticsForQuantity(STEPS, ["cumulativeSum"], { unit: "count", filter: { date: { startDate: start, endDate: end } } }).catch(() => null);
  return r?.sumQuantity?.quantity != null ? Math.round(r.sumQuantity.quantity) : null;
}
