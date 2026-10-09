// When the free-trial reminder should go off. Kept apart from the notification code so it can be tested.

/** When the trial reminder goes off: 9am local time, two days before the trial ends. App Store sandbox trials (TestFlight)
 *  last minutes, not days, so for a trial shorter than a day the same offset is scaled down: two sevenths of the way
 *  from the end. Null if that moment has passed. */
export function trialReminderAt(until: string, started: string | null, now = Date.now()): Date | null {
  const end = new Date(until).getTime();
  const length = started ? end - new Date(started).getTime() : Infinity;
  let at: Date;
  if (length > 0 && length < 24 * 60 * 60 * 1000) at = new Date(end - (length * 2) / 7);
  else { at = new Date(end - 2 * 24 * 60 * 60 * 1000); at.setHours(9, 0, 0, 0); }
  return at.getTime() > now + 5 * 1000 ? at : null;
}
