import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { allLessons } from "@/data/course";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths: string[] = [
          "/",
          "/curriculum",
          "/glossary",
          "/resources",
          ...allLessons.map((x) => `/lessons/${x.module.id}/${x.lesson.id}`),
        ];
        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          paths.map((p) => `  <url><loc>${BASE_URL}${p}</loc></url>`).join("\n") +
          `\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
