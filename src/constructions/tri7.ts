// T-01 / #7 — Right triangle from the hypotenuse + one leg.
// Given: hypotenuse c, leg b (= BC). Draw BC, erect a perpendicular at B,
// then strike an arc of radius c FROM C (not from B) to cut the perpendicular
// at A — the right angle sits opposite the hypotenuse, at B.
import { angleOf, intersectCircleLine, pointAtDistanceAngle, pt } from "@/geom/core";
import { perpendicularAtPoint } from "./classicOps";
import { arcEnt, arcSweepTo, rightAngleEnt, segEnt, toolCompass, toolRuler } from "./stepHelpers";
import { registerConstruction } from "./registry";
import type { ConstructionMeta } from "./types";

function geometry(inputs: Record<string, number>) {
  const { c, b } = inputs;
  const B = pt(0, 0, "B");
  const C = pt(b, 0, "C");
  const Efar = pt(0, Math.max(c, b) * 1.3, "E");
  const cands = intersectCircleLine(C, c, B, Efar);
  const A = cands ? (cands[0].y >= cands[1].y ? cands[0] : cands[1]) : pt(0, Math.sqrt(Math.max(0.01, c * c - b * b)));
  A.label = "A";
  A.labelEn = "A";
  const perp = perpendicularAtPoint(B, angleOf(B, C), 1, Math.min(b, c) * 0.4);
  const beyond = pointAtDistanceAngle(B, b * 0.3, perp.alongDirDeg + 180);
  return { B, C, Efar, A, perp, beyond };
}

const meta: ConstructionMeta = registerConstruction({
  id: "tri-7",
  index: 7,
  topic: "T01",
  title: { bn: "৭। অতিভুজ ও একটি বাহু দিয়ে সমকোণী ত্রিভুজ", en: "7. Right triangle from hypotenuse + one leg" },
  boardTags: "[JB,DB'25…]",
  givenSummary: (i) => ({
    bn: `অতিভুজ = ${i.c} সেমি, একটি বাহু BC = ${i.b} সেমি — এমন সমকোণী △ABC আঁকতে হবে (সমকোণ B-তে)।`,
    en: `Hypotenuse = ${i.c} cm, one leg BC = ${i.b} cm — construct a right triangle △ABC (right angle at B).`,
  }),
  inputs: [
    { key: "c", label: { bn: "অতিভুজ", en: "hypotenuse" }, unit: "cm", defaultValue: 5, min: 4, max: 10, step: 0.5 },
    { key: "b", label: { bn: "বাহু BC", en: "leg BC" }, unit: "cm", defaultValue: 4, min: 2, max: 9, step: 0.5 },
  ],
  validate: (i) => {
    if (i.b >= i.c * 0.98) {
      return { bn: "একটি বাহু (BC) অবশ্যই অতিভুজের চেয়ে ছোট হতে হবে।", en: "The given leg (BC) must be shorter than the hypotenuse." };
    }
    return null;
  },
  scale: 65,
  steps: [
    {
      id: "s1",
      title: { bn: "ধাপ ১: BC = বাহু আঁকো", en: "Step 1: Draw BC = leg" },
      narration: { bn: "একটি রশ্মিতে BC = প্রদত্ত বাহুর দৈর্ঘ্য কেটে নাও।", en: "On a ray, cut BC equal to the given leg." },
      tool: "ruler",
      action: "markLength",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { B: g.B, C: g.C }, entities: [segEnt(g.B, g.C, "given")], toolAnim: toolRuler(g.B, g.C) };
      },
    },
    {
      id: "s2a",
      title: { bn: "ধাপ ২ক: CB-কে B-এর ওপারে বাড়িয়ে চাপ আঁকো", en: "Step 2a: Extend CB beyond B, strike an arc" },
      narration: { bn: "CB রেখাকে B-এর ওপারে সামান্য বাড়াও, তারপর B কেন্দ্র করে একটি চাপ আঁকো যা রেখাটিকে দুই পাশে ছেদ করে।", en: "Extend CB a little beyond B, then centred at B strike an arc crossing the line on both sides." },
      tool: "compass",
      action: "dropPerpendicular",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { r, alongDirDeg } = g.perp;
        return {
          entities: [segEnt(g.B, g.beyond, "construction", 0, true), arcEnt(g.B, r, alongDirDeg, alongDirDeg + 180, "construction")],
          toolAnim: toolCompass(g.B, r, alongDirDeg, alongDirDeg + 180),
        };
      },
    },
    {
      id: "s2b",
      title: { bn: "ধাপ ২খ: দুই বিন্দু থেকে সমান ব্যাসার্ধে চাপ", en: "Step 2b: Equal-radius arcs from those two points" },
      narration: { bn: "সেই দুই বিন্দু থেকে সমান, বড় ব্যাসার্ধে দুটি চাপ আঁকো।", en: "From those two points, strike two equal, larger-radius arcs." },
      tool: "compass",
      action: "dropPerpendicular",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { M, r2, X } = g.perp;
        const sw = arcSweepTo(M, X, { padding: 8 });
        return { entities: [arcEnt(M, r2, sw.startAngle, sw.endAngle, "construction")], toolAnim: toolCompass(M, r2, sw.startAngle, sw.endAngle) };
      },
    },
    {
      id: "s2c",
      title: { bn: "ধাপ ২গ: দ্বিতীয় সমান চাপ — লম্ব রশ্মি BE", en: "Step 2c: Second equal arc — perpendicular ray BE" },
      narration: { bn: "একই ব্যাসার্ধে অন্য বিন্দু থেকেও চাপ আঁকো; ছেদবিন্দু দিয়ে B থেকে রশ্মি BE আঁকলেই তা BC-এর ওপর ঠিক লম্ব হয়।", en: "Strike the same-radius arc from the other point; ray BE from B through the crossing point is exactly perpendicular to BC." },
      tool: "compass",
      action: "dropPerpendicular",
      radiusLockRef: "s2b",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { N, r2, X } = g.perp;
        const sw = arcSweepTo(N, X, { padding: 8 });
        return {
          entities: [arcEnt(N, r2, sw.startAngle, sw.endAngle, "construction"), segEnt(g.B, g.Efar, "construction"), rightAngleEnt(g.B, g.C, g.Efar)],
          toolAnim: toolCompass(N, r2, sw.startAngle, sw.endAngle),
        };
      },
    },
    {
      id: "s3",
      title: { bn: "ধাপ ৩: C থেকে অতিভুজ-ব্যাসার্ধে চাপ আঁকো — A বিন্দু", en: "Step 3: Arc from C with radius = hypotenuse — point A" },
      narration: { bn: "C বিন্দু থেকে অতিভুজের সমান ব্যাসার্ধে একটি চাপ আঁকো, যা BE-কে A বিন্দুতে ছেদ করে।", en: "From C, strike an arc with radius equal to the hypotenuse, cutting BE at A." },
      tool: "compass",
      action: "drawArc",
      caution: {
        bn: "⚠️ কম্পাসের ব্যাসার্ধ অতিভুজের সমান হতে হবে এবং কেন্দ্র C-তে বসাতে হবে — B থেকে মাপা যাবে না।",
        en: "⚠️ The compass radius must equal the hypotenuse and be centred at C — not measured from B.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { A: g.A },
          entities: [],
          toolAnim: toolCompass(g.C, inputs.c, 105, 165, `${inputs.c} সেমি`),
        };
      },
    },
    {
      id: "s4",
      title: { bn: "ধাপ ৪: A, C যুক্ত করো — △ABC সম্পন্ন", en: "Step 4: Join A, C — △ABC complete" },
      narration: { bn: "A ও C যুক্ত করলেই কাঙ্ক্ষিত সমকোণী △ABC পাওয়া যায় (সমকোণ B-তে)।", en: "Joining A and C gives the required right triangle △ABC (right angle at B)." },
      tool: "ruler",
      action: "joinPoints",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [segEnt(g.B, g.A, "final"), segEnt(g.A, g.C, "final")], toolAnim: toolRuler(g.A, g.C) };
      },
    },
  ],
});

export default meta;
