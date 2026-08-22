// T-01 / #1 — Two base angles + perimeter (the "perimeter method").
// Given: ∠x, ∠y, perimeter p. Classic construction: lay off DE = p, build the
// two base angles at D and E, bisect them to find apex A, then copy the base
// angles of triangle ADE back onto A to cut the final base at B and C.
import { angleBetween, angleOf, bisectAngleDir, intersectLineLine, pt } from "@/geom/core";
import { angleMarkEnt, copyAngleOntoLine, segEnt, toolCompass, toolProtractor, toolRuler } from "./stepHelpers";
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

  const dirBisD = bisectAngleDir(L, D, E);
  const dirBisE = bisectAngleDir(M, E, D);
  const far1 = pt(D.x + 1000 * Math.cos((dirBisD * Math.PI) / 180), D.y + 1000 * Math.sin((dirBisD * Math.PI) / 180));
  const far2 = pt(E.x + 1000 * Math.cos((dirBisE * Math.PI) / 180), E.y + 1000 * Math.sin((dirBisE * Math.PI) / 180));
  const A = intersectLineLine(D, far1, E, far2).point ?? pt((D.x + E.x) / 2, armLen, "A");
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

  return { D, E, L, M, A, B, C, dirDL, dirEM, armLen, angleADE, angleAED };
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
    {
      id: "s4",
      title: { bn: "ধাপ ৪: ∠LDE সমদ্বিখণ্ডন করো", en: "Step 4: Bisect ∠LDE" },
      narration: { bn: "কম্পাস দিয়ে ∠LDE-কে সমদ্বিখণ্ডন করে রশ্মি DG আঁকো।", en: "Using the compass, bisect ∠LDE to get ray DG." },
      tool: "compass",
      action: "bisectAngle",
      caution: {
        bn: "⚠️ সমদ্বিখণ্ডনের জন্য মূল ৫০°/৬০° কোণ দুটি থেকেই আঁকতে হবে, চূড়ান্ত ত্রিভুজের কোণ থেকে নয়।",
        en: "⚠️ Bisect from the original x/y angles themselves — not from the final triangle's angles.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          entities: [segEnt(g.D, g.A, "construction")],
          toolAnim: toolCompass(g.D, g.armLen * 0.55, 0, g.dirDL),
        };
      },
    },
    {
      id: "s5",
      title: { bn: "ধাপ ৫: ∠MED সমদ্বিখণ্ডন করো, A বিন্দুতে মিলিত", en: "Step 5: Bisect ∠MED, meeting at A" },
      narration: { bn: "∠MED-কে সমদ্বিখণ্ডন করে রশ্মি EH আঁকো; এটি রশ্মি DG-কে A বিন্দুতে ছেদ করে।", en: "Bisect ∠MED to get ray EH; it meets ray DG at A." },
      tool: "compass",
      action: "bisectAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          entities: [segEnt(g.E, g.A, "construction")],
          toolAnim: toolCompass(g.E, g.armLen * 0.55, 180, g.dirEM),
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
    {
      id: "s7",
      title: { bn: "ধাপ ৭: ∠DAB = ∠ADE আঁকো (B বিন্দু)", en: "Step 7: Draw ∠DAB = ∠ADE (point B)" },
      narration: { bn: "A বিন্দুতে ∠ADE-এর সমান কোণ ∠DAB আঁকো; AB রেখাংশ DE-কে B বিন্দুতে ছেদ করে।", en: "At A, copy ∠ADE as ∠DAB; segment AB cuts DE at B." },
      tool: "compass",
      action: "drawAngle",
      caution: {
        bn: "⚠️ কম্পাসের ব্যাসার্ধ পরিবর্তন না করে সমান চাপ ব্যবহার করে কোণ কপি করতে হবে, এবং তা রেখার সঠিক পাশে (D-এর পাশে) আঁকতে হবে।",
        en: "⚠️ Copy the angle with equal compass arcs (radius unchanged) and place it on the correct side of the line (the D side).",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { B: g.B },
          entities: [segEnt(g.A, g.B, "final"), angleMarkEnt(g.A, g.D, g.B, undefined, 0.55, "final")],
          toolAnim: toolCompass(g.A, 0.6, angleOf(g.A, g.D), angleOf(g.A, g.B), "∠DAB"),
        };
      },
    },
    {
      id: "s8",
      title: { bn: "ধাপ ৮: ∠EAC = ∠AED আঁকো (C বিন্দু)", en: "Step 8: Draw ∠EAC = ∠AED (point C)" },
      narration: { bn: "A বিন্দুতে ∠AED-এর সমান কোণ ∠EAC আঁকো; AC রেখাংশ DE-কে C বিন্দুতে ছেদ করে।", en: "At A, copy ∠AED as ∠EAC; segment AC cuts DE at C." },
      tool: "compass",
      action: "drawAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { C: g.C },
          entities: [segEnt(g.A, g.C, "final"), angleMarkEnt(g.A, g.E, g.C, undefined, 0.55, "final")],
          toolAnim: toolCompass(g.A, 0.6, angleOf(g.A, g.E), angleOf(g.A, g.C), "∠EAC"),
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
