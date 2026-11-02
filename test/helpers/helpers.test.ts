import { test } from "node:test";
import assert from "node:assert/strict";
import { checkCopy, collectStrings, visibleText } from "./copy.ts";
import { checkImageLock, builtImageStems, originalStemFromDerivative } from "./imageLock.ts";

test("visibleText drops tags, scripts and decodes entities", () => {
  const html = "<p>Senior&nbsp;Care &amp; <b>Support</b></p><script>var x = 'hidden'</script>";
  assert.equal(visibleText(html), "Senior Care & Support");
});

test("checkCopy finds exact strings and reports missing ones", () => {
  const html = "<h1>Transitional Care</h1><p>We help families move.</p>";
  assert.deepEqual(checkCopy(html, ["Transitional Care", "We help families move."]), { ok: true, missing: [] });
  const result = checkCopy(html, ["Transitional care", "We help families move."]);
  assert.equal(result.ok, false);
  assert.deepEqual(result.missing, ["Transitional care"]);
});

test("collectStrings flattens nested copy and skips underscore keys", () => {
  assert.deepEqual(collectStrings({ _note: "skip", a: "one", b: { c: ["two", "three"] } }), ["one", "two", "three"]);
});

test("originalStemFromDerivative strips the Astro hash and extension", () => {
  assert.equal(originalStemFromDerivative("/_astro/photo.Abc123_Z1x.webp"), "photo");
  assert.equal(originalStemFromDerivative("/_astro/my.photo.Abc123_Z1x.webp"), "my.photo");
  assert.equal(originalStemFromDerivative("/images/other.jpg"), undefined);
});

const page = `
  <img src="data:image/avif;base64,AAAA" data-source-file="hero-one.jpg" alt="">
  <img src="/_astro/second.AbC12345_Zx9.webp" srcset="/_astro/second.AbC12345_Zx9.webp 440w" alt="">
  <img src="/_astro/third.Qw12ER34_Yy8.webp" alt="">
`;

test("image lock passes for the same photos in the same order", () => {
  assert.deepEqual(builtImageStems(page), ["hero-one", "second", "third"]);
  assert.equal(checkImageLock(page, ["a/hero-one.jpg", { file: "second.png" }, { src: "x/third.jpeg" }]).ok, true);
});

test("image lock fails on swapped order, missing or extra photos", () => {
  assert.equal(checkImageLock(page, ["second.png", "hero-one.jpg", "third.jpg"]).ok, false);
  assert.equal(checkImageLock(page, ["hero-one.jpg", "second.png"]).ok, false);
  assert.equal(checkImageLock(page, ["hero-one.jpg", "second.png", "third.jpg", "fourth.jpg"]).ok, false);
});
