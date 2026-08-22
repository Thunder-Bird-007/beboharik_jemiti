// T-02 / #9 — Rhombus from its two diagonals.
// Given: diagonals b and S. Uses the defining property of a rhombus: its
// diagonals bisect each other at right angles. Construct AC = S, its
// perpendicular bisector MN, then step off b/2 on both sides of the
// midpoint O along MN to get B and D.
import { intersectCircleCircle, pt } from "@/geom/core";
import { rightAngleEnt, segEnt, toolCompass, toolRuler } from "./stepHelpers";
import { registerConstruction } from "./registry";
import type { ConstructionMeta } from "./types";

function geometry(inputs: Record<string, number>) {
  const { b, S } = inputs;
  const A = pt(0, 0, "A");
  const C = pt(S, 0, "C");
  const O = pt(S / 2, 0, "O");
  const r = S * 0.62;
  const cands = intersectCircleCircle(A, r, C, r);
  const P1 = cands ? (cands[0].y >= cands[1].y ? cands[0] : cands[1]) : pt(S / 2, r * 0.8);
  const P2 = cands ? (cands[0].y >= cands[1].y ? cands[1] : cands[0]) : pt(S / 2, -r * 0.8);
  const B = pt(S / 2, b / 2, "B");
  const D = pt(S / 2, -b / 2, "D");
  return { A, C, O, P1, P2, B, D, r };
}

const meta: ConstructionMeta = registerConstruction({
  id: "quad-9",
  index: 9,
  topic: "T02",
  title: { bn: "৯। দুই কর্ণ দিয়ে রম্বস", en: "9. Rhombus from its two diagonals" },
  boardTags: "[JB,CB'25…]",
  derivedFrom: "tri-3",
  givenSummary: (i) => ({
    bn: `কর্ণদ্বয় = ${i.b} সেমি ও ${i.S} সেমি (△PQR-এর ভূমি ও সমষ্টি থেকে নেওয়া) — এমন রম্বস ABCD আঁকতে হবে।`,
    en: `Diagonals = ${i.b} cm and ${i.S} cm (reused from △PQR's base and sum) — construct rhombus ABCD.`,
  }),
  inputs: [
    { key: "S", label: { bn: "কর্ণ AC", en: "diagonal AC" }, unit: "cm", defaultValue: 7, min: 4, max: 10, step: 0.5 },
    { key: "b", label: { bn: "কর্ণ BD", en: "diagonal BD" }, unit: "cm", defaultValue: 5, min: 3, max: 9, step: 0.5 },
  ],
  scale: 65,
  steps: [
    {
      id: "s1",
      title: { bn: "ধাপ ১: AC আঁকো", en: "Step 1: Draw AC" },
      narration: { bn: "একটি রশ্মিতে AC = প্রথম কর্ণ কেটে নাও।", en: "On a ray, cut AC equal to the first diagonal." },
      tool: "ruler",
      action: "markLength",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { A: g.A, C: g.C }, entities: [segEnt(g.A, g.C, "given")], toolAnim: toolRuler(g.A, g.C) };
      },
    },
    {
      id: "s2",
      title: { bn: "ধাপ ২: A থেকে চাপ (ব্যাসার্ধ > AC/2)", en: "Step 2: Arc from A (radius > AC/2)" },
      narration: { bn: "A কেন্দ্র করে AC/2-এর চেয়ে বড় ব্যাসার্ধে একটি চাপ আঁকো।", en: "Centred at A, strike an arc with radius greater than AC/2." },
      tool: "compass",
      action: "drawArc",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [], toolAnim: toolCompass(g.A, g.r, 45, 135) };
      },
    },
    {
      id: "s3",
      title: { bn: "ধাপ ৩: C থেকে একই ব্যাসার্ধে চাপ", en: "Step 3: Same-radius arc from C" },
      narration: { bn: "একই ব্যাসার্ধে C থেকেও চাপ আঁকো; দুই চাপ ওপরে ও নিচে ছেদ করে।", en: "Strike the same-radius arc from C; the arcs cross above and below AC." },
      tool: "compass",
      action: "drawArc",
      radiusLockRef: "s2",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: {}, entities: [], toolAnim: toolCompass(g.C, g.r, 135, 45) };
      },
    },
    {
      id: "s4",
      title: { bn: "ধাপ ৪: MN লম্ব-সমদ্বিখণ্ডক আঁকো — O বিন্দু", en: "Step 4: Draw perpendicular bisector MN — point O" },
      narration: {
        bn: "দুই চাপের ছেদবিন্দু যুক্ত করলে AC-এর লম্ব-সমদ্বিখণ্ডক MN পাওয়া যায়, যা AC-কে সমদ্বিখণ্ডিত করে O বিন্দুতে।",
        en: "Joining the two arc-intersections gives the perpendicular bisector MN of AC, meeting it at O.",
      },
      tool: "ruler",
      action: "joinPoints",
      caution: {
        bn: "📐 রম্বসের কর্ণদ্বয় পরস্পরকে সমকোণে সমদ্বিখণ্ডিত করে — এই ধর্মটিই এই অঙ্কনের ভিত্তি।",
        en: "📐 A rhombus's diagonals bisect each other at right angles — this construction is built directly on that property.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { O: g.O },
          entities: [segEnt(g.P1, g.P2, "construction"), rightAngleEnt(g.O, g.A, g.P1)],
          toolAnim: toolRuler(g.P1, g.P2),
        };
      },
    },
    {
      id: "s5",
      title: { bn: "ধাপ ৫: O থেকে b/2 কেটে B বিন্দু", en: "Step 5: From O, cut b/2 for point B" },
      narration: { bn: "O কেন্দ্র করে b/2 ব্যাসার্ধে MN-এর ওপর B চিহ্নিত করো।", en: "Centred at O with radius b/2, mark B on MN." },
      tool: "compass",
      action: "markLength",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { B: g.B }, entities: [], toolAnim: toolCompass(g.O, inputs.b / 2, 60, 90) };
      },
    },
    {
      id: "s6",
      title: { bn: "ধাপ ৬: O থেকে একই ব্যাসার্ধে D বিন্দু", en: "Step 6: Same radius from O for point D" },
      narration: { bn: "একই ব্যাসার্ধে MN-এর অন্য পাশে D চিহ্নিত করো।", en: "With the same radius, mark D on the other side of MN." },
      tool: "compass",
      action: "markLength",
      radiusLockRef: "s5",
      caution: {
        bn: "🔒 O থেকে দুই পাশেই ঠিক একই ব্যাসার্ধ ব্যবহার করতে হবে, নাহলে O প্রকৃত মধ্যবিন্দু থাকবে না।",
        en: "🔒 Use the exact same radius from O on both sides, or O will no longer be the true midpoint.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { D: g.D }, entities: [], toolAnim: toolCompass(g.O, inputs.b / 2, 270, 300) };
      },
    },
    {
      id: "s7",
      title: { bn: "ধাপ ৭: চার বাহু যুক্ত করো — রম্বস সম্পন্ন", en: "Step 7: Join the four sides — rhombus complete" },
      narration: { bn: "A-B, B-C, C-D, D-A যুক্ত করলেই কাঙ্ক্ষিত রম্বস ABCD পাওয়া যায়।", en: "Joining A-B, B-C, C-D, D-A gives the required rhombus ABCD." },
      tool: "ruler",
      action: "joinPoints",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          entities: [
            segEnt(g.A, g.B, "final", 1),
            segEnt(g.B, g.C, "final", 1),
            segEnt(g.C, g.D, "final", 1),
            segEnt(g.D, g.A, "final", 1),
          ],
          toolAnim: toolRuler(g.A, g.B),
        };
      },
    },
  ],
});

export default meta;
