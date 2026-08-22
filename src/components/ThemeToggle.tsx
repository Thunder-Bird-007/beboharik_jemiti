import { useAppStore } from "@/state/appStore";

export function ThemeToggle() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)", color: "var(--ink)" }}
      title="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
