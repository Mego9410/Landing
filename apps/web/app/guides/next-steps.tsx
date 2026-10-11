import Link from "next/link";
import type { Guide } from "@/content/guides";
import { liveGuide } from "@/content/guides";
import { toolBySlug } from "../tools/list";
import { guideTopic } from "./end-cta";
import styles from "./guides.module.css";

// Every guide links to its hub and to one tool (growth playbook, "Standards for every page"). The hub is the drug's
// "stopping" guide when the guide is about that drug, else the coming-off pillar; the tool follows the guide's topic.
const HUBS: [RegExp, string][] = [[/mounjaro|tirzepatide/, "stopping-mounjaro"], [/wegovy|ozempic|semaglutide/, "stopping-wegovy"]];

export function GuideNextSteps({ guide }: { guide: Guide }) {
  const text = `${guide.slug} ${guide.title}`.toLowerCase();
  const hubSlug = HUBS.find(([re]) => re.test(text))?.[1] ?? "coming-off-glp-1";
  const hub = hubSlug === guide.slug ? undefined : liveGuide(hubSlug);
  const topic = guideTopic(guide);
  const tool = toolBySlug(topic === "food" || topic === "keeping" || topic === "appetite" || topic === "habits" || topic === "strength" || topic === "occasions" ? "maintenance-calories" : "weight-regain")!;
  return (
    <aside className={styles.nextSteps} aria-label="Next steps">
      <p>Next steps</p>
      <ul>
        <li><Link href={`/tools/${tool.slug}`}>{tool.title}</Link><span>Free tool · {tool.blurb}</span></li>
        {hub ? <li><Link href={`/guides/${hub.slug}`}>{hub.title}</Link><span>The full guide</span></li> : null}
      </ul>
    </aside>
  );
}
