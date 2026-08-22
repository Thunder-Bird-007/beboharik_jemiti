import { useAppStore } from "@/state/appStore";
import type { ConstructionMeta } from "@/constructions/types";

interface GivenDataPanelProps {
  meta: ConstructionMeta;
  inputs: Record<string, number>;
  lang: "bn" | "en";
}

export function GivenDataPanel({ meta, inputs, lang }: GivenDataPanelProps) {
  const summary = meta.givenSummary(inputs);
  const showBoardTags = useAppStore((s) => s.showBoardTags);
  const toggleBoardTags = useAppStore((s) => s.toggleBoardTags);
  return (
    <div className="rounded-xl p-3.5" style={{ background: "var(--accent-soft)", border: "1px solid var(--panel-border)" }}>
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold" style={{ color: "var(--accent)" }}>
          {lang === "bn" ? "প্রদত্ত উপাত্ত" : "Given data"}
        </h3>
        {meta.boardTags && (
          <button onClick={toggleBoardTags} className="text-[10.5px] hover:underline" style={{ color: "var(--muted)" }}>
            {showBoardTags ? (lang === "bn" ? "ট্যাগ লুকাও" : "hide tags") : (lang === "bn" ? "ট্যাগ দেখাও" : "show tags")}
          </button>
        )}
      </div>
      <p className="text-[13px] mt-1.5 leading-relaxed" style={{ color: "var(--ink)" }}>
        {lang === "bn" ? summary.bn : summary.en}
      </p>
      {showBoardTags && meta.boardTags && (
        <p className="text-[10.5px] mt-1.5" style={{ color: "var(--muted)" }}>
          {meta.boardTags}
        </p>
      )}
    </div>
  );
}
