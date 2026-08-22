// T-01 / #5 — Equilateral triangle from its perimeter.
// Given: perimeter. side = perimeter / 3, then the standard two-equal-arc
// equilateral construction. First simple example of the compass-radius-
// unchanged badge: the SAME radius (the side) is used for both apex arcs.
import { intersectCircleCircle, pt } from "@/geom/core";
import { fmtCm, fmtNum } from "@/lib/format";
import { arcEnt, segEnt, toolCompassFull, toolRuler } from "./stepHelpers";
import { registerConstruction } from "./registry";
import type { ConstructionMeta } from "./types";

function geometry(inputs: Record<string, number>) {
  const side = inputs.perimeter / 3;
  const B = pt(0, 0, "B");
  const C = pt(side, 0, "C");
  const cands = intersectCircleCircle(B, side, C, side);
  const A = cands ? (cands[0].y >= cands[1].y ? cands[0] : cands[1]) : pt(side / 2, side * 0.86);
  A.label = "A";
  A.labelEn = "A";
  return { side, B, C, A };
}

const meta: ConstructionMeta = registerConstruction({
  id: "tri-5",
  index: 5,
  topic: "T01",
  title: { bn: "৫। পরিসীমা দিয়ে সমবাহু ত্রিভুজ", en: "5. Equilateral triangle from its perimeter" },
  boardTags: "[JB,CB'25…]",
  givenSummary: (i) => ({
    bn: `পরিসীমা = ${i.perimeter} সেমি — এমন একটি সমবাহু △ABC আঁকতে হবে।`,
    en: `Perimeter = ${i.perimeter} cm — construct an equilateral △ABC.`,
  }),
  inputs: [{ key: "perimeter", label: { bn: "পরিসীমা", en: "perimeter" }, unit: "cm", defaultValue: 11, min: 6, max: 18, step: 0.5 }],
  scale: 65,
  steps: [
    {
      id: "s0",
      title: { bn: "ধাপ ০: বাহুর দৈর্ঘ্য নির্ণয়", en: "Step 0: Find the side length" },
      narration: (i) => ({
        bn: `সমবাহু ত্রিভুজের তিন বাহু সমান, তাই বাহু = পরিসীমা ÷ ৩ = ${fmtNum(i.perimeter, "bn")} ÷ ৩ = ${fmtCm(i.perimeter / 3, "bn")}।`,
        en: `An equilateral triangle has three equal sides, so side = perimeter ÷ 3 = ${fmtNum(i.perimeter, "en")} ÷ 3 = ${fmtCm(i.perimeter / 3, "en")}.`,
      }),
      tool: "none",
      action: "info",
      compute: () => ({ entities: [], toolAnim: { tool: "none" } }),
    },
    {
      id: "s1",
      title: { bn: "ধাপ ১: BC = বাহু আঁকো", en: "Step 1: Draw BC = side" },
      narration: { bn: "একটি রশ্মিতে BC = বাহুর দৈর্ঘ্য কেটে নাও।", en: "On a ray, cut BC equal to the side length." },
      tool: "ruler",
      action: "markLength",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { B: g.B, C: g.C }, entities: [segEnt(g.B, g.C, "given", 1)], toolAnim: toolRuler(g.B, g.C) };
      },
    },
    {
      id: "s2",
      title: { bn: "ধাপ ২: B থেকে বাহু-ব্যাসার্ধে চাপ আঁকো", en: "Step 2: Arc from B with radius = side" },
      narration: { bn: "B বিন্দু থেকে বাহুর সমান ব্যাসার্ধে একটি চাপ আঁকো।", en: "From B, strike an arc with radius equal to the side." },
      tool: "compass",
      action: "drawArc",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [arcEnt(g.B, g.side, 15, 165, "construction")], toolAnim: toolCompassFull(g.B, g.side, fmtCm(g.side, "bn")) };
      },
    },
    {
      id: "s3",
      title: { bn: "ধাপ ৩: C থেকে একই ব্যাসার্ধে চাপ আঁকো — A বিন্দু", en: "Step 3: Same-radius arc from C — point A" },
      narration: { bn: "কম্পাসের ব্যাসার্ধ না পাল্টিয়ে C থেকেও একই চাপ আঁকো; দুই চাপ মিলিত হয় A বিন্দুতে।", en: "Without changing the compass, strike the same arc from C; the two arcs meet at A." },
      tool: "compass",
      action: "drawArc",
      radiusLockRef: "s2",
      caution: {
        bn: "🔒 দুটি চাপের ব্যাসার্ধ একই রাখতে হবে — সমবাহু ত্রিভুজের মূল শর্তই তিন বাহু সমান।",
        en: "🔒 Both arcs must use the same radius — that's exactly what makes the triangle equilateral.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { A: g.A },
          entities: [arcEnt(g.C, g.side, 15, 165, "construction"), segEnt(g.B, g.A, "final", 1), segEnt(g.C, g.A, "final", 1)],
          toolAnim: toolCompassFull(g.C, g.side, fmtCm(g.side, "bn")),
        };
      },
    },
  ],
});

export default meta;
