import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { allLessons } from "@/data/course";

const BASE_URL = "https://webcamboxing.com";

interface SitemapEntry {
  path: string;
  priority: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const now = new Date().toISOString().split("T")[0];
        const entries: SitemapEntry[] = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/curriculum", priority: "0.9", changefreq: "weekly" },
          { path: "/glossary", priority: "0.8", changefreq: "monthly" },
          { path: "/resources", priority: "0.8", changefreq: "monthly" },
          { path: "/architecture", priority: "0.8", changefreq: "monthly" },
          ...allLessons.map((x) => ({
            path: `/lessons/${x.module.id}/${x.lesson.id}`,
            priority: "0.9",
            changefreq: "monthly" as const,
          })),
        ];

        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          entries
            .map(
              (e) =>
                `  <url>\n` +
                `    <loc>${BASE_URL}${e.path}</loc>\n` +
                `    <lastmod>${now}</lastmod>\n` +
                `    <changefreq>${e.changefreq}</changefreq>\n` +
                `    <priority>${e.priority}</priority>\n` +
                `  </url>`,
            )
            .join("\n") +
          `\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
