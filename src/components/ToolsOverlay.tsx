import type { ToolAnim } from "@/constructions/types";
import { sweepShortest } from "@/geom/core";
import { toPx, type Transform } from "@/geom/render";
import { ToolCompass } from "./ToolCompass";
import { ToolProtractor } from "./ToolProtractor";
import { ToolRuler } from "./ToolRuler";

interface ToolsOverlayProps {
  anim: ToolAnim;
  t: number;
  transform: Transform;
  lang: "bn" | "en";
  visible: boolean;
  locked?: boolean;
}

const toScreenAngle = (mathDeg: number) => ((-mathDeg % 360) + 360) % 360;

export function ToolsOverlay({ anim, t, transform, lang, visible, locked }: ToolsOverlayProps) {
  if (!visible || anim.tool === "none" || anim.tool === "pencil") return null;

  if (anim.tool === "ruler") {
    const fromPx = toPx(anim.from, transform);
    const toPxPt = toPx(anim.to, transform);
    return <ToolRuler fromPx={fromPx} toPx={toPxPt} scalePxPerCm={transform.scale} t={t} />;
  }

  if (anim.tool === "compass") {
    const centerPx = toPx(anim.center, transform);
    const radiusPx = anim.radius * transform.scale;
    const startScreen = toScreenAngle(anim.startAngle);
    const sweep = -(anim.endAngle - anim.startAngle); // flip: screen sweep is negated math sweep
    return (
      <ToolCompass
        centerPx={centerPx}
        radiusPx={radiusPx}
        radiusCm={anim.radius}
        startAngle={startScreen}
        endAngle={startScreen + sweep}
        t={t}
        lang={lang}
        radiusLabel={anim.radiusLabel}
        locked={locked}
      />
    );
  }

  if (anim.tool === "protractor") {
    const vertexPx = toPx(anim.vertex, transform);
    const baseScreen = toScreenAngle(anim.baseAngle);
    const sweep = -sweepShortest(anim.baseAngle, anim.targetAngle);
    return (
      <ToolProtractor
        vertexPx={vertexPx}
        baseAngleScreen={baseScreen}
        targetAngleScreen={baseScreen + sweep}
        radiusPx={1.15 * transform.scale}
        t={t}
        lang={lang}
      />
    );
  }

  return null;
}
