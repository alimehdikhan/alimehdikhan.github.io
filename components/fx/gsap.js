/* GSAP + ScrollTrigger, loaded on demand so the scroll sequences never sit
   in the initial bundle. Only scroll-driven sequences use GSAP; interface
   motion stays with Motion, and no element is animated by both. */
let loading;

/* wait for an idle moment (at most ~2s) so the sequences, which all live
   below the fold, never compete with the first paint and hydration */
const idle = () =>
  new Promise((resolve) => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(resolve, { timeout: 2000 });
    else setTimeout(resolve, 1200);
  });

export function loadGsap() {
  if (!loading) {
    loading = idle()
      .then(() => Promise.all([import('gsap'), import('gsap/ScrollTrigger')]))
      .then(([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        return { gsap, ScrollTrigger };
      });
  }
  return loading;
}
