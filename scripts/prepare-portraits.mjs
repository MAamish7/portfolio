/**
 * One-off asset pipeline.
 *
 * Takes the two studio "character sheet" contact sheets, splits them into their
 * individual panels, and produces the web assets the site consumes:
 *   - a square headshot (used in the About portrait frame)
 *   - alpha-cut full-body figures (used as the hero + about cutouts)
 *
 * Background removal is a border-seeded flood fill: the studio backdrop is a
 * smooth grey gradient, so each candidate pixel is compared against the local
 * background value that reached it as well as the border colour it came from.
 *
 * Run with:  node scripts/prepare-portraits.mjs <sheetA.jpg> <sheetB.jpg>
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'public', 'images');

/**
 * Border-seeded flood fill that writes an alpha channel.
 *
 * Two thresholds keep it honest on a vignetted backdrop:
 *   `step`  — how far a pixel may differ from the neighbour that reached it,
 *             so the fill can crawl along the smooth gradient, and
 *   `drift` — how far it may end up from the border colour it started at,
 *             so it can never ramp its way onto the subject.
 */
function cutBackground(rgb, width, height, { step = 5, drift = 45, erode = 2, feather = 2 } = {}) {
  const alpha = new Uint8Array(width * height).fill(255);
  const visited = new Uint8Array(width * height);
  const stack = [];
  const seedRef = new Int16Array(width * height * 3); // colour of the neighbour that reached us
  const originRef = new Int16Array(width * height * 3); // colour of the border pixel we came from

  const push = (x, y, r, g, b, or_, og, ob) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = y * width + x;
    if (visited[i]) return;
    visited[i] = 1;
    seedRef[i * 3] = r;
    seedRef[i * 3 + 1] = g;
    seedRef[i * 3 + 2] = b;
    originRef[i * 3] = or_;
    originRef[i * 3 + 1] = og;
    originRef[i * 3 + 2] = ob;
    stack.push(i);
  };

  // Seed from every border pixel using its own colour as both references.
  const seedAt = (x, y) => {
    const i = (y * width + x) * 3;
    push(x, y, rgb[i], rgb[i + 1], rgb[i + 2], rgb[i], rgb[i + 1], rgb[i + 2]);
  };
  for (let x = 0; x < width; x++) {
    seedAt(x, 0);
    seedAt(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    seedAt(0, y);
    seedAt(width - 1, y);
  }

  while (stack.length) {
    const i = stack.pop();
    const r = rgb[i * 3];
    const g = rgb[i * 3 + 1];
    const b = rgb[i * 3 + 2];
    const stepDist = Math.max(
      Math.abs(r - seedRef[i * 3]),
      Math.abs(g - seedRef[i * 3 + 1]),
      Math.abs(b - seedRef[i * 3 + 2]),
    );
    if (stepDist > step) continue;
    const or_ = originRef[i * 3];
    const og = originRef[i * 3 + 1];
    const ob = originRef[i * 3 + 2];
    const driftDist = Math.max(Math.abs(r - or_), Math.abs(g - og), Math.abs(b - ob));
    if (driftDist > drift) continue;

    alpha[i] = 0;
    const x = i % width;
    const y = (i / width) | 0;
    // Propagate the *current* colour as the local reference, but keep the
    // original border colour so total drift stays bounded.
    push(x + 1, y, r, g, b, or_, og, ob);
    push(x - 1, y, r, g, b, or_, og, ob);
    push(x, y + 1, r, g, b, or_, og, ob);
    push(x, y - 1, r, g, b, or_, og, ob);
  }

  // Erode the mask so the backdrop's halo pixels along the silhouette go away.
  if (erode > 0) {
    for (let pass = 0; pass < erode; pass++) {
      const src = Uint8Array.from(alpha);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = y * width + x;
          if (!src[i]) continue;
          if (
            (x > 0 && !src[i - 1]) ||
            (x < width - 1 && !src[i + 1]) ||
            (y > 0 && !src[i - width]) ||
            (y < height - 1 && !src[i + width])
          ) {
            alpha[i] = 0;
          }
        }
      }
    }
  }

  // Cheap box blur on alpha to feather the cut edge.
  if (feather > 0) {
    const src = Uint8Array.from(alpha);
    const k = feather;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;
        let n = 0;
        for (let dy = -k; dy <= k; dy++) {
          const yy = y + dy;
          if (yy < 0 || yy >= height) continue;
          for (let dx = -k; dx <= k; dx++) {
            const xx = x + dx;
            if (xx < 0 || xx >= width) continue;
            sum += src[yy * width + xx];
            n++;
          }
        }
        alpha[y * width + x] = Math.round(sum / n);
      }
    }
  }

  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    out[i * 4] = rgb[i * 3];
    out[i * 4 + 1] = rgb[i * 3 + 1];
    out[i * 4 + 2] = rgb[i * 3 + 2];
    out[i * 4 + 3] = alpha[i];
  }
  return out;
}

/** Group opaque columns into subject blobs (headshot, front figure, back figure). */
function findBlobs(rgba, width, height, { minCoverage = 0.04, mergeGap = 60 } = {}) {
  const colHits = new Int32Array(width);
  for (let x = 0; x < width; x++) {
    let hits = 0;
    for (let y = 0; y < height; y++) if (rgba[(y * width + x) * 4 + 3] > 140) hits++;
    colHits[x] = hits;
  }
  const min = height * minCoverage;
  const blobs = [];
  let run = null;
  for (let x = 0; x < width; x++) {
    if (colHits[x] >= min) {
      run = run ?? { left: x, right: x };
      run.right = x;
    } else if (run) {
      blobs.push(run);
      run = null;
    }
  }
  if (run) blobs.push(run);

  // Merge blobs that are only separated by a thin transparent sliver.
  const merged = [];
  for (const b of blobs) {
    const last = merged[merged.length - 1];
    if (last && b.left - last.right <= mergeGap) last.right = b.right;
    else merged.push({ ...b });
  }
  return merged
    .filter((b) => b.right - b.left > width * 0.05)
    .map((b) => {
      let top = height;
      let bottom = 0;
      for (let y = 0; y < height; y++) {
        for (let x = b.left; x <= b.right; x++) {
          if (rgba[(y * width + x) * 4 + 3] > 140) {
            if (y < top) top = y;
            if (y > bottom) bottom = y;
            break;
          }
        }
      }
      return { ...b, top, bottom };
    });
}

/** Slice a sub-rectangle out of an RGBA buffer. */
function crop(rgba, width, box) {
  const w = box.right - box.left + 1;
  const h = box.bottom - box.top + 1;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const src = ((box.top + y) * width + box.left) * 4;
    rgba.copy(out, y * w * 4, src, src + w * 4);
  }
  return { buffer: out, width: w, height: h };
}

async function main() {
  const sheets = process.argv.slice(2);
  await mkdir(OUT, { recursive: true });

  for (const [idx, file] of sheets.entries()) {
    const tag = String.fromCharCode(97 + idx); // a, b, …

    // Trim the printed frame and normalise the size once, so every crop below
    // shares one coordinate space.
    const normalised = await sharp(file)
      .trim({ threshold: 12 })
      .resize({ width: 1500, withoutEnlargement: true })
      .png()
      .toBuffer();
    const { data, info } = await sharp(normalised)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width, height } = info;

    const rgba = cutBackground(data, width, height, { step: 5, drift: 45, erode: 2, feather: 2 });
    const blobs = findBlobs(rgba, width, height);
    console.log(tag, `${width}x${height}`, 'blobs', JSON.stringify(blobs));

    // Blob 0 is the close-up portrait — keep it as a photo (backdrop and all).
    if (blobs[0]) {
      const b = blobs[0];
      // Never let the square reach into the neighbouring panel: stop halfway
      // through the gap between this subject and the next one.
      const panelRight = blobs[1]
        ? Math.min(Math.round((b.right + blobs[1].left) / 2), b.right + 14)
        : width;
      const cx = Math.round((b.left + b.right) / 2);
      const size = Math.min(height, b.right - b.left + 160, panelRight);
      const left = Math.max(0, Math.min(panelRight - size, cx - Math.round(size / 2)));
      // Crop from a materialised buffer: a single sharp pipeline only honours
      // one resize, so chaining a second one here would drop the extract.
      await sharp(normalised)
        .extract({ left, top: 0, width: size, height: size })
        .resize(1000, 1000, { fit: 'cover', position: 'top' })
        .jpeg({ quality: 88, mozjpeg: true })
        .toFile(path.join(OUT, `headshot-${tag}.jpg`));
      console.log('wrote', `headshot-${tag}.jpg`);
    }

    // Blob 1 is the front-facing full body — the alpha cutout used in the hero.
    if (blobs[1]) {
      const b = blobs[1];
      const pad = 8;
      const box = {
        left: Math.max(0, b.left - pad),
        right: Math.min(width - 1, b.right + pad),
        top: Math.max(0, b.top - pad),
        bottom: Math.min(height - 1, b.bottom + pad),
      };
      const c = crop(rgba, width, box);
      await sharp(c.buffer, { raw: { width: c.width, height: c.height, channels: 4 } })
        .resize({ width: 900, withoutEnlargement: true })
        .png({ compressionLevel: 9 })
        .toFile(path.join(OUT, `figure-${tag}.png`));
      console.log('wrote', `figure-${tag}.png`, `${c.width}x${c.height}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
