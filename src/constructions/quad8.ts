// T-02 / #8 — Square with the same perimeter as a given triangle.
// Given: triangle perimeter a ⇒ square side = a/4. The SAME radius (a/4) gets
// reused four separate times: twice to lay off the two sides BC, BA, and
// twice more for the locating arcs from A and C that find the fourth corner D.
import { angleOf, pointAtDistanceAngle, pt } from "@/geom/core";
import { fmtCm, fmtNum } from "@/lib/format";
import { perpendicularAtPoint } from "./classicOps";
import { arcEnt, arcSweepTo, rightAngleEnt, segEnt, toolCompass, toolRuler } from "./stepHelpers";
import { registerConstruction } from "./registry";
import type { ConstructionMeta } from "./types";

function geometry(inputs: Record<string, number>) {
  const side = inputs.a / 4;
  const B = pt(0, 0, "B");
  const C = pt(side, 0, "C");
  const A = pt(0, side, "A");
  const D = pt(side, side, "D");
  const F = pt(0, side * 1.2, "F");
  const perp = perpendicularAtPoint(B, angleOf(B, C), 1, side * 0.4);
  const beyond = pointAtDistanceAngle(B, side * 0.3, perp.alongDirDeg + 180);
  return { side, B, C, A, D, F, perp, beyond };
}

const meta: ConstructionMeta = registerConstruction({
  id: "quad-8",
  index: 8,
  topic: "T02",
  title: { bn: "৮। একটি ত্রিভুজের সমান পরিসীমাবিশিষ্ট বর্গ", en: "8. Square with the same perimeter as a given triangle" },
  boardTags: "[DB,JB'25…]",
  derivedFrom: "tri-1",
  givenSummary: (i) => ({
    bn: `ত্রিভুজের পরিসীমা a = ${i.a} সেমি (∠x=৭৫°, ∠y=৬০° বিশিষ্ট ত্রিভুজ থেকে) ⇒ বর্গের বাহু = a/4 = ${fmtCm(i.a / 4, "bn")}।`,
    en: `Triangle perimeter a = ${i.a} cm (from the ∠x=75°, ∠y=60° triangle) ⇒ square side = a/4 = ${fmtCm(i.a / 4, "en")}.`,
  }),
  inputs: [{ key: "a", label: { bn: "ত্রিভুজের পরিসীমা a", en: "triangle perimeter a" }, unit: "cm", defaultValue: 11, min: 6, max: 18, step: 0.5 }],
  scale: 90,
  steps: [
    {
      id: "s0",
      title: { bn: "ধাপ ০: বর্গের বাহু নির্ণয়", en: "Step 0: Find the square's side" },
      narration: (i) => ({
        bn: `বর্গের চার বাহু সমান ও পরিসীমা একই থাকবে, তাই বাহু = a ÷ ৪ = ${fmtNum(i.a, "bn")} ÷ ৪ = ${fmtCm(i.a / 4, "bn")}।`,
        en: `A square has 4 equal sides with the same perimeter, so side = a ÷ 4 = ${fmtNum(i.a, "en")} ÷ 4 = ${fmtCm(i.a / 4, "en")}.`,
      }),
      tool: "none",
      action: "info",
      compute: () => ({ entities: [], toolAnim: { tool: "none" } }),
    },
    {
      id: "s1",
      title: { bn: "ধাপ ১: BC = a/4 আঁকো", en: "Step 1: Draw BC = a/4" },
      narration: { bn: "একটি রশ্মিতে BC = a/4 কেটে নাও।", en: "On a ray, cut BC equal to a/4." },
      tool: "ruler",
      action: "markLength",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { B: g.B, C: g.C }, entities: [segEnt(g.B, g.C, "given", 1)], toolAnim: toolRuler(g.B, g.C) };
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
      title: { bn: "ধাপ ২গ: দ্বিতীয় সমান চাপ — লম্ব রশ্মি BF", en: "Step 2c: Second equal arc — perpendicular ray BF" },
      narration: { bn: "একই ব্যাসার্ধে অন্য বিন্দু থেকেও চাপ আঁকো; ছেদবিন্দু দিয়ে B থেকে রশ্মি BF আঁকলেই তা BC-এর ওপর ঠিক লম্ব হয়।", en: "Strike the same-radius arc from the other point; ray BF from B through the crossing point is exactly perpendicular to BC." },
      tool: "compass",
      action: "dropPerpendicular",
      radiusLockRef: "s2b",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { N, r2, X } = g.perp;
        const sw = arcSweepTo(N, X, { padding: 8 });
        return {
          namedPoints: { F: g.F },
          entities: [arcEnt(N, r2, sw.startAngle, sw.endAngle, "construction"), segEnt(g.B, g.F, "construction"), rightAngleEnt(g.B, g.C, g.F)],
          toolAnim: toolCompass(N, r2, sw.startAngle, sw.endAngle),
        };
      },
    },
    {
      id: "s2d",
      title: { bn: "ধাপ ২ঘ: BF-এ BA = a/4 কাটো", en: "Step 2d: On BF, cut BA = a/4" },
      narration: { bn: "রশ্মি BF-এর ওপর B থেকে a/4 দূরত্বে A চিহ্নিত করো।", en: "On ray BF, mark A at a distance a/4 from B." },
      tool: "compass",
      action: "markLength",
      radiusLockRef: "s1",
      caution: {
        bn: "🔒 BA-এর দৈর্ঘ্যও BC-এর সমান — একই কম্পাস-মাপ পুনরায় ব্যবহার করো।",
        en: "🔒 BA is the same length as BC — reuse the exact same compass opening.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { A: g.A },
          entities: [segEnt(g.B, g.A, "given", 1)],
          toolAnim: toolCompass(g.B, g.side, 55, 90),
        };
      },
    },
    {
      id: "s3",
      title: { bn: "ধাপ ৩: A থেকে a/4 ব্যাসার্ধে চাপ আঁকো", en: "Step 3: Arc from A with radius a/4" },
      narration: { bn: "∠ABC-এর ভেতরের দিকে, A থেকে a/4 ব্যাসার্ধে একটি চাপ আঁকো।", en: "Inside ∠ABC, strike an arc from A with radius a/4." },
      tool: "compass",
      action: "drawArc",
      radiusLockRef: "s1",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [], toolAnim: toolCompass(g.A, g.side, -15, 65) };
      },
    },
    {
      id: "s4",
      title: { bn: "ধাপ ৪: C থেকে একই ব্যাসার্ধে চাপ — D বিন্দু", en: "Step 4: Same-radius arc from C — point D" },
      narration: { bn: "একই ব্যাসার্ধে C থেকেও একটি চাপ আঁকো; দুই চাপ মিলিত হয় D বিন্দুতে।", en: "Strike the same-radius arc from C too; the two arcs meet at D." },
      tool: "compass",
      action: "drawArc",
      radiusLockRef: "s1",
      caution: {
        bn: "🔒 এই অঙ্কনে a/4 ব্যাসার্ধ মোট চারবার ব্যবহৃত হয় — BC, BA, এবং এই দুই সন্ধানী চাপে।",
        en: "🔒 In this construction, radius a/4 gets reused four times — for BC, BA, and both locating arcs.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { D: g.D }, entities: [], toolAnim: toolCompass(g.C, g.side, 105, 195) };
      },
    },
    {
      id: "s5",
      title: { bn: "ধাপ ৫: A,D ও C,D যুক্ত করো — বর্গ সম্পন্ন", en: "Step 5: Join A,D and C,D — square complete" },
      narration: { bn: "A-D এবং C-D যুক্ত করলেই কাঙ্ক্ষিত বর্গ ABCD পাওয়া যায়।", en: "Joining A-D and C-D gives the required square ABCD." },
      tool: "ruler",
      action: "joinPoints",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [segEnt(g.A, g.D, "final", 1), segEnt(g.C, g.D, "final", 1)], toolAnim: toolRuler(g.A, g.D) };
      },
    },
  ],
});

export default meta;
