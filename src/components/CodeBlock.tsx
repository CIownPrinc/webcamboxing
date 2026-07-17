import { Check, Copy, Download, FileCode2, Terminal } from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";

import { APP_CONFIG } from "@/config/app.config";
import { Button } from "@/components/ui/button";

interface TokenizedCodePart {
  readonly t: string;
  readonly c?: string;
}

interface CodeBlockProps {
  readonly code: string;
  readonly lang?: string;
  readonly caption?: string;
}

interface CodeBlockLabel {
  readonly filename: string;
  readonly instruction: string | null;
}

const PY_KEYWORDS = new Set(
  "False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield self".split(
    " ",
  ),
);

function tokenize(code: string, lang: string): TokenizedCodePart[] {
  const out: TokenizedCodePart[] = [];
  const isCommentChar = lang === "python" || lang === "bash" ? "#" : "";
  let i = 0;
  while (i < code.length) {
    const ch = code[i];
    if (isCommentChar && ch === isCommentChar) {
      let j = i;
      while (j < code.length && code[j] !== "\n") j++;
      out.push({ t: code.slice(i, j), c: "comment" });
      i = j;
      continue;
    }
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
    if (/[0-9]/.test(ch) && (i === 0 || !/[A-Za-z_]/.test(code[i - 1]))) {
      let j = i;
      while (j < code.length && /[0-9._]/.test(code[j])) j++;
      out.push({ t: code.slice(i, j), c: "number" });
      i = j;
      continue;
    }
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

function getCodeBlockLabel(
  code: string,
  caption?: string,
  lang: string = "python",
): CodeBlockLabel {
  if (caption) {
    const [rawFile, ...rawInstruction] = caption.split(":");
    const filename = rawFile.trim();
    if (/\.(py|js|ts|sh|json|css|html|txt)$/i.test(filename)) {
      const instruction = rawInstruction.join(":").trim();
      return { filename, instruction: instruction.length > 0 ? instruction : null };
    }
  }
  const firstLine = code.split("\n")[0].trim();
  if (firstLine.startsWith("#")) {
    const raw = firstLine
      .replace(/^#+\s*/, "")
      .split(":")[0]
      .trim();
    if (/\.(py|js|ts|sh|json|css|html|txt)$/i.test(raw)) {
      return { filename: raw, instruction: null };
    }
  }
  const ext = lang === "python" ? "py" : lang === "bash" ? "sh" : "txt";
  return { filename: `snippet.${ext}`, instruction: null };
}

export function CodeBlock({ code, lang = "python", caption }: CodeBlockProps): ReactElement {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const tokens = tokenize(code, lang);
  const { filename, instruction } = getCodeBlockLabel(code, caption, lang);
  const isSnippet = filename.startsWith("snippet.");
  const displayLabel = !isSnippet ? filename : (caption ?? lang);
  const fileActionLabel = instruction ? "ADD TO" : "FILE";

  const copy = async (): Promise<void> => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), APP_CONFIG.ui.copyFeedbackResetMilliseconds);
  };

  const download = (): void => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), APP_CONFIG.ui.copyFeedbackResetMilliseconds);
  };

  return (
    <figure className="neo-inset my-6 overflow-hidden rounded-xl border border-border/80 bg-background/70 backdrop-blur">
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-3.5 py-2 text-xs">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 text-foreground">
            {!isSnippet ? (
              <FileCode2 className="h-4 w-4 text-primary" />
            ) : lang === "bash" ? (
              <Terminal className="h-4 w-4 text-muted-foreground" />
            ) : (
              <FileCode2 className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="font-mono font-bold tracking-wide">
              {!isSnippet ? `${fileActionLabel}: ${displayLabel}` : displayLabel.toUpperCase()}
            </span>
          </div>

          {!isSnippet && (
            <span className="text-[11px] text-muted-foreground font-medium ml-6">
              {instruction ? (
                <>
                  {instruction} <strong className="text-foreground">{displayLabel}</strong>.
                </>
              ) : (
                <>
                  Open or create <strong className="text-foreground">{displayLabel}</strong> in your
                  project folder and type this code.
                </>
              )}
            </span>
          )}
          {isSnippet && lang === "bash" && (
            <span className="text-[11px] text-muted-foreground font-medium ml-6">
              Run this command in your VS Code terminal.
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={download}
            className="h-7 gap-1.5 border-border/60 bg-card/60 px-2.5 text-xs font-medium text-muted-foreground shadow-sm hover:bg-card hover:text-foreground"
            aria-label={`Download ${filename}`}
            title={`Download as ${filename}`}
          >
            {downloaded ? (
              <Check className="h-3 w-3 text-primary" />
            ) : (
              <Download className="h-3 w-3" />
            )}
            <span>{downloaded ? "Saved" : filename}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copy}
            className="h-7 gap-1.5 border-border/60 bg-card/60 px-2.5 text-xs font-medium text-muted-foreground shadow-sm hover:bg-card hover:text-foreground"
            aria-label="Copy code"
          >
            {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
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
