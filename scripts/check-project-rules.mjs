import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import process from "node:process";

const root = process.cwd();
const problems = [];
const ignoredDirectories = new Set([
  ".git",
  ".output",
  ".turbo",
  "dist",
  "node_modules",
  "test-results",
]);
const textExtensions = new Set([
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".json",
  ".md",
  ".toml",
  ".yml",
  ".yaml",
]);
const packageToolAllowlist = new Set([
  "AGENTS.md",
  "src/config/app.config.ts",
  "scripts/check-project-rules.mjs",
]);
const commentAllowlist = new Set(["src/data/course.ts", "src/routeTree.gen.ts"]);
const typeEscapeAllowlist = new Set(["src/data/course.ts", "src/routeTree.gen.ts"]);

const toProjectPath = (path) => relative(root, path).split(sep).join("/");
const isTextFile = (path) => {
  const dotIndex = path.lastIndexOf(".");
  return dotIndex >= 0 && textExtensions.has(path.slice(dotIndex));
};

const walk = (directory) => {
  const entries = readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      return ignoredDirectories.has(entry.name) ? [] : walk(fullPath);
    }
    return entry.isFile() && isTextFile(fullPath) ? [fullPath] : [];
  });
};

const report = (path, line, message) => {
  problems.push(`${path}:${line}: ${message}`);
};

const checkPackageTools = (path, content) => {
  if (packageToolAllowlist.has(path)) return;
  const patterns = [
    { regex: /\bnpm\s+(run|install|i|test|exec)\b/g, message: "Use pnpm instead of npm." },
    { regex: /\byarn\b/g, message: "Use pnpm instead of yarn." },
    { regex: /\bnpx\b/g, message: "Use pnpm exec instead of npx." },
    { regex: /\bpython\s+-m\s+pip\b/g, message: "Use uv instead of python -m pip." },
    {
      regex: /(^|[^A-Za-z])pip\s+install\b/g,
      message: "Use uv pip install instead of pip install.",
    },
  ];
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (line.includes("uv pip install")) return;
    for (const pattern of patterns) {
      pattern.regex.lastIndex = 0;
      if (pattern.regex.test(line)) report(path, index + 1, pattern.message);
    }
  });
};

const checkTypeEscapes = (path, content) => {
  if (!/^(src|tests)\//.test(path) && !["vite.config.ts", "playwright.config.ts"].includes(path))
    return;
  if (typeEscapeAllowlist.has(path)) return;
  const lines = content.split(/\r?\n/);
  const patterns = [
    { regex: /\bas\s+unknown\s+as\b/, message: "Avoid double assertion type escapes." },
    {
      regex: /@ts-ignore|@ts-expect-error|ts-nocheck/,
      message: "Do not suppress TypeScript checks.",
    },
    {
      regex: /(:\s*any\b|\bas\s+any\b|<any>|\bany\[\])/,
      message: "Do not use any in authored TypeScript.",
    },
  ];
  lines.forEach((line, index) => {
    for (const pattern of patterns) {
      if (pattern.regex.test(line)) report(path, index + 1, pattern.message);
    }
  });
};

const checkRawSql = (path, content) => {
  if (!/^(src|tests)\//.test(path)) return;
  if (path === "src/data/course.ts") return;
  const lines = content.split(/\r?\n/);
  const sqlPattern =
    /[`'"]\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b[\s\S]*\b(FROM|INTO|TABLE|SET|WHERE)\b/i;
  lines.forEach((line, index) => {
    if (sqlPattern.test(line) && !line.includes("COMPLIANCE REQUIREMENT")) {
      report(path, index + 1, "Use an ORM for SQL instead of raw SQL text.");
    }
  });
};

const isAllowedComment = (text) => /LEGAL|COMPLIANCE|TODO|@license|<reference/.test(text);

const checkComments = (path, content) => {
  if (!/^(src|tests)\//.test(path) && !["vite.config.ts", "playwright.config.ts"].includes(path))
    return;
  if (commentAllowlist.has(path)) return;
  const lines = content.split(/\r?\n/);
  let inBlockComment = false;
  let blockCommentText = "";
  let blockCommentStart = 0;
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (inBlockComment) {
      blockCommentText += `\n${trimmed}`;
      if (trimmed.includes("*/")) {
        if (!isAllowedComment(blockCommentText)) {
          report(path, blockCommentStart, "Comments must be legal, compliance, or TODO only.");
        }
        inBlockComment = false;
        blockCommentText = "";
      }
      return;
    }
    if (trimmed.startsWith("//") && !isAllowedComment(trimmed)) {
      report(path, index + 1, "Comments must be legal, compliance, or TODO only.");
    }
    if (trimmed.includes("{/*") && !isAllowedComment(trimmed)) {
      report(path, index + 1, "JSX comments must be legal, compliance, or TODO only.");
    }
    if (trimmed.startsWith("/*")) {
      inBlockComment = true;
      blockCommentText = trimmed;
      blockCommentStart = index + 1;
      if (trimmed.includes("*/")) {
        if (!isAllowedComment(blockCommentText)) {
          report(path, blockCommentStart, "Comments must be legal, compliance, or TODO only.");
        }
        inBlockComment = false;
        blockCommentText = "";
      }
    }
  });
};

const requiredDirectories = ["tests/unit", "tests/integration", "tests/e2e"];

if (existsSync(join(root, "package-lock.json"))) {
  problems.push("package-lock.json:1: Use pnpm-lock.yaml, not package-lock.json.");
}

for (const directory of requiredDirectories) {
  const fullPath = join(root, directory);
  if (!existsSync(fullPath) || !statSync(fullPath).isDirectory()) {
    problems.push(`${directory}:1: Required test directory is missing.`);
  }
}

for (const file of walk(root)) {
  const path = toProjectPath(file);
  const content = readFileSync(file, "utf8");
  checkPackageTools(path, content);
  checkTypeEscapes(path, content);
  checkRawSql(path, content);
  checkComments(path, content);
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
