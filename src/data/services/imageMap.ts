/**
 * Body photos for the service template. Imported only by the Astro page:
 * node tests load the page data, and they cannot import image files.
 */
import type { ImageMetadata } from "astro";

const modules = import.meta.glob<ImageMetadata>("../../assets/legacy/**/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

const byRepoPath = new Map<string, ImageMetadata>();

for (const [key, image] of Object.entries(modules)) {
  const normalized = key.replace(/\\/g, "/");
  const marker = "assets/legacy/";
  const at = normalized.indexOf(marker);
  if (at < 0) throw new Error(`Unexpected legacy image path: ${key}`);
  byRepoPath.set(`src/${normalized.slice(at)}`, image);
}

export function imageFor(file: string): ImageMetadata {
  const image = byRepoPath.get(file);
  if (!image) throw new Error(`No legacy image for ${file}`);
  return image;
}
