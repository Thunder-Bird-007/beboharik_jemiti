import { useMemo } from "react";
import type { ConstructionMeta, ConstructionState } from "@/constructions/types";
import { runSteps } from "@/constructions/runner";
import { flattenState } from "@/geom/entities";
import { computeBounds, computeLabelOffsets, fitTransform } from "@/geom/render";
import type { PlayerApi } from "@/state/useConstructionPlayer";
import { EntityLayer } from "./EntityLayer";
import { GridBackground } from "./GridBackground";
import { PointsLayer } from "./PointsLayer";
import { ToolsOverlay } from "./ToolsOverlay";

const VIEW_W = 1000;
const VIEW_H = 600;

interface CanvasProps {
  meta: ConstructionMeta;
  inputs: Record<string, number>;
  player: PlayerApi;
  lang: "bn" | "en";
  showTools: boolean;
  verifyMode: boolean;
}

export function Canvas({ meta, inputs, player, lang, showTools, verifyMode }: CanvasProps) {
  const totalSteps = meta.steps.length;
  const inputsKey = useMemo(() => JSON.stringify(inputs), [inputs]);

  const fullRun = useMemo(() => runSteps(meta.steps, inputs, totalSteps - 1), [meta, inputsKey, totalSteps]); // eslint-disable-line react-hooks/exhaustive-deps
  const settledRun = useMemo(() => runSteps(meta.steps, inputs, player.currentStep), [meta, inputsKey, player.currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeIndex = player.currentStep + 1;
  const hasActive = activeIndex < totalSteps;
  const clampedActiveIndex = Math.min(activeIndex, totalSteps - 1);
  const activeRun = useMemo(() => runSteps(meta.steps, inputs, clampedActiveIndex), [meta, inputsKey, clampedActiveIndex]); // eslint-disable-line react-hooks/exhaustive-deps
  const activeResult = hasActive ? activeRun.results[activeRun.results.length - 1] : null;

  const transform = useMemo(() => {
    const bounds = computeBounds(fullRun.state);
    return fitTransform(bounds, VIEW_W, VIEW_H, meta.scale ?? 46, 80);
  }, [fullRun, meta.scale]);

  const offsetSourceState: ConstructionState = useMemo(() => {
    if (!hasActive || !activeResult) return settledRun.state;
    const segments = [...settledRun.state.segments];
    const rays = [...settledRun.state.rays];
    for (const e of activeResult.entities) {
      if (e.kind === "segment") segments.push(e.data);
      if (e.kind === "ray") rays.push(e.data);
    }
    return {
      pts: { ...settledRun.state.pts, ...(activeResult.namedPoints ?? {}) },
      segments,
      rays,
      arcs: settledRun.state.arcs,
      angleMarks: settledRun.state.angleMarks,
      rightAngleMarks: settledRun.state.rightAngleMarks,
    };
  }, [settledRun, hasActive, activeResult]);

  const labelOffsets = useMemo(() => computeLabelOffsets(offsetSourceState), [offsetSourceState]);

  const complete = player.currentStep === totalSteps - 1;
  const verifyActive = verifyMode && complete;

  const settledEntities = useMemo(() => flattenState(settledRun.state), [settledRun]);
  const activeEntities = activeResult?.entities ?? [];
  const activePoints = hasActive && player.progress >= 0.85 ? Object.values(activeResult?.namedPoints ?? {}) : [];
  const freshIds = new Set(activePoints.map((p) => p.id));

  const activeStep = hasActive ? meta.steps[activeIndex] : null;
  const locked = !!activeStep?.radiusLockRef;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="w-full h-full select-none"
      style={{ background: "var(--bg-elevated)" }}
      role="img"
      aria-label={lang === "bn" ? meta.title.bn : meta.title.en}
    >
      <GridBackground viewW={VIEW_W} viewH={VIEW_H} spacingPx={transform.scale} />
      <EntityLayer entities={settledEntities} transform={transform} verifyActive={verifyActive} />
      <EntityLayer entities={activeEntities} transform={transform} revealT={player.progress} verifyActive={verifyActive} />
      <PointsLayer points={Object.values(settledRun.state.pts)} offsets={labelOffsets} transform={transform} lang={lang} />
      <PointsLayer points={activePoints} offsets={labelOffsets} transform={transform} lang={lang} freshIds={freshIds} color="var(--accent)" />
      {showTools && hasActive && activeStep && (
        <ToolsOverlay anim={activeResult!.toolAnim} t={player.progress} transform={transform} lang={lang} visible={showTools} locked={locked} />
      )}
    </svg>
  );
}
