/* Resume download counter.
   GitHub Pages is static, so the click increments a free public counter
   (Abacus — no signup, no emails, CORS-enabled) instead of hitting a server.

   Check the current count any time (does NOT increment) by opening:
     https://abacus.jasoncameron.dev/get/alimehdikhan-github-io/resume-downloads

   One count per visitor session so repeat clicks don't inflate the number. */
export function trackResumeDownload() {
  /* Byte, the chat robot, cheers every download */
  window.dispatchEvent(new Event('byte:resume'));
  try {
    if (sessionStorage.getItem('amk-resume-count')) return;
    sessionStorage.setItem('amk-resume-count', '1');

    fetch('https://abacus.jasoncameron.dev/hit/alimehdikhan-github-io/resume-downloads', {
      keepalive: true,
    }).catch(() => {});
  } catch (e) {
    /* private-mode sessionStorage etc. — never block the download */
  }
}
