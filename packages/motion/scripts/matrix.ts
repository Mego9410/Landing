// Every exercise with every cast member, at the far end of the move: checks that no body clips or reads badly.
import { writeFileSync } from "node:fs";
import { CAST } from "../src/cast.ts";
import { EXERCISES } from "../src/exercises.ts";
import { renderStill } from "../src/svg.ts";
const only = process.argv[2] ? new RegExp(process.argv[2]) : null;
const rows = EXERCISES.filter((e) => !only || only.test(e.id)).map((e) => {
  const t = (e.keys[0].hold ?? 0.3) + (e.keys[0].move ?? 1) + 0.001;
  const cells = CAST.map((c) => `<div class=c>${renderStill(e.keys, e.props, t, "", c.id)}</div>`).join("");
  return `<div class=r><b>${e.id}<br>${e.name}</b>${cells}</div>`;
});
writeFileSync(process.argv[3] ?? "/tmp/matrix.html", `<style>body{margin:0;font:11px sans-serif}.r{display:flex;align-items:center;border-bottom:1px solid #ddd}b{width:96px;padding:4px}.c{width:150px;background:#EAF2F8;margin:2px}svg{display:block}</style>${rows.join("")}`);
