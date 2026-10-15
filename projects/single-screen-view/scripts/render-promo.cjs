'use strict';

// Optional maintainer utility; same external tooling setup as render-icons.cjs.
// These are promotional artwork, not screenshots of a real browser session.
const path = require('node:path');
const sharp = require('sharp');
const assets = path.resolve(__dirname, '../docs/assets');

async function main() {
  for (const name of ['promo-440x280', 'social-1200x627']) {
    await sharp(path.join(assets, `${name}.svg`)).png({ compressionLevel: 9 }).toFile(path.join(assets, `${name}.png`));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
