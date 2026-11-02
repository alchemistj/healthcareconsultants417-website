/**
 * Turn crawled page copy into a render model.
 * Words stay word for word. Theme junk, mobile duplicates, and the unconfirmed
 * "25 years" lines are dropped. Photos stay in manifest order.
 */
import { basename } from "node:path";
import manifestJson from "@/data/legacyImageManifest.json";
import homeCopy from "@/data/copy/pages/home.json";
import aboutCopy from "@/data/copy/pages/about-us.json";
import ownerCopy from "@/data/copy/pages/team-rachal-payne.json";
import zpodsCopy from "@/data/copy/pages/zpods-medical-mission.json";
import transitionalCopy from "@/data/copy/pages/transitional-healthcare.json";
import resourcesCopy from "@/data/copy/pages/resources.json";
import contactCopy from "@/data/copy/pages/contact-us.json";

export type CopyBlock = {
  type: string;
  text?: string;
  href?: string;
  hidden?: boolean;
  mobile_only?: boolean;
};

type CopyPage = { slug: string; blocks: CopyBlock[] };

type ManifestImage = {
  order: number;
  alt: string | null;
  file: string;
  hidden?: boolean;
  mobile_only?: boolean;
  sha256: string;
};

const manifest = manifestJson as unknown as {
  pages: { slug: string; images: ManifestImage[] }[];
  logo: { file: string; sha256: string };
};

const COPY: Record<string, CopyPage> = {
  home: homeCopy,
  "about-us": aboutCopy,
  "team-rachal-payne": ownerCopy,
  "zpods-medical-mission": zpodsCopy,
  "transitional-healthcare": transitionalCopy,
  resources: resourcesCopy,
  "contact-us": contactCopy,
};

export type PageMeta = {
  slug: string;
  path: string;
  title: string;
  description: string;
  formButton: string;
  heroPosition: string;
};

const YEARS_APOSTROPHE = "\u2019";

export const PAGE_META: Record<string, PageMeta> = {
  home: {
    slug: "home",
    path: "/",
    title: "Welcome To The Future Of Healthcare | Transitional Healthcare Consultants",
    description:
      "Compassionate relocation and medication management solutions for every life transition. From moving assistance to real estate prep\u2014enjoy stress-free support.",
    formButton: "Free Consultation",
    heroPosition: "50% 30%",
  },
  "about-us": {
    slug: "about-us",
    path: "/about/",
    title: "About Us - Transitional Healthcare Consultants",
    description:
      "Whether you are moving from one healthcare facility to another, our team is dedicated to facilitating a coordinated transition. We collaborate with facility",
    formButton: "Contact Us",
    heroPosition: "42% 50%",
  },
  "team-rachal-payne": {
    slug: "team-rachal-payne",
    path: "/about-rachal-payne/",
    title: "Rachal Payne - Transitional Healthcare Consultants",
    description: `Rachal is a Registered Nurse with over 20 years${YEARS_APOSTROPHE} experience as a home health care case manager. She knows what it takes to provide hands-on patient care`,
    formButton: "Email Rachal",
    heroPosition: "42% 50%",
  },
  "zpods-medical-mission": {
    slug: "zpods-medical-mission",
    path: "/zpods-medical-mission/",
    title: "zPods Medical Mission - Transitional Healthcare Consultants",
    description: "Interrupting Insomnia for Children su4ering from Autism Spectrum Disorders and Sensory",
    formButton: "GET A QUOTE",
    heroPosition: "42% 50%",
  },
  "transitional-healthcare": {
    slug: "transitional-healthcare",
    path: "/transitional-healthcare/",
    title: "Transitional Healthcare - Transitional Healthcare Consultants",
    description:
      "Home safety evaluations for senior care are essential processes to ensure the well-being and safety of older adults who may require assistance or support in",
    formButton: "GET A QUOTE",
    heroPosition: "42% 50%",
  },
  resources: {
    slug: "resources",
    path: "/resources/",
    title: "Resources - Transitional Healthcare Consultants",
    description:
      "Explore helpful articles, checklists, and expert advice on relocations, medication management, and more. Stay informed for a smoother life transition.",
    formButton: "Free Consultation",
    heroPosition: "42% 50%",
  },
  "contact-us": {
    slug: "contact-us",
    path: "/springfield/contact/",
    title: "Contact Us - Transitional Healthcare Consultants",
    description:
      "Reach out for seamless relocations and medication management. Our compassionate specialists guide you every step of the way.",
    formButton: "Get In Touch",
    heroPosition: "42% 50%",
  },
};

/** Old paths to published paths. Longest match wins. */
const LEGACY_PATHS: readonly [string, string][] = [
  ["/services/community-placement/", "/springfield/senior-community-placement/"],
  ["/services/hospital-to-home-transition/", "/springfield/hospital-to-home-transition/"],
  ["/services/transitional-care/", "/springfield/transitional-care/"],
  ["/services/suicide-awareness/", "/springfield/suicide-awareness/"],
  ["/services/assistive-technology/", "/springfield/zpod-sensory-beds/"],
  ["/services/relocation/", "/springfield/senior-relocation/"],
  ["/senior-relocation-services/", "/springfield/senior-relocation/"],
  ["/senior-downsizing-help/", "/springfield/senior-downsizing/"],
  ["/zpod-beds/", "/springfield/zpod-sensory-beds/"],
  ["/third-tuesday-suicide-loss-support-group/", "/springfield/suicide-awareness/"],
  ["/veterans-of-the-ozarks-suicide-prevention/", "/springfield/suicide-awareness/"],
  ["/veterans-military-coalition-of-the-ozarks/", "/springfield/suicide-awareness/"],
  ["/rise-thrive-podcast/", "/resources/"],
  ["/team/rachal-payne/", "/about-rachal-payne/"],
  ["/zpods-medical-mission/", "/zpods-medical-mission/"],
  ["/transitional-healthcare/", "/transitional-healthcare/"],
  ["/contact-us-2-2/", "/"],
  ["/contact-us-2/", "/"],
  ["/contact-us/", "/springfield/contact/"],
  ["/about-us/", "/about/"],
  ["/resources/", "/resources/"],
  ["/services/", "/#services"],
  ["/team/", "/about/"],
];

const THEME_EXACT = new Set([
  "1",
  "Feedback",
  "Our Testimonials",
  "What Our Patients Say About Our Caring",
  "BESbswywb_incandescent",
  "Submit",
  "* Email *",
  "Name Layout Message",
  "Name * *",
  "Phone Name Layout",
  "* Email Email",
  "Email Subject Message",
  "Email Email *",
  "Email Phone Layout",
  "* * Email",
  "Email Name Email",
  "Subject Layout Phone",
  "* Phone *",
  "Name Name Email",
  "Email Phone Message",
  "* Subject *Phone",
  "* Email Subject",
  "25 Years Of Experience in Medical Services",
]);

/** Doctio page-banner and section-title chrome: breadcrumb, faded watermark, eyebrow. */
const THEME_CHROME_PARAGRAPHS = new Set([
  "Services",
  "Our Services",
  "About",
  "About Transitional Healthcare Consultants",
  "Team",
  "Transitional Healthcare Consultants",
  "Get In Touch",
  "Contact",
  "Blog News",
  "Article & Tips",
  "zPods \u00ae",
]);

const FIELD_LABELS = new Set([
  "Please enable JavaScript in your browser to complete this form.",
  "Name *",
  "First",
  "Last",
  "Email *",
  "Phone *",
  "Subject *",
  "Message *",
]);

export const SERVICE_CARD_TITLES = new Set([
  "Your Home Or Community Placement",
  "Relocation",
  "zPods",
  "Suicide Prevention & Education",
  "Senior Downsizing Help",
]);

export type Substitution = {
  page: string;
  slot: string;
  replaces: string;
  file: string;
  alt: string;
  reason: string;
};

export const SUBSTITUTIONS: readonly Substitution[] = [
  {
    page: "home",
    slot: "Home feature row, first photo (Consulting Advisors)",
    replaces: "https://demo.themedraft.net/wp/doctio/wp-content/uploads/2022/06/three-image-1.jpg",
    file: "src/assets/legacy/wp-content/uploads/2024/11/Care-Coordination.jpg",
    alt: "Clinicians meeting with an older patient and family",
    reason: "Theme stock beside Consulting Advisors. This is her photo of a care team with a family.",
  },
  {
    page: "home",
    slot: "Home feature row, second photo (Qualified Nurses)",
    replaces: "https://demo.themedraft.net/wp/doctio/wp-content/uploads/2022/06/three-image-2.jpg",
    file: "src/assets/legacy/wp-content/uploads/2024/12/Rachal-Payne-2.png",
    alt: "Rachal Payne",
    reason: "Theme stock beside Qualified Nurses. Rachal is the nurse, and this file is not already on the home page.",
  },
  {
    page: "home",
    slot: "Home feature row, third photo (Advanced Technology)",
    replaces: "https://demo.themedraft.net/wp/doctio/wp-content/uploads/2022/06/three-image-3.jpg",
    file: "src/assets/legacy/wp-content/uploads/2025/11/zPod-sensory-bed.jpg",
    alt: "Child resting in a zPods sensory bed",
    reason: "Theme stock beside Advanced Technology. The zPods bed is her technology, and this file is not already on the home page.",
  },
];

export type Inline =
  | { kind: "p"; text: string }
  | { kind: "heading"; level: 2 | 3 | 4; text: string; href?: string; id?: string }
  | { kind: "li"; text: string; href?: string }
  | { kind: "a"; text: string; href: string; button?: boolean }
  | { kind: "form" };

export type PageImage = {
  file: string;
  alt: string;
  position: string;
  fit: "cover" | "contain";
};

export type PageGroup = {
  inlines: Inline[];
  images: PageImage[];
  side: "right" | "left";
  feature: boolean;
};

export type PageModel = {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  subhead?: string;
  heroFile: string;
  heroAlt: string;
  heroPosition: string;
  formButton: string;
  groups: PageGroup[];
};

function isSiteHomeHref(href: string | undefined): boolean {
  if (!href) return false;
  try {
    const url = new URL(href, "https://www.healthcareconsultants417.com");
    return url.hostname === "www.healthcareconsultants417.com" && (url.pathname === "/" || url.pathname === "");
  } catch {
    return false;
  }
}

export function dropReason(block: CopyBlock): string | null {
  if (block.mobile_only) return "mobile-only duplicate";
  const text = (block.text ?? "").trim();
  if (!text) return "empty";
  if (text.includes("arrow_right") || text.includes("BESbswy") || text.includes("incandescent")) {
    return "icon-font";
  }
  if (text.startsWith("Transitional Healthcare Consultants > ")) return "breadcrumb";
  if (block.type === "link" && text === "Transitional Healthcare Consultants" && isSiteHomeHref(block.href)) {
    return "breadcrumb";
  }
  if (block.type === "p" && THEME_CHROME_PARAGRAPHS.has(text)) return "theme-chrome";
  if (/25\s*years/i.test(text)) return "25-years";
  if (/\bTravis\b/.test(text)) return "travis";
  if (THEME_EXACT.has(text)) return "theme-junk";
  return null;
}

export function keptImages(slug: string): ManifestImage[] {
  const page = manifest.pages.find((p) => p.slug === slug);
  if (!page) throw new Error(`No manifest page for ${slug}`);
  return page.images
    .filter((img) => !img.mobile_only && !img.hidden && !img.file.endsWith(".svg"))
    .sort((a, b) => a.order - b.order);
}

export function manifestSha(file: string): string | undefined {
  for (const page of manifest.pages) {
    const hit = page.images.find((img) => img.file === file);
    if (hit) return hit.sha256;
  }
  if (manifest.logo.file === file) return manifest.logo.sha256;
  return undefined;
}

function altFor(file: string, override?: string): string {
  if (override) return override;
  for (const page of manifest.pages) {
    const hit = page.images.find((img) => img.file === file && img.alt && img.alt.trim());
    if (hit?.alt) return hit.alt;
  }
  if (file.endsWith("/banner.jpg")) return "Nurse checking an older man's blood pressure during a home visit";
  return "";
}

function imageRecord(file: string, alt?: string): PageImage {
  const name = basename(file);
  const portrait = /rachal|Rachal-Payne|C-Hilt|Profile/i.test(name);
  const position = name.includes("zPod-sensory-bed") ? "62% 50%" : portrait ? "50% 18%" : "50% 40%";
  return {
    file,
    alt: altFor(file, alt),
    position,
    fit: name.endsWith("Rachal-Payne-2.png") ? "contain" : "cover",
  };
}

export function resolveHref(href: string | undefined): string | undefined {
  if (!href) return undefined;
  const trimmed = href.trim();
  if (trimmed.startsWith("mailto:")) return trimmed;
  if (trimmed.toLowerCase().startsWith("tel:")) return "tel:+14177200818";
  let path = trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      path = url.pathname || "/";
    } catch {
      return trimmed;
    }
  }
  if (!path.startsWith("/")) path = `/${path}`;
  if (/\.[a-z0-9]{2,5}$/i.test(path)) return path;
  const withSlash = path.endsWith("/") ? path : `${path}/`;
  const match = LEGACY_PATHS.find(([from]) => withSlash === from);
  if (match) return match[1];
  if (withSlash === "/") return "/";
  return withSlash;
}

function headingOnlyIntroducesYears(blocks: CopyBlock[], index: number): boolean {
  let sawYears = false;
  for (let j = index + 1; j < blocks.length; j++) {
    const block = blocks[j];
    if (block.type === "h1" || block.type === "h2" || block.type === "h3" || block.type === "h4") break;
    const reason = dropReason(block);
    if (!reason) return false;
    if (reason === "25-years") sawYears = true;
  }
  return sawYears;
}

export function keptStrings(slug: string): string[] {
  const page = COPY[slug];
  if (!page) throw new Error(slug);
  const out: string[] = [];
  page.blocks.forEach((block, index) => {
    if (dropReason(block)) return;
    if (
      (block.type === "h1" || block.type === "h2" || block.type === "h3" || block.type === "h4") &&
      headingOnlyIntroducesYears(page.blocks, index)
    ) {
      return;
    }
    if (block.text) out.push(block.text);
  });
  return out;
}

function pushGroup(groups: PageGroup[], group: PageGroup): PageGroup {
  if (group.inlines.length > 0 || group.images.length > 0) groups.push(group);
  return { inlines: [], images: [], side: "right", feature: false };
}

function serviceCardCount(group: PageGroup): number {
  return group.inlines.filter((node) => node.kind === "a" && SERVICE_CARD_TITLES.has(node.text)).length;
}

function headingText(group: PageGroup): string {
  const heading = group.inlines.find((node) => node.kind === "heading");
  return heading && heading.kind === "heading" ? heading.text : "";
}

function skipImage(group: PageGroup): boolean {
  const heading = headingText(group);
  if (heading === "Transitional Healthcare Consultants") return true;
  if (heading.startsWith("Our mission")) return true;
  if (heading === "We are here to help.") return true;
  if (heading === "Rachal") return true;
  if (heading.startsWith("Latest News")) return true;
  return false;
}

export function buildPage(slug: string): PageModel {
  const meta = PAGE_META[slug];
  const page = COPY[slug];
  if (!meta || !page) throw new Error(`Unknown page ${slug}`);
  const blocks = page.blocks;
  let index = 0;
  while (index < blocks.length && dropReason(blocks[index])) index += 1;
  const first = blocks[index];
  if (!first?.text) throw new Error(`No hero text for ${slug}`);
  const h1 = first.text;
  index += 1;
  let subhead: string | undefined;
  const next = blocks[index];
  if (
    first.type === "p" &&
    next?.type === "p" &&
    next.text &&
    !dropReason(next) &&
    !next.text.includes(">") &&
    next.text.length < 180
  ) {
    subhead = next.text;
    index += 1;
  }

  const groups: PageGroup[] = [];
  let current: PageGroup = { inlines: [], images: [], side: "right", feature: false };
  const seenHidden = new Set<string>();

  for (let i = index; i < blocks.length; i += 1) {
    const block = blocks[i];
    if (
      (block.type === "h1" || block.type === "h2" || block.type === "h3" || block.type === "h4") &&
      headingOnlyIntroducesYears(blocks, i)
    ) {
      continue;
    }
    const reason = dropReason(block);
    if (reason) continue;
    const text = block.text ?? "";
    if (block.hidden) {
      const key = `${text}::${block.href ?? ""}`;
      if (seenHidden.has(key)) continue;
      seenHidden.add(key);
    }
    if (text.startsWith("To schedule an appointment") || text.startsWith("To set an appointment")) {
      current = pushGroup(groups, current);
    }
    if (block.type === "link" && text === "CONSULTING ADVISORS") {
      current = pushGroup(groups, current);
      current.feature = true;
    }
    if (block.type === "h1" || block.type === "h2" || block.type === "h3" || block.type === "h4") {
      if (current.inlines.length > 0) current = pushGroup(groups, current);
      const level = block.type === "h4" ? 4 : block.type === "h3" ? 3 : 2;
      const href = resolveHref(block.href);
      current.inlines.push({
        kind: "heading",
        level,
        text,
        href,
        id: text === "Transitional Healthcare Consultants Services" ? "services" : undefined,
      });
      continue;
    }
    if (text === "Please enable JavaScript in your browser to complete this form.") {
      current.inlines.push({ kind: "form" });
      while (i + 1 < blocks.length) {
        const look = blocks[i + 1];
        const lookText = (look.text ?? "").trim();
        if (dropReason(look) || FIELD_LABELS.has(lookText) || look.type === "button") {
          i += 1;
          continue;
        }
        break;
      }
      continue;
    }
    if (block.type === "li") {
      current.inlines.push({ kind: "li", text, href: resolveHref(block.href) });
      continue;
    }
    if (block.type === "link" || block.type === "button" || block.href) {
      const href = resolveHref(block.href);
      if (!href) {
        current.inlines.push({ kind: "p", text });
        continue;
      }
      current.inlines.push({
        kind: "a",
        text,
        href,
        button: block.type === "button",
      });
      continue;
    }
    current.inlines.push({ kind: "p", text });
  }
  pushGroup(groups, current);

  const photos = keptImages(slug);
  if (photos.length === 0) throw new Error(`No photos for ${slug}`);
  const hero = photos[0];
  const queue = photos.slice(1).map((img) => imageRecord(img.file));
  const subs =
    slug === "home" ? SUBSTITUTIONS.map((item) => imageRecord(item.file, item.alt)) : [];
  let side = 0;
  const take = (group: PageGroup, count: number) => {
    const images: PageImage[] = [];
    for (let n = 0; n < count && queue.length > 0; n += 1) {
      const next = queue.shift();
      if (next) images.push(next);
    }
    if (images.length === 0) return;
    group.images.push(...images);
    group.side = side % 2 === 0 ? "right" : "left";
    side += 1;
  };

  groups.forEach((group, groupIndex) => {
    if (groupIndex === 0 || skipImage(group)) return;
    if (group.feature) {
      group.images.push(...subs);
      return;
    }
    const cards = serviceCardCount(group);
    take(group, cards >= 3 ? cards : 1);
  });
  while (queue.length > 0) {
    const group: PageGroup = { inlines: [], images: [], side: side % 2 === 0 ? "right" : "left", feature: false };
    take(group, 1);
    groups.push(group);
  }

  return {
    slug,
    path: meta.path,
    title: meta.title,
    description: meta.description,
    h1,
    subhead,
    heroFile: hero.file,
    heroAlt: altFor(hero.file),
    heroPosition: meta.heroPosition,
    formButton: meta.formButton,
    groups,
  };
}

export function pageImageFiles(model: PageModel): string[] {
  const files = [model.heroFile];
  for (const group of model.groups) {
    for (const image of group.images) files.push(image.file);
  }
  return files;
}

export function collectHrefs(model: PageModel): string[] {
  const hrefs: string[] = [];
  for (const group of model.groups) {
    for (const node of group.inlines) {
      if ((node.kind === "a" || node.kind === "heading" || node.kind === "li") && "href" in node && node.href) {
        hrefs.push(node.href);
      }
    }
  }
  return hrefs;
}
