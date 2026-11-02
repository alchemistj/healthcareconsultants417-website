import type { APIRoute } from "astro";
import { SITE_ORIGIN } from "@/data/cityConfig";

/** The scratch page is the only disallowed path. Everything published is allowed. */
export function buildRobotsTxt(): string {
  return `User-agent: *\nDisallow: /_dev/\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`;
}

export const GET: APIRoute = () => {
  return new Response(buildRobotsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
