import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useHydrated, useProgress } from "@/lib/progress";

export function ThemeToggle() {
  const hydrated = useHydrated();
  const { theme, setTheme } = useProgress();

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme, hydrated]);

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-accent"
    >
      {hydrated && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}