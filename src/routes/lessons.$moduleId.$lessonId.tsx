import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { BlockView } from "@/components/LessonBlocks";
import { CodeBlock } from "@/components/CodeBlock";
import { findLesson, modules, type Lesson, type Module } from "@/data/course";
import { lessonKey, useHydrated, useProgress } from "@/lib/progress";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/lessons/$moduleId/$lessonId")({
  loader: ({
    params,
  }): {
    module: Module;
    lesson: Lesson;
    prev: { module: Module; lesson: Lesson } | null;
    next: { module: Module; lesson: Lesson } | null;
  } => {
    const found = findLesson(params.moduleId, params.lessonId);
    if (!found) throw notFound();
    return found;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Lesson not found — Webcam Boxing" }] };
    const t = `${loaderData.lesson.title} — Module ${loaderData.module.number}: ${loaderData.module.title} | Python & CV Course`;
    const d = `Learn ${loaderData.lesson.title} in Module ${loaderData.module.number} of Webcam Boxing. Objectives: ${loaderData.lesson.objectives.join(" · ")}`;
    const url = `https://webcamboxing.com/lessons/${loaderData.module.id}/${loaderData.lesson.id}`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: LessonPage,
});

function LessonPage() {
  const data = Route.useLoaderData() as {
    module: Module;
    lesson: Lesson;
    prev: { module: Module; lesson: Lesson } | null;
    next: { module: Module; lesson: Lesson } | null;
  };
  const { module: mod, lesson, prev, next } = data;
  const hydrated = useHydrated();
  const { completed, isDone, toggle, setLastVisited } = useProgress();
  const router = useRouter();
  const key = lessonKey(mod.id, lesson.id);
  const done = hydrated && isDone(key);

  useEffect(() => {
    if (hydrated) setLastVisited(mod.id, lesson.id);
  }, [hydrated, mod.id, lesson.id, setLastVisited]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.shiftKey && (e.key === "ArrowRight" || e.key.toLowerCase() === "j")) {
        if (next) {
          e.preventDefault();
          router.navigate({
            to: "/lessons/$moduleId/$lessonId",
            params: { moduleId: next.module.id, lessonId: next.lesson.id },
          });
        }
      } else if (e.shiftKey && (e.key === "ArrowLeft" || e.key.toLowerCase() === "k")) {
        if (prev) {
          e.preventDefault();
          router.navigate({
            to: "/lessons/$moduleId/$lessonId",
            params: { moduleId: prev.module.id, lessonId: prev.lesson.id },
          });
        }
      } else if (e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        toggle(key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev, router, toggle, key]);

  const lessonSchema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.title,
    description: lesson.objectives.join(" · "),
    learningResourceType: "Tutorial",
    educationalLevel: "Beginner",
    inLanguage: "en",
    isAccessibleForFree: true,
    teaches: lesson.objectives,
    isPartOf: {
      "@type": "Course",
      name: "Webcam Boxing: Learn Python Game Development & Computer Vision",
      url: "https://webcamboxing.com/",
    },
    url: `https://webcamboxing.com/lessons/${mod.id}/${lesson.id}`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://webcamboxing.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Curriculum",
        item: "https://webcamboxing.com/curriculum",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Module ${mod.number}: ${mod.title}`,
        item: `https://webcamboxing.com/lessons/${mod.id}/${mod.lessons[0].id}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: lesson.title,
        item: `https://webcamboxing.com/lessons/${mod.id}/${lesson.id}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lessonSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="glass-panel rounded-2xl p-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary px-2">
            Modules
          </p>
          <ol className="mt-3 space-y-1.5 text-sm">
            {modules.map((m) => {
              const isCurrent = m.id === mod.id;
              return (
                <li key={m.id}>
                  <details open={isCurrent} className="group">
                    <summary
                      className={`cursor-pointer list-none rounded-lg px-2.5 py-2 transition-colors hover:bg-accent/70 select-none ${isCurrent ? "bg-accent/80 font-semibold text-foreground shadow-sm" : "text-muted-foreground"}`}
                    >
                      <span className="mr-2 font-mono text-xs tabular-nums text-muted-foreground">
                        {String(m.number).padStart(2, "0")}
                      </span>
                      {m.title}
                    </summary>
                    <ul className="mt-1.5 space-y-0.5 border-l border-border/60 pl-3 ml-2">
                      {m.lessons.map((l) => {
                        const active = m.id === mod.id && l.id === lesson.id;
                        const complete = hydrated && completed[lessonKey(m.id, l.id)];
                        return (
                          <li key={l.id}>
                            <Link
                              to="/lessons/$moduleId/$lessonId"
                              params={{ moduleId: m.id, lessonId: l.id }}
                              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors hover:bg-accent/60 ${active ? "text-primary font-semibold bg-primary/10" : "text-muted-foreground"}`}
                            >
                              {complete ? (
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                              ) : (
                                <Circle className="h-3.5 w-3.5 shrink-0" />
                              )}
                              <span className="line-clamp-1">{l.title}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                </li>
              );
            })}
          </ol>
        </aside>

        <article className="prose-lesson min-w-0 glass-panel rounded-2xl p-6 md:p-8 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Module {mod.number} · {mod.title}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight md:text-5xl">
            {lesson.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground border-b border-border/60 pb-5">
            <span className="inline-flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5" /> ~{lesson.minutes} min
            </span>
            <span className="rounded-full border border-border/80 bg-muted/40 px-2.5 py-0.5 font-semibold">
              {lesson.difficulty}
            </span>
            <button
              onClick={() => toggle(key)}
              title="Shift+C to complete · Shift+→ next lesson"
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold transition-all ${done ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border/80 bg-card hover:bg-accent hover:border-border"}`}
            >
              {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
              {done ? "Completed" : "Mark complete"}
            </button>
          </div>

          <section className="mt-8 neo-inset rounded-xl border border-border/80 bg-background/50 p-5 backdrop-blur">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Learning objectives
            </h2>
            <ul className="mt-2.5 space-y-1.5 text-[15px] font-medium leading-relaxed">
              {lesson.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="font-display text-2xl font-bold tracking-tight">The concepts</h2>
            <div className="mt-3 space-y-3.5 text-base leading-relaxed text-muted-foreground">
              {lesson.concept.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          {lesson.codeSnippets && lesson.codeSnippets.length > 0 && (
            <section className="mt-10 space-y-6">
              <h2 className="font-display text-2xl font-bold tracking-tight">Walkthrough</h2>
              {lesson.codeSnippets.map((s, idx) => (
                <div key={idx} className="space-y-2.5">
                  {s.title && (
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {s.title}
                    </h3>
                  )}
                  {s.explanation && (
                    <p className="text-sm leading-relaxed text-muted-foreground">{s.explanation}</p>
                  )}
                  <CodeBlock code={s.code} lang={s.lang} caption={s.caption ?? s.title} />
                </div>
              ))}
            </section>
          )}

          {lesson.fullCode && (
            <section className="mt-12">
              <h2 className="font-display text-2xl font-bold tracking-tight">
                Working lesson code
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Copy this directly into a file (for example{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  lesson_{lesson.id}.py
                </code>
                ) and run it:
              </p>
              <div className="mt-3">
                <CodeBlock
                  code={lesson.fullCode}
                  lang="python"
                  caption={`Complete script — ${lesson.title}`}
                />
              </div>
            </section>
          )}

          <section className="mt-10 rounded-xl border border-primary/30 bg-primary/10 p-5 backdrop-blur">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary">Recap</h2>
            <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed">
              {lesson.recap.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>

          {lesson.resources && lesson.resources.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Further reading
              </h2>
              <ul className="mt-2.5 space-y-1.5 text-sm">
                {lesson.resources.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {r.title} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <ChallengeBlock challenge={lesson.challenge} />

          <nav className="mt-12 flex items-stretch justify-between gap-4 border-t border-border/60 pt-6">
            {prev ? (
              <Link
                to="/lessons/$moduleId/$lessonId"
                params={{ moduleId: prev.module.id, lessonId: prev.lesson.id }}
                className="glass-panel group flex flex-1 items-center gap-3.5 rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
              >
                <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-muted-foreground">Previous</span>
                  <span className="block truncate font-semibold text-foreground">
                    {prev.lesson.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
            {next ? (
              <Link
                to="/lessons/$moduleId/$lessonId"
                params={{ moduleId: next.module.id, lessonId: next.lesson.id }}
                className="glass-panel group flex flex-1 items-center justify-end gap-3.5 rounded-xl p-4 text-right transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
              >
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-muted-foreground">Next</span>
                  <span className="block truncate font-semibold text-foreground">
                    {next.lesson.title}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </Link>
            ) : (
              <span className="flex-1" />
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}

function ChallengeBlock({
  challenge,
}: {
  challenge: NonNullable<ReturnType<typeof findLesson>>["lesson"]["challenge"];
}) {
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  if (!challenge) return null;
  return (
    <section className="glass-panel mt-10 rounded-xl p-6 shadow-md">
      <h2 className="text-xs font-bold uppercase tracking-wider text-primary">Mini challenge</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-foreground">{challenge.prompt}</p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {challenge.hint && (
          <button
            onClick={() => setShowHint((h) => !h)}
            className="rounded-lg border border-border/80 bg-card/60 px-3.5 py-1.5 text-xs font-semibold backdrop-blur transition-colors hover:bg-card hover:border-border"
          >
            {showHint ? "Hide hint" : "Show hint"}
          </button>
        )}
        <button
          onClick={() => setShowSolution((s) => !s)}
          className="neo-btn inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground"
        >
          {showSolution ? "Hide solution" : "Show solution"}
        </button>
      </div>
      {showHint && challenge.hint && (
        <p className="mt-3 rounded-lg border border-border/80 bg-background/60 backdrop-blur p-3.5 text-sm text-muted-foreground leading-relaxed">
          <strong>Hint:</strong> {challenge.hint}
        </p>
      )}
      {showSolution && (
        <div className="mt-4">
          <CodeBlock
            code={challenge.solution.code}
            lang={challenge.solution.lang}
            caption="Solution"
          />
          {challenge.solution.explain && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {challenge.solution.explain}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
