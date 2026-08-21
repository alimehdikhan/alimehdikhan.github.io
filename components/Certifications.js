'use client';

import { SectionHead } from './ui/SectionHead';
import { RESUME } from '../data/resume';

/* Real issuer marks where one exists on a public CDN; issuers without a
   published logo (Deloitte via Forage) stay text-only. */
const ISSUER_LOGOS = {
  'Google Cloud Skill Badge': {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',
  },
  freeCodeCamp: {
    src: 'https://cdn.simpleicons.org/freecodecamp',
    invDark: true,
  },
};

function IssuerLogo({ issuer }) {
  const logo = ISSUER_LOGOS[issuer];
  if (!logo) return null;
  return (
    <span className="cert-ic" aria-hidden="true">
      <img
        className={logo.invDark ? 'inv-dark' : undefined}
        src={logo.src}
        alt=""
        loading="lazy"
        onError={(e) => {
          e.currentTarget.parentElement.style.display = 'none';
        }}
      />
    </span>
  );
}

export function Certifications() {
  return (
    <section id="certifications" className="sec" aria-labelledby="certifications-title">
      <SectionHead title="Certifications" index="05" label="Credentials" titleId="certifications-title" />

      <div className="hair hair-2 hair-hover rev">
        {RESUME.certifications.map((cert) => (
          <div key={cert.title}>
            <div className="cert-head">
              <div className="cert-id">
                <IssuerLogo issuer={cert.issuer} />
                <h3>{cert.title}</h3>
              </div>
              <span className="cert-date">{cert.date}</span>
            </div>
            <p className="cert-issuer">{cert.issuer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
