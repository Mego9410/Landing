// Cooking timers. Each one is an end time (or, paused, the seconds left), so it keeps counting while the person looks
// at another screen, locks the phone or leaves the app. A local notification is scheduled for the end, with sound, so
// it goes off even if the app is closed; in the app, the timer pill and the cook-along screen show it too. Kept on the
// phone (not in the plan or the backup): timers only matter for the next hour or so.
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import { useSyncExternalStore } from "react";
import { Platform, Vibration } from "react-native";
import { ensurePermission } from "./reminders";

export interface Timer {
  id: string;
  label: string;
  /** The recipe it belongs to, so tapping the timer (or its notification) goes back to cooking. */
  recipeId: string;
  recipeName: string;
  step: number;
  total: number;
  /** When it ends (ms), while running. */
  endsAt: number | null;
  /** Seconds left, while paused. */
  left: number;
  done: boolean;
}

const KEY = "steadie.timers.v1";
const supported = Platform.OS === "ios" || Platform.OS === "android";
let timers: Timer[] = [];
const listeners = new Set<() => void>();
const emit = () => { timers = [...timers]; listeners.forEach((l) => l()); AsyncStorage.setItem(KEY, JSON.stringify(timers)).catch(() => {}); };

export function useTimers(): Timer[] {
  return useSyncExternalStore((l) => { listeners.add(l); return () => { listeners.delete(l); }; }, () => timers, () => timers);
}
export const remaining = (t: Timer, now = Date.now()) => (t.endsAt ? Math.max(0, (t.endsAt - now) / 1000) : t.left);

/** Loads timers saved before the app was closed. */
export async function loadTimers() {
  const raw = await AsyncStorage.getItem(KEY).catch(() => null);
  try { timers = raw ? (JSON.parse(raw) as Timer[]) : []; } catch { timers = []; }
  listeners.forEach((l) => l());
  tick();
}

async function schedule(t: Timer) {
  if (!supported || !t.endsAt) return;
  await Notifications.cancelScheduledNotificationAsync(t.id).catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: t.id,
    content: { title: `${t.label}: time’s up`, body: t.recipeName, sound: "default", data: { url: `/meals/cook?id=${encodeURIComponent(t.recipeId)}&step=${t.step}`, kind: "timer" } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(t.endsAt) },
  }).catch(() => {});
}
const unschedule = (id: string) => (supported ? Notifications.cancelScheduledNotificationAsync(id).catch(() => {}) : Promise.resolve());

/** Starts a timer. Asks about notifications the first time, so it can ring with the app in the background. */
export async function startTimer(o: { label: string; seconds: number; recipeId: string; recipeName: string; step: number }) {
  const t: Timer = { id: `timer-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, label: o.label, recipeId: o.recipeId, recipeName: o.recipeName, step: o.step, total: o.seconds, endsAt: Date.now() + o.seconds * 1000, left: o.seconds, done: false };
  timers.push(t);
  emit();
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  if (await ensurePermission().catch(() => false)) await schedule(t);
  return t.id;
}

function update(id: string, fn: (t: Timer) => Timer) {
  timers = timers.map((t) => (t.id === id ? fn(t) : t));
  emit();
  const t = timers.find((x) => x.id === id);
  if (t && t.endsAt && !t.done) schedule(t); else unschedule(id);
}
export const pauseTimer = (id: string) => update(id, (t) => ({ ...t, left: remaining(t), endsAt: null }));
export const resumeTimer = (id: string) => update(id, (t) => ({ ...t, endsAt: Date.now() + t.left * 1000 }));
/** Adds time (a running, paused or finished timer); a finished one starts again with that much. */
export const addTime = (id: string, seconds: number) => update(id, (t) => (t.done
  ? { ...t, done: false, total: seconds, left: seconds, endsAt: Date.now() + seconds * 1000 }
  : t.endsAt ? { ...t, endsAt: t.endsAt + seconds * 1000, total: t.total + seconds } : { ...t, left: t.left + seconds, total: t.total + seconds }));
export function cancelTimer(id: string) { timers = timers.filter((t) => t.id !== id); emit(); unschedule(id); }

/** Marks timers that have run out, with a buzz if the app is open. Run once a second by whatever shows timers. */
export function tick(now = Date.now()) {
  const due = timers.filter((t) => !t.done && t.endsAt && t.endsAt <= now);
  if (!due.length) return;
  timers = timers.map((t) => (due.includes(t) ? { ...t, done: true, left: 0, endsAt: null } : t));
  emit();
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  Vibration.vibrate([0, 400, 200, 400]);
}

// A timer's notification shows (with sound) even while the app is open; other notifications keep the default of not
// interrupting someone who's already in the app.
if (supported) {
  Notifications.setNotificationHandler({
    handleNotification: async (n) => {
      const timer = (n.request.content.data as { kind?: string } | undefined)?.kind === "timer";
      return { shouldShowBanner: timer, shouldShowList: timer, shouldPlaySound: timer, shouldSetBadge: false };
    },
  });
}
