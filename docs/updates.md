# App updates (EAS Update)

**The switch to fingerprint runtimes needs a new native build.** Builds up to and including build 6 use the old
runtime (`exposdk:57.0.0`) and only get updates published under it. The next build (1.0.1, with Sentry and the rating
prompt) is the first on a fingerprint runtime. After it's live, publish every update the normal way below; builds 6
and earlier simply stop getting new ones.

## How it's set up

- `expo-updates` is installed. `app.json` → `updates.url` points at the EAS project, `checkAutomatically: ON_LOAD`
  and `fallbackToCacheTimeout: 0`: the app checks every time it opens, downloads in the background and uses the new
  version **from the next cold start**, so nothing changes under someone mid-use.
- `runtimeVersion: { policy: "fingerprint" }`: the runtime is a hash of everything native (packages with native
  code, config plugins, `app.json` except its `extra` section; see `apps/mobile/fingerprint.config.js`). Add or
  upgrade a native package and the runtime changes, so an update can never reach a build that can't run it. EAS
  works out the fingerprint when you build and when you publish.
- Channels (`eas.json`): the **production** build profile is on channel `production` (App Store and TestFlight:
  TestFlight builds are the App Store binaries, so they must be on production). The **preview** profile (internal,
  ad hoc installs) is on channel `preview`. Each channel reads the branch of the same name.
- **Critical updates:** bump `extra.criticalIndex` in `apps/mobile/app.json` (0 → 1 → 2…) in the commit you publish.
  On open, the app sees the new number, downloads the update and restarts into it straight away
  (`src/state/updates.ts`). Use it only for a fix that can't wait for the next cold start (a crash, wrong wording
  about money or health). It doesn't change the runtime, so it reaches everyone on the current build.
- **Crash reports:** `pnpm update:preview` and `pnpm update:production` upload the update's source maps to Sentry
  after publishing, so stack traces are readable (needs `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` and `SENTRY_PROJECT` in
  your shell or CI; if they aren't set, the update still publishes and only the upload step fails).

## Publish: preview, test, then production

From `apps/mobile`, on a clean, pushed commit:

1. **Preview.** `pnpm update:preview` (an EAS Update to the `preview` branch, built with the `preview` environment's
   variables).
2. **Test.** Open a *preview* build (installed from the EAS internal distribution link, `pnpm build:preview` if you
   need a new one) twice: the first open downloads the update, the second runs it. Settings shows `update xxxxxxxx`
   at the bottom: check it matches the update ID on the EAS dashboard. TestFlight builds are on `production`, so they
   won't see preview updates.
3. **Production.** `pnpm update:production`. App Store and TestFlight users get it on their next open, and run it on
   the one after.

Only JavaScript, images and copy can go out this way. Anything that adds or changes a native package, a config
plugin, permissions or `Info.plist` needs a new build (`pnpm build:ios`, which also submits to App Store Connect).

## Roll back

- **Back to the previous update:** `npx eas-cli update:republish --branch production` and pick the last good update
  group (or `--group <id>` from the dashboard). Phones get it as a new update.
- **Back to what's inside the build:** `npx eas-cli update:roll-back-to-embedded --branch production`.
- Either way, if it's urgent, bump `extra.criticalIndex` first so it applies on next open rather than the one after.
- Check on the EAS dashboard (Updates → the branch) that the right group is now the latest for the current runtime.
