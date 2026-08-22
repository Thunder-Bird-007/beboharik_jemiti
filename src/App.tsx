import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { ConstructionPage } from "@/pages/ConstructionPage";
import tri1 from "@/constructions/tri1";
import tri2 from "@/constructions/tri2";
import tri3 from "@/constructions/tri3";
import tri4 from "@/constructions/tri4";
import tri5 from "@/constructions/tri5";
import tri6 from "@/constructions/tri6";
import tri7 from "@/constructions/tri7";
import { useAppStore } from "@/state/appStore";

const all = [tri1, tri2, tri3, tri4, tri5, tri6, tri7];

export default function App() {
  const theme = useAppStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <HashRouter>
      <div className="h-screen p-4 box-border" style={{ background: "var(--bg)" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/c/tri-1" replace />} />
          {all.map((m) => (
            <Route key={m.id} path={`/c/${m.id}`} element={<ConstructionPage meta={m} />} />
          ))}
        </Routes>
      </div>
    </HashRouter>
  );
}
