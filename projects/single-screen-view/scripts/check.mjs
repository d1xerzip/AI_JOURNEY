import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Static validation plus the existing VM/model regressions; no browser install.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const extension = path.join(root, 'extension');
const readJson = name => JSON.parse(fs.readFileSync(name, 'utf8'));
const manifest = readJson(path.join(extension, 'manifest.json'));
const pkg = readJson(path.join(root, 'package.json'));
assert.equal(manifest.manifest_version, 3);
assert.equal(manifest.version, pkg.version, 'Package and manifest versions must agree');
assert.match(manifest.version, /^\d+(\.\d+){0,3}$/);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(item => {
    const name = path.join(directory, item.name);
    return item.isDirectory() ? walk(name) : [name];
  });
}
function asset(name) {
  assert.equal(typeof name, 'string');
  const target = path.resolve(extension, name);
  assert.ok(target.startsWith(extension + path.sep), `Asset outside extension: ${name}`);
  assert.ok(fs.statSync(target).isFile(), `Missing asset: ${name}`);
  return target;
}
asset(manifest.background.service_worker);
asset(manifest.action.default_popup);
for (const group of [manifest.icons, manifest.action.default_icon]) {
  assert.ok(group, 'Manifest icons required');
  for (const [size, name] of Object.entries(group)) {
    const buffer = fs.readFileSync(asset(name));
    assert.equal(buffer.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${name}: PNG signature`);
    assert.equal(buffer.readUInt32BE(16), Number(size), `${name}: width`);
    assert.equal(buffer.readUInt32BE(20), Number(size), `${name}: height`);
  }
}
const locales = fs.readdirSync(path.join(extension, '_locales')).map(language => readJson(path.join(extension, '_locales', language, 'messages.json')));
assert.ok(fs.existsSync(path.join(extension, '_locales', manifest.default_locale, 'messages.json')));
const messageKeys = Object.values(manifest).filter(value => typeof value === 'string').flatMap(value => [...value.matchAll(/__MSG_(\w+)__/g)].map(match => match[1]));
for (const messages of locales) {
  for (const key of messageKeys) assert.ok(messages[key]?.message, `Missing localized manifest message: ${key}`);
}
const runtimeFiles = walk(extension);
for (const name of runtimeFiles.filter(name => name.endsWith('.html'))) {
  const html = fs.readFileSync(name, 'utf8');
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    if (/^(?:https?:|data:|#)/.test(match[1])) continue;
    asset(path.relative(extension, path.resolve(path.dirname(name), match[1])));
  }
}
const sourceFiles = [...runtimeFiles, ...walk(path.join(root, 'scripts')), ...walk(path.join(root, 'tests'))];
for (const name of sourceFiles.filter(name => /\.(?:js|cjs|mjs)$/.test(name))) {
  execFileSync(process.execPath, ['--check', name], { stdio: 'inherit' });
}
console.log(`Static validation passed: v${manifest.version}, manifest assets, locales, PNG dimensions, JavaScript syntax.`);
if (process.argv.includes('--test')) {
  const tests = walk(path.join(root, 'tests')).filter(name => name.endsWith('.cjs')).sort();
  execFileSync(process.execPath, ['--test', ...tests], { cwd: root, stdio: 'inherit' });
}
