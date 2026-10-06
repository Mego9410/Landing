// Builds dist/landing-food.js (window.LandingFood) for the prototype, which copies it into src/food.js.
import { build } from "esbuild";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
await build({
  entryPoints: [join(root, "src/browser.ts")],
  outfile: join(root, "dist/landing-food.js"),
  bundle: true,
  format: "iife",
  globalName: "LandingFood",
  minify: true,
  target: "es2019",
  legalComments: "none",
  logLevel: "warning",
});
console.log("dist/landing-food.js");
