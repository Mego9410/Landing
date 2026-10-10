// Gentle reminders, scheduled on the phone (nothing goes to a server): the morning check-in, strength session days,
// and a Sunday nudge to plan next week's meals. All off until someone turns them on in Settings; permission is asked
// then, not on first launch. A free trial also gets one reminder two days before it ends. The wording never mentions weight.
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { sessionsPaused } from "./health";
import type { AppState } from "./store";
import { trialReminderAt } from "@/data/trial";
import { checkInSchedule } from "@/data/reminders";
export type { Reminders } from "@/data/reminders";

const supported = Platform.OS === "ios" || Platform.OS === "android";
// expo-notifications counts weekdays from Sunday = 1; ours start at Monday = 0.
const expoWeekday = (mondayZero: number) => ((mondayZero + 1) % 7) + 1;

/** Asks for permission if it hasn't been asked. True if reminders can be shown. */
export async function ensurePermission(): Promise<boolean> {
  if (!supported) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true, allowBadge: false } });
  return asked.granted;
}

/** Cancels everything scheduled, including the trial reminder. */
export async function cancelReminders() {
  if (supported) await Notifications.cancelAllScheduledNotificationsAsync();
}

const TRIAL_ID = "trial-ending";
/** The reminders set in Settings: everything except the trial reminder, which has its own schedule. */
async function cancelPlanReminders() {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(all.filter((n) => n.identifier !== TRIAL_ID).map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)));
}

/** True if notifications can be shown now (no asking). */
export async function notificationsAllowed(): Promise<boolean> {
  if (!supported) return false;
  return (await Notifications.getPermissionsAsync()).granted;
}

/** The trial reminder's wording, also shown on Today when notifications are off. */
export function trialMessage(until: string) {
  const day = new Date(until).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  return { title: "Your free week ends in 2 days", body: `Your Steadie plan continues on ${day}. You can cancel any time in your Apple settings before then.` };
}

/** A reminder two days before a free trial ends, so nobody is charged by surprise. `until` null cancels it; calling it
 *  again replaces it (one fixed identifier), so there's never more than one. Only schedules if notifications are
 *  allowed; `ask` asks for permission first (when someone has just started a trial). Tapping it opens Settings, where the
 *  subscription is managed. */
export async function trialReminder(until: string | null, started: string | null = null, ask = false) {
  if (!supported) return;
  await Notifications.cancelScheduledNotificationAsync(TRIAL_ID).catch(() => {});
  if (!until) return;
  const when = trialReminderAt(until, started);
  if (!when) return;
  const allowed = ask ? await ensurePermission() : await notificationsAllowed();
  if (!allowed) return;
  await Notifications.scheduleNotificationAsync({
    identifier: TRIAL_ID,
    content: { ...trialMessage(until), data: { url: "/settings" } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when },
  });
}

/** Whether notifications have been turned off for Steadie (asked and refused, so only iOS Settings can change it). */
export async function notificationsDenied(): Promise<boolean> {
  if (!supported) return false;
  const p = await Notifications.getPermissionsAsync();
  return !p.granted && !p.canAskAgain;
}

let pending: Promise<void> = Promise.resolve();
/** Reschedules the reminders, one run at a time, so overlapping calls can't leave duplicates. */
export function refreshReminders(s: AppState) {
  pending = pending.then(() => applyReminders(s)).catch(() => {});
  return pending;
}

/** Replaces whatever is scheduled with the reminders as set now. */
export async function applyReminders(s: AppState) {
  if (!supported) return;
  await cancelPlanReminders();
  const r = s.settings.reminders;
  const { DATE, WEEKLY } = Notifications.SchedulableTriggerInputTypes;
  // One dated reminder a day rather than a repeating one, so the wording can change and a day already checked in
  // gets none. Rescheduled whenever the app opens and after each check-in.
  if (r.checkIn.on && s.onboarded) {
    for (const n of checkInSchedule(s, r.checkIn.hour, r.checkIn.minute, new Date())) {
      await Notifications.scheduleNotificationAsync({
        identifier: `check-in-${n.day}`,
        content: { title: n.title, body: n.body, data: { url: "/journal" } },
        trigger: { type: DATE, date: n.at },
      });
    }
  }
  if (r.sessions.on && !sessionsPaused(s)) {
    for (const d of r.sessions.days) {
      await Notifications.scheduleNotificationAsync({
        content: { title: "Strength session today", body: "About 25 minutes. The easier version of any move is a tap away." },
        trigger: { type: WEEKLY, weekday: expoWeekday(d), hour: r.sessions.hour, minute: r.sessions.minute },
      });
    }
  }
  if (r.planning.on) {
    await Notifications.scheduleNotificationAsync({
      content: { title: "Next week's meals", body: "Ten minutes to pick them, then one shopping list for the lot." },
      trigger: { type: WEEKLY, weekday: expoWeekday(6), hour: 17, minute: 0 },
    });
  }
}
