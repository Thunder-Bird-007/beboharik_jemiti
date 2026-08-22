// Real ruler-and-compass construction primitives — the actual multi-arc
// techniques (not a single symbolic sweep) for the three moves that recur
// across the lecture: bisecting an angle, copying an angle, constructing a
// 60° angle, and erecting a perpendicular at a point on a line. Each
// returns every intermediate point/radius a construction file needs to
// render the real sequence of arcs as separate, individually-animated Steps.
import { angleOf, dist, intersectCircleCircle, pointAtDistanceAngle, sweepShortest } from "@/geom/core";
import type { Point } from "@/geom/types";

/** Pick whichever of two candidate points lies in a direction (from `vertex`)
 * closest to `desiredDirDeg` — the one robust "which side" rule used by
 * every construction below. */
export function pickByDirection(cands: [Point, Point], vertex: Point, desiredDirDeg: number): Point {
  const a0 = angleOf(vertex, cands[0]);
  const a1 = angleOf(vertex, cands[1]);
  const d0 = Math.abs(sweepShortest(desiredDirDeg, a0));
  const d1 = Math.abs(sweepShortest(desiredDirDeg, a1));
  return d0 <= d1 ? cands[0] : cands[1];
}

export interface BisectAngleOp {
  vertex: Point;
  r1: number;
  P: Point;
  Q: Point;
  r2: number;
  X: Point;
  bisectorDirDeg: number;
}

/** The real angle-bisection technique: one arc from the vertex crossing both
 * arms at P, Q; then two equal arcs (same radius r2) from P and Q, crossing
 * at X. Ray vertex→X is the bisector. */
export function bisectAngle(vertex: Point, armA: Point, armB: Point, r1Frac = 0.62, r2Frac = 0.8): BisectAngleOp {
  const armLen = Math.min(dist(vertex, armA), dist(vertex, armB));
  const r1 = armLen * r1Frac;
  const dirA = angleOf(vertex, armA);
  const dirB = angleOf(vertex, armB);
  const P = pointAtDistanceAngle(vertex, r1, dirA);
  const Q = pointAtDistanceAngle(vertex, r1, dirB);
  const pq = dist(P, Q);
  const r2 = Math.max(pq * r2Frac, pq * 0.55 + 0.01);
  const cands = intersectCircleCircle(P, r2, Q, r2);
  const desiredDir = dirA + sweepShortest(dirA, dirB) / 2;
  const X = cands ? pickByDirection(cands, vertex, desiredDir) : pointAtDistanceAngle(vertex, r1 + r2, desiredDir);
  return { vertex, r1, P, Q, r2, X, bisectorDirDeg: angleOf(vertex, X) };
}

export interface CopyAngleOp {
  sourceVertex: Point;
  r1: number;
  P: Point;
  Q: Point;
  r2: number;
  targetVertex: Point;
  Pt: Point;
  Qt: Point;
  targetBaseDirDeg: number;
  copiedDirDeg: number;
}

/** The real angle-copy technique: arc (radius r1) from the source vertex
 * crossing both source arms at P, Q; the SAME radius r1 struck from the
 * target vertex along its base arm gives Pt; the chord length r2 = PQ,
 * struck from Pt, gives Qt on the copied arm. `knownCorrectDirDeg` is the
 * (already-derived, exact) direction the copied ray must end up pointing —
 * this function places the compass geometry consistently with it rather
 * than re-deriving which of two candidate intersections is "the right side". */
export function copyAngleCompass(
  sourceVertex: Point,
  sourceArmA: Point,
  sourceArmB: Point,
  targetVertex: Point,
  targetBaseDirDeg: number,
  knownCorrectDirDeg: number,
  r1Frac = 0.6
): CopyAngleOp {
  const srcArmLen = Math.min(dist(sourceVertex, sourceArmA), dist(sourceVertex, sourceArmB));
  const r1 = srcArmLen * r1Frac;
  const P = pointAtDistanceAngle(sourceVertex, r1, angleOf(sourceVertex, sourceArmA));
  const Q = pointAtDistanceAngle(sourceVertex, r1, angleOf(sourceVertex, sourceArmB));
  const r2 = dist(P, Q);
  const Pt = pointAtDistanceAngle(targetVertex, r1, targetBaseDirDeg);
  const Qt = pointAtDistanceAngle(targetVertex, r1, knownCorrectDirDeg);
  return { sourceVertex, r1, P, Q, r2, targetVertex, Pt, Qt, targetBaseDirDeg, copiedDirDeg: knownCorrectDirDeg };
}

export interface Construct60Op {
  vertex: Point;
  r: number;
  P: Point;
  Q: Point;
  dirDeg: number;
}

/** The classic compass-only 60° angle: an arc from the vertex crossing the
 * base arm at P, then an equal-radius arc from P crossing the first arc at
 * Q — triangle vertex-P-Q is equilateral, so ∠P-vertex-Q = 60°. */
export function construct60(vertex: Point, baseArmPoint: Point, sweepSign: 1 | -1, rFrac = 0.55): Construct60Op {
  const baseLen = dist(vertex, baseArmPoint);
  const r = baseLen * rFrac;
  const baseDeg = angleOf(vertex, baseArmPoint);
  const P = pointAtDistanceAngle(vertex, r, baseDeg);
  const cands = intersectCircleCircle(vertex, r, P, r);
  const desiredDir = baseDeg + sweepSign * 60;
  const Q = cands ? pickByDirection(cands, vertex, desiredDir) : pointAtDistanceAngle(vertex, r, desiredDir);
  return { vertex, r, P, Q, dirDeg: angleOf(vertex, Q) };
}

export interface PerpendicularAtPointOp {
  point: Point;
  alongDirDeg: number;
  r: number;
  M: Point;
  N: Point;
  r2: number;
  X: Point;
  perpDirDeg: number;
}

/** Erecting a perpendicular AT a point that already lies on a line: an arc
 * from the point marks M, N equidistant on both sides along the line; equal
 * arcs from M and N (same radius r2) cross at X. Ray point→X ⊥ the line. */
export function perpendicularAtPoint(point: Point, alongDirDeg: number, side: 1 | -1, r: number, r2Frac = 1.15): PerpendicularAtPointOp {
  const M = pointAtDistanceAngle(point, r, alongDirDeg);
  const N = pointAtDistanceAngle(point, r, alongDirDeg + 180);
  const r2 = r * r2Frac;
  const cands = intersectCircleCircle(M, r2, N, r2);
  const desiredDir = alongDirDeg + side * 90;
  const X = cands ? pickByDirection(cands, point, desiredDir) : pointAtDistanceAngle(point, r2, desiredDir);
  return { point, alongDirDeg, r, M, N, r2, X, perpDirDeg: angleOf(point, X) };
}
