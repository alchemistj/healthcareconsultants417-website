import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { getCity, SITE_ORIGIN } from "../../src/data/cityConfig.ts";
import { LAUNCH_PATHS, LAUNCH_ROUTES } from "../../src/lib/launchRouteRegistry.ts";
import { buildLlmsTxt } from "../../src/pages/llms.txt.ts";
import { buildRobotsTxt } from "../../src/pages/robots.txt.ts";
import { buildSitemapXml } from "../../src/pages/sitemap.xml.ts";
import { DIST_DIR, builtPageExists, distExists, htmlPathForRoute, listBuiltPages, readBuiltHtml } from "../helpers/dist.ts";

const city = getCity();
const NAP_DIGITS = "4177200818";
const ALLOWED_UPLOADS = new Set([
  "/wp-content/uploads/2024/11/About-zPods.pdf",
  "/wp-content/uploads/2024/12/Medical-Mission-3-1.pdf",
]);

function walkFiles(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

test("sitemap, robots, and llms builders agree with the registry", () => {
  const locs = [...buildSitemapXml().matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(
    locs,
    LAUNCH_ROUTES.map((route) => `${SITE_ORIGIN}${route.path}`),
  );
  const robots = buildRobotsTxt();
  assert.deepEqual(
    [...robots.matchAll(/^Disallow:\s*(\S+)/gm)].map((match) => match[1]),
    ["/_dev/"],
  );
  assert.match(robots, new RegExp(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`));
  const llms = buildLlmsTxt();
  for (const route of LAUNCH_ROUTES) {
    assert.ok(llms.includes(`${SITE_ORIGIN}${route.path}`), route.path);
    assert.ok(llms.includes(route.linkTitle), route.linkTitle);
  }
  assert.ok(llms.includes(city.phoneDisplay));
  assert.ok(llms.includes(city.phoneE164));
  assert.ok(llms.includes(city.address.street));
  assert.ok(llms.includes(city.address.postalCode));
  assert.equal(llms.includes("/privacy-policy/"), false);
  assert.equal(llms.includes("/terms/"), false);
  assert.equal(/25 years|aggregateRating|openingHours|star rating/i.test(llms), false);
});

const built = distExists();

test("dist sitemap, robots, and llms match the registry", { skip: built ? false : "dist is missing; run npm run build" }, () => {
  const sitemap = readFileSync(join(DIST_DIR, "sitemap.xml"), "utf8");
  const robots = readFileSync(join(DIST_DIR, "robots.txt"), "utf8");
  const llms = readFileSync(join(DIST_DIR, "llms.txt"), "utf8");
  assert.equal(sitemap, buildSitemapXml());
  assert.equal(robots, buildRobotsTxt());
  assert.equal(llms, buildLlmsTxt());
  const llmsUrls = [...llms.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]);
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(llmsUrls, sitemapUrls);
});

function digitsOnly(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

test("every phone number and tel: in dist is the NAP", { skip: built ? false : "dist is missing; run npm run build" }, () => {
  const files = walkFiles(DIST_DIR).filter((file) => /\.(html|xml|txt|json)$/i.test(file));
  assert.ok(files.length > 0);
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const label = relative(DIST_DIR, file);
    for (const match of text.matchAll(/tel:([^"'\s<]+)/gi)) {
      assert.equal(match[1], `+1${NAP_DIGITS}`, `${label} ${match[0]}`);
    }
    for (const match of text.matchAll(/\+1\d{10}/g)) {
      assert.equal(match[0], `+1${NAP_DIGITS}`, label);
    }
    for (const match of text.matchAll(/(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g)) {
      assert.equal(digitsOnly(match[0]), NAP_DIGITS, `${label} ${match[0]}`);
    }
  }
});

function internalPath(href: string): string | undefined {
  if (href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("#")) return undefined;
  if (href.startsWith("http://") || href.startsWith("https://")) {
    const url = new URL(href);
    if (url.hostname.replace(/^www\./, "") !== "healthcareconsultants417.com") return undefined;
    return url.pathname;
  }
  if (href.startsWith("/")) return href.split(/[?#]/)[0];
  return undefined;
}

test("internal links in dist hit registry pages with trailing slashes", { skip: built ? false : "dist is missing; run npm run build" }, () => {
  for (const page of listBuiltPages()) {
    const html = readFileSync(page.file, "utf8");
    for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/gi)) {
      const path = internalPath(match[1]);
      if (!path) continue;
      if (ALLOWED_UPLOADS.has(path)) continue;
      assert.ok(path.endsWith("/"), `${page.route} link missing trailing slash: ${match[1]}`);
      assert.ok(LAUNCH_PATHS.has(path), `${page.route} link is not a registry page: ${match[1]}`);
    }
  }
});

const IMAGE_URL = /(?:\ssrc|\ssrcset|\shref)=["']([^"']+)["']|url\(([^)]+)\)/gi;

test("dist has no old-domain or third-party image URLs", { skip: built ? false : "dist is missing; run npm run build" }, () => {
  const files = walkFiles(DIST_DIR).filter((file) => /\.(html|css|xml|txt|js|svg)$/i.test(file));
  const bad: string[] = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(IMAGE_URL)) {
      const raw = (match[1] ?? match[2] ?? "").replace(/["']/g, "").trim();
      if (!raw || raw.startsWith("data:") || raw.startsWith("#") || raw.startsWith("tel:") || raw.startsWith("mailto:")) continue;
      const first = raw.split(",")[0]?.trim().split(/\s+/)[0] ?? raw;
      if (first.startsWith("/wp-content/")) {
        if (!ALLOWED_UPLOADS.has(first.split(/[?#]/)[0])) bad.push(`${relative(DIST_DIR, file)} ${first}`);
        continue;
      }
      if (/^https?:\/\//i.test(first)) {
        const looksLikeImage = /\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(first) || /\/_astro\/|themedraft|wp\.com|fbcdn|googleusercontent/i.test(first);
        const host = new URL(first).hostname;
        if (looksLikeImage || /themedraft|wp\.com|fbcdn|fonts\.g|fonts\.googleapis/i.test(first)) {
          bad.push(`${relative(DIST_DIR, file)} ${first}`);
        } else if (/\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(first) && host) {
          bad.push(`${relative(DIST_DIR, file)} ${first}`);
        }
      }
    }
  }
  assert.deepEqual(bad, []);
});

function skipReason(path: string): string | false {
  return builtPageExists(path) ? false : `skip: ${path} is not built yet`;
}

test("built pages have one H1, unique titles, a www canonical, and no noindex except /_dev/", { skip: built ? false : "dist is missing; run npm run build" }, () => {
  const pages = listBuiltPages();
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  for (const page of pages) {
    const html = readFileSync(page.file, "utf8");
    const h1 = html.match(/<h1\b/gi) ?? [];
    assert.equal(h1.length, 1, page.route);
    const title = /<title>([^<]*)<\/title>/i.exec(html)?.[1] ?? "";
    const description = /<meta name="description" content="([^"]*)"/i.exec(html)?.[1] ?? "";
    assert.ok(title.length > 0, page.route);
    assert.ok(description.length > 0, page.route);
    if (titles.has(title)) assert.fail(`duplicate title "${title}" on ${page.route} and ${titles.get(title)}`);
    if (descriptions.has(description)) assert.fail(`duplicate description on ${page.route} and ${descriptions.get(description)}`);
    titles.set(title, page.route);
    descriptions.set(description, page.route);
    const canonical = /<link rel="canonical" href="([^"]+)"/i.exec(html)?.[1] ?? "";
    assert.equal(canonical, `${SITE_ORIGIN}${page.route}`, page.route);
    assert.match(canonical, /^https:\/\/www\.healthcareconsultants417\.com/);
    const robots = /<meta name="robots" content="([^"]*)"/i.exec(html)?.[1] ?? "";
    if (page.route === "/_dev/") assert.match(robots, /noindex/);
    else assert.equal(/noindex/i.test(robots), false, page.route);
    for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
      const data = JSON.parse(block[1].replace(/\\u003c/g, "<"));
      const flat = JSON.stringify(data);
      assert.equal(/aggregateRating|"review"|openingHours/i.test(flat), false, page.route);
      assert.match(flat, /"@context":"https:\/\/schema.org"/);
    }
  }
});

for (const route of LAUNCH_ROUTES) {
  test(`page gates ${route.path}`, { skip: skipReason(route.path) }, () => {
    const html = readBuiltHtml(route.path);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
    assert.equal(/noindex/i.test(html), false);
    assert.match(html, new RegExp(`<link rel="canonical" href="${SITE_ORIGIN}${route.path}"`));
    assert.ok(existsSync(htmlPathForRoute(route.path)));
  });
}
