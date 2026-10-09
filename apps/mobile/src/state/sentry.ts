// Crash and error reports through Sentry, for App Store and TestFlight builds only: off in development and when
// EXPO_PUBLIC_SENTRY_DSN isn't set (a DSN only lets the app send reports, so it isn't a secret). Nothing personal goes:
// no user, no IP, no request bodies or headers, no screenshots or view hierarchy (they could show health
// information), and anything that looks like an email address is masked. No performance tracing.
import * as Sentry from "@sentry/react-native";
import * as Updates from "expo-updates";

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? "";
export const sentryOn = () => !!DSN && !__DEV__;

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const mask = (s?: string) => s?.replace(EMAIL, "[email]");

/** Strips anything personal from an event before it leaves the phone. */
export function scrub<E extends Sentry.ErrorEvent>(event: E): E {
  delete event.user;
  delete event.server_name;
  if (event.request) event.request = { url: event.request.url?.split("?")[0], method: event.request.method };
  event.message = mask(event.message);
  for (const ex of event.exception?.values ?? []) ex.value = mask(ex.value);
  event.breadcrumbs = (event.breadcrumbs ?? []).map((b) => ({
    ...b,
    message: mask(b.message),
    // Network breadcrumbs keep the address (without query) and status, never bodies.
    data: b.category === "fetch" || b.category === "xhr"
      ? { url: String(b.data?.url ?? "").split("?")[0], method: b.data?.method, status_code: b.data?.status_code }
      : undefined,
  }));
  delete event.extra;
  return event;
}

export function startSentry() {
  if (!sentryOn()) return;
  Sentry.init({
    dsn: DSN,
    environment: Updates.channel || "production",
    dist: Updates.updateId ?? undefined,
    sendDefaultPii: false,
    attachScreenshot: false,
    attachViewHierarchy: false,
    tracesSampleRate: 0,
    beforeSend: (event) => scrub(event),
    beforeBreadcrumb: (b) => (b.category === "console" && b.level !== "error" ? null : b),
  });
}

/** For checking a build reports errors: sends one handled test error. */
export function sendTestError() {
  Sentry.captureException(new Error(`Steadie test error (${new Date().toISOString()})`));
}

export { Sentry };
