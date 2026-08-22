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
  {
    icon: "quad-4s-diag",
    bn: "চারটি বাহু ও একটি কর্ণ",
    en: "Four sides + one diagonal",
    linkTo: "/c/quad-9",
    linkLabel: { bn: "৯নং অঙ্কন দেখো (দুই কর্ণ)", en: "See worked problem #9 (two diagonals)" },
  },
  {
    icon: "quad-4s-angle",
    bn: "চারটি বাহু ও একটি কোণ",
    en: "Four sides + one angle",
    linkTo: "/c/quad-12",
    linkLabel: { bn: "১২নং অঙ্কন দেখো", en: "See worked problem #12" },
  },
  { icon: "quad-3s-2angle", bn: "তিনটি বাহু ও দুইটি অন্তর্ভুক্ত কোণ", en: "Three sides + two included angles" },
  {
    icon: "quad-3s-2diag",
    bn: "তিনটি বাহু ও দুইটি কর্ণ",
    en: "Three sides + two diagonals",
    linkTo: "/c/quad-11",
    linkLabel: { bn: "১১নং অঙ্কন দেখো", en: "See worked problem #11" },
  },
  {
    icon: "quad-2s-3angle",
    bn: "দুইটি বাহু ও তিনটি কোণ",
    en: "Two sides + three angles",
    linkTo: "/c/quad-8",
    linkLabel: { bn: "৮নং অঙ্কন দেখো (বর্গ)", en: "See worked problem #8 (square)" },
  },
];

export default function QuadTheory() {
  const lang = useAppStore((s) => s.lang);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-bold" style={{ color: "var(--ink)" }}>
          {lang === "bn" ? "T-02 তত্ত্ব: চতুর্ভুজ অঙ্কনের শর্ত" : "T-02 Theory: when a quadrilateral can be drawn"}
        </h1>
        <p className="text-[13.5px] mt-1 max-w-3xl leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          {lang === "bn"
            ? "একটি নির্দিষ্ট চতুর্ভুজ আঁকতে পাঁচটি স্বতন্ত্র উপাত্ত প্রয়োজন। নিচের পাঁচটি সাধারণ সমন্বয় সবচেয়ে বেশি ব্যবহৃত হয়:"
            : "Drawing a specific quadrilateral needs five independent pieces of data. The five common combinations:"}
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
