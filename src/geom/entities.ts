import type { ConstructionState } from "@/constructions/types";
import type { GeomEntity } from "./types";

export function flattenState(state: ConstructionState): GeomEntity[] {
  const out: GeomEntity[] = [];
  for (const s of state.segments) out.push({ kind: "segment", data: s });
  for (const r of state.rays) out.push({ kind: "ray", data: r });
  for (const a of state.arcs) out.push({ kind: "arc", data: a });
  for (const m of state.angleMarks) out.push({ kind: "angleMark", data: m });
  for (const rt of state.rightAngleMarks) out.push({ kind: "rightAngleMark", data: rt });
  return out;
}
