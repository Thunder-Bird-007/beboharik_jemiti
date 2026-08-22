import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "bn" | "en";
export type Theme = "light" | "dark";

interface AppState {
  lang: Lang;
  theme: Theme;
  presentation: boolean;
  toolsVisible: boolean;
  verifyMode: boolean;
  showBoardTags: boolean;
  toggleLang: () => void;
  toggleTheme: () => void;
  togglePresentation: () => void;
  setPresentation: (v: boolean) => void;
  toggleTools: () => void;
  toggleVerify: () => void;
  toggleBoardTags: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lang: "bn",
      theme: "light",
      presentation: false,
      toolsVisible: true,
      verifyMode: false,
      showBoardTags: true,
      toggleLang: () => set((s) => ({ lang: s.lang === "bn" ? "en" : "bn" })),
      toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      togglePresentation: () => set((s) => ({ presentation: !s.presentation })),
      setPresentation: (v) => set({ presentation: v }),
      toggleTools: () => set((s) => ({ toolsVisible: !s.toolsVisible })),
      toggleVerify: () => set((s) => ({ verifyMode: !s.verifyMode })),
      toggleBoardTags: () => set((s) => ({ showBoardTags: !s.showBoardTags })),
    }),
    { name: "geometry-studio-prefs" }
  )
);
