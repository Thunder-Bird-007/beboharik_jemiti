interface GridBackgroundProps {
  viewW: number;
  viewH: number;
  spacingPx: number;
}

export function GridBackground({ viewW, viewH, spacingPx }: GridBackgroundProps) {
  if (spacingPx < 4) return null;
  const vLines = [];
  const hLines = [];
  for (let x = 0; x <= viewW; x += spacingPx) {
    vLines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={viewH} stroke="var(--grid-line)" strokeWidth={1} />);
  }
  for (let y = 0; y <= viewH; y += spacingPx) {
    hLines.push(<line key={`h${y}`} x1={0} y1={y} x2={viewW} y2={y} stroke="var(--grid-line)" strokeWidth={1} />);
  }
  return (
    <g opacity={0.55}>
      {vLines}
      {hLines}
    </g>
  );
}
