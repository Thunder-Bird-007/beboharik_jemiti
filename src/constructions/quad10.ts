// T-02 / #10 — Parallelogram from two diagonals + included angle, where the
// actual construction inputs are DERIVED from a triangle's data:
// d1 = (a+6)/2, d2 = 2d, included angle = x + 5.
import { pointAtDistanceAngle, pt } from "@/geom/core";
import { fmtCm, fmtDeg, fmtNum } from "@/lib/format";
import { angleMarkEnt, segEnt, toolCompass, toolProtractor, toolRuler } from "./stepHelpers";
import { registerConstruction } from "./registry";
import type { ConstructionMeta } from "./types";

function derived(inputs: Record<string, number>) {
  const d1 = (inputs.a + 6) / 2;
  const d2 = 2 * inputs.d;
  const angle = inputs.x + 5;
  return { d1, d2, angle };
}

function geometry(inputs: Record<string, number>) {
  const { d1, d2, angle } = derived(inputs);
  const A = pt(0, 0, "A");
  const C = pt(d1, 0, "C");
  const O = pt(d1 / 2, 0, "O");
  const F = pointAtDistanceAngle(O, d1 * 0.6, angle);
  F.label = "F";
  F.labelEn = "F";
  const G = pointAtDistanceAngle(O, d1 * 0.6, angle + 180);
  G.label = "G";
  G.labelEn = "G";
  const B = pointAtDistanceAngle(O, d2 / 2, angle);
  B.label = "B";
  B.labelEn = "B";
  const D = pointAtDistanceAngle(O, d2 / 2, angle + 180);
  D.label = "D";
  D.labelEn = "D";
  return { A, C, O, F, G, B, D, angle };
}

const meta: ConstructionMeta = registerConstruction({
  id: "quad-10",
  index: 10,
  topic: "T02",
  title: { bn: "১০। দুই কর্ণ ও অন্তর্ভুক্ত কোণ দিয়ে সামান্তরিক (নির্ণিত মান)", en: "10. Parallelogram from two diagonals + included angle (derived values)" },
  boardTags: "[CB,SB'25…]",
  derivedFrom: "tri-4",
  givenSummary: (i) => {
    const { d1, d2, angle } = derived(i);
    return {
      bn: `ত্রিভুজ থেকে: ভূমি a=${i.a}, ∠x=${i.x}°, অন্তর d=${i.d} ⇒ d১=(a+6)/2=${fmtCm(d1, "bn")}, d২=2d=${fmtCm(d2, "bn")}, অন্তর্ভুক্ত কোণ=x+5°=${fmtDeg(angle, "bn")}।`,
      en: `From the triangle: base a=${i.a}, ∠x=${i.x}°, difference d=${i.d} ⇒ d1=(a+6)/2=${fmtCm(d1, "en")}, d2=2d=${fmtCm(d2, "en")}, included angle=x+5°=${fmtDeg(angle, "en")}.`,
    };
  },
  inputs: [
    { key: "a", label: { bn: "ত্রিভুজের ভূমি a", en: "triangle base a" }, unit: "cm", defaultValue: 10, min: 6, max: 14, step: 0.5 },
    { key: "x", label: { bn: "∠x", en: "∠x" }, unit: "deg", defaultValue: 35, min: 15, max: 75, step: 1 },
    { key: "d", label: { bn: "বাহুর অন্তর d", en: "side difference d" }, unit: "cm", defaultValue: 3, min: 1, max: 6, step: 0.5 },
  ],
  scale: 55,
  steps: [
    {
      id: "s0",
      title: { bn: "ধাপ ০: নির্ণিত মান বের করো", en: "Step 0: Work out the derived values" },
      narration: (i) => {
        const { d1, d2, angle } = derived(i);
        return {
          bn: `d১ = (a+৬)/২ = (${fmtNum(i.a, "bn")}+৬)/২ = ${fmtCm(d1, "bn")}; d২ = ২d = ২×${fmtNum(i.d, "bn")} = ${fmtCm(d2, "bn")}; কোণ = x+৫° = ${fmtDeg(angle, "bn")}।`,
          en: `d1 = (a+6)/2 = (${fmtNum(i.a, "en")}+6)/2 = ${fmtCm(d1, "en")}; d2 = 2d = 2×${fmtNum(i.d, "en")} = ${fmtCm(d2, "en")}; angle = x+5° = ${fmtDeg(angle, "en")}.`,
        };
      },
      tool: "none",
      action: "info",
      compute: () => ({ entities: [], toolAnim: { tool: "none" } }),
    },
    {
      id: "s1",
      title: { bn: "ধাপ ১: AC = d১ আঁকো", en: "Step 1: Draw AC = d1" },
      narration: { bn: "একটি রশ্মিতে AC = d১ কেটে নাও।", en: "On a ray, cut AC equal to d1." },
      tool: "ruler",
      action: "markLength",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { A: g.A, C: g.C }, entities: [segEnt(g.A, g.C, "given")], toolAnim: toolRuler(g.A, g.C) };
      },
    },
    {
      id: "s2",
      title: { bn: "ধাপ ২: O = AC-এর মধ্যবিন্দু চিহ্নিত করো", en: "Step 2: Mark O, the midpoint of AC" },
      narration: { bn: "AC-এর মধ্যবিন্দু O নির্ণয় করো।", en: "Find O, the midpoint of AC." },
      tool: "pencil",
      action: "markPoint",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { O: g.O }, entities: [], toolAnim: { tool: "pencil", at: g.O } };
      },
    },
    {
      id: "s3",
      title: { bn: "ধাপ ৩: O-তে ∠COF আঁকো, F-কে O-এর ওপারে G পর্যন্ত বাড়াও", en: "Step 3: At O draw ∠COF, extend to G beyond O" },
      narration: { bn: "O বিন্দুতে OC-এর সাথে নির্ণিত কোণে রশ্মি OF আঁকো, তারপর FO-কে O-এর ওপারে G পর্যন্ত বাড়িয়ে দাও।", en: "At O, draw ray OF at the derived angle to OC, then extend FO beyond O to G." },
      tool: "protractor",
      action: "drawAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { F: g.F, G: g.G },
          entities: [segEnt(g.O, g.F, "given"), segEnt(g.O, g.G, "given", 0, true), angleMarkEnt(g.O, g.C, g.F, undefined, 0.6, "given")],
          toolAnim: toolProtractor(g.O, 0, g.angle),
        };
      },
    },
    {
      id: "s4",
      title: { bn: "ধাপ ৪: OF-এ OB = d২/২ কাটো", en: "Step 4: On OF, cut OB = d2/2" },
      narration: { bn: "O কেন্দ্র করে d২/২ ব্যাসার্ধে OF-এর ওপর B চিহ্নিত করো।", en: "Centred at O with radius d2/2, mark B on OF." },
      tool: "compass",
      action: "markLength",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const d2 = derived(inputs).d2;
        return { namedPoints: { B: g.B }, entities: [], toolAnim: toolCompass(g.O, d2 / 2, g.angle - 25, g.angle) };
      },
    },
    {
      id: "s5",
      title: { bn: "ধাপ ৫: OG-এ একই ব্যাসার্ধে OD = d২/২ কাটো", en: "Step 5: On OG, cut OD = d2/2 with the same radius" },
      narration: { bn: "একই ব্যাসার্ধে OG-এর ওপর D চিহ্নিত করো।", en: "With the same radius, mark D on OG." },
      tool: "compass",
      action: "markLength",
      radiusLockRef: "s4",
      caution: {
        bn: "🔒 OB ও OD একই ব্যাসার্ধে বসাতে হবে, যাতে O উভয় কর্ণকেই সমদ্বিখণ্ডিত করে — এটিই সামান্তরিকের মূল ধর্ম।",
        en: "🔒 OB and OD must use the same radius so O bisects both diagonals — the defining property of a parallelogram.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const d2 = derived(inputs).d2;
        return { namedPoints: { D: g.D }, entities: [], toolAnim: toolCompass(g.O, d2 / 2, g.angle + 155, g.angle + 180) };
      },
    },
    {
      id: "s6",
      title: { bn: "ধাপ ৬: চার বাহু যুক্ত করো — সামান্তরিক সম্পন্ন", en: "Step 6: Join the four sides — parallelogram complete" },
      narration: { bn: "A-B, B-C, C-D, D-A যুক্ত করলেই কাঙ্ক্ষিত সামান্তরিক ABCD পাওয়া যায়।", en: "Joining A-B, B-C, C-D, D-A gives the required parallelogram ABCD." },
      tool: "ruler",
      action: "joinPoints",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          entities: [segEnt(g.A, g.B, "final"), segEnt(g.B, g.C, "final"), segEnt(g.C, g.D, "final"), segEnt(g.D, g.A, "final")],
          toolAnim: toolRuler(g.A, g.B),
        };
      },
    },
  ],
});

export default meta;
