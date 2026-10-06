// The movement cast: six adults drawn from the brand's shapes (tapered pill limbs, a soft torso with a real profile,
// a round head in profile with no eyes or mouth), each with their own body shape, skin, hair and kit. Any of them can
// be drawn on any solved skeleton, so one set of exercise keyframes animates the whole cast.
// Designs: the "Landing movement cast" canvas in Claude Design.
import { FLOOR, type Pt, type Skeleton } from "./rig.ts";

export type CastId = "maya" | "dev" | "sue" | "amira" | "tom" | "grace";
type BodyId = "slim" | "mid" | "full" | "fuller";
type Style = "bun" | "cropBeard" | "grey" | "hijab" | "receding" | "afro";

export interface CastMember {
  id: CastId; name: string; age: number; body: BodyId; skin: string; hair: string; style: Style;
  top: string; bottom: string; sleeve: "short" | "long"; watch?: boolean; extra?: "hairTie" | "glasses" | "headband";
  /** Width scale: taller, broader people draw slightly wider. */
  s: number;
}

export const CAST: CastMember[] = [
  { id: "maya", name: "Maya", age: 38, s: 0.98, body: "mid", skin: "#B57A52", hair: "#2B1D17", style: "bun", top: "#EFA982", bottom: "#3E4766", sleeve: "short", extra: "hairTie" },
  { id: "dev", name: "Dev", age: 52, s: 1.04, body: "full", skin: "#8A5A3B", hair: "#2A2626", style: "cropBeard", top: "#8FBF9C", bottom: "#4A4452", sleeve: "short", watch: true },
  { id: "sue", name: "Sue", age: 63, s: 0.95, body: "full", skin: "#F1CDB3", hair: "#C9C3BE", style: "grey", top: "#A898D8", bottom: "#3E4766", sleeve: "short", extra: "glasses" },
  { id: "amira", name: "Amira", age: 44, s: 0.97, body: "mid", skin: "#D9A47E", hair: "#5A4A8E", style: "hijab", top: "#E8C76A", bottom: "#4A4452", sleeve: "long" },
  { id: "tom", name: "Tom", age: 47, s: 1.02, body: "slim", skin: "#EDC2A2", hair: "#A55A2E", style: "receding", top: "#7FB0CF", bottom: "#4A4452", sleeve: "short", watch: true },
  { id: "grace", name: "Grace", age: 57, s: 1.0, body: "fuller", skin: "#5E3B28", hair: "#1E1715", style: "afro", top: "#E59A9C", bottom: "#2F6142", sleeve: "short", extra: "headband" },
];
export const castById = (id: string): CastMember => CAST.find((c) => c.id === id) ?? CAST[0];

/** "Mix it up": a different person for each session, stable for that session. */
export function mixFor(key: string): CastId {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return CAST[h % CAST.length].id;
}

// Side-view depths in px: in front of (+) and behind (−) the spine, and limb widths.
const BODIES: Record<BodyId, { hipF: number; seat: number; waistF: number; belly: number; back: number; chest: number; thigh: number; knee: number; ankle: number; upper: number; fore: number }> = {
  slim: { hipF: 11, seat: 14, waistF: 9, belly: 0, back: 9, chest: 12, thigh: 20, knee: 13, ankle: 8.5, upper: 12.5, fore: 10 },
  mid: { hipF: 13, seat: 16, waistF: 11, belly: 3, back: 10, chest: 14, thigh: 23, knee: 14, ankle: 9, upper: 14, fore: 11 },
  full: { hipF: 15, seat: 20, waistF: 13, belly: 10, back: 11, chest: 16, thigh: 27, knee: 16, ankle: 10, upper: 16, fore: 12.5 },
  fuller: { hipF: 17, seat: 24, waistF: 15, belly: 15, back: 12, chest: 18, thigh: 31, knee: 18, ankle: 11, upper: 18, fore: 13.5 },
};

// Hair and headwear in head-local units: radius 15, +x = the face, −y = up.
const HAIR: Record<string, string> = {
  crop: "M10 -9C8 -18 -9 -20 -15 -9C-17 -3 -16 4 -12 9C-10 4 -7 -1 -4 -4C0 -7 5 -7 10 -9Z",
  grey: "M9 -10C7 -17 -8 -19 -14 -9C-16 -4 -15 2 -12 6C-10 2 -6 -2 -3 -5C1 -8 5 -8 9 -10Z",
  receding: "M2 -14C-4 -17 -12 -14 -15 -7C-16 -2 -15 4 -12 8C-10 3 -8 -1 -6 -4C-3 -8 0 -10 2 -14Z",
  bun: "M10 -9C8 -18 -9 -20 -15 -9C-17 -3 -16 4 -12 9C-10 4 -7 -1 -4 -4C0 -7 5 -7 10 -9ZM-19 -14a7 7 0 1 0 14 0a7 7 0 1 0 -14 0Z",
  afro: "M11 -8C11 -22 -6 -27 -16 -18C-24 -12 -24 0 -18 8C-14 13 -10 10 -9 4C-7 -1 -3 -4 1 -6C5 -7 8 -6 11 -8Z",
  hijab: "M11.5 -8C10 -20 -11 -22 -17 -8C-20 0 -19 12 -13 21L6 23C7 15 9 9 10 4C11 0 11.5 -4 11.5 -8Z",
  crop_hi: "M5 -12C0 -16 -8 -15 -12 -9C-8 -12 -2 -13 5 -12Z",
  grey_hi: "M4 -12.5C0 -15.5 -7 -15 -11 -9.5C-7 -12 -2 -13 4 -12.5Z",
  receding_hi: "M-1 -13C-5 -15 -10 -13 -13 -8C-9 -11 -5 -12 -1 -13Z",
  bun_hi: "M5 -12C0 -16 -8 -15 -12 -9C-8 -12 -2 -13 5 -12ZM-16 -18C-14 -20.5 -9.5 -19.5 -8 -17C-10.5 -18.5 -13 -18.5 -16 -18Z",
  afro_hi: "M6 -14C2 -21 -9 -22 -15 -15C-9 -18 -2 -18 6 -14Z",
  hijab_hi: "M9.5 -6C6.5 2 2 10 -4 20L-1 21C4 12 8 4 10.5 -4Z",
  beard: "M-8 -1C-8 9 -2 16 6 16.5C10.5 16.8 13.5 13 14 7.5C9 7 3 4.5 -2 2C-4 1 -6 0 -8 -1Z",
};

export type PathShape = { id: string; kind: "path"; d: string; fill: string };

const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const mul = (v: Pt, k: number): Pt => [v[0] * k, v[1] * k];
const unit = (v: Pt): Pt => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
const perp = (u: Pt): Pt => [-u[1], u[0]];
const f = (n: number) => String(Math.round(n * 10) / 10);
const pt = (p: Pt) => `${f(p[0])} ${f(p[1])}`;

/** A tapered pill from a (radius ra) to b (radius rb). Same command structure for any input, so it tweens. */
export function pill(a: Pt, b: Pt, ra: number, rb: number): string {
  const u = unit(sub(b, a)), n = perp(u);
  return `M${pt(add(a, mul(n, ra)))}L${pt(add(b, mul(n, rb)))}A${f(rb)} ${f(rb)} 0 0 0 ${pt(sub(b, mul(n, rb)))}L${pt(sub(a, mul(n, ra)))}A${f(ra)} ${f(ra)} 0 0 0 ${pt(add(a, mul(n, ra)))}Z`;
}
function circle(c: Pt, r: number): string {
  return `M${pt([c[0] - r, c[1]])}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;
}
/** Rotates (degrees) then moves a path drawn in local units. Handles the commands the cast uses: M L C A Z and a. */
function place(d: string, origin: Pt, deg: number): string {
  const r = (deg * Math.PI) / 180, c = Math.cos(r), sn = Math.sin(r);
  const rot = (x: number, y: number): Pt => [x * c - y * sn, x * sn + y * c];
  const abs = (x: number, y: number) => pt(add(origin, rot(x, y)));
  const tokens = d.match(/[MLCAZa]|-?(?:\d+\.?\d*|\.\d+)/g) ?? [];
  let out = "", i = 0, cmd = "";
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[MLCAZa]/.test(tokens[i])) { cmd = tokens[i++]; out += cmd; if (cmd === "Z") continue; }
    if (cmd === "M" || cmd === "L") out += abs(num(), num()) + " ";
    else if (cmd === "C") out += `${abs(num(), num())} ${abs(num(), num())} ${abs(num(), num())} `;
    else if (cmd === "a" || cmd === "A") {
      const rx = num(), ry = num(), xr = num(), la = num(), sw = num(), x = num(), y = num();
      const end = cmd === "a" ? (() => { const v = rot(x, y); return `${f(v[0])} ${f(v[1])}`; })() : abs(x, y);
      out += `${f(rx)} ${f(ry)} ${f(xr + deg)} ${la} ${sw} ${end} `;
    } else i++;
  }
  return out.trim();
}

/** A smooth closed shape through points. Points below the floor are flattened onto it, so a body lying down rests on
 * the floor instead of sinking into it, whatever its size. */
function blob(raw: Pt[]): string {
  const ps = raw.map((p): Pt => [p[0], Math.min(p[1], FLOOR + 2)]);
  const n = ps.length;
  let out = `M${pt(ps[0])}`;
  for (let i = 0; i < n; i++) {
    const p0 = ps[(i - 1 + n) % n], p1 = ps[i], p2 = ps[(i + 1) % n], p3 = ps[(i + 2) % n];
    out += `C${pt(add(p1, mul(sub(p2, p0), 1 / 6)))} ${pt(sub(p2, mul(sub(p3, p1), 1 / 6)))} ${pt(p2)}`;
  }
  return out + "Z";
}
export function mix(hex: string, to: string, k: number): string {
  const a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16);
  const ch = (sh: number) => Math.round(((a >> sh) & 255) * (1 - k) + ((b >> sh) & 255) * k);
  return "#" + ((1 << 24) + (ch(16) << 16) + (ch(8) << 8) + ch(0)).toString(16).slice(1);
}

const SHADE = "#3A2F45", WHITE = "#FFFFFF";
const LIGHT: Pt = [0.6, -0.8]; // light from the upper front
const HEAD_R = 15, NECK = 7, TORSO = 54;

/** The cast member drawn on a solved skeleton, split into layers: far limbs, body and head, near limbs. */
export function castFigure(s: Skeleton, who: CastMember): { far: PathShape[]; body: PathShape[]; near: PathShape[] } {
  const B = BODIES[who.body], k = who.s;
  const layer: PathShape[] = [];
  let n = 0;
  const push = (d: string, fill: string) => layer.push({ id: `c${n++}`, kind: "path", d, fill });
  const take = () => layer.splice(0, layer.length);

  const shaded = (a: Pt, b: Pt, ra: number, rb: number, color: string) => {
    push(pill(a, b, ra, rb), color);
    const v = sub(b, a), l = Math.hypot(v[0], v[1]) || 1, u: Pt = [v[0] / l, v[1] / l], nn = perp(u);
    const side = nn[0] * LIGHT[0] + nn[1] * LIGHT[1] >= 0 ? 1 : -1;
    push(pill(add(add(a, mul(u, l * 0.12)), mul(nn, side * ra * 0.38)), add(sub(b, mul(u, l * 0.12)), mul(nn, side * rb * 0.38)), ra * 0.36, rb * 0.36), mix(color, WHITE, 0.11));
  };

  const tu = unit(sub(s.neck, s.hip)), tn = perp(tu);
  const at = (t: number, off: number): Pt => add(add(s.hip, mul(tu, TORSO * t)), mul(tn, off));
  const shoulder = s.shoulder;
  const hu = unit(sub(s.head, s.neck)), hf = perp(hu);
  const head = add(s.neck, mul(hu, NECK + HEAD_R));
  head[1] = Math.min(head[1], FLOOR + 2 - HEAD_R); // lying down: the head rests on the floor
  const angle = (Math.atan2(hu[0], -hu[1]) * 180) / Math.PI;

  const leg = (i: number, cf: (c: string) => string) => {
    const g = s.legs[i];
    const fd = unit(sub(g.toe, g.ankle));
    const heel = add(sub(g.ankle, mul(fd, 3)), [0, 0.5]), toe = add(heel, mul(fd, 17 * k));
    shaded(s.hip, g.knee, (B.thigh / 2) * k, (B.knee / 2) * k, cf(who.bottom));
    shaded(g.knee, g.ankle, (B.knee / 2) * k, (B.ankle / 2) * k, cf(who.bottom));
    push(pill(add(heel, [0, 3.4]), add(toe, [0, 3]), 2.2, 2), cf("#CFC3B6"));
    push(pill(heel, toe, 5.6, 4.8), cf("#FBF8F4"));
    push(pill(sub(toe, mul(fd, 4)), toe, 4, 4.2), cf("#EEE7DF"));
    push(pill(add(add(heel, mul(fd, 4)), [0, -1.5]), add(add(heel, mul(fd, 10)), [0, -3.2]), 1.4, 1.4), cf(who.top));
  };
  const arm = (i: number, cf: (c: string) => string, near: boolean) => {
    const a = s.arms[i];
    const fd = unit(sub(a.hand, a.elbow));
    const wrist = sub(a.hand, mul(fd, 4));
    const long = who.sleeve === "long";
    const limb = cf(long ? who.top : who.skin);
    shaded(shoulder, a.elbow, (B.upper / 2) * k, (B.fore / 2) * k * 1.05, limb);
    shaded(a.elbow, wrist, (B.fore / 2) * k, (B.fore / 2) * k * 0.8, limb);
    if (!long) {
      const sl = add(shoulder, mul(sub(a.elbow, shoulder), 0.48));
      push(pill(shoulder, sl, (B.upper / 2) * k + 2.5, (B.upper / 2) * k + 1.5), cf(who.top));
      const sn = perp(unit(sub(sl, shoulder))), r2 = (B.upper / 2) * k + 1.4;
      push(pill(add(sl, mul(sn, r2)), sub(sl, mul(sn, r2)), 1.6, 1.6), cf(mix(who.top, SHADE, 0.18)));
    } else {
      const cn = perp(fd), cr = (B.fore / 2) * k * 0.8, cuff = sub(wrist, mul(fd, 2));
      push(pill(add(cuff, mul(cn, cr)), sub(cuff, mul(cn, cr)), 2, 2), cf(mix(who.top, SHADE, 0.18)));
    }
    if (near && who.watch) {
      const wn = perp(fd), wr = (B.fore / 2) * k * 0.85, w = sub(wrist, mul(fd, 3));
      push(pill(add(w, mul(wn, wr)), sub(w, mul(wn, wr)), 2.3, 2.3), "#2E2A33");
    }
    const fn = perp(fd), thumb = fn[0] * tn[0] + fn[1] * tn[1] >= 0 ? 1 : -1;
    push(pill(wrist, add(wrist, mul(fd, 6.5)), 4.4, 4), cf(who.skin));
    push(pill(add(wrist, add(mul(fd, 1.5), mul(fn, thumb * 3))), add(wrist, add(mul(fd, 4.5), mul(fn, thumb * 5.4))), 1.9, 1.7), cf(mix(who.skin, SHADE, 0.06)));
  };

  const farC = (c: string) => mix(c, SHADE, 0.2), same = (c: string) => c;
  arm(1, farC, false);
  leg(1, farC);
  const far = take();

  const hemF = B.hipF + B.belly * 0.3;
  push(pill(s.neck, add(s.neck, mul(hu, NECK + 4)), 5.8, 5.5), mix(who.skin, SHADE, 0.1));
  push(blob([
    at(-0.08, B.hipF * 0.7), at(0.06, B.hipF), at(0.3, B.waistF + B.belly), at(0.55, B.waistF + B.belly * 0.55), at(0.72, B.chest), at(0.9, B.chest * 0.85), at(1.0, 8),
    at(1.02, -7), at(0.9, -B.back - 1), at(0.6, -B.back * 0.9), at(0.32, -B.back * 0.95), at(0.1, -B.seat), at(-0.1, -B.seat * 0.75), at(-0.16, 0),
  ]), who.bottom);
  push(blob([
    at(0.05, hemF), at(0.3, B.waistF + B.belly), at(0.55, B.waistF + B.belly * 0.55), at(0.72, B.chest), at(0.9, B.chest * 0.85), at(1.0, 8),
    at(1.02, -7), at(0.9, -B.back - 1), at(0.6, -B.back * 0.9), at(0.32, -B.back * 0.95), at(0.05, -B.seat * 0.98), at(0.02, -B.seat * 0.3), at(0.03, hemF * 0.4),
  ]), who.top);
  push(blob([
    at(1.0, -6.5), at(0.9, -B.back - 0.6), at(0.6, -B.back * 0.88), at(0.32, -B.back * 0.92), at(0.07, -B.seat * 0.92),
    at(0.08, -B.seat * 0.45), at(0.4, -B.back * 0.42), at(0.7, -B.back * 0.4), at(0.92, -B.back * 0.35),
  ]), mix(who.top, SHADE, 0.1));
  push(pill(at(0.045, -B.seat * 0.95), at(0.055, hemF - 0.5), 1.8, 1.8), mix(who.top, SHADE, 0.16));
  push(pill(at(0.995, -6), at(0.975, 7.5), 1.9, 1.9), mix(who.top, SHADE, 0.16));
  leg(0, same);

  const T = (d: string) => place(d, head, angle);
  push(circle(head, HEAD_R), who.skin);
  push(circle(add(add(head, mul(hf, HEAD_R - 0.5)), mul(hu, -1.5)), 3.2), who.skin);
  push(T("M2.5 4a3 2.6 0 1 0 6 0a3 2.6 0 1 0 -6 0Z"), mix(who.skin, "#E07A7C", 0.22));
  const style = who.style === "cropBeard" ? "crop" : who.style;
  push(T(HAIR[style]), who.hair);
  push(T(HAIR[`${style}_hi`]), style === "hijab" ? mix(who.hair, SHADE, 0.25) : mix(who.hair, WHITE, 0.22));
  if (who.style === "cropBeard") push(T(HAIR.beard), who.hair);
  if (who.extra === "glasses") { push(T(pill([11.5, -2], [-3, -1.5], 0.8, 0.8)), "#5A4A8E"); push(T(pill([12.6, -4.5], [12.6, 0.5], 1.5, 1.5)), "#5A4A8E"); }
  if (who.extra === "headband") push(T(pill([9, -10], [-7, -19], 2.6, 2.6)), "#F6E5AC");
  if (who.extra === "hairTie") push(T(pill([-10, -10.5], [-12, -13.5], 2.1, 2.1)), "#E59A9C");
  if (who.style !== "hijab") push(circle(add(add(head, mul(hf, -6)), mul(hu, -1.5)), 3.1), mix(who.skin, SHADE, 0.07));
  const body = take();

  arm(0, same, true);
  const near = take();
  return { far, body, near };
}

/** How far the back sits behind the spine, for props worn or held against it (a backpack, a broom handle). */
export function backDepth(who: string): number {
  const c = castById(who);
  return BODIES[c.body].back * c.s;
}

/** A soft shadow under the feet when they're on the floor. */
export function footShadow(s: Skeleton): PathShape[] {
  // Always one shape (zero width when the feet are off the floor) so every frame has the same shapes.
  const low = s.legs.filter((g) => g.ankle[1] > FLOOR - 14);
  const x = low.length ? low.reduce((m, g) => m + g.ankle[0], 0) / low.length + 6 : s.hip[0];
  const r = low.length ? 28 : 0.1;
  return [{ id: "shadow", kind: "path", d: `M${f(x - r)} ${FLOOR + 1}a${f(r)} 3.5 0 1 0 ${f(2 * r)} 0a${f(r)} 3.5 0 1 0 ${f(-2 * r)} 0Z`, fill: "#B9D6C1" }];
}
