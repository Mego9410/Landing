// The app's privacy policy and terms, shared by the app (in-app screens) and the website (public pages Apple needs
// for the store listing). DRAFTS for a lawyer to review: anything in [brackets] is a detail to fill in, and the
// wording must match what the app actually does. Plain UK English, like the rest of Landing.

export interface LegalSection { heading: string; paras: string[] }
export interface LegalDoc { title: string; updated: string; intro: string; sections: LegalSection[] }

const COMPANY = "[COMPANY NAME]";
const CONTACT = "[SUPPORT EMAIL]";
const PRIVACY_CONTACT = "[PRIVACY EMAIL]";

export const APP_PRIVACY: LegalDoc = {
  title: "Privacy policy for the Landing app",
  updated: "[DATE]",
  intro: `This policy explains what the Landing app keeps about you, where it's kept and your choices. Landing is made by ${COMPANY}. The short version: what you log stays on your phone.`,
  sections: [
    { heading: "What the app keeps", paras: [
      "Your first name if you give it, your answers in onboarding and the health check, your food preferences, what you log (protein, habits, strength sessions, weigh-ins and daily check-ins), and your settings.",
      "Some of this is health information, which the law treats as special category data. We only keep it because you agree to it when you set the app up.",
    ] },
    { heading: "Where it's kept", paras: [
      "On your phone. The app doesn't have accounts and doesn't send what you log to us or anyone else.",
      "Your phone's own backups (iCloud, if you use it) include the app's data, under Apple's terms.",
    ] },
    { heading: "Apple Health", paras: [
      "If you switch it on, Landing reads your weight and steps from Apple Health and saves weigh-ins you enter there. It only does this with your permission, which you can change at any time in the Health app.",
      "Information from Apple Health is never used for advertising, never sold and never shared.",
    ] },
    { heading: "Subscriptions", paras: [
      "Payments are handled by Apple. We use [RevenueCat] to check whether you have an active subscription. It receives an anonymous ID for your purchase, never what you log.",
    ] },
    { heading: "Reminders", paras: [
      "Reminders are scheduled on your phone. Nothing is sent to us to make them work.",
    ] },
    { heading: "Your choices and rights", paras: [
      "You can export everything the app keeps, or delete it all, in Settings. Deleting it also withdraws your consent.",
      `Because we don't hold your data on our servers, most requests can be done in the app. For anything else, email ${PRIVACY_CONTACT}. You can also complain to the Information Commissioner's Office at ico.org.uk.`,
    ] },
    { heading: "Who can use Landing", paras: ["Landing is for adults aged 18 and over."] },
    { heading: "Changes", paras: ["If this policy changes in a way that matters, the app will tell you before the change applies."] },
    { heading: "Contact", paras: [`${COMPANY} · [REGISTERED ADDRESS] · ICO registration [NUMBER] · ${PRIVACY_CONTACT}`] },
  ],
};

export const TERMS: LegalDoc = {
  title: "Terms of use",
  updated: "[DATE]",
  intro: `These terms are the agreement between you and ${COMPANY} for using the Landing app. Please read them with the health information the app shows when you start.`,
  sections: [
    { heading: "Who it's for", paras: ["You need to be 18 or over and live in the UK to use Landing."] },
    { heading: "What Landing is", paras: [
      "Landing is a general wellness app. Its meal plans, strength sessions, lessons and tips follow general healthy-eating and activity guidance. They aren't medical advice and aren't tailored to your health by a clinician.",
      "Landing never gives advice about weight-loss medicines, doses or stopping them. Those decisions are for your prescriber.",
    ] },
    { heading: "Looking after yourself", paras: [
      "Answer the health check honestly, and check with your GP, midwife or specialist where the app suggests it. If you choose to carry on after a referral, the app keeps its adjustments on for you, and you agree that you've been told to seek advice first.",
      "Stop any exercise that causes pain, dizziness, chest pain or breathlessness that worries you, and get medical help. In an emergency, call 999.",
      "Recipes, nutrition and allergen information are a guide. Always check food labels, especially if you have an allergy.",
    ] },
    { heading: "Subscriptions", paras: [
      "Some of Landing needs a subscription, bought through the App Store. Prices and any free trial are shown before you buy. A subscription renews automatically until you cancel it in your Apple account settings, at least 24 hours before it renews.",
      "If your subscription ends, what you've logged stays on your phone and you can still export it.",
    ] },
    { heading: "Our responsibility to you", paras: [
      "We work to keep Landing accurate and safe, but we can't promise it will always be available or error-free.",
      "Nothing in these terms limits our liability for death or personal injury caused by our negligence, for fraud, or for anything else that can't be limited by law. Your rights as a consumer are not affected.",
    ] },
    { heading: "Using Landing fairly", paras: ["Please don't copy, resell or misuse the app or its content."] },
    { heading: "Changes", paras: ["We may update these terms. If a change matters, the app will tell you before it applies."] },
    { heading: "The law", paras: ["These terms are governed by the law of England and Wales. If you live elsewhere in the UK, you can also bring a claim in your local courts."] },
    { heading: "Contact", paras: [`${COMPANY} · [REGISTERED ADDRESS] · ${CONTACT}`] },
  ],
};
