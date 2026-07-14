/**
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind.
 */

// COMPLIANCE REQUIREMENT: Architecture route must render the modular file responsibility explorer without inline implementation commentary.

import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ProjectArchitectureViewer } from "@/components/ProjectArchitectureViewer";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Project Architecture & Modularity | Webcam Boxing" },
      {
        name: "description",
        content:
          "Explore how professional Python computer vision games organize code into clean, modular files.",
      },
    ],
  }),
  component: ArchitecturePage,
});

function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Modular Design Philosophy
          </p>
          <h1 className="mt-1 font-display text-4xl leading-tight md:text-5xl">
            Project Architecture
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground text-base">
            Instead of writing everything inside 1 giant `main.py` script, real-world engineering
            separates responsibilities into clean, orthogonal modules (`camera.py`, `tracker.py`,
            `player.py`, etc.). Click any file below to inspect its exact role and code skeleton.
          </p>
        </div>

        <ProjectArchitectureViewer />
      </main>
    </div>
  );
}
