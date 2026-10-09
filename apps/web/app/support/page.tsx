import Link from "next/link";
import home from "../page.module.css";
import styles from "../guides/guides.module.css";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { abs, CONTACT_EMAIL, ldJson, ORGANIZATION, pageMetadata } from "../site";

// Help with the app: contact, subscriptions, restoring, deleting and exporting. App Store Connect's Support URL points
// here. Keep the steps in step with the app's Settings screen (apps/mobile/src/app/settings/index.tsx).
export const metadata = pageMetadata("Support", "Help with Steadie: contact us, manage or cancel your subscription, restore purchases, export your data or delete your account.", "/support");

const FAQ = [
  { q: "How do I cancel my subscription?", a: "On your iPhone, open Settings, tap your name, then Subscriptions, choose Steadie and tap Cancel Subscription. Cancel at least 24 hours before your trial ends or your plan renews." },
  { q: "How do I get my subscription back on a new phone?", a: "Open Steadie, go to Settings, then Subscription, and tap Restore purchases. Use the same Apple ID you subscribed with." },
  { q: "How do I delete my account?", a: "In Steadie, go to Settings, then Account, and tap Delete my account. It deletes your account and backup on our servers and clears your phone." },
  { q: "How do I get a copy of my data?", a: "In Steadie, go to Settings, then Your data, and tap Export my data." },
];

export default function Support() {
  const ld = {
    "@context": "https://schema.org",
    "@graph": [ORGANIZATION, { "@type": "FAQPage", url: abs("/support"), mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }],
  };
  return (
    <>
      <SiteHeader page="support" />
      <main className={styles.page}>
        <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
        <div className={home.wrap}>
          <article className={styles.body}>
            <p className={styles.kicker}>Support</p>
            <h1 className={styles.title}>How can we help?</h1>
            <p>Most things can be done in the app, in <strong>Settings</strong>. If you&apos;re stuck, email us and a person will reply.</p>

            <h2>Contact us</h2>
            <p>Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We usually reply within 2 working days. We can&apos;t give medical advice or advice about medication: please talk to your GP, pharmacist or prescriber about those, and in an emergency call 999.</p>

            <h2>Manage or cancel your subscription</h2>
            <p>Subscriptions are handled by Apple, so you manage them in your Apple account:</p>
            <ol>
              <li>On your iPhone, open <strong>Settings</strong>.</li>
              <li>Tap your name, then <strong>Subscriptions</strong>.</li>
              <li>Choose <strong>Steadie</strong>, then change your plan or tap <strong>Cancel Subscription</strong>.</li>
            </ol>
            <p>Or go to <a href="https://apps.apple.com/account/subscriptions" rel="noopener">apps.apple.com/account/subscriptions</a>. In Steadie, <strong>Settings → Subscription → Manage subscription</strong> opens the same page. Cancel at least 24 hours before your free trial ends or your plan renews. Refunds are handled by Apple at <a href="https://reportaproblem.apple.com" rel="noopener">reportaproblem.apple.com</a>.</p>

            <h2>Restore purchases</h2>
            <p>New phone, or reinstalled the app? Open Steadie, go to <strong>Settings → Subscription</strong> and tap <strong>Restore purchases</strong> (it&apos;s also on the subscription screen). Use the Apple ID you subscribed with.</p>

            <h2>Move your plan to a new phone</h2>
            <p>If you signed in, your plan is backed up. On the new phone, choose <strong>I already have an account</strong> on the welcome screen and sign in with the same Apple ID or email.</p>

            <h2>Export your data</h2>
            <p>Go to <strong>Settings → Your data → Export my data</strong> for a file of everything the app keeps.</p>

            <h2>Delete your account and data</h2>
            <ul>
              <li><strong>Signed in:</strong> <strong>Settings → Account → Delete my account</strong> deletes your account and backup on our servers, then clears your phone.</li>
              <li><strong>Not signed in:</strong> <strong>Settings → Account → Sign out and delete my data</strong> clears everything from your phone.</li>
              <li>To keep using the app but stop backing up your health information, use <strong>Settings → Account → Withdraw health consent</strong>.</li>
            </ul>
            <p>Deleting your data doesn&apos;t cancel a subscription: cancel that in your Apple account, as above.</p>

            <h2>More</h2>
            <p>See the <Link href="/#faqs">FAQs</Link>, our <Link href="/app-privacy">app privacy policy</Link>, the <Link href="/privacy">website privacy notice</Link> and the <Link href="/terms">terms of use</Link>.</p>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
