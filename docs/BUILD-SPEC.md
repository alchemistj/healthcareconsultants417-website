# Build spec: healthcareconsultants417.com on Astro

Client: Transitional Healthcare Consultants, Springfield, MO (owner Rachal Payne, RN).
Replaces the WordPress site on Rocket.net (site id 204276). Full plan and reasoning:
`alchemistj/ff-architect` → `docs/clients/healthcareconsultants417-astro-rebuild.md`.

**Read first, and follow exactly:** in `alchemistj/ff-architect` (cloned at `/home/user/ff-architect`):
- `docs/sop/astro-full-build-rules.md` (the build rules; "Rule N" below means this file)
- `docs/sop/astro-first-frame-and-pagespeed.md`
- `docs/sop/central-forms-contact-form.md`

Tested code to copy patterns from (not designs): `alchemistj/greene-planet-website`, cloned at
`/home/user/greene-planet-website` (header scroll, deferred embeds, `formsLead.ts`, route registry,
redirect checks, city config). It is React-heavy; this site uses plain `.astro` components.

## Sources of truth

- **Words:** `src/data/copy/*.json`, copied from the live site word for word by the audit
  (`/home/user/ff-architect/docs/clients/healthcareconsultants417/audit/copy/`). Never write,
  reword, shorten or "improve" copy. If a section needs words that don't exist, leave it out and
  list it in your report.
- **Images:** `src/data/legacyImageManifest.json` + originals in `src/assets/legacy/`. **Same photos,
  same order as the old page.** Re-encoding and resizing by the Astro build is fine. Never add,
  swap, generate, upscale, recolor or recrop-out-the-subject any photo. No stock. If a layout needs
  a photo the old page doesn't have, leave it out and report it.
- **Facts still unconfirmed (mark `TBD` in data, don't render):** "25 years of experience",
  whether Travis appears on the site. (Hours are settled; see Josh's decisions.) Phone (417) 720-0818 /
  `tel:+14177200818` and address 1450 W Cambridge St, Springfield, MO 65807 are the working NAP.
- **No star ratings or review counts.** Individual Google reviews only, as the audit captured them.

## Josh's decisions (2026-11-02)

- **Theme-demo image slots:** 25 images on the old pages came from the theme's demo server
  (`demo.themedraft.net`, listed under `excluded` in `src/data/legacyImageManifest.json`). They
  were placeholder stock, not her photos. Where one of those slots matters to the layout, **pick an
  appropriate photo from her own originals** in `src/assets/legacy/` (subject must match the
  section; prefer photos not already used on that page). Record every substitution in
  `docs/image-substitutions.md` (page, slot, demo file it replaces, her file chosen, one-line
  reason) and list it in the PR. Partner/brand logo strips (`brand-1..5.png`) and decorative
  `line-*.png` are dropped, not replaced. Every image that isn't a substitution still follows the
  image lock: same photo, same order.
- **Fonts:** keep both old fonts. Poppins for headings (weight 600) and Rubik for body (weight 400),
  **self-hosted** woff2 (e.g. from `@fontsource/poppins` / `@fontsource/rubik`, latin subset only),
  `font-display: swap`, **no preload**, never loaded from Google. Defined in `src/styles/tokens.css`.
- **No privacy policy and no terms pages.** Don't build them. Because there are no terms, the
  contact form has **no SMS consent checkbox** (Rule 14 makes it optional). Remove both legal
  routes from the registry's published list.
- **Hours:** the old site's header says "Hours of Operation: Mon-Sun 8am-5pm" on every page; the
  "24/7" was only facility copy. Hours may render as the copy shows them. "25 years" and Travis
  stay TBD (not rendered).
- **Vercel:** project `healthcareconsultants417-website` (team Josh Lenz's projects) is linked to
  this repo with Deployment Protection off (Rule 1.1). Every pushed branch gets a preview.

## Decisions

- Primary-city model: `/` is the Springfield home. One city in `cityConfig.ts` (`springfield`),
  city switcher hidden.
- Canonical host `https://www.healthcareconsultants417.com`, trailing slashes.
- Astro 5 static + `@astrojs/vercel`, Tailwind 4 via `@tailwindcss/vite`, TypeScript strict, Node 22,
  npm with committed lockfile. Zero client JS by default.
- Colors and fonts: `audit/brand.json` (the old site's real brand colors and font). Four colors
  only, defined once in `src/styles/tokens.css`.
- No WooCommerce, no blog. Old posts redirect (below).

## Route registry (every published URL)

| New URL | Old URL(s) | Type | Lane |
|---|---|---|---|
| `/` | `/` | home (Springfield) | C |
| `/about/` | `/about-us/` | about | C |
| `/about-rachal-payne/` | `/team/rachal-payne/` (doctio_team) | owner | C |
| `/zpods-medical-mission/` | `/zpods-medical-mission/` | company page | C |
| `/transitional-healthcare/` | `/transitional-healthcare/` | company page | C |
| `/resources/` | `/resources/` | company page | C |
| `/springfield/senior-community-placement/` | `/services/community-placement/` | service | D |
| `/springfield/senior-relocation/` | `/senior-relocation-services/`, `/services/relocation/` | service | D |
| `/springfield/senior-downsizing/` | `/senior-downsizing-help/` | service | D |
| `/springfield/zpod-sensory-beds/` | `/zpod-beds/`, `/services/assistive-technology/` | service | D |
| `/springfield/suicide-awareness/` | `/services/suicide-awareness/` | service | D |
| `/springfield/transitional-care/` | `/services/transitional-care/` | service | D |
| `/springfield/hospital-to-home-transition/` | `/services/hospital-to-home-transition/` | service | D |
| `/springfield/contact/` | `/contact-us/` | contact | E |
| ~~`/privacy-policy/`, `/terms/`~~ | Not built (Josh, Nov 2). Remove from the registry. | — | — |

Redirect-only (Lane F): `/contact-us-2-2/` (old Services page) → `/`; `/contact-us-2/` → `/`;
blog posts → closest service (`veterans-*` and `third-tuesday-suicide-loss-support-group` →
`/springfield/suicide-awareness/`, `rise-thrive-podcast` → `/resources/`); WooCommerce pages
(`/shop/`, `/cart/`, `/checkout/`, `/my-account/`, `/wishlist/`, `/shop-10/`, `/my-account-2/`,
products) → `/`; `/team/*` → `/about/` except Rachal's; existing EPS 301 Redirects entries
(export in `docs/legacy-redirects.csv` when present). Both slash forms of every source.
Keep `/wp-content/uploads/2024/11/About-zPods.pdf` working at the same path (file in `public/`).

Old menu (for header quick links and footer): Home · About Us (zPods Medical Mission,
Transitional Healthcare) · Services (Senior Community Placement, Relocation, zPods® Sensory Bed,
Suicide Awareness, Senior Downsizing Help) · Resources · Contact Us.

## Cursor jobs (Nov 2: built by Cursor through FF Architect, three jobs in parallel)

Lane B (shell) is done and merged. The remaining lanes are grouped into three Cursor jobs, each on
its own branch and PR into `claude/practical-goldberg-cz9xsu`. Each job owns the files of the
lanes it covers (below) and nothing else.

| Job | Branch | Covers | Extra files it may change |
|---|---|---|---|
| 1. Pages | `cursor/hc417-pages` | Lanes C + E | Logo in `Header.astro`/`Footer.astro`, `public/favicon.*`, fonts in `src/styles/tokens.css` (+ `@fontsource` deps in `package.json`/lockfile), drop legal routes in `src/lib/launchRouteRegistry.ts`, `docs/image-substitutions/pages.md` |
| 2. Services | `cursor/hc417-services` | Lane D | `docs/image-substitutions/services.md` |
| 3. Gates | `cursor/hc417-gates` | Lane F | `test:e2e` script + Playwright devDependency in `package.json`/lockfile |

If two jobs both need `package.json`, keep each job's change to its own lines; the integrator
resolves the lockfile at merge.

## Lanes and file ownership

Each lane works only on its branch, only in the files it owns. Shared files belong to Lane B;
if you need a change there, say so in your report instead of editing.

- **B — shell** (branch `lane-b-shell`): `package.json`, lockfile, `astro.config.mjs`,
  `tsconfig.json`, `eslint.config.js`, `src/styles/**`, `src/data/cityConfig.ts`,
  `src/lib/launchRouteRegistry.ts`, `src/layouts/**`, `src/components/**`, `scripts/**`,
  `test/helpers/**`, `vercel.json` (skeleton), `src/pages/_dev/` (scratch page for shell checks).
- **C — home + company pages** (`lane-c-home`): `src/pages/index.astro`, `src/pages/about/`,
  `src/pages/about-rachal-payne/`, `src/pages/zpods-medical-mission/`,
  `src/pages/transitional-healthcare/`, `src/pages/resources/`, `src/data/pages/{home,about,owner,company}*.ts`.
- **D — services** (`lane-d-services`): `src/pages/[city]/[service]/`, `src/data/services/**`.
- **E — contact, legal, form** (`lane-e-contact`): `src/pages/[city]/contact/`,
  `src/pages/privacy-policy/`, `src/pages/terms/`, `src/lib/formsLead.ts`, `src/components/forms/**`.
- **F — redirects, SEO, gates** (`lane-f-gates`): `src/data/redirects.ts`, `vercel.json` redirects
  block, `src/pages/{sitemap.xml,robots.txt,llms.txt}.ts`, `src/lib/jsonLd.ts`, `test/**` (except
  `test/helpers/` from B), `e2e/**`, `playwright.config.ts`.

## Checks every lane runs before pushing

`npm run check && npm run lint && npm test && npm run build && git diff --check`, plus:
- copy test: every string in `src/data/copy/` used by your pages appears in `dist` word for word;
- image lock: each page's images are exactly its manifest images, in order, originals' SHA-256 match;
- `dist` has no hot-linked WordPress or third-party image URLs, no other phone number than the NAP.

Push only to your lane branch, normal fast-forward. No PR, no merge, no force push, no `main`.
