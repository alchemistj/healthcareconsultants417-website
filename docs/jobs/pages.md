# Cursor job 1: Pages (`cursor/hc417-pages`)

Read `docs/BUILD-SPEC.md` first (all of it, especially "Josh's decisions" and "Cursor jobs"), then
the FF Architect SOPs it names. They live in `alchemistj/ff-architect` under `docs/sop/`
(`astro-full-build-rules.md`, `astro-first-frame-and-pagespeed.md`,
`central-forms-contact-form.md`). Read them on GitHub or clone that repo read-only.

Use the shell that's already here: `src/layouts/BaseLayout.astro`, `src/components/*`,
`src/lib/heroImage.ts`, `src/data/cityConfig.ts`, `src/lib/launchRouteRegistry.ts`,
`test/helpers/*`. Words come from `src/data/copy/pages/*.json`; images from
`src/data/legacyImageManifest.json` + `src/assets/legacy/`. Old-page screenshots for visual
reference are not in the repo; the live site https://www.healthcareconsultants417.com is still up
(read only).

## Build

| New URL | Copy file |
|---|---|
| `/` | `home.json` |
| `/about/` | `about-us.json` |
| `/about-rachal-payne/` | `team-rachal-payne.json` |
| `/zpods-medical-mission/` | `zpods-medical-mission.json` |
| `/transitional-healthcare/` | `transitional-healthcare.json` |
| `/resources/` | `resources.json` |
| `/springfield/contact/` | `contact-us.json` |

Page data in `src/data/pages/`. Contact page and form per BUILD-SPEC Lane E and the Central Forms
SOP: posts to `https://forms.fluidframemarketing.com/api/lead`, keys from
`import.meta.env.PUBLIC_FORMS_SITE_KEY` / `PUBLIC_FORMS_FORM_KEY` (no real keys yet; do not create
or register any), `clientSubmissionId`, honeypot, **no SMS consent checkbox**, form in server HTML,
button text from the old page (never "Submit").

Also:
- Real logo from `legacyImageManifest.json` → `logo.file` into `Header.astro` (and `Footer.astro`
  if it shows one), re-encoded at build time to an inline image ≤ 4KB. Never redraw it. Favicon
  under 50KB from the same logo in `public/`.
- Fonts per "Josh's decisions": self-hosted Poppins 600 (headings) + Rubik 400 (body), latin
  woff2, `font-display: swap`, no preload, in `src/styles/tokens.css`.
- Remove `/privacy-policy/` and `/terms/` from `src/lib/launchRouteRegistry.ts`.

## Rules that matter most

- Words word for word, in order. Drop only theme junk (icon-font text like `arrow_right`, empty
  blocks, mobile-only duplicates, the empty "Our Testimonials" heading). Don't fix typos; list them
  in your report. No reviews exist: no review bands. Don't render "25 years" or Travis.
- Images: same photos, same order, from that page's manifest entries. Theme-demo slots (manifest
  `excluded`) may get an appropriate photo from her own originals per "Josh's decisions"; log each
  in `docs/image-substitutions/pages.md`. Never stock, never AI, never crop out the subject.
- Exactly one H1 per page, unique title and meta description (old meta description from the copy
  file or `urls.csv` in the ff-architect audit when present).

## Tests

`test/pages.test.ts` using `test/helpers/`: copy check, image lock (allowing only logged
substitutions), one H1, unique title/description, form present in built HTML, only the NAP phone
number. `src/lib/formsLead.test.ts` for the request body.
