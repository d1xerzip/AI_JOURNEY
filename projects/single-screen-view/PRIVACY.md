# Privacy policy

Single Screen View — public beta 0.2.1. Effective 2026-10-15.

The extension collects and transmits no personal data. It has no analytics, tracking, advertisements, remote code, account system or runtime network requests.

The on/off preference is saved in `chrome.storage.local`. Screen values used to build the local display view are held in document memory and are not saved to extension storage or transmitted by the extension. Normal websites retain their own behavior and privacy policies.

The `scripting` permission registers the bundled script at document start. HTTP and HTTPS host permissions allow it to run globally, including frames, while enabled. The `storage` permission saves the on/off preference. The popup can reload the active tab at the user's request.

Normal operation does not request camera or microphone access or change their permissions. The optional local diagnostic requests only the device(s) selected by the user, through the browser's ordinary permission prompt. It immediately stops the returned media tracks and displays a local success or error result. It does not record, play, save or upload audio/video, or enumerate device identifiers. The diagnostic result is not stored persistently. Its extension-page permission context is separate from websites' permissions. Native screen capture selection is unchanged.

Disabling the extension prevents injection into newly loaded pages. Reload open pages to remove existing patches. Removing the extension removes its local preference through the browser's normal extension removal process.

Contact: [GitHub issue tracker](https://github.com/d1xerzip/AI_JOURNEY/issues). Use `[Single Screen View]` in the title. GitHub applies its own privacy policy to anything you voluntarily post there; avoid including private URLs, credentials or media.
