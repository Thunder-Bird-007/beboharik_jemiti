import type { GeomEntity, Point } from "@/geom/types";
import { angleOf, sweepShortest } from "@/geom/core";
import { toPx, toPxXY, type Transform } from "@/geom/render";

interface EntityLayerProps {
  entities: GeomEntity[];
  transform: Transform;
  /** 0..1 reveal fraction; omit for fully-drawn (no animation) */
  revealT?: number;
  /** when true, non-given roles render in the "derived" (orange) verify color */
  verifyActive?: boolean;
}

function colorFor(role: string | undefined, verifyActive: boolean | undefined): string {
  if (role === "given") return "var(--given)";
  if (verifyActive) return "var(--derived)";
  if (role === "final") return "var(--final-ink)";
  return "var(--construction-line)";
}

function strokeWidthFor(role: string | undefined): number {
  if (role === "final") return 2.4;
  if (role === "given") return 2.2;
  return 1.4;
}

function lerpPoint(a: Point, b: Point, t: number): Point {
  return { id: "tmp", x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function arcPathD(center: Point, radius: number, startDeg: number, endDeg: number, t: Transform): string {
  const delta = endDeg - startDeg;
  const n = Math.max(2, Math.ceil(Math.abs(delta) / 6));
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const a = startDeg + (delta * i) / n;
    const rad = (a * Math.PI) / 180;
    const px = toPxXY(center.x + radius * Math.cos(rad), center.y + radius * Math.sin(rad), t);
    pts.push(`${i === 0 ? "M" : "L"}${px.x.toFixed(2)},${px.y.toFixed(2)}`);
  }
  return pts.join(" ");
}

function TickMarks({ a, b, count, t }: { a: Point; b: Point; count: number; t: Transform }) {
  if (!count) return null;
  const pa = toPx(a, t);
  const pb = toPx(b, t);
  const dx = pb.x - pa.x;
  const dy = pb.y - pa.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const midX = (pa.x + pb.x) / 2;
  const midY = (pa.y + pb.y) / 2;
  const spacing = 5;
  const tickLen = 6;
  const marks = [];
  const start = -((count - 1) / 2) * spacing;
  for (let i = 0; i < count; i++) {
    const off = start + i * spacing;
    const cx = midX + ux * off;
    const cy = midY + uy * off;
    marks.push(
      <line
        key={i}
        x1={cx - px * tickLen}
        y1={cy - py * tickLen}
        x2={cx + px * tickLen}
        y2={cy + py * tickLen}
        stroke="var(--final-ink)"
        strokeWidth={1.6}
      />
    );
  }
  return <>{marks}</>;
}

export function EntityLayer({ entities, transform, revealT, verifyActive }: EntityLayerProps) {
  const t = revealT === undefined ? 1 : Math.max(0, Math.min(1, revealT));
  return (
    <g>
      {entities.map((e) => {
        if (e.kind === "segment") {
          const s = e.data;
          const bEnd = t >= 1 ? s.b : lerpPoint(s.a, s.b, t);
          const pa = toPx(s.a, transform);
          const pb = toPx(bEnd, transform);
          return (
            <g key={s.id}>
              <line
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke={colorFor(s.role, verifyActive)}
                strokeWidth={strokeWidthFor(s.role)}
                strokeDasharray={s.dashed ? "5 4" : undefined}
                strokeLinecap="round"
              />
              {t >= 0.999 && s.ticks ? <TickMarks a={s.a} b={s.b} count={s.ticks} t={transform} /> : null}
            </g>
          );
        }
        if (e.kind === "ray") {
          const r = e.data;
          const dx = r.through.x - r.origin.x;
          const dy = r.through.y - r.origin.y;
          const dlen = Math.hypot(dx, dy) || 1;
          const far: Point = {
            id: "tmp",
            x: r.origin.x + (dx / dlen) * r.length * t,
            y: r.origin.y + (dy / dlen) * r.length * t,
          };
          const pa = toPx(r.origin, transform);
          const pb = toPx(far, transform);
          return (
            <line
              key={r.id}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke={colorFor(r.role, verifyActive)}
              strokeWidth={strokeWidthFor(r.role)}
              strokeDasharray={r.dashed ? "5 4" : undefined}
              strokeLinecap="round"
            />
          );
        }
        if (e.kind === "arc") {
          const a = e.data;
          const end = a.fullCircle ? a.startAngle + 360 * t : a.startAngle + (a.endAngle - a.startAngle) * t;
          const d = arcPathD(a.center, a.radius, a.startAngle, end, transform);
          return (
            <path
              key={a.id}
              d={d}
              fill="none"
              stroke={colorFor(a.role, verifyActive)}
              strokeWidth={strokeWidthFor(a.role)}
              strokeLinecap="round"
            />
          );
        }
        if (e.kind === "angleMark") {
          const m = e.data;
          const startA = angleOf(m.vertex, m.from);
          const sweep = sweepShortest(startA, angleOf(m.vertex, m.to));
          const endA = startA + sweep * t;
          const radius = m.radius ?? 0.7;
          const d = arcPathD(m.vertex, radius, startA, endA, transform);
          const midA = startA + (sweep * t) / 2;
          const rad = (midA * Math.PI) / 180;
          const labelPos = toPxXY(m.vertex.x + (radius + 0.35) * Math.cos(rad), m.vertex.y + (radius + 0.35) * Math.sin(rad), transform);
          return (
            <g key={m.id}>
              <path d={d} fill="none" stroke={colorFor(m.role ?? "given", verifyActive)} strokeWidth={1.4} />
              {m.label && t > 0.6 ? (
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  fontSize={13}
                  fill={colorFor(m.role ?? "given", verifyActive)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-mono-num"
                >
                  {m.label}
                </text>
              ) : null}
            </g>
          );
        }
        if (e.kind === "rightAngleMark") {
          const m = e.data;
          const ua = angleOf(m.vertex, m.a);
          const ub = angleOf(m.vertex, m.b);
          const sizeCm = 0.28;
          const p1 = toPxXY(m.vertex.x + sizeCm * Math.cos((ua * Math.PI) / 180), m.vertex.y + sizeCm * Math.sin((ua * Math.PI) / 180), transform);
          const p3 = toPxXY(m.vertex.x + sizeCm * Math.cos((ub * Math.PI) / 180), m.vertex.y + sizeCm * Math.sin((ub * Math.PI) / 180), transform);
          const p2 = toPxXY(
            m.vertex.x + sizeCm * Math.cos((ua * Math.PI) / 180) + sizeCm * Math.cos((ub * Math.PI) / 180),
            m.vertex.y + sizeCm * Math.sin((ua * Math.PI) / 180) + sizeCm * Math.sin((ub * Math.PI) / 180),
            transform
          );
          if (t < 0.4) return null;
          return (
            <polyline
              key={m.id}
              points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
              fill="none"
              stroke="var(--final-ink)"
              strokeWidth={1.3}
            />
          );
        }
        return null;
      })}
    </g>
  );
}
