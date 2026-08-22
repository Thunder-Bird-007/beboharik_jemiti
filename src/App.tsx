import { useEffect, useState, type ReactNode } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { ConstructionPage } from "@/pages/ConstructionPage";
import TriangleTheory from "@/pages/TriangleTheory";
import QuadTheory from "@/pages/QuadTheory";
import Quiz from "@/pages/Quiz";
import { ALL_CONSTRUCTIONS } from "@/constructions/index";
import { getConstruction } from "@/constructions/registry";
import { Sidebar } from "@/components/Sidebar";
import { LangToggle } from "@/components/LangToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAppStore } from "@/state/appStore";

function ConstructionRoute() {
  const { id } = useParams();
  const meta = id ? getConstruction(id) : undefined;
  if (!meta) return <Navigate to="/c/tri-1" replace />;
  return <ConstructionPage meta={meta} />;
}

function Shell({ children }: { children: ReactNode }) {
  const lang = useAppStore((s) => s.lang);
  const presentation = useAppStore((s) => s.presentation);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileNavOpen(false), [location.pathname]);

  if (presentation) return <>{children}</>;

  return (
    <div className="h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <header
        className="h-14 shrink-0 flex items-center gap-3 px-4 border-b"
        style={{ borderColor: "var(--panel-border)", background: "var(--bg-elevated)" }}
      >
        <button
          className="lg:hidden w-8 h-8 rounded-md flex items-center justify-center"
          style={{ border: "1px solid var(--panel-border)", color: "var(--ink)" }}
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-label="menu"
        >
          ☰
        </button>
        <h1 className="text-[15px] font-bold truncate" style={{ color: "var(--ink)" }}>
          {lang === "bn" ? "ব্যবহারিক জ্যামিতি স্টুডিও" : "Practical Geometry Studio"}
        </h1>
        <span className="text-[11px] px-2 py-0.5 rounded-full hidden sm:inline" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
          SSC 2027 · Ch-07 · M-08
        </span>
        <div className="ml-auto flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
        </div>
      </header>
      <div className="flex-1 min-h-0 flex">
        <aside
          className="hidden lg:block w-64 shrink-0 border-r p-3"
          style={{ borderColor: "var(--panel-border)", background: "var(--bg-elevated)" }}
        >
          <Sidebar />
        </aside>
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="w-72 p-3 h-full overflow-y-auto" style={{ background: "var(--bg-elevated)" }}>
              <Sidebar onNavigate={() => setMobileNavOpen(false)} />
            </div>
            <div className="flex-1" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setMobileNavOpen(false)} />
          </div>
        )}
        <main className="flex-1 min-h-0 overflow-y-auto scrollbar-thin p-4">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  const theme = useAppStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <HashRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Navigate to="/c/tri-1" replace />} />
          <Route path="/c/:id" element={<ConstructionRoute />} />
          <Route path="/theory/t01" element={<TriangleTheory />} />
          <Route path="/theory/t02" element={<QuadTheory />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="*" element={<Navigate to="/c/tri-1" replace />} />
        </Routes>
      </Shell>
    </HashRouter>
  );
}

// touch every construction module so it registers even if no route to it
// has been visited yet (sidebar links, breadcrumbs, etc. rely on this)
void ALL_CONSTRUCTIONS;
