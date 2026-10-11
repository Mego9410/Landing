import Link from "next/link";
import { S } from "@/content/guides/sources";
import { pageMetadata } from "../../site";
import { toolBySlug } from "../list";
import { ToolShell } from "../shell";
import { MaintenanceCalc } from "./calc";

const tool = toolBySlug("maintenance-calories")!;
export const metadata = { ...pageMetadata(tool.metaTitle, tool.description, `/tools/${tool.slug}`), keywords: tool.keywords };

const MIFFLIN = { label: "Mifflin et al. A new predictive equation for resting energy expenditure in healthy individuals. American Journal of Clinical Nutrition, 1990", url: "https://pubmed.ncbi.nlm.nih.gov/2305711/" };

const FAQS = [
  { q: "How many calories should I eat after stopping Mounjaro or Wegovy?", a: "Roughly your maintenance calories: the amount that keeps your weight about where it is. This calculator estimates it from your age, height, weight and activity. Treat it as a starting point, and watch your 7-day average weight for a few weeks to see whether it's right for you." },
  { q: "Why is my maintenance lower than before I lost weight?", a: "A smaller body uses less energy, both at rest and when moving. That's why eating the way you did before the jab tends to bring weight back. It isn't a lack of effort; it's physics and biology." },
  { q: "Do I need to count calories?", a: "No. Many people never count. Knowing a rough number can help you judge portions, but protein at each meal, regular meals, plenty of fibre and two strength sessions a week do most of the work." },
  { q: "Is this calculator accurate?", a: "It uses the Mifflin-St Jeor equation, one of the most widely used, but any equation can be around 10% out for one person. That's why it shows a range. Your weight trend over a few weeks is the real test." },
];

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      answer={<p>Your maintenance calories are roughly what keeps your weight steady. Most adults need somewhere between about 1,600 and 2,800 calories a day, depending on size, age, sex and activity. Work out your own estimate below; it takes a minute and nothing is saved.</p>}
      faqs={FAQS}
      sources={[MIFFLIN, S.bdaResource, S.jointAdvisory, S.nhsActivity, S.beat]}
      body={
        <>
          <section aria-labelledby="why">
            <h2 id="why">Why maintenance matters after a GLP-1</h2>
            <p>Medicines like Mounjaro (tirzepatide) and Wegovy (semaglutide) quieten appetite. As they leave your body after your last dose, hunger usually comes back over a few weeks. Your body is also smaller than when you started, so it needs less food to stay where it is.</p>
            <p>Knowing your rough maintenance number helps you spot the gap between the old normal and the new one, before it shows on the scales. Read more about <Link href="/guides/appetite-after-stopping-glp-1">appetite after stopping</Link> and <Link href="/guides/weight-after-stopping-glp-1">weight after stopping</Link>.</p>
          </section>
          <section aria-labelledby="how">
            <h2 id="how">How the calculator works</h2>
            <p>It estimates the energy your body uses at rest with the Mifflin-St Jeor equation, then multiplies it by a standard factor for how active you are. It shows a range of 10% either side, because no equation knows your body exactly.</p>
            <p>It never suggests eating less than maintenance. Whether to lose more weight is a conversation for your GP or prescriber.</p>
          </section>
          <section aria-labelledby="use">
            <h2 id="use">Using the number without counting everything</h2>
            <ul>
              <li><strong>Protein first.</strong> About 25 to 30 g at each meal keeps you fuller and helps protect muscle. See <Link href="/guides/protein-after-glp-1">protein after a GLP-1</Link>.</li>
              <li><strong>Regular meals.</strong> A rough daily rhythm makes hunger easier to predict.</li>
              <li><strong>Strength twice a week.</strong> Muscle helps your body hold steady. See <Link href="/guides/strength-training-after-glp-1">strength training after a GLP-1</Link>.</li>
              <li><strong>Watch the trend, not the day.</strong> A 7-day average weight shows whether your intake is about right.</li>
            </ul>
          </section>
        </>
      }
    >
      <MaintenanceCalc />
    </ToolShell>
  );
}
