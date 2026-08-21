/* Instantly reveal a section's content when the user navigates to it by
   anchor, so a fast jump never lands on a blank block waiting for the
   IntersectionObserver. Counters keep their SSR (final) values. */
export function revealSection(hash) {
  try {
    const el = document.querySelector(hash);
    if (!el) return;
    el.querySelectorAll('.rev:not(.in)').forEach((n) => n.classList.add('in'));
    if (el.classList.contains('rev')) el.classList.add('in');
  } catch (e) {
    /* invalid selector — ignore */
  }
}
