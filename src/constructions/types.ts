// The "Step system": every construction problem is authored as an ordered
// array of Step objects. Each step is a pure function of prior state +
// current numeric inputs, so changing an input (perimeter 12 -> 14 cm)
// regenerates a correct new drawing automatically.
import type { AngleMark, ArcSpec, GeomEntity, Point, RaySpec, RightAngleMark, Segment } from "@/geom/types";

export interface ConstructionState {
  /** Named points accumulated so far, keyed by the label used in the lecture (D, E, L, A...). */
  pts: Record<string, Point>;
  segments: Segment[];
  rays: RaySpec[];
  arcs: ArcSpec[];
  angleMarks: AngleMark[];
  rightAngleMarks: RightAngleMark[];
}

export function emptyState(): ConstructionState {
  return { pts: {}, segments: [], rays: [], arcs: [], angleMarks: [], rightAngleMarks: [] };
}

export type ToolKind = "ruler" | "compass" | "protractor" | "pencil" | "none";

export type ToolAnim =
  | { tool: "ruler"; from: Point; to: Point }
  | {
      tool: "compass";
      center: Point;
      radius: number;
      startAngle: number;
      endAngle: number;
      full?: boolean;
      radiusLabel?: string;
    }
  | { tool: "protractor"; vertex: Point; baseAngle: number; targetAngle: number; sweepFromAngle?: number; label?: string }
  | { tool: "pencil"; at: Point }
  | { tool: "none" };

export interface StepResult {
  /** New named points to merge into state.pts (keyed by label used going forward). */
  namedPoints?: Record<string, Point>;
  entities: GeomEntity[];
  toolAnim: ToolAnim;
}

export interface BilingualText {
  bn: string;
  en: string;
}

export interface Step {
  id: string;
  title: BilingualText;
  narration: BilingualText;
  tool: ToolKind;
  action:
    | "drawRay"
    | "markLength"
    | "drawArc"
    | "bisectAngle"
    | "drawAngle"
    | "joinPoints"
    | "extendRay"
    | "dropPerpendicular"
    | "markPoint"
    | "info";
  /** Optional highlighted caution shown while this step plays. */
  caution?: BilingualText;
  /** id of the earlier step this step's compass radius reuses (drives the "radius unchanged" badge). */
  radiusLockRef?: string;
  compute(state: ConstructionState, inputs: Record<string, number>): StepResult;
}

export interface NumericInputSpec {
  key: string;
  label: BilingualText;
  unit: "cm" | "deg";
  defaultValue: number;
  min: number;
  max: number;
  step: number;
}

export interface ConstructionMeta {
  id: string;
  index: number;
  topic: "T01" | "T02";
  title: BilingualText;
  boardTags?: string;
  /** given-data restatement, computed from current inputs so it stays accurate when the user edits them */
  givenSummary: (inputs: Record<string, number>) => BilingualText;
  inputs: NumericInputSpec[];
  /** Optional validation; returns an error message (bn/en) if inputs are geometrically invalid. */
  validate?: (inputs: Record<string, number>) => BilingualText | null;
  steps: Step[];
  /** cm -> px scale suggested for this construction's canvas. */
  scale?: number;
  /** id of another construction whose output feeds this one's given data. */
  derivedFrom?: string;
}
