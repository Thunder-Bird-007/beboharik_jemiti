// T-01 / #2 — Construct a single 105° angle with only pencil & compass.
// 105 = 90 + 15, and 15 = 60 / 4 (two successive bisections of a compass-built
// 60° angle). No protractor is used anywhere in this construction.
import { pointAtDistanceAngle, pt } from "@/geom/core";
import { angleMarkEnt, segEnt, toolCompass } from "./stepHelpers";
import { registerConstruction } from "./registry";
import type { ConstructionMeta } from "./types";

const RAY_LEN = 4.6;

function geometry() {
  const A = pt(0, 0, "A");
  const B = pt(RAY_LEN, 0, "B");
  const at = (deg: number, label?: string) => {
    const p = pointAtDistanceAngle(A, RAY_LEN, deg);
    if (label) {
      p.label = label;
      p.labelEn = label;
    }
    return p;
  };
  const Q = at(60, "Q");
  const R = at(30, "R");
  const S = at(15, "S");
  const C = at(90, "C");
  const D = at(105, "D");
  return { A, B, Q, R, S, C, D };
}

const meta: ConstructionMeta = registerConstruction({
  id: "tri-2",
  index: 2,
  topic: "T01",
  title: { bn: "২। শুধু পেন্সিল-কম্পাসে ১০৫° কোণ আঁকা", en: "2. A 105° angle using only pencil & compass" },
  boardTags: "[DB,RB'25; CB,SB'24…]",
  givenSummary: () => ({
    bn: "লক্ষ্য কোণ = ১০৫°। কোনো প্রোট্রাক্টর ছাড়া, শুধু পেন্সিল ও কম্পাস দিয়ে আঁকতে হবে। কৌশল: ১০৫° = ৯০° + ১৫°, এবং ১৫° = ৬০°-এর চার ভাগের এক ভাগ।",
    en: "Target angle = 105°. Using only pencil & compass (no protractor). Trick: 105° = 90° + 15°, and 15° is a quarter of 60°.",
  }),
  inputs: [],
  scale: 85,
  steps: [
    {
      id: "s1",
      title: { bn: "ধাপ ১: ভূমিরশ্মি AB আঁকো", en: "Step 1: Draw base ray AB" },
      narration: { bn: "A বিন্দু থেকে একটি ভূমিরশ্মি AB আঁকো।", en: "Draw a base ray AB from vertex A." },
      tool: "ruler",
      action: "drawRay",
      compute: () => {
        const g = geometry();
        return { namedPoints: { A: g.A, B: g.B }, entities: [segEnt(g.A, g.B, "given")], toolAnim: { tool: "ruler", from: g.A, to: g.B } };
      },
    },
    {
      id: "s2",
      title: { bn: "ধাপ ২: কম্পাসে ৬০° কোণ AQ আঁকো", en: "Step 2: Compass-construct 60° angle AQ" },
      narration: {
        bn: "A থেকে একই ব্যাসার্ধে দুটি চাপ কেটে (একটি AB-তে, একটি তার থেকে) ৬০° কোণ ∠QAB পাওয়া যায় — এটিই সমবাহু ত্রিভুজের কোণ।",
        en: "Striking two equal-radius arcs from A gives the classic 60° angle ∠QAB — the equilateral-triangle angle.",
      },
      tool: "compass",
      action: "drawAngle",
      compute: () => {
        const g = geometry();
        return {
          namedPoints: { Q: g.Q },
          entities: [segEnt(g.A, g.Q, "construction"), angleMarkEnt(g.A, g.B, g.Q, "60°", 0.7, "given")],
          toolAnim: toolCompass(g.A, RAY_LEN * 0.55, 0, 60),
        };
      },
    },
    {
      id: "s3",
      title: { bn: "ধাপ ৩: ∠QAB সমদ্বিখণ্ডন করো — ৩০°", en: "Step 3: Bisect ∠QAB — 30°" },
      narration: { bn: "৬০° কোণকে সমদ্বিখণ্ডন করলে ৩০° কোণ ∠RAB পাওয়া যায়।", en: "Bisecting the 60° angle gives a 30° angle ∠RAB." },
      tool: "compass",
      action: "bisectAngle",
      caution: {
        bn: "⚠️ সমদ্বিখণ্ডনের দুই চাপই একই ব্যাসার্ধে আঁকতে হবে — কম্পাস পুনরায় মাপা যাবে না।",
        en: "⚠️ Both bisecting arcs must use the same radius — don't re-measure the compass mid-bisection.",
      },
      compute: () => {
        const g = geometry();
        return {
          namedPoints: { R: g.R },
          entities: [segEnt(g.A, g.R, "construction"), angleMarkEnt(g.A, g.B, g.R, "30°", 0.9, "given")],
          toolAnim: toolCompass(g.A, RAY_LEN * 0.4, 0, 30),
        };
      },
    },
    {
      id: "s4",
      title: { bn: "ধাপ ৪: ∠RAB সমদ্বিখণ্ডন করো — ১৫°", en: "Step 4: Bisect ∠RAB — 15°" },
      narration: { bn: "৩০° কোণকে আবার সমদ্বিখণ্ডন করলে ১৫° কোণ ∠SAB পাওয়া যায়।", en: "Bisecting 30° again gives a 15° angle ∠SAB." },
      tool: "compass",
      action: "bisectAngle",
      radiusLockRef: "s3",
      caution: {
        bn: "🔒 এই ধাপেও কম্পাসের ব্যাসার্ধ প্রতিটি বাহুতে সমান রাখতে হবে — এই অঙ্কনে কম্পাস পুনঃব্যবহারের সবচেয়ে বেশি সুযোগ এখানেই।",
        en: "🔒 Keep the compass radius equal on both arms here too — this construction reuses the compass the most.",
      },
      compute: () => {
        const g = geometry();
        return {
          namedPoints: { S: g.S },
          entities: [segEnt(g.A, g.S, "construction"), angleMarkEnt(g.A, g.B, g.S, "15°", 1.1, "given")],
          toolAnim: toolCompass(g.A, RAY_LEN * 0.3, 0, 15),
        };
      },
    },
    {
      id: "s5",
      title: { bn: "ধাপ ৫: A বিন্দুতে লম্ব AC আঁকো — ৯০°", en: "Step 5: Erect a perpendicular AC at A — 90°" },
      narration: { bn: "AB-এর উপর A বিন্দুতে কম্পাস দিয়ে একটি লম্ব AC আঁকো, অর্থাৎ ∠CAB = ৯০°।", en: "Using the compass, erect AC perpendicular to AB at A, i.e. ∠CAB = 90°." },
      tool: "compass",
      action: "dropPerpendicular",
      compute: () => {
        const g = geometry();
        return {
          namedPoints: { C: g.C },
          entities: [segEnt(g.A, g.C, "construction"), angleMarkEnt(g.A, g.B, g.C, "90°", 1.3, "given")],
          toolAnim: toolCompass(g.A, RAY_LEN * 0.8, 0, 90),
        };
      },
    },
    {
      id: "s6",
      title: { bn: "ধাপ ৬: AC-এর ওপাশে ১৫° বসাও — AD = ১০৫°", en: "Step 6: Lay off 15° beyond AC — AD = 105°" },
      narration: {
        bn: "কম্পাসে ∠SAB = ১৫° এর মাপ নিয়ে সেই একই ব্যাসার্ধ AC রশ্মির ওপাশে বসালে ∠DAB = ৯০° + ১৫° = ১০৫° পাওয়া যায়।",
        en: "Transfer the 15° opening (∠SAB) beyond ray AC with the compass to get ∠DAB = 90° + 15° = 105°.",
      },
      tool: "compass",
      action: "drawAngle",
      radiusLockRef: "s4",
      caution: {
        bn: "🔒 এই ১৫° অবশ্যই ধাপ ৪-এর কম্পাস-মাপ থেকেই বসাতে হবে, নতুন করে মাপা যাবে না।",
        en: "🔒 This 15° must be stepped off using the exact compass opening from step 4 — not re-measured.",
      },
      compute: () => {
        const g = geometry();
        return {
          namedPoints: { D: g.D },
          entities: [segEnt(g.A, g.D, "final"), angleMarkEnt(g.A, g.B, g.D, "105°", 1.55, "final")],
          toolAnim: toolCompass(g.A, RAY_LEN * 0.22, 90, 105, "১৫° (ধাপ ৪ থেকে)"),
        };
      },
    },
  ],
});

export default meta;
