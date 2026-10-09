import Link from "next/link";
import type { ReactNode } from "react";
import { liveGuide, type Block } from "@/content/guides";
import home from "../page.module.css";
import styles from "./guides.module.css";

/** Inline text: [label](href) becomes a link (internal links use next/link) and **text** becomes bold. A link to a
 *  guide that isn't published yet shows as plain text until its day. */
export function Inline({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0, m: RegExpExecArray | null, k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const guide = m[2]?.match(/^\/guides\/([a-z0-9-]+)$/)?.[1];
    if (m[1] && guide && !liveGuide(guide)) out.push(m[1]);
    else if (m[1]) out.push(m[2].startsWith("/") ? <Link key={k++} href={m[2]}>{m[1]}</Link> : <a key={k++} href={m[2]} rel="noopener">{m[1]}</a>);
    else out.push(<strong key={k++}>{m[3]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/** Plain text for structured data and feeds: links and bold markers removed. */
export const plain = (text: string) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (typeof b === "string") return <p key={i}><Inline text={b} /></p>;
        if ("list" in b) {
          const items = b.list.map((t, j) => <li key={j}><Inline text={t} /></li>);
          return b.ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
        }
        return <p key={i} className={`${styles.note} ${home[b.tone ?? "sky"]}`}><Inline text={b.note} /></p>;
      })}
    </>
  );
}

/** A heading's id, for the table of contents. */
export const anchor = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
