import { ArrowUp, ArrowUpRight, GithubMark, LinkedinMark, Mail, XMark } from '@/components/ui/icons';
import { LocalClock } from './fx/LocalClock';
import { ParticleWord } from './fx/ParticleWord';
import { RESUME } from '../data/resume';

const LINKS = [
  { label: RESUME.email, href: `mailto:${RESUME.email}`, icon: Mail },
  { label: 'GitHub', href: RESUME.github, icon: GithubMark, external: true },
  { label: 'LinkedIn', href: RESUME.linkedin, icon: LinkedinMark, external: true },
  RESUME.x && { label: 'X', href: RESUME.x, icon: XMark, external: true },
].filter(Boolean);

const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-[#d5f66b]/70';

/* A near-black footer in both themes: who and where, the contact links as
   pills, a quiet meta row, then the name across the full width as an
   interactive dot matrix. Colours are fixed here rather than themed, so the
   lime accent is set for the duotone icons too. */
export function Footer() {
  return (
    <footer className="overflow-hidden bg-[#0a0a0a] text-white" style={{ '--icon-accent': '#d5f66b' }}>
      <div className="container-page pt-16 md:pt-24">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xl leading-tight font-semibold tracking-[-0.02em]">{RESUME.name}</p>
            <p className="mt-1.5 text-sm text-white/50">{RESUME.roles.join(' · ')}</p>
            <p className="mt-5 inline-flex items-center gap-2.5 text-sm text-white/75">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#d5f66b] opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-[#d5f66b]" />
              </span>
              Available for entry-level roles
            </p>
          </div>

          <ul className="flex flex-wrap gap-2 md:justify-end">
            {LINKS.map(({ label, href, icon: Icon, external }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                  className={`group inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] pr-3.5 pl-3 text-sm text-white/75 transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-white/25 hover:bg-white/[0.07] hover:text-white active:scale-[0.97] motion-reduce:active:scale-100 ${FOCUS}`}
                >
                  <Icon className="size-4 text-[#d5f66b]" />
                  {label}
                  <ArrowUpRight className="size-3.5 text-white/35 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white motion-reduce:transform-none" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/10 pt-5 text-[13px] text-white/60">
          <p>© 2026 {RESUME.name}</p>
          <p className="tabular-nums">
            Lucknow, India · <LocalClock timeZone="Asia/Kolkata" /> IST
          </p>
          <a href="#hero" className={`group inline-flex items-center gap-1.5 rounded-sm transition-[color,transform] duration-150 ease-out hover:text-white active:scale-[0.97] motion-reduce:active:scale-100 ${FOCUS}`}>
            Back to top
            <ArrowUp className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
          </a>
        </div>
      </div>

      <div className="px-2 pt-6 pb-3 sm:px-4">
        <ParticleWord text={RESUME.name} />
      </div>
    </footer>
  );
}
