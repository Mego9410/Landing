// The phone's own store, in words: the App Store on iPhone, Google Play on Android. Kept apart from subscription.ts so
// reminders can use it without importing billing.
import { Platform } from "react-native";

const ANDROID = Platform.OS === "android";
export const STORE_WORDS = {
  /** "the App Store" or "Google Play". */
  store: ANDROID ? "Google Play" : "the App Store",
  /** The account a subscription is charged to. */
  account: ANDROID ? "Google account" : "Apple ID",
  /** Where to cancel, as a short phrase. */
  settings: ANDROID ? "the Play Store app" : "your Apple settings",
  /** The full path to cancel. */
  cancelPath: ANDROID ? "the Play Store app › your profile › Payments & subscriptions" : "Settings › your name › Subscriptions",
};
export type StoreWords = typeof STORE_WORDS;
