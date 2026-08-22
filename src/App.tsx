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
import quad8 from "@/constructions/quad8";
import quad9 from "@/constructions/quad9";
import quad10 from "@/constructions/quad10";
import quad11 from "@/constructions/quad11";
import quad12 from "@/constructions/quad12";
import quad13 from "@/constructions/quad13";
import { useAppStore } from "@/state/appStore";

const all = [tri1, tri2, tri3, tri4, tri5, tri6, tri7, quad8, quad9, quad10, quad11, quad12, quad13];

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
