// What counts towards the runtime version (runtimeVersion policy "fingerprint" in app.json). Expo's default, plus
// leaving out app.json's `extra` section: it's read by JavaScript only, so bumping `extra.criticalIndex` to mark an
// update as critical (src/state/updates.ts) mustn't change the runtime, or the update would never reach anyone.
// Numbers from @expo/fingerprint's SourceSkips (not a direct dependency here, so it isn't required).
const PackageJsonAndroidAndIosScriptsIfNotContainRun = 1 << 9; // the default
const ExpoConfigExtraSection = 1 << 12;

/** @type {import('@expo/fingerprint').Config} */
module.exports = { sourceSkips: PackageJsonAndroidAndIosScriptsIfNotContainRun | ExpoConfigExtraSection };
