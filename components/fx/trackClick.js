/* Click counters for the Vocaly AI star asks, on the same free public
   counter as the resume downloads (Abacus; a counter is created on its
   first hit). One count per visitor session for each counter, so repeat
   clicks don't inflate it.

   Compare the placements any time (reading does NOT add to a count):
     https://abacus.jasoncameron.dev/get/alimehdikhan-github-io/star-hero
     https://abacus.jasoncameron.dev/get/alimehdikhan-github-io/star-project
     https://abacus.jasoncameron.dev/get/alimehdikhan-github-io/star-section
     https://abacus.jasoncameron.dev/get/alimehdikhan-github-io/follow-section */
export function trackClick(counter) {
  try {
    const seen = `amk-click-${counter}`;
    if (sessionStorage.getItem(seen)) return;
    sessionStorage.setItem(seen, '1');

    fetch(`https://abacus.jasoncameron.dev/hit/alimehdikhan-github-io/${counter}`, {
      keepalive: true,
    }).catch(() => {});
  } catch (e) {
    /* private-mode sessionStorage etc.: never block the link */
  }
}
