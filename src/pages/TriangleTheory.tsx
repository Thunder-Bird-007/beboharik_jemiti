import { Link } from "react-router-dom";
import { TheoryIcon, type IconKind } from "@/components/TheoryIcon";
import { useAppStore } from "@/state/appStore";

interface Case {
  icon: IconKind;
  bn: string;
  en: string;
  linkTo?: string;
  linkLabel?: { bn: string; en: string };
}

const CASES: Case[] = [
  { icon: "sss", bn: "তিনটি বাহু (SSS)", en: "Three sides (SSS)" },
  { icon: "sas", bn: "দুইটি বাহু ও অন্তর্ভুক্ত কোণ (SAS)", en: "Two sides + included angle (SAS)" },
  { icon: "asa", bn: "দুইটি কোণ ও অন্তর্ভুক্ত বাহু (ASA)", en: "Two angles + included side (ASA)" },
  { icon: "aas", bn: "দুইটি কোণ ও একটি বিপরীত বাহু (AAS)", en: "Two angles + opposite side (AAS)" },
  { icon: "ssa", bn: "দুইটি বাহু ও একটি বিপরীত কোণ", en: "Two sides + an opposite angle" },
  {
    icon: "rhs",
    bn: "সমকোণী ত্রিভুজের অতিভুজ ও একটি বাহু",
    en: "Hypotenuse + one side of a right triangle",
    linkTo: "/c/tri-7",
    linkLabel: { bn: "৭নং অঙ্কন দেখো", en: "See worked problem #7" },
  },
  {
    icon: "angles-perimeter",
    bn: "দুইটি কোণ ও পরিসীমা",
    en: "Two angles + perimeter",
    linkTo: "/c/tri-1",
    linkLabel: { bn: "১নং অঙ্কন দেখো", en: "See worked problem #1" },
  },
];

export default function TriangleTheory() {
  const lang = useAppStore((s) => s.lang);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-bold" style={{ color: "var(--ink)" }}>
          {lang === "bn" ? "T-01 তত্ত্ব: ত্রিভুজ অঙ্কনের শর্ত" : "T-01 Theory: when a triangle can be drawn"}
        </h1>
        <p className="text-[13.5px] mt-1 max-w-3xl leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          {lang === "bn"
            ? "একটি ত্রিভুজের যেকোনো তিনটি স্বতন্ত্র উপাত্ত (বাহু/কোণ/পরিসীমা) জানা থাকলে ত্রিভুজটি নির্দিষ্টভাবে আঁকা সম্ভব। নিচের সাতটি ক্ষেত্র সবচেয়ে বেশি ব্যবহৃত হয়:"
            : "A triangle can be drawn uniquely once any three independent pieces of data (sides/angles/perimeter) are known. The seven most common cases:"}
        </p>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
        {CASES.map((c, i) => {
          const card = (
            <div
              className="rounded-xl p-3.5 h-full flex gap-3 items-start transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)" }}
            >
              <TheoryIcon kind={c.icon} />
              <div className="min-w-0">
                <p className="text-[11px] font-mono-num" style={{ color: "var(--muted)" }}>
                  {lang === "bn" ? `ক্ষেত্র ${i + 1}` : `Case ${i + 1}`}
                </p>
                <p className="text-[13.5px] font-semibold leading-snug" style={{ color: "var(--ink)" }}>
                  {lang === "bn" ? c.bn : c.en}
                </p>
                {c.linkTo && (
                  <p className="text-[12px] mt-1 font-medium" style={{ color: "var(--accent)" }}>
                    {lang === "bn" ? c.linkLabel?.bn : c.linkLabel?.en} →
                  </p>
                )}
              </div>
            </div>
          );
          return c.linkTo ? (
            <Link key={i} to={c.linkTo}>
              {card}
            </Link>
          ) : (
            <div key={i}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
