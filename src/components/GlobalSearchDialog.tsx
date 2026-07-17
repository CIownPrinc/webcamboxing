/**
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind.
 */

// COMPLIANCE REQUIREMENT: Global search dialog must provide fast keyboard navigation and keyword discovery across all course modules without inline implementation commentary.

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
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
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/80 bg-card/60 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur transition-all hover:border-primary/50 hover:bg-card hover:text-foreground shadow-sm"
        aria-label="Search course content"
        title="Search course content"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden rounded bg-muted/80 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground lg:inline-block">
          {deviceShortcut ?? "Ctrl/⌘+K"}
        </kbd>
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4 sm:p-6 backdrop-blur-sm">
            <div className="fixed inset-0 -z-10" onClick={() => setOpen(false)} />

            <div className="flex min-h-full items-center justify-center py-6 sm:py-12 pointer-events-none">
              <div className="glass-panel relative flex max-h-[calc(100vh-3rem)] sm:max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl shadow-2xl pointer-events-auto">
                <div className="flex shrink-0 items-center border-b border-border/60 bg-background/40 px-4 py-3 sm:px-5 sm:py-3.5">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground mr-2.5" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search 25 modules, code, or glossary terms..."
                    className="w-full bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label="Close search"
                  >
                    x
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  {!query || query.trim().length < 2 ? (
                    <p className="py-8 text-center text-xs text-muted-foreground">
                      Type at least 2 characters to search across all lessons and terms.
                    </p>
                  ) : results.lessons.length === 0 && results.glossaryTerms.length === 0 ? (
                    <p className="py-8 text-center text-xs text-muted-foreground">
                      No matches found for "{query}". Try searching "FSM", "MediaPipe", or
                      "velocity".
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {results.lessons.length > 0 && (
                        <div>
                          <h3 className="mb-2 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Matching Lessons ({results.lessons.length})
                          </h3>
                          <ul className="space-y-2">
                            {results.lessons.map(({ module, lesson }) => (
                              <li key={lesson.id}>
                                <button
                                  type="button"
                                  onClick={() => handleSelectLesson(module.id, lesson.id)}
                                  className="group flex w-full flex-col items-start rounded-xl border border-border/60 bg-muted/20 p-3 text-left transition-all hover:border-primary/50 hover:bg-card hover:shadow-sm"
                                >
                                  <span className="text-[11px] font-semibold text-primary">
                                    Module {module.number}: {module.title}
                                  </span>
                                  <span className="mt-0.5 text-sm font-semibold text-foreground group-hover:text-primary">
                                    {lesson.title}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {results.glossaryTerms.length > 0 && (
                        <div>
                          <h3 className="mb-2 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Glossary Terms ({results.glossaryTerms.length})
                          </h3>
                          <ul className="space-y-2">
                            {results.glossaryTerms.map((g) => (
                              <li key={g.term}>
                                <button
                                  type="button"
                                  onClick={handleSelectGlossary}
                                  className="group flex w-full flex-col items-start rounded-xl border border-border/60 bg-muted/20 p-3 text-left transition-all hover:border-primary/50 hover:bg-card hover:shadow-sm"
                                >
                                  <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                                    {g.term}
                                  </span>
                                  <span className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                                    {g.def}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground sm:px-6">
                  <span>Use ESC or click backdrop to close</span>
                  <span>Course Search</span>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
