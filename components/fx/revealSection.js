/* Anchor navigation: snap a section's reveals visible immediately so a fast
   jump never lands on a blank block waiting for the viewport observer.
   <Reveal> subscribes via `onRevealSection`. */
const listeners = new Set();

export function onRevealSection(fn) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function revealSection(hash) {
  listeners.forEach((fn) => fn(hash));
}
