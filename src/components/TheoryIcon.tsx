// Tiny static line-sketch icons for the theory cards — just enough visual
// shorthand (tick marks, angle arcs, dashed vs solid) to recognise each
// sufficient-data case at a glance.
export type IconKind =
  | "sss"
  | "sas"
  | "asa"
  | "aas"
  | "ssa"
  | "rhs"
  | "angles-perimeter"
  | "quad-4s-diag"
  | "quad-4s-angle"
  | "quad-3s-2angle"
  | "quad-3s-2diag"
  | "quad-2s-3angle";

export function TheoryIcon({ kind }: { kind: IconKind }) {
  const stroke = "var(--ink-soft)";
  const accent = "var(--accent)";
  const tri = (a: [number, number], b: [number, number], c: [number, number]) => `M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]} Z`;

  const body = (() => {
    switch (kind) {
      case "sss":
        return (
          <>
            <path d={tri([8, 46], [50, 46], [26, 10])} fill="none" stroke={stroke} strokeWidth={2} />
            <line x1={26} y1={40} x2={30} y2={34} stroke={accent} strokeWidth={2} />
            <line x1={18} y1={30} x2={22} y2={26} stroke={accent} strokeWidth={2} />
            <line x1={36} y1={30} x2={40} y2={26} stroke={accent} strokeWidth={2} />
          </>
        );
      case "sas":
        return (
          <>
            <path d={tri([8, 46], [50, 46], [16, 12])} fill="none" stroke={stroke} strokeWidth={2} />
            <path d="M14,40 A10,10 0 0 1 18,32" fill="none" stroke={accent} strokeWidth={2} />
            <line x1={8} y1={46} x2={16} y2={12} stroke={accent} strokeWidth={2.6} />
            <line x1={8} y1={46} x2={50} y2={46} stroke={accent} strokeWidth={2.6} />
          </>
        );
      case "asa":
        return (
          <>
            <path d={tri([8, 46], [50, 46], [30, 10])} fill="none" stroke={stroke} strokeWidth={2} />
            <path d="M14,46 A8,8 0 0 1 18,39" fill="none" stroke={accent} strokeWidth={2} />
            <path d="M44,46 A8,8 0 0 0 39,39" fill="none" stroke={accent} strokeWidth={2} />
            <line x1={8} y1={46} x2={50} y2={46} stroke={accent} strokeWidth={2.6} />
          </>
        );
      case "aas":
        return (
          <>
            <path d={tri([8, 46], [50, 46], [40, 10])} fill="none" stroke={stroke} strokeWidth={2} />
            <path d="M14,46 A8,8 0 0 1 18,39" fill="none" stroke={accent} strokeWidth={2} />
            <path d="M34,17 A8,8 0 0 1 43,15" fill="none" stroke={accent} strokeWidth={2} />
            <line x1={40} y1={10} x2={50} y2={46} stroke={accent} strokeWidth={2.6} />
          </>
        );
      case "ssa":
        return (
          <>
            <path d={tri([8, 46], [46, 40], [22, 10])} fill="none" stroke={stroke} strokeWidth={2} />
            <line x1={8} y1={46} x2={22} y2={10} stroke={accent} strokeWidth={2.6} />
            <line x1={22} y1={10} x2={46} y2={40} stroke={accent} strokeWidth={2.6} />
            <path d="M10,40 A8,8 0 0 1 15,33" fill="none" stroke={accent} strokeWidth={2} />
          </>
        );
      case "rhs":
        return (
          <>
            <path d={tri([8, 46], [46, 46], [46, 10])} fill="none" stroke={stroke} strokeWidth={2} />
            <rect x={40} y={40} width={6} height={6} fill="none" stroke={stroke} strokeWidth={1.6} />
            <line x1={8} y1={46} x2={46} y2={10} stroke={accent} strokeWidth={2.6} />
            <line x1={46} y1={46} x2={46} y2={10} stroke={accent} strokeWidth={2.6} />
          </>
        );
      case "angles-perimeter":
        return (
          <>
            <path d={tri([6, 46], [50, 46], [28, 12])} fill="none" stroke={stroke} strokeWidth={2} />
            <line x1={6} y1={46} x2={50} y2={46} stroke={accent} strokeWidth={2.6} />
            <path d="M12,46 A8,8 0 0 1 16,39" fill="none" stroke={accent} strokeWidth={2} />
            <path d="M44,46 A8,8 0 0 0 39,39" fill="none" stroke={accent} strokeWidth={2} />
            <text x={28} y="55" fontSize="9" textAnchor="middle" fill={accent}>
              Σ
            </text>
          </>
        );
      case "quad-4s-diag":
        return (
          <>
            <path d="M8,20 L30,8 L50,22 L36,46 Z" fill="none" stroke={stroke} strokeWidth={2} />
            <line x1={8} y1={20} x2={50} y2={22} stroke={accent} strokeWidth={2.4} strokeDasharray="3 2" />
          </>
        );
      case "quad-4s-angle":
        return (
          <>
            <path d="M8,20 L30,8 L50,22 L36,46 Z" fill="none" stroke={stroke} strokeWidth={2} />
            <path d="M14,20 A8,8 0 0 1 18,13" fill="none" stroke={accent} strokeWidth={2} />
          </>
        );
      case "quad-3s-2angle":
        return (
          <>
            <path d="M8,22 L30,8 L50,20 L34,46 Z" fill="none" stroke={stroke} strokeWidth={2} />
            <path d="M13,21 A7,7 0 0 1 17,15" fill="none" stroke={accent} strokeWidth={2} />
            <path d="M44,20 A7,7 0 0 0 40,13" fill="none" stroke={accent} strokeWidth={2} />
          </>
        );
      case "quad-3s-2diag":
        return (
          <>
            <path d="M8,20 L30,8 L50,22 L36,46 Z" fill="none" stroke={stroke} strokeWidth={2} />
            <line x1={8} y1={20} x2={50} y2={22} stroke={accent} strokeWidth={2.2} strokeDasharray="3 2" />
            <line x1={30} y1={8} x2={36} y2={46} stroke={accent} strokeWidth={2.2} strokeDasharray="3 2" />
          </>
        );
      case "quad-2s-3angle":
        return (
          <>
            <path d="M8,22 L30,8 L50,20 L34,46 Z" fill="none" stroke={stroke} strokeWidth={2} />
            <path d="M13,21 A7,7 0 0 1 17,15" fill="none" stroke={accent} strokeWidth={2} />
            <path d="M44,20 A7,7 0 0 0 40,13" fill="none" stroke={accent} strokeWidth={2} />
            <path d="M32,44 A7,7 0 0 1 37,40" fill="none" stroke={accent} strokeWidth={2} />
          </>
        );
      default:
        return null;
    }
  })();

  return (
    <svg viewBox="0 0 58 58" width={52} height={52} className="shrink-0">
      {body}
    </svg>
  );
}
