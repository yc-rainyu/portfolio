export interface ReadingPosition {
  key: string;
  progress: number;
  section: string;
  sectionProgress: number;
  viewportY: number;
  top: boolean;
}

const transferKey = 'portfolio-reading-position';
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const anchors = () => [...document.querySelectorAll<HTMLElement>('[data-scroll-anchor]')];
const visible = (element: HTMLElement) => element.getClientRects().length > 0 && element.getBoundingClientRect().height > 0;
const findAnchor = (key: string) => anchors().find(element => element.dataset.scrollAnchor === key && visible(element));

export function captureReadingPosition(): ReadingPosition {
  const headerBottom = document.querySelector('[data-header]')?.getBoundingClientRect().bottom ?? 0;
  const viewportY = Math.min(window.innerHeight * .35, Math.max(0, headerBottom) + 120);
  const measured = anchors().filter(visible).map(element => ({ element, rect: element.getBoundingClientRect() }));
  const containing = measured.filter(({ rect }) => rect.top <= viewportY && rect.bottom > viewportY);
  const match = containing.sort((a, b) =>
    Number(b.element.dataset.scrollPriority ?? 0) - Number(a.element.dataset.scrollPriority ?? 0)
    || a.rect.height - b.rect.height)[0]
    ?? measured.filter(({ rect }) => rect.top <= viewportY).sort((a, b) => b.rect.top - a.rect.top)[0]
    ?? measured[0];
  const scope = match?.element.closest<HTMLElement>('[data-scroll-section]');
  const sectionRect = scope?.getBoundingClientRect();
  return {
    key: match?.element.dataset.scrollAnchor ?? '',
    progress: match ? clamp((viewportY - match.rect.top) / match.rect.height, 0, 1) : 0,
    section: scope?.dataset.scrollAnchor ?? '',
    sectionProgress: sectionRect ? clamp((viewportY - sectionRect.top) / sectionRect.height, 0, 1) : 0,
    viewportY,
    top: window.scrollY <= 2,
  };
}

export function restoreReadingPosition(position: ReadingPosition): void {
  if (position.top) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }
  const exact = findAnchor(position.key);
  const target = exact ?? findAnchor(position.section);
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const progress = exact ? position.progress : position.sectionProgress;
  const viewportY = clamp(position.viewportY, 0, Math.max(0, window.innerHeight - 16));
  const top = window.scrollY + rect.top + progress * rect.height - viewportY;
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  window.scrollTo({ top: clamp(top, 0, max), behavior: 'instant' });
}

let cancelPending: (() => void) | undefined;

/* User input cancels pending position corrections */
function preserve(restore: () => void, update: () => void): void {
  cancelPending?.();
  const root = document.documentElement;
  root.setAttribute('data-scroll-adjusting', '');
  let active = true;
  let timer: ReturnType<typeof setTimeout>;
  const observer = new ResizeObserver(() => { if (active) restore(); });
  const inputEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
  const stop = () => {
    if (!active) return;
    active = false;
    clearTimeout(timer);
    observer.disconnect();
    root.removeAttribute('data-scroll-adjusting');
    for (const event of inputEvents) window.removeEventListener(event, stop, true);
    window.removeEventListener('load', correct);
    if (cancelPending === stop) cancelPending = undefined;
  };
  const correct = () => { if (active) restore(); };
  cancelPending = stop;
  try {
    update();
    restore();
    observer.observe(document.body);
    requestAnimationFrame(() => {
      correct();
      requestAnimationFrame(correct);
    });
    void document.fonts.ready.then(correct);
    window.addEventListener('load', correct);
    for (const event of inputEvents) window.addEventListener(event, stop, { capture: true, passive: true });
    timer = setTimeout(stop, 1200);
  } catch (error) {
    stop();
    throw error;
  }
}

export function preserveReadingPosition(position: ReadingPosition, update: () => void): void {
  preserve(() => restoreReadingPosition(position), update);
}

export function preserveElementPosition(element: HTMLElement, update: () => void): void {
  const offset = element.getBoundingClientRect().top;
  preserve(() => {
    window.scrollBy({ top: element.getBoundingClientRect().top - offset, behavior: 'instant' });
  }, update);
}

export function saveLanguagePosition(pathname: string, position: ReadingPosition): void {
  try {
    const filter = document.querySelector<HTMLElement>('[data-work-index]')?.dataset.filter;
    sessionStorage.setItem(transferKey, JSON.stringify({ pathname, position, filter, savedAt: Date.now() }));
  } catch {}
}

export function restoreLanguagePosition(): void {
  let raw: string | null;
  try {
    raw = sessionStorage.getItem(transferKey);
    sessionStorage.removeItem(transferKey);
  } catch { return; }
  if (!raw) return;
  try {
    const saved = JSON.parse(raw);
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (navigation?.type === 'back_forward' || navigation?.type === 'reload') return;
    if (saved.pathname !== location.pathname || Date.now() - saved.savedAt > 15000 || Date.now() < saved.savedAt) return;
    const p = saved.position;
    if (!p || typeof p.key !== 'string' || typeof p.section !== 'string' || typeof p.top !== 'boolean'
      || ![p.progress, p.sectionProgress, p.viewportY].every(Number.isFinite)) return;
    preserveReadingPosition(p, () => {
      if (typeof saved.filter === 'string') document.dispatchEvent(new CustomEvent('work-filter:restore', { detail: saved.filter }));
    });
  } catch {}
}
