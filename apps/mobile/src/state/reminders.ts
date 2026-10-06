// Gentle reminders, scheduled on the phone (nothing goes to a server): the morning check-in, strength session days,
// and a Sunday nudge to plan next week's meals. All off until someone turns them on in Settings; permission is asked
// then, not on first launch. The wording never mentions weight.
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { sessionsPaused } from "./health";
import type { AppState } from "./store";

export interface Reminders {
  checkIn: { on: boolean; hour: number; minute: number };
  sessions: { on: boolean; hour: number; minute: number; /** Monday is 0. */ days: number[] };
  planning: { on: boolean };
}

export const REMINDER_DEFAULTS: Reminders = {
  checkIn: { on: false, hour: 8, minute: 0 },
  sessions: { on: false, hour: 18, minute: 0, days: [1, 4] },
  planning: { on: false },
};

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

export async function cancelReminders() {
  if (supported) await Notifications.cancelAllScheduledNotificationsAsync();
}

/** Replaces whatever is scheduled with the reminders as set now. */
export async function applyReminders(s: AppState) {
  if (!supported) return;
  await cancelReminders();
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
