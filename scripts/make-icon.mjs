// Generate the master app icon (public/icon-master.png) for the Sports Game.
// Original artwork: a stylized white ball on a navy gradient, ringed by four
// arcs in the league accent colors (no trademarked logos). Run:
//   node scripts/make-icon.mjs   (then sips resizes it into the icon pack)
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SIZE = 1024;
const SS = 3; // supersampling factor for smooth edges
const out = resolve(dirname(fileURLToPath(import.meta.url)), "../public/icon-master.png");

const NAVY_TOP = [23, 52, 99];
const NAVY_BOT = [9, 24, 50];
const SEAM = [9, 24, 50];
const WHITE = [255, 255, 255];
const RING = [
  [249, 115, 22], // orange
  [5, 150, 105], // emerald
  [37, 99, 235], // blue
  [14, 165, 233], // sky
];

const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];

function sampleColor(u, v) {
  const dx = u - 0.5;
  const dy = v - 0.5;
  const dist = Math.hypot(dx, dy);

  let col = mix(NAVY_TOP, NAVY_BOT, v); // gradient background

  const ringR = 0.375;
  const ringHalf = 0.03;
  if (Math.abs(dist - ringR) < ringHalf) {
    let ang = Math.atan2(dy, dx);
    if (ang < 0) ang += Math.PI * 2;
    const q = Math.floor(ang / (Math.PI / 2)) % 4;
    col = RING[q];
  }

  const ballR = 0.3;
  if (dist < ballR) {
    col = WHITE;
    const seamHalf = 0.013;
    if (Math.abs(dx) < seamHalf || Math.abs(dy) < seamHalf) col = SEAM;
  }
  return col;
}

// Render with supersampling into an RGBA buffer.
const buf = Buffer.alloc(SIZE * SIZE * 4);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    let r = 0, g = 0, b = 0;
    for (let sy = 0; sy < SS; sy++) {
      for (let sx = 0; sx < SS; sx++) {
        const u = (x + (sx + 0.5) / SS) / SIZE;
        const v = (y + (sy + 0.5) / SS) / SIZE;
        const c = sampleColor(u, v);
        r += c[0]; g += c[1]; b += c[2];
      }
    }
    const n = SS * SS;
    const i = (y * SIZE + x) * 4;
    buf[i] = Math.round(r / n);
    buf[i + 1] = Math.round(g / n);
    buf[i + 2] = Math.round(b / n);
    buf[i + 3] = 255;
  }
}

// Minimal PNG encoder (truecolor + alpha).
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = crcTable[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBytes, data]);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // color type RGBA
// 10,11,12 = 0 (compression, filter, interlace)

const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1));
for (let y = 0; y < SIZE; y++) {
  raw[y * (SIZE * 4 + 1)] = 0; // filter type none
  buf.copy(raw, y * (SIZE * 4 + 1) + 1, y * SIZE * 4, (y + 1) * SIZE * 4);
}

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

writeFileSync(out, png);
console.log(`Wrote ${out} (${SIZE}x${SIZE})`);
