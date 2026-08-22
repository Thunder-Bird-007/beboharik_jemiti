// Maps math-space (y-up, centimetres) geometry to SVG pixel space (y-down),
// auto-fitting a bounding box while keeping a single, constant px-per-cm
// scale so ruler/compass tick marks stay meaningful.
import type { ConstructionState } from "@/constructions/types";
import type { Point } from "./types";

export interface Transform {
  scale: number; // px per cm
  ox: number; // px x of math-origin (0,0)
  oy: number; // px y of math-origin (0,0)
}

export function toPx(p: Point, t: Transform): { x: number; y: number } {
  return { x: t.ox + p.x * t.scale, y: t.oy - p.y * t.scale };
}

export function toPxXY(x: number, y: number, t: Transform): { x: number; y: number } {
  return { x: t.ox + x * t.scale, y: t.oy - y * t.scale };
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export function computeBounds(state: ConstructionState): Bounds {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const consider = (x: number, y: number) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  };
  for (const p of Object.values(state.pts)) consider(p.x, p.y);
  for (const s of state.segments) {
    consider(s.a.x, s.a.y);
    consider(s.b.x, s.b.y);
  }
  for (const r of state.rays) {
    consider(r.origin.x, r.origin.y);
    const dx = r.through.x - r.origin.x;
    const dy = r.through.y - r.origin.y;
    const len = Math.hypot(dx, dy) || 1;
    consider(r.origin.x + (dx / len) * r.length, r.origin.y + (dy / len) * r.length);
  }
  for (const a of state.arcs) {
    consider(a.center.x - a.radius, a.center.y - a.radius);
    consider(a.center.x + a.radius, a.center.y + a.radius);
  }
  if (!isFinite(minX)) {
    return { minX: 0, maxX: 10, minY: 0, maxY: 10 };
  }
  return { minX, maxX, minY, maxY };
}

function unit(x: number, y: number): { x: number; y: number } {
  const m = Math.hypot(x, y) || 1;
  return { x: x / m, y: y / m };
}

/** For each named point, a unit direction (math-space) pointing "outward" — away
 * from the average direction of segments/rays touching it — so labels avoid the
 * figure. Points with no connections default to up-right. */
export function computeLabelOffsets(state: ConstructionState): Record<string, { dx: number; dy: number }> {
  const offsets: Record<string, { dx: number; dy: number }> = {};
  for (const p of Object.values(state.pts)) {
    const dirs: { x: number; y: number }[] = [];
    for (const s of state.segments) {
      if (s.a.id === p.id) dirs.push(unit(s.b.x - s.a.x, s.b.y - s.a.y));
      if (s.b.id === p.id) dirs.push(unit(s.a.x - s.b.x, s.a.y - s.b.y));
    }
    for (const r of state.rays) {
      if (r.origin.id === p.id) dirs.push(unit(r.through.x - r.origin.x, r.through.y - r.origin.y));
    }
    let sx = 0;
    let sy = 0;
    for (const d of dirs) {
      sx += d.x;
      sy += d.y;
    }
    let ox = -sx;
    let oy = -sy;
    const mag = Math.hypot(ox, oy);
    if (mag < 1e-6) {
      ox = 0.4;
      oy = 0.6;
    } else {
      ox /= mag;
      oy /= mag;
    }
    offsets[p.id] = { dx: ox, dy: oy };
  }
  return offsets;
}

export function fitTransform(bounds: Bounds, viewW: number, viewH: number, maxScale: number, padding = 60): Transform {
  const w = Math.max(0.5, bounds.maxX - bounds.minX);
  const h = Math.max(0.5, bounds.maxY - bounds.minY);
  const availW = viewW - padding * 2;
  const availH = viewH - padding * 2;
  const scale = Math.min(maxScale, availW / w, availH / h);
  const cx = (bounds.minX + bounds.maxX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;
  const ox = viewW / 2 - cx * scale;
  const oy = viewH / 2 + cy * scale;
  return { scale, ox, oy };
}
