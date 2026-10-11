import Link from "next/link";
import { S } from "@/content/guides/sources";
import { pageMetadata } from "../../site";
import { toolBySlug } from "../list";
import { ToolShell } from "../shell";
import { RegainCalc } from "./calc";

const tool = toolBySlug("weight-regain")!;
export const metadata = { ...pageMetadata(tool.metaTitle, tool.description, `/tools/${tool.slug}`), keywords: tool.keywords };

const FAQS = [
  { q: "Will I put weight back on after stopping Mounjaro?", a: "Many people regain some. In the SURMOUNT-4 trial, people switched from tirzepatide (Mounjaro) to a placebo regained about 14% of their body weight over a year on average, though about one in six regained less than a quarter of what they'd lost." },
  { q: "How much weight do people regain after stopping Wegovy?", a: "In the STEP 1 trial extension, people who stopped semaglutide (Wegovy) had regained about two-thirds of the weight they'd lost within a year, on average." },
  { q: "How fast does weight come back after stopping?", a: "A review of 37 studies in The BMJ found an average regain of about 0.4 kg a month after stopping weight-loss medicines. It varies a lot from person to person." },
  { q: "Can I stop the weight coming back?", a: "Nobody can promise that, but protein at every meal, strength exercise twice a week, regular meals, everyday activity and keeping an eye on your weight trend give you the best chance. NICE says people should be offered at least a year of support after treatment ends." },
];

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      answer={<p>In trials, people who stopped Wegovy regained about two-thirds of the weight they&apos;d lost within a year, and people who stopped Mounjaro regained about 14% of their body weight, on average. Those are averages, not your future. Put in your numbers to see what they mean for you, and what helps.</p>}
      faqs={FAQS}
      sources={[S.step1, S.surmount4, S.surmount4Acc, S.bmjReview, S.oxfordReview, S.niceQs212]}
      body={
        <>
          <section aria-labelledby="why">
            <h2 id="why">Why weight tends to come back</h2>
            <p>GLP-1 medicines quieten appetite and food noise. When they leave your body, hunger usually returns, and a smaller body needs less food to stay steady. That gap is biology, not a lack of effort. More in <Link href="/guides/what-happens-when-you-stop-weight-loss-injections">what happens when you stop</Link>.</p>
          </section>
          <section aria-labelledby="numbers">
            <h2 id="numbers">Where the numbers come from</h2>
            <ul>
              <li><strong>Semaglutide (Wegovy, Ozempic):</strong> the STEP 1 trial extension followed people for a year after they stopped. On average they regained about two-thirds of what they&apos;d lost.</li>
              <li><strong>Tirzepatide (Mounjaro):</strong> in SURMOUNT-4, people who were switched to a placebo regained about 14% of their body weight over the following year. About one in six regained less than a quarter of what they&apos;d lost.</li>
              <li><strong>All weight-loss medicines:</strong> a review of 37 studies in The BMJ found an average regain of about 0.4 kg a month after stopping.</li>
            </ul>
            <p>Trials are averages across thousands of people. Your own result depends on your body, your habits and the support you have.</p>
          </section>
          <section aria-labelledby="helps">
            <h2 id="helps">What helps you hold steady</h2>
            <ul>
              <li><strong>Plan before your last dose</strong>, with your prescriber. See <Link href="/guides/questions-to-ask-before-stopping-weight-loss-injections">questions to ask</Link>.</li>
              <li><strong>Protein at every meal</strong> and <strong>two strength sessions a week</strong> to protect muscle.</li>
              <li><strong>Know your maintenance calories</strong>: try the <Link href="/tools/maintenance-calories">maintenance calorie calculator</Link>.</li>
              <li><strong>Watch your 7-day average</strong> and act early, kindly, if it drifts.</li>
            </ul>
          </section>
        </>
      }
    >
      <RegainCalc />
    </ToolShell>
  );
}
