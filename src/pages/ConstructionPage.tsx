import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { resolveText, type ConstructionMeta } from "@/constructions/types";
import { getConstruction, pathFor } from "@/constructions/registry";
import { Canvas } from "@/components/Canvas";
import { CautionLegend } from "@/components/CautionLegend";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GivenDataPanel } from "@/components/GivenDataPanel";
import { InputsPanel } from "@/components/InputsPanel";
import { PlaybackControls } from "@/components/PlaybackControls";
import { StepPanel } from "@/components/StepPanel";
import { useAppStore } from "@/state/appStore";
import { useConstructionPlayer } from "@/state/useConstructionPlayer";

function defaultInputs(meta: ConstructionMeta): Record<string, number> {
  const o: Record<string, number> = {};
  for (const spec of meta.inputs) o[spec.key] = spec.defaultValue;
  return o;
}

export function ConstructionPage({ meta }: { meta: ConstructionMeta }) {
  const lang = useAppStore((s) => s.lang);
  const presentation = useAppStore((s) => s.presentation);
  const setPresentation = useAppStore((s) => s.setPresentation);
  const toolsVisible = useAppStore((s) => s.toolsVisible);
  const toggleTools = useAppStore((s) => s.toggleTools);
  const verifyMode = useAppStore((s) => s.verifyMode);
  const toggleVerify = useAppStore((s) => s.toggleVerify);

  const [inputs, setInputs] = useState<Record<string, number>>(() => defaultInputs(meta));
  useEffect(() => setInputs(defaultInputs(meta)), [meta]);

  const player = useConstructionPlayer(meta);
  const error = useMemo(() => meta.validate?.(inputs) ?? null, [meta, inputs]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        player.toggle();
      } else if (e.code === "ArrowRight") {
        player.next();
      } else if (e.code === "ArrowLeft") {
        player.prev();
      } else if (e.code === "KeyR") {
        player.restart();
      } else if (e.code === "KeyF") {
        setPresentation(!presentation);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [player, presentation, setPresentation]);

  const derivedFromMeta = meta.derivedFrom ? getConstruction(meta.derivedFrom) : undefined;
  const activeStepRaw = player.currentStep + 1 < meta.steps.length ? meta.steps[player.currentStep + 1] : meta.steps[meta.steps.length - 1];
  const activeStep = resolveText(activeStepRaw.narration, inputs);

  const canvasEl = (
    <ErrorBoundary fallbackTitle={lang === "bn" ? "এই মানগুলোতে চিত্র আঁকা যাচ্ছে না" : "Cannot draw with these values"}>
      <Canvas meta={meta} inputs={inputs} player={player} lang={lang} showTools={toolsVisible} verifyMode={verifyMode} />
    </ErrorBoundary>
  );

  if (presentation) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col" style={{ background: "var(--bg-elevated)" }}>
        <div className="flex-1 min-h-0">{canvasEl}</div>
        <div className="px-6 py-4" style={{ background: "var(--bg)", borderTop: "1px solid var(--panel-border)" }}>
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--ink)" }}>
            {lang === "bn" ? activeStep.bn : activeStep.en}
          </p>
          <div className="mt-2">
            <PlaybackControls player={player} lang={lang} />
          </div>
        </div>
        <button
          onClick={() => setPresentation(false)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)", color: "var(--ink)" }}
          title={lang === "bn" ? "উপস্থাপনা মোড বন্ধ করুন (F)" : "Exit presentation (F)"}
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-lg font-bold" style={{ color: "var(--ink)" }}>
            {lang === "bn" ? meta.title.bn : meta.title.en}
          </h1>
          {derivedFromMeta && (
            <Link to={pathFor(derivedFromMeta.id)} className="text-[12px] inline-flex items-center gap-1 mt-1 hover:underline" style={{ color: "var(--accent)" }}>
              🔗 {lang === "bn" ? `পূর্বের ত্রিভুজ থেকে: ${derivedFromMeta.title.bn}` : `From earlier triangle: ${derivedFromMeta.title.en}`}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1.5 text-[12.5px] px-2.5 h-8 rounded-full" style={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)", color: "var(--ink)" }}>
            <input type="checkbox" checked={toolsVisible} onChange={toggleTools} />
            {lang === "bn" ? "যন্ত্র দেখাও" : "Show tools"}
          </label>
          <label className="flex items-center gap-1.5 text-[12.5px] px-2.5 h-8 rounded-full" style={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)", color: "var(--ink)" }}>
            <input type="checkbox" checked={verifyMode} onChange={toggleVerify} />
            {lang === "bn" ? "যাচাই মোড" : "Verify mode"}
          </label>
          <button
            onClick={() => setPresentation(true)}
            className="text-[12.5px] px-3 h-8 rounded-full hover:opacity-80"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)", color: "var(--ink)" }}
            title={lang === "bn" ? "উপস্থাপনা মোড (F)" : "Presentation mode (F)"}
          >
            ⛶ {lang === "bn" ? "উপস্থাপনা" : "Present"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <div
            className="flex-1 min-h-[360px] rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--panel-border)" }}
          >
            {canvasEl}
          </div>
          <PlaybackControls player={player} lang={lang} />
        </div>

        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto scrollbar-thin pr-0.5">
          <GivenDataPanel meta={meta} inputs={inputs} lang={lang} />
          <InputsPanel
            meta={meta}
            inputs={inputs}
            onChange={(key, value) => setInputs((prev) => ({ ...prev, [key]: value }))}
            onReset={() => {
              setInputs(defaultInputs(meta));
              player.restart();
            }}
            lang={lang}
            error={error ? (lang === "bn" ? error.bn : error.en) : null}
          />
          <CautionLegend lang={lang} />
          <div className="rounded-xl p-3.5 flex-1 min-h-[200px]" style={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)" }}>
            <h3 className="text-[13px] font-semibold mb-2" style={{ color: "var(--ink)" }}>
              {lang === "bn" ? "অঙ্কনের ধাপসমূহ" : "Construction steps"}
            </h3>
            <StepPanel meta={meta} inputs={inputs} player={player} lang={lang} />
          </div>
        </div>
      </div>
    </div>
  );
}
