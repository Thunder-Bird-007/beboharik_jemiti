import { useState } from "react";

interface CautionLegendProps {
  lang: "bn" | "en";
}

/** Dismissible one-time explainer for the 🔒 radius-lock badge and ⚠️ caution callout. */
export function CautionLegend({ lang }: CautionLegendProps) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem("gs-legend-dismissed") === "1";
    } catch {
      return false;
    }
  });
  if (dismissed) return null;
  return (
    <div
      className="rounded-xl p-3 text-[12px] leading-relaxed relative fade-in-up"
      style={{ background: "var(--bg-elevated)", border: "1px dashed var(--panel-border)", color: "var(--ink-soft)" }}
    >
      <button
        onClick={() => {
          setDismissed(true);
          try {
            localStorage.setItem("gs-legend-dismissed", "1");
          } catch {
            /* ignore */
          }
        }}
        className="absolute top-2 right-2.5 text-[13px]"
        style={{ color: "var(--muted)" }}
        aria-label="dismiss"
      >
        ✕
      </button>
      <p className="mb-1">
        <span
          className="inline-block text-[10.5px] px-1.5 py-0.5 rounded-full font-medium mr-1"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          🔒 {lang === "bn" ? "অপরিবর্তিত" : "unchanged"}
        </span>
        {lang === "bn"
          ? "মানে কম্পাসের ব্যাসার্ধ আগের ধাপ থেকেই ধরে রাখা হয়েছে, নতুন করে মাপা হয়নি।"
          : "means the compass keeps the radius set in an earlier step — it wasn't re-measured."}
      </p>
      <p>
        <span style={{ color: "var(--danger)" }}>⚠️</span>{" "}
        {lang === "bn"
          ? "চিহ্নিত বাক্স শিক্ষার্থীদের সাধারণ ভুলের জায়গাগুলো নির্দেশ করে — মনোযোগ দিয়ে পড়ো।"
          : "callouts flag classic student mistake points — read them carefully."}
      </p>
    </div>
  );
}
