import { BadgeCheck } from '@/components/ui/icons';
import { SectionHead } from './ui/SectionHead';
import { DirectionalCard } from './ui/directional-card';
import { IconTile } from './ui/icon-tile';
import { Reveal } from './fx/Reveal';
import { RESUME } from '../data/resume';

/* Issuer marks are the self-hosted brand SVGs; issuers without a published
   logo (Deloitte via Forage) get a duotone seal. */
const ISSUER_LOGOS = {
  'Google Cloud Skill Badge': { file: 'googlecloud' },
  freeCodeCamp: { file: 'freecodecamp', invert: true },
};

function IssuerLogo({ issuer }) {
  const logo = ISSUER_LOGOS[issuer];
  return (
    <IconTile size="md" aria-hidden="true">
      {logo ? (
        <img className={logo.invert ? 'inv-dark' : undefined} src={`/assets/icons/tech/${logo.file}.svg`} alt="" width="22" height="22" loading="lazy" decoding="async" />
      ) : (
        <BadgeCheck className="size-[22px]" />
      )}
    </IconTile>
  );
}

export function Certifications() {
  return (
    <section id="certifications" className="section-y" aria-labelledby="certifications-title">
      <div className="container-page">
        <SectionHead title="Certifications" index="05" label="Credentials" titleId="certifications-title" />

        {/* a single list rather than another card grid: one row per
            credential, with the directional wash on each row */}
        <Reveal stagger={0.06} className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          {RESUME.certifications.map((cert, i) => (
            <DirectionalCard
              key={cert.title}
              lift={false}
              className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 rounded-none border-0 border-b bg-transparent px-5 py-5 shadow-none last:border-b-0 hover:border-border sm:grid-cols-[2rem_auto_1fr_auto] sm:gap-x-6 sm:px-8 sm:py-6"
            >
              <span className="hidden text-sm text-muted-foreground tabular-nums sm:block">{String(i + 1).padStart(2, '0')}</span>
              <IssuerLogo issuer={cert.issuer} />
              <div className="min-w-0">
                <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.015em] md:text-[19px]">{cert.title}</h3>
                <p className="mt-0.5 text-[15px] text-muted-foreground">{cert.issuer}</p>
              </div>
              <span className="col-start-2 justify-self-start rounded-full bg-secondary px-3 py-1 text-[13px] font-medium tabular-nums sm:col-start-auto sm:justify-self-end">
                {cert.date}
              </span>
            </DirectionalCard>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
