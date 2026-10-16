// Subscriptions through Apple's in-app purchase on iPhone and Google Play Billing on Android, via RevenueCat. Each
// platform is off until its key is set (EXPO_PUBLIC_REVENUECAT_IOS_KEY, EXPO_PUBLIC_REVENUECAT_ANDROID_KEY, in the EAS
// environment or apps/mobile/.env), so previews and free test builds need nothing. When on, the paywall
// follows onboarding, and if a subscription lapses the person keeps Settings, export and delete: their data is
// always theirs. Two plans, monthly and yearly, each with a 7-day free trial for new subscribers. Products, prices
// and the trials live in App Store Connect and RevenueCat (see docs/payments.md), not here.
import { Linking, Platform } from "react-native";
import Purchases, { INTRO_ELIGIBILITY_STATUS, LOG_LEVEL, PURCHASES_ERROR_CODE, type CustomerInfo, type PurchasesPackage } from "react-native-purchases";
import { introPhrase, period } from "@/data/period";
import { track } from "./events";
import { install, updateInstall } from "./install";
import { lockRemindersWhen, refreshReminders, renewalReminder, trialReminder } from "./reminders";
import { get, set, type AppState } from "./store";

const KEY = (Platform.OS === "ios" ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY : Platform.OS === "android" ? process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY : "") ?? "";
const ANDROID = Platform.OS === "android";
export { STORE_WORDS } from "./storeWords";
/** The RevenueCat entitlement that unlocks the plan. */
export const ENTITLEMENT = "plan";

/** Billing is on with a key, on iPhone and Android. */
export const billingEnabled = () => !!KEY && (Platform.OS === "ios" || ANDROID);

/** With billing on, once onboarding is done the plan needs an active subscription. The demo never asks. Without it,
 *  Settings, export, delete, the legal pages and the health check stay open; everything else goes to the paywall. */
export const planLocked = (s: Pick<AppState, "onboarded" | "demo" | "subscription">) => billingEnabled() && s.onboarded && !s.demo && !s.subscription?.active;
lockRemindersWhen(planLocked);

let started = false;
const active = (info: CustomerInfo) => !!info.entitlements.active[ENTITLEMENT];

// App Store prices by product, for the reminders' wording. Looked up once; null if the store can't say.
const prices = new Map<string, string | null>();
async function priceOf(productId: string): Promise<string | null> {
  if (!prices.has(productId)) {
    const found = await Purchases.getProducts([productId]).catch(() => []);
    prices.set(productId, found[0]?.priceString ?? null);
  }
  return prices.get(productId) ?? null;
}

/** Saves what the app needs to know offline and in Settings, and keeps the reminders in step: the trial reminder while a
 *  trial will turn into a subscription, the renewal note while a yearly plan will renew, and the plan's own reminders
 *  only while it's active. Saved quietly: it's a status check, not a change to the plan. */
function remember(info: CustomerInfo, askForReminder = false) {
  const e = info.entitlements.active[ENTITLEMENT];
  const trial = e?.periodType?.toUpperCase() === "TRIAL";
  // Free access granted in RevenueCat's dashboard: no store product, nothing to renew and nothing paid.
  const gift = e?.periodType?.toUpperCase() === "PROMOTIONAL" || e?.store === "PROMOTIONAL";
  const plan = !e || gift ? null : /annual|year/i.test(e.productIdentifier) ? "yearly" : "monthly";
  const ended = !e && !!info.entitlements.all[ENTITLEMENT];
  const before = get().subscription;
  set((s) => { s.subscription = { active: !!e, checkedAt: new Date().toISOString(), plan, trial, gift, until: e?.expirationDate ?? null, willRenew: e?.willRenew ?? false, ended }; }, { quiet: true });
  const wanted = get().settings.trialReminder !== false;
  const trialUntil = e && trial && e.willRenew && wanted ? e.expirationDate : null;
  const renewUntil = e && !trial && plan === "yearly" && e.willRenew ? e.expirationDate : null;
  (e && (trialUntil || renewUntil) ? priceOf(e.productIdentifier) : Promise.resolve(null)).then((price) => Promise.all([
    trialReminder(trialUntil, e?.latestPurchaseDate ?? null, askForReminder, { plan, price }),
    renewalReminder(renewUntil, price),
  ])).catch(() => {});
  // Plan reminders stop while the subscription isn't active and come back when it is.
  if (!!before?.active !== !!e) refreshReminders(get());
  // The first time this install sees a paid (not trial) subscription: after a trial converts, or bought outright.
  if (e && !trial && !gift) install().then((i) => { if (!i.paidSent) { updateInstall({ paidSent: true }); track("subscription_paid", { plan: plan ?? "unknown" }); } }).catch(() => {});
  // Funnel: a paid period rolling on to the next, and a subscription that has ended. Seen as changes on this phone.
  if (e && !trial && !gift && before?.active && !before.trial && before.until && e.expirationDate && e.expirationDate > before.until) track("subscription_renewed", { plan: plan ?? "unknown" });
  if (!e && ended && before?.active) track("subscription_ended", { plan: before.plan ?? "unknown", trial: !!before.trial });
}

/** Connects to RevenueCat once and keeps the saved subscription status up to date. */
export async function startBilling() {
  if (started || !billingEnabled()) return;
  started = true;
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.WARN).catch(() => {});
  Purchases.configure({ apiKey: KEY });
  Purchases.addCustomerInfoUpdateListener((info) => remember(info));
  remember(await Purchases.getCustomerInfo());
}

export interface Plan {
  pkg: PurchasesPackage;
  title: string;
  /** "£69.99", from the App Store, in the person's currency. */
  price: string;
  per: string;
  /** "Billed once a year" or "Billed monthly". */
  billing: string;
  /** "£1.35 a week", for the yearly plan, from the App Store's own per-week price. */
  weekly: string | null;
  /** "7 days" or "1 month", when this person can have a free trial on this plan; null otherwise. */
  trial: string | null;
  /** A paid introductory price this person can have, as a phrase: "£55.99 for your first year". Null otherwise. */
  intro: string | null;
  saving?: string;
  /** From a discount code's offering rather than the usual one. */
  discounted: boolean;
}

/** The plans on offer, yearly first. A trial is only offered to people Apple will give it to (one per Apple ID, per
 *  subscription group); when RevenueCat can't tell, the plain price is shown, as Apple and RevenueCat advise. With a
 *  discount code's offering (`offering`), its discounted plans if RevenueCat has them, otherwise the usual ones. */
export async function plans(offering?: string | null): Promise<Plan[]> {
  // The current offering ("default" in RevenueCat), or the code's: its annual and monthly packages, picked by type
  // rather than by the order the dashboard lists them in, with yearly first.
  const all = await Purchases.getOfferings();
  const coded = offering ? all.all[offering] : undefined;
  const discounted = !!coded && !!(coded.annual || coded.monthly);
  const current = discounted ? coded : all.current;
  const monthlyPkg = current?.monthly ?? undefined;
  const pkgs = [current?.annual, current?.monthly].filter((p): p is PurchasesPackage => !!p);
  if (!pkgs.length) throw Object.assign(new Error("The current offering has no annual or monthly package."), { code: "none" });
  // iPhone: ask RevenueCat who can have the trial. Android: Google Play only offers the free phase to people eligible
  // for it, so a free phase on the default offer is the answer.
  const eligible = ANDROID ? {} as Record<string, { status: INTRO_ELIGIBILITY_STATUS }>
    : await Purchases.checkTrialOrIntroductoryPriceEligibility(pkgs.map((p) => p.product.identifier)).catch(() => ({} as Record<string, { status: INTRO_ELIGIBILITY_STATUS }>));
  return pkgs.map((pkg) => {
      const pr = pkg.product, intro = pr.introPrice;
      const yearly = pkg.packageType === "ANNUAL";
      const saving = yearly && monthlyPkg ? Math.round((1 - pr.price / (monthlyPkg.product.price * 12)) * 100) : 0;
      const free = ANDROID ? pr.defaultOption?.freePhase?.billingPeriod?.iso8601 ?? null : null;
      const introOk = eligible[pr.identifier]?.status === INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_ELIGIBLE;
      const canTrial = ANDROID ? !!free : !!intro && intro.price === 0 && introOk;
      // A paid introductory price (a discount code's offer): Google Play's intro phase, or Apple's when this person can have it.
      const phase = ANDROID ? pr.defaultOption?.introPhase : null;
      const introText = phase ? introPhrase(phase.price.formatted, phase.billingPeriod.iso8601, phase.billingCycleCount ?? 1)
        : !ANDROID && intro && intro.price > 0 && introOk ? introPhrase(intro.priceString, intro.period, intro.cycles) : null;
      return {
        pkg, title: yearly ? "Steadie Yearly" : "Steadie Monthly", price: pr.priceString, per: yearly ? "a year" : "a month",
        billing: yearly ? "Billed once a year" : "Billed monthly",
        weekly: yearly && pr.pricePerWeekString ? `${pr.pricePerWeekString} a week` : null,
        trial: canTrial ? period(ANDROID ? free : intro!.period) : null,
        intro: introText,
        saving: saving > 0 ? `Save ${saving}%` : undefined,
        discounted,
      };
    });
}

/** Why plans didn't load: `text` for everyone, `detail` (the store's own code and message) for testing only. */
export function plansProblem(e: unknown): { text: string; detail: string } {
  const err = e as { code?: string; message?: string; underlyingErrorMessage?: string };
  const code = String(err?.code ?? "");
  const detail = [code && `Code ${code}`, err?.underlyingErrorMessage || err?.message].filter(Boolean).join(": ");
  if (code === PURCHASES_ERROR_CODE.NETWORK_ERROR || code === PURCHASES_ERROR_CODE.OFFLINE_CONNECTION_ERROR) {
    return { text: "Check your connection and try again.", detail };
  }
  if (code === PURCHASES_ERROR_CODE.CONFIGURATION_ERROR || code === "none" || code === PURCHASES_ERROR_CODE.STORE_PROBLEM_ERROR) {
    return { text: `${ANDROID ? "Google Play" : "The App Store"} isn't offering the plans just now. Try again in a little while.`, detail };
  }
  return { text: "Something went wrong loading the plans. Try again in a moment.", detail };
}

/** Buys a plan. Returns false if they backed out, which isn't an error. */
export async function buy(plan: Plan): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(plan.pkg);
    prices.set(plan.pkg.product.identifier, plan.price); // the price they just saw, for the trial reminder
    remember(customerInfo, !!plan.trial); // starting a trial is the moment to ask about the reminder
    if (active(customerInfo)) track(plan.trial ? "trial_started" : "purchase_completed", { plan: plan.pkg.packageType === "ANNUAL" ? "yearly" : "monthly" });
    return active(customerInfo);
  } catch (e) {
    if ((e as { code?: string }).code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return false;
    throw e;
  }
}

export async function restore(): Promise<boolean> {
  const info = await Purchases.restorePurchases();
  remember(info);
  if (active(info)) track("restore_completed");
  return active(info);
}

/** Offer codes, made in App Store Connect or the Play Console (see docs/payments.md). Apple doesn't let apps unlock
 *  anything with codes of their own, so the code is typed into the store's own screen: Apple's redemption sheet on
 *  iPhone, Google Play's redeem page on Android. A redeemed code arrives like any purchase, through the customer info
 *  listener (on Android when the app comes back to the front), and unlocks the plan. */
export async function redeemCode() {
  track("offer_code_opened");
  if (ANDROID) { await Linking.openURL("https://play.google.com/redeem"); return; }
  await Purchases.presentCodeRedemptionSheet();
}

/** This phone's subscription ID in RevenueCat, so support can find it or give someone free access. */
export const subscriberId = () => Purchases.getAppUserID();

/** The store's own screen for changing plan or cancelling: Apple's sheet on iPhone, Google Play's subscriptions page
 *  for Steadie on Android. */
export async function manageSubscription() {
  if (ANDROID) {
    const url = (await Purchases.getCustomerInfo().catch(() => null))?.managementURL;
    await Linking.openURL(url || "https://play.google.com/store/account/subscriptions?package=com.getsteadieapp.app");
    return;
  }
  try { await Purchases.showManageSubscriptions(); }
  catch { await Linking.openURL("https://apps.apple.com/account/subscriptions"); }
}
