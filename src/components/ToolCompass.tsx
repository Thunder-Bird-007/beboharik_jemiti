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

  // Mechanically accurate hinge: the pivot is a fixed "leg length" away from
  // BOTH the needle tip (center) and the pencil tip, for any sweep angle —
  // exactly how a real compass's hinge traces its own arc as it rotates.
  const legLen = Math.min(170, Math.max(70, radiusPx / 2 + 8));
  const halfChord = radiusPx / 2;
  const h = Math.sqrt(Math.max(0, legLen * legLen - halfChord * halfChord));
  const midX = centerPx.x + halfChord * Math.cos(rad);
  const midY = centerPx.y + halfChord * Math.sin(rad);
  const perpRad = rad - Math.PI / 2;
  const apex = { x: midX + h * Math.cos(perpRad), y: midY + h * Math.sin(perpRad) };

  const opacity = introT;

  // needle tip: small diamond piercing "into" the paper, with a fine cross-mark
  const needleDiamond = `M${centerPx.x} ${centerPx.y - 5} L${centerPx.x + 3.4} ${centerPx.y} L${centerPx.x} ${centerPx.y + 5} L${centerPx.x - 3.4} ${centerPx.y} Z`;

  // pencil tip: a small sharpened cone pointing along the leg direction
  const legDx = pencil.x - apex.x;
  const legDy = pencil.y - apex.y;
  const legLenPx = Math.hypot(legDx, legDy) || 1;
  const ux = legDx / legLenPx;
  const uy = legDy / legLenPx;
  const px_ = -uy;
  const py_ = ux;
  const tipBackX = pencil.x - ux * 9;
  const tipBackY = pencil.y - uy * 9;
  const pencilCone = `M${pencil.x} ${pencil.y} L${tipBackX + px_ * 3} ${tipBackY + py_ * 3} L${tipBackX - px_ * 3} ${tipBackY - py_ * 3} Z`;

  const label = radiusLabel ?? (lang === "bn" ? `ব্যাসার্ধ = ${fmtCm(radiusCm, "bn")}` : `radius = ${fmtCm(radiusCm, "en")}`);
  const labelPos = { x: apex.x, y: apex.y - 16 };

  // hinge "thumbscrew" tab sticking outward along the apex-outward bisector
  const hingeOutDist = 13;
  const hingeOutX = apex.x + h * Math.cos(perpRad) * (hingeOutDist / Math.max(h, 1));
  const hingeOutY = apex.y + h * Math.sin(perpRad) * (hingeOutDist / Math.max(h, 1));

  return (
    <g opacity={opacity} style={{ pointerEvents: "none" }}>
      {/* legs, drawn as a thicker base stroke + a thin highlight for a slight 3D metal feel */}
      <line x1={apex.x} y1={apex.y} x2={centerPx.x} y2={centerPx.y} stroke="var(--tool-stroke)" strokeWidth={4} strokeLinecap="round" />
      <line
        x1={apex.x}
        y1={apex.y}
        x2={centerPx.x}
        y2={centerPx.y}
        stroke="var(--bg-elevated)"
        strokeWidth={1}
        strokeOpacity={0.55}
        strokeLinecap="round"
      />
      <line x1={apex.x} y1={apex.y} x2={pencil.x} y2={pencil.y} stroke="var(--tool-stroke)" strokeWidth={4} strokeLinecap="round" />
      <line
        x1={apex.x}
        y1={apex.y}
        x2={pencil.x}
        y2={pencil.y}
        stroke="var(--bg-elevated)"
        strokeWidth={1}
        strokeOpacity={0.55}
        strokeLinecap="round"
      />

      {/* hinge joint */}
      <circle cx={apex.x} cy={apex.y} r={7} fill="var(--tool-stroke)" />
      <circle cx={apex.x} cy={apex.y} r={3} fill="var(--bg-elevated)" opacity={0.7} />
      <line x1={apex.x} y1={apex.y} x2={hingeOutX} y2={hingeOutY} stroke="var(--tool-stroke)" strokeWidth={3.5} strokeLinecap="round" />
      <circle cx={hingeOutX} cy={hingeOutY} r={3} fill="var(--tool-stroke)" />

      {/* needle tip planted at the centre */}
      <path d={needleDiamond} fill="var(--danger)" />
      <circle cx={centerPx.x} cy={centerPx.y} r={1.4} fill="var(--bg-elevated)" />

      {/* pencil tip actively drawing */}
      <path d={pencilCone} fill="var(--final-ink)" />
      <circle cx={pencil.x} cy={pencil.y} r={2.2} fill="var(--accent)" />

      <g transform={`translate(${labelPos.x} ${labelPos.y})`}>
        <rect x={-58} y={-20} width={116} height={20} rx={4} fill="var(--bg-elevated)" stroke="var(--tool-stroke)" strokeWidth={1} opacity={0.92} />
        <text x={0} y={-6} fontSize={11.5} textAnchor="middle" fill="var(--tool-stroke)" className="font-mono-num">
          {label}
        </text>
      </g>
      {locked && (
        <g transform={`translate(${apex.x} ${apex.y - 40})`}>
          <rect x={-46} y={-16} width={92} height={18} rx={9} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1} />
          <text x={0} y={-3} fontSize={10.5} textAnchor="middle" fill="var(--accent)" fontWeight={600}>
            {lang === "bn" ? "🔒 ব্যাসার্ধ অপরিবর্তিত" : "🔒 radius unchanged"}
          </text>
        </g>
      )}
    </g>
  );
}
