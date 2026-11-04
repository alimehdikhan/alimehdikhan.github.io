import { ChevronRight } from '@/components/ui/icons';
import { SectionHead } from './ui/SectionHead';
import { Reveal } from './fx/Reveal';
import { AskByte } from './AskByte';
import { ASSISTANT } from '../data/assistant';

/* The questions recruiters ask, answered in a line or two from Ali's own
   notes (data/assistant.js), the same ones Byte answers from. They are on
   the page for readers and for search and answer engines alike, which
   app/layout.js also hands a FAQPage. Native <details>, so they open
   without script and their text is in the HTML from the start. */
export function Faq() {
  return (
    <section id="faq" className="section-y" aria-labelledby="faq-title">
      <div className="container-page">
        <SectionHead
          title={
            <>
              Questions recruiters <em>ask</em>
            </>
          }
          titleId="faq-title"
          intro="The short answers, the way Byte, the robot in the corner, gives them. It knows the rest too."
        />

        <Reveal stagger={0.04} className="grid items-start gap-3 lg:grid-cols-2 lg:gap-x-6">
          {ASSISTANT.faq.map(({ q, a }) => (
            <details key={q} className="group rounded-3xl border border-border bg-card px-5 md:px-6">
              <summary className="-mx-5 flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-3xl px-5 py-4 text-[17px] leading-snug font-semibold tracking-[-0.015em] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 md:-mx-6 md:px-6 [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none" />
              </summary>
              <p className="max-w-[62ch] pb-5 text-[15px] leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </Reveal>

        <Reveal className="mt-6">
          <AskByte />
        </Reveal>
      </div>
    </section>
  );
}
