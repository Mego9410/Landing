// What reminders someone has chosen. Scheduling lives in state/reminders.ts.
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
