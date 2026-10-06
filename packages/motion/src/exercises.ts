// The movement library: 12 patterns, each a ladder of six levels from easiest to hardest, plus a seated version.
// Level numbers match docs/research/movement.md. Every exercise is a looped animation authored as keyframes.
import type { Key, Pose, Pt } from "./rig.ts";
import type { Prop } from "./scene.ts";
import {
  breathe, forearmPlank, G, gait, halfKneeling, hands, hang, incline, key, kneeling, KNEE_Y, plankLine, prone,
  quadruped, shoulderOf, sitting, standing, supine,
} from "./poses.ts";

export type Pattern =
  | "squat" | "hinge" | "push" | "press" | "row" | "pulldown"
  | "lunge" | "carry" | "core" | "rotation" | "balance" | "calf";

export type Equipment =
  | "chair" | "wall" | "counter" | "step" | "band" | "bottles" | "bags" | "backpack" | "broom" | "mat" | "cushion"
  | "table" | "dumbbells" | "kettlebell" | "bench" | "barbell" | "cable" | "machine" | "pull-up bar" | "ab wheel";

export interface Exercise {
  id: string;
  name: string;
  pattern: Pattern;
  /** 1 (easiest) to 6. 0 = the seated version. */
  level: number;
  equipment: Equipment[];
  /** One calm coaching cue, shown under the animation. */
  cue: string;
  props: Prop[];
  keys: Key[];
}

export const PATTERNS: { id: Pattern; name: string; seated: string }[] = [
  { id: "squat", name: "Squat", seated: "squat-0" },
  { id: "hinge", name: "Hinge", seated: "hinge-0" },
  { id: "push", name: "Push", seated: "push-0" },
  { id: "press", name: "Overhead press", seated: "press-2" },
  { id: "row", name: "Row", seated: "row-2" },
  { id: "pulldown", name: "Pull down", seated: "pulldown-2" },
  { id: "lunge", name: "Lunge and step", seated: "lunge-0" },
  { id: "carry", name: "Carry", seated: "carry-0" },
  { id: "core", name: "Core", seated: "core-0" },
  { id: "rotation", name: "Side and rotation", seated: "rotation-0" },
  { id: "balance", name: "Balance", seated: "balance-0" },
  { id: "calf", name: "Calf", seated: "calf-1" },
];

const list: Exercise[] = [];
function ex(id: string, name: string, equipment: Equipment[], cue: string, props: Prop[], keys: Key[]): void {
  const [pattern, level] = id.split("-");
  list.push({ id, name, pattern: pattern as Pattern, level: Number(level), equipment, cue, props, keys });
}

const crossed = (p: Pose): Pose => ({ ...p, hands: [{ t: [40, 9] }, { t: [38, 6] }] });
const onHips = (p: Pose): Pose => ({ ...p, hands: [{ t: [6, 8] }, { t: [6, 4] }] });
const atChest = (p: Pose, side = 16): Pose => ({ ...p, hands: [{ t: [40, side] }, { t: [40, side - 3] }] });
const byShoulders = (p: Pose): Pose => ({ ...p, hands: [{ t: [52, 10] }, { t: [52, 7] }] });
const overhead = (p: Pose): Pose => ({ ...p, hands: [{ t: [105, 5] }, { t: [105, 2] }] });
const pressOut = (p: Pose): Pose => ({ ...p, hands: [{ t: [46, 54] }, { t: [46, 51] }] });
const pressIn = (p: Pose): Pose => ({ ...p, hands: [{ t: [44, 14] }, { t: [44, 11] }] });
const rowIn = (p: Pose): Pose => ({ ...p, hands: [{ t: [30, 12] }, { t: [30, 9] }] });
const with_ = (p: Pose, o: Partial<Pose>): Pose => ({ ...p, ...o });

// A seat with its front edge 14 to the right of the hip.
const chairFor = (hipX: number, seat: number): Prop => ({ kind: "chair", x: hipX + 14, seat });

// ---------------------------------------------------------------- squat

function sitToStand(seat: number, arms: (p: Pose, up: boolean) => Pose, x = 96): Key[] {
  const ank: [Pt, Pt] = [[x + 34, G], [x + 30, G]];
  const sit = arms({ ...sitting(x, seat), ankles: ank }, false);
  const lean = arms({ ...sitting(x, seat), ankles: ank, torso: 40 }, false);
  const mid = arms({ ...sitting(x, seat), ankles: ank, hip: [x + 18, seat - 24], torso: 30 }, true);
  const stand = arms(standing(x + 32, { ankles: ank }), true);
  const lower = arms({ ...sitting(x, seat), ankles: ank, hip: [x + 16, seat - 22], torso: 34 }, true);
  return [key(sit, 0.7, 0.6), key(lean, 0.6, 0), key(mid, 0.7, 0), key(stand, 1.1, 0.6), key(lower, 0.8, 0)];
}

ex("squat-0", "Seated partial stand", ["chair"], "Lean forward, nose over toes, and lift your hips just off the seat.", [chairFor(96, 140)], (() => {
  const sit = crossed({ ...sitting(96, 140), ankles: [[130, G], [126, G]] });
  const lean = { ...sit, torso: 38 };
  const lift = { ...lean, hip: [106, 124] as Pt, torso: 36 };
  return [key(sit, 0.8, 0.6), key(lean, 0.7, 0), key(lift, 0.9, 0.8), key(lean, 0.8, 0)];
})());

ex("squat-1", "Sit to stand, high chair", ["chair"], "Hands on your thighs to help. Stand tall, then sit back slowly.", [chairFor(96, 128)],
  sitToStand(128, (p, up) => (up ? hang(p) : { ...p, hands: [{ t: [16, 26] }, { t: [16, 23] }] })));

ex("squat-2", "Sit to stand", ["chair"], "Arms crossed, feet flat. Stand up tall, then lower slowly to the seat.", [chairFor(96, 140)],
  sitToStand(140, (p) => crossed(p)));

ex("squat-3", "Box squat", ["step"], "Sit back until you just touch the box, then drive up through your heels.", [{ kind: "step", x: 56, w: 44, h: 44 }], (() => {
  const top = hands(standing(104, { ankles: [[110, G], [104, G]] }), [50, 4]);
  const bottom = hands({ ...top, hip: [82, 136], torso: 34 }, [50, 4]);
  return [key(top, 1.2, 0.4), key(bottom, 1.1, 0.3)];
})());

const gobletKeys = (down: number, hold: number): Key[] => {
  const top = atChest(standing(104, { ankles: [[112, G], [106, G]] }));
  const bottom = atChest({ ...top, hip: [88, 144], torso: 26 });
  return [key(top, down, 0.4), key(bottom, 1, hold)];
};
ex("squat-4", "Goblet squat", ["dumbbells"], "Hold the weight at your chest, elbows down. Sit between your heels.", [{ kind: "held", item: "dumbbellV", hand: "chest" }], gobletKeys(1.2, 0.3));
ex("squat-5", "Slow goblet squat", ["dumbbells"], "Three seconds down, a short pause, then stand.", [{ kind: "held", item: "dumbbellV", hand: "chest" }], gobletKeys(3, 1));

ex("squat-6", "Leg press", ["machine"], "Press the plate away without locking your knees, then let it come back slowly.", [
  { kind: "block", x: 50, y: 156, w: 70, h: 30 },
  { kind: "block", x: 168, y: 120, w: 14, h: 66 },
  { kind: "pad", a: [42, 104], b: [80, 148], w: 14 },
  { kind: "pad", a: [76, 152], b: [108, 152], w: 10 },
  { kind: "held", item: "handle", hand: "both" },
  { kind: "sled", x: 0, y: 0 },
], (() => {
  const base: Pose = { hip: [90, 138], torso: -40, hands: [[104, 146], [101, 146]], ankles: [[128, 118], [124, 120]], toes: [[131, 103], [127, 105]] };
  const out: Pose = { ...base, ankles: [[158, 104], [154, 106]], toes: [[161, 89], [157, 91]] };
  return [key(base, 1.1, 0.3), key(out, 1.6, 0.3)];
})());

// ---------------------------------------------------------------- hinge

ex("hinge-0", "Seated good morning", ["chair"], "Arms crossed, back long. Tip forward from your hips, then sit tall.", [chairFor(96, 140)], (() => {
  const sit = crossed(sitting(96, 140));
  return [key(sit, 1.2, 0.5), key({ ...sit, torso: 40 }, 1.2, 0.3)];
})());

ex("hinge-1", "Glute bridge", ["mat"], "Squeeze your bottom and lift your hips until you're in a line from knees to shoulders.", [{ kind: "mat", x: 6, w: 170 }], (() => {
  const down = supine(96, { hip: [96, 174], ankles: [[136, G], [132, G]], hands: [[100, 182], [96, 182]], elbows: [-1, -1] });
  const up = { ...down, hip: [100, 150] as Pt, torso: -114, head: 24 };
  return [key(down, 1, 0.4), key(up, 1, 0.8)];
})());

ex("hinge-2", "Broom hinge", ["broom"], "Keep the handle touching your head, back and bottom as you hinge forward.", [{ kind: "dowel" }], (() => {
  const grip = (p: Pose): Pose => ({ ...p, hands: [{ t: [52, -14] }, { t: [4, -16] }], elbows: [-1, 1] });
  const top = grip(standing(104, { ankles: [[108, G], [102, G]] }));
  const bottom = grip({ ...top, hip: [88, 104], torso: 58 });
  return [key(top, 1.3, 0.4), key(bottom, 1.2, 0.4)];
})());

const rdl = (torso: number, hipX: number, drop: number): Key[] => {
  const top = hang(standing(104, { ankles: [[108, G], [102, G]] }));
  const bottom = hang({ ...top, hip: [hipX, 104], torso }, drop);
  return [key(top, 1.4, 0.4), key(bottom, 1.2, 0.3)];
};
ex("hinge-3", "Backpack Romanian deadlift", ["backpack"], "Soft knees. Slide the bag down your thighs, hips back, then stand tall.", [{ kind: "held", item: "backpack", hand: "chest" }], rdl(60, 86, 55));
ex("hinge-4", "Dumbbell Romanian deadlift", ["dumbbells"], "Hips back, weights close to your legs. Stop when you feel the backs of your thighs.", [{ kind: "held", item: "dumbbell", hand: "both" }], rdl(68, 84, 57));

ex("hinge-5", "Kettlebell deadlift", ["kettlebell"], "Bell between your feet. Push the floor away and stand up tall.", [{ kind: "held", item: "kettlebell", hand: "chest" }], (() => {
  const top = hang(standing(104, { ankles: [[108, G], [102, G]] }));
  const bottom = hang({ ...top, hip: [80, 138], torso: 50 }, 58);
  return [key(top, 1.2, 0.4), key(bottom, 1.1, 0.4)];
})());

ex("hinge-6", "Hip thrust", ["bench", "barbell"], "Upper back on the bench, chin tucked. Drive your hips up and squeeze.", [
  { kind: "bench", x: 14, w: 58, top: 134 },
  { kind: "barbell", hands: true },
], (() => {
  const down: Pose = { hip: [104, 168], torso: -40, head: 10, hands: [{ t: [2, 14] }, { t: [2, 11] }], ankles: [[158, G], [154, G]] };
  const up: Pose = { ...down, hip: [122, 136], torso: -81, head: 30 };
  return [key(down, 1, 0.4), key(up, 1, 0.7)];
})());

// ---------------------------------------------------------------- push

ex("push-0", "Seated band chest press", ["chair", "band"], "Band round the chair back. Press forward until your arms are long, then slowly return.", [
  chairFor(96, 140),
  { kind: "band", from: [64, 96], hand: "both" },
], (() => {
  const sit = sitting(96, 140);
  return [key(pressIn(sit), 1, 0.3), key(pressOut(sit), 1.2, 0.3)];
})());

function pressUp(hand: Pt, aUp: number, aDown: number, from: "feet" | "knees", pivotY?: number, reach = 55): Key[] {
  const { up, down } = incline(hand, aUp, aDown, from, reach, pivotY);
  return [key(up, 1.2, 0.4), key(down, 1, 0.2)];
}
ex("push-1", "Wall press-up", ["wall"], "Hands on the wall at shoulder height. Bend your elbows and bring your chest towards it.", [{ kind: "wall", x: 168 }], pressUp([167, 66], 14, 30, "feet", G));
ex("push-2", "Counter press-up", ["counter"], "Hands on the edge, body in one line. Lower your chest to the counter.", [{ kind: "counter", x: 164, top: 112 }], pressUp([168, 111], 36, 52, "feet", G));
ex("push-3", "Chair press-up", ["chair"], "Chair against a wall. Hands on the seat, lower with control.", [{ kind: "chair", x: 160, seat: 140, flip: true }], pressUp([170, 139], 52, 68, "feet", 176));
ex("push-4", "Knee press-up", ["mat"], "Knees down, hips in line. Lower your chest between your hands.", [{ kind: "mat", x: 30, w: 190 }], pressUp([182, 181], 54, 74, "knees"));
ex("push-5", "Press-up", [], "Body like a plank. Lower until your chest is just above the floor.", [], pressUp([190, 181], 66, 80, "feet", 176));

ex("push-6", "Dumbbell bench press", ["bench", "dumbbells"], "Feet flat. Lower the weights to the sides of your chest, then press up.", [
  { kind: "bench", x: 30, w: 118, top: 128 },
  { kind: "held", item: "dumbbell", hand: "both" },
], (() => {
  const base: Pose = { hip: [112, 119], torso: -90, hands: [{ t: [49, 55] }, { t: [49, 52] }], ankles: [[150, G], [146, G]] };
  return [key(base, 1.2, 0.3), key({ ...base, hands: [{ t: [42, 16] }, { t: [42, 13] }] }, 1, 0.2)];
})());

// ---------------------------------------------------------------- overhead press

ex("press-1", "Wall slide", ["wall"], "Forearms on the wall. Slide them up as high as is comfortable, then back down.", [{ kind: "wall", x: 170 }], (() => {
  const low = { ...standing(140), elbowAt: [[162, 72], [159, 72]] as [Pt, Pt], hands: [[167, 46], [164, 46]] as [Pt, Pt] };
  const high = { ...low, elbowAt: [[160, 32], [157, 32]] as [Pt, Pt], hands: [[166, 6], [163, 6]] as [Pt, Pt] };
  return [key(low, 1.4, 0.3), key(high, 1.4, 0.5)];
})());

ex("press-2", "Seated bottle press", ["chair", "bottles"], "Sit tall. Press the bottles overhead, then lower them to your shoulders.", [
  chairFor(96, 140),
  { kind: "held", item: "bottle", hand: "both" },
], (() => {
  const sit = sitting(96, 140, { torso: 0 });
  return [key(byShoulders(sit), 1, 0.3), key(overhead(sit), 1.2, 0.3)];
})());

ex("press-3", "Band overhead press", ["band"], "Stand on the band. Press straight up, ribs down, then lower slowly.", [{ kind: "bandUnderFeet", hand: "both" }], (() => {
  const st = standing(104, { ankles: [[108, G], [102, G]] });
  return [key(byShoulders(st), 1, 0.3), key(overhead(st), 1.2, 0.3)];
})());

ex("press-4", "Half-kneeling dumbbell press", ["dumbbells", "mat"], "One knee down, squeeze that side's bottom. Press up, then lower with control.", [
  { kind: "cushion", x: 92, w: 30 },
  { kind: "held", item: "dumbbell", hand: 0 },
], (() => {
  const base = halfKneeling(104);
  const low = { ...base, hands: [{ t: [52, 10] }, base.hands[1]] as Pose["hands"] };
  const high = { ...base, hands: [{ t: [105, 5] }, base.hands[1]] as Pose["hands"] };
  return [key(low, 1, 0.3), key(high, 1.2, 0.3)];
})());

ex("press-5", "Standing dumbbell press", ["dumbbells"], "Feet hip-width, ribs down. Press the weights overhead, then lower to your shoulders.", [{ kind: "held", item: "dumbbell", hand: "both" }], (() => {
  const st = standing(104, { ankles: [[108, G], [102, G]] });
  return [key(byShoulders(st), 1, 0.3), key(overhead(st), 1.2, 0.3)];
})());

ex("press-6", "Machine shoulder press", ["machine"], "Back against the pad. Press the handles up, then lower slowly.", [
  { kind: "block", x: 90, y: 150, w: 14, h: 36 },
  { kind: "pad", a: [80, 66], b: [80, 140], w: 12 },
  { kind: "pad", a: [80, 145], b: [114, 145], w: 10 },
  { kind: "held", item: "handle", hand: "both" },
], (() => {
  const sit = sitting(96, 145, { torso: 0 });
  return [key(byShoulders(sit), 1, 0.3), key(overhead(sit), 1.2, 0.3)];
})());

// ---------------------------------------------------------------- row

ex("row-1", "Prone Y raise", ["mat"], "Lying face down, arms in a Y. Lift your arms a little, forehead stays low.", [{ kind: "mat", x: 4, w: 216 }], (() => {
  const down = prone(92, { hands: [[196, 180], [193, 180]] });
  const up = { ...down, hands: [[194, 160], [191, 160]] as [Pt, Pt], head: -18 };
  return [key(down, 1, 0.3), key(up, 1, 0.8)];
})());

ex("row-2", "Seated band row", ["chair", "band"], "Sit tall. Pull your elbows back and squeeze your shoulder blades.", [
  chairFor(96, 140),
  { kind: "anchor", at: [216, 112] },
  { kind: "band", from: [216, 112], hand: "both" },
], (() => {
  const sit = sitting(96, 140, { torso: 0 });
  return [key(pressOut(sit), 1, 0.3), key(rowIn(sit), 1.2, 0.5)];
})());

ex("row-3", "Standing band row", ["band"], "Soft knees, chest proud. Pull your elbows past your ribs.", [
  { kind: "anchor", at: [216, 92] },
  { kind: "band", from: [216, 92], hand: "both" },
], (() => {
  const st = standing(100, { hip: [100, 103], torso: 6, ankles: [[106, G], [100, G]] });
  return [key(pressOut(st), 1, 0.3), key(rowIn(st), 1.2, 0.5)];
})());

ex("row-4", "One-arm dumbbell row", ["dumbbells", "bench"], "Hand on the bench, back flat. Pull the weight to your hip.", [
  { kind: "bench", x: 150, w: 74, top: 140 },
  { kind: "held", item: "dumbbell", hand: 0 },
], (() => {
  const base: Pose = { hip: [108, 106], torso: 68, hands: [[0, 0], [170, 140]], ankles: [[122, G], [92, G]] };
  const s = shoulderOf(base);
  const low = { ...base, hands: [[s[0] + 2, s[1] + 55], [170, 140]] as Pose["hands"] };
  const high = { ...base, hands: [{ t: [22, 16] }, [170, 140]] as Pose["hands"] };
  return [key(low, 1, 0.3), key(high, 1.2, 0.5)];
})());

ex("row-5", "Table row", ["table"], "Under a sturdy table, heels down, body straight. Pull your chest to the edge.", [{ kind: "bar", x1: 146, x2: 222, y: 86, posts: true }], (() => {
  const toes: [Pt, Pt] = [[48, 166], [45, 166]];
  const hs: [Pt, Pt] = [[172, 88], [169, 88]];
  const down = plankLine([44, G], 72, "feet", { hands: hs, toes });
  const up = plankLine([44, G], 60, "feet", { hands: hs, toes });
  return [key(down, 1, 0.3), key(up, 1.2, 0.5)];
})());

ex("row-6", "Seated cable row", ["cable"], "Sit tall, knees soft. Pull the handle to your ribs, then let your arms go long.", [
  { kind: "stack", x: 214, pulley: [216, 140] },
  { kind: "bench", x: 48, w: 74, top: 152 },
  { kind: "pad", a: [168, 138], b: [168, 180], w: 8 },
  { kind: "cable", hand: 0 },
  { kind: "held", item: "handle", hand: 0 },
], (() => {
  const base: Pose = { hip: [88, 144], torso: 12, hands: [[0, 0], [0, 0]], ankles: [[156, 160], [152, 162]], toes: [[160, 146], [156, 148]] };
  return [key(pressOut(base), 1, 0.3), key(rowIn({ ...base, torso: -4 }), 1.2, 0.5)];
})());

// ---------------------------------------------------------------- pull down

ex("pulldown-1", "Overhead band pull-apart", ["band"], "Arms up, band taut. Pull it apart and down behind your head.", [{ kind: "bandBetween" }], (() => {
  const st = standing(104, { ankles: [[108, G], [102, G]] });
  const up = { ...st, hands: [{ t: [104, 8] }, { t: [104, 0] }] as Pose["hands"] };
  const down = { ...st, hands: [{ t: [64, 42] }, { t: [64, -40] }] as Pose["hands"], elbows: [1, -1] as [number, number] };
  return [key(up, 1.1, 0.3), key(down, 1.1, 0.5)];
})());

const pulldown = (base: Pose): Key[] => [
  key({ ...base, hands: [{ t: [104, 12] }, { t: [104, 9] }] }, 1, 0.3),
  key({ ...base, hands: [{ t: [56, 18] }, { t: [56, 15] }] }, 1.2, 0.5),
];
ex("pulldown-2", "Seated band pull-down", ["chair", "band"], "Band over the top of a door. Pull your elbows down to your sides.", [
  chairFor(96, 140),
  { kind: "anchor", at: [130, -6] },
  { kind: "band", from: [130, -6], hand: "both" },
], pulldown(sitting(96, 140, { torso: 0 })));

ex("pulldown-3", "Kneeling band pull-down", ["band", "mat"], "Tall kneeling, bottom squeezed. Pull your elbows down and back.", [
  { kind: "mat", x: 50, w: 90 },
  { kind: "anchor", at: [138, -6] },
  { kind: "band", from: [138, -6], hand: "both" },
], pulldown(kneeling(104)));

ex("pulldown-4", "Assisted pull-up", ["pull-up bar", "chair"], "Feet on the chair to take some weight. Pull your chest up towards the bar.", [
  { kind: "bar", x1: 40, x2: 200, y: 16, posts: true },
  { kind: "chair", x: 98, seat: 150 },
], (() => {
  const hs: [Pt, Pt] = [[124, 18], [121, 18]];
  const down: Pose = { hip: [118, 124], torso: -6, hands: hs, ankles: [[84, 145], [80, 145]] };
  const up: Pose = { ...down, hip: [120, 98], torso: -4, ankles: [[86, 145], [82, 145]] };
  return [key(down, 1.2, 0.3), key(up, 1.2, 0.4)];
})());

ex("pulldown-5", "Lat pull-down", ["machine", "cable"], "Thighs under the pad. Pull the bar to your upper chest, then let it rise slowly.", [
  { kind: "stack", x: 200, pulley: [150, 4] },
  { kind: "pad", a: [150, 4], b: [206, 4], w: 8 },
  { kind: "block", x: 84, y: 150, w: 14, h: 36 },
  { kind: "pad", a: [70, 146], b: [112, 146], w: 10 },
  { kind: "pad", a: [124, 118], b: [148, 118], w: 10 },
  { kind: "block", x: 148, y: 112, w: 8, h: 74 },
  { kind: "cable", hand: 0 },
  { kind: "held", item: "handle", hand: "both" },
], pulldown(sitting(96, 146, { torso: -6, ankles: [[136, G], [132, G]] })));

ex("pulldown-6", "Chin-up", ["pull-up bar"], "Hang long, then pull until your chin clears the bar. Lower all the way.", [{ kind: "bar", x1: 40, x2: 200, y: 8, posts: true }], (() => {
  const hs: [Pt, Pt] = [[124, 10], [121, 10]];
  const down: Pose = { hip: [118, 116], torso: -6, hands: hs, ankles: [[82, 160], [80, 158]] };
  const up: Pose = { ...down, hip: [120, 88], ankles: [[84, 132], [82, 130]] };
  return [key(down, 1.3, 0.4), key(up, 1.2, 0.4)];
})());

// ---------------------------------------------------------------- lunge and step

ex("lunge-0", "Seated knee extension", ["chair"], "Sit tall. Straighten one knee, pause, and lower slowly.", [chairFor(96, 140)], (() => {
  const sit = sitting(96, 140, { torso: 0, hands: [[104, 134], [100, 134]] });
  const ext = { ...sit, ankles: [[175, 140], sit.ankles[1]] as [Pt, Pt], toes: [[180, 126], null] as [Pt | null, Pt | null] };
  return [key(sit, 0.9, 0.4), key(ext, 0.9, 1)];
})());

const supported = (p: Pose): Pose => ({ ...p, hands: [[158, 110], p.hands[1]] });
const split = (hip: Pt): Pose => hang({ hip, torso: 2, hands: [[0, 0], [0, 0]], ankles: [[146, G], [82, 174]], toes: [null, [94, 184]] });

ex("lunge-1", "Supported split stance", ["counter"], "One foot forward, hand on the counter. Bend both knees a little and hold.", [{ kind: "counter", x: 156, top: 112 }], (() => {
  const tall = supported(split([113, 106]));
  const low = supported(split([111, 120]));
  return [key(tall, 1.2, 0.3), key(low, 1.2, 2)];
})());

ex("lunge-2", "Supported split squat", ["counter"], "Lower your back knee towards the floor, then push back up.", [{ kind: "counter", x: 156, top: 112 }], (() => {
  return [key(supported(split([113, 106])), 1.2, 0.3), key(supported(split([110, 140])), 1.1, 0.3)];
})());

ex("lunge-3", "Step-up", ["step"], "Whole foot on the step. Push through it to stand up, then step down.", [{ kind: "step", x: 130, w: 56, h: 22 }], (() => {
  const start = hang({ hip: [118, 103], torso: 4, hands: [[0, 0], [0, 0]], ankles: [[150, 159], [108, G]] });
  const mid = hang({ ...start, hip: [134, 96], torso: 16, ankles: [[150, 159], [118, 170]], toes: [null, [130, 178]] });
  const up = hang({ ...start, hip: [147, 80], torso: 2, ankles: [[150, 159], [142, 159]] });
  const back = hang({ ...start, hip: [132, 98], torso: 10, ankles: [[150, 159], [124, 172]], toes: [null, [136, 182]] });
  return [key(start, 0.6, 0.3), key(mid, 0.6, 0), key(up, 0.7, 0.4), key(back, 0.6, 0)];
})());

ex("lunge-4", "Reverse lunge", [], "Step back and lower your back knee towards the floor. Push through your front foot to return.", [], (() => {
  const st = onHips(standing(117, { ankles: [[120, G], [114, G]] }));
  const lift = onHips({ ...st, hip: [110, 103], ankles: [[120, G], [86, 162]], toes: [null, [96, 172]] });
  const bottom = onHips({ ...st, hip: [86, 140], torso: 6, ankles: [[120, G], [44, 172]], toes: [null, [56, 184]] });
  return [key(st, 0.5, 0.3), key(lift, 0.6, 0), key(bottom, 0.8, 0.4), key(lift, 0.5, 0)];
})());

ex("lunge-5", "Dumbbell split squat", ["dumbbells"], "Weights by your sides. Drop your back knee straight down, then stand.", [{ kind: "held", item: "dumbbell", hand: "both" }],
  [key(split([113, 106]), 1.2, 0.3), key(split([110, 140]), 1.1, 0.3)]);

ex("lunge-6", "Bulgarian split squat", ["bench", "dumbbells"], "Back foot on the bench. Lower until your front thigh is nearly level.", [
  { kind: "bench", x: 14, w: 60, top: 144 },
  { kind: "held", item: "dumbbell", hand: "both" },
], (() => {
  const bulg = (hip: Pt) => hang({ hip, torso: 6, hands: [[0, 0], [0, 0]], ankles: [[142, G], [60, 136]], toes: [null, [46, 141]] });
  return [key(bulg([110, 106]), 1.2, 0.3), key(bulg([102, 140]), 1.1, 0.3)];
})());

// ---------------------------------------------------------------- carry

ex("carry-0", "Seated hold", ["chair", "bags"], "Sit tall with a bag in each hand. Shoulders back and down, breathe and hold.", [
  chairFor(96, 140),
  { kind: "held", item: "bag", hand: "both" },
], (() => {
  const slump = hang(sitting(96, 140, { torso: 10 }), 54);
  const tall = hang(sitting(96, 140, { torso: -2 }), 54);
  return [key(slump, 1.2, 0.3), key(tall, 1.2, 2)];
})());

const still = (p: Pose, phase: number): Pose => hands(p, [3, 55 + [0, 1, 0, 1][phase]], [-1, 55 + [0, 1, 0, 1][phase]]);
ex("carry-1", "Bottle walk", ["bottles"], "A bottle in each hand. Walk tall, slow and steady.", [{ kind: "held", item: "bottle", hand: "both" }], gait(112, { armSwing: 0.35 }));
ex("carry-2", "Shopping bag carry", ["bags"], "A bag in each hand, shoulders down. Walk tall and keep the bags still.", [{ kind: "held", item: "bag", hand: "both" }], gait(112, { arms: still }));
ex("carry-3", "Suitcase carry", ["kettlebell"], "Weight in one hand. Don't let it pull you sideways.", [{ kind: "held", item: "kettlebell", hand: 0 }], gait(112, {
  arms: (p, phase) => hands(p, [3, 55], [-1 + [14, 0, -14, 0][phase], 54]),
}));
ex("carry-4", "Farmer's carry", ["dumbbells"], "Heavy weights, tall posture, small steady steps.", [{ kind: "held", item: "dumbbell", hand: "both" }], gait(112, { arms: still }));
ex("carry-5", "Kettlebell carry", ["kettlebell"], "Grip hard, shoulders down, walk slowly.", [{ kind: "held", item: "kettlebell", hand: "both" }], gait(112, { arms: still, stride: 18 }));
ex("carry-6", "Front-rack carry", ["kettlebell"], "Bells at your chest, elbows tucked. Breathe and walk.", [{ kind: "held", item: "kettlebell", hand: "both" }], gait(112, {
  stride: 18,
  arms: (p) => ({ ...p, hands: [{ t: [42, 16] }, { t: [42, 13] }] }),
}));

// ---------------------------------------------------------------- core

ex("core-0", "Seated lean-back", ["chair"], "Arms crossed, sit tall. Lean back a little, hold, then come forward.", [chairFor(96, 140)], (() => {
  const sit = crossed(sitting(96, 140, { torso: 2 }));
  return [key(sit, 1.2, 0.4), key({ ...sit, torso: -16 }, 1.2, 1.4)];
})());

ex("core-1", "Heel slide", ["mat"], "Lower back gently pressed down. Slide one heel away, then back.", [{ kind: "mat", x: 6, w: 200 }], (() => {
  const base = supine(96, { hip: [96, 174], hands: [[104, 182], [100, 182]], elbows: [-1, -1] });
  const out = { ...base, ankles: [[176, G], base.ankles[1]] as [Pt, Pt], toes: [[181, 167], null] as [Pt | null, Pt | null] };
  return [key(base, 1.2, 0.4), key(out, 1.2, 0.4)];
})());

ex("core-2", "Dead bug", ["mat"], "Back flat. Reach one arm back and the opposite leg out, then swap.", [{ kind: "mat", x: 6, w: 212 }], (() => {
  const base: Pose = { hip: [110, 174], torso: -90, hands: [[63, 118], [59, 118]], ankles: [[150, 134], [146, 134]] };
  const a = { ...base, hands: [[8, 166], [59, 118]] as [Pt, Pt], ankles: [[150, 134], [190, 166]] as [Pt, Pt] };
  const b = { ...base, hands: [[63, 118], [5, 166]] as [Pt, Pt], ankles: [[192, 166], [146, 134]] as [Pt, Pt] };
  return [key(base, 1.1, 0.3), key(a, 1.1, 0.4), key(base, 1.1, 0.3), key(b, 1.1, 0.4)];
})());

ex("core-3", "Incline plank", ["counter"], "Hands on the counter, body in one line. Breathe and hold.", [{ kind: "counter", x: 164, top: 112 }],
  breathe(incline([168, 111], 40, 40, "feet", 55, G).up, 1.5));

ex("core-4", "Knee plank", ["mat"], "Forearms down, knees down, hips in line with your shoulders. Hold.", [{ kind: "mat", x: 20, w: 200 }],
  breathe(forearmPlank([70, KNEE_Y], "knees"), 1.5));

ex("core-5", "Plank with reach", ["mat"], "Hold the plank and reach one arm forward without letting your hips rock.", [{ kind: "mat", x: 10, w: 214 }], (() => {
  const base = forearmPlank([34, 176], "feet");
  const s = shoulderOf(base);
  const reach = { ...base, elbowAt: [[s[0] + 30, s[1] - 2], base.elbowAt![1]] as Pose["elbowAt"], hands: [[s[0] + 58, s[1] - 4], base.hands[1]] as Pose["hands"] };
  return [key(base, 0.9, 0.8), key(reach, 0.9, 0.8)];
})());

ex("core-6", "Ab wheel rollout", ["ab wheel", "mat"], "From your knees, roll out only as far as you can keep your back flat.", [
  { kind: "mat", x: 30, w: 200 },
  { kind: "held", item: "wheel", hand: "chest" },
], (() => {
  const kn: Pt = [80, KNEE_Y];
  const start = plankLine(kn, 14, "knees", { torso: 66, hands: [[140, 175], [137, 175]] });
  const out = plankLine(kn, 66, "knees", { torso: 76, hands: [[212, 175], [209, 175]] });
  return [key(start, 1.6, 0.4), key(out, 1.4, 0.3)];
})());

// ---------------------------------------------------------------- side and rotation

ex("rotation-0", "Seated band press-out", ["chair", "band"], "Band anchored to one side. Press it out in front and don't let it turn you.", [
  chairFor(96, 140),
  { kind: "anchor", at: [26, 112] },
  { kind: "band", from: [26, 112], hand: "both" },
], (() => {
  const sit = sitting(96, 140, { torso: 0 });
  return [key(pressIn(sit), 1, 0.3), key(pressOut(sit), 1, 1.6)];
})());

ex("rotation-1", "Seated march", ["chair"], "Sit tall, tummy braced. Lift one knee, lower, then the other.", [chairFor(96, 140)], (() => {
  const sit = sitting(96, 140, { torso: -2 });
  const a = { ...sit, ankles: [[132, 160], sit.ankles[1]] as [Pt, Pt] };
  const b = { ...sit, ankles: [sit.ankles[0], [128, 160]] as [Pt, Pt] };
  return [key(sit, 0.6, 0.2), key(a, 0.6, 0.4), key(sit, 0.6, 0.2), key(b, 0.6, 0.4)];
})());

ex("rotation-2", "Bird dog", ["mat"], "On all fours. Reach one arm forward and the opposite leg back, then swap.", [{ kind: "mat", x: 4, w: 216 }], (() => {
  const base = quadruped(96);
  const a: Pose = { ...base, hands: [[200, 130], base.hands[1]], kneeAt: [base.kneeAt![0], [54, 133]], ankles: [base.ankles[0], [14, 131]], toes: [base.toes![0], [4, 137]] };
  const b: Pose = { ...base, hands: [base.hands[0], [197, 130]], kneeAt: [[54, 133], base.kneeAt![1]], ankles: [[14, 131], base.ankles[1]], toes: [[4, 137], base.toes![1]] };
  return [key(base, 1, 0.2), key(a, 1, 0.6), key(base, 1, 0.2), key(b, 1, 0.6)];
})());

const sidePlank = (from: "feet" | "knees"): Key[] => {
  const pivot: Pt = from === "feet" ? [30, 177] : [70, KNEE_Y];
  const up = forearmPlank(pivot, from);
  const s = shoulderOf(up);
  const arms = (p: Pose): Pose => ({ ...p, elbowAt: [null, [s[0] + 1, 177]], hands: [[s[0] + 2, s[1] - 56], [s[0] + 3, 178]] });
  const top = arms(up);
  const down = arms({ ...up, hip: [s[0] - 46, 174], torso: 64 });
  return [key(down, 0.9, 0.3), key(top, 0.9, 1.6)];
};
ex("rotation-3", "Knee side plank", ["mat"], "On your side, knees bent. Lift your hips and hold.", [{ kind: "mat", x: 10, w: 200 }], sidePlank("knees"));
ex("rotation-4", "Pallof press", ["band"], "Band anchored at your side, chest height. Press out and resist the turn.", [
  { kind: "anchor", at: [22, 96] },
  { kind: "band", from: [22, 96], hand: "both" },
], (() => {
  const st = standing(110, { hip: [110, 103], ankles: [[116, G], [108, G]] });
  return [key(pressIn(st), 1, 0.3), key(pressOut(st), 1, 1.6)];
})());
ex("rotation-5", "Side plank", ["mat"], "Elbow under shoulder, feet stacked. Lift your hips into a straight line.", [{ kind: "mat", x: 6, w: 206 }], sidePlank("feet"));
ex("rotation-6", "Half-kneeling chop", ["band", "mat"], "Pull the band from high behind you down across your body, hips still.", [
  { kind: "cushion", x: 92, w: 30 },
  { kind: "anchor", at: [26, 16] },
  { kind: "band", from: [26, 16], hand: "both" },
], (() => {
  const base = halfKneeling(104);
  const high = hands(base, [-28, -40], [-31, -40]);
  const low = hands({ ...base, torso: 6 }, [34, 50], [31, 50]);
  return [key(high, 1, 0.3), key(low, 0.9, 0.4)];
})());

// ---------------------------------------------------------------- balance

const counter: Prop = { kind: "counter", x: 140, top: 100 };
const steady = (p: Pose): Pose => ({ ...p, hands: [[146, 99], p.hands[1]] });
const sway = (p: Pose, support: boolean, amount = 2): Key[] => {
  const f = (dx: number) => {
    const q = hang({ ...p, hip: [p.hip[0] + dx, p.hip[1]], torso: p.torso + dx * 0.6 });
    return support ? steady(q) : q;
  };
  return [key(f(-amount), 1.6, 0.2), key(f(amount), 1.6, 0.2)];
};

ex("balance-0", "Seated reach", ["chair"], "Sit tall, feet flat. Reach forward as far as feels steady, then sit back.", [chairFor(96, 140)], (() => {
  const sit = sitting(96, 140, { torso: 0 });
  const reach = hands({ ...sit, torso: 24 }, [58, 2], [0, 52]);
  return [key(sit, 1.2, 0.4), key({ ...reach, hands: [reach.hands[0], sit.hands[1]] }, 1.2, 0.6)];
})());
ex("balance-1", "Feet together, with support", ["counter"], "Feet together, a hand near the counter. Stand tall and breathe.", [counter],
  sway(standing(116, { ankles: [[118, G], [116, G]] }), true));
ex("balance-2", "Heel-to-toe stand, with support", ["counter"], "One foot directly in front of the other. Hold steady.", [counter],
  sway(standing(121, { ankles: [[130, G], [114, G]] }), true));
ex("balance-3", "Single-leg stand, with support", ["counter"], "Lift one foot, a fingertip on the counter. Hold.", [counter],
  sway(standing(117, { ankles: [[119, G], [98, 150]], toes: [null, [108, 160]] }), true));
ex("balance-4", "Heel-to-toe walk", [], "Heel touches toe with every step. Eyes ahead, arms out a little.", [],
  gait(112, { stride: 9, arms: (p) => hands(p, [16, 48], [-12, 48]) }));
ex("balance-5", "Single-leg reach", [], "Standing on one leg, tip forward and reach, back leg long. Return to tall.", [], (() => {
  const st = hang(standing(116, { ankles: [[119, G], [108, 168]], toes: [null, [120, 174]] }));
  const reach = hands({ ...st, hip: [108, 104], torso: 50, ankles: [[119, G], [42, 134]], toes: [null, [38, 147]] }, [34, 40], [30, 40]);
  return [key(st, 1.3, 0.4), key(reach, 1.2, 0.6)];
})());
ex("balance-6", "Single-leg stand on a cushion", ["cushion"], "One foot on the cushion, arms out a little. Hold steady.", [{ kind: "cushion", x: 100, w: 44 }], (() => {
  const p = standing(117, { hip: [117, 93], ankles: [[119, G - 8], [98, 142]], toes: [[134, 176], [108, 152]] });
  const f = (dx: number) => hands({ ...p, hip: [p.hip[0] + dx, p.hip[1]], torso: dx * 0.8 }, [16, 46], [-12, 46]);
  return [key(f(-2.5), 1.4, 0.2), key(f(2.5), 1.4, 0.2)];
})());

// ---------------------------------------------------------------- calf

const raise = (p: Pose, lift: number, feet: (0 | 1)[] = [0, 1]): Pose => {
  const ankles = p.ankles.map((a, i) => (feet.includes(i as 0 | 1) ? [a[0] + 4, a[1] - lift] : [a[0], a[1] - lift])) as [Pt, Pt];
  const toes = p.ankles.map((a, i) => (feet.includes(i as 0 | 1) ? [a[0] + 14, a[1] + 3] : null)) as [Pt | null, Pt | null];
  return { ...p, hip: [p.hip[0] + 1, p.hip[1] - lift], ankles, toes };
};

ex("calf-1", "Seated heel raise", ["chair"], "Feet flat. Lift your heels as high as you can, then lower slowly.", [chairFor(96, 140)], (() => {
  const sit = sitting(96, 140, { torso: 0 });
  const up = { ...sit, ankles: sit.ankles.map((a) => [a[0] + 4, a[1] - 11]) as [Pt, Pt], toes: sit.ankles.map((a) => [a[0] + 14, a[1] + 3]) as [Pt, Pt] };
  return [key(sit, 0.8, 0.3), key(up, 1, 0.5)];
})());

ex("calf-2", "Standing heel raise", ["counter"], "Fingertips on the counter. Rise onto the balls of your feet, then lower.", [counter], (() => {
  const st = steady(standing(116, { ankles: [[119, G], [113, G]] }));
  return [key(st, 0.8, 0.3), key(steady(hang(raise(st, 10))), 1.1, 0.5)];
})());

ex("calf-3", "Slow heel raise on a step", ["step"], "Balls of your feet on the edge. Lower your heels slowly below the step, then rise.", [{ kind: "step", x: 112, w: 58, h: 14 }], (() => {
  const top = 186 - 14; // step surface
  const mk = (ankleDy: number, hipDy: number, ax: number): Pose => hang({
    hip: [110, top - 5 - 80 + hipDy], torso: 0, hands: [[0, 0], [0, 0]],
    ankles: [[ax, top - 5 + ankleDy], [ax - 4, top - 5 + ankleDy]], toes: [[126, top - 2], [122, top - 2]],
  });
  const low = mk(9, 9, 112), high = mk(-9, -9, 117);
  return [key(high, 3, 0.3), key(low, 1.2, 0.5)];
})());

const oneLeg = (p: Pose): Pose => ({ ...p, ankles: [p.ankles[0], [106, 168]], toes: [p.toes?.[0] ?? null, [112, 178]] });
const singleCalf = (up: number, hold: number, down: number, weighted = false): Key[] => {
  const base = oneLeg(standing(117, { ankles: [[120, G], [106, 168]] }));
  const arms = (p: Pose) => steady(weighted ? hang(p) : hang(p));
  const high = arms(raise(base, 10, [0]));
  return [key(arms(base), up, 0.3), key(high, down, hold)];
};
ex("calf-4", "Single-leg heel raise, supported", ["counter"], "One foot hooked behind. Rise up, then lower with control.", [counter], singleCalf(1, 0.4, 1.1));
ex("calf-5", "Single-leg heel raise, 3-2-3", ["counter"], "Three seconds up, hold for two, three seconds down.", [counter], singleCalf(3, 2, 3));
ex("calf-6", "Weighted single-leg heel raise", ["counter", "dumbbells"], "Weight in your free hand. Full range, slow on the way down.", [counter, { kind: "held", item: "dumbbell", hand: 1 }], singleCalf(1, 0.5, 2, true));

export const EXERCISES: Exercise[] = list;
export const byId = (id: string): Exercise | undefined => list.find((e) => e.id === id);

/** The prototype's session names mapped to library ids. */
export const ALIASES: Record<string, string> = {
  "Sit to stand": "squat-2",
  "Wall press-up": "push-1",
  "Step-up": "lunge-3",
  "Band pull-apart": "pulldown-1",
  "Side plank": "rotation-5",
  "Goblet squat": "squat-4",
  "Glute bridge": "hinge-1",
  "Incline press-up": "push-2",
  "Bent-over row": "row-4",
  "Dead bug": "core-2",
};
