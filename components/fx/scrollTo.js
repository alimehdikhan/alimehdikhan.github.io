import { animate } from 'framer-motion';
import { EASE } from './motion';

/* Editorial anchor travel: one framer tween drives window.scrollTo with
   behavior:'instant' (so CSS scroll-behavior:smooth never fights it), on the
   page's own EASE curve, with duration scaled by distance. Native input
   (wheel / touch / keys) interrupts it immediately. Dispatches
   `anchor:done` on window when travel ends for any reason, so the nav can
   release its active-section lock.

   Returns false when it did not take over — reduced motion (the native
   instant jump is correct there) or a missing target — so callers can let
   the default anchor behaviour run. */

const NAV_OFFSET = 92;
const INTERRUPTS = ['wheel', 'touchstart', 'keydown'];

let travel = null;
let stopListeners = null;
let smoothScroller = null;
export function setSmoothScroller(scroller) { smoothScroller = scroller; }

// Gallery controls share Lenis so native smooth scrolling never fights its RAF.
export function scrollToPosition(top, { immediate = false } = {}) {
  if (smoothScroller) {
    smoothScroller.scrollTo(top, { immediate, duration: .55 });
  } else {
    window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' });
  }
}

function finish(hash) {
  if (stopListeners) stopListeners();
  stopListeners = null;
  travel = null;
  document.documentElement.style.scrollBehavior = '';
  window.dispatchEvent(new CustomEvent('anchor:done', { detail: hash }));
}

export function scrollToHash(hash, { push = true } = {}) {
  if (typeof window === 'undefined' || !hash || hash[0] !== '#') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  const top = hash === '#hero' || hash === '#top' || hash === '#main-content';
  const el = top ? document.body : document.getElementById(hash.slice(1));
  if (!el) return false;

  const from = window.scrollY;
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const to = top ? 0 : Math.max(0, Math.min(el.getBoundingClientRect().top + from - NAV_OFFSET, max));

  if (push) {
    try {
      window.history.pushState(window.history.state, '', hash);
    } catch (e) {
      /* ignore */
    }
  }

  if (travel) travel.stop();
  if (stopListeners) stopListeners();

  if (smoothScroller) {
    travel = { stop: () => smoothScroller?.scrollTo(window.scrollY, { immediate: true }) };
    smoothScroller.scrollTo(to, { duration: .8, onComplete: () => finish(hash) });
    return true;
  }

  const dist = Math.abs(to - from);
  if (dist < 2) {
    finish(hash);
    return true;
  }

  /* 0.55s for a nudge, up to 1.15s for a full-page jump */
  const duration = Math.min(1.15, 0.55 + dist / 3600);
  document.documentElement.style.scrollBehavior = 'auto';

  const onInterrupt = () => {
    if (travel) travel.stop();
    finish(hash);
  };
  INTERRUPTS.forEach((t) => window.addEventListener(t, onInterrupt, { passive: true }));
  stopListeners = () => INTERRUPTS.forEach((t) => window.removeEventListener(t, onInterrupt));

  travel = animate(from, to, {
    duration,
    ease: EASE,
    onUpdate: (v) => window.scrollTo({ top: v, behavior: 'instant' }),
    onComplete: () => finish(hash),
  });
  return true;
}

export function isTravelling() {
  return travel !== null;
}

/* Deep links (/#projects) jump before fonts and the preloader lock have
   settled the layout, so the section drifts off its 92px mark. Called as the
   curtain hands off — still covered, so the correction is invisible. */
export function realignHash() {
  if (typeof window === 'undefined') return;
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return;
  const el = document.getElementById(hash.slice(1));
  if (!el) return;
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET);
  if (Math.abs(top - window.scrollY) > 2) window.scrollTo({ top, behavior: 'instant' });
}
