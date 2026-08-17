/**
 * Recompress the JPEGs inside a PDF, per image, to a fidelity floor.
 *
 * The deck is 94% DCTDecode bytes, so its size is entirely a question of how
 * those JPEGs are stored. Each image is downsampled to the resolution it is
 * actually *placed* at — found by walking the content streams and reading the
 * CTM at each `Do` — and re-encoded with mozjpeg.
 *
 * Photographs take that happily. The CAD-drawing slides do not: coloured
 * hairlines on black are the one thing chroma subsampling and a low quality
 * factor genuinely destroy. So rather than guessing which is which, every
 * candidate is decoded back and measured against the original (PSNR at the
 * viewing resolution). Anything below the floor escalates up a ladder of
 * gentler settings, and an image that never clears it keeps its original bytes.
 *
 * Not part of the build — run it by hand when the deck is re-exported:
 *
 *   npm i --no-save sharp pdf-lib
 *   node scripts/compress-pdf.mjs "src/data/AHMED  YEHIA  portfolio.pdf" \
 *     public/docs/ahmed-yehia-portfolio.pdf 33 150
 *
 * Arguments: source, destination, PSNR floor in dB, evaluation DPI. The master
 * in src/data stays untouched; only the served copy is rewritten.
 */
import fs from "node:fs";
import zlib from "node:zlib";
import crypto from "node:crypto";
import sharp from "sharp";
import { PDFDocument, PDFName, PDFRawStream, PDFArray, PDFDict, PDFRef } from "pdf-lib";

const SRC = process.argv[2];
const OUT = process.argv[3];
const FLOOR = Number(process.argv[4] ?? 38); // dB
const EVAL_DPI = Number(process.argv[5] ?? 150);

/** Tried in order; first one to clear the floor wins. */
const LADDER = JSON.parse(process.env.LADDER ?? "null") ?? [
  { dpi: 150, quality: 72, chroma: "4:2:0" },
  { dpi: 200, quality: 82, chroma: "4:4:4" },
  { dpi: 300, quality: 88, chroma: "4:4:4" },
  { dpi: Infinity, quality: 92, chroma: "4:4:4" },
];

/* ---------------------------------------------------------------- tokenizer */

const WHITE = new Set([0x00, 0x09, 0x0a, 0x0c, 0x0d, 0x20]);
const DELIM = new Set([0x28, 0x29, 0x3c, 0x3e, 0x5b, 0x5d, 0x7b, 0x7d, 0x2f, 0x25]);

/** Yields {type:'num'|'name'|'op'}. Strings and inline images are stepped over. */
function* tokens(buf) {
  let i = 0;
  const n = buf.length;
  while (i < n) {
    const c = buf[i];
    if (WHITE.has(c)) {
      i++;
    } else if (c === 0x25) {
      while (i < n && buf[i] !== 0x0a && buf[i] !== 0x0d) i++;
    } else if (c === 0x28) {
      let depth = 1;
      i++;
      while (i < n && depth > 0) {
        if (buf[i] === 0x5c) i += 2;
        else if (buf[i] === 0x28) (depth++, i++);
        else if (buf[i] === 0x29) (depth--, i++);
        else i++;
      }
    } else if (c === 0x3c && buf[i + 1] !== 0x3c) {
      while (i < n && buf[i] !== 0x3e) i++;
      i++;
    } else if (c === 0x2f) {
      let j = i + 1;
      while (j < n && !WHITE.has(buf[j]) && !DELIM.has(buf[j])) j++;
      yield { type: "name", value: buf.toString("latin1", i + 1, j) };
      i = j;
    } else if ((c >= 0x30 && c <= 0x39) || c === 0x2b || c === 0x2d || c === 0x2e) {
      let j = i;
      while (j < n && !WHITE.has(buf[j]) && !DELIM.has(buf[j])) j++;
      const v = parseFloat(buf.toString("latin1", i, j));
      yield { type: "num", value: Number.isFinite(v) ? v : 0 };
      i = j;
    } else if (DELIM.has(c)) {
      i += c === 0x3c || c === 0x3e ? 2 : 1;
    } else {
      let j = i;
      while (j < n && !WHITE.has(buf[j]) && !DELIM.has(buf[j])) j++;
      const op = buf.toString("latin1", i, j);
      i = j;
      if (op === "BI") {
        while (i < n - 1 && !(buf[i] === 0x45 && buf[i + 1] === 0x49 && WHITE.has(buf[i - 1] ?? 0x20))) i++;
        i += 2;
        continue;
      }
      yield { type: "op", value: op };
    }
  }
}

const mul = (m, o) => [
  m[0] * o[0] + m[1] * o[2],
  m[0] * o[1] + m[1] * o[3],
  m[2] * o[0] + m[3] * o[2],
  m[2] * o[1] + m[3] * o[3],
  m[4] * o[0] + m[5] * o[2] + o[4],
  m[4] * o[1] + m[5] * o[3] + o[5],
];

/* ------------------------------------------------------- placed-size survey */

const doc = await PDFDocument.load(fs.readFileSync(SRC), { ignoreEncryption: true, updateMetadata: false });
const ctx = doc.context;

function rawBytes(stream) {
  const f = stream.dict.get(PDFName.of("Filter"))?.toString() ?? "";
  if (f.includes("FlateDecode")) {
    try {
      return zlib.inflateSync(Buffer.from(stream.contents));
    } catch {
      try {
        return zlib.inflateRawSync(Buffer.from(stream.contents));
      } catch {
        return null;
      }
    }
  }
  return f === "" ? Buffer.from(stream.contents) : null;
}

const placed = new Map();
const seenForms = new Set();

function note(ref, w, h) {
  const cur = placed.get(ref.tag);
  if (!cur || w * h > cur.w * cur.h) placed.set(ref.tag, { w, h });
}

function walk(contentBuf, resources, ctm, depth) {
  if (!contentBuf || depth > 8) return;
  let xobjects = null;
  try {
    xobjects = resources?.lookup?.(PDFName.of("XObject"), PDFDict) ?? null;
  } catch {
    /* page draws no image XObjects */
  }
  const stack = [];
  let m = ctm;
  let operands = [];

  for (const t of tokens(contentBuf)) {
    if (t.type !== "op") {
      operands.push(t);
      if (operands.length > 8) operands.shift();
      continue;
    }
    switch (t.value) {
      case "q":
        stack.push(m);
        break;
      case "Q":
        m = stack.pop() ?? m;
        break;
      case "cm": {
        const n = operands.filter((o) => o.type === "num").slice(-6).map((o) => o.value);
        if (n.length === 6) m = mul(n, m);
        break;
      }
      case "Do": {
        const nameTok = [...operands].reverse().find((o) => o.type === "name");
        if (!nameTok || !xobjects) break;
        const ref = xobjects.get(PDFName.of(nameTok.value));
        const xo = ref instanceof PDFRef ? ctx.lookup(ref) : ref;
        if (!(xo instanceof PDFRawStream)) break;
        const sub = xo.dict.get(PDFName.of("Subtype"))?.toString();
        if (sub === "/Image" && ref instanceof PDFRef) {
          note(ref, Math.hypot(m[0], m[1]), Math.hypot(m[2], m[3]));
        } else if (sub === "/Form" && ref instanceof PDFRef && !seenForms.has(ref.tag + m.join(","))) {
          seenForms.add(ref.tag + m.join(","));
          const mtx = xo.dict.lookup(PDFName.of("Matrix"), PDFArray);
          const fm = mtx ? mul(mtx.asArray().map((x) => x.asNumber()), m) : m;
          walk(rawBytes(xo), xo.dict.lookup(PDFName.of("Resources"), PDFDict), fm, depth + 1);
        }
        break;
      }
    }
    operands = [];
  }
}

for (const page of doc.getPages()) {
  const node = page.node;
  const contents = node.Contents();
  let buf = null;
  if (contents instanceof PDFArray) {
    const parts = [];
    for (let i = 0; i < contents.size(); i++) {
      const s = ctx.lookup(contents.get(i));
      if (s instanceof PDFRawStream) parts.push(rawBytes(s) ?? Buffer.alloc(0));
    }
    buf = Buffer.concat(parts.flatMap((p) => [p, Buffer.from("\n")]));
  } else if (contents) {
    const s = contents instanceof PDFRawStream ? contents : ctx.lookup(contents);
    if (s instanceof PDFRawStream) buf = rawBytes(s);
  }
  walk(buf, node.Resources(), [1, 0, 0, 1, 0, 0], 0);
}

/* --------------------------------------------------------------- fidelity */

/** Raw RGB at a fixed size, so two encodings can be compared pixel for pixel. */
async function raw(buf, w, h) {
  return await sharp(buf, { failOn: "none" })
    .resize(w, h, { fit: "fill", kernel: "lanczos3" })
    .removeAlpha()
    .toColourspace("srgb")
    .raw()
    .toBuffer();
}

/** Luma plane at a fixed size — SSIM is defined on a single channel. */
async function luma(buf, w, h) {
  return await sharp(buf, { failOn: "none" })
    .resize(w, h, { fit: "fill", kernel: "lanczos3" })
    .removeAlpha()
    .greyscale()
    .raw()
    .toBuffer();
}

/** Global mean SSIM over 8x8 windows, stride 4. */
function ssim(a, b, w, h) {
  const C1 = (0.01 * 255) ** 2;
  const C2 = (0.03 * 255) ** 2;
  const win = 8;
  const stride = 4;
  let total = 0;
  let count = 0;
  for (let y = 0; y + win <= h; y += stride) {
    for (let x = 0; x + win <= w; x += stride) {
      let sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0;
      for (let j = 0; j < win; j++) {
        let idx = (y + j) * w + x;
        for (let i = 0; i < win; i++, idx++) {
          const va = a[idx];
          const vb = b[idx];
          sa += va; sb += vb; saa += va * va; sbb += vb * vb; sab += va * vb;
        }
      }
      const n = win * win;
      const ma = sa / n;
      const mb = sb / n;
      const va = saa / n - ma * ma;
      const vb = sbb / n - mb * mb;
      const cov = sab / n - ma * mb;
      total += ((2 * ma * mb + C1) * (2 * cov + C2)) / ((ma * ma + mb * mb + C1) * (va + vb + C2));
      count++;
    }
  }
  return count ? total / count : 1;
}

function psnr(a, b) {
  let se = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    se += d * d;
  }
  const mse = se / a.length;
  return mse === 0 ? Infinity : 10 * Math.log10((255 * 255) / mse);
}

/* ------------------------------------------------------------- recompress */

const jobs = [];
for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
  if (!(obj instanceof PDFRawStream)) continue;
  const d = obj.dict;
  if (d.get(PDFName.of("Subtype"))?.toString() !== "/Image") continue;
  if (d.get(PDFName.of("Filter"))?.toString() !== "/DCTDecode") continue;
  if (d.get(PDFName.of("BitsPerComponent"))?.asNumber?.() !== 8) continue;
  const cs = d.get(PDFName.of("ColorSpace"))?.toString();
  if (cs !== "/DeviceRGB" && cs !== "/DeviceGray") continue;
  if (d.get(PDFName.of("Decode"))) continue;
  jobs.push({ ref, obj });
}

const cache = new Map();
let before = 0;
let after = 0;
const rungCount = new Array(LADDER.length + 1).fill(0);

for (const { ref, obj } of jobs) {
  const src = Buffer.from(obj.contents);
  const w = obj.dict.get(PDFName.of("Width")).asNumber();
  const h = obj.dict.get(PDFName.of("Height")).asNumber();
  before += src.length;

  const p = placed.get(ref.tag);
  const key = crypto.createHash("sha1").update(src).digest("hex") + `:${p ? `${p.w.toFixed(1)}x${p.h.toFixed(1)}` : "unplaced"}`;

  let result = cache.get(key);
  if (result === undefined) {
    // Judged at the resolution a reader sees when they zoom in on the slide,
    // never above what the source actually holds.
    const evalW = Math.min(w, Math.max(64, Math.ceil(((p?.w ?? w) / 72) * EVAL_DPI)));
    const evalH = Math.min(h, Math.max(64, Math.ceil(((p?.h ?? h) / 72) * EVAL_DPI)));
    const reference = await raw(src, evalW, evalH);

    result = null;
    for (let rung = 0; rung < LADDER.length; rung++) {
      const { dpi, quality, chroma } = LADDER[rung];
      const tw = p && dpi !== Infinity ? Math.min(w, Math.max(16, Math.ceil((p.w / 72) * dpi))) : w;
      const th = p && dpi !== Infinity ? Math.min(h, Math.max(16, Math.ceil((p.h / 72) * dpi))) : h;

      let out;
      try {
        let img = sharp(src, { failOn: "none" });
        if (tw < w || th < h) img = img.resize(tw, th, { fit: "fill", kernel: "lanczos3" });
        out = await img.jpeg({ quality, mozjpeg: true, chromaSubsampling: chroma }).toBuffer();
      } catch {
        break;
      }
      if (out.length >= src.length) continue; // no point going gentler still
      const score = psnr(reference, await raw(out, evalW, evalH));
      if (score >= FLOOR) {
        result = { out, rung, score };
        break;
      }
    }
    cache.set(key, result);
  }

  if (!result) {
    after += src.length;
    rungCount[LADDER.length]++;
    continue;
  }

  const meta = await sharp(result.out).metadata();
  obj.dict.set(PDFName.of("Width"), ctx.obj(meta.width));
  obj.dict.set(PDFName.of("Height"), ctx.obj(meta.height));
  if (meta.channels === 1) obj.dict.set(PDFName.of("ColorSpace"), PDFName.of("DeviceGray"));
  ctx.assign(ref, PDFRawStream.of(obj.dict, new Uint8Array(result.out)));
  after += result.out.length;
  rungCount[result.rung]++;
}

/* ------------------------------------------------------------------ dedup */

/* The slide background and the two logos are re-embedded on every page. Once
   they are byte-identical they can share one object — lossless, and it is the
   cheapest megabyte in the file. */
const canonical = new Map(); // hash -> ref
const alias = new Map(); // duplicate ref tag -> canonical ref
let reclaimed = 0;

for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
  if (!(obj instanceof PDFRawStream)) continue;
  if (obj.dict.get(PDFName.of("Subtype"))?.toString() !== "/Image") continue;
  const hash = crypto
    .createHash("sha1")
    .update(obj.dict.toString())
    .update(Buffer.from(obj.contents))
    .digest("hex");
  const first = canonical.get(hash);
  if (first) {
    alias.set(ref.tag, first);
    reclaimed += obj.contents.length;
  } else {
    canonical.set(hash, ref);
  }
}

if (alias.size) {
  /* Resources/XObject are usually direct dicts hanging off the page, so the
     rewrite has to descend, not just check top-level entries. */
  const visited = new Set();
  const rewrite = (node) => {
    if (!node || visited.has(node)) return;
    visited.add(node);
    if (node instanceof PDFRawStream) return rewrite(node.dict);
    if (node instanceof PDFDict) {
      for (const [k, v] of node.entries()) {
        if (v instanceof PDFRef) {
          if (alias.has(v.tag)) node.set(k, alias.get(v.tag));
        } else rewrite(v);
      }
    } else if (node instanceof PDFArray) {
      for (let i = 0; i < node.size(); i++) {
        const v = node.get(i);
        if (v instanceof PDFRef) {
          if (alias.has(v.tag)) node.set(i, alias.get(v.tag));
        } else rewrite(v);
      }
    }
  };
  for (const [, obj] of ctx.enumerateIndirectObjects()) rewrite(obj);
  for (const tag of alias.keys()) {
    const [num, gen] = tag.split(" ").map(Number);
    ctx.delete(PDFRef.of(num, gen));
  }
}

const bytes = await doc.save({ useObjectStreams: true, addDefaultPage: false });
fs.writeFileSync(OUT, bytes);
console.log(`deduped ${alias.size} repeated images (${(reclaimed / 1e6).toFixed(2)} MB of copies)`);

const srcSize = fs.statSync(SRC).size;
console.log(`fidelity floor: ${FLOOR} dB`);
LADDER.forEach((l, i) => console.log(`  ${String(rungCount[i]).padStart(3)} images @ ${l.dpi === Infinity ? "native" : l.dpi + " dpi"} q${l.quality} ${l.chroma}`));
console.log(`  ${String(rungCount[LADDER.length]).padStart(3)} images left untouched`);
console.log(`image bytes: ${(before / 1e6).toFixed(2)} MB -> ${(after / 1e6).toFixed(2)} MB`);
console.log(`file:        ${(srcSize / 1e6).toFixed(2)} MB -> ${(bytes.length / 1e6).toFixed(2)} MB  (${((1 - bytes.length / srcSize) * 100).toFixed(1)}% smaller)`);
