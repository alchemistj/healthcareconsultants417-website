/**
 * One registry of every published URL. Sitemap, llms.txt, robots, internal-link checks and
 * tests read this list so they cannot disagree. A page not listed here is not published.
 * Legal pages stay optional and unpublished. Josh, Nov 2: do not build or publish
 * /privacy-policy/ or /terms/.
 */

import { CITIES, getActiveCitySlugs } from "@/data/cityConfig";

export type LaunchRouteKind =
  | "home"
  | "about"
  | "owner"
  | "company"
  | "service"
  | "contact"
  | "legal";

export type LaunchRoute = {
  path: string;
  kind: LaunchRouteKind;
  /** Lane that builds the page (see docs/BUILD-SPEC.md). */
  lane: "C" | "D" | "E";
  /** Short page name for llms.txt and link checks. Not page copy. */
  linkTitle: string;
  /** Optional routes publish only when the copy exists. */
  optional?: boolean;
  /** Legal routes stay false. Josh, Nov 2: privacy and terms are not built. */
  published: boolean;
  /** Old URL(s) this page replaces (redirects are Lane F's job). */
  legacyPaths?: readonly string[];
};

const SERVICE_LEGACY: Record<string, readonly string[]> = {
  "senior-community-placement": ["/services/community-placement/"],
  "senior-relocation": ["/senior-relocation-services/", "/services/relocation/"],
  "senior-downsizing": ["/senior-downsizing-help/"],
  "zpod-sensory-beds": ["/zpod-beds/", "/services/assistive-technology/"],
  "suicide-awareness": ["/services/suicide-awareness/"],
  "transitional-care": ["/services/transitional-care/"],
  "hospital-to-home-transition": ["/services/hospital-to-home-transition/"],
};

const COMPANY_ROUTES: readonly LaunchRoute[] = [
  { path: "/", kind: "home", lane: "C", linkTitle: "Home", published: true, legacyPaths: ["/"] },
  { path: "/about/", kind: "about", lane: "C", linkTitle: "About Us", published: true, legacyPaths: ["/about-us/"] },
  {
    path: "/about-rachal-payne/",
    kind: "owner",
    lane: "C",
    linkTitle: "Rachal Payne",
    published: true,
    legacyPaths: ["/team/rachal-payne/"],
  },
  {
    path: "/zpods-medical-mission/",
    kind: "company",
    lane: "C",
    linkTitle: "zPods Medical Mission",
    published: true,
    legacyPaths: ["/zpods-medical-mission/"],
  },
  {
    path: "/transitional-healthcare/",
    kind: "company",
    lane: "C",
    linkTitle: "Transitional Healthcare",
    published: true,
    legacyPaths: ["/transitional-healthcare/"],
  },
  { path: "/resources/", kind: "company", lane: "C", linkTitle: "Resources", published: true, legacyPaths: ["/resources/"] },
];

const LEGAL_ROUTES: readonly LaunchRoute[] = [
  { path: "/privacy-policy/", kind: "legal", lane: "E", linkTitle: "Privacy Policy", optional: true, published: false },
  { path: "/terms/", kind: "legal", lane: "E", linkTitle: "Terms of Use", optional: true, published: false },
];

function cityRoutes(): LaunchRoute[] {
  const routes: LaunchRoute[] = [];
  for (const city of CITIES) {
    if (!getActiveCitySlugs().includes(city.slug)) continue;
    for (const service of city.services) {
      routes.push({
        path: `/${city.slug}/${service.slug}/`,
        kind: "service",
        lane: "D",
        linkTitle: service.name,
        published: true,
        legacyPaths: SERVICE_LEGACY[service.slug],
      });
    }
    routes.push({
      path: `/${city.slug}/contact/`,
      kind: "contact",
      lane: "E",
      linkTitle: "Contact Us",
      published: true,
      legacyPaths: ["/contact-us/"],
    });
  }
  return routes;
}

/** Every URL in the route table, including optional/unpublished ones. */
export const ALL_ROUTES: readonly LaunchRoute[] = [...COMPANY_ROUTES, ...cityRoutes(), ...LEGAL_ROUTES];

/** Only published routes. Sitemap, llms.txt and link checks use this. */
export const LAUNCH_ROUTES: readonly LaunchRoute[] = ALL_ROUTES.filter((r) => r.published);

export const LAUNCH_PATHS: ReadonlySet<string> = new Set(LAUNCH_ROUTES.map((r) => r.path));

export function isPublishedPath(path: string): boolean {
  return LAUNCH_PATHS.has(path);
}
