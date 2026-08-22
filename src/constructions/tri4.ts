// T-01 / #4 — Base + one base angle + the DIFFERENCE of the other two sides.
// Given: base a (BC), ∠B = x, difference d = AB - AC. Classic "difference"
// method: lay off BD = d along the base-angle ray (D between B and where A
// will land), join C,D, then copy ∠EDC at C onto the ray so it lands at A —
// this makes triangle ACD isosceles (CA = AD), giving AB - AC = BD = d.
import { angleBetween, angleOf, pointAtDistanceAngle, pt } from "@/geom/core";
import { copyAngleCompass } from "./classicOps";
import { angleMarkEnt, arcEnt, arcSweepTo, copyAngleOntoLine, segEnt, toolCompass, toolProtractor, toolRuler } from "./stepHelpers";
import { registerConstruction } from "./registry";
import type { ConstructionMeta } from "./types";

function geometry(inputs: Record<string, number>) {
  const { a, x, d } = inputs;
  const B = pt(0, 0, "B");
  const C = pt(a, 0, "C");
  const dirBE = x;
  const Efar = pt(B.x + a * 1.35 * Math.cos((dirBE * Math.PI) / 180), B.y + a * 1.35 * Math.sin((dirBE * Math.PI) / 180), "E");
  const D = pointAtDistanceAngle(B, d, dirBE);
  D.label = "D";
  D.labelEn = "D";
  const angleEDC = angleBetween(Efar, D, C);
  const A = copyAngleOntoLine(C, D, angleEDC, B, Efar, Efar);
  A.label = "A";
  A.labelEn = "A";
  const copyOp = copyAngleCompass(D, Efar, C, C, angleOf(C, D), angleOf(C, A));
  return { B, C, D, Efar, A, dirBE, angleEDC, copyOp };
}

const meta: ConstructionMeta = registerConstruction({
  id: "tri-4",
  index: 4,
  topic: "T01",
  title: { bn: "৪। ভূমি, একটি ভূমিকোণ ও অপর দুই বাহুর অন্তর দিয়ে ত্রিভুজ", en: "4. Base + one base angle + difference of other two sides" },
  boardTags: "[JB,SB'25; DB'24…]",
  givenSummary: (i) => ({
    bn: `ভূমি BC = ${i.a} সেমি, ∠x = ${i.x}°, অপর দুই বাহুর অন্তর = ${i.d} সেমি — এমন △ABC আঁকতে হবে।`,
    en: `Base BC = ${i.a} cm, ∠x = ${i.x}°, difference of the other two sides = ${i.d} cm — construct △ABC.`,
  }),
  inputs: [
    { key: "a", label: { bn: "ভূমি BC", en: "base BC" }, unit: "cm", defaultValue: 5.5, min: 3, max: 9, step: 0.5 },
    { key: "x", label: { bn: "∠x (at B)", en: "∠x (at B)" }, unit: "deg", defaultValue: 30, min: 15, max: 90, step: 1 },
    { key: "d", label: { bn: "AB − AC (অন্তর)", en: "AB − AC (difference)" }, unit: "cm", defaultValue: 2.5, min: 0.5, max: 5, step: 0.5 },
  ],
  validate: (i) => {
    if (i.d >= i.a * 0.95) {
      return { bn: "অন্তর d অবশ্যই ভূমি a-এর চেয়ে ছোট হতে হবে।", en: "The difference d must be smaller than the base a." };
    }
    return null;
  },
  scale: 58,
  steps: [
    {
      id: "s1",
      title: { bn: "ধাপ ১: BC = a আঁকো", en: "Step 1: Draw BC = a" },
      narration: { bn: "একটি রশ্মিতে BC = a সেমি কেটে নাও।", en: "On a ray, cut BC equal to the base a." },
      tool: "ruler",
      action: "markLength",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { namedPoints: { B: g.B, C: g.C }, entities: [segEnt(g.B, g.C, "given")], toolAnim: toolRuler(g.B, g.C) };
      },
    },
    {
      id: "s2",
      title: { bn: "ধাপ ২: B বিন্দুতে ∠CBE = x আঁকো", en: "Step 2: At B, draw ∠CBE = x" },
      narration: { bn: "B বিন্দুতে BC-এর সাথে x কোণ করে রশ্মি BE আঁকো।", en: "At B, draw ray BE at angle x to BC." },
      tool: "protractor",
      action: "drawAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          entities: [segEnt(g.B, g.Efar, "given"), angleMarkEnt(g.B, g.C, g.Efar, `${inputs.x}°`, 0.7, "given")],
          toolAnim: toolProtractor(g.B, 0, g.dirBE),
        };
      },
    },
    {
      id: "s3",
      title: { bn: "ধাপ ৩: BE-তে BD = অন্তর কেটে নাও", en: "Step 3: On BE, cut BD = difference" },
      narration: { bn: "রশ্মি BE-এর ওপর B থেকে AB−AC-এর সমান দূরত্বে D চিহ্নিত করো।", en: "On ray BE, mark D at a distance equal to AB − AC from B." },
      tool: "compass",
      action: "markLength",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return {
          namedPoints: { D: g.D },
          entities: [segEnt(g.B, g.D, "given")],
          toolAnim: toolCompass(g.B, inputs.d, g.dirBE - 20, g.dirBE, `${inputs.d} সেমি`),
        };
      },
    },
    {
      id: "s4",
      title: { bn: "ধাপ ৪: C, D যুক্ত করো", en: "Step 4: Join C, D" },
      narration: { bn: "C ও D বিন্দু দুটি যুক্ত করে রেখাংশ CD আঁকো।", en: "Join C and D with a segment." },
      tool: "ruler",
      action: "joinPoints",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [segEnt(g.C, g.D, "construction")], toolAnim: toolRuler(g.C, g.D) };
      },
    },
    {
      id: "s5a",
      title: { bn: "ধাপ ৫ক: D থেকে চাপ — DE ও DC-কে ছেদ করে", en: "Step 5a: Arc from D — crosses DE and DC" },
      narration: {
        bn: "∠EDC কপি করতে, D কেন্দ্র করে একটি চাপ আঁকো যা DE ও DC উভয়কে ছেদ করে।",
        en: "To copy ∠EDC, strike an arc centred at D crossing both DE and DC.",
      },
      tool: "compass",
      action: "drawAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { P, Q, r1 } = g.copyOp;
        return { entities: [arcEnt(g.D, r1, angleOf(g.D, Q), angleOf(g.D, P), "construction")], toolAnim: toolCompass(g.D, r1, angleOf(g.D, Q), angleOf(g.D, P)) };
      },
    },
    {
      id: "s5b",
      title: { bn: "ধাপ ৫খ: C-তে একই ব্যাসার্ধে চাপ (CD বরাবর)", en: "Step 5b: Same-radius arc at C (along CD)" },
      narration: {
        bn: "DC রেখার যে পাশে E আছে সেই পাশে, কম্পাসের ব্যাসার্ধ না পাল্টিয়ে C থেকে CD বরাবর একই ব্যাসার্ধে চাপ আঁকো।",
        en: "On the side of DC where E lies, without changing the compass, strike the same-radius arc at C, crossing CD.",
      },
      tool: "compass",
      action: "drawAngle",
      radiusLockRef: "s5a",
      caution: {
        bn: "⚠️ এটি অন্তর পদ্ধতি (#৩-এর সমষ্টি পদ্ধতির বিপরীত) — এখানে D থাকে B ও A-এর মাঝে, যেখানে সমষ্টি পদ্ধতিতে L থাকত A-এর ওপাশে।",
        en: "⚠️ This is the difference method (opposite of #3's sum method) — here D sits between B and A, whereas in the sum method L sat beyond A.",
      },
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { r1, Pt } = g.copyOp;
        const sw = arcSweepTo(g.C, Pt, { padding: 10 });
        return { entities: [arcEnt(g.C, r1, sw.startAngle, sw.endAngle, "construction")], toolAnim: toolCompass(g.C, r1, sw.startAngle, sw.endAngle) };
      },
    },
    {
      id: "s5c",
      title: { bn: "ধাপ ৫গ: চাপ-দূরত্ব বসিয়ে A বিন্দু পাও", en: "Step 5c: Transfer the arc-chord to get point A" },
      narration: {
        bn: "প্রথম চাপের চাপ-দূরত্ব C-এর চাপে বসাও; পাওয়া বিন্দু দিয়ে রশ্মি CA টানলে তা BE-কে A বিন্দুতে ছেদ করে।",
        en: "Transfer the chord-distance onto C's arc; ray CA through that point cuts BE at A.",
      },
      tool: "compass",
      action: "drawAngle",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        const { r2, Pt, Qt } = g.copyOp;
        const sw = arcSweepTo(Pt, Qt, { padding: 8 });
        return {
          namedPoints: { A: g.A },
          entities: [arcEnt(Pt, r2, sw.startAngle, sw.endAngle, "construction"), segEnt(g.C, g.A, "final"), angleMarkEnt(g.C, g.D, g.A, undefined, 0.6, "final")],
          toolAnim: toolCompass(Pt, r2, sw.startAngle, sw.endAngle),
        };
      },
    },
    {
      id: "s6",
      title: { bn: "ধাপ ৬: △ABC সম্পন্ন", en: "Step 6: △ABC complete" },
      narration: { bn: "AB, BC, CA — এই তিন বাহু নিয়ে কাঙ্ক্ষিত △ABC পাওয়া গেল।", en: "With sides AB, BC, CA, the required △ABC is complete." },
      tool: "pencil",
      action: "info",
      compute: (_s, inputs) => {
        const g = geometry(inputs);
        return { entities: [segEnt(g.B, g.A, "final")], toolAnim: { tool: "pencil", at: g.A } };
      },
    },
  ],
});

export default meta;
