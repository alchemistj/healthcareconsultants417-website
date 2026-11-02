import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { LAUNCH_PATHS, LAUNCH_ROUTES } from "../../src/lib/launchRouteRegistry.ts";
import { SITE_ORIGIN } from "../../src/data/cityConfig.ts";
import {
  APEX_HOST,
  buildVercelConfig,
  logicalRedirects,
  resolveRedirect,
} from "../../src/data/redirects.ts";
import { REPO_ROOT } from "../helpers/dist.ts";

const KEPT = new Set(["/", "/zpods-medical-mission/", "/transitional-healthcare/", "/resources/"]);

/** Old sitemap URLs (pages, posts, products, services, team, category). */
const OLD_SITEMAP = [
  "/",
  "/zpod-beds/",
  "/contact-us-2-2/",
  "/about-us/",
  "/senior-relocation-services/",
  "/senior-downsizing-help/",
  "/zpods-medical-mission/",
  "/contact-us/",
  "/transitional-healthcare/",
  "/shop/",
  "/cart/",
  "/checkout/",
  "/my-account/",
  "/wishlist/",
  "/shop-10/",
  "/my-account-2/",
  "/resources/",
  "/third-tuesday-suicide-loss-support-group/",
  "/rise-thrive-podcast/",
  "/veterans-military-coalition-of-the-ozarks/",
  "/veterans-of-the-ozarks-suicide-prevention/",
  "/services/community-placement/",
  "/services/suicide-awareness/",
  "/services/hospital-to-home-transition/",
  "/services/transitional-care/",
  "/team/travis/",
  "/team/rachal-payne/",
  "/team/team-menber-details/",
  "/category/life-insurance-tips/",
  "/product/kleansall/",
];

function finalPath(destination: string | null): string | null {
  if (destination === null) return null;
  if (destination.startsWith("http")) return new URL(destination).pathname || "/";
  return destination;
}

test("vercel.json is the redirect data file, 301s only, no automatic slash normalizer", () => {
  const file = JSON.parse(readFileSync(join(REPO_ROOT, "vercel.json"), "utf8"));
  assert.deepEqual(file, buildVercelConfig());
  assert.equal(file.cleanUrls, false);
  assert.equal("trailingSlash" in file, false);
  assert.ok(file.redirects.length > 0);
  for (const rule of file.redirects) assert.equal(rule.statusCode, 301);
});

test("every target is a published registry route and nothing chains", () => {
  const rules = buildVercelConfig().redirects.filter((rule) => !rule.has);
  for (const rule of rules) {
    const target = finalPath(rule.destination);
    assert.ok(target && LAUNCH_PATHS.has(target), `${rule.source} → ${rule.destination}`);
    assert.equal(resolveRedirect(target, `www.${APEX_HOST}`), null, `${rule.source} chains through ${target}`);
  }
});

test("both slash forms of every legacy source land on the same final page in one hop", () => {
  for (const rule of logicalRedirects()) {
    const bare = rule.source.replace(/\/+$/, "") || "/";
    const slashed = rule.source.endsWith("/") ? rule.source : `${rule.source}/`;
    assert.equal(resolveRedirect(bare), rule.destination, bare);
    assert.equal(resolveRedirect(slashed), rule.destination, slashed);
    assert.equal(resolveRedirect(rule.destination), null, rule.source);
  }
});

test("every published page redirects its no-slash form to the slash form", () => {
  for (const route of LAUNCH_ROUTES) {
    if (route.path === "/") {
      assert.equal(resolveRedirect("/"), null);
      continue;
    }
    const bare = route.path.replace(/\/+$/, "");
    assert.equal(resolveRedirect(bare), route.path, bare);
    assert.equal(resolveRedirect(route.path), null, route.path);
  }
});

test("old sitemap URLs are kept or redirect once to a registry page", () => {
  for (const path of OLD_SITEMAP) {
    const dest = resolveRedirect(path);
    if (KEPT.has(path) || LAUNCH_PATHS.has(path)) {
      assert.equal(dest, null, `${path} should stay`);
    } else {
      assert.ok(dest && LAUNCH_PATHS.has(dest), `${path} → ${dest}`);
      assert.equal(resolveRedirect(dest), null, path);
    }
    const bare = path === "/" ? "/" : path.replace(/\/+$/, "");
    if (bare !== path) {
      const bareDest = resolveRedirect(bare);
      assert.equal(finalPath(bareDest), finalPath(dest ?? path), bare);
    }
  }
});

test("named legacy targets from the spec and the csv", () => {
  const expectPath = (source: string, destination: string) => {
    assert.equal(resolveRedirect(source), destination, source);
    assert.equal(resolveRedirect(source.replace(/\/+$/, "")), destination, `${source} bare`);
  };
  expectPath("/about-us/", "/about/");
  expectPath("/team/rachal-payne/", "/about-rachal-payne/");
  expectPath("/team/travis/", "/about/");
  expectPath("/team/team-menber-details/", "/about/");
  expectPath("/team/someone-else/", "/about/");
  expectPath("/contact-us/", "/springfield/contact/");
  expectPath("/contact-us-2/", "/");
  expectPath("/contact-us-2-2/", "/");
  expectPath("/services/community-placement/", "/springfield/senior-community-placement/");
  expectPath("/services/relocation/", "/springfield/senior-relocation/");
  expectPath("/senior-relocation-services/", "/springfield/senior-relocation/");
  expectPath("/senior-downsizing-help/", "/springfield/senior-downsizing/");
  expectPath("/zpod-beds/", "/springfield/zpod-sensory-beds/");
  expectPath("/services/assistive-technology/", "/springfield/zpod-sensory-beds/");
  expectPath("/services/suicide-awareness/", "/springfield/suicide-awareness/");
  expectPath("/services/transitional-care/", "/springfield/transitional-care/");
  expectPath("/services/hospital-to-home-transition/", "/springfield/hospital-to-home-transition/");
  expectPath("/third-tuesday-suicide-loss-support-group/", "/springfield/suicide-awareness/");
  expectPath("/veterans-of-the-ozarks-suicide-prevention/", "/springfield/suicide-awareness/");
  expectPath("/veterans-military-coalition-of-the-ozarks/", "/springfield/suicide-awareness/");
  expectPath("/rise-thrive-podcast/", "/resources/");
  for (const source of ["/shop/", "/cart/", "/checkout/", "/my-account/", "/wishlist/", "/shop-10/", "/my-account-2/", "/product/kleansall/"]) {
    expectPath(source, "/");
  }
  expectPath("/category/life-insurance-tips/", "/resources/");
  expectPath("/contact-and-support/", "/springfield/contact/");
  expectPath("/about-use0f1ee6f/", "/about/");
  expectPath("/our-services/", "/");
  expectPath("/services/home-safety-evaluations/", "/transitional-healthcare/");
  expectPath("/services/hospital-to-home-transition-coordination/", "/springfield/hospital-to-home-transition/");
  expectPath("/zpods-health-benefits/", "/springfield/zpod-sensory-beds/");
  expectPath("/expecting-how-to-choose-a-life-insurance-policy/", "/resources/");
  expectPath("/veterans-of-the-ozarks-2025-calendar-of-events/", "/springfield/suicide-awareness/");
});

test("privacy, terms, and the two PDFs are not redirect sources", () => {
  for (const path of [
    "/privacy-policy/",
    "/privacy-policy",
    "/terms/",
    "/terms",
    "/wp-content/uploads/2024/11/About-zPods.pdf",
    "/wp-content/uploads/2024/12/Medical-Mission-3-1.pdf",
  ]) {
    assert.equal(resolveRedirect(path), null, path);
  }
  for (const rule of logicalRedirects()) {
    assert.equal(rule.destination === "/privacy-policy/" || rule.destination === "/terms/", false);
  }
});

test("apex host redirects straight to the final www URL", () => {
  assert.equal(
    resolveRedirect("/about-us/", APEX_HOST),
    `${SITE_ORIGIN}/about/`,
  );
  assert.equal(
    resolveRedirect("/about-us", APEX_HOST),
    `${SITE_ORIGIN}/about/`,
  );
  assert.equal(resolveRedirect("/about/", APEX_HOST), `${SITE_ORIGIN}/about/`);
  assert.equal(
    resolveRedirect("/wp-content/uploads/2024/11/About-zPods.pdf", APEX_HOST),
    `${SITE_ORIGIN}/wp-content/uploads/2024/11/About-zPods.pdf`,
  );
  assert.equal(resolveRedirect("/about/", `www.${APEX_HOST}`), null);
});
