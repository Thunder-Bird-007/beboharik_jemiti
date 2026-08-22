const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBnDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

function trimNum(v: number): string {
  const r = Math.round(v * 100) / 100;
  return Number.isInteger(r) ? String(r) : r.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function fmtCm(v: number, lang: "bn" | "en"): string {
  const s = trimNum(v);
  return lang === "bn" ? `${toBnDigits(s)} সেমি` : `${s} cm`;
}

export function fmtDeg(v: number, lang: "bn" | "en"): string {
  const s = trimNum(v);
  return lang === "bn" ? `${toBnDigits(s)}°` : `${s}°`;
}

export function fmtNum(v: number, lang: "bn" | "en"): string {
  const s = trimNum(v);
  return lang === "bn" ? toBnDigits(s) : s;
}
