/* Click counters for the Vocaly AI star asks, on the same free public
   counter as the resume downloads (Abacus; a counter is created on its
   first hit). One count per visitor session for each counter, so repeat
   clicks don't inflate it.

   Compare the placements any time (reading does NOT add to a count):
     https://abacus.jasoncameron.dev/get/alimehdikhan-github-io/star-hero
     https://abacus.jasoncameron.dev/get/alimehdikhan-github-io/star-project
     https://abacus.jasoncameron.dev/get/alimehdikhan-github-io/star-section
     https://abacus.jasoncameron.dev/get/alimehdikhan-github-io/star-tutorial
     https://abacus.jasoncameron.dev/get/alimehdikhan-github-io/follow-section

   Byte, the chat robot (ChatWidget.js), counts the same way:
     chat-open      the chat was opened
     chat-ask       a first question was asked
     chat-jd        a job description was pasted
     chat-lead      a recruiter left their email for Ali
     nudge-<name>   a speech bubble was tapped (hello, welcome, skills,
                    experience, projects, idle, speed, leaving, resume,
                    copied, pet, tickle)
     byte-pet       somebody patted Byte; byte-tickle, tickled it
   e.g. https://abacus.jasoncameron.dev/get/alimehdikhan-github-io/chat-lead */
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
