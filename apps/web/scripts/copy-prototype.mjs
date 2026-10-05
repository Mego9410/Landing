// Runs before `next build` and `next dev`. While prelaunch.json has showPrototype: true, it builds the
// HTML prototype (apps/prototype) and publishes it at /prototype/ on this site. When it's false, it removes
// any copy left in public/, so the prototype can't be reached after launch.
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const { showPrototype } = JSON.parse(readFileSync(join(web, "prelaunch.json"), "utf8"));
const target = join(web, "public", "prototype");

rmSync(target, { recursive: true, force: true });
if (!showPrototype) {
  console.log("prelaunch: prototype hidden (showPrototype is false)");
} else {
  const prototype = join(web, "..", "prototype");
  execFileSync(process.execPath, [join(prototype, "build.mjs")], { stdio: "inherit" });
  mkdirSync(target, { recursive: true });
  copyFileSync(join(prototype, "dist", "index.html"), join(target, "index.html"));
  console.log("prelaunch: prototype published at /prototype/");
}
