import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { modules } from "@/data/course";
import { lessonKey, useHydrated, useProgress } from "@/lib/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/curriculum")({
  head: () => ({
    meta: [
      { title: "Python Game Development & Computer Vision Curriculum | Webcam Boxing" },
      {
        name: "description",
        content:
          "Explore the complete 25-module Python game development and computer vision curriculum. Master OpenCV, MediaPipe tracking, and Pygame from first principles.",
      },
      {
        property: "og:title",
        content: "Python Game Development & Computer Vision Curriculum | Webcam Boxing",
      },
      {
        property: "og:description",
        content:
          "Explore the complete 25-module Python game development and computer vision curriculum. Master OpenCV, MediaPipe tracking, and Pygame from first principles.",
      },
      { property: "og:url", content: "https://webcamboxing.com/curriculum" },
    ],
    links: [{ rel: "canonical", href: "https://webcamboxing.com/curriculum" }],
  }),
  component: Curriculum,
});

function Curriculum() {
  const hydrated = useHydrated();
  const { completed } = useProgress();

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
    ],
  };

  let activeModuleId = modules[0].id;
  if (hydrated) {
    for (const m of modules) {
      const allComplete = m.lessons.every((l) => completed[lessonKey(m.id, l.id)]);
      if (!allComplete) {
        activeModuleId = m.id;
        break;
      }
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_260px]">
        <main className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">The course</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Curriculum
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
            25 modules, ordered so every step builds on the previous one. Click any lesson to jump
            in. Your progress is saved in this browser.
          </p>

          <Accordion type="multiple" defaultValue={[activeModuleId]} className="mt-10 space-y-4">
            {modules.map((m) => {
              const allDone = hydrated && m.lessons.every((l) => completed[lessonKey(m.id, l.id)]);
              return (
                <AccordionItem
                  key={m.id}
                  value={m.id}
                  id={`module-${m.id}`}
                  className={`glass-panel rounded-2xl border px-6 py-2 shadow-sm transition-all duration-200 hover:border-primary/40 ${allDone ? "border-green-500/30 bg-green-500/5" : "border-border/60"}`}
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex flex-1 flex-wrap items-center justify-between gap-2 text-left pr-4">
                      <h2 className="font-display text-xl font-semibold flex items-center gap-3">
                        {allDone ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <span className="font-mono text-base text-muted-foreground">
                            {String(m.number).padStart(2, "0")}
                          </span>
                        )}
                        {m.title}
                      </h2>
                      <span className="text-xs font-medium text-muted-foreground hidden sm:block">
                        {m.lessons.length} lesson{m.lessons.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4 text-sm text-muted-foreground leading-relaxed pr-4">
                      {m.summary}
                    </p>
                    <ul className="divide-y divide-border/60 border-t border-border/60">
                      {m.lessons.map((l) => {
                        const done = hydrated && completed[lessonKey(m.id, l.id)];
                        return (
                          <li key={l.id}>
                            <Link
                              to="/lessons/$moduleId/$lessonId"
                              params={{ moduleId: m.id, lessonId: l.id }}
                              className="flex items-center gap-3 py-3.5 transition-colors hover:text-primary"
                            >
                              {done ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                              ) : (
                                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}
                              <span className="flex-1 font-medium text-[15px]">{l.title}</span>
                              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {l.minutes}m - {l.difficulty}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </main>

        <aside className="hidden lg:block lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="glass-panel rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary px-2">
              Course Map
            </p>
            <ol className="mt-4 space-y-1 text-sm border-l border-border/60 ml-3 pl-3">
              {modules.map((m) => {
                const allDone =
                  hydrated && m.lessons.every((l) => completed[lessonKey(m.id, l.id)]);
                const isActive = activeModuleId === m.id;
                return (
                  <li key={m.id} className="relative">
                    <div
                      className={`absolute -left-[17px] top-1.5 h-2 w-2 rounded-full border ${allDone ? "border-green-500 bg-green-500" : isActive ? "border-primary bg-primary" : "border-muted-foreground bg-background"}`}
                    />
                    <button
                      onClick={() => {
                        const el = document.getElementById(`module-${m.id}`);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={`block w-full rounded-md px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-accent/60 truncate ${isActive ? "text-primary font-bold" : allDone ? "text-green-500/80 font-medium" : "text-muted-foreground"}`}
                      title={m.title}
                    >
                      {String(m.number).padStart(2, "0")} - {m.title}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
