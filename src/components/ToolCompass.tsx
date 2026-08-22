import { fmtCm } from "@/lib/format";

interface Px {
  x: number;
  y: number;
}

interface ToolCompassProps {
  centerPx: Px;
  radiusPx: number;
  radiusCm: number;
  startAngle: number;
  endAngle: number;
  t: number;
  lang: "bn" | "en";
  radiusLabel?: string;
  locked?: boolean;
}

/** angle here is screen-space degrees (atan2 over px coords), matching SVG rotate() semantics. */
export function ToolCompass({ centerPx, radiusPx, radiusCm, startAngle, endAngle, t, lang, radiusLabel, locked }: ToolCompassProps) {
  const introT = Math.min(1, t / 0.15);
  const current = startAngle + (endAngle - startAngle) * t;
  const rad = (current * Math.PI) / 180;
  const pencil = { x: centerPx.x + radiusPx * Math.cos(rad), y: centerPx.y + radiusPx * Math.sin(rad) };
  const apexAngle = current - 22;
  const apexRad = (apexAngle * Math.PI) / 180;
  const apexDist = Math.min(radiusPx * 0.62, radiusPx * 0.5 + 30);
  const apex = { x: centerPx.x + apexDist * Math.cos(apexRad), y: centerPx.y + apexDist * Math.sin(apexRad) };
  const opacity = introT;

  const label = radiusLabel ?? (lang === "bn" ? `ব্যাসার্ধ = ${fmtCm(radiusCm, "bn")}` : `radius = ${fmtCm(radiusCm, "en")}`);
  const labelPos = { x: apex.x, y: apex.y - 14 };

  return (
    <g opacity={opacity} style={{ pointerEvents: "none" }}>
      <circle cx={centerPx.x} cy={centerPx.y} r={4} fill="var(--danger)" />
      <line x1={apex.x} y1={apex.y} x2={centerPx.x} y2={centerPx.y} stroke="var(--tool-stroke)" strokeWidth={2.2} />
      <line x1={apex.x} y1={apex.y} x2={pencil.x} y2={pencil.y} stroke="var(--tool-stroke)" strokeWidth={2.2} />
      <circle cx={apex.x} cy={apex.y} r={5} fill="var(--tool-stroke)" />
      <circle cx={pencil.x} cy={pencil.y} r={3.2} fill="var(--final-ink)" />
      <g transform={`translate(${labelPos.x} ${labelPos.y})`}>
        <rect x={-58} y={-20} width={116} height={20} rx={4} fill="var(--bg-elevated)" stroke="var(--tool-stroke)" strokeWidth={1} opacity={0.92} />
        <text x={0} y={-6} fontSize={11.5} textAnchor="middle" fill="var(--tool-stroke)" className="font-mono-num">
          {label}
        </text>
      </g>
      {locked && (
        <g transform={`translate(${apex.x} ${apex.y - 34})`}>
          <rect x={-46} y={-16} width={92} height={18} rx={9} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1} />
          <text x={0} y={-3} fontSize={10.5} textAnchor="middle" fill="var(--accent)" fontWeight={600}>
            {lang === "bn" ? "🔒 ব্যাসার্ধ অপরিবর্তিত" : "🔒 radius unchanged"}
          </text>
        </g>
      )}
    </g>
  );
}
