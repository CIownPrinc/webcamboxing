import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { BlockView } from "@/components/LessonBlocks";
import { CodeBlock } from "@/components/CodeBlock";
import { findLesson, modules, type Lesson, type Module } from "@/data/course";
import { lessonKey, useHydrated, useProgress } from "@/lib/progress";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/lessons/$moduleId/$lessonId")({
  loader: ({ params }): {
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
    const t = `${loaderData.lesson.title} — Module ${loaderData.module.number} · Webcam Boxing`;
    const d = loaderData.lesson.objectives.join(" · ");
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
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
  const key = lessonKey(mod.id, lesson.id);
  const done = hydrated && isDone(key);

  useEffect(() => {
    if (hydrated) setLastVisited(mod.id, lesson.id);
  }, [hydrated, mod.id, lesson.id, setLastVisited]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Modules</p>
          <ol className="mt-3 space-y-1 text-sm">
            {modules.map((m) => {
              const isCurrent = m.id === mod.id;
              return (
                <li key={m.id}>
                  <details open={isCurrent} className="group">
                    <summary className={`cursor-pointer list-none rounded px-2 py-1.5 hover:bg-accent ${isCurrent ? "bg-accent font-medium" : "text-muted-foreground"}`}>
                      <span className="mr-2 tabular-nums">{String(m.number).padStart(2, "0")}</span>
                      {m.title}
                    </summary>
                    <ul className="mt-1 space-y-0.5 border-l border-border pl-3">
                      {m.lessons.map((l) => {
                        const active = m.id === mod.id && l.id === lesson.id;
                        const complete = hydrated && completed[lessonKey(m.id, l.id)];
                        return (
                          <li key={l.id}>
                            <Link
                              to="/lessons/$moduleId/$lessonId"
                              params={{ moduleId: m.id, lessonId: l.id }}
                              className={`flex items-center gap-2 rounded px-2 py-1 text-[13px] transition-colors hover:bg-accent ${active ? "text-primary font-medium" : "text-muted-foreground"}`}
                            >
                              {complete ? (
                                <CheckCircle2 className="h-3 w-3 text-primary" />
                              ) : (
                                <Circle className="h-3 w-3" />
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

        <article className="prose-lesson min-w-0">
          <p className="text-xs uppercase tracking-widest text-primary">
            Module {mod.number} · {mod.title}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight md:text-5xl">{lesson.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> ~{lesson.minutes} min
            </span>
            <span className="rounded-full border border-border px-2 py-0.5">{lesson.difficulty}</span>
            <button
              onClick={() => toggle(key)}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 transition-colors ${done ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`}
            >
              {done ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
              {done ? "Completed" : "Mark complete"}
            </button>
          </div>

          <section className="mt-8 rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Learning objectives
            </h2>
            <ul className="mt-2 space-y-1 text-[15px]">
              {lesson.objectives.map((o, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {o}
                </li>
              ))}
            </ul>
            {lesson.prerequisites && lesson.prerequisites.length > 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                <strong className="text-foreground">Prerequisites:</strong>{" "}
                {lesson.prerequisites.join(", ")}
              </p>
            )}
          </section>

          <div className="mt-2">
            {lesson.blocks.map((b, i) => (
              <BlockView key={i} b={b} />
            ))}
          </div>

          {lesson.mistakes && lesson.mistakes.length > 0 && (
            <section className="mt-10 rounded-lg border border-amber-500/40 bg-amber-500/5 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Common beginner mistakes
              </h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px]">
                {lesson.mistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </section>
          )}

          {lesson.debugging && lesson.debugging.length > 0 && (
            <section className="mt-6 rounded-lg border border-border bg-card p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Debugging
              </h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px]">
                {lesson.debugging.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </section>
          )}

          {lesson.challenge && <ChallengeBlock challenge={lesson.challenge} />}

          <section className="mt-10 rounded-lg border border-primary/40 bg-primary/5 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Recap</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px]">
              {lesson.recap.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>

          {lesson.resources && lesson.resources.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Further reading
              </h2>
              <ul className="mt-2 space-y-1.5 text-sm">
                {lesson.resources.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
                    >
                      {r.title} <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav className="mt-12 flex items-stretch justify-between gap-3 border-t border-border pt-6">
            {prev ? (
              <Link
                to="/lessons/$moduleId/$lessonId"
                params={{ moduleId: prev.module.id, lessonId: prev.lesson.id }}
                className="group flex flex-1 items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                <span className="min-w-0">
                  <span className="block text-xs text-muted-foreground">Previous</span>
                  <span className="block truncate font-medium">{prev.lesson.title}</span>
                </span>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
            {next ? (
              <Link
                to="/lessons/$moduleId/$lessonId"
                params={{ moduleId: next.module.id, lessonId: next.lesson.id }}
                className="group flex flex-1 items-center justify-end gap-3 rounded-lg border border-border bg-card p-4 text-right transition-colors hover:border-primary/50"
              >
                <span className="min-w-0">
                  <span className="block text-xs text-muted-foreground">Next</span>
                  <span className="block truncate font-medium">{next.lesson.title}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
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

function ChallengeBlock({ challenge }: { challenge: NonNullable<ReturnType<typeof findLesson>>["lesson"]["challenge"] }) {
  if (!challenge) return null;
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  return (
    <section className="mt-10 rounded-lg border border-border bg-card p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
        Mini challenge
      </h2>
      <p className="mt-2 text-[15px]">{challenge.prompt}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {challenge.hint && (
          <button
            onClick={() => setShowHint((h) => !h)}
            className="rounded border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
          >
            {showHint ? "Hide hint" : "Show hint"}
          </button>
        )}
        <button
          onClick={() => setShowSolution((s) => !s)}
          className="rounded border border-primary bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          {showSolution ? "Hide solution" : "Show solution"}
        </button>
      </div>
      {showHint && challenge.hint && (
        <p className="mt-3 rounded-md border border-border bg-background p-3 text-sm text-muted-foreground">
          Hint: {challenge.hint}
        </p>
      )}
      {showSolution && (
        <div className="mt-3">
          <CodeBlock code={challenge.solution.code} lang={challenge.solution.lang} caption="Solution" />
          {challenge.solution.explain && (
            <p className="mt-1 text-sm text-muted-foreground">{challenge.solution.explain}</p>
          )}
        </div>
      )}
    </section>
  );
}