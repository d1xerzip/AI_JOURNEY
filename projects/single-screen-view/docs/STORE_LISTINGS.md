# Store listing drafts — Single Screen View 0.2.1 public BETA

These descriptions cover the 0.2.1 public BETA. A user has reported that this version works in their setup. That is not a complete browser compatibility matrix or evidence of store approval. Use store badges and installation links only when the respective listing is live.

## English listing

**Name:** Single Screen View

**Short description:** Give web pages a stable, local single-screen view while your physical monitors keep working.

**Suggested category:** Productivity / Tools, or the closest available category.

**Detailed description:**

Single Screen View gives supported web pages a consistent, local representation of one display. Your physical monitors keep working as usual.

Turn the mode on or off from the toolbar popup, then reload the pages where you want the change to take effect. The mode is enabled by default. When enabled, it applies to new and reloaded HTTP and HTTPS pages throughout this browser, including supported embedded frames.

Features:

- A simple toolbar switch with clear status.
- A stable snapshot of the current screen's size and orientation for each newly loaded document.
- A one-display result for the supported screen details API and `screen.isExtended` set to false.
- Physical display configuration changes are not forwarded through the extension's local screen details objects. Supported native screen change notifications registered after the extension are also suppressed.
- The native orientation object is retained. When the local display object is passed to fullscreen in the same page context, the request is translated to the browser's current-display behavior; normal fullscreen activation, permissions and errors still apply.
- An optional camera and microphone check opens in a separate extension tab. Click a check to request normal browser permission; acquired tracks are stopped immediately. There is no preview, recording or upload.
- Settings saved locally on your device.
- No accounts, advertising, analytics, telemetry, or extension network requests.
- English and Russian interface.

This is an experimental JavaScript compatibility and privacy tool. It changes selected values exposed to web page scripts. It is detectable and cannot guarantee that a website will accept the result or be unable to infer your setup in other ways.

It does not change your operating system's display configuration. Native applications and the browser's screen sharing chooser still see the real display setup. Web page camera, microphone and screen capture functions retain their native behavior. The separate diagnostic tab checks its own extension permission context; success there does not grant another website access or prove that its embedded-frame policy permits access. Window geometry, CSS queries, resizing and other unmodified browser mechanisms remain available to websites.

Some websites may behave differently with this mode enabled, particularly sites that use multiple windows or display placement. Turn the mode off and reload affected pages to restore their normal API behavior. Browser internal pages and other extensions are outside its scope. Reloading is required after switching the mode because an already modified document keeps its current state until navigation.

Permissions are used to run the locally bundled script at the beginning of page loading and to remember the enabled setting. HTTP/HTTPS access is necessary because the mode is browser-wide and can apply to embedded frames on another origin. The extension does not read or transmit browsing history, passwords, page text or screen captures.

The public BETA targets desktop Chromium browsers. It supplies artificial API values that can cause a page's display-count check to see one screen. It does not grant permission to disregard a website's rules or requirements. Availability in an extension store and compatibility with every browser, operating system and website are not guaranteed.

## Русское описание

**Название:** Single Screen View

**Краткое описание:** Стабильная локальная конфигурация одного экрана для веб-страниц. Физические мониторы продолжают работать.

**Полное описание:**

Single Screen View предоставляет поддерживаемым веб-страницам стабильное локальное представление одного экрана. Физические мониторы при этом продолжают работать как обычно.

Включайте и выключайте режим через значок расширения, затем обновляйте нужные страницы. По умолчанию режим включён. Он применяется ко всем новым и обновлённым HTTP/HTTPS-страницам этого браузера, включая поддерживаемые вложенные фреймы.

Возможности:

- Переключатель режима и понятный статус в окне расширения.
- Фиксация размеров и ориентации текущего экрана на время жизни загруженного документа.
- Один экран в поддерживаемом API сведений об экранах и значение false для `screen.isExtended`.
- Изменения физической конфигурации не передаются через локальные объекты сведений об экранах. Также подавляются поддерживаемые нативные уведомления об изменениях, если обработчики страницы установлены после расширения.
- Сохраняется нативный объект ориентации экрана. Если локальный объект экрана передаётся в полноэкранный режим в том же контексте страницы, браузер использует текущий экран. Обычные требования активации, разрешения и ошибки полноэкранного режима сохраняются.
- Необязательная проверка камеры и микрофона открывается в отдельной вкладке расширения. Доступ запрашивается только по нажатию кнопки через обычное разрешение браузера, а полученные медиадорожки сразу останавливаются. Предпросмотра, записи и отправки нет.
- Сохранение настройки режима только на устройстве.
- Без регистрации, рекламы, аналитики, телеметрии и сетевых запросов со стороны расширения.
- Интерфейс на английском и русском языках.

Это экспериментальный инструмент совместимости и приватности на JavaScript. Он меняет отдельные значения, доступные скриптам веб-страницы. Его можно обнаружить. Он не гарантирует, что сайт примет такую конфигурацию или не сможет косвенно определить особенности вашей системы.

Расширение не меняет настройки экранов операционной системы. Нативные приложения и окно выбора источника демонстрации экрана в браузере видят реальную конфигурацию. Функции камеры, микрофона и захвата экрана на веб-страницах сохраняют нативное поведение. Отдельная диагностическая вкладка проверяет контекст разрешений самого расширения: успешный результат не выдаёт разрешение другому сайту и не подтверждает, что доступ разрешён политикой его вложенного фрейма. Геометрия окна, CSS-запросы, изменение размеров и другие неизменённые механизмы браузера остаются доступными сайтам.

Некоторые сайты могут работать иначе, особенно если используют размещение окон на нескольких мониторах. Выключите режим и обновите такие страницы, чтобы восстановить обычное поведение API. Служебные страницы браузера и другие расширения не поддерживаются. После переключения режима страницы нужно обновлять: уже изменённый документ сохраняет своё состояние до перехода или перезагрузки.

Разрешения нужны для запуска локального скрипта в начале загрузки страницы и сохранения настройки режима. Доступ к HTTP/HTTPS необходим для работы во всём браузере и в поддерживаемых вложенных фреймах другого происхождения. Расширение не читает и не передаёт историю посещений, пароли, текст страниц и снимки экрана.

Публичная BETA рассчитана на настольные Chromium-браузеры. Расширение предоставляет искусственные значения API, из-за которых проверка количества экранов на странице может увидеть один экран. Это не даёт разрешения игнорировать правила и требования сайта. Размещение в магазине и совместимость со всеми браузерами, системами и сайтами не гарантируются.

## Privacy dashboard: reusable answers

Use these answers only while they match the submitted package. Review every store's exact questions before certifying its declarations.

**Single purpose:**

Provide web page scripts with a stable local representation of one screen through selected supported Screen and Window Management APIs, controlled by one browser-wide switch. Fullscreen translation supports that local object. An optional, user-triggered camera/microphone check is disclosed as a local compatibility diagnostic in a separate extension tab.

**`scripting` justification:**

Register and unregister a bundled page-context content script at document_start so its screen API facade is available before a supported page uses those APIs. No code is downloaded or generated remotely.

**`storage` justification:**

Save the enabled/disabled preference in chrome.storage.local. Display configuration snapshots are constructed in document memory and are not saved to extension storage.

**HTTP/HTTPS host access justification:**

The disclosed feature applies to all new and reloaded HTTP/HTTPS pages while enabled. Host access allows the bundled facade to run at document_start in the page's MAIN world and in supported embedded frames, including frames on other origins. It is not used to collect page content, credentials or browsing activity.

**Remote code:**

No. All executable JavaScript is included in the extension package.

**Data practices summary:**

The extension reads the current document's screen dimensions, orientation, color depth and device pixel ratio locally to construct its facade. That snapshot remains in document memory. The enabled preference is stored locally. Only after an explicit diagnostic-button click, the separate extension tab requests camera and/or microphone access through getUserMedia, checks track kinds, and immediately stops all acquired tracks. It does not preview, record, save, or upload the media. Diagnostic status remains in that tab until it closes; device names and identifiers are not collected. The extension contains no telemetry or outgoing network requests, and does not transmit, sell or share user data. Websites continue their own normal network activity and may have their own data practices. Do not equate “no transmission” with “no local access” in a store certification.

**Reviewer testing notes:**

1. Install the submitted package in a supported desktop Chromium browser.
2. The mode starts enabled. Open or reload an ordinary HTTPS test page.
3. In that page's console, `screen.isExtended` should be false. If native `window.getScreenDetails` is available, calling the extension's replacement should return an object with one entry in `screens` and that same object in `currentScreen`, without native enumeration.
4. From a real click on the same test page, pass that document's local `currentScreen` into a fullscreen request. The browser should use its current display while retaining its native activation and permission requirements. Local display objects from another page or frame are outside this translation's guarantee.
5. In the popup, disable the mode, then reload the page. Native browser API behavior should return.
6. The native screen sharing chooser and operating system display settings should remain unchanged.
7. Open the camera/microphone check from the popup. No device request should occur until a check button is clicked. Allow or deny the browser request as desired; a successful check should stop acquired tracks immediately and report the track kinds locally. No recording or network upload occurs. This does not test another website's permission context.

No reviewer account or website credentials are needed. Testing one page does not establish universal website compatibility.

## Claims to avoid

- “Undetectable”, “invisible to all websites”, “prevents every display change notification”, or “guaranteed to work on every site”.
- “Hides monitors from Windows”, “changes the screen sharing picker”, or “protects against every fingerprinting method”.
- “Official Google/Opera/Microsoft/OpenAI extension” or any suggestion of endorsement.
- “Available in Chrome Web Store / Edge Add-ons / Opera Add-ons” before the relevant listing is live.
- Firefox, Safari, mobile or embedded Codex browser support without a separate supported build and verification.
- “Never accesses camera or microphone”; 0.2.1 includes an explicit local diagnostic that briefly acquires selected tracks with normal browser permission.
- Describing the product as only a diagnostic tool while omitting its artificial one-screen result, suppressed screen notifications, fullscreen translation, or browser-wide default-on scope.

## Reviewer transparency

The original request concerned a website reporting an extra display during an application/assessment flow. The package changes the API values used by some such checks. Do not conceal a marketed assessment-bypass purpose behind generic privacy language, imply that a site's requirements have been satisfied, or claim that store review authorizes violating a website's rules. The site's terms and requirements were not supplied for review. Explain the actual behavior and intended use accurately if a reviewer asks.
