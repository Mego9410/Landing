// Gentle reminders, scheduled on the phone (nothing goes to a server): the morning check-in, strength session days,
// and a Sunday nudge to plan next week's meals. All off until someone turns them on in Settings; permission is asked
// then, not on first launch. A free trial also gets one reminder two days before it ends. The wording never mentions weight.
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { sessionsPaused } from "./health";
import type { AppState } from "./store";
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

/** A reminder two days before a free trial ends, so nobody is charged by surprise. `until` null cancels it. Only
 *  schedules if notifications are allowed; `ask` asks for permission first (when someone has just started a trial). */
export async function trialReminder(until: string | null, ask = false) {
  if (!supported) return;
  await Notifications.cancelScheduledNotificationAsync(TRIAL_ID).catch(() => {});
  if (!until) return;
  const when = new Date(new Date(until).getTime() - 2 * 24 * 60 * 60 * 1000);
  if (when.getTime() < Date.now() + 60 * 1000) return;
  const allowed = ask ? await ensurePermission() : (await Notifications.getPermissionsAsync()).granted;
  if (!allowed) return;
  const day = new Date(until).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  await Notifications.scheduleNotificationAsync({
    identifier: TRIAL_ID,
    content: { title: "Your free trial ends in two days", body: `It ends on ${day}. If you're staying, there's nothing to do. If not, you can cancel in Settings.` },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when },
  });
}

/** Replaces whatever is scheduled with the reminders as set now. */
export async function applyReminders(s: AppState) {
  if (!supported) return;
  await cancelPlanReminders();
  const r = s.settings.reminders;
  const { DAILY, WEEKLY } = Notifications.SchedulableTriggerInputTypes;
  if (r.checkIn.on) {
    await Notifications.scheduleNotificationAsync({
      content: { title: "How was yesterday?", body: "A minute of quick questions. Over time they show what helps your days." },
      trigger: { type: DAILY, hour: r.checkIn.hour, minute: r.checkIn.minute },
    });
  }
  if (r.sessions.on && !sessionsPaused(s)) {
    for (const d of r.sessions.days) {
      await Notifications.scheduleNotificationAsync({
        content: { title: "Strength session today", body: "25 minutes at home. The easier version of any move is a tap away." },
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
