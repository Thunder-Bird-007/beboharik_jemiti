import type { CSSProperties } from "react";
import type { PlayerApi } from "@/state/useConstructionPlayer";

interface PlaybackControlsProps {
  player: PlayerApi;
  lang: "bn" | "en";
}

const btnStyle: CSSProperties = {
  background: "var(--bg-elevated)",
  border: "1px solid var(--panel-border)",
  color: "var(--ink)",
};

export function PlaybackControls({ player, lang }: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={player.restart}
        title={lang === "bn" ? "শুরু থেকে (R)" : "Restart (R)"}
        className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80"
        style={btnStyle}
      >
        ⟲
      </button>
      <button
        onClick={player.prev}
        disabled={player.currentStep < 0}
        title={lang === "bn" ? "আগের ধাপ (←)" : "Previous (←)"}
        className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 disabled:opacity-30"
        style={btnStyle}
      >
        ◀
      </button>
      <button
        onClick={player.toggle}
        title={lang === "bn" ? "প্লে/পজ (Space)" : "Play/Pause (Space)"}
        className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-semibold hover:opacity-90"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        {player.playing ? "❚❚" : "▶"}
      </button>
      <button
        onClick={player.next}
        disabled={player.currentStep >= player.totalSteps - 1}
        title={lang === "bn" ? "পরের ধাপ (→)" : "Next (→)"}
        className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 disabled:opacity-30"
        style={btnStyle}
      >
        ▶|
      </button>
      <button
        onClick={player.jumpToEnd}
        title={lang === "bn" ? "সম্পূর্ণ চিত্র" : "Final figure"}
        className="px-3 h-9 rounded-full text-[12.5px] font-medium hover:opacity-80"
        style={btnStyle}
      >
        {lang === "bn" ? "চূড়ান্ত চিত্র ⏭" : "Final figure ⏭"}
      </button>

      <div className="flex items-center gap-2 ml-1">
        <span className="text-[12px]" style={{ color: "var(--muted)" }}>
          {lang === "bn" ? "গতি" : "Speed"}
        </span>
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.25}
          value={player.speed}
          onChange={(e) => player.setSpeed(Number(e.target.value))}
          className="w-24 accent-current"
          style={{ color: "var(--accent)" }}
        />
        <span className="text-[12px] font-mono-num" style={{ color: "var(--ink-soft)" }}>
          {player.speed.toFixed(2)}×
        </span>
      </div>

      <span className="text-[12px] ml-auto font-mono-num" style={{ color: "var(--muted)" }}>
        {Math.min(player.currentStep + 1, player.totalSteps)} / {player.totalSteps}
      </span>
    </div>
  );
}
