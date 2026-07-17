<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history: no force pushing, rebasing, amending, or squashing
> commits that are already pushed. Rewriting history can break Lovable sync and
> cause project history loss.
>
> Commits pushed to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch working before pushing.

<!-- LOVABLE:END -->

# AGENTS.md

Simple rules for every agent and developer working in `C:\Users\persw\OneDrive\Desktop\webcamboxing`.

## Project Boundary

- Work only inside this `webcamboxing` repo unless the user explicitly approves another path.
- Do not confuse this project with other local folders.
- Read the existing code before changing it. Preserve the product shape unless the user approves a bigger design change.

## Package Tools

- Use `pnpm` for JavaScript and TypeScript. Do not use `npm`, `yarn`, or `npx`.
- Use `uv` for Python. Do not use direct `pip` or `python -m pip`.
- Keep one lockfile path: `pnpm-lock.yaml` for JS/TS and `uv.lock` only if Python dependencies are added.

## Architecture

- Keep the app as one monolith. Use Turborepo (`turbo`) to organize checks and builds; do not split into microservices.
- The current frontend stack is TanStack Start, React, Vite, Tailwind, and shadcn/ui. Do not migrate frameworks, including to Next.js, without an explicit architecture decision from the user.
- Put runtime knobs, thresholds, defaults, timings, and tuning values in `src/config/app.config.ts`.

## UI And Libraries

- Use shadcn/ui primitives from `@/components/ui/*` for basic UI pieces such as buttons, cards, dialogs, accordions, collapsibles, inputs, selects, tabs, switches, sliders, and tooltips.
- Use existing battle-tested libraries before writing custom infrastructure. Prefer `zod`, `clsx`, `tailwind-merge`, Radix, TanStack Query, TanStack Router, and existing shadcn components where they fit.
- Use `tw-animate-css`, Radix animation behavior, or `framer-motion` when animation is needed. Do not create ad-hoc animation systems.

## Data And SQL

- Any database or SQL work must go through an ORM such as Drizzle ORM or Prisma.
- Do not write raw SQL strings or hand-built SQL query functions.

## Async State And Performance

- Server data, async data fetching, caching, retries, and synchronization must use strictly typed TanStack Query hooks.
- Use the query defaults in `src/config/app.config.ts` unless a feature has a clear reason to override them.
- Keep component boundaries small enough that state changes do not rerender unrelated UI.

## Type Safety

- TypeScript must stay strict.
- Do not add `any`, `@ts-ignore`, `@ts-expect-error`, or `ts-nocheck` in authored files.
- Generated files may contain generated typing escapes, but do not edit generated files by hand.
- Exported functions, hooks, services, and shared helpers must declare explicit interfaces and return types.

## Tests

- Follow TDD: write or update the failing test first, then make it pass, then refactor.
- Keep the test pyramid:
  - Unit tests in `tests/unit/`.
  - Integration tests in `tests/integration/`.
  - End-to-end tests in `tests/e2e/`.
- Use Vitest for unit and integration tests.
- Use Playwright for browser and full course flow tests.
- Husky pre-commit and pre-push hooks must run verification. Do not bypass hooks unless the user explicitly asks.

## Code Quality

- Follow XP, Clean Code, Code Complete, and Pragmatic Programmer principles in practical terms: small functions, clear names, low duplication, simple control flow, and code that explains itself through structure.
- Keep changes scoped. Do not refactor unrelated areas unless needed for the task.
- Avoid home-built versions of solved problems when a reliable package already exists.

## Comments

- Comments are allowed only for legal notices, compliance rules, or real TODOs.
- Do not add comments that repeat what the code does, explain temporary debugging, narrate implementation steps, or restate the task.

## Webcam Boxing ML

- Punch and gesture detection must use multi-feature spatial and kinematic classification.
- Do not replace the classifier with a simple speed-threshold shortcut as the final approach.
- Make ML thresholds and model parameters easy to tune from configuration.

## Teaching Style

- Explain work in simple English.
- Use first principles: start from the smallest useful building block, then connect it to the system.
- Keep engineering granularity. Do not hide important details, but avoid jargon when plain words work.
- When a bug, test failure, or build failure happens, explain what it is, why it happened, and why that class of bug matters in real software.
- Involve the user in product design, system design, and low-level design decisions when the decision changes behavior, architecture, or learning outcomes.
