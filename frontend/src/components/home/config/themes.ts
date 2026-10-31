export type ThemeId = "teal" | "indigo" | "violet" | "rose" | "amber";

export const THEMES: { id: ThemeId; label: string; color: string }[] = [
  { id: "teal", label: "Teal", color: "#14b8a6" },
  { id: "indigo", label: "Indigo", color: "#6366f1" },
  { id: "violet", label: "Violet", color: "#8b5cf6" },
  { id: "rose", label: "Rose", color: "#f43f5e" },
  { id: "amber", label: "Amber", color: "#f59e0b" },
];

const STORAGE_KEY = "ace-theme";

export function getSavedTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEMES.some((theme) => theme.id === saved)) {
      return saved as ThemeId;
    }
  } catch {
    // storage unavailable, fall back to default
  }
  return "teal";
}

export function applyTheme(id: ThemeId) {
  document.documentElement.setAttribute("data-theme", id);
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // ignore
  }
}
