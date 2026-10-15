"use strict";

const toggle = document.getElementById("toggle");
const reload = document.getElementById("reload");
const status = document.getElementById("status");
const indicator = document.getElementById("indicator");
const notice = document.getElementById("notice");
const mediaCheck = document.getElementById("media-check");
let enabled = false;
let stateKnown = false;

const message = (key) => chrome.i18n.getMessage(key) || key;
document.documentElement.lang = chrome.i18n.getUILanguage() || navigator.language || "en";
for (const element of document.querySelectorAll("[data-i18n]")) {
  element.textContent = message(element.dataset.i18n);
}
document.getElementById("version").textContent = `v${chrome.runtime.getManifest().version}`;

function render(state) {
  if (typeof state.enabled !== "boolean") throw new Error(message("invalidState"));
  enabled = state.enabled;
  stateKnown = true;
  document.body.dataset.enabled = String(enabled);
  status.textContent = message(enabled ? "modeEnabled" : "modePaused");
  indicator.classList.toggle("on", enabled);
  toggle.classList.toggle("paused", !enabled);
  toggle.textContent = message(enabled ? "turnOff" : "turnOn");
  toggle.setAttribute("aria-pressed", String(enabled));
  toggle.disabled = false;
}

function showError(error) {
  notice.textContent = error instanceof Error ? error.message : String(error);
  notice.classList.add("error");
  toggle.disabled = !stateKnown;
  if (!stateKnown) {
    status.textContent = message("unavailable");
    toggle.textContent = message("reopenPopup");
  }
}

async function request(payload) {
  const result = await chrome.runtime.sendMessage(payload);
  if (!result?.ok) throw new Error(result?.error || message("noResponse"));
  return result;
}

toggle.addEventListener("click", async () => {
  if (!stateKnown) return;
  toggle.disabled = true;
  reload.disabled = true;
  notice.classList.remove("error");
  try {
    render(await request({ type: "set-enabled", enabled: !enabled }));
    notice.textContent = message("modeChanged");
  } catch (error) {
    showError(error);
  } finally {
    reload.disabled = false;
  }
});

reload.addEventListener("click", async () => {
  reload.disabled = true;
  toggle.disabled = true;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (typeof tab?.id !== "number") throw new Error(message("noActiveTab"));
    await chrome.tabs.reload(tab.id);
    window.close();
  } catch (error) {
    showError(error);
    reload.disabled = false;
  }
});

request({ type: "get-state" }).then(render).catch(showError);

mediaCheck.addEventListener("click", async () => {
  mediaCheck.disabled = true;
  try {
    await chrome.tabs.create({ url: chrome.runtime.getURL("media-check.html") });
    window.close();
  } catch (error) {
    showError(error);
    mediaCheck.disabled = false;
  }
});
