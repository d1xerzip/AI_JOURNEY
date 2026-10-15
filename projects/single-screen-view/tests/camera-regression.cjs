'use strict';

// MODEL tests only. This executes the shipped injection in an independent VM
// fixture; it does not establish compatibility with a browser, webcam, or site.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const injection = fs.readFileSync(path.join(__dirname, '../extension/single-screen.js'), 'utf8');

function fixture() {
  const calls = { camera: [], enumeration: [], permission: [] };
  const stream = Object.freeze({ id: 'fixture-camera-stream', active: true });
  const devices = Object.freeze([{ kind: 'videoinput', deviceId: 'fixture-camera' }]);
  const status = { state: 'prompt', onchange: null };
  let cameraError = null;
  let lastCameraPromise;

  class MediaDevices extends EventTarget {
    getUserMedia(constraints) {
      assert.equal(this, mediaDevices, 'Native method receives its original receiver');
      calls.camera.push(constraints);
      lastCameraPromise = cameraError ? Promise.reject(cameraError) : Promise.resolve(stream);
      return lastCameraPromise;
    }
    enumerateDevices(...args) {
      assert.equal(this, mediaDevices);
      calls.enumeration.push(args);
      return Promise.resolve(devices);
    }
  }
  const mediaDevices = new MediaDevices();

  class Permissions {
    query(descriptor) {
      assert.equal(this, permissions);
      calls.permission.push(descriptor);
      return Promise.resolve(status);
    }
  }
  const permissions = new Permissions();
  class Navigator {
    get mediaDevices() { return mediaDevices; }
    get permissions() { return permissions; }
  }
  const navigator = new Navigator();

  // The smallest screen fixture needed for the actual injection to initialize.
  const orientation = new EventTarget();
  Object.assign(orientation, { type: 'landscape-primary', angle: 0 });
  class Screen extends EventTarget {
    get width() { return 1920; }
    get height() { return 1080; }
    get availWidth() { return 1920; }
    get availHeight() { return 1040; }
    get colorDepth() { return 24; }
    get pixelDepth() { return 24; }
    get isExtended() { return true; }
    get orientation() { return orientation; }
  }
  const window = { screen: new Screen(), devicePixelRatio: 1 };
  Object.defineProperty(window, 'navigator', {
    configurable: true, enumerable: true, get: () => navigator,
  });
  const context = vm.createContext({ window, navigator, EventTarget });

  return {
    window, navigator, mediaDevices, permissions, calls, stream, devices, status,
    setCameraError(error) { cameraError = error; },
    get lastCameraPromise() { return lastCameraPromise; },
    inject() { vm.runInContext(injection, context, { filename: 'single-screen.js' }); },
  };
}

function descriptorChain(object) {
  const result = [];
  for (let current = object; current !== null; current = Object.getPrototypeOf(current)) {
    result.push({ object: current, descriptors: Object.getOwnPropertyDescriptors(current) });
  }
  return result;
}

function assertDescriptorChainUnchanged(object, before) {
  const after = descriptorChain(object);
  assert.equal(after.length, before.length);
  for (let index = 0; index < before.length; index++) {
    assert.equal(after[index].object, before[index].object, 'Prototype identity is unchanged');
    const previous = before[index].descriptors;
    const current = after[index].descriptors;
    assert.deepEqual(Reflect.ownKeys(current), Reflect.ownKeys(previous));
    for (const key of Reflect.ownKeys(previous)) {
      for (const field of ['value', 'get', 'set', 'configurable', 'enumerable', 'writable']) {
        assert.equal(current[key][field], previous[key][field],
          `${String(key)} descriptor ${field} is unchanged`);
      }
    }
  }
}

test('MODEL: injection leaves camera and permission objects, functions, and descriptors intact', () => {
  const f = fixture();
  const before = {
    navigator: f.window.navigator,
    mediaDevices: f.navigator.mediaDevices,
    permissions: f.navigator.permissions,
    getUserMedia: f.mediaDevices.getUserMedia,
    enumerateDevices: f.mediaDevices.enumerateDevices,
    query: f.permissions.query,
    navigatorDescriptor: Object.getOwnPropertyDescriptor(f.window, 'navigator'),
    navigatorChain: descriptorChain(f.navigator),
    mediaChain: descriptorChain(f.mediaDevices),
    permissionChain: descriptorChain(f.permissions),
  };
  f.inject();
  assert.equal(f.window.navigator, before.navigator);
  assert.equal(f.navigator.mediaDevices, before.mediaDevices);
  assert.equal(f.navigator.permissions, before.permissions);
  assert.equal(f.mediaDevices.getUserMedia, before.getUserMedia);
  assert.equal(f.mediaDevices.enumerateDevices, before.enumerateDevices);
  assert.equal(f.permissions.query, before.query);
  assert.deepEqual(Object.getOwnPropertyDescriptor(f.window, 'navigator'), before.navigatorDescriptor);
  assertDescriptorChainUnchanged(f.navigator, before.navigatorChain);
  assertDescriptorChainUnchanged(f.mediaDevices, before.mediaChain);
  assertDescriptorChainUnchanged(f.permissions, before.permissionChain);
  assert.deepEqual(f.calls, { camera: [], enumeration: [], permission: [] },
    'Injection must not itself request camera, devices, or permission status');
});

test('MODEL: successful camera request preserves constraints, promise, and stream', async () => {
  const f = fixture();
  f.inject();
  const constraints = Object.freeze({
    video: Object.freeze({ deviceId: Object.freeze({ exact: 'fixture-camera' }), width: 1280 }),
    audio: false,
  });
  const result = f.navigator.mediaDevices.getUserMedia(constraints);
  assert.equal(result, f.lastCameraPromise, 'No promise wrapper is substituted');
  assert.equal(await result, f.stream);
  assert.equal(f.calls.camera.length, 1);
  assert.equal(f.calls.camera[0], constraints, 'Original constraints object reaches the native fixture');
  assert.equal(await f.navigator.mediaDevices.enumerateDevices(), f.devices);
  assert.equal(f.calls.enumeration.length, 1);
});

for (const name of ['NotAllowedError', 'NotReadableError', 'NotFoundError', 'OverconstrainedError']) {
  test(`MODEL: original ${name} camera rejection is preserved`, async () => {
    const f = fixture();
    const error = Object.assign(new Error(`Native fixture ${name}`), { name });
    if (name === 'OverconstrainedError') error.constraint = 'width';
    f.setCameraError(error);
    f.inject();
    const constraints = { video: true };
    const result = f.navigator.mediaDevices.getUserMedia(constraints);
    assert.equal(result, f.lastCameraPromise);
    await assert.rejects(result, caught => {
      assert.equal(caught, error, 'Original rejection object is returned unchanged');
      assert.equal(caught.name, name);
      return true;
    });
    assert.equal(f.calls.camera.length, 1);
    assert.equal(f.calls.camera[0], constraints);
  });
}

test('MODEL: permission query state and descriptor are forwarded unchanged', async () => {
  const f = fixture();
  f.inject();
  const descriptor = Object.freeze({ name: 'camera' });
  for (const state of ['granted', 'denied', 'prompt']) {
    f.status.state = state;
    const status = await f.navigator.permissions.query(descriptor);
    assert.equal(status, f.status);
    assert.equal(status.state, state, 'Extension must not force a permission state');
    assert.equal(f.calls.permission.at(-1), descriptor);
  }
  assert.equal(f.calls.permission.length, 3);
  assert.equal(f.calls.camera.length, 0);
});
