// Subscriptions through Apple's in-app purchase, via RevenueCat. Off until EXPO_PUBLIC_REVENUECAT_IOS_KEY is set (in
// the EAS environment or apps/mobile/.env), so previews and a free TestFlight beta need nothing. When on, the paywall
// follows onboarding, and if a subscription lapses the person keeps Settings, export and delete: their data is
// always theirs. Products, the free trial and prices live in App Store Connect and RevenueCat, not here.
import { Platform } from "react-native";
import Purchases, { LOG_LEVEL, PURCHASES_ERROR_CODE, type CustomerInfo, type PurchasesPackage } from "react-native-purchases";
import { set } from "./store";

const KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? "";
/** The RevenueCat entitlement that unlocks the plan. */
export const ENTITLEMENT = "plan";

/** Billing is on only with a key, and only on iPhone for now. */
export const billingEnabled = () => !!KEY && Platform.OS === "ios";

let started = false;
const active = (info: CustomerInfo) => !!info.entitlements.active[ENTITLEMENT];
const remember = (info: CustomerInfo) => set((s) => { s.subscription = { active: active(info), checkedAt: new Date().toISOString() }; });

/** Connects to RevenueCat once and keeps the saved subscription status up to date. */
export async function startBilling() {
  if (started || !billingEnabled()) return;
  started = true;
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.WARN).catch(() => {});
  Purchases.configure({ apiKey: KEY });
  Purchases.addCustomerInfoUpdateListener(remember);
  remember(await Purchases.getCustomerInfo());
}

export interface Plan { pkg: PurchasesPackage; title: string; price: string; per: string; trial: string | null; saving?: string }

const PERIOD: Record<string, string> = { D: "day", W: "week", M: "month", Y: "year" };
/** "P2W" → "2 weeks", "P1M" → "1 month". */
function period(iso: string | null | undefined): string {
  const m = iso?.match(/^P(\d+)([DWMY])$/);
  if (!m) return "";
  const n = Number(m[1]), unit = PERIOD[m[2]];
  return `${n} ${unit}${n === 1 ? "" : "s"}`;
}

/** The plans on offer, yearly first, with honest wording for any free trial. */
export async function plans(): Promise<Plan[]> {
  const offerings = await Purchases.getOfferings();
  const pkgs = offerings.current?.availablePackages ?? [];
  const monthly = pkgs.find((p) => p.packageType === "MONTHLY");
  return pkgs
    .filter((p) => p.packageType === "ANNUAL" || p.packageType === "MONTHLY")
    .sort((a) => (a.packageType === "ANNUAL" ? -1 : 1))
    .map((pkg) => {
      const pr = pkg.product, intro = pr.introPrice;
      const yearly = pkg.packageType === "ANNUAL";
      const saving = yearly && monthly ? Math.round((1 - pr.price / (monthly.product.price * 12)) * 100) : 0;
      return {
        pkg, title: yearly ? "Yearly" : "Monthly", price: pr.priceString, per: yearly ? "a year" : "a month",
        trial: intro && intro.price === 0 ? `${period(intro.period)} free, then ${pr.priceString} ${yearly ? "a year" : "a month"}` : null,
        saving: saving > 0 ? `Save ${saving}%` : undefined,
      };
    });
}

/** Buys a plan. Returns false if they backed out, which isn't an error. */
export async function buy(plan: Plan): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(plan.pkg);
    remember(customerInfo);
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
