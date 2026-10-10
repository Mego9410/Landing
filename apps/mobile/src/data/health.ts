// The health check in onboarding: our own questions, modelled on PAR-Q+ (which is copyrighted), following the
// movement plan §4.2. Three kinds of answer:
//   gp      any yes pauses strength sessions until they say they've checked with their GP. Food and habits carry on.
//   refer   pregnancy or kidney disease: a referral note, then they can carry on only by ticking a box (§4.2.1).
//           The adaptations stay on whatever they tick.
//   gentle  sets preferences (easier versions first, notes), never excludes.
// Bump HEALTH_VERSION when the wording changes, so everyone is asked again. Asked again every 12 weeks too.

export const HEALTH_VERSION = 1;
export const RECHECK_DAYS = 84;

export type HealthKind = "gp" | "refer" | "gentle";
export interface HealthQuestion { id: string; kind: HealthKind; ask: string; detail?: string }

export const HEALTH_QUESTIONS: HealthQuestion[] = [
  { id: "chest", kind: "gp", ask: "Do you get chest pain, or breathlessness you can't explain?" },
  { id: "faint", kind: "gp", ask: "Have you fainted or blacked out in the last 12 months?" },
  { id: "heart", kind: "gp", ask: "Has a heart condition been diagnosed or changed in the last 12 months?" },
  { id: "surgery", kind: "gp", ask: "Have you had surgery in the last 3 months, or been told to exercise only with supervision?" },
  { id: "bp", kind: "gp", ask: "Is your blood pressure very high and not yet under control?" },
  { id: "pregnant", kind: "refer", ask: "Are you pregnant, or did you give birth in the last 12 weeks?" },
  { id: "kidney", kind: "refer", ask: "Do you have kidney disease?" },
  { id: "diabetes", kind: "gentle", ask: "Do you have diabetes treated with insulin or tablets like gliclazide?" },
  { id: "joints", kind: "gentle", ask: "Does joint or back pain affect your daily life?" },
  { id: "bones", kind: "gentle", ask: "Do you have osteoporosis, or have you broken a bone in a minor fall since 50?" },
  { id: "falls", kind: "gentle", ask: "Have you had a fall in the last year?" },
  { id: "floor", kind: "gentle", ask: "Is it hard for you to get down to the floor and back up?" },
  { id: "fatigue", kind: "gentle", ask: "Do you feel much worse for days after activity, or have ME/CFS?" },
  { id: "eating", kind: "gentle", ask: "Have you ever had an eating disorder, or think you might have one now?", detail: "If yes, we’ll hide weight by default and point you to support. You can still use everything else." },
];

/** Who to talk to, by referral. */
export const REFER = {
  pregnant: { who: "midwife or GP", note: "Pregnancy and the weeks after birth change what's right for food and exercise. Steadie will keep weight features and protein targets off, hide numbers, and use pregnancy-safe food filters." },
  kidney: { who: "kidney team or GP", note: "With kidney disease, protein and salt need care. Steadie will turn protein targets off and use low-salt cooking, but your kidney team's advice comes first." },
} as const;

export const NOTES: Partial<Record<string, string>> = {
  diabetes: "Keep your usual hypo plan to hand during sessions, and follow your diabetes team's advice on food.",
  joints: "Sessions start with the easier version of each move. Skip anything that hurts.",
  bones: "Sessions start with the easier version of each move, and avoid bending forward under load.",
  falls: "Do standing moves next to a wall or a sturdy chair, and start with the easier versions.",
  floor: "Sessions start with the easier versions. Swap any floor move for its easier version.",
  eating: "We’ll hide weight and numbers (safe mode), and you can change that in Settings. If food feels hard, Beat, the UK’s eating disorder charity, is there to talk to: 0808 801 0677, or beateatingdisorders.org.uk.",
  fatigue: "Go at your own pace. Sessions won't step up on their own, and it's fine to stop early.",
};
