// Run: pnpm --filter @landing/mobile web:phone
// Packs the Expo web export into one HTML file for viewing on a phone: the JS bundle inline, the seven fonts the
// app uses as @font-face rules with data URIs (same family names expo-font registers), and the router started at "/".
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const [dir = "dist", out = "dist/steadie-app.html"] = process.argv.slice(2);
let html = readFileSync(join(dir, "index.html"), "utf8");
if (!/<title>/.test(html)) html = html.replace("</head>", "<title>Steadie app preview</title></head>");
const m = html.match(/<script src="(\/_expo\/static\/js\/web\/entry-[^"]+\.js)" defer><\/script>/);
if (!m) throw new Error("no entry script");
let js = readFileSync(join(dir, m[1]), "utf8").replace(/<\/script/gi, "<\\/script");
const used = ["Fredoka_500Medium", "Fredoka_600SemiBold", "Nunito_400Regular", "Nunito_500Medium", "Nunito_600SemiBold", "Nunito_700Bold", "Nunito_800ExtraBold"];
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const faces = walk(join(dir, "assets")).filter((f) => f.endsWith(".ttf")).map((f) => [f.split("/").pop().split(".")[0], f]).filter(([n]) => used.includes(n))
  .map(([n, f]) => `@font-face{font-family:"${n}";src:url(data:font/ttf;base64,${readFileSync(f).toString("base64")}) format("truetype");font-display:swap}`);
// Drop the pre-rendered rules and preloads that point at /assets, which won't exist where this page is hosted.
html = html.replace(/<style id="expo-generated-fonts">[\s\S]*?<\/style>/, () => `<style id="landing-fonts">${faces.join("")}</style>`)
  .replace(/<link[^>]+\/assets\/[^>]+>/g, "").replace(/<link rel="icon"[^>]*>/g, "");
const boot = `<script>try{if(location.pathname!=="/")history.replaceState(null,"","/"+location.search)}catch(e){}</script>`;
html = html.replace(m[0], () => `${boot}\n<script>\n${js}\n</script>`);
writeFileSync(out, html);
console.log(`${out}: ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(1)} MB, ${faces.length} fonts`);
