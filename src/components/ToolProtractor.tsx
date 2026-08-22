import { fmtDeg } from "@/lib/format";

interface Px {
  x: number;
  y: number;
}

interface ToolProtractorProps {
  vertexPx: Px;
  /** screen-space baseline angle (deg) the protractor's 0° edge sits on */
  baseAngleScreen: number;
  /** screen-space target angle, already chosen on the correct side (baseAngleScreen + signed sweep) */
  targetAngleScreen: number;
  radiusPx: number;
  t: number;
  lang: "bn" | "en";
}

export function ToolProtractor({ vertexPx, baseAngleScreen, targetAngleScreen, radiusPx, t, lang }: ToolProtractorProps) {
  const introT = Math.min(1, t / 0.15);
  const rawSweep = targetAngleScreen - baseAngleScreen;
  const sweepDeg = Math.abs(rawSweep);
  const currentDeg = sweepDeg * t;
  const bodyR = radiusPx * 1.35;

  // semicircle body (0..180 relative to base edge, opening toward target side)
  const dir: 1 | -1 = rawSweep >= 0 ? 1 : -1;
  const bodyPts: string[] = [];
  for (let i = 0; i <= 36; i++) {
    const a = baseAngleScreen + dir * (i * 5);
    const rad = (a * Math.PI) / 180;
    bodyPts.push(`${vertexPx.x + bodyR * Math.cos(rad)},${vertexPx.y + bodyR * Math.sin(rad)}`);
  }
  const bodyPath = `M${vertexPx.x},${vertexPx.y} L${bodyPts.join(" L")} Z`;

  const wedgePts: string[] = [];
  const steps = Math.max(2, Math.ceil(currentDeg / 4));
  for (let i = 0; i <= steps; i++) {
    const a = baseAngleScreen + dir * ((currentDeg * i) / steps);
    const rad = (a * Math.PI) / 180;
    wedgePts.push(`${vertexPx.x + radiusPx * Math.cos(rad)},${vertexPx.y + radiusPx * Math.sin(rad)}`);
  }
  const wedgePath = wedgePts.length > 1 ? `M${vertexPx.x},${vertexPx.y} L${wedgePts.join(" L")} Z` : "";

  return (
    <g opacity={introT} style={{ pointerEvents: "none" }}>
      <path d={bodyPath} fill="var(--tool-fill)" stroke="var(--tool-stroke)" strokeWidth={1.4} />
      {wedgePath && <path d={wedgePath} fill="var(--accent-soft)" fillOpacity={0.55} stroke="var(--accent)" strokeWidth={1.6} />}
      <g transform={`translate(${vertexPx.x} ${vertexPx.y - bodyR - 18})`}>
        <rect x={-40} y={-16} width={80} height={18} rx={4} fill="var(--bg-elevated)" stroke="var(--tool-stroke)" strokeWidth={1} opacity={0.95} />
        <text x={0} y={-3} fontSize={11.5} textAnchor="middle" fill="var(--accent)" fontWeight={600} className="font-mono-num">
          {lang === "bn" ? "০°" : "0°"} → {fmtDeg(currentDeg, lang)}
        </text>
      </g>
    </g>
  );
}
