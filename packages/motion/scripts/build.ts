// Writes svg/<id>.svg for every exercise, a poster still per exercise, svg/index.json (the catalogue the apps read)
// and gallery.html for reviewing the whole library in a browser.
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ALIASES, EXERCISES, PATTERNS } from "../src/exercises.ts";
import { cycleLength } from "../src/rig.ts";
import { renderStill, renderSvg } from "../src/svg.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "svg");
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "still"), { recursive: true });

let bytes = 0;
const catalogue = EXERCISES.map((e) => {
  const svg = renderSvg(e.keys, e.props, { title: e.name });
  bytes += svg.length;
  writeFileSync(join(out, `${e.id}.svg`), svg);
  // The poster is the first keyframe: the starting position, which is also what reduced motion shows.
  writeFileSync(join(out, "still", `${e.id}.svg`), renderStill(e.keys, e.props, 0, e.name));
  return { id: e.id, name: e.name, pattern: e.pattern, level: e.level, equipment: e.equipment, cue: e.cue, seconds: Math.round(cycleLength(e.keys) * 10) / 10 };
});
writeFileSync(join(out, "index.json"), JSON.stringify({ patterns: PATTERNS, aliases: ALIASES, exercises: catalogue }, null, 2) + "\n");

const card = (e: (typeof catalogue)[number]) =>
  `<figure><img src="svg/${e.id}.svg" alt="" loading="lazy"><figcaption><b>${e.level === 0 ? "Seated" : `Level ${e.level}`}</b> ${e.name}<small>${e.cue}</small></figcaption></figure>`;
const sections = PATTERNS.map((p) => {
  const items = catalogue.filter((e) => e.pattern === p.id).sort((a, b) => a.level - b.level);
  return `<section><h2>${p.name}</h2><div class="grid">${items.map(card).join("")}</div></section>`;
}).join("");
writeFileSync(join(root, "gallery.html"), `<!doctype html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Movement library</title>
<style>body{margin:0;padding:24px 16px;font:15px/1.4 system-ui,sans-serif;background:#FBF8F3;color:#2B2433}h1{font-weight:600}h2{margin:32px 0 12px;font-weight:600}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}figure{margin:0;background:#fff;border-radius:16px;overflow:hidden}
img{display:block;width:100%;background:#E7F0F7}figcaption{padding:10px 12px}b{display:block;font-size:12px;color:#5A4A8E}small{display:block;color:#6B6375;margin-top:4px}</style>
<h1>Movement library</h1><p>${catalogue.length} looped animations across ${PATTERNS.length} patterns.</p>${sections}</html>\n`);
console.log(`${catalogue.length} animations, ${(bytes / 1024).toFixed(0)} KB of SVG (${(bytes / catalogue.length / 1024).toFixed(1)} KB each on average)`);
