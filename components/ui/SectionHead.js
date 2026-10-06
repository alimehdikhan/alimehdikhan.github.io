import { Reveal } from '../fx/Reveal';
import { MaskReveal } from '../fx/MaskReveal';
import { cn } from '@/lib/utils';

/* Section heading: a small eyebrow with a lime dot that fades in, then a large,
   tightly tracked title that rises out of a masked line. Wrap the secondary
   phrase in <em> for the serif-italic lime highlight. */
export function SectionHead({ title, label, titleId, intro, className }) {
  return (
    <div className={cn('mb-8 flex flex-col gap-4 md:mb-12', className)}>
      <Reveal y={8}>
        <span className="inline-flex items-center gap-2.5 text-sm font-semibold text-muted-foreground">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgb(var(--glow)/0.8)]" />
          {label}
        </span>
      </Reveal>
      <h2 id={titleId} className="max-w-[24ch] text-[clamp(2.25rem,4.8vw,3.5rem)] leading-[1.08] tracking-[-0.028em]">
        <MaskReveal delay={0.08}>{title}</MaskReveal>
      </h2>
      {intro && (
        <Reveal>
          <p className="max-w-[60ch] text-muted-foreground">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
