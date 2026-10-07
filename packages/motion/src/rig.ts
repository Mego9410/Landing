// The Steadie figure: a side-view character built from the brand's shapes (rounded pill limbs, a disc head, no
// face), posed by a few targets per keyframe. Elbows and knees are solved with two-bone IK, so an exercise is
// authored as where the hips, hands and feet go, and the limbs follow.
//
// Coordinates: a 240 × 200 box, y down, the figure faces right (+x). The ground line is GROUND (ankle height when
// standing flat). Angles are degrees.

export type Pt = [number, number];
/** A point given relative to the torso: `d` along the spine from the hip, `side` across it (+ = the chest side). */
export type TorsoPt = { t: [number, number] };
export type Target = Pt | TorsoPt;

export interface Pose {
  /** Hip (pelvis centre). */
  hip: Pt;
  /** Torso angle from vertical. 0 = upright, + leans forward (towards +x), 90 = lying face down, head to the right. */
  torso: number;
  /** Extra head tilt relative to the torso. */
  head?: number;
  /** Hand targets: [near, far]. */
  hands: [Target, Target];
  /** Ankle targets: [near, far]. */
  ankles: [Pt, Pt];
  /** Toe points: [near, far]. Default: foot flat, pointing forward. */
  toes?: [Pt | null, Pt | null];
  /** Bend direction for elbows and knees: 1 or -1. Defaults: elbows 1 (point back), knees -1 (point forward). */
  elbows?: [number, number];
  knees?: [number, number];
  /** Pin a knee or elbow to an exact point instead of solving (e.g. a knee resting on the floor). */
  kneeAt?: [Pt | null, Pt | null];
  elbowAt?: [Pt | null, Pt | null];
  /** Breathing, 0 (out) to 1 (in). Set by poseAt; it only changes the chest, never the movement. */
  breath?: number;
}

export const L = { torso: 54, shoulder: 49, neck: 7, headR: 13, upperArm: 30, forearm: 28, thigh: 42, shin: 40, foot: 15 };
export const GROUND = 181;
export const FLOOR = 186; // top of the ground pill

const rad = (d: number) => (d * Math.PI) / 180;
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const len = (v: Pt) => Math.hypot(v[0], v[1]);
const scale = (v: Pt, s: number): Pt => [v[0] * s, v[1] * s];
const unit = (v: Pt): Pt => { const l = len(v) || 1; return [v[0] / l, v[1] / l]; };

/** Unit vector along the spine for a torso angle. */
export const spine = (torso: number): Pt => [Math.sin(rad(torso)), -Math.cos(rad(torso))];
/** Unit vector across the spine towards the chest. */
export const chest = (torso: number): Pt => [Math.cos(rad(torso)), Math.sin(rad(torso))];

export function resolve(p: Pose, t: Target): Pt {
  if (Array.isArray(t)) return t;
  const [d, side] = t.t;
  return add(add(p.hip, scale(spine(p.torso), d)), scale(chest(p.torso), side));
}

/** Two-bone IK: from a root towards a target with segment lengths a and b. */
function ik(root: Pt, target: Pt, a: number, b: number, bend: number): { joint: Pt; end: Pt } {
  const v = sub(target, root);
  const d = Math.min(Math.max(len(v), Math.abs(a - b) + 0.01), a + b - 0.01);
  const base = Math.atan2(v[1], v[0]);
  const alpha = Math.acos(Math.min(1, Math.max(-1, (a * a + d * d - b * b) / (2 * a * d))));
  const j = base + bend * alpha;
  const joint: Pt = [root[0] + a * Math.cos(j), root[1] + a * Math.sin(j)];
  const end = add(joint, scale(unit(sub(target, joint)), b));
  return { joint, end };
}
function pinned(root: Pt, mid: Pt, target: Pt, a: number, b: number): { joint: Pt; end: Pt } {
  const joint = add(root, scale(unit(sub(mid, root)), a));
  const end = add(joint, scale(unit(sub(target, joint)), b));
  return { joint, end };
}

export interface Skeleton {
  hip: Pt; neck: Pt; shoulder: Pt; head: Pt;
  arms: { elbow: Pt; hand: Pt }[]; // [near, far]
  legs: { knee: Pt; ankle: Pt; toe: Pt }[];
  breath?: number;
}

export function solve(p: Pose): Skeleton {
  const s = spine(p.torso);
  const neck = add(p.hip, scale(s, L.torso));
  const shoulder = add(p.hip, scale(s, L.shoulder));
  const head = add(neck, scale(spine(p.torso + (p.head ?? 0)), L.neck + L.headR));
  const arms = [0, 1].map((i) => {
    const target = resolve(p, p.hands[i]);
    const at = p.elbowAt?.[i];
    const r = at ? pinned(shoulder, at, target, L.upperArm, L.forearm) : ik(shoulder, target, L.upperArm, L.forearm, p.elbows?.[i] ?? 1);
    return { elbow: r.joint, hand: r.end };
  });
  const legs = [0, 1].map((i) => {
    const target = p.ankles[i];
    const at = p.kneeAt?.[i];
    const r = at ? pinned(p.hip, at, target, L.thigh, L.shin) : ik(p.hip, target, L.thigh, L.shin, p.knees?.[i] ?? -1);
    const toe = p.toes?.[i] ?? add(r.end, [L.foot, 3]);
    const foot = add(r.end, scale(unit(sub(toe, r.end)), L.foot));
    return { knee: r.joint, ankle: r.end, toe: foot };
  });
  return { hip: p.hip, neck, shoulder, head, arms, legs, breath: p.breath };
}

// ---------- timing ----------

/** One keyframe: a pose, how long to take getting to the next one, and how long to hold it. */
export interface Key { pose: Pose; hold?: number; move?: number }

// Slow in, slow out, with a firmer middle than a sine: the body gathers itself, moves, then settles (smootherstep).
const ease = (x: number) => x * x * x * (x * (6 * x - 15) + 10);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerpPt = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

function lerpTarget(pa: Pose, a: Target, pb: Pose, b: Target, k: number): Target {
  if (!Array.isArray(a) && !Array.isArray(b)) return { t: [lerp(a.t[0], b.t[0], k), lerp(a.t[1], b.t[1], k)] };
  return lerpPt(resolve(pa, a), resolve(pb, b), k);
}
const opt = <T,>(a: T | null | undefined, b: T | null | undefined, f: (x: T, y: T) => T): T | null => (a && b ? f(a, b) : (k0(a, b)));
function k0<T>(a: T | null | undefined, b: T | null | undefined): T | null { return (a ?? b) ?? null; }

export function blend(a: Pose, b: Pose, k: number): Pose {
  const pair = <T,>(x: [T, T] | undefined, y: [T, T] | undefined, f: (u: T, v: T) => T): [T, T] | undefined =>
    x || y ? ([0, 1].map((i) => f((x ?? y)![i], (y ?? x)![i])) as [T, T]) : undefined;
  return {
    hip: lerpPt(a.hip, b.hip, k),
    torso: lerp(a.torso, b.torso, k),
    head: lerp(a.head ?? 0, b.head ?? 0, k),
    hands: [lerpTarget(a, a.hands[0], b, b.hands[0], k), lerpTarget(a, a.hands[1], b, b.hands[1], k)],
    ankles: [lerpPt(a.ankles[0], b.ankles[0], k), lerpPt(a.ankles[1], b.ankles[1], k)],
    toes: a.toes || b.toes ? ([0, 1].map((i) => {
      const sa = solveToe(a, i), sb = solveToe(b, i);
      return lerpPt(sa, sb, k);
    }) as [Pt, Pt]) : undefined,
    elbows: k < 0.5 ? a.elbows : b.elbows,
    knees: k < 0.5 ? a.knees : b.knees,
    kneeAt: pair(a.kneeAt, b.kneeAt, (u, v) => opt(u, v, (x, y) => lerpPt(x, y, k))),
    elbowAt: pair(a.elbowAt, b.elbowAt, (u, v) => opt(u, v, (x, y) => lerpPt(x, y, k))),
  };
}
function solveToe(p: Pose, i: number): Pt { return p.toes?.[i] ?? add(p.ankles[i], [L.foot, 3]); }

export function cycleLength(keys: Key[]): number {
  return keys.reduce((s, k) => s + (k.hold ?? 0.3) + (k.move ?? 1), 0);
}

function keyPose(keys: Key[], t: number): Pose {
  const total = cycleLength(keys);
  let x = ((t % total) + total) % total;
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i], next = keys[(i + 1) % keys.length];
    const hold = k.hold ?? 0.3, move = k.move ?? 1;
    if (x < hold) return k.pose;
    x -= hold;
    if (x < move) return blend(k.pose, next.pose, ease(x / move));
    x -= move;
  }
  return keys[0].pose;
}

/** How far behind the body the head runs, in seconds, and how much of the body's turn it takes up. */
const HEAD_LAG = 0.14, HEAD_FOLLOW = 0.55, HEAD_MAX = 10;
/** A slow breath, about every 3.5 s, fitted to a whole number per loop so the loop stays seamless. */
const BREATH = 3.5;

/**
 * The pose at time t (seconds) in a looping sequence of keyframes, with the secondary motion that keeps it from
 * looking mechanical: the head follows the torso a moment late (overlapping action), and the chest breathes. Hands,
 * feet and hips stay exactly on their keyframes, so the exercise itself is never changed.
 */
export function poseAt(keys: Key[], t: number): Pose {
  const p = keyPose(keys, t), before = keyPose(keys, t - HEAD_LAG);
  const lag = Math.max(-HEAD_MAX, Math.min(HEAD_MAX, (before.torso - p.torso) * HEAD_FOLLOW));
  const total = cycleLength(keys), breaths = Math.max(1, Math.round(total / BREATH));
  const breath = 0.5 - 0.5 * Math.cos((2 * Math.PI * breaths * t) / total);
  return { ...p, head: (p.head ?? 0) + lag, breath };
}
