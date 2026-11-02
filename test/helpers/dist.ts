/**
 * Load built HTML from dist. Shared by every lane's tests.
 * Route paths use the public form with a trailing slash: "/", "/about/".
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const DIST_DIR = join(REPO_ROOT, "dist");

export function distExists(): boolean {
  return existsSync(DIST_DIR);
}

/** File path in dist for a route ("/about/" -> dist/about/index.html). */
export function htmlPathForRoute(route: string): string {
  const clean = route.replace(/^\/+/, "");
  return join(DIST_DIR, clean, "index.html");
}

export function builtPageExists(route: string): boolean {
  return existsSync(htmlPathForRoute(route));
}

/** Built HTML for one route. Throws a clear error if the build is missing the page. */
export function readBuiltHtml(route: string): string {
  const file = htmlPathForRoute(route);
  if (!existsSync(file)) {
    throw new Error(`No built page for ${route} (looked for ${file}). Run npm run build first.`);
  }
  return readFileSync(file, "utf8");
}

/** Every built HTML file under dist, as { route, file }. */
export function listBuiltPages(): { route: string; file: string }[] {
  const pages: { route: string; file: string }[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name === "index.html") {
        const rel = full.slice(DIST_DIR.length).replace(/\\/g, "/").replace(/index\.html$/, "");
        pages.push({ route: rel === "" ? "/" : rel, file: full });
      }
    }
  };
  if (distExists()) walk(DIST_DIR);
  return pages.sort((a, b) => a.route.localeCompare(b.route));
}
