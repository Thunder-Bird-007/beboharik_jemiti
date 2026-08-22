// T-02 / #11 — Parallelogram from two diagonals + one side.
// Given: diagonals P, Q, one side R. This is the flagship "radius unchanged"
// demo: after finding the diagonals' midpoint O from two arcs (P/2 from A,
// Q/2 from B), the compass is re-opened to the EXACT length AO (and BO) and
// that exact opening is stepped off again beyond O to find C (and D).
import { intersectCircleCircle, pt } from "@/geom/core";
import { segEnt, toolCompass, toolRuler } from "./stepHelpers";
import { registerConstruction } from "./registry";
import type { ConstructionMeta } from "./types";

function geometry(inputs: Record<string, number>) {
  const { P, Q, R } = inputs;
  const A = pt(0, 0, "A");
  const B = pt(R, 0, "B");
  const cands = intersectCircleCircle(A, P / 2, B, Q / 2);
  const O = cands ? (cands[0].y >= cands[1].y ? cands[0] : cands[1]) : pt(R / 2, Math.min(P, Q) / 3);
  O.label = "O";
  O.labelEn = "O";
  const C = pt(2 * O.x - A.x, 2 * O.y - A.y, "C");
  const D = pt(2 * O.x - B.x, 2 * O.y - B.y, "D");
  return { A, B, O, C, D };
}

const meta: ConstructionMeta = registerConstruction({
  id: "quad-11",
  index: 11,
  topic: "T02",
  title: { bn: "১১। দুই কর্ণ ও একটি বাহু দিয়ে সামান্তরিক", en: "11. Parallelogram from two diagonals + one side" },
  boardTags: "[RB,DB'25…]",
  givenSummary: (i) => ({
    bn: `কর্ণদ্বয় P = ${i.P} সেমি, Q = ${i.Q} সেমি এবং একটি বাহু R = ${i.R} সেমি — এমন সামান্তরিক ABCD আঁকতে হবে।`,
    en: `Diagonals P = ${i.P} cm, Q = ${i.Q} cm, and one side R = ${i.R} cm — construct parallelogram ABCD.`,
  }),
  inputs: [
    { key: "P", label: { bn: "কর্ণ P", en: "diagonal P" }, unit: "cm", defaultValue: 7.5, min: 4, max: 11, step: 0.5 },
    { key: "Q", label: { bn: "কর্ণ Q", en: "diagonal Q" }, unit: "cm", defaultValue: 5, min: 3, max: 9, step: 0.5 },
    { key: "R", label: { bn: "বাহু R (AB)", en: "side R (AB)" }, unit: "cm", defaultValue: 5.5, min: 3, max: 9, step: 0.5 },
  ],
  validate: (i) => {
    const half1 = i.P / 2;
    const half2 = i.Q / 2;
    if (i.R >= half1 + half2 || i.R <= Math.abs(half1 - half2)) {
      return {
        bn: "P/2, Q/2 ও R দিয়ে ত্রিভুজ গঠন সম্ভব হতে হবে (ত্রিভুজ অসমতা) — মানগুলো পরিবর্তন করো।",
        en: "P/2, Q/2 and R must be able to form a triangle (triangle inequality) — adjust the values.",
      };
    }
    return null;
  },
  scale: 62,
  steps: [
    {
      id: "s1",
      title: { bn: "ধাপ ১: AB = R আঁকো", en: "Step 1: Draw AB = R" },
      narration: { bn: "একটি রশ্মিতে AB = R কেটে নাও।", en: "On a ray, cut AB equal to the given side R." },
      tool: "ruler",
      action: "markLength",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { A: g.A, B: g.B }, entities: [segEnt(g.A, g.B, "given")], toolAnim: toolRuler(g.A, g.B) };
      },
    },
    {
      id: "s2",
      title: { bn: "ধাপ ২: A থেকে P/2 ব্যাসার্ধে চাপ", en: "Step 2: Arc from A with radius P/2" },
      narration: { bn: "A কেন্দ্র করে P/2 ব্যাসার্ধে একটি চাপ আঁকো।", en: "Centred at A, strike an arc with radius P/2." },
      tool: "compass",
      action: "drawArc",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [], toolAnim: toolCompass(g.A, inputs.P / 2, 20, 90) };
      },
    },
    {
      id: "s3",
      title: { bn: "ধাপ ৩: B থেকে Q/2 ব্যাসার্ধে চাপ — O বিন্দু", en: "Step 3: Arc from B with radius Q/2 — point O" },
      narration: { bn: "B কেন্দ্র করে Q/2 ব্যাসার্ধে একই পাশে একটি চাপ আঁকো; দুই চাপ মিলিত হয় O বিন্দুতে।", en: "Centred at B with radius Q/2, strike an arc on the same side; the arcs meet at O." },
      tool: "compass",
      action: "drawArc",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { O: g.O }, entities: [], toolAnim: toolCompass(g.B, inputs.Q / 2, 90, 160) };
      },
    },
    {
      id: "s4",
      title: { bn: "ধাপ ৪: A,O এবং B,O যুক্ত করো", en: "Step 4: Join A,O and B,O" },
      narration: { bn: "A ও B — উভয় বিন্দু থেকেই O পর্যন্ত রেখাংশ আঁকো।", en: "Draw segments from both A and B to O." },
      tool: "ruler",
      action: "joinPoints",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [segEnt(g.A, g.O, "given"), segEnt(g.B, g.O, "given")], toolAnim: toolRuler(g.A, g.O) };
      },
    },
    {
      id: "s5",
      title: { bn: "ধাপ ৫: AO বাড়িয়ে C বিন্দু (OC = AO)", en: "Step 5: Extend AO to C (OC = AO)" },
      narration: { bn: "কম্পাসে AO-এর ঠিক মাপ নিয়ে, O-এর ওপারে AO রশ্মিতে একই দূরত্বে C বসাও।", en: "Open the compass to the exact length AO, then step it off again beyond O to place C." },
      tool: "compass",
      action: "extendRay",
      radiusLockRef: "s4",
      caution: {
        bn: "🔒 এটি এই পুরো অধ্যায়ের সবচেয়ে গুরুত্বপূর্ণ কম্পাস-শৃঙ্খলার উদাহরণ: কম্পাস AO-এর মাপে খুলে ঠিক সেই একই ব্যাসার্ধ O থেকে পুনরায় বসানো হচ্ছে — নতুন করে মাপা যাবে না।",
        en: "🔒 The flagship compass-discipline example of this whole chapter: open the compass to exactly AO and reuse that exact opening from O — never re-measure it.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { C: g.C }, entities: [], toolAnim: toolCompass(g.O, Math.hypot(g.O.x - g.A.x, g.O.y - g.A.y), 200, 260, "= AO") };
      },
    },
    {
      id: "s6",
      title: { bn: "ধাপ ৬: BO বাড়িয়ে D বিন্দু (OD = BO)", en: "Step 6: Extend BO to D (OD = BO)" },
      narration: { bn: "একই শৃঙ্খলায়, কম্পাসে BO-এর মাপ নিয়ে O-এর ওপারে D বসাও।", en: "With the same discipline, open the compass to BO and place D beyond O." },
      tool: "compass",
      action: "extendRay",
      radiusLockRef: "s4",
      caution: {
        bn: "🔒 এখানেও একই নিয়ম — BO-এর মাপেই D বসাতে হবে, অন্য কোনো মাপে নয়।",
        en: "🔒 The same rule again — D must be placed using exactly the BO opening, nothing else.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { D: g.D }, entities: [], toolAnim: toolCompass(g.O, Math.hypot(g.O.x - g.B.x, g.O.y - g.B.y), 20, 80, "= BO") };
      },
    },
    {
      id: "s7",
      title: { bn: "ধাপ ৭: B,C ও C,D ও D,A যুক্ত করো — সম্পন্ন", en: "Step 7: Join B,C and C,D and D,A — complete" },
      narration: { bn: "B-C, C-D, D-A যুক্ত করলেই কাঙ্ক্ষিত সামান্তরিক ABCD পাওয়া যায়।", en: "Joining B-C, C-D, D-A gives the required parallelogram ABCD." },
      tool: "ruler",
      action: "joinPoints",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          entities: [segEnt(g.B, g.C, "final"), segEnt(g.C, g.D, "final"), segEnt(g.D, g.A, "final")],
          toolAnim: toolRuler(g.B, g.C),
        };
      },
    },
  ],
});

export default meta;
