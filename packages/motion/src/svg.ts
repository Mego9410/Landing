// Renders an exercise as a self-contained animated SVG. The loop is sampled at a fixed rate, each moving attribute
// is simplified to the fewest keyframes that stay within a fraction of a pixel, and written as SMIL <animate>
// elements, so the file plays anywhere an <img> does, with no script.
import { cycleLength, poseAt, solve, type Key } from "./rig.ts";
import { frameShapes, VIEWBOX, type Prop, type Shape } from "./scene.ts";

const VB = `${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`;

const ATTRS: Record<Shape["kind"], string[]> = { line: ["x1", "y1", "x2", "y2"], circle: ["cx", "cy"], rect: ["x", "y"] };
const SVG_NAME: Record<string, string> = { w: "width", h: "height", r: "r", rx: "rx" };

const r1 = (n: number) => {
  const v = Math.round(n * 10) / 10;
  return Object.is(v, -0) ? "0" : String(v);
};

/** Indices of the samples needed so linear interpolation stays within `tol` of every sample. */
function simplify(v: number[], tol: number): number[] {
  const keep = new Set([0, v.length - 1]);
  const walk = (a: number, b: number) => {
    let worst = -1, err = tol;
    for (let i = a + 1; i < b; i++) {
      const lin = v[a] + ((v[b] - v[a]) * (i - a)) / (b - a);
      const e = Math.abs(v[i] - lin);
      if (e > err) { err = e; worst = i; }
    }
    if (worst >= 0) { keep.add(worst); walk(a, worst); walk(worst, b); }
  };
  walk(0, v.length - 1);
  return [...keep].sort((x, y) => x - y);
}

export function sampleFrames(keys: Key[], props: Prop[], fps = 24): { total: number; frames: Shape[][] } {
  const total = cycleLength(keys);
  const n = Math.max(24, Math.round(total * fps));
  const frames: Shape[][] = [];
  for (let i = 0; i <= n; i++) frames.push(frameShapes(solve(poseAt(keys, (total * i) / n)), props));
  return { total, frames };
}

function attrs(s: Shape): string {
  switch (s.kind) {
    case "line": return `x1="${r1(s.x1)}" y1="${r1(s.y1)}" x2="${r1(s.x2)}" y2="${r1(s.y2)}" stroke="${s.stroke}" stroke-width="${s.width}"`;
    case "circle": return `cx="${r1(s.cx)}" cy="${r1(s.cy)}" r="${s.r}" fill="${s.fill}"`;
    case "rect": return `x="${r1(s.x)}" y="${r1(s.y)}" width="${r1(s.w)}" height="${r1(s.h)}" rx="${s.rx}" fill="${s.fill}"`;
  }
}

export interface RenderOptions { title: string; fps?: number; tolerance?: number; background?: string }

export function renderSvg(keys: Key[], props: Prop[], o: RenderOptions): string {
  const { total, frames } = sampleFrames(keys, props, o.fps ?? 24);
  const n = frames.length - 1;
  const dur = `${r1(total)}s`;
  const first = frames[0];
  const body = first.map((shape, idx) => {
    const anims: string[] = [];
    for (const a of ATTRS[shape.kind]) {
      const series = frames.map((f) => (f[idx] as unknown as Record<string, number>)[a]);
      if (Math.max(...series) - Math.min(...series) < 0.05) continue;
      const kept = simplify(series, o.tolerance ?? 0.3);
      const values = kept.map((i) => r1(series[i])).join(";");
      const times = kept.map((i) => String(Math.round((i / n) * 10000) / 10000)).join(";");
      anims.push(`<animate attributeName="${SVG_NAME[a] ?? a}" dur="${dur}" repeatCount="indefinite" values="${values}" keyTimes="${times}"/>`);
    }
    const tag = shape.kind;
    return anims.length ? `<${tag} ${attrs(shape)}>${anims.join("")}</${tag}>` : `<${tag} ${attrs(shape)}/>`;
  });
  const bg = o.background ? `<rect x="${VIEWBOX.x}" y="${VIEWBOX.y}" width="${VIEWBOX.w}" height="${VIEWBOX.h}" fill="${o.background}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" role="img" aria-label="${esc(o.title)}"><title>${esc(o.title)}</title>${bg}<g stroke-linecap="round">${body.join("")}</g></svg>`;
}

/** A single still frame at time t (used for reduced motion posters and contact sheets). */
export function renderStill(keys: Key[], props: Prop[], t: number, title = ""): string {
  const shapes = frameShapes(solve(poseAt(keys, t)), props);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" role="img" aria-label="${esc(title)}"><g stroke-linecap="round">${shapes.map((s) => `<${s.kind} ${attrs(s)}/>`).join("")}</g></svg>`;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
