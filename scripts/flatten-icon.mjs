// Flatten the transparent icon source onto a solid white tile and write it out.
// iOS apple-touch-icon can't be transparent (it would fill black), so we composite
// over white here. Run: node scripts/flatten-icon.mjs  (then sips resizes to 180).
import { deflateSync, inflateSync } from "node:zlib";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const srcPath = resolve(here, "icon-source.png");
const outPath = resolve(here, "../public/apple-touch-icon-flat.png");

// --- decode PNG (assumes 8-bit, color type 6 RGBA, no interlace) ---
const file = readFileSync(srcPath);
let pos = 8; // skip signature
let width = 0, height = 0, colorType = 0;
const idat = [];
while (pos < file.length) {
  const len = file.readUInt32BE(pos);
  const type = file.toString("ascii", pos + 4, pos + 8);
  const data = file.subarray(pos + 8, pos + 8 + len);
  if (type === "IHDR") {
    width = data.readUInt32BE(0);
    height = data.readUInt32BE(4);
    colorType = data[9];
  } else if (type === "IDAT") {
    idat.push(data);
  } else if (type === "IEND") {
    break;
  }
  pos += 12 + len;
}
if (colorType !== 6) throw new Error(`expected RGBA (color type 6), got ${colorType}`);

const bpp = 4;
const stride = width * bpp;
const raw = inflateSync(Buffer.concat(idat));
const px = Buffer.alloc(height * stride);

const paeth = (a, b, c) => {
  const p = a + b - c;
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};

// Reverse the per-scanline PNG filters.
for (let y = 0; y < height; y++) {
  const filter = raw[y * (stride + 1)];
  const inRow = y * (stride + 1) + 1;
  const outRow = y * stride;
  for (let x = 0; x < stride; x++) {
    const rawByte = raw[inRow + x];
    const a = x >= bpp ? px[outRow + x - bpp] : 0;
    const b = y > 0 ? px[outRow - stride + x] : 0;
    const c = y > 0 && x >= bpp ? px[outRow - stride + x - bpp] : 0;
    let val;
    switch (filter) {
      case 0: val = rawByte; break;
      case 1: val = rawByte + a; break;
      case 2: val = rawByte + b; break;
      case 3: val = rawByte + ((a + b) >> 1); break;
      case 4: val = rawByte + paeth(a, b, c); break;
      default: throw new Error(`bad filter ${filter}`);
    }
    px[outRow + x] = val & 0xff;
  }
}

// --- composite over white, drop alpha ---
const out = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i++) {
  const a = px[i * 4 + 3] / 255;
  for (let k = 0; k < 3; k++) {
    out[i * 4 + k] = Math.round(px[i * 4 + k] * a + 255 * (1 - a));
  }
  out[i * 4 + 3] = 255;
}

// --- encode PNG ---
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (bytes) => {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = crcTable[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
};

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8; ihdr[9] = 6;
const rawOut = Buffer.alloc(height * (stride + 1));
for (let y = 0; y < height; y++) {
  rawOut[y * (stride + 1)] = 0;
  out.copy(rawOut, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
}
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(rawOut, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);
writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${width}x${height}, flattened on white)`);
