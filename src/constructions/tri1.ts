// T-01 / #1 — Two base angles + perimeter (the "perimeter method").
// Given: ∠x, ∠y, perimeter p. Classic construction: lay off DE = p, build the
// two base angles at D and E, bisect them with the real two-arc-then-two-arc
// technique to find apex A, then copy the base angles of triangle ADE back
// onto A (real angle-copy technique) to cut the final base at B and C.
import { angleBetween, angleOf, intersectLineLine, pointAtDistanceAngle, pt } from "@/geom/core";
import { bisectAngle, copyAngleCompass } from "./classicOps";
import { angleMarkEnt, arcEnt, arcSweepTo, copyAngleOntoLine, segEnt, toolCompass, toolProtractor, toolRuler } from "./stepHelpers";
import { registerConstruction } from "./registry";
import type { ConstructionMeta } from "./types";

function geometry(inputs: Record<string, number>) {
  const { x, y, p } = inputs;
  const D = pt(0, 0, "D");
  const E = pt(p, 0, "E");
  const armLen = Math.max(2.2, p * 0.42);
  const dirDL = x; // measured CCW from D->E direction (0deg)
  const dirEM = 180 - y;
  const L = pt(D.x + armLen * Math.cos((dirDL * Math.PI) / 180), D.y + armLen * Math.sin((dirDL * Math.PI) / 180), "L");
  const M = pt(E.x + armLen * Math.cos((dirEM * Math.PI) / 180), E.y + armLen * Math.sin((dirEM * Math.PI) / 180), "M");

  // Real bisection: one arc across both arms, then two equal arcs meeting at X.
  const bisD = bisectAngle(D, L, E);
  const bisE = bisectAngle(E, M, D);
  const farD = pointAtDistanceAngle(D, 1000, bisD.bisectorDirDeg);
  const farE = pointAtDistanceAngle(E, 1000, bisE.bisectorDirDeg);
  const A = intersectLineLine(D, farD, E, farE).point ?? pt((D.x + E.x) / 2, armLen, "A");
  A.label = "A";
  A.labelEn = "A";

  const angleADE = angleBetween(A, D, E);
  const angleAED = angleBetween(A, E, D);
  const B = copyAngleOntoLine(A, D, angleADE, D, E, D);
  const C = copyAngleOntoLine(A, E, angleAED, D, E, E);
  B.label = "B";
  B.labelEn = "B";
  C.label = "C";
  C.labelEn = "C";

  // Real angle-copy geometry for the two final angles at A.
  const copyB = copyAngleCompass(D, A, E, A, angleOf(A, D), angleOf(A, B));
  const copyC = copyAngleCompass(E, A, D, A, angleOf(A, E), angleOf(A, C));

  return { D, E, L, M, A, B, C, dirDL, dirEM, armLen, bisD, bisE, copyB, copyC };
}

const meta: ConstructionMeta = registerConstruction({
  id: "tri-1",
  index: 1,
  topic: "T01",
  title: { bn: "১। দুইটি ভূমিকোণ ও পরিসীমা দিয়ে ত্রিভুজ (পরিসীমা পদ্ধতি)", en: "1. Two base angles + perimeter (perimeter method)" },
  boardTags: "[DB,JB'26; RB'26,24…]",
  givenSummary: (i) => ({
    bn: `∠x = ${i.x}°, ∠y = ${i.y}°, পরিসীমা p = ${i.p} সেমি — এমন △ABC আঁকতে হবে যার ভূমিকোণ x, y এবং পরিসীমা p।`,
    en: `∠x = ${i.x}°, ∠y = ${i.y}°, perimeter p = ${i.p} cm — construct △ABC with these base angles and perimeter.`,
  }),
  inputs: [
    { key: "x", label: { bn: "∠x (ভূমিকোণ, D)", en: "∠x (base angle at D)" }, unit: "deg", defaultValue: 50, min: 20, max: 120, step: 1 },
    { key: "y", label: { bn: "∠y (ভূমিকোণ, E)", en: "∠y (base angle at E)" }, unit: "deg", defaultValue: 60, min: 20, max: 120, step: 1 },
    { key: "p", label: { bn: "পরিসীমা p", en: "perimeter p" }, unit: "cm", defaultValue: 12, min: 8, max: 18, step: 0.5 },
  ],
  validate: (i) => {
    if (i.x + i.y >= 180) {
      return { bn: "দুই ভূমিকোণের সমষ্টি ১৮০° এর কম হতে হবে।", en: "The two base angles must sum to less than 180°." };
    }
    return null;
  },
  scale: 48,
  steps: [
    {
      id: "s1",
      title: { bn: "ধাপ ১: DE = p রেখাংশ আঁকো", en: "Step 1: Draw DE = p" },
      narration: { bn: "একটি রশ্মিতে D থেকে E পর্যন্ত পরিসীমা p সেমি কেটে নাও।", en: "On a ray, cut DE equal to the perimeter p." },
      tool: "ruler",
      action: "markLength",
      compute: (_s, inputs) => {
        const { D, E } = geometry(inputs);
        return { namedPoints: { D, E }, entities: [segEnt(D, E, "given")], toolAnim: toolRuler(D, E) };
      },
    },
    {
      id: "s2",
      title: { bn: "ধাপ ২: D বিন্দুতে ∠LDE = x আঁকো", en: "Step 2: At D, draw ∠LDE = x" },
      narration: { bn: "D বিন্দুতে DE রেখার সাথে x কোণ করে রশ্মি DL আঁকো।", en: "At D, draw ray DL making angle x with DE." },
      tool: "protractor",
      action: "drawAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { L: g.L },
          entities: [segEnt(g.D, g.L, "given"), angleMarkEnt(g.D, g.E, g.L, `${inputs.x}°`, 0.85, "given")],
          toolAnim: toolProtractor(g.D, 0, g.dirDL),
        };
      },
    },
    {
      id: "s3",
      title: { bn: "ধাপ ৩: E বিন্দুতে ∠MED = y আঁকো (একই পাশে)", en: "Step 3: At E, draw ∠MED = y (same side)" },
      narration: { bn: "E বিন্দুতে ED রেখার সাথে y কোণ করে, L যে পাশে আছে সেই পাশেই রশ্মি EM আঁকো।", en: "At E, draw ray EM at angle y to ED, on the same side as L." },
      tool: "protractor",
      action: "drawAngle",
      caution: {
        bn: "⚠️ দুটি কোণই DE রেখার একই পাশে আঁকতে হবে, নাহলে বিন্দু A পাওয়া যাবে না।",
        en: "⚠️ Both angles must be drawn on the same side of DE, or the bisectors will never meet at A.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { M: g.M },
          entities: [segEnt(g.E, g.M, "given"), angleMarkEnt(g.E, g.D, g.M, `${inputs.y}°`, 0.85, "given")],
          toolAnim: toolProtractor(g.E, 180, g.dirEM),
        };
      },
    },
    // --- Real bisection of ∠LDE: arc across both arms, then two equal arcs ---
    {
      id: "s4a",
      title: { bn: "ধাপ ৪ক: D থেকে চাপ — DL ও DE-কে ছেদ করে", en: "Step 4a: Arc from D — crosses DL and DE" },
      narration: { bn: "D কেন্দ্র করে একটি চাপ আঁকো, যা DL ও DE উভয় বাহুকে ছেদ করে।", en: "Centred at D, strike an arc that crosses both arms DL and DE." },
      tool: "compass",
      action: "bisectAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { P, Q, r1 } = g.bisD;
        return { entities: [arcEnt(g.D, r1, angleOf(g.D, Q), angleOf(g.D, P), "construction")], toolAnim: toolCompass(g.D, r1, angleOf(g.D, Q), angleOf(g.D, P)) };
      },
    },
    {
      id: "s4b",
      title: { bn: "ধাপ ৪খ: চাপ-বিন্দু থেকে সমান ব্যাসার্ধে দুটি চাপ", en: "Step 4b: Equal-radius arcs from those arc-points" },
      narration: { bn: "আগের চাপ যেখানে বাহু দুটিকে ছুঁয়েছে, সেই দুই বিন্দু থেকে সমান ব্যাসার্ধে দুটি চাপ আঁকো — তারা ভেতরে মিলিত হয়।", en: "From the two points where that arc touched the arms, strike two equal-radius arcs — they meet on the inside." },
      tool: "compass",
      action: "bisectAngle",
      caution: {
        bn: "⚠️ সমদ্বিখণ্ডনের জন্য মূল x/y কোণ দুটি থেকেই আঁকতে হবে, চূড়ান্ত ত্রিভুজের কোণ থেকে নয়।",
        en: "⚠️ Bisect from the original x/y angles themselves — not from the final triangle's angles.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { P, r2, X } = g.bisD;
        const sw = arcSweepTo(P, X, { padding: 8 });
        return { entities: [arcEnt(P, r2, sw.startAngle, sw.endAngle, "construction")], toolAnim: toolCompass(P, r2, sw.startAngle, sw.endAngle) };
      },
    },
    {
      id: "s4c",
      title: { bn: "ধাপ ৪গ: দ্বিতীয় সমান চাপ — সমদ্বিখণ্ডক রশ্মি DG", en: "Step 4c: The second equal arc — bisector ray DG" },
      narration: { bn: "একই ব্যাসার্ধে অন্য বিন্দু থেকেও চাপ আঁকো; দুই চাপের ছেদবিন্দু দিয়ে D থেকে রশ্মি DG আঁকলেই তা ∠LDE-কে সমদ্বিখণ্ডিত করে।", en: "Strike the same-radius arc from the other point too; the ray from D through where the arcs cross bisects ∠LDE." },
      tool: "compass",
      action: "bisectAngle",
      radiusLockRef: "s4b",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { Q, r2, X } = g.bisD;
        const sw = arcSweepTo(Q, X, { padding: 8 });
        return {
          entities: [arcEnt(Q, r2, sw.startAngle, sw.endAngle, "construction"), segEnt(g.D, g.A, "construction")],
          toolAnim: toolCompass(Q, r2, sw.startAngle, sw.endAngle),
        };
      },
    },
    // --- Real bisection of ∠MED ---
    {
      id: "s5a",
      title: { bn: "ধাপ ৫ক: E থেকে চাপ — EM ও ED-কে ছেদ করে", en: "Step 5a: Arc from E — crosses EM and ED" },
      narration: { bn: "E কেন্দ্র করে একটি চাপ আঁকো, যা EM ও ED উভয় বাহুকে ছেদ করে।", en: "Centred at E, strike an arc that crosses both arms EM and ED." },
      tool: "compass",
      action: "bisectAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { P, Q, r1 } = g.bisE;
        return { entities: [arcEnt(g.E, r1, angleOf(g.E, P), angleOf(g.E, Q), "construction")], toolAnim: toolCompass(g.E, r1, angleOf(g.E, P), angleOf(g.E, Q)) };
      },
    },
    {
      id: "s5b",
      title: { bn: "ধাপ ৫খ: সমান ব্যাসার্ধে প্রথম চাপ", en: "Step 5b: First equal-radius arc" },
      narration: { bn: "আগের চাপ-বিন্দু দুটি থেকে সমান ব্যাসার্ধে চাপ আঁকা শুরু করো।", en: "Begin striking equal-radius arcs from those two arc-points." },
      tool: "compass",
      action: "bisectAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { P, r2, X } = g.bisE;
        const sw = arcSweepTo(P, X, { padding: 8 });
        return { entities: [arcEnt(P, r2, sw.startAngle, sw.endAngle, "construction")], toolAnim: toolCompass(P, r2, sw.startAngle, sw.endAngle) };
      },
    },
    {
      id: "s5c",
      title: { bn: "ধাপ ৫গ: দ্বিতীয় সমান চাপ — সমদ্বিখণ্ডক রশ্মি EH, A বিন্দুতে মিলিত", en: "Step 5c: Second equal arc — bisector ray EH, meeting at A" },
      narration: { bn: "একই ব্যাসার্ধে অন্য বিন্দু থেকে চাপ আঁকো; ছেদবিন্দু দিয়ে E থেকে রশ্মি EH আঁকো — এটি রশ্মি DG-কে A বিন্দুতে ছেদ করে।", en: "Strike the same-radius arc from the other point; ray EH through the crossing point meets ray DG at A." },
      tool: "compass",
      action: "bisectAngle",
      radiusLockRef: "s5b",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { Q, r2, X } = g.bisE;
        const sw = arcSweepTo(Q, X, { padding: 8 });
        return {
          entities: [arcEnt(Q, r2, sw.startAngle, sw.endAngle, "construction"), segEnt(g.E, g.A, "construction")],
          toolAnim: toolCompass(Q, r2, sw.startAngle, sw.endAngle),
        };
      },
    },
    {
      id: "s6",
      title: { bn: "ধাপ ৬: A বিন্দু চিহ্নিত করো", en: "Step 6: Mark point A" },
      narration: { bn: "দুই সমদ্বিখণ্ডক রশ্মি যেখানে মিলিত হয়, সেটিই বিন্দু A।", en: "Where the two bisectors meet is the point A." },
      tool: "pencil",
      action: "markPoint",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { A: g.A }, entities: [], toolAnim: { tool: "pencil", at: g.A } };
      },
    },
    // --- Real angle-copy of ∠ADE onto A, landing at B ---
    {
      id: "s7a",
      title: { bn: "ধাপ ৭ক: D থেকে চাপ — DA ও DE-কে ছেদ করে", en: "Step 7a: Arc from D — crosses DA and DE" },
      narration: { bn: "∠ADE কপি করতে, D কেন্দ্র করে একটি চাপ আঁকো যা DA ও DE-কে ছেদ করে।", en: "To copy ∠ADE, strike an arc centred at D crossing both DA and DE." },
      tool: "compass",
      action: "drawAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { P, Q, r1 } = g.copyB;
        return { entities: [arcEnt(g.D, r1, angleOf(g.D, Q), angleOf(g.D, P), "construction")], toolAnim: toolCompass(g.D, r1, angleOf(g.D, Q), angleOf(g.D, P)) };
      },
    },
    {
      id: "s7b",
      title: { bn: "ধাপ ৭খ: A-তে একই ব্যাসার্ধে চাপ (AD বরাবর)", en: "Step 7b: Same-radius arc at A (along AD)" },
      narration: { bn: "কম্পাসের ব্যাসার্ধ না পাল্টিয়ে, A থেকে AD বরাবর একই ব্যাসার্ধে চাপ আঁকো।", en: "Without changing the compass, strike the same-radius arc at A, crossing AD." },
      tool: "compass",
      action: "drawAngle",
      radiusLockRef: "s7a",
      caution: {
        bn: "🔒 কোণ কপি করার মূল কৌশল এটাই — উৎস ও লক্ষ্য দুই জায়গাতেই ঠিক একই ব্যাসার্ধ ব্যবহার করতে হবে।",
        en: "🔒 This is the heart of angle-copying — the exact same radius must be used at both the source and target vertex.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { r1, Pt } = g.copyB;
        const sw = arcSweepTo(g.A, Pt, { padding: 10 });
        return { entities: [arcEnt(g.A, r1, sw.startAngle, sw.endAngle, "construction")], toolAnim: toolCompass(g.A, r1, sw.startAngle, sw.endAngle) };
      },
    },
    {
      id: "s7c",
      title: { bn: "ধাপ ৭গ: চাপ-দূরত্ব বসিয়ে B বিন্দু পাও", en: "Step 7c: Transfer the arc-chord to get point B" },
      narration: { bn: "প্রথম চাপের দুই বিন্দুর দূরত্ব কম্পাসে নিয়ে A-এর চাপে বসাও; তাতে পাওয়া বিন্দু দিয়ে রশ্মি টানলে তা DE-কে B বিন্দুতে ছেদ করে।", en: "Take the chord-distance from the first arc's two points, strike it on A's arc; the ray through that point cuts DE at B." },
      tool: "compass",
      action: "drawAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { r2, Pt, Qt } = g.copyB;
        const sw = arcSweepTo(Pt, Qt, { padding: 8 });
        return {
          namedPoints: { B: g.B },
          entities: [arcEnt(Pt, r2, sw.startAngle, sw.endAngle, "construction"), segEnt(g.A, g.B, "final"), angleMarkEnt(g.A, g.D, g.B, undefined, 0.5, "final")],
          toolAnim: toolCompass(Pt, r2, sw.startAngle, sw.endAngle),
        };
      },
    },
    // --- Real angle-copy of ∠AED onto A, landing at C ---
    {
      id: "s8a",
      title: { bn: "ধাপ ৮ক: E থেকে চাপ — EA ও ED-কে ছেদ করে", en: "Step 8a: Arc from E — crosses EA and ED" },
      narration: { bn: "∠AED কপি করতে, E কেন্দ্র করে একটি চাপ আঁকো যা EA ও ED-কে ছেদ করে।", en: "To copy ∠AED, strike an arc centred at E crossing both EA and ED." },
      tool: "compass",
      action: "drawAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { P, Q, r1 } = g.copyC;
        return { entities: [arcEnt(g.E, r1, angleOf(g.E, Q), angleOf(g.E, P), "construction")], toolAnim: toolCompass(g.E, r1, angleOf(g.E, Q), angleOf(g.E, P)) };
      },
    },
    {
      id: "s8b",
      title: { bn: "ধাপ ৮খ: A-তে একই ব্যাসার্ধে চাপ (AE বরাবর)", en: "Step 8b: Same-radius arc at A (along AE)" },
      narration: { bn: "একই ব্যাসার্ধে A থেকে AE বরাবর চাপ আঁকো।", en: "Strike the same-radius arc at A, crossing AE." },
      tool: "compass",
      action: "drawAngle",
      radiusLockRef: "s8a",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { r1, Pt } = g.copyC;
        const sw = arcSweepTo(g.A, Pt, { padding: 10 });
        return { entities: [arcEnt(g.A, r1, sw.startAngle, sw.endAngle, "construction")], toolAnim: toolCompass(g.A, r1, sw.startAngle, sw.endAngle) };
      },
    },
    {
      id: "s8c",
      title: { bn: "ধাপ ৮গ: চাপ-দূরত্ব বসিয়ে C বিন্দু পাও", en: "Step 8c: Transfer the arc-chord to get point C" },
      narration: { bn: "প্রথম চাপের চাপ-দূরত্ব A-এর চাপে বসাও; পাওয়া বিন্দু দিয়ে রশ্মি টানলে তা DE-কে C বিন্দুতে ছেদ করে।", en: "Transfer the chord-distance onto A's arc; the ray through that point cuts DE at C." },
      tool: "compass",
      action: "drawAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { r2, Pt, Qt } = g.copyC;
        const sw = arcSweepTo(Pt, Qt, { padding: 8 });
        return {
          namedPoints: { C: g.C },
          entities: [arcEnt(Pt, r2, sw.startAngle, sw.endAngle, "construction"), segEnt(g.A, g.C, "final"), angleMarkEnt(g.A, g.E, g.C, undefined, 0.5, "final")],
          toolAnim: toolCompass(Pt, r2, sw.startAngle, sw.endAngle),
        };
      },
    },
    {
      id: "s9",
      title: { bn: "ধাপ ৯: BC যুক্ত করো — △ABC সম্পন্ন", en: "Step 9: Join BC — △ABC complete" },
      narration: { bn: "B ও C যুক্ত করলেই কাঙ্ক্ষিত △ABC পাওয়া যায়।", en: "Joining B and C gives the required △ABC." },
      tool: "ruler",
      action: "joinPoints",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [segEnt(g.B, g.C, "final")], toolAnim: toolRuler(g.B, g.C) };
      },
    },
  ],
});

export default meta;
