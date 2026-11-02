import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { LAUNCH_ROUTES, type LaunchRoute } from "../../src/lib/launchRouteRegistry.ts";
import { assertImageLock, assertOriginalHashes, manifestEntryName, type ManifestEntry } from "../helpers/imageLock.ts";
import { REPO_ROOT, builtPageExists, readBuiltHtml } from "../helpers/dist.ts";

type ManifestImage = {
  hidden?: boolean;
  mobile_only?: boolean;
  file: string;
  sha256: string;
};

type ManifestPage = {
  url: string;
  images: ManifestImage[];
};

const manifest = JSON.parse(readFileSync(join(REPO_ROOT, "src/data/legacyImageManifest.json"), "utf8")) as {
  pages: ManifestPage[];
  logo: { file: string; sha256: string };
};

export type ImageSubstitution = {
  page: string;
  slot: string;
  replaces: string;
  chosen: string;
  reason: string;
};

function pathname(url: string): string {
  const path = new URL(url).pathname || "/";
  return path.endsWith("/") ? path : `${path}/`;
}

function manifestPagesFor(route: LaunchRoute): ManifestPage[] {
  const keys = new Set([route.path, ...(route.legacyPaths ?? [])].map((path) => (path.endsWith("/") ? path : `${path}/`)));
  return manifest.pages.filter((page) => keys.has(pathname(page.url)));
}

function headerIndex(cells: string[]): Record<string, number> {
  const aliases: Record<string, string> = {
    page: "page",
    path: "page",
    route: "page",
    slot: "slot",
    order: "slot",
    replaces: "replaces",
    demo: "replaces",
    "demo file": "replaces",
    chosen: "chosen",
    file: "chosen",
    "her file": "chosen",
    photo: "chosen",
    reason: "reason",
  };
  const index: Record<string, number> = {};
  cells.forEach((cell, i) => {
    const key = aliases[cell.trim().toLowerCase()];
    if (key) index[key] = i;
  });
  return index;
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim().replace(/^`|`$/g, ""));
}

/**
 * Reads docs/image-substitutions/*.md.
 * Expected table: page, slot, replaces (demo file), chosen (her file), reason.
 */
export function parseSubstitutionMarkdown(markdown: string, file = "substitutions.md"): ImageSubstitution[] {
  const lines = markdown.split(/\r?\n/);
  const rows: ImageSubstitution[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith("|")) continue;
    const header = headerIndex(splitRow(line));
    if (header.page === undefined || header.replaces === undefined || header.chosen === undefined) continue;
    for (let j = i + 1; j < lines.length; j++) {
      const rowLine = lines[j].trim();
      if (!rowLine.startsWith("|")) break;
      if (/^\|\s*-+/.test(rowLine)) continue;
      const cells = splitRow(rowLine);
      const page = cells[header.page] ?? "";
      const replaces = cells[header.replaces] ?? "";
      const chosen = cells[header.chosen] ?? "";
      if (!page || !replaces || !chosen) throw new Error(`${file} has a substitution row missing page, replaces, or chosen`);
      rows.push({
        page: page.endsWith("/") ? page : `${page}/`,
        slot: header.slot === undefined ? "" : (cells[header.slot] ?? ""),
        replaces: manifestEntryName(replaces),
        chosen: manifestEntryName(chosen),
        reason: header.reason === undefined ? "" : (cells[header.reason] ?? ""),
      });
    }
    break;
  }
  return rows;
}

export function loadSubstitutions(): ImageSubstitution[] {
  const dir = join(REPO_ROOT, "docs/image-substitutions");
  if (!existsSync(dir)) return [];
  const rows: ImageSubstitution[] = [];
  for (const name of readdirSync(dir).filter((file) => file.endsWith(".md")).sort()) {
    rows.push(...parseSubstitutionMarkdown(readFileSync(join(dir, name), "utf8"), name));
  }
  return rows;
}

function visibleStems(page: ManifestPage): string[] {
  const stems = page.images
    .filter((image) => !image.hidden && !image.mobile_only)
    .map((image) => manifestEntryName(image.file as ManifestEntry));
  return stems.filter((stem, index) => index === 0 || stem !== stems[index - 1]);
}

export function expectedStems(routePath: string, page: ManifestPage, subs: readonly ImageSubstitution[]): string[] {
  const stems = visibleStems(page);
  for (const sub of subs.filter((item) => item.page === routePath)) {
    const index = stems.indexOf(sub.replaces);
    if (index >= 0) {
      stems[index] = sub.chosen;
      continue;
    }
    const slot = Number(sub.slot);
    if (Number.isInteger(slot) && slot >= 1) stems.splice(Math.min(slot - 1, stems.length), 0, sub.chosen);
    else stems.push(sub.chosen);
  }
  return stems;
}

function stripChrome(html: string): string {
  return html.replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, "").replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, "");
}

test("substitution log parser reads the table the other jobs write", () => {
  const parsed = parseSubstitutionMarkdown(`
| page | slot | replaces | chosen | reason |
| --- | --- | --- | --- | --- |
| /about/ | 2 | section-bg.jpg | rachal.webp | Theme demo slot, her portrait |
`);
  assert.deepEqual(parsed, [
    { page: "/about/", slot: "2", replaces: "section-bg", chosen: "rachal", reason: "Theme demo slot, her portrait" },
  ]);
});

test("every published route maps to one manifest page", () => {
  for (const route of LAUNCH_ROUTES) {
    const found = manifestPagesFor(route);
    assert.equal(found.length, 1, `${route.path} matched ${found.length} manifest pages`);
  }
});

test("logged substitutions name a published route", () => {
  const published = new Set(LAUNCH_ROUTES.map((route) => route.path));
  for (const sub of loadSubstitutions()) {
    assert.ok(published.has(sub.page), `${sub.page} is not a published route`);
    assert.ok(sub.reason.length > 0, `${sub.page} substitution has no reason`);
  }
});

test("legacy original files still match the manifest SHA-256", () => {
  const entries = [
    { path: join(REPO_ROOT, manifest.logo.file), sha256: manifest.logo.sha256 },
    ...manifest.pages.flatMap((page) =>
      page.images.map((image) => ({ path: join(REPO_ROOT, image.file), sha256: image.sha256 })),
    ),
  ];
  assertOriginalHashes(entries);
});

for (const route of LAUNCH_ROUTES) {
  test(`image lock ${route.path}`, { skip: builtPageExists(route.path) ? false : `skip: ${route.path} is not built yet` }, () => {
    const [page] = manifestPagesFor(route);
    assert.ok(page, route.path);
    const expected = expectedStems(route.path, page, loadSubstitutions());
    assertImageLock(stripChrome(readBuiltHtml(route.path)), expected.map((stem) => `${stem}.bin`), route.path);
  });
}
