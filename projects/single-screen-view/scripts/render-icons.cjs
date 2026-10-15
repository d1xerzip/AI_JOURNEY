'use strict';

// Maintainer utility only. Runtime/build/test have no npm dependencies.
// Install sharp in a separate tooling directory, then run:
// NODE_PATH=/path/to/tooling/node_modules node scripts/render-icons.cjs
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'extension/assets/single-screen-view.svg');
const output = path.join(root, 'extension/icons');

async function main() {
  fs.mkdirSync(output, { recursive: true });
  for (const size of [16, 32, 48, 128, 300]) {
    await sharp(source).resize(size, size).png({ compressionLevel: 9 }).toFile(path.join(output, `icon-${size}.png`));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
