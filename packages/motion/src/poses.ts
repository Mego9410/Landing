// Pose builders shared by the exercise definitions: standing, sitting, lying, kneeling, plank lines and a walking
// cycle. Everything returns plain Pose objects so an exercise can tweak any field.
import { GROUND, L, type Key, type Pose, type Pt } from "./rig.ts";

export const G = GROUND;
export const KNEE_Y = 178; // a knee resting on the floor
const rad = (d: number) => (d * Math.PI) / 180;
/** Unit vector for a body line `a` degrees from vertical, leaning towards +x. */
export const u = (a: number): Pt => [Math.sin(rad(a)), -Math.cos(rad(a))];
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const mul = (v: Pt, s: number): Pt => [v[0] * s, v[1] * s];

export const key = (pose: Pose, move = 1, hold = 0.3): Key => ({ pose, move, hold });

export function shoulderOf(p: Pose): Pt {
  return add(p.hip, mul(u(p.torso), L.shoulder));
}
/** Put the hands at offsets from the shoulder (near, far). */
export function hands(p: Pose, near: Pt, far: Pt = [near[0] - 3, near[1]]): Pose {
  const s = shoulderOf(p);
  return { ...p, hands: [add(s, near), add(s, far)] };
}
/** Arms hanging straight down from the shoulder. */
export const hang = (p: Pose, drop = 55): Pose => hands(p, [3, drop], [-1, drop]);

export function standing(x: number, o: Partial<Pose> = {}): Pose {
  return hang({ hip: [x, 101], torso: 0, hands: [[0, 0], [0, 0]], ankles: [[x + 3, G], [x - 3, G]], ...o });
}

/** Sitting on a seat whose top is at `seat`, hip at x. Hands rest on the thighs. */
export function sitting(x: number, seat: number, o: Partial<Pose> = {}): Pose {
  const hip: Pt = [x, seat - 8];
  return { hip, torso: 4, hands: [[x + 26, seat - 16], [x + 22, seat - 16]], ankles: [[x + 38, G], [x + 34, G]], ...o };
}

/** Lying on the back, head to the left, knees bent with feet flat. */
export function supine(x: number, o: Partial<Pose> = {}): Pose {
  return {
    hip: [x, 175], torso: -90, head: 0,
    hands: [[x + 4, 181], [x - 2, 181]],
    ankles: [[x + 40, G], [x + 36, G]],
    ...o,
  };
}

/** Lying face down, head to the right, legs straight. */
export function prone(x: number, o: Partial<Pose> = {}): Pose {
  return {
    hip: [x, 175], torso: 90, head: -14,
    hands: [[x + 30, 182], [x + 26, 182]],
    ankles: [[x - 80, 180], [x - 78, 180]],
    toes: [[x - 84, 186], [x - 82, 186]],
    ...o,
  };
}

/** Body in a straight line from a pivot on the floor (ankles or knees) at `a` degrees from vertical. */
export function plankLine(pivot: Pt, a: number, from: "feet" | "knees", o: Partial<Pose> = {}): Pose {
  const legLen = from === "feet" ? 81 : L.thigh;
  const hip = add(pivot, mul(u(a), legLen));
  const base: Pose = from === "feet"
    ? { hip, torso: a, hands: [[0, 0], [0, 0]], ankles: [pivot, [pivot[0] - 3, pivot[1]]], toes: pivot[1] >= G - 1 ? undefined : [[pivot[0] + 6, 185], [pivot[0] + 3, 185]] }
    : {
      hip, torso: a, hands: [[0, 0], [0, 0]],
      kneeAt: [pivot, [pivot[0] - 3, pivot[1]]],
      ankles: [[pivot[0] - 38, 179], [pivot[0] - 41, 179]],
      toes: [[pivot[0] - 46, 186], [pivot[0] - 49, 186]],
    };
  return { ...base, ...o };
}

/**
 * Press-up style pair: hands fixed at `hand`, body pivoting from the feet or knees. Works out where the pivot has to
 * be for the arms to be straight (`reach`) at angle `aUp`, then lowers to `aDown` around the same pivot.
 */
export function incline(hand: Pt, aUp: number, aDown: number, from: "feet" | "knees", reach = 55, pivotY?: number): { up: Pose; down: Pose; pivot: Pt } {
  const py = pivotY ?? (from === "feet" ? 176 : KNEE_Y);
  const len = (from === "feet" ? 81 : L.thigh) + L.shoulder;
  const sy = py - len * Math.cos(rad(aUp));
  const dx = Math.sqrt(Math.max(0, reach * reach - (hand[1] - sy) ** 2));
  const px = hand[0] - dx - len * Math.sin(rad(aUp));
  const pivot: Pt = [px, py];
  const hs: [Pt, Pt] = [hand, [hand[0] - 3, hand[1]]];
  return { up: plankLine(pivot, aUp, from, { hands: hs }), down: plankLine(pivot, aDown, from, { hands: hs }), pivot };
}

/** Tall kneeling: both knees on the floor under the hips. */
export function kneeling(x: number, o: Partial<Pose> = {}): Pose {
  return hang({
    hip: [x, KNEE_Y - 42], torso: 0, hands: [[0, 0], [0, 0]],
    kneeAt: [[x + 2, KNEE_Y], [x - 2, KNEE_Y]],
    ankles: [[x - 36, 179], [x - 40, 179]],
    toes: [[x - 46, 186], [x - 50, 186]],
    ...o,
  });
}

/** Half kneeling: near knee down, far foot planted in front. */
export function halfKneeling(x: number, o: Partial<Pose> = {}): Pose {
  return hang({
    hip: [x, KNEE_Y - 41], torso: 0, hands: [[0, 0], [0, 0]],
    kneeAt: [[x + 2, KNEE_Y], null],
    ankles: [[x - 36, 179], [x + 40, G]],
    toes: [[x - 46, 186], null],
    ...o,
  });
}

/** On hands and knees, head to the right. */
export function quadruped(x: number, o: Partial<Pose> = {}): Pose {
  const hip: Pt = [x, 134];
  return {
    hip, torso: 90, head: -10,
    hands: [[x + 52, 182], [x + 49, 182]],
    kneeAt: [[x + 1, KNEE_Y], [x - 2, KNEE_Y]],
    ankles: [[x - 37, 179], [x - 40, 179]],
    toes: [[x - 48, 186], [x - 51, 186]],
    ...o,
  };
}

/**
 * Walking in place, side on. Four keys: near heel down in front, passing, far heel down in front, passing.
 * `armSwing` 0 keeps the hands hanging (carrying something).
 */
export function gait(x: number, opts: { stride?: number; armSwing?: number; drop?: number; hip?: number; torso?: number; arms?: (p: Pose, phase: number) => Pose } = {}): Key[] {
  const s = opts.stride ?? 22, sw = opts.armSwing ?? 1, drop = opts.drop ?? 55, hy = opts.hip ?? 102, torso = opts.torso ?? 2;
  const contact = (lead: 0 | 1): Pose => {
    const front: Pt = [x + s, G - 1], back: Pt = [x - s + 2, G - 4];
    const frontToe: Pt = [x + s + 14, G - 5], backToe: Pt = [x - s + 13, 185];
    const ankles: [Pt, Pt] = lead === 0 ? [front, back] : [back, front];
    const toes: [Pt, Pt] = lead === 0 ? [frontToe, backToe] : [backToe, frontToe];
    return { hip: [x, hy + 2], torso, hands: [[0, 0], [0, 0]], ankles, toes };
  };
  const passing = (stance: 0 | 1): Pose => {
    const st: Pt = [x + 1, G], swing: Pt = [x - 5, G - 16];
    const stToe: Pt = [x + 16, 184], swToe: Pt = [x + 8, G - 10];
    const ankles: [Pt, Pt] = stance === 0 ? [st, swing] : [swing, st];
    const toes: [Pt, Pt] = stance === 0 ? [stToe, swToe] : [swToe, stToe];
    return { hip: [x, hy - 1], torso, hands: [[0, 0], [0, 0]], ankles, toes };
  };
  const arm = (p: Pose, phase: number): Pose => {
    if (opts.arms) return opts.arms(p, phase);
    const swing = [-1, 0, 1, 0][phase] * 14 * sw; // near arm goes back when the near leg is in front
    return hands(p, [3 + swing, drop - Math.abs(swing) * 0.2], [-1 - swing, drop - Math.abs(swing) * 0.2]);
  };
  const poses = [contact(0), passing(1), contact(1), passing(0)];
  return poses.map((p, i) => ({ pose: arm(p, i), move: 0.42, hold: 0 }));
}

/** Small hold animation: settle into a pose and breathe (a gentle rise and fall). */
export function breathe(p: Pose, amount = 1.5, seconds = 1.6): Key[] {
  const up: Pose = { ...p, hip: [p.hip[0], p.hip[1] - amount], torso: p.torso - amount * 0.6 };
  return [key(p, seconds, 0.2), key(up, seconds, 0.2)];
}

/** Forearm plank from the feet or knees, angled so the shoulders sit over elbows resting on the floor. */
export function forearmPlank(pivot: Pt, from: "feet" | "knees", o: Partial<Pose> = {}, shoulderY = 148): Pose {
  const len = (from === "feet" ? 81 : L.thigh) + L.shoulder;
  const a = (Math.acos(Math.min(1, (pivot[1] - shoulderY) / len)) * 180) / Math.PI;
  const p = plankLine(pivot, a, from);
  const s = shoulderOf(p);
  return { ...p, elbowAt: [[s[0] + 2, 177], [s[0] - 1, 177]], hands: [[s[0] + 30, 180], [s[0] + 27, 180]], ...o };
}
