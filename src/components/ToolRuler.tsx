interface Px {
  x: number;
  y: number;
}

interface ToolRulerProps {
  fromPx: Px;
  toPx: Px;
  scalePxPerCm: number;
  t: number;
}

export function ToolRuler({ fromPx, toPx, scalePxPerCm, t }: ToolRulerProps) {
  const dx = toPx.x - fromPx.x;
  const dy = toPx.y - fromPx.y;
  const lenPx = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const cx = (fromPx.x + toPx.x) / 2;
  const cy = (fromPx.y + toPx.y) / 2;
  const pad = 22;
  const width = 32;
  const totalLen = lenPx + pad * 2;

  const introT = Math.min(1, t / 0.18);
  const outroT = t > 0.88 ? Math.min(1, (t - 0.88) / 0.12) : 0;
  const opacity = introT * (1 - outroT);
  const slide = (1 - introT) * 46;
  const perpRad = ((angle + 90) * Math.PI) / 180;
  const offX = Math.cos(perpRad) * slide;
  const offY = Math.sin(perpRad) * slide;

  const ticks = [];
  const cmCount = Math.floor((totalLen - pad * 2) / scalePxPerCm);
  for (let i = 0; i <= cmCount; i++) {
    const d = -lenPx / 2 + i * scalePxPerCm;
    const isFive = i % 5 === 0;
    ticks.push(
      <line
        key={i}
        x1={d}
        y1={-width / 2 + 4}
        x2={d}
        y2={-width / 2 + (isFive ? 14 : 8)}
        stroke="var(--tool-stroke)"
        strokeWidth={isFive ? 1.4 : 1}
      />
    );
  }

  return (
    <g transform={`translate(${cx + offX} ${cy + offY}) rotate(${angle})`} opacity={opacity} style={{ pointerEvents: "none" }}>
      <rect x={-totalLen / 2} y={-width / 2} width={totalLen} height={width} rx={5} fill="var(--tool-fill)" stroke="var(--tool-stroke)" strokeWidth={1.5} />
      {ticks}
      <line x1={-totalLen / 2 + 6} y1={width / 2 - 5} x2={totalLen / 2 - 6} y2={width / 2 - 5} stroke="var(--tool-stroke)" strokeWidth={1} opacity={0.5} />
    </g>
  );
}
