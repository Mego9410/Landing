// Builds the browser bundle (dist/landing-motion.js, window.LandingMotion), the catalogue the apps read
// (svg/index.json) and gallery.html, which plays every exercise live with a choice of cast member.
import { build } from "esbuild";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CAST } from "../src/cast.ts";
import { ALIASES, EXERCISES, PATTERNS } from "../src/exercises.ts";
import { cycleLength } from "../src/rig.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

await build({
  entryPoints: [join(root, "src/browser.ts")],
  outfile: join(root, "dist/landing-motion.js"),
  bundle: true,
  format: "iife",
  globalName: "LandingMotion",
  minify: true,
  target: "es2019",
  legalComments: "none",
  logLevel: "warning",
});

rmSync(join(root, "svg"), { recursive: true, force: true });
mkdirSync(join(root, "svg"), { recursive: true });
const catalogue = EXERCISES.map((e) => ({ id: e.id, name: e.name, pattern: e.pattern, level: e.level, equipment: e.equipment, cue: e.cue, seconds: Math.round(cycleLength(e.keys) * 10) / 10 }));
const cast = CAST.map((c) => ({ id: c.id, name: c.name, age: c.age, body: c.body }));
writeFileSync(join(root, "svg/index.json"), JSON.stringify({ cast, patterns: PATTERNS, aliases: ALIASES, exercises: catalogue }, null, 2) + "\n");

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const sections = PATTERNS.map((p) => {
  const items = catalogue.filter((e) => e.pattern === p.id).sort((a, b) => a.level - b.level);
  const cards = items.map((e) => `<figure><svg data-id="${e.id}"></svg><figcaption><b>${e.level === 0 ? "Seated" : `Level ${e.level}`}</b> ${esc(e.name)}<small>${esc(e.cue)}</small></figcaption></figure>`).join("");
  return `<section><h2>${p.name}</h2><div class="grid">${cards}</div></section>`;
}).join("");
const options = [`<option value="mix">Mix it up</option>`, ...CAST.map((c) => `<option value="${c.id}">${c.name}</option>`)].join("");
writeFileSync(join(root, "gallery.html"), `<!doctype html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Movement library</title>
<style>body{margin:0;padding:24px 16px;font:15px/1.4 system-ui,sans-serif;background:#FBF8F4;color:#2E2A33}h1,h2{font-weight:600}h2{margin:32px 0 12px}
label{font-weight:700}select{font:inherit;margin-left:8px;padding:4px 8px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}figure{margin:0;background:#fff;border-radius:16px;overflow:hidden}
svg{display:block;width:100%;aspect-ratio:270/224;background:#CCE2EF}figcaption{padding:10px 12px}b{display:block;font-size:12px;color:#5A4A8E}small{display:block;color:#6A6371;margin-top:4px}</style>
<h1>Movement library</h1><p>${catalogue.length} looped exercises across ${PATTERNS.length} patterns, with ${CAST.length} people to show them.</p>
<label>Shown by<select id="who">${options}</select></label>${sections}
<script src="dist/landing-motion.js"></script>
<script>
var M = window.LandingMotion, who = document.getElementById("who"), live = [], io = null;
function start() {
  live.forEach(function (m) { m.destroy(); });
  live = Array.prototype.map.call(document.querySelectorAll("svg[data-id]"), function (el) {
    var id = el.getAttribute("data-id");
    var m = M.mount(el, { id: id, who: who.value === "mix" ? M.mixFor(id) : who.value, paused: true });
    m.el = el;
    return m;
  });
  // Only animate the cards on screen.
  if (io) io.disconnect();
  io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { live.forEach(function (m) { if (m.el === en.target) m.update({ paused: !en.isIntersecting }); }); });
  });
  live.forEach(function (m) { io.observe(m.el); });
}
who.addEventListener("change", start);
start();
</script></html>
`);
console.log(`dist/landing-motion.js, svg/index.json and gallery.html for ${catalogue.length} exercises and ${CAST.length} people`);
