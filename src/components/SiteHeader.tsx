import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";
import { GlobalSearchDialog } from "./GlobalSearchDialog";
import { CompletionBadgesDialog } from "./CompletionBadgesDialog";
import { useHydrated, useProgress } from "@/lib/progress";
import { totalLessons } from "@/data/course";

export function SiteHeader() {
  const hydrated = useHydrated();
  const { completed } = useProgress();
  const done = hydrated ? Object.keys(completed).length : 0;
  const pct = Math.round((done / totalLessons) * 100);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="group flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-lg leading-none"
          >
            ✦
          </span>
          <span className="font-display text-lg tracking-tight">
            Webcam <span className="text-primary">Boxing</span>
          </span>
        </Link>

        <nav className="ml-6 hidden gap-5 text-sm text-muted-foreground md:flex">
          <Link
            to="/curriculum"
            className="transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Curriculum
          </Link>
          <Link
            to="/architecture"
            className="transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Architecture
          </Link>
          <Link
            to="/glossary"
            className="transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Glossary
          </Link>
          <Link
            to="/resources"
            className="transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Resources
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <GlobalSearchDialog />
          <CompletionBadgesDialog />

          <div
            className="hidden items-center gap-2 rounded-full border border-border/80 bg-muted/30 px-2.5 py-1 sm:flex"
            aria-label={`${done} of ${totalLessons} lessons complete (${pct}%)`}
            title={`${done} of ${totalLessons} lessons complete (${pct}%)`}
          >
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="tabular-nums text-[11px] font-medium text-muted-foreground">
              <span className="text-foreground">{done}</span>/{totalLessons}
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>
      <div className="h-[2px] w-full bg-border/40">
        <div
          className="h-full bg-primary shadow-[0_0_8px_rgba(220,38,38,0.6)] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </header>
  );
}
