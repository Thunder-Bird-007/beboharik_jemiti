// T-01 / #6 — Two base angles + the altitude from the apex to the base.
// Given: ∠B, ∠C, altitude d. Unlike the other triangle constructions this
// one works "backwards": the altitude AD is drawn FIRST and is perpendicular
// to the base by construction, not measured after the fact.
import { angleOf, intersectLineLine, pointAtDistanceAngle, pt } from "@/geom/core";
import { perpendicularAtPoint } from "./classicOps";
import { arcEnt, arcSweepTo, rightAngleEnt, segEnt, toolCompass, toolProtractor, toolRuler } from "./stepHelpers";
import { registerConstruction } from "./registry";
import type { ConstructionMeta } from "./types";

function geometry(inputs: Record<string, number>) {
  const { angleB, angleC, d } = inputs;
  const D = pt(0, 0, "D");
  const A = pt(0, d, "A");
  const dirAS = 180 + angleC;
  const dirAT = -angleB;
  const farAS = pointAtDistanceAngle(A, 1000, dirAS);
  const farAT = pointAtDistanceAngle(A, 1000, dirAT);
  const lineD2 = pt(1, 0);
  const S = intersectLineLine(A, farAS, D, lineD2).point ?? pt(-2, 0);
  const T = intersectLineLine(A, farAT, D, lineD2).point ?? pt(2, 0);
  S.label = "S";
  S.labelEn = "S";
  T.label = "T";
  T.labelEn = "T";
  const plen = d * 0.55;
  const mlen = Math.max(Math.abs(S.x), Math.abs(T.x)) + d * 0.35;

  // Real perpendiculars: the classic "arc across the line, then two crossing
  // arcs" technique gives one direction; the line simply extends through the
  // point to the opposite (mirror) side.
  const perpAtA = perpendicularAtPoint(A, angleOf(A, D), 1, Math.min(d, 2.4) * 0.42);
  const qDir = angleOf(A, perpAtA.X);
  const Q = pointAtDistanceAngle(A, plen, qDir);
  Q.label = "Q";
  Q.labelEn = "Q";
  const P = pointAtDistanceAngle(A, plen, qDir + 180);
  P.label = "P";
  P.labelEn = "P";

  const perpAtD = perpendicularAtPoint(D, angleOf(D, A), 1, Math.min(d, 2.4) * 0.42);
  const mDir = angleOf(D, perpAtD.X);
  const M = pointAtDistanceAngle(D, mlen, mDir);
  M.label = "M";
  M.labelEn = "M";
  const N = pointAtDistanceAngle(D, mlen, mDir + 180);
  N.label = "N";
  N.labelEn = "N";

  return { D, A, S, T, P, Q, M, N, dirAS, dirAT, perpAtA, perpAtD };
}

const meta: ConstructionMeta = registerConstruction({
  id: "tri-6",
  index: 6,
  topic: "T01",
  title: { bn: "৬। দুইটি ভূমিকোণ ও শীর্ষ থেকে ভূমিতে অঙ্কিত লম্ব দিয়ে ত্রিভুজ", en: "6. Two base angles + the altitude from the apex" },
  boardTags: "[RB,SB'25…]",
  givenSummary: (i) => ({
    bn: `∠B = ${i.angleB}°, ∠C = ${i.angleC}°, শীর্ষবিন্দু থেকে ভূমিতে লম্ব = ${i.d} সেমি — এমন △AST আঁকতে হবে (A শীর্ষবিন্দু)।`,
    en: `∠B = ${i.angleB}°, ∠C = ${i.angleC}°, altitude from apex to base = ${i.d} cm — construct △AST (A is the apex).`,
  }),
  inputs: [
    { key: "angleB", label: { bn: "∠B", en: "∠B" }, unit: "deg", defaultValue: 60, min: 20, max: 85, step: 1 },
    { key: "angleC", label: { bn: "∠C", en: "∠C" }, unit: "deg", defaultValue: 45, min: 20, max: 85, step: 1 },
    { key: "d", label: { bn: "লম্ব (উচ্চতা)", en: "altitude" }, unit: "cm", defaultValue: 6, min: 3, max: 9, step: 0.5 },
  ],
  validate: (i) => {
    if (i.angleB + i.angleC >= 175) {
      return { bn: "∠B ও ∠C-এর সমষ্টি ১৭৫° এর কম হতে হবে (শীর্ষকোণের জন্য জায়গা রাখতে হবে)।", en: "∠B + ∠C must stay under 175° so the apex angle stays valid." };
    }
    return null;
  },
  scale: 60,
  steps: [
    {
      id: "s1",
      title: { bn: "ধাপ ১: AD = লম্ব আঁকো", en: "Step 1: Draw AD = altitude" },
      narration: { bn: "একটি রশ্মিতে AD = লম্বের দৈর্ঘ্য কেটে নাও — এটিই হবে শীর্ষ থেকে ভূমিতে লম্ব।", en: "On a ray, cut AD equal to the altitude — this will be the perpendicular from apex to base." },
      tool: "ruler",
      action: "markLength",
      caution: {
        bn: "⚠️ এখানে লম্বটি সবার আগে আঁকা হচ্ছে, ভূমি আঁকার পর মাপা হচ্ছে না — এটি এই অঙ্কনের মূল বৈশিষ্ট্য।",
        en: "⚠️ The altitude is drawn first here, not measured after the base — that's the key twist in this construction.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { D: g.D, A: g.A }, entities: [segEnt(g.D, g.A, "given")], toolAnim: toolRuler(g.D, g.A) };
      },
    },
    {
      id: "s2a",
      title: { bn: "ধাপ ২ক: A থেকে চাপ — AD-এর দুই পাশে চিহ্নিত করো", en: "Step 2a: Arc from A — marks both sides of AD" },
      narration: { bn: "A কেন্দ্র করে একটি চাপ আঁকো, যা AD রেখাকে দুই পাশে সমান দূরত্বে ছেদ করে।", en: "Centred at A, strike an arc crossing line AD at equal distances on both sides." },
      tool: "compass",
      action: "dropPerpendicular",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { r, alongDirDeg } = g.perpAtA;
        return { entities: [arcEnt(g.A, r, alongDirDeg, alongDirDeg + 180, "construction")], toolAnim: toolCompass(g.A, r, alongDirDeg, alongDirDeg + 180) };
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
        const { M: m1, r2, X } = g.perpAtA;
        const sw = arcSweepTo(m1, X, { padding: 8 });
        return { entities: [arcEnt(m1, r2, sw.startAngle, sw.endAngle, "construction")], toolAnim: toolCompass(m1, r2, sw.startAngle, sw.endAngle) };
      },
    },
    {
      id: "s2c",
      title: { bn: "ধাপ ২গ: দ্বিতীয় সমান চাপ — লম্ব রেখা PQ", en: "Step 2c: Second equal arc — perpendicular line PQ" },
      narration: { bn: "একই ব্যাসার্ধে অন্য বিন্দু থেকেও চাপ আঁকো; ছেদবিন্দু দিয়ে A-এর মধ্য দিয়ে রেখা টানলেই তা AD-এর ওপর লম্ব হয় — উভয় পাশে বাড়িয়ে PQ পাও।", en: "Strike the same-radius arc from the other point; the line through A and the crossing point is perpendicular to AD — extend it both ways to get PQ." },
      tool: "compass",
      action: "dropPerpendicular",
      radiusLockRef: "s2b",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { N: n1, r2, X } = g.perpAtA;
        const sw = arcSweepTo(n1, X, { padding: 8 });
        return {
          namedPoints: { P: g.P, Q: g.Q },
          entities: [arcEnt(n1, r2, sw.startAngle, sw.endAngle, "construction"), segEnt(g.P, g.Q, "construction"), rightAngleEnt(g.A, g.D, g.Q)],
          toolAnim: toolCompass(n1, r2, sw.startAngle, sw.endAngle),
        };
      },
    },
    {
      id: "s3a",
      title: { bn: "ধাপ ৩ক: D থেকে চাপ — AD-এর দুই পাশে চিহ্নিত করো", en: "Step 3a: Arc from D — marks both sides of AD" },
      narration: { bn: "D কেন্দ্র করে একটি চাপ আঁকো, যা AD রেখাকে দুই পাশে সমান দূরত্বে ছেদ করে।", en: "Centred at D, strike an arc crossing line AD at equal distances on both sides." },
      tool: "compass",
      action: "dropPerpendicular",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { r, alongDirDeg } = g.perpAtD;
        return { entities: [arcEnt(g.D, r, alongDirDeg, alongDirDeg + 180, "construction")], toolAnim: toolCompass(g.D, r, alongDirDeg, alongDirDeg + 180) };
      },
    },
    {
      id: "s3b",
      title: { bn: "ধাপ ৩খ: দুই বিন্দু থেকে সমান ব্যাসার্ধে চাপ", en: "Step 3b: Equal-radius arcs from those two points" },
      narration: { bn: "সেই দুই বিন্দু থেকে সমান, বড় ব্যাসার্ধে দুটি চাপ আঁকো।", en: "From those two points, strike two equal, larger-radius arcs." },
      tool: "compass",
      action: "dropPerpendicular",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { M: m1, r2, X } = g.perpAtD;
        const sw = arcSweepTo(m1, X, { padding: 8 });
        return { entities: [arcEnt(m1, r2, sw.startAngle, sw.endAngle, "construction")], toolAnim: toolCompass(m1, r2, sw.startAngle, sw.endAngle) };
      },
    },
    {
      id: "s3c",
      title: { bn: "ধাপ ৩গ: দ্বিতীয় সমান চাপ — ভূমি-রেখা MN", en: "Step 3c: Second equal arc — base line MN" },
      narration: { bn: "একই ব্যাসার্ধে অন্য বিন্দু থেকে চাপ আঁকো; ছেদবিন্দু দিয়ে D-এর মধ্য দিয়ে রেখা টানলেই তা AD-এর ওপর লম্ব হয় — এটিই ত্রিভুজের ভূমি-রেখা MN।", en: "Strike the same-radius arc from the other point; the line through D and the crossing point is perpendicular to AD — this becomes the triangle's base line MN." },
      tool: "compass",
      action: "dropPerpendicular",
      radiusLockRef: "s3b",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { N: n1, r2, X } = g.perpAtD;
        const sw = arcSweepTo(n1, X, { padding: 8 });
        return {
          namedPoints: { M: g.M, N: g.N },
          entities: [arcEnt(n1, r2, sw.startAngle, sw.endAngle, "construction"), segEnt(g.M, g.N, "construction"), rightAngleEnt(g.D, g.A, g.N)],
          toolAnim: toolCompass(n1, r2, sw.startAngle, sw.endAngle),
        };
      },
    },
    {
      id: "s4",
      title: { bn: "ধাপ ৪: A-তে ∠QAT = ∠B আঁকো — T বিন্দু", en: "Step 4: At A, draw ∠QAT = ∠B — point T" },
      narration: { bn: "রশ্মি AQ-এর সাথে ∠B কোণ করে রশ্মি AT আঁকো; এটি MN-কে T বিন্দুতে ছেদ করে।", en: "At A, draw ray AT making angle ∠B with AQ; it meets MN at T." },
      tool: "protractor",
      action: "drawAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { T: g.T },
          entities: [segEnt(g.A, g.T, "final")],
          toolAnim: toolProtractor(g.A, 0, g.dirAT),
        };
      },
    },
    {
      id: "s5",
      title: { bn: "ধাপ ৫: A-তে ∠PAS = ∠C আঁকো — S বিন্দু", en: "Step 5: At A, draw ∠PAS = ∠C — point S" },
      narration: { bn: "রশ্মি AP-এর সাথে ∠C কোণ করে রশ্মি AS আঁকো; এটি MN-কে S বিন্দুতে ছেদ করে।", en: "At A, draw ray AS making angle ∠C with AP; it meets MN at S." },
      tool: "protractor",
      action: "drawAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { S: g.S },
          entities: [segEnt(g.A, g.S, "final")],
          toolAnim: toolProtractor(g.A, 180, g.dirAS),
        };
      },
    },
    {
      id: "s6",
      title: { bn: "ধাপ ৬: △AST সম্পন্ন", en: "Step 6: △AST complete" },
      narration: { bn: "S ও T যুক্ত হলেই — ভূমি ST-এর ওপর A শীর্ষবিন্দু নিয়ে কাঙ্ক্ষিত △AST পাওয়া গেল।", en: "Joining S and T gives the required △AST, with apex A above base ST." },
      tool: "ruler",
      action: "joinPoints",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [segEnt(g.S, g.T, "final")], toolAnim: toolRuler(g.S, g.T) };
      },
    },
  ],
});

export default meta;
