/**
 * Renders each page of a PDF to a slide image, the same shape the rest of the
 * site's imagery takes: a full-size copy and a thumbnail per page.
 *
 * A PDF in an iframe is the one thing that reliably fails on a phone — some
 * mobile browsers draw the first page and nothing else, some draw nothing. Page
 * images do not: they swipe, they lazy-load one at a time rather than pulling
 * megabytes before anything appears, and they behave identically everywhere.
 * The PDF itself stays one tap away for whoever wants the real file.
 *
 * Not part of the build — run it by hand when the deck is re-exported:
 *
 *   npm i --no-save pdfjs-dist @napi-rs/canvas sharp
 *   node scripts/render-deck.mjs "src/data/AHMED  YEHIA  portfolio.pdf" deck
 *   node scripts/render-deck.mjs "src/data/Ahmed Yehia C.V.pdf" cv
 *
 * It writes public/media/<slug>/NN.jpg and NN-t.jpg, then prints the entry to
 * paste into src/data/media.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";
import sharp from "sharp";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const SRC = process.argv[2];
const SLUG = process.argv[3];
const LONG_EDGE = Number(process.argv[4] ?? 1600);
const THUMB = 320;

if (!SRC || !SLUG) {
  console.error("usage: node scripts/render-deck.mjs <file.pdf> <slug> [longEdge]");
  process.exit(1);
}

const outDir = path.join("public", "media", SLUG);
fs.mkdirSync(outDir, { recursive: true });

const doc = await pdfjs.getDocument({
  data: new Uint8Array(fs.readFileSync(SRC)),
  useSystemFonts: true,
}).promise;

const rows = [];

for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const unit = page.getViewport({ scale: 1 });
  /* Scale off the long edge so a portrait CV and a landscape deck both land at
     a sane pixel count rather than one of them being rendered enormous. */
  const scale = LONG_EDGE / Math.max(unit.width, unit.height);
  const vp = page.getViewport({ scale });

  const canvas = createCanvas(Math.round(vp.width), Math.round(vp.height));
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;

  const png = canvas.toBuffer("image/png");
  const stem = String(i).padStart(2, "0");

  await sharp(png).jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(path.join(outDir, `${stem}.jpg`));
  await sharp(png)
    .resize(THUMB)
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(path.join(outDir, `${stem}-t.jpg`));

  rows.push(
    `    { src: "/media/${SLUG}/${stem}.jpg", thumb: "/media/${SLUG}/${stem}-t.jpg", w: ${canvas.width}, h: ${canvas.height} },`,
  );
  process.stdout.write(`\rpage ${i}/${doc.numPages}`);
}

const bytes = fs
  .readdirSync(outDir)
  .reduce((sum, f) => sum + fs.statSync(path.join(outDir, f)).size, 0);

console.log(`\n${doc.numPages} pages -> ${outDir} (${(bytes / 1e6).toFixed(2)} MB total, loaded one at a time)\n`);
console.log(`  "${SLUG}": [`);
console.log(rows.join("\n"));
console.log("  ],");
