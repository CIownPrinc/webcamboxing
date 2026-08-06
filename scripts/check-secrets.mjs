import { spawnSync } from "node:child_process";

const secretPattern = [
  "AIza[0-9A-Za-z_-]{35}",
  "sk-[A-Za-z0-9_-]{20,}",
  "gh[pousr]_[A-Za-z0-9_]{20,}",
  "github_pat_[A-Za-z0-9_]{20,}",
  "AKIA[0-9A-Z]{16}",
  "-----BEGIN [A-Z ]*PRIVATE KEY-----",
  "xox[baprs]-[A-Za-z0-9-]{10,}",
].join("|");

const blockedPathPattern = /(^|\/)(\.claude|\.codex)(\/|$)|(^|\/)\.env(?:\.[^/]+)?$/i;

const runGit = (args) => spawnSync("git", args, { encoding: "utf8" });

const fail = (message) => {
  process.stderr.write(`Secret scan failed: ${message}\n`);
  process.exitCode = 1;
};

const stagedFiles = runGit(["diff", "--cached", "--name-only", "--diff-filter=ACMR"]);

if (stagedFiles.status !== 0) {
  fail("could not read staged files.");
} else {
  const blockedFiles = stagedFiles.stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((file) => blockedPathPattern.test(file));

  if (blockedFiles.length > 0) {
    fail(`blocked local or environment file staged: ${blockedFiles.join(", ")}`);
  }
}

const stagedSecrets = runGit(["diff", "--cached", "-G", secretPattern, "--name-only"]);

if (stagedSecrets.status !== 0) {
  fail("could not scan staged content.");
} else if (stagedSecrets.stdout.trim()) {
  fail(
    `potential credential found in staged content: ${stagedSecrets.stdout.trim().split(/\r?\n/).join(", ")}`,
  );
}

if (process.argv.includes("--history")) {
  const historySecrets = runGit(["log", "--all", "-G", secretPattern, "--format=%H", "--no-patch"]);

  if (historySecrets.status !== 0) {
    fail("could not scan reachable Git history.");
  } else if (historySecrets.stdout.trim()) {
    fail(
      "potential credential found in reachable Git history. Rotate it and remove it with a coordinated history-cleanup plan before publishing.",
    );
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

process.stdout.write("Secret scan passed.\n");
