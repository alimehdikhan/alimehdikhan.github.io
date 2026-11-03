import { flushSync } from 'react-dom';

/* Theme switch as a reveal: the new theme opens out as a circle from
   `origin` (the toggle's centre by default) over a snapshot of the old one,
   through the View Transitions API. Browsers without it, and reduced
   motion, get the instant swap as before. Transitions are held off while the
   new theme paints, so nothing inside the circle fades on its own. */
export function switchTheme(next, setTheme, origin) {
  const root = document.documentElement;
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setTheme(next);
    return;
  }

  const toggle = document.querySelector('[data-theme-toggle]')?.getBoundingClientRect();
  const { x, y } = origin ?? (toggle ? { x: toggle.left + toggle.width / 2, y: toggle.top + toggle.height / 2 } : { x: innerWidth / 2, y: 0 });
  /* far enough to cover the corner furthest from the origin */
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  const calm = document.createElement('style');
  calm.textContent = '*,*::before,*::after{transition:none!important}';

  const transition = document.startViewTransition(() => {
    document.head.appendChild(calm);
    flushSync(() => setTheme(next));
    /* next-themes applies it in an effect; set it here too, so the new
       snapshot always holds the new theme */
    root.setAttribute('data-theme', next);
    root.style.colorScheme = next;
  });

  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.19, 1, 0.22, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    })
    .catch(() => {});
  transition.finished.finally(() => calm.remove()).catch(() => {});
}
