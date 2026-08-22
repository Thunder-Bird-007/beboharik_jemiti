// Small reusable builders so individual construction files stay declarative:
// they describe *what* geometry a step produces, these helpers wrap it into
// the GeomEntity + ToolAnim shapes the engine understands.
import type { AngleMark, ArcSpec, GeomEntity, Point, RaySpec, Segment } from "@/geom/types";
import { angleOf, dist, intersectLineLine, pointAtDistanceAngle, sweepShortest } from "@/geom/core";
import type { ToolAnim } from "./types";

let n = 0;
const eid = (p: string) => `${p}-${++n}`;

export function segEnt(a: Point, b: Point, role: Segment["role"] = "construction", ticks = 0, dashed = false): GeomEntity {
  return { kind: "segment", data: { id: eid("seg"), a, b, role, ticks, dashed } };
}

export function rayEnt(origin: Point, through: Point, length: number, role: RaySpec["role"] = "construction", dashed = false): GeomEntity {
  return { kind: "ray", data: { id: eid("ray"), origin, through, length, role, dashed } };
}

export function arcEnt(
  center: Point,
  radius: number,
  startAngle: number,
  endAngle: number,
  role: ArcSpec["role"] = "construction",
  fullCircle = false
): GeomEntity {
  return { kind: "arc", data: { id: eid("arc"), center, radius, startAngle, endAngle, role, fullCircle } };
}

export function angleMarkEnt(vertex: Point, from: Point, to: Point, label?: string, radius?: number, role: AngleMark["role"] = "given"): GeomEntity {
  return { kind: "angleMark", data: { id: eid("ang"), vertex, from, to, label, radius, role } };
}

export function rightAngleEnt(vertex: Point, a: Point, b: Point): GeomEntity {
  return { kind: "rightAngleMark", data: { id: eid("rt"), vertex, a, b } };
}

/** Compute a visually sensible start/end sweep (deg) for a compass arc centered at
 * `center` that must pass through `target`. If `from` is given the sweep starts
 * from that direction (e.g. the base ray) and rotates the short way to target,
 * with a little overshoot so the stroke visibly "settles" on the point. */
export function arcSweepTo(center: Point, target: Point, opts?: { from?: Point; padding?: number; sweepSpan?: number }): { startAngle: number; endAngle: number } {
  const targetAngle = angleOf(center, target);
  const padding = opts?.padding ?? 12;
  if (opts?.from) {
    const startAngle = angleOf(center, opts.from);
    const sweep = sweepShortest(startAngle, targetAngle);
    const dir = sweep >= 0 ? 1 : -1;
    return { startAngle, endAngle: startAngle + sweep + dir * padding };
  }
  const span = opts?.sweepSpan ?? 55;
  return { startAngle: targetAngle - span, endAngle: targetAngle + padding };
}

/** ToolAnim builders */
export const toolRuler = (from: Point, to: Point): ToolAnim => ({ tool: "ruler", from, to });
export const toolCompass = (center: Point, radius: number, startAngle: number, endAngle: number, radiusLabel?: string): ToolAnim => ({
  tool: "compass",
  center,
  radius,
  startAngle,
  endAngle,
  radiusLabel,
});
export const toolCompassFull = (center: Point, radius: number, radiusLabel?: string): ToolAnim => ({
  tool: "compass",
  center,
  radius,
  startAngle: 0,
  endAngle: 360,
  full: true,
  radiusLabel,
});
export const toolProtractor = (vertex: Point, baseAngle: number, targetAngle: number, label?: string): ToolAnim => ({
  tool: "protractor",
  vertex,
  baseAngle,
  targetAngle,
  label,
});
export const toolPencil = (at: Point): ToolAnim => ({ tool: "pencil", at });
export const toolNone: ToolAnim = { tool: "none" };

export function segLen(a: Point, b: Point): number {
  return dist(a, b);
}

/** Copy an angle at `vertex` (equal to angleDeg, measured off ray vertex->armThrough)
 * onto a target infinite line, picking whichever of the two possible rotation
 * directions lands closer to `preferCloserTo` — this is how e.g. "draw ∠DAB = ∠ADE
 * so AB meets DE at B" is resolved on the correct side without guessing signs by hand. */
export function copyAngleOntoLine(vertex: Point, armThrough: Point, angleDeg: number, lineA: Point, lineB: Point, preferCloserTo: Point): Point {
  const base = angleOf(vertex, armThrough);
  let best: Point | null = null;
  let bestD = Infinity;
  for (const cand of [base + angleDeg, base - angleDeg]) {
    const far = pointAtDistanceAngle(vertex, 1000, cand);
    const res = intersectLineLine(vertex, far, lineA, lineB);
    if (!res.point) continue;
    const d = dist(res.point, preferCloserTo);
    if (d < bestD) {
      bestD = d;
      best = res.point;
    }
  }
  if (!best) throw new Error("copyAngleOntoLine: no valid intersection (check inputs)");
  return best;
}
