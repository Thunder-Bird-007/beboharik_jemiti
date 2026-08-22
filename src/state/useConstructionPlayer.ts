import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ConstructionMeta } from "@/constructions/types";
import { runSteps } from "@/constructions/runner";

const BASE_DURATION_MS = 900;

export interface PlayerApi {
  /** index of the step currently animating / last completed, -1 = nothing yet */
  currentStep: number;
  /** 0..1 progress of the currently-animating step (1 = fully drawn) */
  progress: number;
  playing: boolean;
  speed: number;
  totalSteps: number;
  isDone: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  restart: () => void;
  jumpTo: (index: number) => void;
  jumpToEnd: () => void;
  setSpeed: (s: number) => void;
}

export function useConstructionPlayer(meta: ConstructionMeta): PlayerApi {
  const totalSteps = meta.steps.length;
  const [currentStep, setCurrentStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [autoContinue, setAutoContinue] = useState(true);

  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number | null>(null);

  // Reset playback whenever the construction identity changes (inputs changing
  // should NOT reset — caller decides whether to replay; but switching problems does).
  useEffect(() => {
    setCurrentStep(-1);
    setProgress(0);
    setPlaying(false);
    startTsRef.current = null;
  }, [meta.id]);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startTsRef.current = null;
  }, []);

  // The RAF animation loop: drives `progress` from 0 -> 1 for the step at
  // (currentStep + 1) [the step about to be revealed], then commits it.
  useEffect(() => {
    if (!playing) {
      stopRaf();
      return;
    }
    // Mutable across ticks within this single effect run — recomputed from
    // React state only when the effect restarts, so the loop can advance
    // through multiple steps without needing a stale closure value.
    let targetIndex = currentStep + 1;
    if (targetIndex >= totalSteps) {
      setPlaying(false);
      return;
    }
    const duration = BASE_DURATION_MS / speed;

    const tick = (ts: number) => {
      if (startTsRef.current === null) startTsRef.current = ts;
      const elapsed = ts - startTsRef.current;
      const t = Math.min(1, elapsed / duration);
      setProgress(t);
      if (t >= 1) {
        stopRaf();
        setCurrentStep(targetIndex);
        setProgress(0);
        if (!autoContinue) {
          setPlaying(false);
          setAutoContinue(true);
        } else if (targetIndex + 1 >= totalSteps) {
          setPlaying(false);
        } else {
          targetIndex += 1;
          startTsRef.current = null;
          rafRef.current = requestAnimationFrame(tick);
        }
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return stopRaf;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, speed]);

  const play = useCallback(() => {
    if (currentStep + 1 >= totalSteps) return;
    setAutoContinue(true);
    setPlaying(true);
  }, [currentStep, totalSteps]);

  const pause = useCallback(() => {
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    setPlaying((p) => {
      if (p) return false;
      if (currentStep + 1 >= totalSteps) return false;
      setAutoContinue(true);
      return true;
    });
  }, [currentStep, totalSteps]);

  const next = useCallback(() => {
    stopRaf();
    setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
    setProgress(0);
    setPlaying(false);
  }, [stopRaf, totalSteps]);

  const prev = useCallback(() => {
    stopRaf();
    setCurrentStep((prev) => Math.max(-1, prev - 1));
    setProgress(0);
    setPlaying(false);
  }, [stopRaf]);

  const restart = useCallback(() => {
    stopRaf();
    setCurrentStep(-1);
    setProgress(0);
    setPlaying(false);
  }, [stopRaf]);

  const jumpTo = useCallback(
    (index: number) => {
      stopRaf();
      const clamped = Math.max(0, Math.min(totalSteps - 1, index));
      setCurrentStep(clamped - 1);
      setProgress(0);
      setAutoContinue(false);
      setPlaying(true);
    },
    [stopRaf, totalSteps]
  );

  const jumpToEnd = useCallback(() => {
    stopRaf();
    setCurrentStep(totalSteps - 1);
    setProgress(0);
    setPlaying(false);
  }, [stopRaf, totalSteps]);

  const isDone = currentStep >= totalSteps - 1 && progress === 0;

  return {
    currentStep,
    progress,
    playing,
    speed,
    totalSteps,
    isDone,
    play,
    pause,
    toggle,
    next,
    prev,
    restart,
    jumpTo,
    jumpToEnd,
    setSpeed,
  };
}

/** Convenience: compute the fully-accumulated geometry state up to (not including)
 * currentStep+1, i.e. everything finished so far, given the player's currentStep. */
export function useAccumulatedState(meta: ConstructionMeta, inputs: Record<string, number>, upToStepInclusive: number) {
  return useMemo(() => runSteps(meta.steps, inputs, upToStepInclusive), [meta, inputs, upToStepInclusive]);
}
