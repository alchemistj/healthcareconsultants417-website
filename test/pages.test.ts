import "../src/lib/formsLead.test.ts";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import { test } from "node:test";
import {
  PAGE_META,
  SUBSTITUTIONS,
  buildPage,
  collectHrefs,
  keptImages,
  keptStrings,
  manifestSha,
  pageImageFiles,
} from "../src/data/pages/companyCopy.ts";
import manifest from "../src/data/legacyImageManifest.json" with { type: "json" };
import { LAUNCH_PATHS } from "../src/lib/launchRouteRegistry.ts";
import { FORMS_LEAD_ENDPOINT } from "../src/lib/formsLead.ts";
import { assertCopy, decodeEntities, visibleText } from "./helpers/copy.ts";
import { DIST_DIR, builtPageExists, readBuiltHtml } from "./helpers/dist.ts";
import { builtImageStems, sha256File } from "./helpers/imageLock.ts";

const SLUGS = [
  "home",
  "about-us",
  "team-rachal-payne",
  "zpods-medical-mission",
  "transitional-healthcare",
  "resources",
  "contact-us",
] as const;

function stem(file: string): string {
  const base = basename(file);
  const dot = base.lastIndexOf(".");
  return dot > 0 ? base.slice(0, dot) : base;
}

function allowedHref(href: string): boolean {
  if (href === "tel:+14177200818" || href === "/" || href === "/#services") return true;
  if (href.startsWith("mailto:")) return true;
  if (href.startsWith("/wp-content/uploads/") && href.toLowerCase().endsWith(".pdf")) return true;
  return LAUNCH_PATHS.has(href);
}

test("home hero is the retired couple and Senior Guidance stays a body photo", () => {
  const home = manifest.pages.find((page) => page.slug === "home");
  assert.ok(home);
  const hero = home.images.find((image) => image.order === 0);
  assert.ok(hero);
  assert.equal(hero.role, "hero");
  assert.equal(hero.alt, "Smiling older couple");
  assert.equal(
    hero.original_url,
    "https://www.healthcareconsultants417.com/wp-content/uploads/2024/12/retired-couple-2023-11-27-05-10-48-utc.jpg",
  );
  assert.equal(hero.sha256, "bed2a3402dba9a516fbf982da61dbd7911b2e2f8f2d260d20a437741e0f55289");
  assert.equal(sha256File(hero.file), hero.sha256);
  const files = pageImageFiles(buildPage("home"));
  assert.equal(files[0], hero.file);
  const guidance = "src/assets/legacy/wp-content/uploads/2024/12/Senior-Guidance.jpg";
  assert.equal(files.includes(guidance), true);
  assert.notEqual(files[0], guidance);
  const body = home.images.find((image) => image.file === guidance);
  assert.equal(body?.role_guess, "body");
  assert.ok((body?.order ?? 0) > 0);
});

test("theme decoration stays out of the page copy", () => {
  const chrome = new Set([
    "Services",
    "Our Services",
    "About",
    "About Transitional Healthcare Consultants",
    "Team",
    "Get In Touch",
    "Contact",
    "Blog News",
    "Article & Tips",
    "zPods \u00ae",
  ]);
  for (const slug of SLUGS) {
    for (const text of keptStrings(slug)) {
      assert.equal(text.startsWith("Transitional Healthcare Consultants > "), false, `${slug}: ${text}`);
      assert.equal(chrome.has(text), false, `${slug}: ${text}`);
    }
    const model = buildPage(slug);
    const rendered = [model.h1, model.subhead ?? ""];
    for (const group of model.groups) {
      for (const node of group.inlines) {
        if ("text" in node) rendered.push(node.text);
      }
    }
    for (const text of rendered) {
      assert.equal(text.includes(" > "), false, `${slug} renders ${text}`);
      assert.equal(chrome.has(text), false, `${slug} renders ${text}`);
    }
    assert.equal(
      model.groups.some((group) =>
        group.inlines.some(
          (node) => node.kind === "p" && node.text === "Transitional Healthcare Consultants",
        ),
      ),
      false,
      slug,
    );
  }
});

test("each page keeps manifest photos in order, plus only the logged home substitutions", () => {
  const subFiles = SUBSTITUTIONS.map((item) => basename(item.file));
  for (const slug of SLUGS) {
    const actual = pageImageFiles(buildPage(slug)).map((file) => basename(file));
    const kept = [...keptImages(slug).map((image) => basename(image.file))];
    const extra: string[] = [];
    for (const file of actual) {
      if (kept[0] === file) kept.shift();
      else extra.push(file);
    }
    assert.deepEqual(kept, [], `${slug} dropped or reordered a manifest photo`);
    assert.deepEqual(extra, slug === "home" ? subFiles : [], `${slug} substitutions`);
  }
});

test("used originals still match the manifest hash", () => {
  const files = new Set<string>([manifest.logo.file]);
  for (const slug of SLUGS) {
    for (const file of pageImageFiles(buildPage(slug))) files.add(file);
  }
  const bad: string[] = [];
  for (const file of files) {
    const expected = manifestSha(file);
    if (!expected || sha256File(file) !== expected.toLowerCase()) bad.push(file);
  }
  assert.deepEqual(bad, []);
});

test("page links stay on a published path, a tel, a mailto, or a kept pdf", () => {
  for (const slug of SLUGS) {
    for (const href of collectHrefs(buildPage(slug))) {
      assert.equal(allowedHref(href), true, `${slug} -> ${href}`);
    }
  }
});

test("titles and descriptions are unique and 25 years and Travis stay out of the copy", () => {
  const titles = SLUGS.map((slug) => PAGE_META[slug].title);
  const descriptions = SLUGS.map((slug) => PAGE_META[slug].description);
  assert.equal(new Set(titles).size, titles.length);
  assert.equal(new Set(descriptions).size, descriptions.length);
  for (const slug of SLUGS) {
    const text = keptStrings(slug).join("\n");
    assert.doesNotMatch(text, /25\s*years/i, slug);
    assert.doesNotMatch(text, /\bTravis\b/, slug);
  }
});

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const pagesBuilt = SLUGS.every((slug) => builtPageExists(PAGE_META[slug].path));

test("built pages: copy, photos, one H1, NAP phone, form", { skip: !pagesBuilt }, () => {
  const seenTitles = new Set<string>();
  for (const slug of SLUGS) {
    const meta = PAGE_META[slug];
    const html = readBuiltHtml(meta.path);
    const title = decodeEntities(/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "");
    const description = decodeEntities(/<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? "");
    assert.equal(title, meta.title, slug);
    assert.equal(description, meta.description, slug);
    assert.equal(seenTitles.has(title), false);
    seenTitles.add(title);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, slug);
    assertCopy(html, keptStrings(slug), meta.path);
    const expected = pageImageFiles(buildPage(slug)).map(stem);
    assert.deepEqual(builtImageStems(html), expected, slug);
    const visible = visibleText(html);
    assert.doesNotMatch(visible, /25\s*years/i, slug);
    assert.doesNotMatch(visible, /\bTravis\b/, slug);
    assert.doesNotMatch(visible, /\bSubmit\b/);
    assert.doesNotMatch(html, /themedraft\.net|supabase\.co/i);
    assert.doesNotMatch(html, /fonts\.googleapis|fonts\.gstatic|<link[^>]+rel="preload"/);
    const phones = html.match(/\(?\d{3}\)?[ .-]\d{3}[ .-]\d{4}/g) ?? [];
    for (const phone of phones) assert.equal(phone.replace(/\D/g, ""), "4177200818", phone);
    for (const tel of html.matchAll(/href="(tel:[^"]+)"/g)) assert.equal(tel[1], "tel:+14177200818");
    if (html.includes("data-lead-form")) {
      assert.match(html, /name="website_url"/);
      assert.doesNotMatch(html, /type="checkbox"/);
      assert.match(html, new RegExp(`<button[^>]*>${meta.formButton}</button>`));
      assert.match(html, /Please enable JavaScript in your browser to complete this form\./);
    }
  }
  const bundle = walk(DIST_DIR)
    .filter((file) => file.endsWith(".html") || file.endsWith(".js"))
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
  assert.ok(bundle.includes(FORMS_LEAD_ENDPOINT), "production bundle contains the Central Forms URL");
});
