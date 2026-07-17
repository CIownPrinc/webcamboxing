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
      { title: "Python Computer Vision Game Architecture & Modularity | Webcam Boxing" },
      {
        name: "description",
        content:
          "Explore clean, modular Python game architecture. See how OpenCV video pipelines, MediaPipe landmarkers, finite state machines, and Pygame rendering fit together.",
      },
      {
        property: "og:title",
        content: "Python Computer Vision Game Architecture & Modularity | Webcam Boxing",
      },
      {
        property: "og:description",
        content:
          "Explore clean, modular Python game architecture. See how OpenCV video pipelines, MediaPipe landmarkers, finite state machines, and Pygame rendering fit together.",
      },
      { property: "og:url", content: "https://webcamboxing.com/architecture" },
    ],
    links: [{ rel: "canonical", href: "https://webcamboxing.com/architecture" }],
  }),
  component: ArchitecturePage,
});

function ArchitecturePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Python Computer Vision Game Architecture & Modularity",
    description:
      "Explore how Python computer vision games split camera, tracking, game state, and drawing code into separate files.",
    about: ["Software Architecture", "Python programming", "Game Development", "Computer Vision"],
    author: {
      "@type": "Organization",
      name: "Webcam Boxing",
      sameAs: "https://webcamboxing.com/",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://webcamboxing.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Architecture",
        item: "https://webcamboxing.com/architecture",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
            Instead of putting everything inside 1 giant `main.py` script, this project gives each
            job its own file (`camera.py`, `tracker.py`, `player.py`, etc.). Click any file below to
            see what it owns and what its starter code looks like.
          </p>
        </div>

        <ProjectArchitectureViewer />
      </main>
    </div>
  );
}
