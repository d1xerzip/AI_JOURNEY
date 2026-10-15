"use strict";

// Node model test of extension-page UI; this does not validate real browser or site permissions.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..", "extension");
const code = fs.readFileSync(path.join(root, "media-check.js"), "utf8");
const html = fs.readFileSync(path.join(root, "media-check.html"), "utf8");
const locales = Object.fromEntries(["en", "ru"].map(language => [language, JSON.parse(fs.readFileSync(path.join(root, "_locales", language, "messages.json"), "utf8"))]));
const keys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map(match => match[1]);
for (const language of ["en", "ru"]) {
  for (const key of keys) assert.ok(locales[language][key]?.message, `${language}: missing ${key}`);
}
function fixture(getUserMedia, language = "en") {
  const elements = Object.fromEntries(["result", "check-camera", "check-microphone", "check-both"].map(id => [id, { dataset: {}, disabled: false, textContent: "", handlers: {}, addEventListener(event, handler) { this.handlers[event] = handler; } }]));
  const localized = keys.map(key => ({ dataset: { i18n: key }, textContent: "" }));
  const document = { documentElement: {}, title: "", getElementById: id => elements[id], querySelectorAll: () => localized };
  let calls = [];
  const mediaDevices = getUserMedia ? { getUserMedia: constraints => { calls.push(constraints); return getUserMedia(constraints); } } : undefined;
  vm.runInNewContext(code, {
    document, navigator: { language, mediaDevices },
    chrome: { i18n: { getUILanguage: () => language, getMessage: key => locales[language][key]?.message || "" } },
    Error
  });
  return { document, elements, calls };
}
function stream(kinds, throwFirst = false) {
  const stopped = [];
  const tracks = kinds.map((kind, index) => ({ kind, stop() { stopped.push(index); if (throwFirst && index === 0) throw new Error("Stop failed"); } }));
  return { value: { getTracks: () => tracks }, stopped };
}
async function main() {
  for (const [button, kinds, constraints] of [
    ["check-camera", ["video"], { video: true, audio: false }],
    ["check-microphone", ["audio"], { video: false, audio: true }],
    ["check-both", ["video", "audio"], { video: true, audio: true }]
  ]) {
    const acquired = stream(kinds);
    const f = fixture(async () => acquired.value);
    assert.equal(f.calls.length, 0, "Page initialization must not request access");
    await f.elements[button].handlers.click();
    assert.equal(JSON.stringify(f.calls[0]), JSON.stringify(constraints));
    assert.deepEqual(acquired.stopped, kinds.map((_, index) => index), "Every obtained track must be stopped");
    assert.equal(f.elements.result.dataset.state, "success");
    assert.ok(f.elements.result.textContent.includes(kinds.join(", ")));
    assert.ok(f.elements.result.textContent.includes(locales.en.mediaStopped.message));
    assert.equal(f.elements[button].disabled, false);
  }
  const denied = fixture(async () => { throw { name: "NotAllowedError", message: "<b>Browser denied access</b>" }; }, "ru");
  await denied.elements["check-camera"].handlers.click();
  assert.equal(denied.elements.result.dataset.state, "error");
  assert.ok(denied.elements.result.textContent.includes("NotAllowedError: <b>Browser denied access</b>"), "Actual error is plain text");
  assert.ok(denied.elements.result.textContent.startsWith(locales.ru.mediaFailed.message));
  const unavailable = fixture();
  await unavailable.elements["check-microphone"].handlers.click();
  assert.ok(unavailable.elements.result.textContent.includes("NotSupportedError"));
  const acquired = stream(["video", "audio"], true);
  const cleanup = fixture(async () => acquired.value);
  await cleanup.elements["check-both"].handlers.click();
  assert.deepEqual(acquired.stopped, [0, 1], "Cleanup continues if one track throws");
  assert.equal(cleanup.elements.result.dataset.state, "error");
  assert.ok(cleanup.elements.result.textContent.includes(locales.en.mediaCleanupFailed.message));
  let resolveAccess;
  const held = stream(["video"]);
  const pending = fixture(() => new Promise(resolve => { resolveAccess = resolve; }));
  const first = pending.elements["check-camera"].handlers.click();
  assert.equal(pending.elements["check-microphone"].disabled, true);
  await pending.elements["check-microphone"].handlers.click();
  assert.equal(pending.calls.length, 1, "Only one permission request may run at a time");
  resolveAccess(held.value);
  await first;
  assert.deepEqual(held.stopped, [0]);
  console.log("PASS: explicit clicks, camera/mic/both constraints, all-track cleanup, raw error text, locale coverage, unavailable API, concurrent requests.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
