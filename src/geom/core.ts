// Pure geometry helpers. Coordinates are in standard math space (y-up,
// angles CCW from +x axis, degrees). Rendering flips to SVG (y-down).
import type { Point } from "./types";
import { DEG, RAD } from "./types";

let idCounter = 0;
export function uid(prefix = "p"): string {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

export function pt(x: number, y: number, label?: string, labelEn?: string): Point {
  return { id: uid("pt"), x, y, label, labelEn };
}

export function dist(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function midpoint(a: Point, b: Point): Point {
  return pt((a.x + b.x) / 2, (a.y + b.y) / 2);
}

/** Angle (degrees, 0-360) of ray from a to b, measured CCW from +x axis. */
export function angleOf(a: Point, b: Point): number {
  const deg = Math.atan2(b.y - a.y, b.x - a.x) * RAD;
  return (deg + 360) % 360;
}

/** Interior angle at vertex formed by rays vertex->p1 and vertex->p2, in [0,180]. */
export function angleBetween(p1: Point, vertex: Point, p2: Point): number {
  const a1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
  const a2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);
  let diff = Math.abs(a1 - a2) * RAD;
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/** New point at `distance` from origin, at `angleDeg` (CCW from +x). */
export function pointAtDistanceAngle(origin: Point, distance: number, angleDeg: number): Point {
  return pt(origin.x + distance * Math.cos(angleDeg * DEG), origin.y + distance * Math.sin(angleDeg * DEG));
}

/** Point at given distance from `from`, along the direction from `from` to `towards`. */
export function pointAlong(from: Point, towards: Point, distance: number): Point {
  const a = angleOf(from, towards);
  return pointAtDistanceAngle(from, distance, a);
}

/** Rotate point p around center by degrees (CCW positive). */
export function rotatePoint(p: Point, center: Point, degrees: number): Point {
  const rad = degrees * DEG;
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  return pt(center.x + dx * Math.cos(rad) - dy * Math.sin(rad), center.y + dx * Math.sin(rad) + dy * Math.cos(rad));
}

/** Bisect the angle p1-vertex-p2, returning the direction angle (deg) of the bisector ray from vertex. */
export function bisectAngleDir(p1: Point, vertex: Point, p2: Point): number {
  const a1 = angleOf(vertex, p1);
  const a2 = angleOf(vertex, p2);
  let diff = a2 - a1;
  diff = ((diff + 540) % 360) - 180; // normalize to (-180,180]
  return (a1 + diff / 2 + 360) % 360;
}

/** Perpendicular direction (deg) to the line through a,b, rotated CCW. */
export function perpendicularDir(a: Point, b: Point): number {
  return (angleOf(a, b) + 90) % 360;
}

/** Foot of perpendicular from p onto the infinite line through a,b. */
export function projectPointOnLine(p: Point, a: Point, b: Point): Point {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const len2 = abx * abx + aby * aby;
  if (len2 === 0) return a;
  const t = ((p.x - a.x) * abx + (p.y - a.y) * aby) / len2;
  return pt(a.x + t * abx, a.y + t * aby);
}

export interface LineLineResult {
  point: Point | null;
  parallel: boolean;
}

/** Intersection of infinite line a1-a2 with infinite line b1-b2. */
export function intersectLineLine(a1: Point, a2: Point, b1: Point, b2: Point): LineLineResult {
  const d1x = a2.x - a1.x;
  const d1y = a2.y - a1.y;
  const d2x = b2.x - b1.x;
  const d2y = b2.y - b1.y;
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < 1e-9) return { point: null, parallel: true };
  const t = ((b1.x - a1.x) * d2y - (b1.y - a1.y) * d2x) / denom;
  return { point: pt(a1.x + t * d1x, a1.y + t * d1y), parallel: false };
}

/** Two intersection points of circle(c1,r1) and circle(c2,r2), sorted so [0] is the one
 * on the left of c1->c2 direction (CCW) and [1] on the right — deterministic across calls. */
export function intersectCircleCircle(c1: Point, r1: number, c2: Point, r2: number): [Point, Point] | null {
  const d = dist(c1, c2);
  if (d < 1e-9 || d > r1 + r2 + 1e-9 || d < Math.abs(r1 - r2) - 1e-9) return null;
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const hSq = r1 * r1 - a * a;
  const h = Math.sqrt(Math.max(0, hSq));
  const ux = (c2.x - c1.x) / d;
  const uy = (c2.y - c1.y) / d;
  const mx = c1.x + a * ux;
  const my = c1.y + a * uy;
  // perpendicular direction
  const px = -uy;
  const py = ux;
  const p1 = pt(mx + h * px, my + h * py);
  const p2 = pt(mx - h * px, my - h * py);
  return [p1, p2];
}

/** Intersections of circle(center,r) with infinite line a-b. */
export function intersectCircleLine(center: Point, r: number, a: Point, b: Point): [Point, Point] | null {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const fx = a.x - center.x;
  const fy = a.y - center.y;
  const A = dx * dx + dy * dy;
  const B = 2 * (fx * dx + fy * dy);
  const C = fx * fx + fy * fy - r * r;
  const disc = B * B - 4 * A * C;
  if (disc < 0) return null;
  const sq = Math.sqrt(disc);
  const t1 = (-B - sq) / (2 * A);
  const t2 = (-B + sq) / (2 * A);
  return [pt(a.x + t1 * dx, a.y + t1 * dy), pt(a.x + t2 * dx, a.y + t2 * dy)];
}

/** Pick whichever of two candidate points is on a given side of directed line p->q.
 * side > 0 = left (CCW) of p->q, side < 0 = right. Returns the matching point, or the
 * first candidate if neither/both match exactly (degenerate). */
export function pickBySide(candidates: [Point, Point], p: Point, q: Point, side: 1 | -1): Point {
  const cross = (c: Point) => (q.x - p.x) * (c.y - p.y) - (q.y - p.y) * (c.x - p.x);
  const c0 = cross(candidates[0]);
  const c1 = cross(candidates[1]);
  if (side > 0) return c0 >= c1 ? candidates[0] : candidates[1];
  return c0 <= c1 ? candidates[0] : candidates[1];
}

/** Pick the candidate farther from a reference point (useful for "outer" intersection). */
export function pickFarther(candidates: [Point, Point], ref: Point): Point {
  return dist(candidates[0], ref) >= dist(candidates[1], ref) ? candidates[0] : candidates[1];
}

/** Pick the candidate closer to a reference point. */
export function pickCloser(candidates: [Point, Point], ref: Point): Point {
  return dist(candidates[0], ref) <= dist(candidates[1], ref) ? candidates[0] : candidates[1];
}

export function withLabel(p: Point, label: string, labelEn?: string): Point {
  return { ...p, label, labelEn: labelEn ?? label };
}

export function clampAngle360(a: number): number {
  return ((a % 360) + 360) % 360;
}

/** Shortest signed sweep (deg) from angle a to angle b, in (-180,180]. */
export function sweepShortest(a: number, b: number): number {
  return (((b - a + 540) % 360) - 180);
}
