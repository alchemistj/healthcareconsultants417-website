/**
 * JSON-LD helpers for later pages. Export only: this job does not edit other pages.
 * No aggregateRating, review, or hours (Rule 13 and Rule 0.2).
 */

import globalCopy from "@/data/copy/_global.json";
import { getCity, SITE_ORIGIN } from "@/data/cityConfig";

const FORBIDDEN_KEYS = new Set([
  "aggregateRating",
  "review",
  "reviewCount",
  "ratingValue",
  "openingHours",
  "openingHoursSpecification",
]);

export function assertSafeSchema(data: unknown): void {
  const walk = (value: unknown, path: string) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, `${path}[${index}]`));
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      if (FORBIDDEN_KEYS.has(key)) throw new Error(`Forbidden JSON-LD field "${key}" at ${path}`);
      walk(child, `${path}.${key}`);
    }
  };
  walk(data, "$");
}

export function jsonLdScript(data: unknown): string {
  assertSafeSchema(data);
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

export function localBusinessSchema() {
  const city = getCity();
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: globalCopy.brandName,
    telephone: city.phoneE164,
    url: `${SITE_ORIGIN}/`,
    address: {
      "@type": "PostalAddress",
      streetAddress: city.address.street,
      addressLocality: city.address.city,
      addressRegion: city.address.state,
      postalCode: city.address.postalCode,
      addressCountry: "US",
    },
  };
  assertSafeSchema(data);
  return data;
}

export function serviceSchema(input: { name: string; path: string; description?: string }) {
  const city = getCity();
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    url: new URL(input.path, SITE_ORIGIN).href,
    areaServed: {
      "@type": "City",
      name: city.name,
      addressRegion: city.state,
    },
    provider: {
      "@type": "LocalBusiness",
      name: globalCopy.brandName,
      telephone: city.phoneE164,
      url: `${SITE_ORIGIN}/`,
    },
    ...(input.description ? { description: input.description } : {}),
  };
  assertSafeSchema(data);
  return data;
}

export function breadcrumbSchema(items: readonly { name: string; path: string }[]) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE_ORIGIN).href,
    })),
  };
  assertSafeSchema(data);
  return data;
}

export function faqSchema(items: readonly { question: string; answer: string }[]) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  assertSafeSchema(data);
  return data;
}
