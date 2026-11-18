const bound = new WeakSet<HTMLElement>();

/* Move the caret to the clicked source line */
export function initCodeLines(): void {
  for (const code of document.querySelectorAll<HTMLElement>('[data-code-lines]')) {
    if (bound.has(code)) continue;
    bound.add(code);
    code.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('a')) return;
      const line = target.closest<HTMLElement>('.code__line');
      if (!line || line.hasAttribute('data-active')) return;
      code.querySelector('[data-active]')?.removeAttribute('data-active');
      line.setAttribute('data-active', '');
    });
  }
}
