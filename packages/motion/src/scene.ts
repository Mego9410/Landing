// Turns a solved skeleton plus props into flat shapes (lines, circles, rects, paths). Renderers (animated SVG, React
// Native) draw these shapes; the SVG renderer animates any attribute that changes between frames.
import { backDepth, castById, castFigure, footShadow, type PathShape } from "./cast.ts";
export { footShadow };
import { FLOOR, L, type Pt, type Skeleton } from "./rig.ts";

export type Shape =
  | { id: string; kind: "line"; x1: number; y1: number; x2: number; y2: number; stroke: string; width: number; dash?: string }
  | { id: string; kind: "circle"; cx: number; cy: number; r: number; fill: string }
  | { id: string; kind: "rect"; x: number; y: number; w: number; h: number; rx: number; fill: string }
  | PathShape;

// Steadie palette (light values from the design system tokens).
export const COLOR = {
  near: "#5A4A8E", // lilac-ink: torso and near limbs
  far: "#BFB0E4", // lilac, deepened: far limbs
  head: "#F4B593", // apricot, deepened: the sun-disc head
  ground: "#CDE3D2", // sage horizon
  prop: "#E6DCD0", // furniture
  propEdge: "#D3C6B8",
  weight: "#285E7E", // sky-ink: dumbbells, kettlebells
  bottle: "#8EC1DD",
  band: "#E0A13C",
  bag: "#2F6142",
  cushion: "#F6E5AC",
  towel: "#EFC3A0",
};

const W = { torso: 21, limb: 13, foot: 10 };

const line = (id: string, a: Pt, b: Pt, stroke: string, width: number): Shape => ({ id, kind: "line", x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke, width });
const rect = (id: string, x: number, y: number, w: number, h: number, fill: string, rx = 4): Shape => ({ id, kind: "rect", x, y, w, h, rx, fill });
const circle = (id: string, c: Pt, r: number, fill: string): Shape => ({ id, kind: "circle", cx: c[0], cy: c[1], r, fill });

/** Props that sit in the scene. Positions are in the 240 × 200 box. */
export type Prop =
  | { kind: "chair"; x: number; seat: number; flip?: boolean } // x = front edge of the seat, seat = seat top y; back rest behind (−x), or ahead when flipped
  | { kind: "counter"; x: number; top: number } // a kitchen counter or table edge facing the figure, extends to +x
  | { kind: "wall"; x: number; flip?: boolean } // wall face at x, extending to +x (or to −x when flipped: a wall behind the figure)
  | { kind: "step"; x: number; w: number; h: number }
  | { kind: "bench"; x: number; w: number; top: number }
  | { kind: "mat"; x: number; w: number }
  | { kind: "bar"; x1: number; x2: number; y: number; posts?: boolean } // pull-up bar, table edge, park bar
  | { kind: "cushion"; x: number; w: number }
  | { kind: "stack"; x: number; pulley: Pt } // cable machine column with a pulley
  | { kind: "pad"; a: Pt; b: Pt; w?: number } // machine seat or back pad, drawn as a thick rounded bar
  | { kind: "anchor"; at: Pt } // where a band is tied
  | { kind: "block"; x: number; y: number; w: number; h: number } // a machine frame or base
  | { kind: "band"; from: Pt; hand: 0 | 1 | "both" }
  | { kind: "bandBetween" } // a band held between the hands // resistance band from an anchor to the hand(s)
  | { kind: "cable"; hand: 0 | 1 | "both" } // cable from the stack pulley to the hand(s)
  | { kind: "bandUnderFeet"; hand: "both" | 0 | 1 } // standing on the band
  | { kind: "held"; item: "dumbbell" | "dumbbellV" | "kettlebell" | "bottle" | "bag" | "backpack" | "handle" | "wheel" | "pole"; hand: 0 | 1 | "both" | "chest" }
  | { kind: "dowel" } // broom handle along the back
  | { kind: "wornBackpack" }
  | { kind: "sled"; x: number; y: number } // leg press footplate, moves with the feet
  | { kind: "barbell"; hands: true } // a bar held in both hands (side view: a disc at the hands)
  | { kind: "towel"; foot: 0 | 1 }
  | { kind: "towelHands" } // a towel held in both hands, its ends hanging
  | { kind: "towelFeet" } // a towel looped round the soles of the feet, an end in each hand
  | { kind: "kneeCushion" }; // a cushion squeezed between the knees

/** The drawing box: a little headroom above y = 0 for overhead reaches and raised steps. Ratio about 6:5. */
export const VIEWBOX = { x: -15, y: -22, w: 270, h: 224 };

export function ground(): Shape[] {
  return [rect("ground", 0, FLOOR, 240, 11, COLOR.ground, 5.5)];
}

function staticProp(p: Prop, i: number): Shape[] {
  const id = (s: string) => `p${i}-${s}`;
  switch (p.kind) {
    case "chair": return p.flip ? [
      rect(id("back"), p.x + 39, p.seat - 50, 7, 50, COLOR.propEdge),
      rect(id("seat"), p.x - 2, p.seat, 46, 7, COLOR.prop),
      rect(id("leg1"), p.x, p.seat + 6, 5, FLOOR - p.seat - 6, COLOR.propEdge, 2),
      rect(id("leg2"), p.x + 38, p.seat + 6, 5, FLOOR - p.seat - 6, COLOR.propEdge, 2),
    ] : [
      rect(id("back"), p.x - 44, p.seat - 50, 7, 50, COLOR.propEdge),
      rect(id("seat"), p.x - 44, p.seat, 46, 7, COLOR.prop),
      rect(id("leg1"), p.x - 42, p.seat + 6, 5, FLOOR - p.seat - 6, COLOR.propEdge, 2),
      rect(id("leg2"), p.x - 4, p.seat + 6, 5, FLOOR - p.seat - 6, COLOR.propEdge, 2),
    ];
    case "counter": return [rect(id("top"), p.x, p.top, 240 - p.x, 8, COLOR.propEdge, 3), rect(id("body"), p.x + 4, p.top + 8, 240 - p.x, FLOOR - p.top - 8, COLOR.prop, 3)];
    case "wall": return p.flip
      ? [rect(id("wall"), 0, 0, p.x, FLOOR, COLOR.prop, 0), rect(id("edge"), p.x - 4, 0, 4, FLOOR, COLOR.propEdge, 0)]
      : [rect(id("wall"), p.x, 0, 240 - p.x, FLOOR, COLOR.prop, 0), rect(id("edge"), p.x, 0, 4, FLOOR, COLOR.propEdge, 0)];
    case "step": return [rect(id("step"), p.x, FLOOR - p.h, p.w, p.h, COLOR.prop, 4), rect(id("lip"), p.x, FLOOR - p.h, p.w, 5, COLOR.propEdge, 3)];
    case "bench": return [rect(id("top"), p.x, p.top, p.w, 9, COLOR.propEdge, 4), rect(id("l1"), p.x + 8, p.top + 8, 6, FLOOR - p.top - 8, COLOR.prop, 2), rect(id("l2"), p.x + p.w - 14, p.top + 8, 6, FLOOR - p.top - 8, COLOR.prop, 2)];
    case "mat": return [rect(id("mat"), p.x, FLOOR - 4, p.w, 6, COLOR.cushion, 3)];
    case "bar": return [
      ...(p.posts ? [rect(id("post1"), p.x1, p.y, 6, FLOOR - p.y, COLOR.prop, 2), rect(id("post2"), p.x2 - 6, p.y, 6, FLOOR - p.y, COLOR.prop, 2)] : []),
      line(id("bar"), [p.x1, p.y], [p.x2, p.y], COLOR.propEdge, 6),
    ];
    case "cushion": return [rect(id("cushion"), p.x, FLOOR - 9, p.w, 10, COLOR.cushion, 5)];
    case "stack": return [rect(id("col"), p.x, 20, 18, FLOOR - 20, COLOR.prop, 4), circle(id("pulley"), p.pulley, 5, COLOR.propEdge)];
    case "pad": return [line(id("pad"), p.a, p.b, COLOR.propEdge, p.w ?? 12)];
    case "block": return [rect(id("block"), p.x, p.y, p.w, p.h, COLOR.prop, 5)];
    case "anchor": return [circle(id("anchor"), p.at, 4, COLOR.propEdge)];
    default: return [];
  }
}

function held(item: string, at: Pt, idp: string): Shape[] {
  const [x, y] = at;
  switch (item) {
    case "dumbbell": return [line(`${idp}-bar`, [x - 9, y], [x + 9, y], COLOR.weight, 4), rect(`${idp}-a`, x - 13, y - 7, 6, 14, COLOR.weight, 2), rect(`${idp}-b`, x + 7, y - 7, 6, 14, COLOR.weight, 2)];
    case "dumbbellV": return [line(`${idp}-bar`, [x, y - 9], [x, y + 9], COLOR.weight, 4), rect(`${idp}-a`, x - 7, y - 14, 14, 6, COLOR.weight, 2), rect(`${idp}-b`, x - 7, y + 8, 14, 6, COLOR.weight, 2)];
    case "handle": return [line(`${idp}-h`, [x - 4, y], [x + 4, y], COLOR.weight, 6)];
    case "wheel": return [circle(`${idp}-w`, [x, y + 1], 9, COLOR.weight), circle(`${idp}-hub`, [x, y + 1], 3, COLOR.bottle)];
    case "kettlebell": return [circle(`${idp}-bell`, [x, y + 11], 10, COLOR.weight), line(`${idp}-handle`, [x - 5, y], [x + 5, y], COLOR.weight, 4)];
    case "bottle": return [rect(`${idp}-body`, x - 5, y - 9, 10, 20, COLOR.bottle, 4), rect(`${idp}-cap`, x - 3, y - 12, 6, 4, COLOR.weight, 1)];
    case "bag": return [rect(`${idp}-bag`, x - 10, y + 2, 20, 22, COLOR.bag, 4), line(`${idp}-h`, [x, y + 3], [x, y - 1], COLOR.bag, 3)];
    case "backpack": return [rect(`${idp}-pack`, x - 11, y - 6, 22, 24, COLOR.bag, 7)];
    case "pole": return [circle(`${idp}-pole`, [x, y], 4, "#B98A5A")]; // a broom handle seen end-on
    default: return [];
  }
}

const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

function dynamicProp(p: Prop, i: number, s: Skeleton, props: Prop[], who: string): { back: Shape[]; front: Shape[] } {
  const backOff = backDepth(who) + 4;
  const id = (x: string) => `d${i}-${x}`;
  const hands = (h: 0 | 1 | "both") => (h === "both" ? [0, 1] : [h]);
  switch (p.kind) {
    case "band": return { back: [], front: hands(p.hand).map((k) => line(id(`b${k}`), p.from, s.arms[k].hand, COLOR.band, 3)) };
    case "bandBetween": return { back: [], front: [line(id("bb"), s.arms[0].hand, s.arms[1].hand, COLOR.band, 4)] };
    case "bandUnderFeet": return { back: [], front: hands(p.hand).map((k) => line(id(`b${k}`), s.legs[k].ankle, s.arms[k].hand, COLOR.band, 3)) };
    case "cable": {
      const stack = props.find((q) => q.kind === "stack") as Extract<Prop, { kind: "stack" }> | undefined;
      const from = stack?.pulley ?? [0, 0];
      return { back: [], front: hands(p.hand).map((k) => line(id(`c${k}`), from, s.arms[k].hand, COLOR.near, 2)) };
    }
    case "held": {
      if (p.hand === "chest") return { back: [], front: held(p.item, mid(s.arms[0].hand, s.arms[1].hand), id("h")) };
      return { back: [], front: hands(p.hand).flatMap((k) => held(p.item, s.arms[k].hand, id(`h${k}`))) };
    }
    case "dowel": {
      const sp = unitv([s.neck[0] - s.hip[0], s.neck[1] - s.hip[1]]);
      const back: Pt = [sp[1], -sp[0]]; // perpendicular, behind the back for a right-facing figure
      const o = (pt: Pt, d: number): Pt => [pt[0] + back[0] * backOff + sp[0] * d, pt[1] + back[1] * backOff + sp[1] * d];
      return { back: [], front: [line(id("dowel"), o(s.hip, -14), o(s.hip, L.torso + 30), "#B98A5A", 4)] };
    }
    case "wornBackpack": {
      const sp = unitv([s.neck[0] - s.hip[0], s.neck[1] - s.hip[1]]);
      const c: Pt = [s.hip[0] + sp[0] * 32 + sp[1] * (backOff + 6), s.hip[1] + sp[1] * 32 - sp[0] * (backOff + 6)];
      return { back: held("backpack", c, id("bp")), front: [] };
    }
    case "sled": {
      const f = s.legs[0];
      return { back: [line(id("plate"), [f.toe[0] + 4, f.toe[1] - 24], [f.toe[0] + 4, f.toe[1] + 16], COLOR.propEdge, 8)], front: [] };
    }
    case "barbell": {
      const c = mid(s.arms[0].hand, s.arms[1].hand);
      return { back: [], front: [circle(id("plate"), c, 15, COLOR.weight), circle(id("hub"), c, 4, COLOR.bottle)] };
    }
    case "towel": {
      const f = s.legs[p.foot];
      return { back: [rect(id("towel"), f.toe[0] - 6, FLOOR - 9, 18, 9, COLOR.cushion, 3)], front: [] };
    }
    case "towelHands": {
      const c = mid(s.arms[0].hand, s.arms[1].hand);
      return { back: [line(id("tw1"), [c[0] - 3, c[1]], [c[0] - 5, c[1] + 15], COLOR.towel, 7), line(id("tw2"), [c[0] + 3, c[1]], [c[0] + 5, c[1] + 15], COLOR.towel, 7)], front: [] };
    }
    case "towelFeet": return { back: [], front: [0, 1].map((k) => line(id(`tf${k}`), s.legs[k].toe, s.arms[k].hand, COLOR.towel, 5)) };
    case "kneeCushion": {
      const k = s.legs[0].knee;
      return { back: [rect(id("kc"), k[0] - 22, k[1] - 24, 24, 32, COLOR.cushion, 8)], front: [] };
    }
    default: return { back: [], front: [] };
  }
}
function unitv(v: Pt): Pt { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; }

/** All shapes for one frame, back to front. */
export function frameShapes(s: Skeleton, props: Prop[], who = "maya"): Shape[] {
  const statics = props.flatMap(staticProp);
  const dyn = props.map((p, i) => dynamicProp(p, i, s, props, who));
  const f = castFigure(s, castById(who));
  return [
    ...ground(),
    ...footShadow(s),
    ...statics,
    ...f.far,
    ...dyn.flatMap((d) => d.back),
    ...f.body,
    ...f.near,
    ...dyn.flatMap((d) => d.front),
  ];
}
