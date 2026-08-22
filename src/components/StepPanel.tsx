import { useEffect, useRef } from "react";
import type { ConstructionMeta } from "@/constructions/types";
import type { PlayerApi } from "@/state/useConstructionPlayer";

interface StepPanelProps {
  meta: ConstructionMeta;
  player: PlayerApi;
  lang: "bn" | "en";
}

export function StepPanel({ meta, player, lang }: StepPanelProps) {
  const activeIndex = Math.min(player.currentStep + 1, meta.steps.length - 1);
  const itemRefs = useRef<Record<number, HTMLLIElement | null>>({});

  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  const stepIndexById = buildStepIndex(meta);

  return (
    <ol className="flex flex-col gap-1.5 overflow-y-auto scrollbar-thin pr-1" style={{ maxHeight: "100%" }}>
      {meta.steps.map((step, i) => {
        const isDone = i <= player.currentStep;
        const isActive = i === activeIndex;
        const lockedStepIdx = step.radiusLockRef ? stepIndexById[step.radiusLockRef] : undefined;
        return (
          <li
            key={step.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
          >
            <button
              onClick={() => player.jumpTo(i)}
              className="w-full text-left rounded-lg px-3 py-2.5 transition-colors border"
              style={{
                background: isActive ? "var(--accent-soft)" : "transparent",
                borderColor: isActive ? "var(--accent)" : "transparent",
              }}
            >
              <div className="flex items-start gap-2">
                <span
                  className="mt-0.5 shrink-0 w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-semibold"
                  style={{
                    background: isDone ? "var(--success)" : isActive ? "var(--accent)" : "var(--panel-border)",
                    color: isDone || isActive ? "#fff" : "var(--muted)",
                  }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[13.5px] font-semibold" style={{ color: "var(--ink)" }}>
                      {lang === "bn" ? step.title.bn : step.title.en}
                    </span>
                    {lockedStepIdx !== undefined && (
                      <span
                        title={lang === "bn" ? `ধাপ ${lockedStepIdx + 1} থেকে ব্যাসার্ধ অপরিবর্তিত` : `radius reused from step ${lockedStepIdx + 1}`}
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                      >
                        🔒 {lang === "bn" ? "অপরিবর্তিত" : "unchanged"}
                      </span>
                    )}
                  </div>
                  <p className="text-[12.5px] mt-0.5 leading-snug" style={{ color: "var(--ink-soft)" }}>
                    {lang === "bn" ? step.narration.bn : step.narration.en}
                  </p>
                  {isActive && step.caution && (
                    <div
                      className="mt-1.5 text-[12px] rounded-md px-2 py-1.5 leading-snug flex gap-1.5"
                      style={{ background: "rgba(179,38,30,0.08)", color: "var(--danger)", border: "1px solid rgba(179,38,30,0.25)" }}
                    >
                      <span>⚠️</span>
                      <span>{lang === "bn" ? step.caution.bn : step.caution.en}</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function buildStepIndex(meta: ConstructionMeta): Record<string, number> {
  const map: Record<string, number> = {};
  meta.steps.forEach((s, i) => {
    map[s.id] = i;
  });
  return map;
}
