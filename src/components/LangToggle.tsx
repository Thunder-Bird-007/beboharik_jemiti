import { useAppStore } from "@/state/appStore";

export function LangToggle() {
  const lang = useAppStore((s) => s.lang);
  const toggleLang = useAppStore((s) => s.toggleLang);
  return (
    <button
      onClick={toggleLang}
      className="px-3 h-8 rounded-full text-[12.5px] font-medium hover:opacity-80"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)", color: "var(--ink)" }}
      title="Toggle language"
    >
      {lang === "bn" ? "বাংলা" : "English"}
    </button>
  );
}
