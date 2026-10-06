// Every exercise must work with every member of the cast: no exercise belongs to one body. Samples each loop for
// each person and fails if anything can't be drawn or a head or torso goes through the floor.
import { CAST } from "../src/cast.ts";
import { EXERCISES } from "../src/exercises.ts";
import { cycleLength, FLOOR, poseAt, solve } from "../src/rig.ts";
import { frameShapes } from "../src/scene.ts";

/** The y of every absolute point in a path (M, L, C and the end point of A). */
function pathYs(d: string): number[] {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+/g) ?? [];
  const ys: number[] = [];
  let cmd = "", i = 0;
  const n = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) { cmd = tokens[i++]; continue; }
    if (cmd === "M" || cmd === "L") { n(); ys.push(n()); }
    else if (cmd === "C") { for (let k = 0; k < 3; k++) { n(); ys.push(n()); } }
    else if (cmd === "A") { for (let k = 0; k < 5; k++) n(); n(); ys.push(n()); }
    else i++;
  }
  return ys;
}

const problems: string[] = [];
for (const e of EXERCISES) {
  const T = cycleLength(e.keys);
  for (const c of CAST) {
    for (let i = 0; i < 24; i++) {
      const shapes = frameShapes(solve(poseAt(e.keys, (T * i) / 24)), e.props, c.id);
      const bad = shapes.find((s) => JSON.stringify(s).includes("NaN"));
      if (bad) { problems.push(`${e.id} × ${c.name}: ${bad.id} can't be drawn`); break; }
      const ys = shapes.flatMap((s) => (s.kind === "path" ? pathYs(s.d) : []));
      if (Math.max(...ys) > FLOOR + 14) { problems.push(`${e.id} × ${c.name}: drawn below the floor`); break; }
    }
  }
}
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
console.log(`${EXERCISES.length} exercises × ${CAST.length} people: all drawable and above the floor`);
