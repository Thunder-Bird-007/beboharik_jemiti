// Quiz bank for the lecture's MCQ / short-answer recap. Figure-based items
// carry a small inline SVG built from clearly-labelled values so every
// number used in the question is visible directly in the figure.
import type { ReactNode } from "react";

export interface QuizOption {
  bn: string;
  en: string;
  correct?: boolean;
}

export interface QuizItem {
  id: string;
  prompt: { bn: string; en: string };
  figure?: ReactNode;
  options: QuizOption[];
  explanation: { bn: string; en: string };
}

function ParallelogramAngleFigure() {
  return (
    <svg viewBox="0 0 240 140" width="100%" height="140" style={{ maxWidth: 320 }}>
      <polygon points="20,120 90,20 220,20 150,120" fill="none" stroke="var(--ink-soft)" strokeWidth={2} />
      <path d="M40,120 A22,22 0 0 1 34,101" fill="none" stroke="var(--accent)" strokeWidth={2} />
      <text x={48} y={112} fontSize={12} fill="var(--accent)">
        (3x+8)°
      </text>
      <path d="M130,120 A22,22 0 0 0 138,100" fill="none" stroke="var(--derived)" strokeWidth={2} />
      <text x={140} y={112} fontSize={12} fill="var(--derived)">
        (2x+7)°
      </text>
      <text x={10} y={132} fontSize={12} fill="var(--ink)">
        A
      </text>
      <text x={82} y={16} fontSize={12} fill="var(--ink)">
        D
      </text>
      <text x={222} y={16} fontSize={12} fill="var(--ink)">
        C
      </text>
      <text x={152} y={132} fontSize={12} fill="var(--ink)">
        B
      </text>
    </svg>
  );
}

function RhombusAngleFigure() {
  return (
    <svg viewBox="0 0 220 160" width="100%" height="150" style={{ maxWidth: 300 }}>
      <polygon points="110,10 200,70 110,150 20,70" fill="none" stroke="var(--ink-soft)" strokeWidth={2} />
      <line x1={110} y1={10} x2={110} y2={150} stroke="var(--accent)" strokeWidth={1.6} strokeDasharray="4 3" />
      <path d="M110,30 A20,20 0 0 0 96,42" fill="none" stroke="var(--accent)" strokeWidth={2} />
      <text x={78} y={40} fontSize={12} fill="var(--accent)">
        35°
      </text>
      <text x={100} y={8} fontSize={12} fill="var(--ink)">
        A
      </text>
      <text x={204} y={74} fontSize={12} fill="var(--ink)">
        B
      </text>
      <text x={100} y={162} fontSize={12} fill="var(--ink)">
        C
      </text>
      <text x={2} y={74} fontSize={12} fill="var(--ink)">
        D
      </text>
    </svg>
  );
}

function CircleSquareFigure() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="180" style={{ maxWidth: 260 }}>
      <rect x={20} y={20} width={160} height={160} fill="none" stroke="var(--ink-soft)" strokeWidth={2} />
      <circle cx={100} cy={100} r={80} fill="none" stroke="var(--ink-soft)" strokeWidth={1.6} />
      <circle cx={100} cy={20} r={2.5} fill="var(--accent)" />
      <circle cx={180} cy={100} r={2.5} fill="var(--accent)" />
      <circle cx={100} cy={180} r={2.5} fill="var(--accent)" />
      <line x1={100} y1={20} x2={180} y2={100} stroke="var(--accent)" strokeWidth={1.6} />
      <line x1={180} y1={100} x2={100} y2={180} stroke="var(--accent)" strokeWidth={1.6} />
      <text x={104} y={16} fontSize={12} fill="var(--ink)">
        G
      </text>
      <text x={184} y={104} fontSize={12} fill="var(--ink)">
        H
      </text>
      <text x={104} y={196} fontSize={12} fill="var(--ink)">
        K
      </text>
    </svg>
  );
}

export const QUIZ: QuizItem[] = [
  {
    id: "q1",
    prompt: { bn: "একটি আয়ত আঁকতে কমপক্ষে কতটি স্বতন্ত্র উপাত্তের প্রয়োজন?", en: "How many independent data points are needed to draw a rectangle?" },
    options: [
      { bn: "১টি", en: "1" },
      { bn: "২টি", en: "2", correct: true },
      { bn: "৩টি", en: "3" },
      { bn: "৪টি", en: "4" },
    ],
    explanation: {
      bn: "আয়তের সব কোণ সমকোণ বলে আগে থেকেই জানা — তাই মাত্র দুইটি সন্নিহিত বাহুর দৈর্ঘ্য জানলেই আয়ত আঁকা যায়।",
      en: "A rectangle's angles are all already known to be 90°, so knowing just the two adjacent side lengths is enough to draw it.",
    },
  },
  {
    id: "q2",
    prompt: { bn: "একটি রম্বস অঙ্কনের জন্য নিচের কোন উপাত্তটি যথেষ্ট ও সঠিক?", en: "Which of the following data is sufficient and correct for constructing a rhombus?" },
    options: [
      { bn: "একটি বাহুর দৈর্ঘ্য", en: "Length of one side" },
      { bn: "দুইটি কর্ণের দৈর্ঘ্য", en: "Lengths of the two diagonals", correct: true },
      { bn: "একটি কোণের পরিমাপ", en: "Measure of one angle" },
      { bn: "পরিসীমা", en: "Perimeter" },
    ],
    explanation: {
      bn: "রম্বসের কর্ণদ্বয় পরস্পরকে সমকোণে সমদ্বিখণ্ডিত করে — শুধু দুই কর্ণের দৈর্ঘ্য জানলেই সম্পূর্ণ রম্বসটি নির্দিষ্ট হয়ে যায় (দেখো অঙ্কন #৯)।",
      en: "A rhombus's diagonals bisect each other at right angles — knowing both diagonal lengths alone fully fixes the shape (see worked problem #9).",
    },
  },
  {
    id: "q3",
    prompt: { bn: "একটি নির্দিষ্ট চতুর্ভুজ অঙ্কনের জন্য কয়টি স্বতন্ত্র উপাত্ত প্রয়োজন?", en: "How many independent data points are needed to draw a specific quadrilateral?" },
    options: [
      { bn: "৩টি", en: "3" },
      { bn: "৪টি", en: "4" },
      { bn: "৫টি", en: "5", correct: true },
      { bn: "৬টি", en: "6" },
    ],
    explanation: {
      bn: "সাধারণ একটি চতুর্ভুজের আকৃতি নির্দিষ্ট করতে পাঁচটি স্বতন্ত্র উপাত্ত (যেমন চার বাহু ও এক কর্ণ) প্রয়োজন হয়।",
      en: "Fixing a general quadrilateral's shape requires five independent data points (e.g. four sides + one diagonal).",
    },
  },
  {
    id: "q4",
    prompt: {
      bn: "নির্দিষ্ট একটি সামান্তরিক আঁকা সম্ভব যদি দেওয়া থাকে—\ni. দুইটি কর্ণ ও তাদের অন্তর্ভুক্ত কোণ\nii. শুধু চারটি কোণ\niii. দুইটি সন্নিহিত বাহু ও একটি কোণ\n\nনিচের কোনটি সঠিক?",
      en: "A specific parallelogram can be drawn if given—\ni. the two diagonals and their included angle\nii. only the four angles\niii. two adjacent sides and one angle\n\nWhich is correct?",
    },
    options: [
      { bn: "i, ii", en: "i, ii" },
      { bn: "i, iii", en: "i, iii", correct: true },
      { bn: "ii, iii", en: "ii, iii" },
      { bn: "i, ii, iii", en: "i, ii, iii" },
    ],
    explanation: {
      bn: "শুধু চারটি কোণ জানলে আকৃতি (সদৃশ সামান্তরিক) ঠিক হয় কিন্তু আকার নির্দিষ্ট হয় না — তাই ii ভুল। i ও iii উভয়ই সামান্তরিককে সম্পূর্ণ নির্দিষ্ট করে (দেখো অঙ্কন #১০, #১১)।",
      en: "Knowing only the four angles fixes the shape but not the size (infinitely many similar parallelograms) — so ii fails. Both i and iii fully fix a parallelogram (see worked problems #10, #11).",
    },
  },
  {
    id: "q5",
    prompt: { bn: "একটি সামান্তরিক আঁকতে কতটি স্বতন্ত্র উপাত্তের প্রয়োজন?", en: "How many independent data points are needed to draw a parallelogram?" },
    options: [
      { bn: "২টি", en: "2" },
      { bn: "৩টি", en: "3", correct: true },
      { bn: "৪টি", en: "4" },
      { bn: "৫টি", en: "5" },
    ],
    explanation: {
      bn: "সামান্তরিকের বিপরীত বাহু ও কোণ সমান বলে সাধারণ চতুর্ভুজের চেয়ে কম, মাত্র তিনটি স্বতন্ত্র উপাত্তেই এটি নির্দিষ্ট হয়ে যায়।",
      en: "Because opposite sides/angles are automatically equal, a parallelogram needs fewer than a general quadrilateral — just three independent data points.",
    },
  },
  {
    id: "q6",
    prompt: {
      bn: "পাশের সামান্তরিক ABCD-তে দুটি সন্নিহিত কোণ (3x+8)° ও (2x+7)° এবং তারা একই সরলরেখায় সন্নিহিত (সমষ্টি ১৮০°)। x-এর মান কত?",
      en: "In parallelogram ABCD, two co-interior angles are (3x+8)° and (2x+7)°, summing to 180°. Find x.",
    },
    figure: <ParallelogramAngleFigure />,
    options: [
      { bn: "x = ২৭", en: "x = 27" },
      { bn: "x = ৩০", en: "x = 30" },
      { bn: "x = ৩৩", en: "x = 33", correct: true },
      { bn: "x = ৩৬", en: "x = 36" },
    ],
    explanation: {
      bn: "(3x+8) + (2x+7) = 180 ⇒ 5x + 15 = 180 ⇒ 5x = 165 ⇒ x = 33।",
      en: "(3x+8) + (2x+7) = 180 ⇒ 5x + 15 = 180 ⇒ 5x = 165 ⇒ x = 33.",
    },
  },
  {
    id: "q7",
    prompt: {
      bn: "একই চিত্রে (উপরের প্রশ্ন দ্রষ্টব্য), x = ৩৩ হলে ∠BCD-এর মান কত? [∠BCD = (3x+8)°]",
      en: "In the same figure (x = 33), what is ∠BCD? [∠BCD = (3x+8)°]",
    },
    options: [
      { bn: "৭৩°", en: "73°" },
      { bn: "১০৭°", en: "107°", correct: true },
      { bn: "৯৭°", en: "97°" },
      { bn: "৮৩°", en: "83°" },
    ],
    explanation: {
      bn: "∠BCD = 3(33)+8 = 99+8 = 107°।",
      en: "∠BCD = 3(33)+8 = 99+8 = 107°.",
    },
  },
  {
    id: "q8",
    prompt: { bn: "পাশের রম্বস ABCD-তে কর্ণ AC, ∠A-কে সমদ্বিখণ্ডিত করে এবং ∠DAC = ৩৫°। ∠ADC-এর মান কত?", en: "In rhombus ABCD, diagonal AC bisects ∠A and ∠DAC = 35°. Find ∠ADC." },
    figure: <RhombusAngleFigure />,
    options: [
      { bn: "৭০°", en: "70°" },
      { bn: "৯০°", en: "90°" },
      { bn: "১১০°", en: "110°", correct: true },
      { bn: "১৪৫°", en: "145°" },
    ],
    explanation: {
      bn: "কর্ণ AC কোণ A-কে সমদ্বিখণ্ডিত করে বলে ∠DAB = 2×35° = 70°। রম্বসের সন্নিহিত কোণ সম্পূরক, তাই ∠ADC = 180° − 70° = 110°।",
      en: "Since AC bisects ∠A, ∠DAB = 2×35° = 70°. Adjacent angles of a rhombus are supplementary, so ∠ADC = 180° − 70° = 110°.",
    },
  },
  {
    id: "q9",
    prompt: {
      bn: "পাশের চিত্রে একটি বর্গের অন্তর্বৃত্তে G, H, K পরপর তিনটি বাহুর স্পর্শবিন্দু। 2∠GHK-এর মান কত?",
      en: "In the figure, G, H, K are the incircle's tangent points on three consecutive sides of a square. Find 2∠GHK.",
    },
    figure: <CircleSquareFigure />,
    options: [
      { bn: "৯০°", en: "90°" },
      { bn: "১৩৫°", en: "135°" },
      { bn: "১৮০°", en: "180°", correct: true },
      { bn: "২৭০°", en: "270°" },
    ],
    explanation: {
      bn: "G, H, K কেন্দ্র থেকে পরপর ৯০° কোণে অবস্থিত, তাই বৃত্তচাপ GK (H বাদে) = ১৮০° — অর্ধবৃত্তস্থ কোণ হওয়ায় ∠GHK = ৯০°। তাই 2∠GHK = ১৮০°।",
      en: "G, H, K sit 90° apart around the centre, so arc GK (not containing H) = 180° — an angle in a semicircle, giving ∠GHK = 90°. So 2∠GHK = 180°.",
    },
  },
  {
    id: "q10",
    prompt: { bn: "নিচের কোন তিনটি দৈর্ঘ্য দিয়ে ত্রিভুজ গঠন করা সম্ভব নয়?", en: "Which of the following three lengths CANNOT form a triangle?" },
    options: [
      { bn: "৩, ৪, ৫", en: "3, 4, 5" },
      { bn: "৬, ৭, ৮", en: "6, 7, 8" },
      { bn: "৪, ৫, ৯", en: "4, 5, 9", correct: true },
      { bn: "৫, ৬, ৭", en: "5, 6, 7" },
    ],
    explanation: {
      bn: "ত্রিভুজ অসমতা অনুযায়ী যেকোনো দুই বাহুর সমষ্টি তৃতীয় বাহুর চেয়ে বড় হতে হবে। ৪+৫ = ৯, যা তৃতীয় বাহুর সমান — তাই প্রকৃত ত্রিভুজ গঠিত হয় না (এটি একটি সরলরেখায় মিশে যায়)।",
      en: "By the triangle inequality, any two sides must sum to more than the third. Here 4+5 = 9, exactly equal to the third side — so it collapses into a straight line, not a real triangle.",
    },
  },
];
