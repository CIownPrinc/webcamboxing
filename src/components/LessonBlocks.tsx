import { useState, type ReactNode } from "react";
import { ChevronDown, Info, Lightbulb, AlertTriangle, Sparkles } from "lucide-react";
import type { Block } from "@/data/course";
import { CodeBlock } from "./CodeBlock";

function Callout({ kind, title, text }: Extract<Block, { type: "callout" }>) {
  const styles: Record<string, { ring: string; icon: ReactNode; label: string }> = {
    info: { ring: "border-l-primary/70", icon: <Info className="h-4 w-4 text-primary" />, label: title ?? "Note" },
    why: { ring: "border-l-primary", icon: <Sparkles className="h-4 w-4 text-primary" />, label: title ?? "Why we do this" },
    tip: { ring: "border-l-emerald-500", icon: <Lightbulb className="h-4 w-4 text-emerald-500" />, label: title ?? "Tip" },
    warn: { ring: "border-l-amber-500", icon: <AlertTriangle className="h-4 w-4 text-amber-500" />, label: title ?? "Watch out" },
  };
  const s = styles[kind];
  return (
    <aside className={`my-5 rounded-r-md border border-border border-l-4 bg-card p-4 ${s.ring}`}>
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {s.icon}
        {s.label}
      </div>
      <p className="text-[15px] text-foreground">{text}</p>
    </aside>
  );
}

function Diagram({ title, svg }: Extract<Block, { type: "diagram" }>) {
  return (
    <figure className="my-6 rounded-lg border border-border bg-card p-4">
      <div
        className="mx-auto max-w-full overflow-x-auto text-foreground [&_svg]:mx-auto [&_svg]:max-w-full [&_svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {title && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">{title}</figcaption>
      )}
    </figure>
  );
}

export function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case "h": {
      const Tag = (b.level === 3 ? "h3" : "h2") as "h2" | "h3";
      const cls = b.level === 3 ? "mt-8 text-xl font-semibold" : "mt-10 text-2xl font-semibold";
      return <Tag className={cls}>{b.text}</Tag>;
    }
    case "p":
      return <p className="my-4 text-[16.5px] leading-relaxed">{b.text}</p>;
    case "list": {
      const Tag = b.ordered ? "ol" : "ul";
      return (
        <Tag className={`my-4 space-y-1.5 pl-6 text-[16px] ${b.ordered ? "list-decimal" : "list-disc"}`}>
          {b.items.map((it, i) => (
            <li key={i} className="marker:text-primary">
              {it}
            </li>
          ))}
        </Tag>
      );
    }
    case "code":
      return <CodeBlock code={b.code} lang={b.lang} caption={b.caption} />;
    case "callout":
      return <Callout {...b} />;
    case "analogy":
      return (
        <blockquote className="my-6 border-l-4 border-primary/60 bg-card px-4 py-3 italic text-muted-foreground">
          <span className="mr-2 text-xs font-semibold uppercase tracking-wider not-italic text-primary">
            Analogy
          </span>
          {b.text}
        </blockquote>
      );
    case "diagram":
      return <Diagram {...b} />;
    case "hint":
      return <ExpandableHint label={b.label} text={b.text} />;
    case "quiz":
      return <Quiz {...b} />;
  }
}

function ExpandableHint({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-4 rounded-md border border-border bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-2 text-left text-sm font-medium"
      >
        <span>{label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="border-t border-border px-4 py-3 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

function Quiz({ question, options, answer, explain }: Extract<Block, { type: "quiz" }>) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="my-6 rounded-lg border border-border bg-card p-4">
      <p className="mb-3 font-medium">{question}</p>
      <ul className="space-y-1.5">
        {options.map((opt, i) => {
          const state =
            picked === null ? "" : i === answer ? "border-emerald-500 bg-emerald-500/10" : i === picked ? "border-destructive bg-destructive/10" : "";
          return (
            <li key={i}>
              <button
                onClick={() => setPicked(i)}
                className={`w-full rounded border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${state}`}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      {picked !== null && (
        <p className="mt-3 text-sm text-muted-foreground">
          <strong>{picked === answer ? "Correct." : "Not quite."}</strong> {explain}
        </p>
      )}
    </div>
  );
}