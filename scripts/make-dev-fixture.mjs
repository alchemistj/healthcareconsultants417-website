// Generates the synthetic placeholder used ONLY by src/pages/_dev/. It is not a client photo.
// Run once: node scripts/make-dev-fixture.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const width = 1600;
const height = 1000;
const gradient = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#5b8a8f"/>
        <stop offset="0.55" stop-color="#d9c7a3"/>
        <stop offset="1" stop-color="#7a5a4a"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="1150" cy="330" r="190" fill="#ffffff" fill-opacity="0.35"/>
    <rect x="160" y="560" width="760" height="300" rx="24" fill="#1f2a37" fill-opacity="0.3"/>
  </svg>`,
);

const noise = await sharp({
  create: {
    width,
    height,
    channels: 3,
    background: { r: 128, g: 128, b: 128 },
    noise: { type: "gaussian", mean: 128, sigma: 50 },
  },
})
  .blur(0.3)
  .png()
  .toBuffer();

await mkdir("src/assets/_dev", { recursive: true });
await sharp(gradient)
  .composite([{ input: noise, blend: "soft-light" }])
  .jpeg({ quality: 80 })
  .toFile("src/assets/_dev/dev-photo.jpg");
console.log("wrote src/assets/_dev/dev-photo.jpg");
