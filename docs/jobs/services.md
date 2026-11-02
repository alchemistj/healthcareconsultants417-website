# Cursor job 2: Services (`cursor/hc417-services`)

Read `docs/BUILD-SPEC.md` first (all of it, especially "Josh's decisions" and "Cursor jobs"), then
the FF Architect SOPs it names in `alchemistj/ff-architect` `docs/sop/`
(`astro-full-build-rules.md` — Rule 11 service page — and `astro-first-frame-and-pagespeed.md`).

Use the shell that's already here: `src/layouts/BaseLayout.astro`, `src/components/*`,
`src/lib/heroImage.ts`, `src/data/cityConfig.ts`, `test/helpers/*`. Don't edit those; if
`cityConfig.ts` needs a change, say so in your report. Words from `src/data/copy/pages/*.json`;
images from `src/data/legacyImageManifest.json` + `src/assets/legacy/`. The live site
https://www.healthcareconsultants417.com is up for visual reference (read only).

## Build

ONE template `src/pages/[city]/[service]/index.astro` (getStaticPaths over cityConfig springfield
services), data in `src/data/services/<slug>.ts`:

| Slug | Copy file |
|---|---|
| `senior-community-placement` | `services-community-placement.json` |
| `senior-relocation` | `senior-relocation-services.json` |
| `senior-downsizing` | `senior-downsizing-help.json` |
| `zpod-sensory-beds` | `zpod-beds.json` |
| `suicide-awareness` | `services-suicide-awareness.json` |
| `transitional-care` | `services-transitional-care.json` |
| `hospital-to-home-transition` | `services-hospital-to-home-transition.json` |

## Rules that matter most

- Words word for word, in order, placed into the Rule 11 section order only where the copy has
  that section. Leave out sections with no words. Drop theme junk (icon-font text, empty blocks,
  mobile-only duplicates, sidebar widgets repeated on every service page). Don't fix typos (list
  them). No reviews; no review bands. Don't render "25 years" or Travis. Related band: 2–3 other
  services from cityConfig.
- Images: same photos, same order, from that page's manifest entries. Theme-demo slots (manifest
  `excluded`) may get an appropriate photo from her own originals per "Josh's decisions"; log each
  in `docs/image-substitutions/services.md`. Never stock, never AI, never crop out the subject.
  Report any page without a usable hero.
- One H1, title `[Service] in Springfield, MO | Transitional Healthcare Consultants`, unique meta
  description (old one when present, under 155 characters).

## Tests

`test/services.test.ts` using `test/helpers/`: for all 7 pages, copy check, image lock (allowing
only logged substitutions), one H1, unique title/description, only the NAP phone number.
