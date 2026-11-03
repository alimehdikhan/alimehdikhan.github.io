/* Hover roll for a short label: on hover or keyboard focus of the parent
   (which needs `group`), each letter slides up out of view while its twin
   rolls in from below, a few milliseconds after the letter before. Hover
   devices only, and still under reduced motion. The twin row is hidden
   from assistive tech, so the label reads once. */
export function RollText({ children }) {
  const letters = [...children];
  const row = (twin) =>
    letters.map((ch, i) => (
      <span
        key={i}
        style={{ '--i': i }}
        className={
          twin
            ? 'inline-block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] [transition-delay:calc(var(--i)*16ms)] motion-safe:group-hover:translate-y-0 motion-safe:group-focus-visible:translate-y-0'
            : 'inline-block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] [transition-delay:calc(var(--i)*16ms)] motion-safe:group-hover:-translate-y-full motion-safe:group-focus-visible:-translate-y-full'
        }
      >
        {ch === ' ' ? ' ' : ch}
      </span>
    ));

  return (
    <span className="relative inline-flex overflow-hidden align-top">
      <span className="inline-flex">{row(false)}</span>
      <span aria-hidden="true" className="absolute inset-0 inline-flex">
        {row(true)}
      </span>
    </span>
  );
}
