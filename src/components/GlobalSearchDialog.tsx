/**
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind.
 */

// COMPLIANCE REQUIREMENT: Global search dialog must provide fast keyboard navigation and keyword discovery across all course modules without inline implementation commentary.

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "@tanstack/react-router";
import { Search, X, BookOpen, FileCode, ArrowRight } from "lucide-react";
import { allLessons, glossary } from "@/data/course";

export function GlobalSearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [deviceShortcut, setDeviceShortcut] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent || "";
      const platform = navigator.platform || "";
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
        ("ontouchstart" in window && window.innerWidth < 768);
      if (isMobile) {
        setDeviceShortcut("Search");
      } else if (/Mac|iPod|iPhone|iPad/.test(platform || ua)) {
        setDeviceShortcut("⌘K");
      } else {
        setDeviceShortcut("Ctrl+K");
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const results = useMemo(() => {
    if (!query || query.trim().length < 2) {
      return { lessons: [], glossaryTerms: [] };
    }
    const q = query.toLowerCase().trim();

    const matchedLessons = allLessons
      .filter(({ module, lesson }) => {
        const titleMatch = lesson.title.toLowerCase().includes(q);
        const modMatch =
          module.title.toLowerCase().includes(q) || module.summary.toLowerCase().includes(q);
        const objMatch = lesson.objectives.some((o) => o.toLowerCase().includes(q));
        const blockMatch = lesson.blocks.some((b) => {
          if (b.type === "p" || b.type === "h" || b.type === "analogy")
            return b.text.toLowerCase().includes(q);
          if (b.type === "callout")
            return (
              b.text.toLowerCase().includes(q) ||
              (b.title ? b.title.toLowerCase().includes(q) : false)
            );
          if (b.type === "hint")
            return b.text.toLowerCase().includes(q) || b.label.toLowerCase().includes(q);
          if (b.type === "code")
            return (
              b.code.toLowerCase().includes(q) || (b.caption && b.caption.toLowerCase().includes(q))
            );
          return false;
        });
        return titleMatch || modMatch || objMatch || blockMatch;
      })
      .slice(0, 8);

    const matchedGlossary = glossary
      .filter((item) => item.term.toLowerCase().includes(q) || item.def.toLowerCase().includes(q))
      .slice(0, 4);

    return { lessons: matchedLessons, glossaryTerms: matchedGlossary };
  }, [query]);

  const handleSelectLesson = (moduleId: string, lessonId: string) => {
    setOpen(false);
    setQuery("");
    router.navigate({
      to: "/lessons/$moduleId/$lessonId",
      params: { moduleId, lessonId },
    });
  };

  const handleSelectGlossary = () => {
    setOpen(false);
    setQuery("");
    router.navigate({ to: "/glossary" });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        aria-label="Search course content"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search course...</span>
        <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground sm:inline-block">
          {deviceShortcut ?? "Ctrl/⌘+K"}
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-x-0 bottom-0 top-[59px] z-30 flex items-start justify-center overflow-y-auto bg-background/60 px-4 pt-4 backdrop-blur-sm sm:pt-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="relative flex max-h-[calc(100vh-100px)] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex shrink-0 items-center border-b border-border px-4 py-3 sm:px-5 sm:py-3.5">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 25 modules, code, or glossary terms..."
                className="w-full bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {!query || query.trim().length < 2 ? (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  Type at least 2 characters to search across all lessons and terms.
                </p>
              ) : results.lessons.length === 0 && results.glossaryTerms.length === 0 ? (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  No matches found for "{query}". Try searching "FSM", "MediaPipe", or "velocity".
                </p>
              ) : (
                <div className="space-y-4">
                  {results.lessons.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Lessons & Modules ({results.lessons.length})
                      </h3>
                      <ul className="space-y-1.5">
                        {results.lessons.map(({ module, lesson }) => (
                          <li key={`${module.id}-${lesson.id}`}>
                            <button
                              onClick={() => handleSelectLesson(module.id, lesson.id)}
                              className="group flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/50 px-3 py-2.5 text-left transition-colors hover:border-primary hover:bg-accent"
                            >
                              <div className="min-w-0 flex-1">
                                <span className="block text-[11px] font-medium uppercase tracking-wider text-primary">
                                  Module {module.number}: {module.title}
                                </span>
                                <span className="block truncate text-sm font-semibold text-foreground group-hover:text-primary">
                                  {lesson.title}
                                </span>
                              </div>
                              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {results.glossaryTerms.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Glossary Terms ({results.glossaryTerms.length})
                      </h3>
                      <ul className="space-y-1.5">
                        {results.glossaryTerms.map((g) => (
                          <li key={g.term}>
                            <button
                              onClick={handleSelectGlossary}
                              className="group flex w-full items-start gap-3 rounded-lg border border-border/60 bg-background/50 p-3 text-left transition-colors hover:border-primary hover:bg-accent"
                            >
                              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <div>
                                <span className="block text-sm font-semibold text-foreground group-hover:text-primary">
                                  {g.term}
                                </span>
                                <span className="line-clamp-2 text-xs text-muted-foreground">
                                  {g.def}
                                </span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-between border-t border-border bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground sm:px-5">
              <span>Use ESC or click backdrop to close</span>
              <span>Webcam Boxing Course Search</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
