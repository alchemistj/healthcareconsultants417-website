# Cursor job 3: Redirects, SEO and gates (`cursor/hc417-gates`)

Read `docs/BUILD-SPEC.md` first (all of it, especially the route table, redirect list, "Josh's
decisions" and "Cursor jobs"), then `alchemistj/ff-architect` `docs/sop/astro-full-build-rules.md`
(Rules 3, 7, 12, 13, 15, 17). Two other Cursor jobs are building the pages at the same time, so
most pages won't exist in your build yet.

Files you own: `src/data/redirects.ts`, the redirects block of `vercel.json`,
`src/pages/sitemap.xml.ts`, `src/pages/robots.txt.ts`, `src/pages/llms.txt.ts`, `src/lib/jsonLd.ts`
(+ test), `test/gates/**`, `e2e/**`, `playwright.config.ts`, and only the `test:e2e` script plus a
Playwright devDependency in `package.json`/lockfile.

## Build

1. `src/data/redirects.ts` (single source) → `vercel.json` redirects: 301, one hop, both slash forms
   of every source, plus no-slash → slash for every registry page. Sources: every old URL that
   isn't kept at the same path (route table + redirect list in BUILD-SPEC; WooCommerce, product,
   category, `/team/travis/`, `/team/team-menber-details/` → closest page), plus
   `docs/legacy-redirects.csv` (`new_target` column). `/privacy-policy/` and `/terms/` are not
   pages. Every target must be a published registry route.
2. `sitemap.xml`, `robots.txt`, `llms.txt` generated from the registry (published routes only,
   canonical `https://www.healthcareconsultants417.com`, robots disallows only `/_dev/`). llms.txt
   facts only from cityConfig/registry.
3. `src/lib/jsonLd.ts`: LocalBusiness (name, telephone `+14177200818`, address 1450 W Cambridge St,
   Springfield, MO 65807, url), Service, BreadcrumbList, FAQPage helpers. No aggregateRating,
   review or hours. Export only; don't edit other jobs' pages.
4. `test/gates/`: registry ↔ sitemap ↔ llms.txt ↔ vercel.json agree; redirects match the data
   file; no chains; every target is a registry page; internal links in `dist` hit registry pages
   with trailing slashes; one H1, unique title/description, www canonical, valid JSON-LD where
   present, no `noindex` (except `/_dev/`); every phone number and `tel:` is the NAP; no
   old-domain or third-party image URLs in `dist` (the two PDFs in `public/wp-content/uploads/`
   are allowed); site-wide image lock per page via `test/helpers/imageLock.ts`, allowing only
   substitutions logged in `docs/image-substitutions/*.md`. Page-level checks are registry-driven
   and **skip with a clear message** for pages not built yet. `test/gates/all-routes-built.test.ts`
   fails if a published route is missing from `dist`, but only when `REQUIRE_ALL_ROUTES=1`.
5. `e2e/` Playwright per Rule 17 at 1440 and 390: no horizontal scroll, header hides/returns,
   hamburger has the same links as desktop, mobile bar only on phones, no third-party requests on
   load. `npm run test:e2e` runs it against `npm run preview` (`scripts/preview.mjs`).
