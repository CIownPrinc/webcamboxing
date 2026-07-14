import { useState, type ReactNode } from "react";
import { ChevronDown, Info, Lightbulb, AlertTriangle, Sparkles } from "lucide-react";
import type { Block } from "@/data/course";
import { CodeBlock } from "./CodeBlock";

function Callout({ kind, title, text }: Extract<Block, { type: "callout" }>) {
  const styles: Record<string, { ring: string; icon: ReactNode; label: string }> = {
    info: {
      ring: "border-l-primary/80 bg-primary/5",
      icon: <Info className="h-4 w-4 text-primary" />,
      label: title ?? "Note",
    },
    why: {
      ring: "border-l-primary bg-primary/10",
      icon: <Sparkles className="h-4 w-4 text-primary" />,
      label: title ?? "Why we do this",
    },
    tip: {
      ring: "border-l-emerald-500 bg-emerald-500/10",
      icon: <Lightbulb className="h-4 w-4 text-emerald-500" />,
      label: title ?? "Tip",
    },
    warn: {
      ring: "border-l-amber-500 bg-amber-500/10",
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      label: title ?? "Watch out",
    },
  };
  const s = styles[kind];
  return (
    <aside className={`glass-panel my-5 rounded-xl border-l-4 p-5 shadow-sm ${s.ring}`}>
      <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {s.icon}
        {s.label}
      </div>
      <p className="text-[15px] leading-relaxed text-foreground">{text}</p>
    </aside>
  );
}

function Diagram({ title, svg }: Extract<Block, { type: "diagram" }>) {
  return (
    <figure className="glass-panel my-6 rounded-xl p-5 shadow-md">
      <div
        className="mx-auto max-w-full overflow-x-auto text-foreground [&_svg]:mx-auto [&_svg]:max-w-full [&_svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {title && (
        <figcaption className="mt-2.5 text-center text-xs font-medium text-muted-foreground">
          {title}
        </figcaption>
      )}
    </figure>
  );
}

export function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case "h": {
      const Tag = (b.level === 3 ? "h3" : "h2") as "h2" | "h3";
      const cls =
        b.level === 3
          ? "mt-8 font-display text-xl font-bold text-foreground"
          : "mt-10 font-display text-2xl font-bold text-foreground";
      return <Tag className={cls}>{b.text}</Tag>;
    }
    case "p":
      return <p className="my-4 text-[16.5px] leading-relaxed text-muted-foreground">{b.text}</p>;
    case "list": {
      const Tag = b.ordered ? "ol" : "ul";
      return (
        <Tag
          className={`my-4 space-y-2 pl-6 text-[16px] leading-relaxed text-muted-foreground ${b.ordered ? "list-decimal" : "list-disc"}`}
        >
          {b.items.map((it, i) => (
            <li key={i} className="marker:text-primary">
              <span className="text-foreground">{it}</span>
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
        <blockquote className="glass-panel my-6 rounded-xl border-l-4 border-primary/80 bg-primary/5 p-5 italic text-muted-foreground shadow-sm">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider not-italic text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Analogy
          </span>
          <span className="text-[15.5px] leading-relaxed text-foreground">{b.text}</span>
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
    <div className="glass-panel my-4 rounded-xl shadow-sm transition-colors hover:border-primary/40">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-3 text-left text-sm font-semibold select-none"
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="border-t border-border/60 px-5 py-3.5 text-sm leading-relaxed text-muted-foreground">
          {text}
        </p>
      )}
    </div>
  );
}

function Quiz({ question, options, answer, explain }: Extract<Block, { type: "quiz" }>) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="glass-panel my-6 rounded-xl p-6 shadow-md">
      <p className="mb-4 font-display text-lg font-semibold text-foreground">{question}</p>
      <ul className="space-y-2.5">
        {options.map((opt, i) => {
          const state =
            picked === null
              ? "border-border/80 bg-background/50 hover:border-primary hover:bg-accent/60"
              : i === answer
                ? "border-emerald-500 bg-emerald-500/15 font-semibold text-foreground shadow-sm"
                : i === picked
                  ? "border-destructive bg-destructive/15 text-foreground"
                  : "border-border/40 bg-background/30 opacity-60";
          return (
            <li key={i}>
              <button
                onClick={() => setPicked(i)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${state}`}
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
