import localFont from 'next/font/local';
import '../styles/globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { RESUME } from '../data/resume';
import { ASSISTANT } from '../data/assistant';

const manrope = localFont({
  src: './fonts/Manrope-latin-300-800.woff2',
  weight: '300 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-manrope',
});

const instrumentSerif = localFont({
  src: './fonts/InstrumentSerif-latin-italic.woff2',
  weight: '400',
  style: 'italic',
  display: 'swap',
  variable: '--font-instrument',
});

export const metadata = {
  metadataBase: new URL('https://alimehdikhan.github.io'),
  title: {
    default: 'Ali Mehdi Khan | AI/ML & Python Developer',
    template: '%s | Ali Mehdi Khan',
  },
  /* under 160 characters, so search results show all of it */
  description: 'Ali Mehdi Khan, AI/ML and Python developer in Lucknow. Builds AI products end to end: Vocaly AI, a skin lesion classifier, FastAPI backends, React apps.',
  keywords: [
    'Ali Mehdi Khan',
    'Software Engineer',
    'AI/ML Developer',
    'Python Developer',
    'Machine Learning Engineer',
    'Entry Level Software Engineer',
    'B.Tech Computer Science 2026',
    'Machine Learning',
    'Deep Learning',
    'Python',
    'Java',
    'FastAPI',
    'TensorFlow',
    'Keras',
    'NLP',
    'OpenAI Whisper',
    'LLM Applications',
    'LangChain',
    'RAG Pipelines',
    'Docker',
    'Google Cloud Skill Badges',
    'Deloitte Job Simulation',
    'AI Pronunciation Coach',
    'Vocaly AI',
    'Skin Lesion Classifier',
    'Skin Cancer Detection',
    'EfficientNet',
    'PyTorch',
    'ONNX Runtime',
    'AI Portfolio Chatbot',
    'Portfolio',
    'Lucknow',
    'India',
  ],
  authors: [{ name: 'Ali Mehdi Khan', url: 'https://alimehdikhan.github.io/' }],
  manifest: '/site.webmanifest',
  creator: 'Ali Mehdi Khan',
  publisher: 'Ali Mehdi Khan',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: 'https://alimehdikhan.github.io/',
    title: 'Ali Mehdi Khan | AI/ML & Python Developer',
    description: 'Vocaly AI, a pronunciation coach that marks every mispronounced sound, a skin lesion classifier and FastAPI backends. Ask Byte, the site’s AI assistant, anything about Ali.',
    siteName: 'Ali Mehdi Khan Portfolio',
    firstName: 'Ali Mehdi',
    lastName: 'Khan',
    username: 'alimehdikhan',
    /* a 1200×630 card (from the hero), the size LinkedIn, X and WhatsApp crop to */
    images: [{
      url: '/assets/images/og-card.png',
      width: 1200,
      height: 630,
      alt: 'Ali Mehdi Khan, AI/ML and Python developer: Vocaly AI at 0.94 AUC, a skin lesion classifier at about 20 ms per image, junior software developer at IMAPRO',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ali Mehdi Khan | AI/ML & Python Developer',
    description: 'B.Tech CSE (2026) · AI products end to end · Python, FastAPI, React · Junior software developer at IMAPRO.',
    images: [{ url: '/assets/images/og-card.png', alt: 'Ali Mehdi Khan, AI/ML and Python developer' }],
  },
  alternates: {
    canonical: 'https://alimehdikhan.github.io/',
  },
  category: 'technology',
  /* the site opens dark whatever the OS prefers; ThemeProvider retints the
     tag when the visitor switches */
  themeColor: '#090a0a',
};

export default function RootLayout({ children }) {
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
            "url": proj.demo || proj.github,
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

  return (
    <html lang="en" className={`${manrope.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* the profiles that are also Ali (rel=me ties them to this site), and
            the plain-text profile AI tools look for (lib/llms.js) */}
        <link rel="me" href={RESUME.github} />
        <link rel="me" href={RESUME.linkedin} />
        <link rel="me" href="https://huggingface.co/Alimehdi973" />
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="Ali Mehdi Khan, for AI tools (llms.txt)" />
        <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="Ali Mehdi Khan, full profile for AI tools (llms-full.txt)" />
        <script
          data-goatcounter="https://alimehdikhan.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
