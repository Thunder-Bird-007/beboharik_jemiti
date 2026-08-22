// T-01 / #3 — Base + one base angle + the SUM of the other two sides.
// Given: base b (QR), ∠Q, sum S = PQ + PR. Classic "sum" method: lay off
// QL = S along the base-angle ray, join R,L, then copy the base angle of
// isosceles triangle QLR at R so the copy lands on QL at the apex P.
import { angleBetween, angleOf, pt } from "@/geom/core";
import { angleMarkEnt, copyAngleOntoLine, segEnt, toolCompass, toolProtractor, toolRuler } from "./stepHelpers";
import { registerConstruction } from "./registry";
import type { ConstructionMeta } from "./types";

function geometry(inputs: Record<string, number>) {
  const { b, angleQ, S } = inputs;
  const Q = pt(0, 0, "Q");
  const R = pt(b, 0, "R");
  const dirQX = angleQ;
  const X = pt(Q.x + (b * 0.9) * Math.cos((dirQX * Math.PI) / 180), Q.y + (b * 0.9) * Math.sin((dirQX * Math.PI) / 180), "X");
  const L = pt(Q.x + S * Math.cos((dirQX * Math.PI) / 180), Q.y + S * Math.sin((dirQX * Math.PI) / 180), "L");
  const angleQLR = angleBetween(Q, L, R);
  const P = copyAngleOntoLine(R, L, angleQLR, Q, L, Q);
  P.label = "P";
  P.labelEn = "P";
  return { Q, R, X, L, P, dirQX, angleQLR };
}

const meta: ConstructionMeta = registerConstruction({
  id: "tri-3",
  index: 3,
  topic: "T01",
  title: { bn: "৩। ভূমি, একটি ভূমিকোণ ও অপর দুই বাহুর সমষ্টি দিয়ে ত্রিভুজ", en: "3. Base + one base angle + sum of other two sides" },
  boardTags: "[DB,CB'25; SB,RB'24…]",
  givenSummary: (i) => ({
    bn: `ভূমি QR = ${i.b} সেমি, ∠Q = ${i.angleQ}°, অপর দুই বাহুর সমষ্টি = ${i.S} সেমি — এমন △PQR আঁকতে হবে।`,
    en: `Base QR = ${i.b} cm, ∠Q = ${i.angleQ}°, sum of the other two sides = ${i.S} cm — construct △PQR.`,
  }),
  inputs: [
    { key: "b", label: { bn: "ভূমি QR", en: "base QR" }, unit: "cm", defaultValue: 5, min: 3, max: 8, step: 0.5 },
    { key: "angleQ", label: { bn: "∠Q", en: "∠Q" }, unit: "deg", defaultValue: 45, min: 20, max: 100, step: 1 },
    { key: "S", label: { bn: "PQ + PR (সমষ্টি)", en: "PQ + PR (sum)" }, unit: "cm", defaultValue: 7, min: 5.5, max: 12, step: 0.5 },
  ],
  validate: (i) => {
    if (i.S <= i.b * 1.02) {
      return { bn: "অপর দুই বাহুর সমষ্টি ভূমির চেয়ে বেশি হতে হবে (ত্রিভুজ অসমতা)।", en: "The sum of the other two sides must exceed the base (triangle inequality)." };
    }
    return null;
  },
  scale: 60,
  steps: [
    {
      id: "s1",
      title: { bn: "ধাপ ১: QR = b আঁকো", en: "Step 1: Draw QR = b" },
      narration: { bn: "একটি রশ্মিতে QR = b সেমি কেটে নাও।", en: "On a ray, cut QR equal to the base b." },
      tool: "ruler",
      action: "markLength",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { Q: g.Q, R: g.R }, entities: [segEnt(g.Q, g.R, "given")], toolAnim: toolRuler(g.Q, g.R) };
      },
    },
    {
      id: "s2",
      title: { bn: "ধাপ ২: Q বিন্দুতে ∠RQX = ∠Q আঁকো", en: "Step 2: At Q, draw ∠RQX = ∠Q" },
      narration: { bn: "Q বিন্দুতে QR-এর সাথে প্রদত্ত কোণে রশ্মি QX আঁকো।", en: "At Q, draw ray QX at the given angle to QR." },
      tool: "protractor",
      action: "drawAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { X: g.X },
          entities: [segEnt(g.Q, g.X, "given"), angleMarkEnt(g.Q, g.R, g.X, `${inputs.angleQ}°`, 0.7, "given")],
          toolAnim: toolProtractor(g.Q, 0, g.dirQX),
        };
      },
    },
    {
      id: "s3",
      title: { bn: "ধাপ ৩: QX-এ QL = সমষ্টি কেটে নাও", en: "Step 3: On QX, cut QL = sum" },
      narration: { bn: "রশ্মি QX-এর ওপর Q থেকে PQ+PR-এর সমান দূরত্বে L চিহ্নিত করো।", en: "On ray QX, mark L at a distance equal to PQ + PR from Q." },
      tool: "compass",
      action: "markLength",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { L: g.L },
          entities: [segEnt(g.Q, g.L, "given")],
          toolAnim: toolCompass(g.Q, inputs.S, g.dirQX - 25, g.dirQX, `${inputs.S} সেমি`),
        };
      },
    },
    {
      id: "s4",
      title: { bn: "ধাপ ৪: R, L যুক্ত করো", en: "Step 4: Join R, L" },
      narration: { bn: "R ও L বিন্দু দুটি যুক্ত করে রেখাংশ RL আঁকো।", en: "Join R and L with a segment." },
      tool: "ruler",
      action: "joinPoints",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [segEnt(g.R, g.L, "construction")], toolAnim: toolRuler(g.R, g.L) };
      },
    },
    {
      id: "s5",
      title: { bn: "ধাপ ৫: R-এ ∠LRT = ∠QLR আঁকো — P বিন্দু", en: "Step 5: At R, draw ∠LRT = ∠QLR — point P" },
      narration: {
        bn: "যে পাশে Q বিন্দু আছে সেই পাশে, R বিন্দুতে ∠QLR-এর সমান কোণ ∠LRT আঁকো; RT রশ্মি QX-কে P বিন্দুতে ছেদ করে।",
        en: "On the side where Q lies, at R copy ∠QLR as ∠LRT; ray RT meets QX at P.",
      },
      tool: "compass",
      action: "drawAngle",
      caution: {
        bn: "⚠️ কোণটি অবশ্যই সেই পাশে আঁকতে হবে যেখানে Q বিন্দু আছে, নাহলে P বিন্দু QX রশ্মির ওপর পড়বে না।",
        en: "⚠️ The angle must be drawn on the side where Q lies, or P won't land on ray QX at all.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { P: g.P },
          entities: [segEnt(g.R, g.P, "final"), angleMarkEnt(g.R, g.L, g.P, undefined, 0.6, "final")],
          toolAnim: toolCompass(g.R, 0.7, angleOf(g.R, g.L), angleOf(g.R, g.P), "∠LRT"),
        };
      },
    },
    {
      id: "s6",
      title: { bn: "ধাপ ৬: △PQR সম্পন্ন", en: "Step 6: △PQR complete" },
      narration: { bn: "PQ, QR, RP — এই তিন বাহু নিয়ে কাঙ্ক্ষিত △PQR পাওয়া গেল।", en: "With sides PQ, QR, RP, the required △PQR is complete." },
      tool: "pencil",
      action: "info",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [segEnt(g.Q, g.P, "final")], toolAnim: { tool: "pencil", at: g.P } };
      },
    },
  ],
});

export default meta;
