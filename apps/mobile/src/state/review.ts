// Apple's own rating prompt (SKStoreReviewController, via expo-store-review), shown only after a milestone and never
// on launch or after a hard day. Apple decides whether it actually appears (at most three times a year) and it never
// appears in TestFlight, so nothing here depends on it. Builds from before expo-store-review was added don't have the
// native module: the require is guarded, so an update reaching one of them does nothing rather than crash.
import { Linking, Platform } from "react-native";
import { checkInMilestone, hardDay, mayAsk, type Milestone } from "@/data/review";
import { install, updateInstall } from "./install";
import { get as getState, type JournalEntry } from "./store";

export const APP_STORE_ID = "6820083153";
export const PLAY_PACKAGE = "com.getsteadieapp.app";
/** The store's write-a-review page: the App Store on iPhone, Steadie's Google Play page on Android. */
export const WRITE_REVIEW_URL = Platform.OS === "android"
  ? `https://play.google.com/store/apps/details?id=${PLAY_PACKAGE}&showAllReviews=true`
  : `https://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`;

type StoreReview = { isAvailableAsync(): Promise<boolean>; requestReview(): Promise<void> };
function storeReview(): StoreReview | null {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- loaded lazily so older builds skip it
  try { return require("expo-store-review") as StoreReview; } catch { return null; }
}

/** Asks for a rating after a milestone, if the timing rules allow. `delay` lets the celebration be seen first. */
export async function askForReview(_why: Milestone, delay = 1800) {
  // Apple's prompt on iPhone, Google Play's in-app review on Android (expo-store-review does both).
  if (Platform.OS !== "ios" && Platform.OS !== "android") return;
  const s = getState();
  const inst = await install(s.startedOn);
  if (s.demo || !mayAsk(inst.firstOpenAt, inst.reviewAskedAt)) return;
  const sr = storeReview();
  if (!sr || !(await sr.isAvailableAsync().catch(() => false))) return;
  await new Promise((r) => setTimeout(r, delay));
  await updateInstall({ reviewAskedAt: new Date().toISOString() });
  await sr.requestReview().catch(() => {});
}

/** After a check-in is saved: ask if it reached a milestone and the day wasn't a hard one. */
export function afterCheckIn(day: string, entry: JournalEntry) {
  const s = getState();
  const m = checkInMilestone(s, day);
  if (!m || hardDay(s, day, entry)) return;
  askForReview(m).catch(() => {});
}

/** The store's write-a-review page, from Settings. */
export const openWriteReview = () => Linking.openURL(WRITE_REVIEW_URL);
