import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  captureReadingPosition, restoreReadingPosition, preserveReadingPosition,
  preserveElementPosition, saveLanguagePosition, restoreLanguagePosition,
} from '../src/lib/reading-position.ts';

// Simulate layout changes without a browser
function fixture() {
  const previous = new Map<string, PropertyDescriptor | undefined>();
  const state = { y: 0, height: 800, pageHeight: 12000, navigation: 'navigate', filter: 'design' };
  const elements: any[] = [];
  const events = new Map<string, Set<Function>>();
  const storage = new Map<string, string>();
  const attributes = new Set<string>();
  const frames: FrameRequestCallback[] = [];
  const observers: Function[] = [];
  const root = {
    get scrollHeight() { return state.pageHeight; },
    setAttribute: (key: string) => attributes.add(key),
    removeAttribute: (key: string) => attributes.delete(key),
  };
  const windowMock = {
    get scrollY() { return state.y; }, get innerHeight() { return state.height; },
    scrollTo: ({ top }: { top: number }) => { state.y = Math.max(0, Math.min(top, state.pageHeight - state.height)); },
    scrollBy: ({ top }: { top: number }) => { windowMock.scrollTo({ top: state.y + top }); },
    addEventListener: (key: string, fn: Function) => { if (!events.has(key)) events.set(key, new Set()); events.get(key)!.add(fn); },
    removeEventListener: (key: string, fn: Function) => events.get(key)?.delete(fn),
  };
  const documentMock = {
    documentElement: root, body: {}, fonts: { ready: Promise.resolve() },
    querySelectorAll: () => elements,
    querySelector: (selector: string) => selector === '[data-header]'
      ? { getBoundingClientRect: () => ({ bottom: 72 }) }
      : { dataset: { filter: state.filter } },
    dispatchEvent: (event: { type: string; detail: string }) => {
      if (event.type === 'work-filter:restore') state.filter = event.detail;
    },
  };
  const values = {
    window: windowMock, document: documentMock, location: { pathname: '/en/' },
    performance: { getEntriesByType: () => [{ type: state.navigation }] },
    sessionStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
    ResizeObserver: class { constructor(callback: Function) { observers.push(callback); } observe() {} disconnect() {} },
    requestAnimationFrame: (callback: FrameRequestCallback) => { frames.push(callback); return frames.length; },
    setTimeout: () => 1, clearTimeout: () => {},
  };
  for (const [key, value] of Object.entries(values)) {
    previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  const element = (key: string, top: number, height: number, scope?: any, hidden = false) => {
    const e: any = {
      dataset: { scrollAnchor: key }, top, height, hidden, scope,
      getBoundingClientRect() { return { top: this.top - state.y, bottom: this.top - state.y + this.height, height: this.height }; },
      getClientRects() { return this.hidden ? [] : [this.getBoundingClientRect()]; },
      closest() { return this.scope ?? this; },
    };
    elements.push(e);
    return e;
  };
  const send = (name: string) => { for (const fn of [...events.get(name) ?? []]) fn(); };
  return {
    state, element, storage, attributes, frames, observers, send,
    cleanup() {
      send('wheel');
      for (const [key, descriptor] of previous) {
        if (descriptor) Object.defineProperty(globalThis, key, descriptor);
        else Reflect.deleteProperty(globalThis, key);
      }
    },
  };
}

test('same skill row survives a longer layout and skips the hidden seasonal copy', () => {
  const f = fixture();
  try {
    const section = f.element('section-skills', 2000, 4000);
    const seasonal = f.element('skill-frontend-React', 2800, 24, section);
    const code = f.element('skill-frontend-React', 5200, 48, section, true);
    f.state.y = 2620;
    const position = captureReadingPosition();
    assert.equal(position.key, 'skill-frontend-React');
    assert.equal(position.progress, .5);
    seasonal.hidden = true;
    code.hidden = false;
    restoreReadingPosition(position);
    assert.equal(f.state.y, 5032);
    assert.equal(code.getBoundingClientRect().top + code.height * .5, 192);
  } finally { f.cleanup(); }
});

test('restores a semantic anchor rather than the old document scroll percentage', () => {
  const f = fixture();
  try {
    const section = f.element('section-index', 4000, 2400);
    const row = f.element('index-spotclue', 4400, 100, section);
    f.state.y = 4258;
    const position = captureReadingPosition();
    assert.equal(position.key, 'index-spotclue');
    row.top = 8000; row.height = 200; section.top = 7500;
    restoreReadingPosition(position);
    assert.equal(f.state.y, 7908);
    assert.equal(row.getBoundingClientRect().top + row.height * .5, 192);
  } finally { f.cleanup(); }
});

test('falls back to the corresponding chapter when a row is unavailable', () => {
  const f = fixture();
  try {
    const section = f.element('section-skills', 2000, 1000);
    const row = f.element('skill-backend-REST', 2400, 100, section);
    f.state.y = 2258;
    const position = captureReadingPosition();
    row.hidden = true; section.top = 5000; section.height = 2000;
    restoreReadingPosition(position);
    assert.equal(f.state.y, 5708);
  } finally { f.cleanup(); }
});

test('keeps the filter bar in place after browser anchoring shifts the viewport', async () => {
  const f = fixture();
  try {
    const filters = f.element('index-filters', 6000, 44);
    f.state.y = 5800;
    preserveElementPosition(filters, () => { f.state.y = 5200; });
    assert.equal(filters.getBoundingClientRect().top, 200);
    assert.equal(f.attributes.has('data-scroll-adjusting'), true);
    f.state.y = 5900;
    f.frames.shift()!(0);
    assert.equal(filters.getBoundingClientRect().top, 200);
    f.send('wheel');
    f.state.y = 6100;
    for (const observer of f.observers) observer();
    await Promise.resolve();
    assert.equal(f.state.y, 6100, 'manual scrolling cancels pending font/resize corrections');
    assert.equal(f.attributes.has('data-scroll-adjusting'), false);
  } finally { f.cleanup(); }
});

test('language transfer restores the selected filter once and respects browser history', () => {
  const f = fixture();
  try {
    f.element('section-index', 4000, 2000); f.state.y = 4200;
    const position = captureReadingPosition();
    saveLanguagePosition('/en/', position);
    f.state.filter = 'all'; f.state.y = 0;
    restoreLanguagePosition();
    assert.equal(f.state.filter, 'design');
    assert.equal(f.state.y, 4200);
    assert.equal(f.storage.size, 0);
    f.send('wheel');
    saveLanguagePosition('/en/', position);
    f.state.navigation = 'back_forward'; f.state.y = 123;
    restoreLanguagePosition();
    assert.equal(f.state.y, 123);
  } finally { f.cleanup(); }
});

test('handles the page top and invalid saved positions', () => {
  const f = fixture();
  try {
    const anchor = f.element('section-about', 1000, 1000);
    const top = captureReadingPosition();
    f.state.y = 500;
    preserveReadingPosition(top, () => {});
    assert.equal(f.state.y, 0);
    f.send('wheel');
    f.state.y = 1100;
    const position = captureReadingPosition();
    anchor.top = 20000;
    restoreReadingPosition(position);
    assert.equal(f.state.y, f.state.pageHeight - f.state.height);
    f.storage.set('portfolio-reading-position', '{bad json');
    restoreLanguagePosition();
    assert.equal(f.storage.size, 0);
  } finally { f.cleanup(); }
});

test('overlapping cover does not take precedence over the title being read', () => {
  const f = fixture();
  try {
    const page = f.element('project', 0, 4000);
    const intro = f.element('project-intro', 200, 600, page);
    intro.dataset.scrollPriority = '1';
    f.element('project-cover', 400, 400, page);
    f.state.y = 308;
    assert.equal(captureReadingPosition().key, 'project-intro');
  } finally { f.cleanup(); }
});

test('ignores transfers that should not restore scrolling', () => {
  const f = fixture();
  try {
    f.element('section-index', 3000, 1000); f.state.y = 3100;
    const position = captureReadingPosition();
    saveLanguagePosition('/zh/', position);
    f.state.y = 50;
    restoreLanguagePosition();
    assert.equal(f.state.y, 50);
    saveLanguagePosition('/en/', position);
    const key = 'portfolio-reading-position';
    const record = JSON.parse(f.storage.get(key)!);
    record.savedAt -= 16000;
    f.storage.set(key, JSON.stringify(record));
    restoreLanguagePosition();
    assert.equal(f.state.y, 50);
    saveLanguagePosition('/en/', position);
    f.state.navigation = 'reload';
    restoreLanguagePosition();
    assert.equal(f.state.y, 50);
    Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: {
      getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); },
    } });
    assert.doesNotThrow(() => saveLanguagePosition('/en/', position));
    assert.doesNotThrow(restoreLanguagePosition);
  } finally { f.cleanup(); }
});
