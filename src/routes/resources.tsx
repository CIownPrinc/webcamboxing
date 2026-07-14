import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { globalResources } from "@/data/course";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Python, OpenCV & MediaPipe Game Development Resources | Webcam Boxing" },
      {
        name: "description",
        content:
          "Curated documentation, tutorials, and reference code for Python game development, OpenCV computer vision, MediaPipe hand tracking, and Pygame.",
      },
      {
        property: "og:title",
        content: "Python, OpenCV & MediaPipe Game Development Resources | Webcam Boxing",
      },
      {
        property: "og:description",
        content:
          "Curated documentation, tutorials, and reference code for Python game development, OpenCV computer vision, MediaPipe hand tracking, and Pygame.",
      },
      { property: "og:url", content: "https://webcamboxing.com/resources" },
    ],
    links: [{ rel: "canonical", href: "https://webcamboxing.com/resources" }],
  }),
  component: Resources,
});

function Resources() {
  const allResourceItems = globalResources.flatMap((g) => g.items);
  const resourceListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Webcam Boxing Recommended Python & CV Resources",
    description: "Curated learning resources and docs for Python, OpenCV, MediaPipe, and Pygame.",
    itemListElement: allResourceItems.map((res, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: res.title,
      url: res.url,
    })),
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
        name: "Resources",
        item: "https://webcamboxing.com/resources",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resourceListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-xs uppercase tracking-widest text-primary">Beyond the course</p>
        <h1 className="mt-2 font-display text-5xl">Resources</h1>
        <p className="mt-3 text-muted-foreground">
          A short, opinionated list. We'd rather point you at 10 great things than 100 mediocre
          ones.
        </p>

        {globalResources.map((section) => (
          <section key={section.section} className="mt-10">
            <h2 className="font-display text-2xl">{section.section}</h2>
            <ul className="mt-4 space-y-3">
              {section.items.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-3 rounded-md border border-border bg-card p-3 transition-colors hover:border-primary/50"
                  >
                    <span className="mt-0.5 rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                      {r.kind ?? "link"}
                    </span>
                    <span className="flex-1">{r.title}</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
