import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { ConstructionPage } from "@/pages/ConstructionPage";
import tri1 from "@/constructions/tri1";
import { useAppStore } from "@/state/appStore";

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
          <Route path="/c/tri-1" element={<ConstructionPage meta={tri1} />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
