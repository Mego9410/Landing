// Browser build of the exercise loops: `window.LandingMotion`. Draws any exercise with any cast member, live, into an
// <svg>, so the web and the prototype get the same characters as the app without shipping a file per person.
// Built by scripts/build.ts into dist/landing-motion.js.
import { CAST, castById, castFigure, mixFor } from "./cast.ts";
import { ALIASES, byId, EXERCISES, PATTERNS } from "./exercises.ts";
import { cycleLength, poseAt, solve, type Key } from "./rig.ts";
import { standing } from "./poses.ts";
import { frameShapes, footShadow, ground, VIEWBOX, type Shape } from "./scene.ts";

const r1 = (n: number) => String(Math.round(n * 10) / 10);
function markup(s: Shape): string {
  switch (s.kind) {
    case "line": return `<line x1="${r1(s.x1)}" y1="${r1(s.y1)}" x2="${r1(s.x2)}" y2="${r1(s.y2)}" stroke="${s.stroke}" stroke-width="${s.width}" stroke-linecap="round"/>`;
    case "circle": return `<circle cx="${r1(s.cx)}" cy="${r1(s.cy)}" r="${s.r}" fill="${s.fill}"/>`;
    case "rect": return `<rect x="${r1(s.x)}" y="${r1(s.y)}" width="${r1(s.w)}" height="${r1(s.h)}" rx="${s.rx}" fill="${s.fill}"/>`;
    case "path": return `<path d="${s.d}" fill="${s.fill}"/>`;
  }
}

/** The time of the second keyframe: the far end of the move, for still pictures. */
const endTime = (keys: Key[]) => (keys[0].hold ?? 0.3) + (keys[0].move ?? 1);

/** Inner markup for one frame. `ghost` adds a faint outline of the starting position behind the figure. */
export function frame(id: string, who: string, t: number, ghost = false): string {
  const ex = byId(id);
  if (!ex) return "";
  let out = "";
  if (ghost) {
    const f = castFigure(solve(poseAt(ex.keys, 0)), castById(who));
    out += `<g opacity="0.18" style="filter:grayscale(1)">${[...f.far, ...f.body, ...f.near].map(markup).join("")}</g>`;
  }
  return out + frameShapes(solve(poseAt(ex.keys, t)), ex.props, who).map(markup).join("");
}

const VB = `${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`;
const VB2 = `${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w * 2} ${VIEWBOX.h}`;

/** A complete still <svg> (start position), for thumbnails and posters. */
export function stillSvg(id: string, who: string, t = 0): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" aria-hidden="true">${frame(id, who, t)}</svg>`;
}

/** A cast member standing side-on, for pickers. */
export function portraitSvg(who: string): string {
  const s = solve(standing(118));
  const f = castFigure(s, castById(who));
  const shapes = [...ground(), ...footShadow(s), ...f.far, ...f.body, ...f.near];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="64 14 112 178" aria-hidden="true">${shapes.map(markup).join("")}</svg>`;
}

export interface MountOptions { id: string; who: string; paused?: boolean; still?: boolean; ghost?: boolean; label?: string }

/**
 * Animates an exercise into an <svg> element. Paused or reduced motion holds the start position; `still` shows the
 * start and end positions side by side instead of a loop. Returns update() and destroy().
 */
export function mount(svg: SVGSVGElement, initial: MountOptions) {
  let o = { ...initial };
  let raf = 0, start = 0, elapsed = 0;
  const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  svg.setAttribute("role", "img");
  const draw = (t: number) => {
    const ex = byId(o.id);
    if (!ex) { svg.innerHTML = ""; return; }
    svg.setAttribute("aria-label", o.label ?? `${ex.name}, shown by ${castById(o.who).name}`);
    if (o.still) {
      svg.setAttribute("viewBox", VB2);
      svg.innerHTML = frame(o.id, o.who, 0) + `<g transform="translate(${VIEWBOX.w} 0)">${frame(o.id, o.who, endTime(ex.keys))}</g>`;
    } else {
      svg.setAttribute("viewBox", VB);
      svg.innerHTML = frame(o.id, o.who, t, o.ghost);
    }
  };
  const tick = (now: number) => {
    if (!start) start = now - elapsed * 1000;
    elapsed = (now - start) / 1000;
    draw(elapsed);
    raf = requestAnimationFrame(tick);
  };
  const run = () => {
    cancelAnimationFrame(raf);
    start = 0;
    if (o.paused || o.still || reduce) draw(o.paused ? elapsed : 0);
    else raf = requestAnimationFrame(tick);
  };
  run();
  return {
    update(next: Partial<MountOptions>) {
      if (next.id && next.id !== o.id) elapsed = 0;
      o = { ...o, ...next };
      run();
    },
    destroy() { cancelAnimationFrame(raf); },
  };
}

export const catalogue = EXERCISES.map((e) => ({ id: e.id, name: e.name, pattern: e.pattern, level: e.level, equipment: e.equipment, cue: e.cue, seconds: Math.round(cycleLength(e.keys) * 10) / 10 }));
export const cast = CAST.map((c) => ({ id: c.id, name: c.name, age: c.age }));
export { ALIASES as aliases, mixFor, PATTERNS as patterns };
