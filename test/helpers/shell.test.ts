import { test } from "node:test";
import assert from "node:assert/strict";
import { ALL_ROUTES, LAUNCH_ROUTES, isPublishedPath } from "../../src/lib/launchRouteRegistry.ts";
import { CITIES, getCity, telHref } from "../../src/data/cityConfig.ts";
import { builtPageExists, readBuiltHtml } from "./dist.ts";

test("registry lists every route in the BUILD-SPEC table with trailing slashes", () => {
  const expected = [
    "/",
    "/about/",
    "/about-rachal-payne/",
    "/zpods-medical-mission/",
    "/transitional-healthcare/",
    "/resources/",
    "/springfield/senior-community-placement/",
    "/springfield/senior-relocation/",
    "/springfield/senior-downsizing/",
    "/springfield/zpod-sensory-beds/",
    "/springfield/suicide-awareness/",
    "/springfield/transitional-care/",
    "/springfield/hospital-to-home-transition/",
    "/springfield/contact/",
  ];
  assert.deepEqual(LAUNCH_ROUTES.map((r) => r.path).sort(), [...expected].sort());
  for (const route of ALL_ROUTES) assert.match(route.path, /^\/(.*\/)?$/);
});

test("legal pages are optional and unpublished", () => {
  const legal = ALL_ROUTES.filter((r) => r.kind === "legal");
  assert.deepEqual(legal.map((r) => r.path), ["/privacy-policy/", "/terms/"]);
  for (const route of legal) {
    assert.equal(route.optional, true);
    assert.equal(isPublishedPath(route.path), false);
  }
});

test("one city with the NAP number", () => {
  assert.equal(CITIES.length, 1);
  const city = getCity("springfield");
  assert.equal(city.phoneE164, "+14177200818");
  assert.equal(city.phoneDisplay, "(417) 720-0818");
  assert.equal(telHref(city), "tel:+14177200818");
  assert.equal(city.services.length, 7);
});

// The checks below read the built _dev page and run only when dist exists.
const devBuilt = builtPageExists("/_dev/");

test("_dev page: photo first in body, one H1, gate marker, hamburger, NAP only", { skip: !devBuilt }, () => {
  const html = readBuiltHtml("/_dev/");
  const body = html.slice(html.indexOf("<body"));
  const imgAt = body.indexOf("<img");
  assert.ok(imgAt > 0 && imgAt < body.indexOf("<header"), "hero <img> comes before <header>");
  assert.match(body, /<img[^>]*data-ff-lcp-hero[^>]*>/);
  assert.match(body, /<img[^>]*src="data:image\/avif;base64,/);
  assert.equal((body.match(/<h1\b/g) ?? []).length, 1);
  assert.match(body, /<span class="atf-ready" hidden/);
  assert.match(body, /<button[^>]*aria-expanded="false"[^>]*aria-controls="mobile-menu"/);
  assert.match(html, /<meta name="robots" content="noindex/);
  const digits = html.match(/\(?\d{3}\)?[ -]\d{3}-\d{4}/g) ?? [];
  for (const d of digits) assert.equal(d, "(417) 720-0818");
  assert.doesNotMatch(html, /fonts\.googleapis|fonts\.gstatic/);
  assert.doesNotMatch(html, /<link[^>]+rel="preload"/);
});

test("_dev page: footer links every service", { skip: !devBuilt }, () => {
  const html = readBuiltHtml("/_dev/");
  const footer = html.slice(html.indexOf("<footer"));
  for (const service of getCity().services) {
    assert.ok(footer.includes(`href="/springfield/${service.slug}/"`), `footer links ${service.slug}`);
  }
});
