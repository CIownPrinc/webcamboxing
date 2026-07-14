import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { modules } from "@/data/course";
import { lessonKey, useHydrated, useProgress } from "@/lib/progress";

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-xs uppercase tracking-widest text-primary">The course</p>
        <h1 className="mt-2 font-display text-5xl">Curriculum</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          25 modules, ordered so every step builds on the previous one. Click any lesson to jump in.
          Your progress is saved in this browser.
        </p>

        <ol className="mt-10 space-y-8">
          {modules.map((m) => (
            <li key={m.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-xl">
                  <span className="mr-3 text-muted-foreground">
                    {String(m.number).padStart(2, "0")}
                  </span>
                  {m.title}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {m.lessons.length} lesson{m.lessons.length > 1 ? "s" : ""}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{m.summary}</p>
              <ul className="mt-4 divide-y divide-border border-t border-border">
                {m.lessons.map((l) => {
                  const done = hydrated && completed[lessonKey(m.id, l.id)];
                  return (
                    <li key={l.id}>
                      <Link
                        to="/lessons/$moduleId/$lessonId"
                        params={{ moduleId: m.id, lessonId: l.id }}
                        className="flex items-center gap-3 py-3 transition-colors hover:text-primary"
                      >
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <span className="flex-1 text-[15px]">{l.title}</span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {l.minutes}m · {l.difficulty}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
