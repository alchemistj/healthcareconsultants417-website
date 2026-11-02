/**
 * Service-page shape. Strings are the audited copy, unchanged.
 * Photos are repo paths into src/assets/legacy (resolved in the page, not here,
 * so node tests can load this module).
 */

export type Part = { text: string; href?: string };

export type PhotoRef = {
  /** Repo path, for example src/assets/legacy/wp-content/uploads/2025/09/packing-items.jpg */
  file: string;
  alt: string;
  objectPosition?: string;
};

export type Group = { title: string; paragraphs: Part[][] };

export type ProseSection = {
  type: "prose";
  heading?: string;
  paragraphs?: Part[][];
  items?: Part[][];
  groups?: Group[];
  button?: string;
};

export type SplitSection = {
  type: "split";
  heading: string;
  paragraphs?: Part[][];
  items?: Part[][];
  groups?: Group[];
  button?: string;
  photo: PhotoRef;
  side: "left" | "right";
};

export type CardsSection = {
  type: "cards";
  heading?: string;
  intro?: Part[][];
  items: { title: string; paragraphs: Part[][]; icon?: PhotoRef }[];
};

export type StepsSection = {
  type: "steps";
  heading: string;
  headers: string[];
  steps: { title: string; lines: string[] }[];
  photo?: PhotoRef;
  side?: "left" | "right";
};

export type FaqSection = {
  type: "faq";
  heading: string;
  items: { question: string; answer: string }[];
};

export type CtaSection = {
  type: "cta";
  heading: string;
  paragraphs?: Part[][];
  button?: string;
  photo?: PhotoRef;
  side?: "left" | "right";
};

/** Marker so the related band sits in Rule 11 order. No client copy. */
export type RelatedSection = { type: "related" };

export type Section =
  | ProseSection
  | SplitSection
  | CardsSection
  | StepsSection
  | FaqSection
  | CtaSection
  | RelatedSection;

export type DroppedBlock = { index: number; reason: string };

export type DroppedImage = { file: string; reason: string };

export type ServicePage = {
  slug: string;
  /** Key in legacyImageManifest.json pages[].slug */
  manifestSlug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow?: string;
  subhead?: string;
  heroFile: string;
  heroAlt: string;
  heroPosition: string;
  relatedSlugs: readonly string[];
  sections: Section[];
  /** Copy-block indexes that are rendered, so a test can require every other block to be dropped on purpose. */
  usedBlocks: readonly number[];
  droppedBlocks: readonly DroppedBlock[];
  droppedImages: readonly DroppedImage[];
};

export function text(value: string): Part[] {
  return [{ text: value }];
}

/** Wrap one exact phrase in a link. The joined parts equal the original string. */
export function linkPhrase(value: string, phrase: string, href: string): Part[] {
  const at = value.indexOf(phrase);
  if (at < 0) throw new Error(`Phrase not in copy: ${phrase}`);
  const parts: Part[] = [];
  if (at > 0) parts.push({ text: value.slice(0, at) });
  parts.push({ text: phrase, href });
  const rest = value.slice(at + phrase.length);
  if (rest) parts.push({ text: rest });
  return parts;
}
