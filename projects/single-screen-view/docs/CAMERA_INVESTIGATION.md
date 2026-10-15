# Camera and microphone compatibility notes

Date: 2026-10-15. Status: user reported 0.2.1 working; root cause not independently confirmed.

## Report

After the original extension removed a multiple-screen warning, the user saw: “Camera access is blocked. Allow it from the lock icon in the address bar.” The error remained after the user allowed access. Disabling the extension makes the website stop at the multiple-screen check before camera setup; that comparison therefore does not isolate the camera failure.

The website URL, browser version, original `getUserMedia` rejection and OS camera settings have not been supplied. No claim is made that the extension caused or fixed this error.

## Completed checks

- Independent code review found no mutation of `navigator.mediaDevices`, `getUserMedia`, `enumerateDevices`, camera permission settings, HTTP Permissions-Policy or iframe camera delegation.
- Seven targeted model regression checks passed. Actual injection preserved camera-related objects, prototypes, descriptors and function identities; injection made no device or permission requests. Original promises, constraints, streams and error identities were preserved, including NotAllowedError, NotReadableError, NotFoundError and OverconstrainedError.
- The new popup only performs runtime messaging and active tab reload; it does not access camera APIs.

## Trial update 0.2.1

The native ScreenOrientation object and lock/unlock methods are now retained, with only supported orientation values fixed. Fullscreen requests translate this document's own synthetic display into an omitted destination, so the browser chooses its current display. Other dictionary properties are read lazily from the original options, including inherited getters; native activation and permission requirements and rejections remain intact. No retry or simulated success is added. This translation does not cover synthetic display objects from other frames.

An optional local camera/microphone diagnostic uses standard getUserMedia only after an explicit device button click. It stops tracks immediately and reports the actual error name/message without recording or uploading. Its extension-page permission context is different from the target website, so its result alone cannot prove target-site compatibility.

These are fixes for identified compatibility risks, not a confirmed root-cause explanation for the reported warning. The user subsequently reported the update working and authorized a public beta. That report does not establish every browser/site combination.

## Remaining hypothesis

Synthetic screen objects do not satisfy native interface branding. A site that uses a shared error handler for screen/fullscreen and media startup could display a misleading camera or microphone warning. That behavior has not been observed in this website's code and remains a hypothesis.

## Minimum next evidence

Obtain the affected page URL and browser name/version, then inspect the original error or the site's initialization logic. An alternative local comparison is to temporarily use one real active display, disable the extension, open the page fresh and test camera setup, then compare with the extension enabled under the same display configuration. Restore the display setup afterwards. Do not change camera permissions or site logic merely to silence the warning.

Independent real camera and actual target-site verification remain open. The beta may state that one user reported success; it must not claim universal camera compatibility.
