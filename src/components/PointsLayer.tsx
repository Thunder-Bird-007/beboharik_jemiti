import type { Point } from "@/geom/types";
import { toPx, type Transform } from "@/geom/render";

interface PointsLayerProps {
  points: Point[];
  offsets: Record<string, { dx: number; dy: number }>;
  transform: Transform;
  lang: "bn" | "en";
  /** points that just appeared this step (rendered with ripple + fade) */
  freshIds?: Set<string>;
  color?: string;
}

const LABEL_DIST = 20;

export function PointsLayer({ points, offsets, transform, lang, freshIds, color }: PointsLayerProps) {
  return (
    <g>
      {points.map((p) => {
        const px = toPx(p, transform);
        const off = offsets[p.id] ?? { dx: 0.4, dy: 0.6 };
        const lx = px.x + off.dx * LABEL_DIST;
        const ly = px.y - off.dy * LABEL_DIST;
        const fresh = freshIds?.has(p.id);
        const label = lang === "bn" ? p.label : p.labelEn ?? p.label;
        return (
          <g key={p.id} className={fresh ? "fade-in-up" : undefined}>
            {fresh && (
              <circle cx={px.x} cy={px.y} r={0} fill="none" stroke={color ?? "var(--accent)"} strokeWidth={2} className="pencil-ripple" />
            )}
            <circle cx={px.x} cy={px.y} r={3.2} fill={color ?? "var(--final-ink)"} />
            {label && (
              <text x={lx} y={ly} fontSize={16} fontWeight={600} fill={color ?? "var(--final-ink)"} textAnchor="middle" dominantBaseline="middle">
                {label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
