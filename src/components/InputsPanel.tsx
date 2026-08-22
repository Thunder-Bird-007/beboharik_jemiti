import type { ConstructionMeta } from "@/constructions/types";
import { fmtCm, fmtDeg } from "@/lib/format";

interface InputsPanelProps {
  meta: ConstructionMeta;
  inputs: Record<string, number>;
  onChange: (key: string, value: number) => void;
  onReset: () => void;
  lang: "bn" | "en";
  error: string | null;
}

export function InputsPanel({ meta, inputs, onChange, onReset, lang, error }: InputsPanelProps) {
  return (
    <div className="rounded-xl p-3.5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)" }}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
          {lang === "bn" ? "উপাত্ত পরিবর্তন করুন" : "Edit given data"}
        </h3>
        <button
          onClick={onReset}
          className="text-[11.5px] px-2 py-1 rounded-md hover:opacity-80"
          style={{ color: "var(--accent)", background: "var(--accent-soft)" }}
        >
          {lang === "bn" ? "পুনরায় আঁকো" : "Redraw / reset"}
        </button>
      </div>
      {meta.inputs.length === 0 && (
        <p className="text-[12px]" style={{ color: "var(--muted)" }}>
          {lang === "bn" ? "এই অঙ্কনে কোনো পরিবর্তনযোগ্য মান নেই — কৌশলটি একটি নির্দিষ্ট মানের জন্য।" : "No editable values here — this technique is tied to a fixed value."}
        </p>
      )}
      <div className="flex flex-col gap-3">
        {meta.inputs.map((spec) => {
          const v = inputs[spec.key];
          const fmt = spec.unit === "cm" ? fmtCm : fmtDeg;
          return (
            <label key={spec.key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[12.5px]">
                <span style={{ color: "var(--ink-soft)" }}>{lang === "bn" ? spec.label.bn : spec.label.en}</span>
                <span className="font-mono-num font-semibold" style={{ color: "var(--accent)" }}>
                  {fmt(v, lang)}
                </span>
              </div>
              <input
                type="range"
                min={spec.min}
                max={spec.max}
                step={spec.step}
                value={v}
                onChange={(e) => onChange(spec.key, Number(e.target.value))}
                style={{ accentColor: "var(--accent)" }}
              />
            </label>
          );
        })}
      </div>
      {error && (
        <div
          className="mt-3 text-[12px] rounded-md px-2.5 py-2 leading-snug"
          style={{ background: "rgba(179,38,30,0.08)", color: "var(--danger)", border: "1px solid rgba(179,38,30,0.25)" }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
