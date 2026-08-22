// Core geometric primitives used throughout the engine.
// All coordinates are in "scene units" == centimetres. Components convert
// to pixels at render time via a single `scale` (px per cm) so every
// construction can be re-scaled just by changing that one number.

export interface Point {
  id: string;
  x: number;
  y: number;
  /** Bangla label shown next to the point, e.g. "ক", "A" */
  label?: string;
  labelEn?: string;
}

export interface Segment {
  id: string;
  a: Point;
  b: Point;
  /** visual role drives styling: given (blue), construction (gray, thin), final (bold ink) */
  role?: "given" | "construction" | "final" | "helper";
  /** number of equal-length tick marks to draw at the midpoint, 0 = none */
  ticks?: number;
  dashed?: boolean;
}

export interface RaySpec {
  id: string;
  origin: Point;
  through: Point;
  /** how far beyond `through` the ray is actually drawn, in cm */
  length: number;
  role?: "given" | "construction" | "final" | "helper";
  dashed?: boolean;
}

export interface ArcSpec {
  id: string;
  center: Point;
  radius: number;
  /** start angle in degrees, measured from +x axis, CCW positive (SVG y-down handled at render) */
  startAngle: number;
  endAngle: number;
  role?: "given" | "construction" | "final" | "helper";
  /** true = full circle regardless of start/end */
  fullCircle?: boolean;
}

export interface AngleMark {
  id: string;
  vertex: Point;
  /** point defining the first ray of the angle */
  from: Point;
  /** point defining the second ray of the angle */
  to: Point;
  radius?: number;
  label?: string;
  role?: "given" | "construction" | "final";
}

export interface RightAngleMark {
  id: string;
  vertex: Point;
  a: Point;
  b: Point;
}

export type GeomEntity =
  | { kind: "point"; data: Point }
  | { kind: "segment"; data: Segment }
  | { kind: "ray"; data: RaySpec }
  | { kind: "arc"; data: ArcSpec }
  | { kind: "angleMark"; data: AngleMark }
  | { kind: "rightAngleMark"; data: RightAngleMark };

export const DEG = Math.PI / 180;
export const RAD = 180 / Math.PI;
