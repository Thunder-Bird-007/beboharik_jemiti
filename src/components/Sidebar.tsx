import { NavLink } from "react-router-dom";
import { T01_CONSTRUCTIONS, T02_CONSTRUCTIONS } from "@/constructions/index";
import { pathFor } from "@/constructions/registry";
import { useAppStore } from "@/state/appStore";

const linkBase = "block text-[13px] px-3 py-1.5 rounded-lg leading-snug transition-colors";

function stripLeadingNumber(text: string): string {
  return text.replace(/^[\d০-৯]+[।.]\s*/, "");
}

function activeStyle(isActive: boolean) {
  return {
    background: isActive ? "var(--accent-soft)" : "transparent",
    color: isActive ? "var(--accent)" : "var(--ink-soft)",
    fontWeight: isActive ? 600 : 500,
  };
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const lang = useAppStore((s) => s.lang);
  return (
    <nav className="flex flex-col gap-4 h-full overflow-y-auto scrollbar-thin pr-1" onClick={onNavigate}>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide px-3 mb-1" style={{ color: "var(--muted)" }}>
          {lang === "bn" ? "T-01 · ত্রিভুজ" : "T-01 · Triangles"}
        </p>
        <NavLink to="/theory/t01" className={linkBase} style={({ isActive }) => activeStyle(isActive)}>
          📘 {lang === "bn" ? "তত্ত্ব" : "Theory"}
        </NavLink>
        {T01_CONSTRUCTIONS.map((m) => (
          <NavLink key={m.id} to={pathFor(m.id)} className={linkBase} style={({ isActive }) => activeStyle(isActive)}>
            {m.index}. {stripLeadingNumber(lang === "bn" ? m.title.bn : m.title.en)}
          </NavLink>
        ))}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide px-3 mb-1" style={{ color: "var(--muted)" }}>
          {lang === "bn" ? "T-02 · চতুর্ভুজ" : "T-02 · Quadrilaterals"}
        </p>
        <NavLink to="/theory/t02" className={linkBase} style={({ isActive }) => activeStyle(isActive)}>
          📘 {lang === "bn" ? "তত্ত্ব" : "Theory"}
        </NavLink>
        {T02_CONSTRUCTIONS.map((m) => (
          <NavLink key={m.id} to={pathFor(m.id)} className={linkBase} style={({ isActive }) => activeStyle(isActive)}>
            {m.index}. {stripLeadingNumber(lang === "bn" ? m.title.bn : m.title.en)}
          </NavLink>
        ))}
      </div>
      <div>
        <NavLink to="/quiz" className={linkBase} style={({ isActive }) => activeStyle(isActive)}>
          📝 {lang === "bn" ? "কুইজ" : "Quiz"}
        </NavLink>
      </div>
    </nav>
  );
}
