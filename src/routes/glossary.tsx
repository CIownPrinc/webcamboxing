import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { glossary } from "@/data/course";

export const Route = createFileRoute("/glossary")({
  head: () => ({
    meta: [
      { title: "Python & Computer Vision Game Development Glossary | Webcam Boxing" },
      {
        name: "description",
        content:
          "Plain-language definitions for computer vision, Python programming, and game development terms: landmarks, FSMs, delta time, OpenCV, and MediaPipe.",
      },
      {
        property: "og:title",
        content: "Python & Computer Vision Game Development Glossary | Webcam Boxing",
      },
      {
        property: "og:description",
        content:
          "Plain-language definitions for computer vision, Python programming, and game development terms: landmarks, FSMs, delta time, OpenCV, and MediaPipe.",
      },
      { property: "og:url", content: "https://webcamboxing.com/glossary" },
    ],
    links: [{ rel: "canonical", href: "https://webcamboxing.com/glossary" }],
  }),
  component: Glossary,
});

function Glossary() {
  const [q, setQ] = useState("");
  const list = glossary.filter(
    (g) =>
      g.term.toLowerCase().includes(q.toLowerCase()) ||
      g.def.toLowerCase().includes(q.toLowerCase()),
  );

  const glossarySchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Webcam Boxing Python & Computer Vision Glossary",
    description: "Definitions for game development, computer vision, and Python terms.",
    hasDefinedTerm: glossary.map((item) => ({
      "@type": "DefinedTerm",
      name: item.term,
      description: item.def,
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
        name: "Glossary",
        item: "https://webcamboxing.com/glossary",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(glossarySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Reference</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Glossary</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          The vocabulary of computer vision and simple game development, defined without jargon.
        </p>

        <label className="relative mt-8 block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms…"
            className="neo-inset w-full rounded-xl border border-border/80 bg-background/60 py-3 pl-10 pr-4 text-sm outline-none backdrop-blur-md transition-colors focus:border-primary"
          />
        </label>

        <dl className="mt-8 space-y-4">
          {list.map((g) => (
            <div key={g.term} className="glass-panel rounded-xl p-5 shadow-sm">
              <dt className="font-display text-lg font-semibold">{g.term}</dt>
              <dd className="mt-1.5 text-[15px] text-muted-foreground leading-relaxed">{g.def}</dd>
            </div>
          ))}
          {list.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No matches found.</p>
          )}
        </dl>
      </main>
    </div>
  );
}
