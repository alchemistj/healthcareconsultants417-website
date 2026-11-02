import type { APIRoute } from "astro";
import globalCopy from "@/data/copy/_global.json";
import { getCity, SITE_ORIGIN } from "@/data/cityConfig";
import { LAUNCH_ROUTES } from "@/lib/launchRouteRegistry";

/**
 * Facts from the route registry, city config, and the audited brand name.
 * No hours, review counts, or unconfirmed claims.
 */
export function buildLlmsTxt(): string {
  const city = getCity();
  const lines = [
    `# ${globalCopy.brandName}`,
    "",
    `Canonical: ${SITE_ORIGIN}/`,
    `Phone: ${city.phoneDisplay}`,
    `Tel: ${city.phoneE164}`,
    `Address: ${city.address.street}, ${city.address.city}, ${city.address.state} ${city.address.postalCode}`,
    "",
    "Published pages:",
    "",
  ];
  for (const route of LAUNCH_ROUTES) {
    lines.push(`- [${route.linkTitle}](${SITE_ORIGIN}${route.path}): ${route.kind}`);
  }
  lines.push("");
  return lines.join("\n");
}

export const GET: APIRoute = () => {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
