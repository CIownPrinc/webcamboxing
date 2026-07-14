import { Check, Copy } from "lucide-react";
import { useState } from "react";

// Minimal, dependency-free Python/bash highlighter. Not perfect — good enough
// to distinguish keywords, strings, comments, and numbers without a runtime
// hit from prism/shiki.

const PY_KEYWORDS = new Set(
  "False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield self".split(
    " ",
  ),
);

function tokenize(code: string, lang: string): { t: string; c?: string }[] {
  const out: { t: string; c?: string }[] = [];
  const isCommentChar = lang === "python" || lang === "bash" ? "#" : "";
  let i = 0;
  while (i < code.length) {
    const ch = code[i];
    // comment
    if (isCommentChar && ch === isCommentChar) {
      let j = i;
      while (j < code.length && code[j] !== "\n") j++;
      out.push({ t: code.slice(i, j), c: "comment" });
      i = j;
      continue;
    }
    // string
    if (ch === '"' || ch === "'") {
      const quote = ch;
      const triple = code.slice(i, i + 3) === quote.repeat(3);
      const end = triple ? quote.repeat(3) : quote;
      let j = i + end.length;
      while (j < code.length && code.slice(j, j + end.length) !== end) {
        if (code[j] === "\\") j += 2;
        else j++;
      }
      j = Math.min(code.length, j + end.length);
      out.push({ t: code.slice(i, j), c: "string" });
      i = j;
      continue;
    }
    // number
    if (/[0-9]/.test(ch) && (i === 0 || !/[A-Za-z_]/.test(code[i - 1]))) {
      let j = i;
      while (j < code.length && /[0-9._]/.test(code[j])) j++;
      out.push({ t: code.slice(i, j), c: "number" });
      i = j;
      continue;
    }
    // identifier / keyword
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < code.length && /[A-Za-z0-9_]/.test(code[j])) j++;
      const word = code.slice(i, j);
      if (lang === "python" && PY_KEYWORDS.has(word)) out.push({ t: word, c: "kw" });
      else out.push({ t: word });
      i = j;
      continue;
    }
    out.push({ t: ch });
    i++;
  }
  return out;
}

const CLASS: Record<string, string> = {
  comment: "text-muted-foreground italic",
  string: "text-emerald-500 dark:text-emerald-300",
  number: "text-amber-600 dark:text-amber-300",
  kw: "text-primary font-medium",
};

export function CodeBlock({
  code,
  lang = "python",
  caption,
}: {
  code: string;
  lang?: string;
  caption?: string;
}) {
  const [copied, setCopied] = useState(false);
  const tokens = tokenize(code, lang);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <figure className="my-6 overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-1.5 text-xs">
        <span className="font-mono uppercase tracking-wide text-muted-foreground">
          {caption ?? lang}
        </span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13.5px] leading-relaxed">
        <code>
          {tokens.map((tok, k) =>
            tok.c ? (
              <span key={k} className={CLASS[tok.c]}>
                {tok.t}
              </span>
            ) : (
              <span key={k}>{tok.t}</span>
            ),
          )}
        </code>
      </pre>
    </figure>
  );
}
