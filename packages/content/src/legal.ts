// The app's privacy policy and terms, shared by the app (in-app screens) and the website (public pages Apple needs
// for the store listing), and the website's own privacy notice. The wording must match what the app actually does: check it whenever data handling changes, along with the
// App Store privacy labels in docs/app-store-privacy.md. Plain UK English, like the rest of Steadie.

export interface LegalSection { heading: string; paras: string[] }
export interface LegalDoc { title: string; updated: string; intro: string; sections: LegalSection[] }

const COMPANY = "Oliver Acton, trading as Steadie";
const CONTACT = "hello@getsteadieapp.com";
const PRIVACY_CONTACT = "hello@getsteadieapp.com";

const UPDATED = "9 October 2026";
// Add these when there are some: they then appear in each document's Contact section.
const ADDRESS = "";
const ICO_NUMBER = "";

const CONTACT_LINE = [COMPANY, ADDRESS].filter(Boolean).join(", ") + "."
  + (ICO_NUMBER ? ` Registered with the Information Commissioner's Office, number ${ICO_NUMBER}.` : "");

export const APP_PRIVACY: LegalDoc = {
  title: "Privacy policy for the Steadie app",
  updated: UPDATED,
  intro: `This policy explains what the Steadie app keeps about you, why, where it's kept, who else is involved and the choices you have. Steadie is made by ${COMPANY} ("we"), who decides how this information is used and is responsible for it. The short version: what you log is kept on your phone and, if you sign in, in a private backup so it comes with you to a new phone. We never sell it, never use it for advertising and never use it to track you.`,
  sections: [
    { heading: "What the app keeps", paras: [
      "About you: your first name if you give it, and whether you've stopped, are stopping or are still taking a weight-loss medicine, and roughly when your last injection was.",
      "Your health check: your answers to the questions about your health (for example heart or joint problems, pregnancy, kidney disease or recent surgery), whether you've checked with your GP, and when you answered.",
      "What you log: weigh-ins, protein, habits, strength sessions, morning check-ins (sleep, hunger, energy, drinking, eating out and similar), lessons read, and the messages you send to the in-app coach.",
      "Your preferences: food preferences, including any diet you follow (for example vegetarian, halal or kosher), allergies, foods you avoid, health conditions that affect food, cooking kit, budget and household size. Some of these can suggest religious beliefs.",
      "Your settings: units, reminders, safe mode, and when you accepted the health information and gave consent.",
      "Your weight, health check answers, medicine status and check-ins are health information, which the law treats as special category data and protects more strictly.",
    ] },
    { heading: "If you sign in", paras: [
      "Signing in is optional. If you do, we also keep your email address (or the private relay address Apple gives us if you use Sign in with Apple and choose to hide your email), an account ID, and when your account was created.",
      "For each sign-in we keep the IP address and device type it came from, to keep your account secure. We keep this until you sign out on that phone or delete your account.",
      "When you ask for a sign-in code, we keep the code for up to 10 minutes, and a short record of recent attempts from your IP address so that nobody can guess codes.",
      "We keep a backup of everything listed under \"What the app keeps\", with when it was last changed, so you can move to a new phone without losing your plan.",
    ] },
    { heading: "Guide emails", paras: [
      "If you're signed in, you can choose to get Steadie's guides by email: two new guides a week and a Sunday digest. They're off unless you turn them on, when you sign in or in Settings.",
      "If you do, we add your email address to our mailing list with Resend, which sends the emails, and keep whether you've unsubscribed. Resend also records whether emails are delivered, opened or clicked, which we only use to check the emails are working and useful. Nothing you log in the app goes into these emails or to the mailing list.",
      "You can stop them at any time with the unsubscribe link in every email or in Settings. If you unsubscribe, we keep your address marked as unsubscribed so we don't email you again. Deleting your account removes it from the list completely.",
    ] },
    { heading: "Why we use it, and the law that allows it", paras: [
      "To build and run your plan, and to back it up and restore it if you sign in. This is needed to provide the app you've asked for (contract). Because it includes health information, we also rely on your explicit consent, which you give in the health check when you set up the app.",
      "To send you sign-in codes and keep your account secure, including limiting repeated attempts. This is needed to provide your account (contract) and is in our legitimate interest in keeping Steadie safe.",
      "To check whether you have an active subscription. This is needed to provide what you've paid for (contract).",
      "To send you guide emails, only if you ask for them (consent). You can withdraw it at any time.",
      "To answer you if you contact us, and to meet our legal obligations.",
      "We don't use your information for advertising, profiling, or to train AI models, and we don't sell it or share it with data brokers. Guide emails are the same for everyone who gets them.",
    ] },
    { heading: "How the health check changes your plan", paras: [
      "Your health check answers change your plan automatically: for example, some answers pause strength sessions until you've checked with your GP, or switch to gentler sessions. This keeps the plan suitable for you; it doesn't have any legal effect on you. If you think an adjustment is wrong, you can redo the health check in Settings or contact us.",
    ] },
    { heading: "Where it's kept", paras: [
      "On your phone, always. If you don't sign in, what you log stays on your phone and isn't sent to us.",
      "If you sign in, your backup and account are kept on servers in London, UK. They're sent over an encrypted connection and stored encrypted. The key that keeps you signed in is kept in your iPhone's Keychain.",
      "Nothing is backed up until you've finished setting up your plan and agreed to Steadie keeping your health information. We record which wording you agreed to and when, alongside your account.",
      "Your phone's own backups (iCloud, if you use it) also include the app's data, under Apple's terms.",
    ] },
    { heading: "Who else is involved", paras: [
      "We use a small number of service providers. They only act on our instructions, are bound by contract to keep your information safe, and can't use it for their own purposes.",
      "Vercel: runs Steadie's server (in London). Neon: the database that holds accounts and backups (in London). Resend: sends sign-in codes, so it receives your email address and the code, and, if you ask for them, guide emails. RevenueCat: checks your subscription; it receives an anonymous ID, your App Store purchase details and basic device information such as the app version and your country, never what you log. Expo: delivers app updates; when the app checks for one, Expo sees your IP address, a random ID for this install and the app version, nothing else.",
      "Apple: handles payments, Sign in with Apple and Apple Health under its own privacy policy.",
      "Resend, RevenueCat and Expo are based in the US. Where they handle your information outside the UK, it's protected by the UK's approved safeguards (the UK Extension to the EU-US Data Privacy Framework or the UK International Data Transfer Addendum).",
      "We'll only share your information with anyone else if the law requires it, for example a court order.",
    ] },
    { heading: "Apple Health", paras: [
      "If you switch it on, Steadie reads your weight and steps from Apple Health and saves weigh-ins you enter there. It only does this with your permission, which you can change at any time in the Health app.",
      "Weigh-ins and steps brought in from Apple Health become part of your plan, so if you've signed in they're included in your backup. They're only used for your own plan.",
      "Information from Apple Health is never used for advertising, never sold and never shared. Steadie doesn't save it to iCloud itself, though your phone's own iCloud backup includes the app's data, as with any app.",
    ] },
    { heading: "Reminders", paras: [
      "Reminders are scheduled on your phone. Nothing is sent to us to make them work, and they never mention your weight.",
    ] },
    { heading: "How long we keep it", paras: [
      "On your phone: until you delete it, sign out or delete the app.",
      "Guide emails: your address stays on the mailing list until you delete your account; if you unsubscribe, it's kept only as unsubscribed so you aren't emailed again.",
      "Your account and backup: until you delete your account. Deleting it removes your account, backup and sign-in records from our database straight away, and from our database's short-term recovery copies within 7 days.",
      "Signing out removes your sign-in from that phone and clears the phone, but keeps your backup so you can sign in again.",
      "If we ever close Steadie, we'll tell you in the app and by email first, and delete what we hold.",
    ] },
    { heading: "Your rights", paras: [
      "You have the right to see what we hold about you, have it corrected, have it deleted, take a copy with you, object to or limit how we use it, and withdraw your consent at any time. Withdrawing consent doesn't affect what we did before.",
      "Most of this is in the app. Settings → Export my data gives you a file of everything the app keeps. You can change your answers and preferences at any time. Settings → Account → Withdraw health consent deletes your backup from our servers and stops backing up, while your plan stays on your phone. Settings → Delete my account (or Sign out and delete my data, if you haven't signed in) deletes it all and withdraws your consent.",
      `For anything else, email ${PRIVACY_CONTACT}. We'll reply within one month. If you're unhappy with how we've handled your information, you can complain to the Information Commissioner's Office at ico.org.uk or on 0303 123 1113, though we'd like the chance to put it right first.`,
    ] },
    { heading: "Keeping it safe", paras: [
      "We use encryption in transit and at rest, sign-in codes instead of passwords, limits on repeated attempts, and access to the database for only the people who need it to run Steadie. If something ever goes wrong that puts your information at risk, we'll tell you and the ICO as the law requires.",
    ] },
    { heading: "Who can use Steadie", paras: ["Steadie is for adults aged 18 and over. We don't knowingly hold information about anyone younger."] },
    { heading: "Changes to this policy", paras: ["If this policy changes in a way that matters, the app will tell you before the change applies, and ask for your consent again if we need it."] },
    { heading: "Contact", paras: [`${CONTACT_LINE} Email ${PRIVACY_CONTACT}.`] },
  ],
};

/** The website's own notice: what the site does and doesn't collect, and the pre-launch waitlist. */
export const SITE_PRIVACY: LegalDoc = {
  title: "Privacy notice for this website",
  updated: UPDATED,
  intro: `This notice covers the Steadie website. ${COMPANY} ("we") is responsible for it. The app has its own privacy policy.`,
  sections: [
    { heading: "Browsing the website", paras: [
      "The website doesn't use cookies, analytics or advertising trackers, and doesn't ask you for any details. Our hosting provider, Vercel, keeps standard server logs (such as IP address, browser and the page requested) for a short time to keep the site running and secure.",
      "Download links take you to Apple's App Store, which has its own privacy policy.",
    ] },
    { heading: "If you joined our waitlist", paras: [
      "Before launch, people could join a waitlist with their email address, the date they gave consent and, if they chose, where they were with their weight-loss medicine (stopped, stopping soon or still on it). That last answer is health information, kept only with explicit consent.",
      "We only use the list to email you once to say Steadie is available. We delete it within 6 months of launch, or sooner if you unsubscribe or ask us to. It's held by Neon in London, and our email provider Resend sends on our behalf; Resend is based in the US, with the UK's approved safeguards.",
    ] },
    { heading: "Your rights", paras: [
      `You can ask to see, correct or delete anything we hold about you, or withdraw your consent, at any time by emailing ${PRIVACY_CONTACT}, or by using the unsubscribe link in any email. We'll reply within one month. You can also complain to the Information Commissioner's Office at ico.org.uk or on 0303 123 1113.`,
    ] },
    { heading: "Contact", paras: [`${CONTACT_LINE} Email ${PRIVACY_CONTACT}.`] },
  ],
};

export const TERMS: LegalDoc = {
  title: "Terms of use",
  updated: UPDATED,
  intro: `These terms are the agreement between you and ${COMPANY} for using the Steadie app. Please read them with the health information the app shows when you start.`,
  sections: [
    { heading: "Who it's for", paras: ["You need to be 18 or over and live in the UK to use Steadie."] },
    { heading: "What Steadie is", paras: [
      "Steadie is a general wellness app. Its meal plans, strength sessions, lessons and tips follow general healthy-eating and activity guidance. They aren't medical advice and aren't tailored to your health by a clinician.",
      "Steadie never gives advice about weight-loss medicines, doses or stopping them. Those decisions are for your prescriber.",
    ] },
    { heading: "Looking after yourself", paras: [
      "Answer the health check honestly, and check with your GP, midwife or specialist where the app suggests it. If you choose to carry on after a referral, the app keeps its adjustments on for you, and you agree that you've been told to seek advice first.",
      "Stop any exercise that causes pain, dizziness, chest pain or breathlessness that worries you, and get medical help. In an emergency, call 999.",
      "Recipes, nutrition and allergen information are a guide. Always check food labels, especially if you have an allergy.",
    ] },
    { heading: "Subscriptions", paras: [
      "Steadie needs a subscription, bought through the App Store: monthly or yearly. Prices are shown before you buy and are charged to your Apple account.",
      "Both plans start with a 7-day free trial for new subscribers. If you don't cancel at least 24 hours before the trial ends, the subscription starts and you're charged. The app reminds you two days before, if you allow notifications. You can have one free trial per Apple ID.",
      "A subscription renews automatically at the same price and length until you cancel it in your Apple account settings, at least 24 hours before it renews. Refunds are handled by Apple.",
      "If your subscription ends, what you've logged stays on your phone and in your backup, and you can still export it.",
    ] },
    { heading: "Our responsibility to you", paras: [
      "We work to keep Steadie accurate and safe, but we can't promise it will always be available or error-free.",
      "Nothing in these terms limits our liability for death or personal injury caused by our negligence, for fraud, or for anything else that can't be limited by law. Your rights as a consumer are not affected.",
    ] },
    { heading: "Your account", paras: [
      "An account is optional. If you make one, keep access to your email or Apple ID safe, as that's how you sign in. You can delete your account at any time in Settings.",
    ] },
    { heading: "Using Steadie fairly", paras: ["Please don't copy, resell or misuse the app or its content."] },
    { heading: "Changes", paras: ["We may update these terms. If a change matters, the app will tell you before it applies."] },
    { heading: "The law", paras: ["These terms are governed by the law of England and Wales. If you live elsewhere in the UK, you can also bring a claim in your local courts."] },
    { heading: "Contact", paras: [`${CONTACT_LINE} Email ${CONTACT}.`] },
  ],
};
