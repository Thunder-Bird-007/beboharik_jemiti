// T-01 / #2 — Construct a single 105° angle with only pencil & compass.
// 105 = 90 + 15, and 15 = ½ of 30 = ¼ of 60. Every angle here is built with
// the real classical technique (equal-radius arcs), never a protractor.
import { angleOf, pointAtDistanceAngle, pt } from "@/geom/core";
import { bisectAngle, construct60, copyAngleCompass, perpendicularAtPoint } from "./classicOps";
import { angleMarkEnt, arcEnt, arcSweepTo, segEnt, toolCompass } from "./stepHelpers";
import { registerConstruction } from "./registry";
import type { ConstructionMeta } from "./types";

const RAY_LEN = 4.6;

function geometry() {
  const A = pt(0, 0, "A");
  const B = pt(RAY_LEN, 0, "B");

  const c60 = construct60(A, B, 1);
  const Q = pt(c60.Q.x, c60.Q.y, "Q");

  const bis30 = bisectAngle(A, Q, B);
  const R = pt(bis30.X.x, bis30.X.y, "R");

  const bis15 = bisectAngle(A, R, B);
  const S = pt(bis15.X.x, bis15.X.y, "S");

  const perp90 = perpendicularAtPoint(A, angleOf(A, B), 1, RAY_LEN * 0.55);
  const C = pt(perp90.X.x, perp90.X.y, "C");

  // Same-vertex angle transfer: copy ∠SAB (15°) beyond AC to land at 105°.
  const transfer = copyAngleCompass(A, S, B, A, angleOf(A, C), 105, 0.75);
  const D = pointAtDistanceAngle(A, RAY_LEN, 105);
  D.label = "D";
  D.labelEn = "D";

  return { A, B, Q, R, S, C, D, c60, bis30, bis15, perp90, transfer };
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
    // --- Real 60°: arc from A crossing AB, then equal arc from that point ---
    {
      id: "s2a",
      title: { bn: "ধাপ ২ক: A থেকে চাপ — AB-কে ছেদ করে", en: "Step 2a: Arc from A — crosses AB" },
      narration: { bn: "A কেন্দ্র করে একটি চাপ আঁকো, যা AB-কে P বিন্দুতে ছেদ করে।", en: "Centred at A, strike an arc crossing AB at a point P." },
      tool: "compass",
      action: "drawAngle",
      compute: () => {
        const g = geometry();
        return { entities: [arcEnt(g.A, g.c60.r, -8, 65, "construction")], toolAnim: toolCompass(g.A, g.c60.r, -8, 65) };
      },
    },
    {
      id: "s2b",
      title: { bn: "ধাপ ২খ: একই ব্যাসার্ধে P থেকে চাপ — ৬০° কোণ AQ", en: "Step 2b: Same-radius arc from P — 60° angle AQ" },
      narration: { bn: "কম্পাসের ব্যাসার্ধ না পাল্টিয়ে, P থেকে একই ব্যাসার্ধে চাপ আঁকো; এটি প্রথম চাপকে Q বিন্দুতে ছেদ করে — ∠QAB ঠিক ৬০° (সমবাহু ত্রিভুজের কোণ)।", en: "Without changing the compass, strike the same-radius arc from P; it meets the first arc at Q — ∠QAB is exactly 60° (the equilateral-triangle angle)." },
      tool: "compass",
      action: "drawAngle",
      radiusLockRef: "s2a",
      caution: {
        bn: "🔒 এই দ্বিতীয় চাপের ব্যাসার্ধ প্রথম চাপের সমান হতেই হবে — এটাই ৬০° কোণের রহস্য।",
        en: "🔒 This second arc's radius must equal the first — that equal radius is exactly what makes the angle 60°.",
      },
      compute: () => {
        const g = geometry();
        const sw = arcSweepTo(g.c60.P, g.Q, { padding: 8 });
        return {
          namedPoints: { Q: g.Q },
          entities: [arcEnt(g.c60.P, g.c60.r, sw.startAngle, sw.endAngle, "construction"), segEnt(g.A, g.Q, "construction"), angleMarkEnt(g.A, g.B, g.Q, "60°", 0.75, "given")],
          toolAnim: toolCompass(g.c60.P, g.c60.r, sw.startAngle, sw.endAngle),
        };
      },
    },
    // --- Real bisection of ∠QAB -> 30° ---
    {
      id: "s3a",
      title: { bn: "ধাপ ৩ক: A থেকে চাপ — AQ ও AB-কে ছেদ করে", en: "Step 3a: Arc from A — crosses AQ and AB" },
      narration: { bn: "∠QAB সমদ্বিখণ্ডন করতে, A কেন্দ্র করে একটি চাপ আঁকো যা AQ ও AB উভয়কে ছেদ করে।", en: "To bisect ∠QAB, strike an arc centred at A crossing both AQ and AB." },
      tool: "compass",
      action: "bisectAngle",
      compute: () => {
        const g = geometry();
        const { P, Q, r1 } = g.bis30;
        return { entities: [arcEnt(g.A, r1, angleOf(g.A, Q), angleOf(g.A, P), "construction")], toolAnim: toolCompass(g.A, r1, angleOf(g.A, Q), angleOf(g.A, P)) };
      },
    },
    {
      id: "s3b",
      title: { bn: "ধাপ ৩খ: সমান ব্যাসার্ধে প্রথম চাপ", en: "Step 3b: First equal-radius arc" },
      narration: { bn: "চাপ-বিন্দু দুটি থেকে সমান ব্যাসার্ধে চাপ আঁকা শুরু করো।", en: "Begin striking equal-radius arcs from those two arc-points." },
      tool: "compass",
      action: "bisectAngle",
      compute: () => {
        const g = geometry();
        const { P, r2, X } = g.bis30;
        const sw = arcSweepTo(P, X, { padding: 8 });
        return { entities: [arcEnt(P, r2, sw.startAngle, sw.endAngle, "construction")], toolAnim: toolCompass(P, r2, sw.startAngle, sw.endAngle) };
      },
    },
    {
      id: "s3c",
      title: { bn: "ধাপ ৩গ: দ্বিতীয় সমান চাপ — ৩০° কোণ AR", en: "Step 3c: Second equal arc — 30° angle AR" },
      narration: { bn: "একই ব্যাসার্ধে অন্য বিন্দু থেকে চাপ আঁকো; ছেদবিন্দু দিয়ে A থেকে রশ্মি টানলেই ৩০° কোণ ∠RAB পাওয়া যায়।", en: "Strike the same-radius arc from the other point; the ray from A through the crossing point gives the 30° angle ∠RAB." },
      tool: "compass",
      action: "bisectAngle",
      radiusLockRef: "s3b",
      compute: () => {
        const g = geometry();
        const { Q, r2, X } = g.bis30;
        const sw = arcSweepTo(Q, X, { padding: 8 });
        return {
          namedPoints: { R: g.R },
          entities: [arcEnt(Q, r2, sw.startAngle, sw.endAngle, "construction"), segEnt(g.A, g.R, "construction"), angleMarkEnt(g.A, g.B, g.R, "30°", 0.95, "given")],
          toolAnim: toolCompass(Q, r2, sw.startAngle, sw.endAngle),
        };
      },
    },
    // --- Real bisection of ∠RAB -> 15° ---
    {
      id: "s4a",
      title: { bn: "ধাপ ৪ক: A থেকে চাপ — AR ও AB-কে ছেদ করে", en: "Step 4a: Arc from A — crosses AR and AB" },
      narration: { bn: "∠RAB সমদ্বিখণ্ডন করতে, A কেন্দ্র করে একটি চাপ আঁকো।", en: "To bisect ∠RAB, strike an arc centred at A." },
      tool: "compass",
      action: "bisectAngle",
      compute: () => {
        const g = geometry();
        const { P, Q, r1 } = g.bis15;
        return { entities: [arcEnt(g.A, r1, angleOf(g.A, Q), angleOf(g.A, P), "construction")], toolAnim: toolCompass(g.A, r1, angleOf(g.A, Q), angleOf(g.A, P)) };
      },
    },
    {
      id: "s4b",
      title: { bn: "ধাপ ৪খ: সমান ব্যাসার্ধে প্রথম চাপ", en: "Step 4b: First equal-radius arc" },
      narration: { bn: "আবার চাপ-বিন্দু দুটি থেকে সমান ব্যাসার্ধে চাপ আঁকা শুরু করো।", en: "Again strike equal-radius arcs from those two arc-points." },
      tool: "compass",
      action: "bisectAngle",
      compute: () => {
        const g = geometry();
        const { P, r2, X } = g.bis15;
        const sw = arcSweepTo(P, X, { padding: 8 });
        return { entities: [arcEnt(P, r2, sw.startAngle, sw.endAngle, "construction")], toolAnim: toolCompass(P, r2, sw.startAngle, sw.endAngle) };
      },
    },
    {
      id: "s4c",
      title: { bn: "ধাপ ৪গ: দ্বিতীয় সমান চাপ — ১৫° কোণ AS", en: "Step 4c: Second equal arc — 15° angle AS" },
      narration: { bn: "একই ব্যাসার্ধে অন্য বিন্দু থেকে চাপ আঁকো; ছেদবিন্দু দিয়ে ১৫° কোণ ∠SAB পাওয়া যায়।", en: "Strike the same-radius arc from the other point; this gives the 15° angle ∠SAB." },
      tool: "compass",
      action: "bisectAngle",
      radiusLockRef: "s4b",
      caution: {
        bn: "🔒 এই পুরো অঙ্কনে কম্পাস সবচেয়ে বেশিবার পুনরায় ব্যবহৃত হয়েছে — প্রতিটি সমদ্বিখণ্ডনে দুই বাহুতেই ব্যাসার্ধ অভিন্ন রাখা আবশ্যক।",
        en: "🔒 The compass gets reused the most in this whole construction — every bisection needs the identical radius on both arms.",
      },
      compute: () => {
        const g = geometry();
        const { Q, r2, X } = g.bis15;
        const sw = arcSweepTo(Q, X, { padding: 8 });
        return {
          namedPoints: { S: g.S },
          entities: [arcEnt(Q, r2, sw.startAngle, sw.endAngle, "construction"), segEnt(g.A, g.S, "construction"), angleMarkEnt(g.A, g.B, g.S, "15°", 1.15, "given")],
          toolAnim: toolCompass(Q, r2, sw.startAngle, sw.endAngle),
        };
      },
    },
    // --- Real perpendicular at A (on line AB) -> 90° ---
    {
      id: "s5a",
      title: { bn: "ধাপ ৫ক: A থেকে চাপ — AB-এর দুই পাশে M, N", en: "Step 5a: Arc from A — M, N on both sides of AB" },
      narration: { bn: "A কেন্দ্র করে একটি চাপ আঁকো, যা AB রেখাকে দুই পাশে সমান দূরত্বে ছেদ করে।", en: "Centred at A, strike an arc crossing line AB at equal distances on both sides." },
      tool: "compass",
      action: "dropPerpendicular",
      compute: () => {
        const g = geometry();
        const { r, alongDirDeg } = g.perp90;
        return { entities: [arcEnt(g.A, r, alongDirDeg, alongDirDeg + 180, "construction")], toolAnim: toolCompass(g.A, r, alongDirDeg, alongDirDeg + 180) };
      },
    },
    {
      id: "s5b",
      title: { bn: "ধাপ ৫খ: M ও N থেকে সমান ব্যাসার্ধে দুটি চাপ", en: "Step 5b: Equal-radius arcs from M and N" },
      narration: { bn: "M ও N থেকে সমান, বড় ব্যাসার্ধে দুটি চাপ আঁকো — তারা ওপরে মিলিত হয়।", en: "From M and N, strike two equal, larger-radius arcs — they meet above." },
      tool: "compass",
      action: "dropPerpendicular",
      compute: () => {
        const g = geometry();
        const { M, r2, X } = g.perp90;
        const sw = arcSweepTo(M, X, { padding: 8 });
        return { entities: [arcEnt(M, r2, sw.startAngle, sw.endAngle, "construction")], toolAnim: toolCompass(M, r2, sw.startAngle, sw.endAngle) };
      },
    },
    {
      id: "s5c",
      title: { bn: "ধাপ ৫গ: দ্বিতীয় সমান চাপ — লম্ব AC, ৯০° কোণ", en: "Step 5c: Second equal arc — perpendicular AC, 90°" },
      narration: { bn: "একই ব্যাসার্ধে N থেকেও চাপ আঁকো; ছেদবিন্দু দিয়ে A থেকে রশ্মি AC আঁকলে তা AB-এর ওপর ঠিক লম্ব হয়, ∠CAB = ৯০°।", en: "Strike the same-radius arc from N too; ray AC through the crossing point is exactly perpendicular to AB, so ∠CAB = 90°." },
      tool: "compass",
      action: "dropPerpendicular",
      radiusLockRef: "s5b",
      compute: () => {
        const g = geometry();
        const { N, r2, X } = g.perp90;
        const sw = arcSweepTo(N, X, { padding: 8 });
        return {
          namedPoints: { C: g.C },
          entities: [arcEnt(N, r2, sw.startAngle, sw.endAngle, "construction"), segEnt(g.A, g.C, "construction"), angleMarkEnt(g.A, g.B, g.C, "90°", 1.35, "given")],
          toolAnim: toolCompass(N, r2, sw.startAngle, sw.endAngle),
        };
      },
    },
    // --- Transfer 15° beyond AC -> 105° ---
    {
      id: "s6a",
      title: { bn: "ধাপ ৬ক: A থেকে বড় চাপ — B, S, C বরাবর", en: "Step 6a: A wide arc from A — through B, S, C" },
      narration: { bn: "A কেন্দ্র করে একটি চাপ আঁকো যা AB, AS ও AC — তিনটি রশ্মিকেই ছেদ করে।", en: "Centred at A, strike an arc that crosses all three rays AB, AS, and AC." },
      tool: "compass",
      action: "drawAngle",
      compute: () => {
        const g = geometry();
        const { r1 } = g.transfer;
        return { entities: [arcEnt(g.A, r1, -5, 95, "construction")], toolAnim: toolCompass(g.A, r1, -5, 95) };
      },
    },
    {
      id: "s6b",
      title: { bn: "ধাপ ৬খ: একই ব্যাসার্ধে চাপটি ১০৫° পর্যন্ত বাড়াও", en: "Step 6b: Extend the same arc out to 105°" },
      narration: { bn: "কম্পাসের ব্যাসার্ধ না পাল্টিয়ে, চাপটিকে AC-এর ওপারে আরও একটু বাড়িয়ে নাও।", en: "Without changing the compass, extend that same arc a little further past AC." },
      tool: "compass",
      action: "drawAngle",
      radiusLockRef: "s6a",
      compute: () => {
        const g = geometry();
        const { r1 } = g.transfer;
        return { entities: [arcEnt(g.A, r1, 90, 112, "construction")], toolAnim: toolCompass(g.A, r1, 90, 112) };
      },
    },
    {
      id: "s6c",
      title: { bn: "ধাপ ৬গ: ১৫°-এর চাপ-দূরত্ব বসিয়ে D বিন্দু — ∠DAB = ১০৫°", en: "Step 6c: Transfer the 15° chord to get D — ∠DAB = 105°" },
      narration: {
        bn: "∠SAB-এর দুই চাপ-বিন্দুর দূরত্ব কম্পাসে নিয়ে, AC রশ্মির ওপরের চাপ-বিন্দু থেকে বসাও; তাতে পাওয়া বিন্দুই D, এবং ∠DAB = ৯০°+১৫° = ১০৫°।",
        en: "Take the chord-distance from ∠SAB's two arc-points, strike it from the arc-point on AC; the point you land on is D, and ∠DAB = 90°+15° = 105°.",
      },
      tool: "compass",
      action: "drawAngle",
      caution: {
        bn: "🔒 এই ১৫° অবশ্যই ধাপ ৪-এর প্রকৃত চাপ-দূরত্ব থেকেই বসাতে হবে, আন্দাজে বসানো যাবে না।",
        en: "🔒 This 15° must be transferred using the exact chord-distance from step 4 — never estimated by eye.",
      },
      compute: () => {
        const g = geometry();
        const { r2, Pt, Qt } = g.transfer;
        const sw = arcSweepTo(Pt, Qt, { padding: 8 });
        return {
          namedPoints: { D: g.D },
          entities: [arcEnt(Pt, r2, sw.startAngle, sw.endAngle, "construction"), segEnt(g.A, g.D, "final"), angleMarkEnt(g.A, g.B, g.D, "105°", 1.6, "final")],
          toolAnim: toolCompass(Pt, r2, sw.startAngle, sw.endAngle, "১৫° (ধাপ ৪ থেকে)"),
        };
      },
    },
  ],
});

export default meta;
