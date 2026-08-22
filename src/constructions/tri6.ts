// T-01 / #6 — Two base angles + the altitude from the apex to the base.
// Given: ∠B, ∠C, altitude d. Unlike the other triangle constructions this
// one works "backwards": the altitude AD is drawn FIRST and is perpendicular
// to the base by construction, not measured after the fact.
import { angleOf, intersectLineLine, pointAtDistanceAngle, pt } from "@/geom/core";
import { rightAngleEnt, segEnt, toolCompass, toolProtractor, toolRuler } from "./stepHelpers";
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
  const P = pt(-plen, d, "P");
  const Q = pt(plen, d, "Q");
  const mlen = Math.max(Math.abs(S.x), Math.abs(T.x)) + d * 0.35;
  const M = pt(-mlen, 0, "M");
  const N = pt(mlen, 0, "N");
  return { D, A, S, T, P, Q, M, N, dirAS, dirAT };
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
      id: "s2",
      title: { bn: "ধাপ ২: A বিন্দুতে AD-এর লম্ব PQ আঁকো", en: "Step 2: At A, draw PQ perpendicular to AD" },
      narration: { bn: "A বিন্দুতে AD রেখার সাথে লম্ব রেখা PQ আঁকো।", en: "At A, draw line PQ perpendicular to AD." },
      tool: "compass",
      action: "dropPerpendicular",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { P: g.P, Q: g.Q },
          entities: [segEnt(g.P, g.Q, "construction"), rightAngleEnt(g.A, g.D, g.Q)],
          toolAnim: toolCompass(g.A, 0.6, angleOf(g.A, g.D), angleOf(g.A, g.D) + 90),
        };
      },
    },
    {
      id: "s3",
      title: { bn: "ধাপ ৩: D বিন্দুতে AD-এর লম্ব MN আঁকো", en: "Step 3: At D, draw MN perpendicular to AD" },
      narration: { bn: "D বিন্দুতে AD রেখার সাথে লম্ব রেখা MN আঁকো — এটিই হবে ত্রিভুজের ভূমি-রেখা।", en: "At D, draw line MN perpendicular to AD — this will hold the triangle's base." },
      tool: "compass",
      action: "dropPerpendicular",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { M: g.M, N: g.N },
          entities: [segEnt(g.M, g.N, "construction"), rightAngleEnt(g.D, g.A, g.N)],
          toolAnim: toolCompass(g.D, 0.6, angleOf(g.D, g.A), angleOf(g.D, g.A) - 90),
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
