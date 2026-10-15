'use strict';

// MODEL tests only: native fullscreen dictionary conversion and events below
// are independent mocks, not a browser or a replacement for browser QA.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const injection = fs.readFileSync(path.join(__dirname, '../extension/single-screen.js'), 'utf8');

class ModelEventTarget {
  constructor() { this.listeners = new Map(); }
  addEventListener(type, listener, options = {}) {
    const list = this.listeners.get(type) || [];
    list.push({ listener, capture: typeof options === 'boolean' ? options : !!options.capture });
    this.listeners.set(type, list);
  }
  removeEventListener(type, listener) {
    this.listeners.set(type, (this.listeners.get(type) || []).filter(item => item.listener !== listener));
  }
  dispatchEvent(event) {
    let stopped = false;
    event.stopImmediatePropagation = () => { stopped = true; };
    const list = [...(this.listeners.get(event.type) || [])].sort((a, b) => Number(b.capture) - Number(a.capture));
    for (const item of list) {
      if (stopped) break;
      item.listener.call(this, event);
    }
    return true;
  }
}

function fixture() {
  const physical = { angle: 0, type: 'landscape-primary' };
  const calls = [];
  const lockCalls = [];
  const unlockCalls = [];
  const nativeResult = Promise.resolve('native fullscreen result');
  let behavior = 'resolve';
  let nativeError;

  class Orientation extends ModelEventTarget {
    get type() { return physical.type; }
    get angle() { return physical.angle; }
    lock(...args) {
      assert.equal(this, orientation);
      lockCalls.push(args);
      return Promise.reject(lockError);
    }
    unlock(...args) {
      assert.equal(this, orientation);
      unlockCalls.push(args);
      return 'native unlock result';
    }
  }
  const orientation = new Orientation();
  const lockError = Object.assign(new Error('Native orientation permission denial'), { name: 'NotAllowedError' });
  class Screen extends ModelEventTarget {
    get width() { return 1920; }
    get height() { return 1080; }
    get availWidth() { return 1920; }
    get availHeight() { return 1040; }
    get colorDepth() { return 24; }
    get pixelDepth() { return 24; }
    get isExtended() { return true; }
    get orientation() { return orientation; }
  }
  class Element {
    requestFullscreen(...args) {
      const call = { receiver: this, args, values: {} };
      calls.push(call);
      const options = args[0];
      if (options !== null && (typeof options === 'object' || typeof options === 'function')) {
        // Model WebIDL dictionary member reads in lexical order. The fourth
        // member deliberately models a future browser option unknown to the shim.
        for (const key of ['keyboardLock', 'navigationUI', 'screen', 'zzFutureOption']) {
          call.values[key] = options[key];
        }
      }
      if (behavior === 'throw') throw nativeError;
      if (behavior === 'reject') return Promise.reject(nativeError);
      return nativeResult;
    }
  }
  const window = {
    screen: new Screen(), devicePixelRatio: 1, Element,
    getScreenDetails: async () => { throw new Error('Native screen enumeration must not be used'); },
  };
  const context = vm.createContext({ window, Element, EventTarget: ModelEventTarget });
  return {
    window, Element, orientation, physical, calls, nativeResult, lockCalls, unlockCalls, lockError,
    fail(kind, error) { behavior = kind; nativeError = error; },
    inject() { vm.runInContext(injection, context, { filename: 'single-screen.js' }); },
  };
}

test('MODEL: fullscreen converts inherited getters lazily in native order with original getter receiver', async () => {
  const f = fixture();
  f.inject();
  const display = (await f.window.getScreenDetails()).currentScreen;
  const reads = [];
  const values = { keyboardLock: 'browser', navigationUI: 'hide', screen: display, zzFutureOption: 'future-value' };
  const prototype = {};
  let options;
  for (const key of Object.keys(values)) {
    Object.defineProperty(prototype, key, { get() {
      assert.equal(this, options, `${key} getter retains original receiver`);
      reads.push(key);
      return values[key];
    } });
  }
  options = Object.freeze(Object.create(prototype));
  const element = new f.Element();
  const originalMethodDescriptor = Object.getOwnPropertyDescriptor(f.Element.prototype, 'requestFullscreen');
  const result = element.requestFullscreen(options, 'extra argument');
  assert.equal(result, f.nativeResult);
  assert.equal(await result, 'native fullscreen result');
  assert.deepEqual(reads, ['keyboardLock', 'navigationUI', 'screen', 'zzFutureOption']);
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].receiver, element);
  assert.equal(f.calls[0].args.length, 2);
  assert.equal(f.calls[0].args[1], 'extra argument');
  assert.deepEqual(f.calls[0].values, {
    keyboardLock: 'browser', navigationUI: 'hide', screen: undefined, zzFutureOption: 'future-value',
  });
  assert.equal(Object.isFrozen(options), true);
  assert.equal(options.screen, display, 'Original frozen dictionary is not changed');
  assert.equal(originalMethodDescriptor.enumerable, false);
  assert.equal(originalMethodDescriptor.writable, true);
  assert.equal(originalMethodDescriptor.configurable, true);
});

test('MODEL: frozen own screen property works and unrelated screen values remain unchanged', async () => {
  const f = fixture();
  const other = fixture();
  f.inject();
  other.inject();
  const display = (await f.window.getScreenDetails()).currentScreen;
  const foreignDisplay = (await other.window.getScreenDetails()).currentScreen;
  const nativeScreen = Object.freeze({ nativeScreenMarker: true });
  const cases = [
    { value: display, expected: undefined },
    { value: nativeScreen, expected: nativeScreen },
    { value: foreignDisplay, expected: foreignDisplay },
    { value: null, expected: null },
  ];
  for (const { value, expected } of cases) {
    const options = Object.freeze({ screen: value, navigationUI: 'show', zzFutureOption: 42 });
    await new f.Element().requestFullscreen(options);
    assert.equal(f.calls.at(-1).values.screen, expected);
    assert.equal(f.calls.at(-1).values.navigationUI, 'show');
    assert.equal(f.calls.at(-1).values.zzFutureOption, 42);
    assert.equal(options.screen, value);
  }
  assert.equal(f.calls.length, cases.length);
});

test('MODEL: absent, null, primitive and function options preserve native boundary arguments', async () => {
  const f = fixture();
  f.inject();
  const element = new f.Element();
  await element.requestFullscreen();
  assert.equal(f.calls.at(-1).args.length, 0);
  for (const value of [null, undefined, false, 0, 'options', Symbol('option')]) {
    const result = element.requestFullscreen(value, 'tail');
    assert.equal(result, f.nativeResult);
    const call = f.calls.at(-1);
    assert.equal(call.args.length, 2);
    assert.equal(call.args[0], value);
    assert.equal(call.args[1], 'tail');
    assert.equal(call.receiver, element);
  }
  const options = Object.assign(function options() {}, { navigationUI: 'hide', zzFutureOption: 7 });
  await element.requestFullscreen(options);
  assert.equal(f.calls.at(-1).values.navigationUI, 'hide');
  assert.equal(f.calls.at(-1).values.zzFutureOption, 7);
});

test('MODEL: native receiver, rejection and thrown error are preserved without retries', async () => {
  const f = fixture();
  f.inject();
  const receiver = {};
  const method = f.Element.prototype.requestFullscreen;
  const rejected = Object.assign(new Error('User activation required'), { name: 'NotAllowedError' });
  f.fail('reject', rejected);
  await assert.rejects(method.call(receiver, { navigationUI: 'hide' }), error => error === rejected);
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].receiver, receiver);
  const thrown = new TypeError('Native receiver validation');
  f.fail('throw', thrown);
  assert.throws(() => method.call(receiver, null), error => error === thrown);
  assert.equal(f.calls.length, 2);
  assert.equal(f.calls[1].receiver, receiver);
});

test('MODEL: dictionary getter error reaches caller once at native conversion position', () => {
  const f = fixture();
  f.inject();
  const error = new Error('Original screen getter failed');
  const reads = [];
  const options = {
    get keyboardLock() { reads.push('keyboardLock'); return 'browser'; },
    get navigationUI() { reads.push('navigationUI'); return 'hide'; },
    get screen() { reads.push('screen'); throw error; },
    get zzFutureOption() { reads.push('zzFutureOption'); return true; },
  };
  assert.throws(() => new f.Element().requestFullscreen(options), caught => caught === error);
  assert.deepEqual(reads, ['keyboardLock', 'navigationUI', 'screen']);
  assert.equal(f.calls.length, 1);
});

test('MODEL: native orientation object, prototype and controls retain identity and errors', async () => {
  const f = fixture();
  const native = f.orientation;
  const prototype = Object.getPrototypeOf(native);
  const lock = native.lock;
  const unlock = native.unlock;
  const lockDescriptor = Object.getOwnPropertyDescriptor(prototype, 'lock');
  const unlockDescriptor = Object.getOwnPropertyDescriptor(prototype, 'unlock');
  f.inject();
  assert.equal(f.window.screen.orientation, native);
  assert.equal(Object.getPrototypeOf(native), prototype);
  assert.equal(native.lock, lock);
  assert.equal(native.unlock, unlock);
  assert.deepEqual(Object.getOwnPropertyDescriptor(prototype, 'lock'), lockDescriptor);
  assert.deepEqual(Object.getOwnPropertyDescriptor(prototype, 'unlock'), unlockDescriptor);
  assert.equal((await f.window.getScreenDetails()).currentScreen.orientation, native);
  await assert.rejects(native.lock('portrait', 'extra'), error => error === f.lockError);
  assert.deepEqual(f.lockCalls, [['portrait', 'extra']]);
  assert.equal(native.unlock('extra'), 'native unlock result');
  assert.deepEqual(f.unlockCalls, [['extra']]);
  f.physical.type = 'portrait-primary';
  f.physical.angle = 90;
  assert.equal(native.type, 'landscape-primary');
  assert.equal(native.angle, 0);
});

test('MODEL: trusted physical orientation and screen changes are suppressed; synthetic changes are delivered', () => {
  const f = fixture();
  f.inject();
  const received = { orientation: 0, screen: 0 };
  f.orientation.addEventListener('change', () => received.orientation++);
  f.window.screen.addEventListener('change', () => received.screen++);
  f.orientation.dispatchEvent({ type: 'change', isTrusted: true });
  f.window.screen.dispatchEvent({ type: 'change', isTrusted: true });
  assert.deepEqual(received, { orientation: 0, screen: 0 });
  f.orientation.dispatchEvent({ type: 'change', isTrusted: false });
  f.window.screen.dispatchEvent({ type: 'change', isTrusted: false });
  assert.deepEqual(received, { orientation: 1, screen: 1 });
});
