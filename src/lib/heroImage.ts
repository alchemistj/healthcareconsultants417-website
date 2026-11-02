/**
 * Build-time hero helper (SOP astro-first-frame-and-pagespeed section 3).
 * One final AVIF, about 1280px wide, 35-60KB, returned as a data URI to inline once.
 * Never upscales. Crop is set in CSS with object-position, not here.
 */
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";
import sharp from "sharp";

export const HERO_WIDTH = 1280;
export const HERO_MIN_BYTES = 35_000;
export const HERO_TARGET_BYTES = 48_000;
export const HERO_MAX_BYTES = 60_000;

export type HeroImageData = {
  /** `data:image/avif;base64,...` */
  src: string;
  width: number;
  height: number;
  /** Encoded AVIF size in bytes. */
  bytes: number;
  /** Original file name, emitted as `data-source-file` so tests can lock the photo. */
  sourceFile: string;
  /** SHA-256 of the original file's bytes. */
  sourceSha256: string;
  quality: number;
};

export type HeroImageOptions = {
  width?: number;
  /** Highest quality to try. Default 60. */
  maxQuality?: number;
  /** Lowest quality to accept. Default 28. */
  minQuality?: number;
  /** AVIF effort 0-9. Default 9 (slowest, smallest). Scratch pages may lower it. */
  effort?: number;
};

const cache = new Map<string, Promise<HeroImageData>>();

export async function heroImage(
  input: string | Buffer,
  options: HeroImageOptions = {},
): Promise<HeroImageData> {
  if (typeof input === "string") {
    const info = await stat(input);
    const key = `${input}:${info.mtimeMs}:${JSON.stringify(options)}`;
    const hit = cache.get(key);
    if (hit) return hit;
    const pending = encode(await readFile(input), basename(input), options);
    cache.set(key, pending);
    return pending;
  }
  return encode(input, "buffer", options);
}

async function encode(
  original: Buffer,
  sourceFile: string,
  options: HeroImageOptions,
): Promise<HeroImageData> {
  const targetWidth = options.width ?? HERO_WIDTH;
  const maxQuality = options.maxQuality ?? 60;
  const minQuality = options.minQuality ?? 28;

  const resized = await sharp(original)
    .rotate()
    .resize({ width: targetWidth, withoutEnlargement: true })
    .toBuffer();

  let best: { data: Buffer; width: number; height: number; quality: number } | undefined;
  for (let quality = maxQuality; quality >= minQuality; quality -= 4) {
    const { data, info } = await sharp(resized)
      .avif({ quality, effort: options.effort ?? 9 })
      .toBuffer({ resolveWithObject: true });
    best = { data, width: info.width, height: info.height, quality };
    if (data.length <= HERO_TARGET_BYTES) break;
  }
  if (!best) throw new Error("heroImage: no encode attempt ran");
  if (best.data.length > HERO_MAX_BYTES) {
    throw new Error(
      `heroImage: ${sourceFile} is ${best.data.length} bytes at quality ${best.quality}; budget is ${HERO_MAX_BYTES}. Change the crop or the photo; do not raise the budget.`,
    );
  }
  if (best.data.length < HERO_MIN_BYTES) {
    console.warn(
      `heroImage: ${sourceFile} is only ${best.data.length} bytes (budget ${HERO_MIN_BYTES}-${HERO_MAX_BYTES}). Fine if the photo is simple.`,
    );
  }

  return {
    src: `data:image/avif;base64,${best.data.toString("base64")}`,
    width: best.width,
    height: best.height,
    bytes: best.data.length,
    sourceFile,
    sourceSha256: createHash("sha256").update(original).digest("hex"),
    quality: best.quality,
  };
}
