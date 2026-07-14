/**
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind.
 */

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useHydrated, useProgress } from "@/lib/progress";

export function ThemeToggle() {
  const hydrated = useHydrated();
  const { theme, setTheme } = useProgress();

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme, hydrated]);

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {hydrated && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
