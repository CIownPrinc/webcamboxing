import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { glossary } from "@/data/course";

export const Route = createFileRoute("/glossary")({
  head: () => ({
    meta: [
      { title: "Glossary | Webcam Boxing" },
      { name: "description", content: "Every term used in the course, defined in plain language." },
      { property: "og:title", content: "Glossary | Webcam Boxing" },
      {
        property: "og:description",
        content: "Definitions for landmarks, FSMs, delta time, and more.",
      },
    ],
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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-xs uppercase tracking-widest text-primary">Reference</p>
        <h1 className="mt-2 font-display text-5xl">Glossary</h1>
        <p className="mt-3 text-muted-foreground">
          The vocabulary of computer vision and simple game development, defined without jargon.
        </p>

        <label className="relative mt-8 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms…"
            className="w-full rounded-md border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none ring-primary/40 focus:ring-2"
          />
        </label>

        <dl className="mt-8 space-y-4">
          {list.map((g) => (
            <div key={g.term} className="rounded-lg border border-border bg-card p-4">
              <dt className="font-display text-lg">{g.term}</dt>
              <dd className="mt-1 text-[15px] text-muted-foreground">{g.def}</dd>
            </div>
          ))}
          {list.length === 0 && <p className="text-sm text-muted-foreground">No matches.</p>}
        </dl>
      </main>
    </div>
  );
}
