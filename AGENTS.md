<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

# Engineering & Architectural Rules

All agents and developers working on this codebase (`webcamboxing`) must strictly adhere to the following simple, non-negotiable rules:

## 1. Package Management & Tooling

- **JavaScript/TypeScript**: Strictly use `pnpm` (`pnpm add`, `pnpm run`). Standard `npm` and `yarn` are prohibited.
- **Python**: Strictly use `uv` (`uv pip install`, `uv run`, `uv venv`). Standard `pip` is prohibited.
- **Git & Husky**: Maintain strict `husky` hooks (`pre-commit` and `pre-push`) running linters and type checks so unverified or broken code is never pushed to `main`.

## 2. Architecture & Frameworks

- **Monolithic Architecture**: Strictly remain a unified **Monolith** structured and scaled with **Turborepo (`turbo`)**. Never break components or backend services out into microservices.
- **UI Components (`shadcn/ui`)**: Always import and use existing `shadcn/ui` primitives (`@/components/ui/*`). Never recreate basic components (`Button`, `Card`, `Collapsible`, `Accordion`, `Input`) from scratch.
- **Animations (`framer`)**: Use `framer-motion` (`framer`) or standard Radix/Tailwind animation primitives (`tw-animate-css`). Do not write ad-hoc CSS keyframe loops.
- **Reusing Battle-Tested Libraries**: Never reinvent or hand-roll algorithms or utilities if a far superior, battle-tested library is already installed or standard (`zod`, `clsx`, `@tanstack/react-query`).

## 3. Database & SQL

- **ORM Required**: Any database access or SQL operation MUST strictly use an ORM (`Drizzle ORM` or `Prisma`). Direct raw SQL strings and manual queries are strictly prohibited.

## 4. State Management & Performance

- **TanStack Query (`@tanstack/react-query`)**: All asynchronous data fetching, caching, and server synchronization must go through strictly-typed TanStack Query hooks.
- **Performance Best Practices**: Configure sensible `staleTime` and `gcTime` (centralized in `src/config/app.config.ts`). Avoid unnecessary re-renders using clean component boundaries, memoization where appropriate, and lightweight state subscriptions.

## 5. Development Methodology & Code Quality

- **Test-Driven Development (TDD) & Test Pyramid**: Strictly follow Red-Green-Refactor TDD for every feature, state transition, and utility function before changing business logic. All code MUST be covered by three strict testing layers:
  1. **Unit Tests**: Fast, isolated verification of individual utilities, Zod schemas, hooks, and Python computer vision functions (`tests/unit/`).
  2. **Integration Tests**: Verification of state transitions, TanStack Query interactions, storage hooks, and component integration (`tests/integration/`).
  3. **End-to-End (E2E) Tests**: Full-browser and gameplay flow testing via Playwright (`tests/e2e/`).
- **XP + Clean Code + Code Complete + Pragmatic Programmer**: Keep code simple, DRY (`Don't Repeat Yourself`), orthogonal, and self-documenting (`Single Responsibility Principle`).
- **Strict TypeScript (`strict: true`)**: Zero `any` types. All functions, hooks, and services must declare explicit TypeScript `interface` contracts (`interface ProgressServiceResult`, `interface CourseConfiguration`).
- **Easy Fine-Tuning**: Keep runtime parameters, calibration thresholds, UI defaults, and constants centralized and easily configurable in `src/config/app.config.ts`.

## 6. Comments Policy (CRITICAL)

- Comments MUST ONLY be about **LEGAL** notices, **COMPLIANCE** mandates, or genuine **TODOs**.
- NEVER write comments that reiterate what the code is doing, explain task implementation logic, or leave behind debugging traces. Self-documenting code and clear function interfaces replace explanatory comments.

## 7. Communication, Teaching & Project Boundaries

- **Project Boundary Verification (`webcamboxing` strictly)**: Always verify and confirm operations strictly inside the `C:\Users\persw\OneDrive\Desktop\webcamboxing` directory. Never confuse this project with outside directories or projects (such as `top boxer`).
- **First Principles & Building Blocks Teaching**: Always write explanations in simple, clear English without unnecessary jargon or verbosity. Explain every technology, concept, or formula from the ground up using **First Principles and Building Blocks** so the user learns deeply without removing granularity or engineering control.
- **Immediate First-Principles Bug Explanations**: Whenever any bug, build error, or test failure occurs, immediately explain: (1) what the bug is, (2) exactly why it happened from first principles, and (3) why that category of bug is dangerous in professional engineering.
- **Interactive Design Decisions (LLD -> System -> Product)**: Actively involve the user in design choices across **Product Design** (gameplay feel, strictness), **System Design** (monolithic execution, ML pipeline boundaries), and **Low-Level Design (LLD)** (feature vectors, mathematical formulas, interfaces), giving the user complete control.
- **State-of-the-Art ML Classification (`No Generic Shortcuts`)**: For all webcam punch and gesture detection, strictly utilize multi-feature spatial & kinematic Machine Learning classification (`PunchMLClassifier`) over simple speed threshold shortcuts.
