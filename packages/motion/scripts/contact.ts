// Contact sheet for reviewing poses: each exercise at 4 points in its loop.
import { writeFileSync } from "node:fs";
import { EXERCISES } from "../src/exercises.ts";
import { CAST } from "../src/cast.ts";
import { cycleLength } from "../src/rig.ts";
import { renderStill } from "../src/svg.ts";
const only = process.argv[2] ? new RegExp(process.argv[2]) : null;
const rows = EXERCISES.filter((e) => !only || only.test(e.id)).map((e, row) => {
  const who = CAST[row % CAST.length].id;
  const T = cycleLength(e.keys);
  const cells = [0, 0.25, 0.5, 0.75].map((f) => `<div class=c>${renderStill(e.keys, e.props, T * f + 0.001, "", who)}</div>`).join("");
  return `<div class=r><b>${e.id}<br>${e.name}</b>${cells}</div>`;
});
writeFileSync(process.argv[3] ?? "/tmp/contact.html", `<style>body{margin:0;font:11px sans-serif}.r{display:flex;align-items:center;border-bottom:1px solid #ddd}b{width:110px;padding:4px}.c{width:200px;background:#EAF2F8;margin:2px}svg{display:block}</style>${rows.join("")}`);
