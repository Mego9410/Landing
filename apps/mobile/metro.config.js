// Expo's default Metro set-up, with Sentry's serializer so each bundle carries debug IDs that match its uploaded source
// maps (readable stack traces for builds and EAS Updates).
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

module.exports = getSentryExpoConfig(__dirname);
