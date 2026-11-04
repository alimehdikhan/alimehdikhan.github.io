import { RESUME } from '../data/resume';
import { ASSISTANT } from '../data/assistant';

/* The homepage's structured data: the person, the site, the profile page,
   the projects and the recruiters' questions. Only the homepage renders it
   (app/page.js), so the case studies, which describe themselves as
   articles, never claim to be the profile page or to carry its FAQ. */
export function HomeSchema() {
  const SITE = 'https://alimehdikhan.github.io';
  /* stamped at build time — static export bakes it into the HTML */
  const buildDate = new Date().toISOString().split('T')[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE}/#person`,
        "name": "Ali Mehdi Khan",
        "givenName": "Ali Mehdi",
        "familyName": "Khan",
        "url": `${SITE}/`,
        "image": {
          "@type": "ImageObject",
          "@id": `${SITE}/#portrait`,
          "url": `${SITE}/assets/images/profile.png`,
          "caption": "Portrait of Ali Mehdi Khan, Software Engineer and AI/ML Developer"
        },
        "email": `mailto:${RESUME.email}`,
        "telephone": RESUME.phone,
        "jobTitle": RESUME.roles,
        "hasOccupation": RESUME.roles.map((role) => ({
          "@type": "Occupation",
          "name": role
        })),
        "description": RESUME.summary,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Lucknow",
          "addressRegion": "Uttar Pradesh",
          "addressCountry": "IN"
        },
        "alumniOf": {
          "@type": "CollegeOrUniversity",
          "name": "Babu Banarasi Das University",
          "sameAs": "https://bbdu.ac.in/"
        },
        "worksFor": {
          "@type": "Organization",
          "name": "IMAPRO",
          "url": "https://imapro.in/"
        },
        /* the résumé, as a document about him */
        "subjectOf": {
          "@type": "DigitalDocument",
          "name": "Ali Mehdi Khan, résumé",
          "url": `${SITE}${encodeURI(RESUME.resumePath)}`,
          "encodingFormat": "application/pdf",
          "inLanguage": "en"
        },
        "knowsAbout": RESUME.skills.technical,
        "knowsLanguage": ["English", "Hindi", "Urdu"],
        "award": RESUME.awards.map((a) => a.title),
        "hasCredential": RESUME.certifications.map((cert) => ({
          "@type": "EducationalOccupationalCredential",
          "name": cert.title,
          "credentialCategory": "certification",
          "recognizedBy": { "@type": "Organization", "name": cert.issuer }
        })),
        "sameAs": [
          RESUME.github,
          "https://www.linkedin.com/in/ali-mehdi-khan-b4062b2a3/",
          "https://huggingface.co/Alimehdi973"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        "url": `${SITE}/`,
        "name": "Ali Mehdi Khan Portfolio",
        "alternateName": ["Ali Mehdi Khan", "AMK"],
        "description": "Portfolio of Ali Mehdi Khan, a B.Tech CS graduate who builds LLM apps, NLP pipelines and FastAPI backends in Python.",
        "publisher": { "@id": `${SITE}/#person` },
        "author": { "@id": `${SITE}/#person` },
        "copyrightHolder": { "@id": `${SITE}/#person` },
        "inLanguage": "en",
        "dateModified": buildDate
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE}/#webpage`,
        "url": `${SITE}/`,
        "name": "Ali Mehdi Khan Portfolio",
        "isPartOf": { "@id": `${SITE}/#website` },
        "about": { "@id": `${SITE}/#person` },
        "primaryImageOfPage": { "@id": `${SITE}/#portrait` },
        "inLanguage": "en",
        /* the repository's first day; dateModified is this build */
        "dateCreated": "2026-05-21T16:37:54Z",
        "dateModified": buildDate,
        /* Google's ProfilePage rich result reads the person from mainEntity */
        "mainEntity": { "@id": `${SITE}/#person` },
        "hasPart": { "@id": `${SITE}/#projects` }
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/#projects`,
        "name": "Featured Projects",
        "numberOfItems": RESUME.projects.length,
        "itemListElement": RESUME.projects.map((proj, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": ["SoftwareApplication", "SoftwareSourceCode"],
            "name": proj.title,
            "description": proj.overview,
            /* the case study is the project's page here; code and demo stay linked */
            "url": proj.slug ? `${SITE}/projects/${proj.slug}` : proj.demo || proj.github,
            "codeRepository": proj.github,
            "programmingLanguage": "Python",
            "keywords": proj.tech.join(', '),
            "applicationCategory": i === 0 ? "EducationalApplication" : "HealthApplication",
            "operatingSystem": "Web",
            "author": { "@id": `${SITE}/#person` }
          }
        }))
      },
      /* the "Questions recruiters ask" section, for answer engines */
      {
        "@type": "FAQPage",
        "@id": `${SITE}/#faq`,
        "url": `${SITE}/#faq`,
        "isPartOf": { "@id": `${SITE}/#website` },
        "about": { "@id": `${SITE}/#person` },
        "inLanguage": "en",
        "mainEntity": ASSISTANT.faq.map(({ q, a }) => ({
          "@type": "Question",
          "name": q,
          "acceptedAnswer": { "@type": "Answer", "text": a }
        }))
      }
    ]
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
