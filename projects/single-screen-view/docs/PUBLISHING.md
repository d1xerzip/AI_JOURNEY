# Publishing Single Screen View

Updated on 2026-10-15 for the 0.2.1 public BETA. The project is a desktop Chromium extension. Source code publication, a downloadable beta, submission for store review, and an approved store listing are separate milestones. This guide does not claim any store approval.

## Release scope and evidence

The working core is retained from 0.1.0: global HTTP/HTTPS injection while enabled, on by default. In 0.2.1 the native orientation object is retained, the local display object is translated for same-realm fullscreen requests, and optional local camera/microphone checks run in a separate extension tab only after explicit user action. Acquired tracks are stopped immediately; there is no preview, recording, stored media or upload. A user reported that 0.2.1 works in their setup. The report did not establish a full browser/version/OS matrix. Automated model checks covered the API facade and registration behavior; they are not an end-to-end browser certification. Full integration tests could not run in the authoring environment because browser process startup was blocked.

For a new browser target, verify install, toggle and reload, persisted preference, one-screen API result, same-realm fullscreen, and the explicit local media check on that browser. Record its version, OS and results. Reuse the user's 0.2.1 confirmation for their known setup and earlier checks that remain applicable; repeat a passed check only when a changed implementation or new failure justifies it.

## Compatibility claims

| Browser | This release's status | Distribution route |
| --- | --- | --- |
| Google Chrome desktop | Primary Chromium target; minimum version follows the manifest | Unpacked beta; Chrome Web Store after review |
| Microsoft Edge desktop | Chromium target; separate install check still required | Unpacked beta; Edge Add-ons after review |
| Opera / Opera GX desktop | Chromium target; browser-specific install and API check required | Unpacked beta; Opera Add-ons after its packaging and review process |
| Brave / Vivaldi desktop | Candidate Chromium targets, unverified | Unpacked beta where permitted; compatible store route if accepted by that browser |
| Firefox / Safari / mobile browsers | No supported package in this release | Separate port and verification required |
| Embedded Codex browser | Extension installation support is unconfirmed | No compatibility promise |

Chromium ancestry is a reason to try a build, not proof that every extension API or site behaves identically. The native operating system, native applications and the browser's capture chooser remain outside this extension's scope.

## Package and public project

The store upload ZIP must put `manifest.json` at the archive root, alongside the scripts, popup, locales and icons. Do not upload a source-code archive with the extension nested inside another folder. Keep tests, screenshots, publishing notes, private files and build tools out of the runtime ZIP. Never include account credentials or store signing keys.

Publish source, license, privacy policy, release notes, installation instructions and the known limitations together. The privacy policy should describe the local enabled preference, in-memory display snapshot and explicit local camera/microphone check, rather than claim that nothing is ever accessed. Publish a stable public URL for that policy and a working support/issues URL. A GitHub release can distribute the beta before store approval; label it as an unpacked developer build and explain installation.

## Publisher access and account setup

Submission requires access to the relevant publisher account. A connected GitHub account does not grant access to Google, Microsoft or Opera publisher dashboards. Use an authorized connector or signed-in browser session where available. The account owner completes any sign-in, MFA, payment or identity-verification step that cannot be delegated; do not invent account details, claim to have paid a fee, or claim an agreement was accepted when it was not.

| Store | Required account/setup | Cost and agreement | Access needed to submit |
| --- | --- | --- | --- |
| Chrome Web Store | Google account registered as a Chrome Web Store developer; two-step verification | One-time registration fee, current amount shown in the dashboard; developer agreement and policies accepted | Signed-in owner/publisher session or an authorized publisher API credential |
| Edge Add-ons | Verified Microsoft Edge program enrollment in Partner Center, with a Microsoft account as primary owner | No Edge program registration fee; Microsoft Store App Developer Agreement accepted | Signed-in Partner Center account with rights to manage this extension |
| Opera Add-ons | Signed-in Opera developer account | Publishing documentation reviewed here does not state a registration charge; follow any live form requirements and applicable terms | Signed-in Opera account able to upload/manage the extension |

Sources: [Chrome registration](https://developer.chrome.com/docs/webstore/register), [Chrome two-step verification](https://developer.chrome.com/docs/webstore/program-policies/two-step-verification), [Edge registration and agreement](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/create-dev-account), [Opera publishing](https://help.opera.com/en/extensions/publishing-guidelines/).

## Chrome Web Store

Use the [developer dashboard](https://chrome.google.com/webstore/devconsole/). A developer account and one-time registration fee are required; the dashboard supplies the current amount. Enable two-step verification before publishing or updating. Upload the runtime ZIP, then complete listing, privacy, distribution and reviewer instructions. Submission triggers review; deferred publishing can keep an approved item unpublished until you choose to release it. ([Registration](https://developer.chrome.com/docs/webstore/register), [two-step verification](https://developer.chrome.com/docs/webstore/program-policies/two-step-verification), [publishing](https://developer.chrome.com/docs/webstore/publish))

Required imagery is a 128×128 PNG icon in the extension, a 440×280 promotional image, and at least one actual-UX screenshot at 1280×800 or 640×400. Up to five screenshots and an optional 1400×560 marquee are supported. Promotional art can be designed; a store screenshot must show the real user experience. Do not pass a UI mockup off as a verified browser screenshot. ([Image requirements](https://developer.chrome.com/docs/webstore/images))

Explain the narrow purpose and each permission using [STORE_LISTINGS.md](STORE_LISTINGS.md). The global host scope must be explicitly disclosed and justified. The store requires the narrowest permissions necessary, accurate metadata and transparent data handling; an accurate public privacy policy is required when handling user data. The local screen API facade and limits must be disclosed accurately. No rule reviewed here guarantees acceptance of this particular extension. ([Program policies](https://developer.chrome.com/docs/webstore/program-policies/policies))

## Microsoft Edge Add-ons

Register through [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/overview); there is no Edge program registration fee. Complete the publisher contact details, accept the Microsoft Store App Developer Agreement and finish enrollment verification. Upload the runtime ZIP, complete availability, properties, purpose, permission justifications, remote-code declaration, data usage and listing fields, then submit for certification. Use a reachable privacy policy URL and support contact. The listed description must fully describe the submitted behavior.

The extension logo must be square, at least 128×128; 300×300 is recommended. Optional assets are a 440×280 small tile, 1400×560 large tile, and up to six screenshots at 640×480 or 1280×800. Manifest V3 must not load remotely hosted executable code. These submission fields do not establish that this build is already compatible or approved. ([Publishing guide](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension), [developer program](https://developer.microsoft.com/en-us/microsoft-edge/extensions))

## Opera Add-ons

Sign in at the [Opera developer upload page](https://addons.opera.com/developer/upload/). Opera's official basics describe generating a CRX using **Pack Extension** at `opera:extensions`; follow the live upload form's accepted package format rather than assuming a Chrome ZIP has been accepted. If packing generates a private key, keep it private and out of GitHub.

Provide the name, version, license, summary, full description and relevant support page. Opera recommends screenshots at 612×408, with a maximum of 800×600. Review is performed by Opera moderators. The criteria require one clear purpose, accurate disclosure of background actions, useful behavior, readable bundled code, no external JavaScript, no redundant permissions and appropriate handling of private information. Include the project's own distribution license explicitly. ([Basics](https://help.opera.com/en/extensions/basics/), [publishing guidelines](https://help.opera.com/en/extensions/publishing-guidelines/), [acceptance criteria](https://help.opera.com/en/extensions/acceptance-criteria/))

## Final submission record

For each store, record the submitted version, ZIP checksum, submission time, selected visibility, review status and eventual listing URL. Do not show an approval badge or post a store link until the listing actually exists. If the store asks for changes, preserve the working beta and make the smallest necessary update before resubmission.

If a developer account, payment, owner identity verification, real browser screenshot or supported browser installation is unavailable, the concrete next deliverable remains the source repository and release package. State the specific missing requirement instead of marking the store publication complete.

## Policy review for this exact functionality

No official source reviewed expressly approves this one-screen facade. The following are policy considerations, not a store decision:

- **Exact behavior and purpose:** the package provides artificial one-screen values and suppresses selected display-change notifications while physical displays remain active. It can affect a site's extra-screen check. Do not describe it as merely a diagnostics app or conceal an intended assessment-bypass use from reviewers. Chrome's developer agreement §4.4.1 prohibits knowingly violating a third party's terms of service; the target site's terms were not supplied. [Chrome agreement](https://developer.chrome.com/docs/webstore/program-policies/terms).
- **Accurate claims, scope and reversibility:** disclose the global default-on scope, reload requirement, detectability, unchanged native capture chooser, native orientation retention and limited same-realm fullscreen translation. No guaranteed invisibility or universal compatibility claim is supportable. Chrome requires accurate metadata, minimum necessary permissions and transparent data handling. [Chrome policies](https://developer.chrome.com/docs/webstore/program-policies/policies).
- **Single purpose:** local camera/microphone checks must be prominently disclosed as ancillary compatibility diagnostics. Because they are separable from screen API normalization, a reviewer may regard them as a second purpose. That is a specific review risk; it is not an existing rejection. Chrome, Edge and Opera all require a narrow, clearly stated purpose. [Chrome policies](https://developer.chrome.com/docs/webstore/program-policies/policies), [Edge policies](https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies), [Opera criteria](https://help.opera.com/en/extensions/acceptance-criteria/).
- **Media and privacy:** the diagnostic briefly accesses real camera/microphone tracks after a click and browser permission, checks track kinds, then stops tracks. There is no preview, recording, saved media or upload. Describe that local access in the policy and data-use answers; absence of transmission is not a substitute for disclosure. A check succeeds only in the extension tab's context, not on behalf of another site. [Chrome user-data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq).
- **Bundled code and broad hosts:** executable logic is locally bundled and readable; the declared `scripting`, `storage` and global HTTP/HTTPS access serve the disclosed behavior. Explain why browser-wide early injection requires those hosts. A reviewer can still request a narrower scope or changes. [Edge policies](https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies), [Opera criteria](https://help.opera.com/en/extensions/acceptance-criteria/).

Store review and any requested changes determine the outcome. The 0.2.1 beta can be distributed with its actual status and limits while a submission is pending; pending review must never be presented as approval.
