// Accounts for the Steadie app, with Better Auth on the website's server. People sign in with a six-digit code sent
// by email, or with Apple on iPhone. The app sends its session as a bearer token (the `bearer` plugin), so the same
// code works on iPhone, Android and the web preview. Needs BETTER_AUTH_SECRET (a long random string) and
// BETTER_AUTH_URL (the site's address) in production.
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, emailOTP } from "better-auth/plugins";
import { getDb, schema } from "./db";
import { sendSignInCode } from "./email";

async function create() {
  const db = await getDb();
  const bundle = process.env.APPLE_BUNDLE_ID;
  const reviewCode = process.env.REVIEW_CODE ?? "";
  const review = process.env.REVIEW_EMAIL && /^\d{6}$/.test(reviewCode) ? { email: process.env.REVIEW_EMAIL.toLowerCase(), code: reviewCode } : null;
  const site = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return betterAuth({
    appName: "Steadie",
    baseURL: site,
    secret: process.env.BETTER_AUTH_SECRET || (process.env.VERCEL ? undefined : "local-development-secret-not-for-production"),
    database: drizzleAdapter(db, { provider: "pg", schema }),
    // The app on a phone has no origin; the web preview runs on Expo's dev server.
    // steadie:// is the app; landing:// is its name before the rename, for app versions already out.
    trustedOrigins: [site, "steadie://", "landing://", ...(process.env.VERCEL ? [] : ["http://localhost:8081", "http://localhost:8765"])],
    session: { expiresIn: 60 * 60 * 24 * 90, updateAge: 60 * 60 * 24 },
    user: { deleteUser: { enabled: true } },
    rateLimit: { enabled: true, storage: "database", window: 60, max: 30, customRules: { "/email-otp/send-verification-otp": { window: 60, max: 3 }, "/sign-in/email-otp": { window: 60, max: 6 } } },
    socialProviders: bundle ? {
      // Sign in with Apple from the iPhone app: the app sends Apple's identity token, checked against the bundle ID.
      apple: { clientId: process.env.APPLE_SERVICE_ID || bundle, clientSecret: process.env.APPLE_CLIENT_SECRET || "", appBundleIdentifier: bundle, audience: [bundle] },
    } : {},
    plugins: [
      bearer(),
      emailOTP({
        otpLength: 6,
        expiresIn: 600,
        // App Review can't receive email, so one review address may have a fixed code (both set in Vercel).
        generateOTP: ({ email }) => (review && email.toLowerCase() === review.email ? review.code : undefined),
        sendVerificationOTP: async ({ email, otp }) => {
          if (review && email.toLowerCase() === review.email) return;
          await sendSignInCode(email, otp);
        },
      }),
    ],
  });
}

type Auth = Awaited<ReturnType<typeof create>>;
let auth: Promise<Auth> | undefined;
export const getAuth = () => (auth ??= create());

/** The signed-in user for an API request, from its bearer token, or null. */
export async function userFrom(request: Request) {
  const session = await (await getAuth()).api.getSession({ headers: request.headers });
  return session?.user ?? null;
}
