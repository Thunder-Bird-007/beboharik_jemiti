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
  const bodyR = radiusPx * 1.4;
  const dir: 1 | -1 = rawSweep >= 0 ? 1 : -1;

  const ptAt = (a: number, r: number) => {
    const rad = (a * Math.PI) / 180;
    return { x: vertexPx.x + r * Math.cos(rad), y: vertexPx.y + r * Math.sin(rad) };
  };

  // semicircle body: flat baseline diameter edge from -bodyR to +bodyR along
  // the base angle, closed by the arc rim on the far side.
  const rimPts: string[] = [];
  for (let i = 0; i <= 36; i++) {
    const a = baseAngleScreen + dir * (i * 5);
    const p = ptAt(a, bodyR);
    rimPts.push(`${p.x},${p.y}`);
  }
  const baseStart = ptAt(baseAngleScreen, -bodyR);
  const bodyPath = `M${baseStart.x},${baseStart.y} L${rimPts.join(" L")} Z`;

  // tick marks: minor every 2°, major (longer, labelled) every 10°
  const majorLabels = [0, 30, 60, 90, 120, 150, 180];
  const ticks: { x1: number; y1: number; x2: number; y2: number; major: boolean }[] = [];
  const labels: { x: number; y: number; text: string }[] = [];
  for (let d = 0; d <= 180; d += 2) {
    const a = baseAngleScreen + dir * d;
    const major = d % 10 === 0;
    const inner = ptAt(a, bodyR - (major ? 12 : 6));
    const outer = ptAt(a, bodyR - 1);
    ticks.push({ x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y, major });
    if (majorLabels.includes(d)) {
      const lp = ptAt(a, bodyR - 22);
      labels.push({ x: lp.x, y: lp.y, text: String(d) });
    }
  }

  const wedgePts: string[] = [];
  const steps = Math.max(2, Math.ceil(currentDeg / 4));
  for (let i = 0; i <= steps; i++) {
    const a = baseAngleScreen + dir * ((currentDeg * i) / steps);
    const p = ptAt(a, radiusPx);
    wedgePts.push(`${p.x},${p.y}`);
  }
  const wedgePath = wedgePts.length > 1 ? `M${vertexPx.x},${vertexPx.y} L${wedgePts.join(" L")} Z` : "";
  const needlePt = ptAt(baseAngleScreen + dir * currentDeg, radiusPx * 1.05);

  return (
    <g opacity={introT} style={{ pointerEvents: "none" }}>
      <path d={bodyPath} fill="var(--tool-fill)" stroke="var(--tool-stroke)" strokeWidth={1.6} />
      {ticks.map((tk, i) => (
        <line key={i} x1={tk.x1} y1={tk.y1} x2={tk.x2} y2={tk.y2} stroke="var(--tool-stroke)" strokeWidth={tk.major ? 1.3 : 0.7} opacity={tk.major ? 0.85 : 0.5} />
      ))}
      {labels.map((lb, i) => (
        <text key={i} x={lb.x} y={lb.y} fontSize={8.5} textAnchor="middle" dominantBaseline="middle" fill="var(--tool-stroke)" opacity={0.8}>
          {lb.text}
        </text>
      ))}
      {/* baseline straightedge through the vertex, like a real protractor's ruler edge */}
      <line
        x1={ptAt(baseAngleScreen, -bodyR).x}
        y1={ptAt(baseAngleScreen, -bodyR).y}
        x2={ptAt(baseAngleScreen, bodyR).x}
        y2={ptAt(baseAngleScreen, bodyR).y}
        stroke="var(--tool-stroke)"
        strokeWidth={1}
        opacity={0.4}
      />
      <circle cx={vertexPx.x} cy={vertexPx.y} r={2.6} fill="none" stroke="var(--tool-stroke)" strokeWidth={1.2} />
      {wedgePath && <path d={wedgePath} fill="var(--accent-soft)" fillOpacity={0.55} stroke="var(--accent)" strokeWidth={1.6} />}
      {/* a small radial "pencil" marker riding the sweep, like a hand actively marking the arc */}
      <circle cx={needlePt.x} cy={needlePt.y} r={2.4} fill="var(--accent)" />
      <g transform={`translate(${vertexPx.x} ${vertexPx.y - bodyR - 18})`}>
        <rect x={-40} y={-16} width={80} height={18} rx={4} fill="var(--bg-elevated)" stroke="var(--tool-stroke)" strokeWidth={1} opacity={0.95} />
        <text x={0} y={-3} fontSize={11.5} textAnchor="middle" fill="var(--accent)" fontWeight={600} className="font-mono-num">
          {lang === "bn" ? "০°" : "0°"} → {fmtDeg(currentDeg, lang)}
        </text>
      </g>
    </g>
  );
}
