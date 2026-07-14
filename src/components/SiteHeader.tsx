import { Link } from "@tanstack/react-router";
import { GlobalSearchDialog } from "./GlobalSearchDialog";
import { CompletionBadgesDialog } from "./CompletionBadgesDialog";
import { SettingsDialog } from "./SettingsDialog";
import { ResumeLearningButton } from "./ResumeLearningButton";
import { useHydrated, useProgress } from "@/lib/progress";
import { totalLessons } from "@/data/course";

export function SiteHeader() {
  const hydrated = useHydrated();
  const { completed } = useProgress();
  const done = hydrated ? Object.keys(completed).length : 0;
  const pct = Math.round((done / totalLessons) * 100);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:py-3">
        <div className="flex items-center gap-6 min-w-0">
          <Link to="/" className="group flex items-center gap-2.5 shrink-0">
            <img
              src="/icon-192.png"
              alt="Boxing glove logo"
              className="h-7 w-7 object-contain transition-transform duration-200 group-hover:scale-110"
            />
            <span className="font-display text-base font-bold tracking-tight text-foreground">
              Webcam<span className="text-primary">Boxing</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-5 text-xs font-semibold text-muted-foreground md:flex">
            <Link
              to="/curriculum"
              className="transition-colors hover:text-foreground"
              activeProps={{ className: "text-primary font-bold" }}
            >
              Curriculum
            </Link>
            <Link
              to="/architecture"
              className="transition-colors hover:text-foreground"
              activeProps={{ className: "text-primary font-bold" }}
            >
              Architecture
            </Link>
            <Link
              to="/glossary"
              className="transition-colors hover:text-foreground"
              activeProps={{ className: "text-primary font-bold" }}
            >
              Glossary
            </Link>
            <Link
              to="/resources"
              className="transition-colors hover:text-foreground"
              activeProps={{ className: "text-primary font-bold" }}
            >
              Resources
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ResumeLearningButton variant="header" />
          <GlobalSearchDialog />
          <CompletionBadgesDialog />
          <SettingsDialog />
        </div>
      </div>

      <div
        className="h-[2px] w-full bg-border/30"
        title={`${done} of ${totalLessons} lessons completed (${pct}%)`}
      >
        <div
          className="h-full bg-primary shadow-[0_0_8px_rgba(220,38,38,0.6)] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </header>
  );
}
