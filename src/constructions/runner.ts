import { emptyState, type ConstructionState, type Step, type StepResult } from "./types";

export interface RunResult {
  state: ConstructionState;
  /** the StepResult produced by each step 0..upTo (inclusive), aligned by index */
  results: StepResult[];
}

/** Replay steps [0, upToIndex] (inclusive) and return the fully accumulated state. */
export function runSteps(steps: Step[], inputs: Record<string, number>, upToIndex: number): RunResult {
  const state: ConstructionState = emptyState();
  const results: StepResult[] = [];
  const last = Math.min(upToIndex, steps.length - 1);
  for (let i = 0; i <= last; i++) {
    const res = steps[i].compute(state, inputs);
    if (res.namedPoints) Object.assign(state.pts, res.namedPoints);
    for (const ent of res.entities) {
      switch (ent.kind) {
        case "point":
          break; // points are tracked via namedPoints / pts, not a separate list
        case "segment":
          state.segments.push(ent.data);
          break;
        case "ray":
          state.rays.push(ent.data);
          break;
        case "arc":
          state.arcs.push(ent.data);
          break;
        case "angleMark":
          state.angleMarks.push(ent.data);
          break;
        case "rightAngleMark":
          state.rightAngleMarks.push(ent.data);
          break;
      }
    }
    results.push(res);
  }
  return { state, results };
}

/** All points ever named, up to and including a step (for rendering point dots + labels). */
export function pointsUpTo(steps: Step[], inputs: Record<string, number>, upToIndex: number): Record<string, import("@/geom/types").Point> {
  return runSteps(steps, inputs, upToIndex).state.pts;
}
