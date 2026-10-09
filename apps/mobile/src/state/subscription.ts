// Subscriptions through Apple's in-app purchase, via RevenueCat. Off until EXPO_PUBLIC_REVENUECAT_IOS_KEY is set (in
// the EAS environment or apps/mobile/.env), so previews and a free TestFlight beta need nothing. When on, the paywall
// follows onboarding, and if a subscription lapses the person keeps Settings, export and delete: their data is
// always theirs. Two plans, monthly and yearly, each with a 7-day free trial for new subscribers. Products, prices
// and the trials live in App Store Connect and RevenueCat (see docs/payments.md), not here.
import { Linking, Platform } from "react-native";
import Purchases, { INTRO_ELIGIBILITY_STATUS, LOG_LEVEL, PURCHASES_ERROR_CODE, type CustomerInfo, type PurchasesPackage } from "react-native-purchases";
import { period } from "@/data/period";
import { trialReminder } from "./reminders";
import { set } from "./store";

const KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? "";
/** The RevenueCat entitlement that unlocks the plan. */
export const ENTITLEMENT = "plan";

/** Billing is on only with a key, and only on iPhone for now. */
export const billingEnabled = () => !!KEY && Platform.OS === "ios";

let started = false;
const active = (info: CustomerInfo) => !!info.entitlements.active[ENTITLEMENT];

/** Saves what the app needs to know offline and in Settings, and keeps the trial reminder in step: set while a trial
 *  will turn into a subscription, cancelled once it's paid for or cancelled. */
function remember(info: CustomerInfo, askForReminder = false) {
  const e = info.entitlements.active[ENTITLEMENT];
  const trial = e?.periodType?.toUpperCase() === "TRIAL";
  const plan = !e ? null : /annual|year/i.test(e.productIdentifier) ? "yearly" : "monthly";
  const ended = !e && !!info.entitlements.all[ENTITLEMENT];
  set((s) => { s.subscription = { active: !!e, checkedAt: new Date().toISOString(), plan, trial, until: e?.expirationDate ?? null, willRenew: e?.willRenew ?? false, ended }; });
  trialReminder(e && trial && e.willRenew ? e.expirationDate : null, e?.latestPurchaseDate ?? null, askForReminder).catch(() => {});
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
  /** "7 days", when this person can have a free trial on this plan; null otherwise. */
  trial: string | null;
  saving?: string;
}

/** The plans on offer, yearly first. A trial is only offered to people Apple will give it to (one per Apple ID, per
 *  subscription group); when RevenueCat can't tell, the plain price is shown, as Apple and RevenueCat advise. */
export async function plans(): Promise<Plan[]> {
  // The current offering ("default" in RevenueCat): its annual and monthly packages, picked by type rather than by the
  // order the dashboard lists them in, with yearly first.
  const current = (await Purchases.getOfferings()).current;
  const monthlyPkg = current?.monthly ?? undefined;
  const pkgs = [current?.annual, current?.monthly].filter((p): p is PurchasesPackage => !!p);
  if (!pkgs.length) throw Object.assign(new Error("The current offering has no annual or monthly package."), { code: "none" });
  const eligible = await Purchases.checkTrialOrIntroductoryPriceEligibility(pkgs.map((p) => p.product.identifier)).catch(() => ({} as Record<string, { status: INTRO_ELIGIBILITY_STATUS }>));
  return pkgs.map((pkg) => {
      const pr = pkg.product, intro = pr.introPrice;
      const yearly = pkg.packageType === "ANNUAL";
      const saving = yearly && monthlyPkg ? Math.round((1 - pr.price / (monthlyPkg.product.price * 12)) * 100) : 0;
      const canTrial = !!intro && intro.price === 0 && eligible[pr.identifier]?.status === INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_ELIGIBLE;
      return {
        pkg, title: yearly ? "Steadie Yearly" : "Steadie Monthly", price: pr.priceString, per: yearly ? "a year" : "a month",
        billing: yearly ? "Billed once a year" : "Billed monthly",
        weekly: yearly && pr.pricePerWeekString ? `${pr.pricePerWeekString} a week` : null,
        trial: canTrial ? period(intro!.period) : null,
        saving: saving > 0 ? `Save ${saving}%` : undefined,
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
    return { text: "The App Store isn't offering the plans just now. Try again in a little while.", detail };
  }
  return { text: "Something went wrong loading the plans. Try again in a moment.", detail };
}

/** Buys a plan. Returns false if they backed out, which isn't an error. */
export async function buy(plan: Plan): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(plan.pkg);
    remember(customerInfo, !!plan.trial); // starting a trial is the moment to ask about the reminder
    return active(customerInfo);
  } catch (e) {
    if ((e as { code?: string }).code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return false;
    throw e;
  }
}

export async function restore(): Promise<boolean> {
  const info = await Purchases.restorePurchases();
  remember(info);
  return active(info);
}

/** Apple's own screen for changing plan or cancelling. Falls back to the App Store's subscriptions page. */
export async function manageSubscription() {
  try { await Purchases.showManageSubscriptions(); }
  catch { await Linking.openURL("https://apps.apple.com/account/subscriptions"); }
}
