(() => {
  "use strict";

  // Runs in the page's MAIN world before its scripts on a fresh navigation.
  // This is a compatibility facade, not an OS-level display driver.
  const source = window.screen;
  if (!source || typeof EventTarget !== "function") return;
  const nativeOrientation = source.orientation;

  const number = (value, fallback) => Number.isFinite(value) ? value : fallback;
  const width = number(source.width, 1920);
  const height = number(source.height, 1080);
  const snapshot = Object.freeze({
    width,
    height,
    availWidth: Math.min(width, number(source.availWidth, width)),
    availHeight: Math.min(height, number(source.availHeight, height)),
    colorDepth: number(source.colorDepth, 24),
    pixelDepth: number(source.pixelDepth, 24),
    left: 0,
    top: 0,
    availLeft: 0,
    availTop: 0,
    isExtended: false,
    isPrimary: true,
    isInternal: false,
    label: "Display 1",
    devicePixelRatio: number(window.devicePixelRatio, 1),
  });

  function descriptorOwner(target, property) {
    for (let current = target; current; current = Object.getPrototypeOf(current)) {
      if (Object.hasOwn(current, property)) return current;
    }
    return null;
  }

  function replaceGetter(target, property, value) {
    const owner = descriptorOwner(target, property);
    if (!owner) return;
    const descriptor = Object.getOwnPropertyDescriptor(owner, property);
    if (!descriptor.configurable) return;
    Object.defineProperty(owner, property, {
      configurable: true,
      enumerable: descriptor.enumerable,
      get: () => value,
    });
  }

  function readOnly(target, values) {
    for (const [property, value] of Object.entries(values)) {
      Object.defineProperty(target, property, {
        value,
        enumerable: true,
        configurable: false,
        writable: false,
      });
    }
  }

  function eventProperty(target, type) {
    let handler = null;
    Object.defineProperty(target, `on${type}`, {
      enumerable: true,
      configurable: true,
      get: () => handler,
      set: (next) => {
        if (handler) target.removeEventListener(type, handler);
        handler = typeof next === "function" ? next : null;
        if (handler) target.addEventListener(type, handler);
      },
    });
  }

  function blockPhysicalChange(event) {
    if (event.isTrusted) event.stopImmediatePropagation();
  }

  const fixedOrientation = {
    type: nativeOrientation?.type || (width >= height ? "landscape-primary" : "portrait-primary"),
    angle: number(nativeOrientation?.angle, 0),
  };
  const orientation = nativeOrientation || new EventTarget();
  if (nativeOrientation) {
    // Keep the native object and its methods' native receiver/permission behavior.
    // Replacing it with an EventTarget can break code expecting ScreenOrientation.
    nativeOrientation.addEventListener("change", blockPhysicalChange, { capture: true });
    for (const [property, value] of Object.entries(fixedOrientation)) {
      replaceGetter(nativeOrientation, property, value);
    }
  } else {
    readOnly(orientation, fixedOrientation);
    eventProperty(orientation, "change");
  }

  // Do not forward physical Screen change notifications to page listeners.
  source.addEventListener("change", blockPhysicalChange, { capture: true });

  for (const [property, value] of Object.entries(snapshot)) {
    replaceGetter(source, property, value);
  }

  const display = new EventTarget();
  readOnly(display, snapshot);
  readOnly(display, { orientation });
  eventProperty(display, "change");

  // ScreenDetailed is a native interface: the local display cannot be passed
  // back as a native fullscreen destination. Let the browser use the current
  // display only for this exact local object. All other options, errors and
  // activation/permission requirements retain native behavior.
  const fullscreenOwner = window.Element && descriptorOwner(window.Element.prototype, "requestFullscreen");
  if (fullscreenOwner) {
    const descriptor = Object.getOwnPropertyDescriptor(fullscreenOwner, "requestFullscreen");
    if (descriptor.configurable && typeof descriptor.value === "function") {
      const nativeRequestFullscreen = descriptor.value;
      Object.defineProperty(fullscreenOwner, "requestFullscreen", {
        ...descriptor,
        value: function requestFullscreen(...args) {
          const options = args[0];
          if (options !== null && (typeof options === "object" || typeof options === "function")) {
            // A fresh proxy target also supports frozen dictionaries. Resolve
            // inherited getters lazily, in the browser's normal conversion order.
            args[0] = new Proxy(Object.create(null), {
              get(_target, property) {
                const value = Reflect.get(options, property, options);
                return property === "screen" && value === display ? undefined : value;
              },
            });
          }
          return Reflect.apply(nativeRequestFullscreen, this, args);
        },
      });
    }
  }

  const details = new EventTarget();
  readOnly(details, {
    screens: Object.freeze([display]),
    currentScreen: display,
  });
  eventProperty(details, "screenschange");
  eventProperty(details, "currentscreenchange");

  // Local objects are deliberately not wired to native ScreenDetails events.
  // Camera/microphone/capture functions and browser permissions are untouched.
  const owner = descriptorOwner(window, "getScreenDetails");
  if (owner) {
    const descriptor = Object.getOwnPropertyDescriptor(owner, "getScreenDetails");
    if (descriptor.configurable && typeof window.getScreenDetails === "function") {
      Object.defineProperty(owner, "getScreenDetails", {
        configurable: true,
        enumerable: descriptor.enumerable,
        writable: true,
        value: async function getScreenDetails() {
          return details;
        },
      });
    }
  }
})();
