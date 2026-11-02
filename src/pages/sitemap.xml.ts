import type { APIRoute } from "astro";
import { SITE_ORIGIN } from "@/data/cityConfig";
import { LAUNCH_ROUTES } from "@/lib/launchRouteRegistry";

/** Published registry paths only, in registry order. */
export function sitemapPaths(): string[] {
  return LAUNCH_ROUTES.map((route) => route.path);
}

export function buildSitemapXml(): string {
  const urls = sitemapPaths()
    .map((path) => `  <url><loc>${SITE_ORIGIN}${path}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export const GET: APIRoute = () => {
  return new Response(buildSitemapXml(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
