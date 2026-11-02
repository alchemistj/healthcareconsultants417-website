/**
 * One redirect map. vercel.json is generated from buildVercelConfig() and must match it.
 * Every legacy source is listed once, with a trailing slash. Both slash forms are emitted
 * and both land on the final registry path in one hop (no slash-normalize step in between).
 * The apex host gets the same destinations as absolute https://www URLs, then a catch-all
 * that preserves any other path (the two PDFs). www path rules are relative.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_ORIGIN } from "@/data/cityConfig";
import { LAUNCH_PATHS, LAUNCH_ROUTES } from "@/lib/launchRouteRegistry";

export const APEX_HOST = "healthcareconsultants417.com";

export type LogicalRedirect = {
  /** Legacy path with a trailing slash, or a one-segment wildcard such as `/team/:member/`. */
  source: string;
  /** Published registry path. */
  destination: string;
  reason: string;
};

export type VercelRedirect = {
  source: string;
  destination: string;
  statusCode: 301;
  has?: { type: "host"; value: string }[];
};

const CSV_PATH = join(dirname(fileURLToPath(import.meta.url)), "../../docs/legacy-redirects.csv");

function withSlash(path: string): string {
  if (path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

function withoutSlash(path: string): string {
  if (path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
}

function readCsvRedirects(): LogicalRedirect[] {
  const lines = readFileSync(CSV_PATH, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("source,"));
  return lines.map((line) => {
    const [source, , target] = line.split(",");
    if (!source || !target) throw new Error(`Bad legacy redirect row: ${line}`);
    return {
      source: withSlash(source.trim()),
      destination: target.trim() === "/" ? "/" : withSlash(target.trim()),
      reason: "docs/legacy-redirects.csv",
    };
  });
}

function fromRegistry(): LogicalRedirect[] {
  const out: LogicalRedirect[] = [];
  for (const route of LAUNCH_ROUTES) {
    for (const legacy of route.legacyPaths ?? []) {
      const source = withSlash(legacy);
      if (source === route.path) continue;
      out.push({ source, destination: route.path, reason: `route table → ${route.path}` });
    }
  }
  return out;
}

/** Old URLs that are not a renamed registry page and are not already in the EPS csv. */
const EXTRA_REDIRECTS: readonly LogicalRedirect[] = [
  { source: "/contact-us-2-2/", destination: "/", reason: "old Services page" },
  { source: "/contact-us-2/", destination: "/", reason: "BUILD-SPEC redirect list" },
  { source: "/third-tuesday-suicide-loss-support-group/", destination: "/springfield/suicide-awareness/", reason: "blog post" },
  { source: "/rise-thrive-podcast/", destination: "/resources/", reason: "blog post" },
  { source: "/veterans-military-coalition-of-the-ozarks/", destination: "/springfield/suicide-awareness/", reason: "veterans-* blog post" },
  { source: "/veterans-of-the-ozarks-suicide-prevention/", destination: "/springfield/suicide-awareness/", reason: "veterans-* blog post" },
  { source: "/shop/", destination: "/", reason: "WooCommerce" },
  { source: "/cart/", destination: "/", reason: "WooCommerce" },
  { source: "/checkout/", destination: "/", reason: "WooCommerce" },
  { source: "/my-account/", destination: "/", reason: "WooCommerce" },
  { source: "/wishlist/", destination: "/", reason: "WooCommerce" },
  { source: "/shop-10/", destination: "/", reason: "WooCommerce" },
  { source: "/my-account-2/", destination: "/", reason: "WooCommerce" },
  { source: "/product/:slug/", destination: "/", reason: "WooCommerce product" },
  { source: "/category/life-insurance-tips/", destination: "/resources/", reason: "only blog category; the life-insurance post also goes to Resources" },
  // After Rachal's specific rule from the route table. Any other /team/ slug goes to About.
  { source: "/team/:member/", destination: "/about/", reason: "team pages except Rachal Payne" },
];

function mergeRedirects(groups: readonly LogicalRedirect[][]): LogicalRedirect[] {
  const bySource = new Map<string, LogicalRedirect>();
  for (const group of groups) {
    for (const rule of group) {
      if (!LAUNCH_PATHS.has(rule.destination)) {
        throw new Error(`Redirect target is not a published route: ${rule.source} → ${rule.destination}`);
      }
      const existing = bySource.get(rule.source);
      if (existing && existing.destination !== rule.destination) {
        throw new Error(`Redirect conflict for ${rule.source}: ${existing.destination} vs ${rule.destination}`);
      }
      if (!existing) bySource.set(rule.source, rule);
    }
  }
  return [...bySource.values()];
}

/** Logical legacy redirects (one row per source, trailing-slash form). */
export function logicalRedirects(): LogicalRedirect[] {
  return mergeRedirects([fromRegistry(), readCsvRedirects(), [...EXTRA_REDIRECTS]]);
}

function absoluteDestination(path: string): string {
  return `${SITE_ORIGIN}${path === "/" ? "/" : path}`;
}

/** Path redirects on the canonical host, then no-slash → slash for every published page. */
export function pathRedirects(): VercelRedirect[] {
  const rules: VercelRedirect[] = [];
  const seen = new Set<string>();
  const add = (source: string, destination: string) => {
    if (source === destination) return;
    if (seen.has(source)) throw new Error(`Duplicate redirect source: ${source}`);
    seen.add(source);
    rules.push({ source, destination, statusCode: 301 });
  };

  for (const rule of logicalRedirects()) {
    add(withoutSlash(rule.source), rule.destination);
    add(withSlash(rule.source), rule.destination);
  }
  for (const route of LAUNCH_ROUTES) {
    if (route.path === "/") continue;
    add(withoutSlash(route.path), route.path);
  }
  return rules;
}

export function buildVercelRedirects(): VercelRedirect[] {
  const paths = pathRedirects();
  const apex = paths.map((rule) => ({
    source: rule.source,
    has: [{ type: "host" as const, value: APEX_HOST }],
    destination: absoluteDestination(rule.destination),
    statusCode: 301 as const,
  }));
  // Replace :slug tokens in absolute destinations (none today except the catch-all).
  const catchAll: VercelRedirect = {
    source: "/:path*",
    has: [{ type: "host", value: APEX_HOST }],
    destination: `${SITE_ORIGIN}/:path*`,
    statusCode: 301,
  };
  return [...apex, catchAll, ...paths];
}

export function buildVercelConfig(): { cleanUrls: false; redirects: VercelRedirect[] } {
  return { cleanUrls: false, redirects: buildVercelRedirects() };
}

function sourceRegex(source: string): RegExp {
  const body = source
    .split("/")
    .map((segment) => {
      if (segment === ":path*") return "(?<path>.*)";
      if (segment.startsWith(":")) return `(?<${segment.slice(1)}>[^/]+)`;
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");
  return new RegExp(`^${body}$`);
}

/** First matching vercel.json rule for this host. Null means the path is already final. */
export function resolveRedirect(pathname: string, host = `www.${APEX_HOST}`): string | null {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  for (const rule of buildVercelRedirects()) {
    if (rule.has && !rule.has.some((item) => item.type === "host" && item.value === host)) continue;
    const match = sourceRegex(rule.source).exec(path);
    if (!match) continue;
    let destination = rule.destination;
    const groups = match.groups ?? {};
    if ("path" in groups) destination = destination.replace(":path*", groups.path ?? "");
    for (const [key, value] of Object.entries(groups)) {
      if (key === "path") continue;
      destination = destination.replaceAll(`:${key}`, value ?? "");
    }
    return destination;
  }
  return null;
}
