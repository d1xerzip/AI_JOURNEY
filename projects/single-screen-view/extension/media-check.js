"use strict";

const message = (key) => chrome.i18n.getMessage(key) || key;
document.documentElement.lang = chrome.i18n.getUILanguage() || navigator.language || "en";
document.title = message("mediaPageTitle");
for (const element of document.querySelectorAll("[data-i18n]")) {
  element.textContent = message(element.dataset.i18n);
}

const result = document.getElementById("result");
const camera = document.getElementById("check-camera");
const microphone = document.getElementById("check-microphone");
const both = document.getElementById("check-both");
const buttons = [camera, microphone, both];
let running = false;

async function check(constraints) {
  if (running) return;
  running = true;
  for (const button of buttons) button.disabled = true;
  result.dataset.state = "pending";
  result.textContent = message("mediaRequesting");
  let stream;
  let kinds = [];
  let error;
  let cleanupFailed = false;
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw Object.assign(new Error(message("mediaUnavailable")), { name: "NotSupportedError" });
    }
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    kinds = stream.getTracks().map((track) => track.kind);
  } catch (caught) {
    error = caught;
  } finally {
    if (stream) {
      for (const track of stream.getTracks()) {
        try { track.stop(); } catch { cleanupFailed = true; }
      }
    }
    for (const button of buttons) button.disabled = false;
    running = false;
  }

  if (error) {
    result.dataset.state = "error";
    result.textContent = `${message("mediaFailed")}\n${String(error.name || "Error")}: ${String(error.message || error)}`;
  } else {
    result.dataset.state = cleanupFailed ? "error" : "success";
    result.textContent = `${message("mediaSucceeded")}\n${message("mediaTracks")}: ${kinds.join(", ") || message("mediaNoTracks")}\n${message(cleanupFailed ? "mediaCleanupFailed" : "mediaStopped")}`;
  }
}

camera.addEventListener("click", () => check({ video: true, audio: false }));
microphone.addEventListener("click", () => check({ video: false, audio: true }));
both.addEventListener("click", () => check({ video: true, audio: true }));
