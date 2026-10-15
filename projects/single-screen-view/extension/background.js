"use strict";

const SCRIPT_ID = "single-screen-view";
const registration = {
  id: SCRIPT_ID,
  matches: ["http://*/*", "https://*/*"],
  js: ["single-screen.js"],
  world: "MAIN",
  runAt: "document_start",
  allFrames: true,
  matchOriginAsFallback: true,
  persistAcrossSessions: true,
};

async function applyEnabled(enabled) {
  const scripts = await chrome.scripting.getRegisteredContentScripts({ ids: [SCRIPT_ID] });
  if (enabled && scripts.length === 0) {
    await chrome.scripting.registerContentScripts([registration]);
  } else if (!enabled && scripts.length > 0) {
    await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] });
  }
  await chrome.storage.local.set({ enabled });
  await chrome.action.setBadgeText({ text: enabled ? "1" : "OFF" });
  await chrome.action.setBadgeBackgroundColor({ color: enabled ? "#166c52" : "#6b7280" });
  await chrome.action.setTitle({ title: `Single Screen View — ${enabled ? "включено" : "выключено"}` });
  return { enabled };
}

let pending = (async () => {
  const settings = await chrome.storage.local.get({ enabled: true });
  return applyEnabled(settings.enabled === true);
})();

function enqueue(operation) {
  const result = pending.catch(() => undefined).then(operation);
  pending = result;
  return result;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) return false;
  if (message?.type !== "get-state" && message?.type !== "set-enabled") return false;

  enqueue(async () => {
    if (message.type === "set-enabled") {
      if (typeof message.enabled !== "boolean") throw new Error("Некорректный режим.");
      return applyEnabled(message.enabled);
    }
    const { enabled } = await chrome.storage.local.get({ enabled: true });
    const scripts = await chrome.scripting.getRegisteredContentScripts({ ids: [SCRIPT_ID] });
    if (enabled !== (scripts.length > 0)) return applyEnabled(enabled);
    return { enabled };
  }).then(
    (state) => sendResponse({ ok: true, ...state }),
    (error) => sendResponse({ ok: false, error: String(error.message || error) }),
  );
  return true;
});
