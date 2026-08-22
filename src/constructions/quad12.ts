// T-02 / #12 — Rhombus with the perimeter of a given triangle + one angle.
// Given: triangle sides s1,s2,s3 ⇒ perimeter ⇒ rhombus side = perimeter/4;
// one angle. Since C = B + D - A for any rhombus/parallelogram, the fourth
// vertex needs no arc-intersection at all once B and D are known.
import { angleOf, pointAtDistanceAngle, pt } from "@/geom/core";
import { fmtCm, fmtNum } from "@/lib/format";
import { angleMarkEnt, segEnt, toolCompass, toolProtractor, toolRuler } from "./stepHelpers";
import { registerConstruction } from "./registry";
import type { ConstructionMeta } from "./types";

function perimeterOf(inputs: Record<string, number>) {
  return inputs.s1 + inputs.s2 + inputs.s3;
}

function geometry(inputs: Record<string, number>) {
  const side = perimeterOf(inputs) / 4;
  const A = pt(0, 0, "A");
  const B = pt(side, 0, "B");
  const D = pt(side * Math.cos((inputs.angle * Math.PI) / 180), side * Math.sin((inputs.angle * Math.PI) / 180), "D");
  const C = pt(B.x + D.x - A.x, B.y + D.y - A.y, "C");
  return { side, A, B, D, C };
}

const meta: ConstructionMeta = registerConstruction({
  id: "quad-12",
  index: 12,
  topic: "T02",
  title: { bn: "১২। ত্রিভুজের পরিসীমা ও একটি কোণ দিয়ে রম্বস", en: "12. Rhombus with a triangle's perimeter + one angle" },
  boardTags: "[SB,JB'24…]",
  givenSummary: (i) => ({
    bn: `ত্রিভুজের বাহুত্রয় ${i.s1}, ${i.s2}, ${i.s3} সেমি ⇒ পরিসীমা = ${fmtCm(perimeterOf(i), "bn")} ⇒ রম্বসের বাহু = ${fmtCm(perimeterOf(i) / 4, "bn")}; একটি কোণ = ${i.angle}°।`,
    en: `Triangle sides ${i.s1}, ${i.s2}, ${i.s3} cm ⇒ perimeter = ${fmtCm(perimeterOf(i), "en")} ⇒ rhombus side = ${fmtCm(perimeterOf(i) / 4, "en")}; one angle = ${i.angle}°.`,
  }),
  inputs: [
    { key: "s1", label: { bn: "ত্রিভুজের বাহু ১", en: "triangle side 1" }, unit: "cm", defaultValue: 3, min: 2, max: 8, step: 0.5 },
    { key: "s2", label: { bn: "ত্রিভুজের বাহু ২", en: "triangle side 2" }, unit: "cm", defaultValue: 5, min: 2, max: 8, step: 0.5 },
    { key: "s3", label: { bn: "ত্রিভুজের বাহু ৩", en: "triangle side 3" }, unit: "cm", defaultValue: 6, min: 2, max: 8, step: 0.5 },
    { key: "angle", label: { bn: "রম্বসের একটি কোণ", en: "one angle of rhombus" }, unit: "deg", defaultValue: 75, min: 30, max: 150, step: 1 },
  ],
  validate: (i) => {
    const sides = [i.s1, i.s2, i.s3];
    const sum = sides.reduce((a, b) => a + b, 0);
    if (sides.some((s) => s >= sum - s)) {
      return { bn: "বাহুত্রয় দিয়ে ত্রিভুজ গঠন সম্ভব হতে হবে (ত্রিভুজ অসমতা)।", en: "The three sides must be able to form a triangle (triangle inequality)." };
    }
    return null;
  },
  scale: 68,
  steps: [
    {
      id: "s0",
      title: { bn: "ধাপ ০: রম্বসের বাহু নির্ণয়", en: "Step 0: Find the rhombus's side" },
      narration: (i) => ({
        bn: `পরিসীমা = ${fmtNum(i.s1, "bn")}+${fmtNum(i.s2, "bn")}+${fmtNum(i.s3, "bn")} = ${fmtCm(perimeterOf(i), "bn")}; রম্বসের বাহু = পরিসীমা÷৪ = ${fmtCm(perimeterOf(i) / 4, "bn")}।`,
        en: `Perimeter = ${fmtNum(i.s1, "en")}+${fmtNum(i.s2, "en")}+${fmtNum(i.s3, "en")} = ${fmtCm(perimeterOf(i), "en")}; rhombus side = perimeter÷4 = ${fmtCm(perimeterOf(i) / 4, "en")}.`,
      }),
      tool: "none",
      action: "info",
      compute: () => ({ entities: [], toolAnim: { tool: "none" } }),
    },
    {
      id: "s1",
      title: { bn: "ধাপ ১: রশ্মি AE-তে AB = বাহু কাটো", en: "Step 1: On ray AE, cut AB = side" },
      narration: { bn: "একটি রশ্মি AE আঁকো এবং তাতে AB = বাহুর দৈর্ঘ্য কেটে নাও।", en: "Draw ray AE and cut AB equal to the side on it." },
      tool: "ruler",
      action: "markLength",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { A: g.A, B: g.B }, entities: [segEnt(g.A, g.B, "given")], toolAnim: toolRuler(g.A, g.B) };
      },
    },
    {
      id: "s2",
      title: { bn: "ধাপ ২: A-তে রশ্মি AF আঁকো (কোণে)", en: "Step 2: At A, draw ray AF (at the angle)" },
      narration: { bn: "A বিন্দুতে AE-এর সাথে প্রদত্ত কোণে রশ্মি AF আঁকো।", en: "At A, draw ray AF at the given angle to AE." },
      tool: "protractor",
      action: "drawAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const Ffar = pointAtDistanceAngle(g.A, g.side * 1.4, inputs.angle);
        Ffar.label = "F";
        Ffar.labelEn = "F";
        return {
          namedPoints: { F: Ffar },
          entities: [segEnt(g.A, Ffar, "given"), angleMarkEnt(g.A, g.B, Ffar, `${inputs.angle}°`, 0.7, "given")],
          toolAnim: toolProtractor(g.A, 0, inputs.angle),
        };
      },
    },
    {
      id: "s3",
      title: { bn: "ধাপ ৩: AF-এ AD = বাহু কাটো", en: "Step 3: On AF, cut AD = side" },
      narration: { bn: "AF রশ্মিতে A থেকে বাহুর সমান দূরত্বে D চিহ্নিত করো।", en: "On ray AF, mark D at a distance equal to the side from A." },
      tool: "compass",
      action: "markLength",
      radiusLockRef: "s1",
      caution: {
        bn: "🔒 AD-ও AB-এর সমান — রম্বসের সব বাহু সমান রাখতে একই কম্পাস-মাপ পুনরায় ব্যবহার করো।",
        en: "🔒 AD equals AB too — reuse the same compass opening so every side of the rhombus stays equal.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { D: g.D }, entities: [], toolAnim: toolCompass(g.A, g.side, inputs.angle - 20, inputs.angle) };
      },
    },
    {
      id: "s4",
      title: { bn: "ধাপ ৪: B থেকে বাহু-ব্যাসার্ধে চাপ", en: "Step 4: Arc from B with radius = side" },
      narration: { bn: "B থেকে বাহুর সমান ব্যাসার্ধে একটি চাপ আঁকো।", en: "From B, strike an arc with radius equal to the side." },
      tool: "compass",
      action: "drawArc",
      radiusLockRef: "s1",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [], toolAnim: toolCompass(g.B, g.side, angleOf(g.B, g.D) - 25, angleOf(g.B, g.C) + 10) };
      },
    },
    {
      id: "s5",
      title: { bn: "ধাপ ৫: D থেকে একই ব্যাসার্ধে চাপ — C বিন্দু", en: "Step 5: Same-radius arc from D — point C" },
      narration: { bn: "একই ব্যাসার্ধে D থেকেও চাপ আঁকো; দুই চাপ মিলিত হয় C বিন্দুতে।", en: "Strike the same-radius arc from D; the two arcs meet at C." },
      tool: "compass",
      action: "drawArc",
      radiusLockRef: "s1",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { C: g.C }, entities: [], toolAnim: toolCompass(g.D, g.side, angleOf(g.D, g.C) - 20, angleOf(g.D, g.C) + 20) };
      },
    },
    {
      id: "s6",
      title: { bn: "ধাপ ৬: C,D ও C,B যুক্ত করো — রম্বস সম্পন্ন", en: "Step 6: Join C,D and C,B — rhombus complete" },
      narration: { bn: "C-D ও C-B যুক্ত করলেই কাঙ্ক্ষিত রম্বস ABCD পাওয়া যায়।", en: "Joining C-D and C-B gives the required rhombus ABCD." },
      tool: "ruler",
      action: "joinPoints",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [segEnt(g.C, g.D, "final"), segEnt(g.C, g.B, "final"), segEnt(g.A, g.D, "final")], toolAnim: toolRuler(g.C, g.D) };
      },
    },
  ],
});

export default meta;
