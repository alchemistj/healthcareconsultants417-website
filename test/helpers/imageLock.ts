/**
 * Image lock: a built page must reference derivatives of exactly the manifest photos,
 * in manifest order. Re-encoding and resizing by the Astro build is fine; adding,
 * swapping or reordering photos is not.
 *
 * How derivatives are traced:
 * - Astro names optimized files after the original: /_astro/<name>.<hash>_<hash>.webp,
 *   so "<name>" is the original's file name without extension.
 * - The inline hero is a data URI. Hero.astro writes the original file name in
 *   data-source-file, which is used instead.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { basename, extname } from "node:path";

/** A manifest entry: a file name/path string, or an object naming the file. */
export type ManifestEntry = string | { file?: string; filename?: string; path?: string; src?: string };

export function manifestEntryName(entry: ManifestEntry): string {
  const raw = typeof entry === "string" ? entry : (entry.file ?? entry.filename ?? entry.path ?? entry.src);
  if (!raw) throw new Error(`Manifest entry has no file name: ${JSON.stringify(entry)}`);
  return stem(basename(raw));
}

function stem(fileName: string): string {
  const ext = extname(fileName);
  return ext ? fileName.slice(0, -ext.length) : fileName;
}

/** "photo.Abc123_Z1x.webp" -> "photo"; "my.photo.Abc123_Z1x.webp" -> "my.photo". */
export function originalStemFromDerivative(src: string): string | undefined {
  const path = src.split(/[?#]/)[0];
  if (!path.includes("/_astro/")) return undefined;
  const withoutExt = stem(basename(path));
  const match = /^(.+)\.[A-Za-z0-9_-]+$/.exec(withoutExt);
  return match ? match[1] : undefined;
}

/** Original stems the page uses, in document order, consecutive duplicates collapsed. */
export function builtImageStems(html: string): string[] {
  const stems: string[] = [];
  const push = (name: string | undefined) => {
    if (name && stems[stems.length - 1] !== name) stems.push(name);
  };
  const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
  for (const tag of imgTags) {
    const source = /\sdata-source-file="([^"]+)"/i.exec(tag);
    if (source) {
      push(stem(basename(source[1])));
      continue;
    }
    const src = /\ssrc="([^"]+)"/i.exec(tag);
    if (src && !src[1].startsWith("data:")) push(originalStemFromDerivative(src[1]));
  }
  return stems;
}

export type ImageLockResult = { ok: boolean; expected: string[]; actual: string[] };

export function checkImageLock(html: string, manifestEntries: readonly ManifestEntry[]): ImageLockResult {
  const expected = manifestEntries.map(manifestEntryName);
  const actual = builtImageStems(html);
  const ok = expected.length === actual.length && expected.every((name, i) => name === actual[i]);
  return { ok, expected, actual };
}

export function assertImageLock(html: string, manifestEntries: readonly ManifestEntry[], label = "page"): void {
  const { ok, expected, actual } = checkImageLock(html, manifestEntries);
  if (!ok) {
    throw new Error(
      `Image lock failed for ${label}.\nExpected (manifest order): ${expected.join(", ")}\nFound in build:  ${actual.join(", ")}`,
    );
  }
}

export function sha256File(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

/** Originals on disk must still hash to the manifest's SHA-256. */
export function assertOriginalHashes(entries: readonly { path: string; sha256: string }[]): void {
  const bad = entries.filter((e) => sha256File(e.path) !== e.sha256.toLowerCase());
  if (bad.length > 0) {
    throw new Error(`SHA-256 mismatch for: ${bad.map((b) => b.path).join(", ")}`);
  }
}
