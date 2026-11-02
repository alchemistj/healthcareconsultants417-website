import type { Part, Section, ServicePage } from "./types.ts";

function pushParts(out: string[], paragraphs: Part[][] | undefined): void {
  if (!paragraphs) return;
  for (const paragraph of paragraphs) {
    out.push(paragraph.map((part) => part.text).join(""));
  }
}

/** Every client string this page object will render, in walk order. */
export function collectPageStrings(page: ServicePage): string[] {
  const out: string[] = [];
  if (page.eyebrow) out.push(page.eyebrow);
  out.push(page.h1);
  if (page.subhead) out.push(page.subhead);
  for (const section of page.sections) pushSection(out, section);
  return out;
}

function pushSection(out: string[], section: Section): void {
  switch (section.type) {
    case "related":
      return;
    case "prose":
    case "split":
      if (section.heading) out.push(section.heading);
      pushParts(out, section.paragraphs);
      if (section.items) for (const item of section.items) out.push(item.map((part) => part.text).join(""));
      if (section.groups) {
        for (const group of section.groups) {
          out.push(group.title);
          pushParts(out, group.paragraphs);
        }
      }
      if (section.button) out.push(section.button);
      return;
    case "cards":
      if (section.heading) out.push(section.heading);
      pushParts(out, section.intro);
      for (const item of section.items) {
        out.push(item.title);
        pushParts(out, item.paragraphs);
      }
      return;
    case "steps":
      out.push(section.heading);
      out.push(...section.headers);
      for (const step of section.steps) {
        out.push(step.title);
        out.push(...step.lines);
      }
      return;
    case "faq":
      out.push(section.heading);
      for (const item of section.items) {
        out.push(item.question);
        out.push(item.answer);
      }
      return;
    case "cta":
      out.push(section.heading);
      pushParts(out, section.paragraphs);
      if (section.button) out.push(section.button);
      return;
    default: {
      const never: never = section;
      throw new Error(`Unknown section ${(never as { type: string }).type}`);
    }
  }
}

export function collectImageFiles(page: ServicePage): string[] {
  const files = [page.heroFile];
  for (const section of page.sections) {
    if ((section.type === "split" || section.type === "steps" || section.type === "cta") && section.photo) {
      files.push(section.photo.file);
    }
    if (section.type === "cards") {
      for (const item of section.items) {
        if (item.icon) files.push(item.icon.file);
      }
    }
  }
  return files;
}
