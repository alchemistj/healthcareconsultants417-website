/**
 * Real logo from legacyImageManifest.json, re-encoded at build time.
 * Inline data URI, 4KB or smaller. Never redrawn.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import manifest from "@/data/legacyImageManifest.json";

export type InlineLogo = {
  src: string;
  width: number;
  height: number;
  bytes: number;
};

let pending: Promise<InlineLogo> | undefined;

export function inlineLogo(): Promise<InlineLogo> {
  pending ??= encodeLogo();
  return pending;
}

async function encodeLogo(): Promise<InlineLogo> {
  const file = manifest.logo.file;
  const original = await readFile(join(process.cwd(), file));
  let lastBytes = 0;
  for (const height of [80, 72, 64, 56, 48]) {
    for (const quality of [55, 40, 30, 22, 16]) {
      const { data, info } = await sharp(original)
        .resize({ height, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer({ resolveWithObject: true });
      lastBytes = data.length;
      if (data.length <= 4096) {
        return {
          src: `data:image/webp;base64,${data.toString("base64")}`,
          width: info.width,
          height: info.height,
          bytes: data.length,
        };
      }
    }
  }
  throw new Error(`Logo is ${lastBytes} bytes; the inline logo must be 4KB or smaller.`);
}
