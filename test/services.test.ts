import assert from "node:assert/strict";
import { test } from "node:test";
import { join } from "node:path";
import { getCity } from "../src/data/cityConfig.ts";
import manifestJson from "../src/data/legacyImageManifest.json";
import communityCopy from "../src/data/copy/pages/services-community-placement.json";
import relocationCopy from "../src/data/copy/pages/senior-relocation-services.json";
import downsizingCopy from "../src/data/copy/pages/senior-downsizing-help.json";
import zpodCopy from "../src/data/copy/pages/zpod-beds.json";
import suicideCopy from "../src/data/copy/pages/services-suicide-awareness.json";
import transitionalCopy from "../src/data/copy/pages/services-transitional-care.json";
import hospitalCopy from "../src/data/copy/pages/services-hospital-to-home-transition.json";
import { collectImageFiles, collectPageStrings } from "../src/data/services/collect.ts";
import { servicePages } from "../src/data/services/index.ts";
import { assertCopy, collapseWhitespace, decodeEntities } from "./helpers/copy.ts";
import { REPO_ROOT, distExists, readBuiltHtml } from "./helpers/dist.ts";
import { assertImageLock, assertOriginalHashes } from "./helpers/imageLock.ts";

type Block = { text: string };
type CopyFile = { blocks: Block[] };
type ManifestImage = { file: string; sha256: string };
type ManifestPage = { slug: string; images: ManifestImage[] };

const manifest = manifestJson as { pages: ManifestPage[] };

const copyBySlug: Record<string, CopyFile> = {
  "senior-community-placement": communityCopy,
  "senior-relocation": relocationCopy,
  "senior-downsizing": downsizingCopy,
  "zpod-sensory-beds": zpodCopy,
  "suicide-awareness": suicideCopy,
  "transitional-care": transitionalCopy,
  "hospital-to-home-transition": hospitalCopy,
};

const ALLOWED_DROPPED_FILES = new Set([
  "src/assets/legacy/wp-content/plugins/wpforms/assets/images/submit-spin.svg",
  "src/assets/legacy/wp-content/uploads/2022/06/section-bg.jpg",
]);

const TITLE_SUFFIX = " in Springfield, MO | Transitional Healthcare Consultants";

function renderedText(slug: string): string {
  const page = servicePages.find((item) => item.slug === slug);
  if (!page) throw new Error(slug);
  return collapseWhitespace(collectPageStrings(page).join("\n"));
}

test("seven service pages match the Springfield catalog", () => {
  assert.deepEqual(
    servicePages.map((page) => page.slug),
    getCity("springfield").services.map((service) => service.slug),
  );
});

test("service copy, titles, descriptions, related services, and image order", () => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const page of servicePages) {
    const copy = copyBySlug[page.slug];
    assert.ok(copy, `missing copy for ${page.slug}`);
    const blocks = copy.blocks;
    const used = [...page.usedBlocks];
    const dropped = page.droppedBlocks.map((item) => item.index);
    const covered = [...used, ...dropped].sort((a, b) => a - b);
    assert.deepEqual(
      covered,
      blocks.map((_, index) => index),
      `${page.slug} used and dropped blocks must cover every copy block once`,
    );
    assert.equal(new Set(used).size, used.length, `${page.slug} repeats a used block`);
    assert.equal(new Set(dropped).size, dropped.length, `${page.slug} repeats a dropped block`);

    const rendered = renderedText(page.slug);
    for (const index of used) {
      const text = collapseWhitespace(blocks[index].text);
      assert.ok(text.length > 0, `${page.slug} block ${index} is empty`);
      assert.ok(rendered.includes(text), `${page.slug} does not render block ${index}: ${text.slice(0, 80)}`);
    }
    for (const item of page.droppedBlocks) {
      const text = collapseWhitespace(blocks[item.index].text);
      const insideUsed = used.some((index) => collapseWhitespace(blocks[index].text).includes(text));
      if (!insideUsed && text.length >= 40) {
        assert.ok(!rendered.includes(text), `${page.slug} still renders dropped block ${item.index}`);
      }
    }

    assert.ok(page.h1.length > 0);
    assert.equal(rendered.includes(collapseWhitespace(page.h1)), true);
    assert.equal(page.title.slice(-TITLE_SUFFIX.length), TITLE_SUFFIX, page.slug);
    assert.ok(page.title.length > TITLE_SUFFIX.length, page.slug);
    assert.ok(!titles.has(page.title), `duplicate title ${page.title}`);
    titles.add(page.title);
    assert.ok(page.description.length > 0 && page.description.length < 155, `${page.slug} description length ${page.description.length}`);
    assert.ok(!descriptions.has(page.description), `duplicate description on ${page.slug}`);
    descriptions.add(page.description);

    const catalog = new Set(getCity("springfield").services.map((service) => service.slug));
    assert.ok(page.relatedSlugs.length >= 2 && page.relatedSlugs.length <= 3, page.slug);
    for (const slug of page.relatedSlugs) {
      assert.ok(catalog.has(slug), `${page.slug} related ${slug} is not in cityConfig`);
      assert.notEqual(slug, page.slug);
    }

    const manifestPage = manifest.pages.find((item) => item.slug === page.manifestSlug);
    assert.ok(manifestPage, `manifest page ${page.manifestSlug}`);
    const droppedFiles = new Set(page.droppedImages.map((item) => item.file));
    for (const file of droppedFiles) {
      assert.ok(ALLOWED_DROPPED_FILES.has(file), `${page.slug} drops an unexpected file ${file}`);
      assert.ok(manifestPage.images.some((image) => image.file === file), `${file} is not on ${page.manifestSlug}`);
    }
    const expectedFiles = manifestPage.images.map((image) => image.file).filter((file) => !droppedFiles.has(file));
    assert.deepEqual(collectImageFiles(page), expectedFiles, page.slug);
    assertOriginalHashes(
      manifestPage.images.map((image) => ({ path: join(REPO_ROOT, image.file), sha256: image.sha256 })),
    );
  }
});

test("built service pages: copy, image lock, one H1, unique meta, NAP only", { skip: !distExists() }, () => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const page of servicePages) {
    const route = `/springfield/${page.slug}/`;
    const html = readBuiltHtml(route);
    const copy = copyBySlug[page.slug];
    const usedText = page.usedBlocks.map((index) => copy.blocks[index].text);
    assertCopy(html, usedText, route);

    const manifestPage = manifest.pages.find((item) => item.slug === page.manifestSlug);
    assert.ok(manifestPage);
    const droppedFiles = new Set(page.droppedImages.map((item) => item.file));
    const expected = manifestPage.images.filter((image) => !droppedFiles.has(image.file));
    assertImageLock(html, expected, route);

    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, route);
    const title = decodeEntities(/<title>([^<]*)<\/title>/i.exec(html)?.[1] ?? "");
    const description = decodeEntities(/<meta name="description" content="([^"]*)"/i.exec(html)?.[1] ?? "");
    assert.equal(title, page.title, route);
    assert.equal(description, page.description, route);
    assert.ok(!titles.has(title));
    assert.ok(!descriptions.has(description));
    titles.add(title);
    descriptions.add(description);

    const digits = html.match(/\(?\d{3}\)?[ -]\d{3}-\d{4}/g) ?? [];
    for (const found of digits) assert.equal(found, "(417) 720-0818", route);
    const tels = html.match(/tel:[^"'\\\s<]+/g) ?? [];
    assert.ok(tels.length > 0, route);
    for (const tel of tels) assert.equal(tel, "tel:+14177200818", route);
    assert.match(html, /"telephone":"\+14177200818"/);

    assert.doesNotMatch(html, /fonts\.googleapis|fonts\.gstatic/);
    assert.doesNotMatch(html, /wp-content\/uploads|demo\.themedraft\.net/);
    assert.doesNotMatch(html, /<img[^>]+src="https?:/i);
    assert.doesNotMatch(html, /aggregateRating|"@type":"Review"/);
  }
});
