import type { Category, Guide } from "@/content/guides";

// Guide illustrations: a flat scene in the brand's pastel shapes (the same language as the home page hero) with a
// motif for the guide's topic. One SVG, used on the guide page, the guide cards, the share image (and so the emails,
// which show the share image). Plain shapes and fixed colours only, so it also renders inside next/og.

const P = {
  apricot: "#F8C8AC", sage: "#CDE3D2", lilac: "#DDD5F2", sky: "#CCE2EF", butter: "#F6E5AC", rose: "#F4CFD0",
  apricotInk: "#C2643A", sageInk: "#2F6142", lilacInk: "#5A4A8E", skyInk: "#285E7E", butterInk: "#B58A1B", roseInk: "#983538",
  ink: "#2E2A33", white: "#FFFFFF", mark: "#DE6F44", cream: "#FBF1E4",
};

type Motif = "bowl" | "eggs" | "dumbbell" | "walk" | "moon" | "heart" | "calendar" | "coins" | "pill" | "glass" | "suitcase"
  | "tree" | "plate" | "wheat" | "chair" | "bubbles" | "clock" | "flower" | "sprout" | "cutlery" | "apple" | "basket" | "mark";

const BY_SLUG: Record<string, Motif> = {
  "what-are-glp-1-medicines": "pill", "glp-1-glossary": "bubbles", "coming-off-glp-1": "walk",
  "what-happens-when-you-stop-weight-loss-injections": "clock", "stopping-wegovy": "calendar", "stopping-mounjaro": "walk",
  "stopping-ozempic": "pill", "nhs-weight-loss-injections-time-limit": "calendar", "questions-to-ask-before-stopping-weight-loss-injections": "bubbles",
  "building-habits-before-you-stop": "sprout", "protein-after-glp-1": "eggs", "high-protein-breakfasts-uk": "eggs",
  "strength-training-after-glp-1": "dumbbell", "walking-to-keep-weight-off": "walk", "keep-weight-off-after-glp-1": "mark",
  "appetite-after-stopping-glp-1": "cutlery", "weight-after-stopping-glp-1": "mark", "cravings-after-stopping-glp-1": "apple",
  "sleep-stress-and-appetite": "moon", "eating-out-after-glp-1": "cutlery", "weight-loss-jab-price-rise-uk": "coins",
  "stopping-weight-loss-jabs-because-of-cost": "basket", "first-month-after-stopping-glp-1": "calendar", "muscle-loss-on-glp-1": "dumbbell",
  "high-protein-lunches-uk": "bowl", "strength-training-at-home-no-equipment": "chair", "emotional-eating-after-glp-1": "heart",
  "budget-high-protein-foods-uk": "basket", "alcohol-after-stopping-glp-1": "glass", "nhs-support-after-weight-loss-injections": "bubbles",
  "high-protein-snacks-uk": "apple", "strength-training-older-adults": "chair", "portion-sizes-without-counting": "plate",
  "body-image-after-weight-loss": "flower", "fibre-after-glp-1": "wheat", "weight-loss-tablets-uk": "pill",
  "easy-high-protein-dinners-uk": "bowl", "exercise-with-joint-pain": "walk", "christmas-after-weight-loss-jab": "tree",
  "eating-slowly-and-fullness": "clock", "holidays-and-travel-after-glp-1": "suitcase", "meal-prep-after-glp-1": "bowl",
  "menopause-and-weight-after-glp-1": "flower", "small-habits-that-stick": "sprout", "family-meals-after-glp-1": "plate",
  "new-year-without-a-diet": "sprout",
};
const BY_CATEGORY: Record<Category, Motif> = { "Coming off": "calendar", "Keeping it off": "mark", Food: "bowl", Movement: "dumbbell", Basics: "pill" };

/** Background, big soft shape and ground colours, by category. */
const TONES: Record<Category, [string, string, string][]> = {
  "Coming off": [[P.butter, P.sky, P.sage], [P.sky, P.butter, P.sage]],
  "Keeping it off": [[P.sage, P.lilac, P.sky], [P.lilac, P.sage, P.butter]],
  Food: [[P.apricot, P.butter, P.sage], [P.butter, P.apricot, P.sage]],
  Movement: [[P.sky, P.sage, P.butter], [P.sage, P.sky, P.apricot]],
  Basics: [[P.lilac, P.sky, P.rose], [P.rose, P.lilac, P.sky]],
};

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export const artFor = (g: Pick<Guide, "slug" | "category">) => {
  const h = hash(g.slug);
  const tones = TONES[g.category];
  return { motif: BY_SLUG[g.slug] ?? BY_CATEGORY[g.category], tone: tones[h % tones.length], variant: h % 3 };
};

/** The motifs, each drawn in a 200 × 200 box. */
function MotifShape({ m }: { m: Motif }) {
  switch (m) {
    case "bowl": return (<g>
      <path d="M78 52 q-8 -14 0 -26 M100 48 q-8 -14 0 -26 M122 52 q-8 -14 0 -26" stroke={P.white} strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="68" cy="96" rx="26" ry="18" fill={P.sageInk} /><ellipse cx="102" cy="90" rx="26" ry="18" fill={P.butter} /><ellipse cx="134" cy="97" rx="24" ry="17" fill={P.roseInk} />
      <path d="M28 100 h144 a72 72 0 0 1 -144 0 z" fill={P.white} /><rect x="76" y="168" width="48" height="10" rx="5" fill={P.white} />
    </g>);
    case "eggs": return (<g>
      <circle cx="100" cy="112" r="78" fill={P.ink} /><circle cx="100" cy="112" r="66" fill="#3A3540" />
      <path d="M58 92 c10 -26 44 -24 50 -4 c8 22 -4 44 -28 42 c-24 -2 -30 -20 -22 -38 z" fill={P.white} /><circle cx="82" cy="104" r="13" fill={P.butter} />
      <path d="M108 118 c8 -24 40 -22 46 0 c6 22 -6 40 -28 38 c-22 -2 -26 -20 -18 -38 z" fill={P.white} /><circle cx="128" cy="132" r="12" fill={P.butter} />
      <rect x="168" y="104" width="34" height="14" rx="7" fill={P.ink} />
    </g>);
    case "dumbbell": return (<g transform="rotate(-14 100 100)">
      <rect x="40" y="92" width="120" height="16" rx="8" fill={P.ink} />
      <rect x="22" y="58" width="26" height="84" rx="10" fill={P.ink} /><rect x="152" y="58" width="26" height="84" rx="10" fill={P.ink} />
      <rect x="6" y="72" width="18" height="56" rx="8" fill={P.ink} /><rect x="176" y="72" width="18" height="56" rx="8" fill={P.ink} />
      <rect x="28" y="66" width="6" height="40" rx="3" fill={P.white} opacity="0.35" /><rect x="158" y="66" width="6" height="40" rx="3" fill={P.white} opacity="0.35" />
    </g>);
    case "walk": return (<g>
      <path d="M10 180 C 60 150, 70 110, 110 96 S 170 60, 190 20" stroke={P.white} strokeWidth="28" fill="none" strokeLinecap="round" />
      {[[50, 150, -20], [72, 132, -30], [104, 112, -40], [126, 92, -50], [150, 70, -55]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x + (i % 2 ? 8 : -8)} cy={y} rx="6" ry="10" fill={P.ink} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <circle cx="168" cy="40" r="14" fill={P.mark} />
    </g>);
    case "moon": return (<g>
      <path d="M120 22 a80 80 0 1 0 60 120 a64 64 0 1 1 -60 -120 z" fill={P.white} />
      <circle cx="154" cy="48" r="6" fill={P.white} /><circle cx="176" cy="84" r="4" fill={P.white} /><circle cx="40" cy="38" r="5" fill={P.white} />
      <path d="M150 112 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z" fill={P.butter} />
    </g>);
    case "heart": return (<g>
      <path d="M100 176 C 20 120, 18 60, 58 44 C 80 36, 96 48, 100 64 C 104 48, 120 36, 142 44 C 182 60, 180 120, 100 176 z" fill={P.roseInk} />
      <path d="M62 64 c-10 6 -14 18 -12 28" stroke={P.white} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.6" />
      <circle cx="160" cy="34" r="8" fill={P.white} /><circle cx="30" cy="140" r="6" fill={P.white} />
    </g>);
    case "calendar": return (<g>
      <rect x="24" y="36" width="152" height="140" rx="20" fill={P.white} /><path d="M24 56 a20 20 0 0 1 20 -20 h112 a20 20 0 0 1 20 20 v20 h-152 z" fill={P.mark} />
      <rect x="56" y="22" width="12" height="30" rx="6" fill={P.ink} /><rect x="132" y="22" width="12" height="30" rx="6" fill={P.ink} />
      {[0, 1, 2, 3].flatMap((r) => [0, 1, 2, 3, 4].map((c) => <circle key={`${r}${c}`} cx={48 + c * 26} cy={98 + r * 22} r="5" fill={r === 2 && c === 3 ? P.mark : "#CFC6BC"} />))}
      <circle cx="126" cy="142" r="15" fill="none" stroke={P.ink} strokeWidth="4" />
    </g>);
    case "coins": return (<g>
      {[0, 1, 2, 3].map((i) => (<g key={i}><ellipse cx="70" cy={168 - i * 22} rx="46" ry="16" fill={P.butterInk} /><ellipse cx="70" cy={160 - i * 22} rx="46" ry="16" fill={P.butter} /></g>))}
      {[0, 1].map((i) => (<g key={i}><ellipse cx="140" cy={168 - i * 22} rx="40" ry="14" fill={P.butterInk} /><ellipse cx="140" cy={161 - i * 22} rx="40" ry="14" fill={P.butter} /></g>))}
      <path d="M150 92 V 30 M128 52 L150 28 L172 52" stroke={P.ink} strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>);
    case "pill": return (<g>
      <g transform="rotate(-35 90 100)"><rect x="30" y="72" width="120" height="56" rx="28" fill={P.white} /><path d="M90 72 h32 a28 28 0 0 1 0 56 h-32 z" fill={P.mark} /></g>
      <circle cx="152" cy="150" r="30" fill={P.white} /><rect x="128" y="146" width="48" height="8" rx="4" fill="#E2D9CF" />
      <circle cx="46" cy="160" r="16" fill={P.white} />
    </g>);
    case "glass": return (<g>
      <path d="M44 30 h76 c0 50 -14 74 -38 76 c-24 -2 -38 -26 -38 -76 z" fill={P.white} /><path d="M50 64 h64 c-4 26 -14 38 -32 40 c-18 -2 -28 -14 -32 -40 z" fill={P.roseInk} />
      <rect x="77" y="104" width="10" height="52" fill={P.white} /><ellipse cx="82" cy="160" rx="30" ry="9" fill={P.white} />
      <path d="M132 76 h46 l-6 92 h-34 z" fill={P.white} opacity="0.95" /><path d="M136 116 h38 l-3 50 h-32 z" fill={P.sky} />
    </g>);
    case "suitcase": return (<g>
      <rect x="72" y="26" width="56" height="26" rx="12" fill="none" stroke={P.ink} strokeWidth="9" />
      <rect x="26" y="48" width="148" height="122" rx="20" fill={P.mark} /><rect x="58" y="48" width="12" height="122" fill="#C85E36" /><rect x="130" y="48" width="12" height="122" fill="#C85E36" />
      <circle cx="100" cy="96" r="16" fill={P.butter} /><rect x="86" y="128" width="40" height="18" rx="9" fill={P.white} />
      <circle cx="54" cy="178" r="8" fill={P.ink} /><circle cx="146" cy="178" r="8" fill={P.ink} />
    </g>);
    case "tree": return (<g>
      <path d="M100 24 L150 94 H118 L168 156 H32 L82 94 H50 Z" fill={P.sageInk} /><rect x="88" y="156" width="24" height="26" rx="4" fill="#8A5A3B" />
      <path d="M100 6 l6 13 l14 2 l-10 10 l2 14 l-12 -7 l-12 7 l2 -14 l-10 -10 l14 -2 z" fill={P.butter} />
      <circle cx="84" cy="80" r="8" fill={P.roseInk} /><circle cx="120" cy="120" r="8" fill={P.butter} /><circle cx="70" cy="138" r="8" fill={P.white} /><circle cx="132" cy="146" r="7" fill={P.roseInk} />
    </g>);
    case "plate": return (<g>
      <circle cx="100" cy="100" r="86" fill={P.white} /><circle cx="100" cy="100" r="70" fill="#F4EEE6" />
      <path d="M100 100 L100 30 A70 70 0 0 1 100 170 Z" fill={P.sageInk} /><path d="M100 100 L100 170 A70 70 0 0 1 30 100 Z" fill={P.roseInk} opacity="0.85" />
      <path d="M100 100 L30 100 A70 70 0 0 1 100 30 Z" fill={P.butter} />
    </g>);
    case "wheat": return (<g>
      {[-22, 0, 22].map((r, i) => (<g key={i} transform={`rotate(${r} 100 186)`}>
        <rect x="97" y="70" width="6" height="116" rx="3" fill={P.butterInk} />
        {[0, 1, 2, 3].map((k) => (<g key={k}><ellipse cx="88" cy={40 + k * 16} rx="9" ry="14" fill={P.butter} transform={`rotate(-30 88 ${40 + k * 16})`} /><ellipse cx="112" cy={40 + k * 16} rx="9" ry="14" fill={P.butter} transform={`rotate(30 112 ${40 + k * 16})`} /></g>))}
        <ellipse cx="100" cy="26" rx="8" ry="13" fill={P.butter} />
      </g>))}
    </g>);
    case "chair": return (<g>
      <rect x="58" y="20" width="14" height="150" rx="7" fill="#C08E5E" /><rect x="58" y="34" width="72" height="12" rx="6" fill="#C08E5E" /><rect x="58" y="62" width="72" height="12" rx="6" fill="#C08E5E" />
      <rect x="50" y="100" width="100" height="18" rx="8" fill="#D9A877" /><rect x="136" y="112" width="14" height="66" rx="7" fill="#C08E5E" /><rect x="58" y="112" width="14" height="66" rx="7" fill="#C08E5E" />
      <circle cx="166" cy="56" r="20" fill={P.white} /><path d="M158 56 l6 6 l11 -12" stroke={P.sageInk} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>);
    case "bubbles": return (<g>
      <path d="M20 40 a20 20 0 0 1 20 -20 h90 a20 20 0 0 1 20 20 v44 a20 20 0 0 1 -20 20 h-66 l-24 20 v-20 a20 20 0 0 1 -20 -20 z" fill={P.white} />
      {[46, 74, 102].map((x) => <circle key={x} cx={x + 4} cy="62" r="8" fill={P.ink} />)}
      <path d="M180 112 a18 18 0 0 0 -18 -18 h-74 a18 18 0 0 0 -18 18 v38 a18 18 0 0 0 18 18 h52 l22 18 v-18 a18 18 0 0 0 18 -18 z" fill={P.mark} />
      <rect x="92" y="118" width="64" height="9" rx="4.5" fill={P.white} /><rect x="92" y="136" width="42" height="9" rx="4.5" fill={P.white} />
    </g>);
    case "clock": return (<g>
      <circle cx="100" cy="104" r="80" fill={P.white} /><circle cx="100" cy="104" r="80" fill="none" stroke={P.ink} strokeWidth="8" />
      {[0, 90, 180, 270].map((a) => <rect key={a} x="96" y="34" width="8" height="16" rx="4" fill={P.ink} transform={`rotate(${a} 100 104)`} />)}
      <path d="M100 104 V 58 M100 104 L 134 124" stroke={P.ink} strokeWidth="9" strokeLinecap="round" /><circle cx="100" cy="104" r="9" fill={P.mark} />
    </g>);
    case "flower": return (<g>
      <rect x="96" y="100" width="8" height="84" rx="4" fill={P.sageInk} /><ellipse cx="128" cy="150" rx="26" ry="11" fill={P.sageInk} transform="rotate(-30 128 150)" />
      {[0, 60, 120, 180, 240, 300].map((a) => <ellipse key={a} cx="100" cy="56" rx="20" ry="30" fill={a % 120 ? "#E58C8F" : "#9D8BD6"} transform={`rotate(${a} 100 86)`} />)}
      <circle cx="100" cy="86" r="20" fill={P.butter} />
    </g>);
    case "sprout": return (<g>
      <path d="M100 120 C 100 90, 96 70, 100 50" stroke={P.sageInk} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M100 76 C 70 80, 52 60, 50 36 C 76 34, 96 50, 100 76 z" fill={P.sageInk} /><path d="M100 62 C 124 64, 146 48, 150 24 C 124 22, 104 38, 100 62 z" fill="#4E8A62" />
      <path d="M52 116 h96 l-12 66 h-72 z" fill={P.mark} /><rect x="44" y="108" width="112" height="20" rx="8" fill="#C85E36" />
    </g>);
    case "cutlery": return (<g>
      <g transform="rotate(-18 100 100)"><rect x="64" y="20" width="8" height="54" rx="4" fill={P.white} /><rect x="80" y="20" width="8" height="54" rx="4" fill={P.white} /><rect x="96" y="20" width="8" height="54" rx="4" fill={P.white} />
        <path d="M60 64 h48 v10 a24 24 0 0 1 -24 24 a24 24 0 0 1 -24 -24 z" fill={P.white} /><rect x="77" y="92" width="14" height="92" rx="7" fill={P.white} /></g>
      <g transform="rotate(18 100 100)"><ellipse cx="134" cy="54" rx="22" ry="32" fill={P.white} /><rect x="127" y="80" width="14" height="104" rx="7" fill={P.white} /></g>
      <circle cx="40" cy="44" r="7" fill={P.white} /><circle cx="172" cy="150" r="9" fill={P.white} />
    </g>);
    case "apple": return (<g>
      <path d="M100 58 C 70 40, 28 56, 32 104 C 36 150, 70 186, 100 170 C 130 186, 164 150, 168 104 C 172 56, 130 40, 100 58 z" fill={P.roseInk} />
      <path d="M100 58 C 100 40, 106 28, 116 20" stroke="#6B4A2E" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M108 44 C 120 22, 146 22, 156 30 C 144 48, 122 52, 108 44 z" fill={P.sageInk} />
      <path d="M58 96 c0 -14 8 -24 18 -26" stroke={P.white} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.5" />
    </g>);
    case "basket": return (<g>
      <circle cx="74" cy="76" r="22" fill={P.roseInk} /><ellipse cx="110" cy="70" rx="16" ry="22" fill={P.white} /><rect x="124" y="44" width="30" height="54" rx="8" fill={P.sky} /><rect x="124" y="56" width="30" height="14" fill={P.white} />
      <path d="M50 96 C 50 40, 150 40, 150 96" stroke={P.ink} strokeWidth="8" fill="none" />
      <path d="M22 92 h156 l-18 86 h-120 z" fill={P.mark} />{[48, 76, 104, 132].map((x) => <rect key={x} x={x} y="110" width="10" height="52" rx="5" fill="#C85E36" />)}
    </g>);
    default: return (<g>
      <g transform="rotate(-12 100 160)"><path d="M100 48 C132 48 148 88 148 118 C148 144 126 160 100 160 C74 160 52 144 52 118 C52 88 68 48 100 48 Z" fill={P.mark} />
        <circle cx="100" cy="128" r="14" fill={P.cream} /></g>
      <rect x="62" y="172" width="76" height="10" rx="5" fill={P.mark} opacity="0.5" />
    </g>);
  }
}

/** The scene, 600 × 315 (the share image's shape). */
export function GuideArt({ guide, className, style, title, motifRight }: { guide: Pick<Guide, "slug" | "category">; className?: string; style?: React.CSSProperties; title?: string;
  /** Keep the motif on the right, clear of a title panel on the left (the share image). */ motifRight?: boolean }) {
  const { motif, tone: [bg, shape, ground], variant } = artFor(guide);
  const big = [{ cx: 470, cy: 60, r: 120 }, { cx: 120, cy: 40, r: 110 }, { cx: 500, cy: 260, r: 130 }][variant];
  const pos = motifRight ? { x: 336, y: 28 } : [{ x: 270, y: 26 }, { x: 290, y: 28 }, { x: 170, y: 26 }][variant];
  return (
    <svg viewBox="0 0 600 315" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <rect width="600" height="315" fill={bg} />
      <circle cx={big.cx} cy={big.cy} r={big.r} fill={shape} />
      <rect x={variant === 1 ? -60 : 40} y="250" width="620" height="110" rx="55" fill={ground} />
      <rect x={variant === 2 ? 420 : 60} y={variant === 2 ? 70 : 200} width="74" height="28" rx="14" fill={P.butter} opacity={bg === P.butter ? 0 : 1} />
      <circle cx={variant === 0 ? 90 : 520} cy={variant === 1 ? 210 : 120} r="26" fill={bg === P.apricot ? P.white : P.apricot} opacity="0.9" />
      <g transform={`translate(${pos.x} ${pos.y}) scale(1.3)`}>{MotifShape({ m: motif })}</g>
    </svg>
  );
}
