Single Screen View 0.2.1 public beta

This desktop Chromium extension presents a fixed, one-display view through supported web screen APIs and suppresses the corresponding physical configuration notifications. It includes a local on/off control, English/Russian UI and optional camera/microphone diagnostic buttons.

Download the `chromium.zip` package, extract it and load the directory containing manifest.json through the browser's developer-mode extension manager. Keep that directory. Disable any older duplicate copy and reload affected pages after installing or toggling. The source ZIP includes the project, documentation and tests.

Native apps and the browser's capture chooser retain the real display configuration. Other browser signals can reveal additional screens. Synthetic screen objects differ from native objects and may affect site compatibility. The optional media check runs in its own extension-page permission context, requests devices only on a button click and immediately stops acquired tracks; it does not record or upload.

One user reported the update working in their setup. Fifteen automated model checks passed. An independent browser/device matrix has not been run; model tests do not establish physical camera/microphone or all-site compatibility.

This is an unpacked beta, not an approved store listing. See README.md and PRIVACY.md for installation, privacy and limitations. MIT license.
