"use client";

import { useEffect, useRef, useState } from "react";
import { catalogue, mixFor, mount } from "@landing/motion/browser";

/**
 * A live exercise loop from the movement cast. Give it one exercise, or a list to step through; with no `who`, each
 * exercise gets its own person ("Mix it up"). Reduce Motion shows still frames.
 */
export function ExerciseLoop({ ids, who, every = 7, showCaption = false, ground = true }: { ids: string[]; who?: string; every?: number; showCaption?: boolean; ground?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const [index, setIndex] = useState(0);
  const id = ids[index % ids.length];
  const person = who ?? mixFor(id);

  useEffect(() => {
    if (!ref.current) return;
    const ctl = mount(ref.current, { id, who: person, ground });
    return () => ctl.destroy();
  }, [id, person, ground]);

  useEffect(() => {
    if (ids.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setInterval(() => setIndex((i) => i + 1), every * 1000);
    return () => window.clearInterval(timer);
  }, [ids.length, every]);

  const name = catalogue.find((e) => e.id === id)?.name ?? "";
  return (
    <>
      <svg ref={ref} style={{ display: "block", width: "100%", height: "auto", aspectRatio: "260 / 216" }} />
      {showCaption ? <span aria-live="polite" data-caption="">{name}</span> : null}
    </>
  );
}
