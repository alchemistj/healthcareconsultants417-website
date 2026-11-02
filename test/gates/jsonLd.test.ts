import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getCity, SITE_ORIGIN } from "../../src/data/cityConfig.ts";
import { REPO_ROOT } from "../helpers/dist.ts";

const globalCopy = JSON.parse(readFileSync(join(REPO_ROOT, "src/data/copy/_global.json"), "utf8")) as { brandName: string };
import {
  assertSafeSchema,
  breadcrumbSchema,
  faqSchema,
  jsonLdScript,
  localBusinessSchema,
  serviceSchema,
} from "../../src/lib/jsonLd.ts";

const city = getCity();

test("LocalBusiness is the NAP and has no reviews or hours", () => {
  const data = localBusinessSchema();
  assert.equal(data["@type"], "LocalBusiness");
  assert.equal(data.name, "Transitional Healthcare Consultants");
  assert.equal(data.name, globalCopy.brandName);
  assert.equal(data.telephone, "+14177200818");
  assert.equal(data.telephone, city.phoneE164);
  assert.equal(data.url, `${SITE_ORIGIN}/`);
  assert.equal(data.address.streetAddress, "1450 W Cambridge St");
  assert.equal(data.address.addressLocality, "Springfield");
  assert.equal(data.address.addressRegion, "MO");
  assert.equal(data.address.postalCode, "65807");
  assert.equal(JSON.stringify(data).includes("aggregateRating"), false);
  assert.equal(JSON.stringify(data).includes("openingHours"), false);
  assert.equal(JSON.stringify(data).includes("review"), false);
});

test("Service, breadcrumb, and FAQ helpers stay free of ratings and hours", () => {
  const service = serviceSchema({ name: "Senior Downsizing Help", path: "/springfield/senior-downsizing/" });
  assert.equal(service["@type"], "Service");
  assert.equal(service.url, `${SITE_ORIGIN}/springfield/senior-downsizing/`);
  assert.equal(service.provider.telephone, "+14177200818");
  assert.equal("description" in service, false);

  const crumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Senior Downsizing Help", path: "/springfield/senior-downsizing/" },
  ]);
  assert.equal(crumbs.itemListElement.length, 2);
  assert.equal(crumbs.itemListElement[1].position, 2);
  assert.equal(crumbs.itemListElement[1].item, `${SITE_ORIGIN}/springfield/senior-downsizing/`);

  const faq = faqSchema([{ question: "Sample question one?", answer: "Sample answer one." }]);
  assert.equal(faq["@type"], "FAQPage");
  assert.equal(faq.mainEntity[0].acceptedAnswer.text, "Sample answer one.");
});

test("jsonLdScript escapes < and rejects review markup", () => {
  const script = jsonLdScript(faqSchema([{ question: "Is 2 < 3?", answer: "Yes." }]));
  assert.match(script, /^<script type="application\/ld\+json">/);
  assert.equal(script.includes("<3"), false);
  assert.equal(script.includes("\\u003c"), true);
  assert.throws(() => assertSafeSchema({ aggregateRating: { ratingValue: "5" } }));
  assert.throws(() => assertSafeSchema({ openingHours: "Mo-Su 08:00-17:00" }));
  assert.throws(() => assertSafeSchema({ review: [] }));
});
