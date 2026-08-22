// T-02 / #13 (bonus) — Square with a given perimeter + its incircle.
// Phase 1 reuses #8's square-building method (perpendicular + two equal
// arcs) with side = perimeter/4. Phase 2 chains on: draw both diagonals to
// find the centre O, drop a perpendicular to one side to find the inradius
// OF, then draw the incircle.
import { angleOf, projectPointOnLine, pt } from "@/geom/core";
import { fmtCm, fmtNum } from "@/lib/format";
import { arcEnt, rightAngleEnt, segEnt, toolCompass, toolCompassFull, toolRuler } from "./stepHelpers";
import { registerConstruction } from "./registry";
import type { ConstructionMeta } from "./types";

function geometry(inputs: Record<string, number>) {
  const side = inputs.p / 4;
  const B = pt(0, 0, "B");
  const C = pt(side, 0, "C");
  const A = pt(0, side, "A");
  const D = pt(side, side, "D");
  const F0 = pt(0, side * 1.2, "F0");
  const O = pt(side / 2, side / 2, "O");
  const G = projectPointOnLine(O, B, C);
  G.label = "G";
  G.labelEn = "G";
  const radius = Math.hypot(O.x - G.x, O.y - G.y);
  return { side, B, C, A, D, F0, O, G, radius };
}

const meta: ConstructionMeta = registerConstruction({
  id: "quad-13",
  index: 13,
  topic: "T02",
  title: { bn: "১৩। পরিসীমা দিয়ে বর্গ ও তার অন্তর্বৃত্ত", en: "13. Square with given perimeter + its incircle" },
  boardTags: "[বোনাস — DB,RB'24…]",
  givenSummary: (i) => ({
    bn: `পরিসীমা p = ${i.p} সেমি ⇒ বাহু = p/4 = ${fmtCm(i.p / 4, "bn")} — বর্গ ABCD ও তার অন্তর্বৃত্ত আঁকতে হবে।`,
    en: `Perimeter p = ${i.p} cm ⇒ side = p/4 = ${fmtCm(i.p / 4, "en")} — construct square ABCD and its incircle.`,
  }),
  inputs: [{ key: "p", label: { bn: "পরিসীমা p", en: "perimeter p" }, unit: "cm", defaultValue: 11, min: 6, max: 18, step: 0.5 }],
  scale: 90,
  steps: [
    {
      id: "s0",
      title: { bn: "ধাপ ০: বর্গের বাহু নির্ণয়", en: "Step 0: Find the square's side" },
      narration: (i) => ({
        bn: `বাহু = p ÷ ৪ = ${fmtNum(i.p, "bn")} ÷ ৪ = ${fmtCm(i.p / 4, "bn")}।`,
        en: `side = p ÷ 4 = ${fmtNum(i.p, "en")} ÷ 4 = ${fmtCm(i.p / 4, "en")}.`,
      }),
      tool: "none",
      action: "info",
      compute: () => ({ entities: [], toolAnim: { tool: "none" } }),
    },
    {
      id: "s1",
      title: { bn: "ধাপ ১: BC = বাহু আঁকো", en: "Step 1: Draw BC = side" },
      narration: { bn: "একটি রশ্মিতে BC = বাহু কেটে নাও।", en: "On a ray, cut BC equal to the side." },
      tool: "ruler",
      action: "markLength",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { B: g.B, C: g.C }, entities: [segEnt(g.B, g.C, "given")], toolAnim: toolRuler(g.B, g.C) };
      },
    },
    {
      id: "s2",
      title: { bn: "ধাপ ২: B-তে লম্ব BF আঁকো, BA = বাহু কাটো", en: "Step 2: At B, draw perpendicular BF, cut BA = side" },
      narration: { bn: "B বিন্দুতে লম্ব রশ্মি BF আঁকো, তারপর BA = বাহু কেটে নাও।", en: "At B, draw perpendicular ray BF, then cut BA equal to the side." },
      tool: "compass",
      action: "dropPerpendicular",
      radiusLockRef: "s1",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { A: g.A },
          entities: [segEnt(g.B, g.F0, "construction"), segEnt(g.B, g.A, "given"), rightAngleEnt(g.B, g.C, g.F0)],
          toolAnim: toolCompass(g.B, g.side, 55, 90),
        };
      },
    },
    {
      id: "s3",
      title: { bn: "ধাপ ৩ ও ৪: A ও C থেকে সমান ব্যাসার্ধে চাপ — D বিন্দু", en: "Steps 3-4: Equal-radius arcs from A and C — point D" },
      narration: { bn: "A ও C থেকে বাহুর সমান ব্যাসার্ধে দুটি চাপ আঁকো; তারা মিলিত হয় D বিন্দুতে।", en: "From A and C, strike equal-radius arcs (= side); they meet at D." },
      tool: "compass",
      action: "drawArc",
      radiusLockRef: "s1",
      caution: {
        bn: "🔒 এখানেও সেই একই বাহুর মাপ চারবার ব্যবহৃত হচ্ছে — বর্গ অঙ্কনের ধারাবাহিকতা।",
        en: "🔒 The same side length gets reused four times here too — the same discipline as building the square in #8.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { D: g.D }, entities: [], toolAnim: toolCompass(g.C, g.side, 105, 195) };
      },
    },
    {
      id: "s4",
      title: { bn: "ধাপ ৫: বর্গ ABCD সম্পন্ন করো", en: "Step 5: Complete square ABCD" },
      narration: { bn: "A-D ও C-D যুক্ত করলেই বর্গ ABCD সম্পন্ন হয়।", en: "Joining A-D and C-D completes square ABCD." },
      tool: "ruler",
      action: "joinPoints",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [segEnt(g.A, g.D, "final"), segEnt(g.C, g.D, "final")], toolAnim: toolRuler(g.A, g.D) };
      },
    },
    {
      id: "s5",
      title: { bn: "ধাপ ৬: কর্ণদ্বয় BD ও AC আঁকো — O বিন্দু", en: "Step 6: Draw diagonals BD, AC — point O" },
      narration: { bn: "কর্ণ BD ও AC আঁকো; তারা পরস্পরকে ছেদ করে O বিন্দুতে (বর্গের কেন্দ্র)।", en: "Draw diagonals BD and AC; they intersect at O, the centre of the square." },
      tool: "ruler",
      action: "joinPoints",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { O: g.O },
          entities: [segEnt(g.B, g.D, "construction"), segEnt(g.A, g.C, "construction")],
          toolAnim: toolRuler(g.B, g.D),
        };
      },
    },
    {
      id: "s6",
      title: { bn: "ধাপ ৭: O থেকে BC-তে লম্ব OG আঁকো — F বিন্দু", en: "Step 7: From O, drop perpendicular OG to BC — point F" },
      narration: { bn: "O থেকে বাহু BC-এর ওপর লম্ব OG আঁকো; পাদবিন্দু F বৃত্তের ব্যাসার্ধ নির্ধারণ করবে।", en: "From O, drop a perpendicular OG onto side BC; the foot F will fix the incircle's radius." },
      tool: "compass",
      action: "dropPerpendicular",
      caution: {
        bn: "⚠️ ব্যাসার্ধ অবশ্যই O থেকে BC পর্যন্ত প্রকৃত লম্ব দূরত্ব OG হতে হবে, আন্দাজে বসানো যাবে না।",
        en: "⚠️ The radius must be the actual perpendicular distance OG from O to BC — never guessed by eye.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { G: g.G },
          entities: [segEnt(g.O, g.G, "construction"), rightAngleEnt(g.G, g.O, g.C)],
          toolAnim: toolCompass(g.O, g.radius, angleOf(g.O, g.G) - 45, angleOf(g.O, g.G)),
        };
      },
    },
    {
      id: "s7",
      title: { bn: "ধাপ ৮: O কেন্দ্র, OG ব্যাসার্ধে অন্তর্বৃত্ত আঁকো", en: "Step 8: Draw the incircle, centre O, radius OG" },
      narration: { bn: "O কেন্দ্র করে OG ব্যাসার্ধে একটি বৃত্ত আঁকলেই তা বর্গের অন্তর্বৃত্ত হয়।", en: "A circle centred at O with radius OG is exactly the square's incircle." },
      tool: "compass",
      action: "drawArc",
      radiusLockRef: "s6",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [arcEnt(g.O, g.radius, 0, 360, "final", true)], toolAnim: toolCompassFull(g.O, g.radius) };
      },
    },
  ],
});

export default meta;
