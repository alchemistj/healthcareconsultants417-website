import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { resolveRedirect } from "../../src/data/redirects.ts";
import { DIST_DIR } from "../helpers/dist.ts";

// Google Search Console HTML-file verification (Site Kit). Must stay byte-for-byte as on the old site.
const FILE_NAME = "googled7a2c3acb793c0a4.html";
const CONTENT = "google-site-verification: googled7a2c3acb793c0a4.html";

test("Search Console verification file is built with exact content", () => {
  const file = join(DIST_DIR, FILE_NAME);
  assert.ok(existsSync(file), `${file} missing. Run npm run build first.`);
  assert.equal(readFileSync(file, "utf8"), CONTENT);
});

test("Search Console verification file is served as-is (no redirect)", () => {
  assert.equal(resolveRedirect(`/${FILE_NAME}`), null);
});
