import '../styles/globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { RESUME } from '../data/resume';

export const metadata = {
  metadataBase: new URL('https://alimehdikhan.github.io'),
  title: {
    default: 'Ali Mehdi Khan | AI/ML & Python Developer',
    template: '%s | Ali Mehdi Khan',
  },
  description: 'Portfolio of Ali Mehdi Khan — final-year B.Tech CS student building LLM apps, NLP pipelines, and FastAPI backends in Python. Junior developer at IMAPRO. Google Cloud and Deloitte certified.',
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
    'Google Cloud Certified',
    'Deloitte Certified',
    'AI Pronunciation Coach',
    'Cancer Detection System',
    'Portfolio',
    'Lucknow',
    'India',
  ],
  authors: [{ name: 'Ali Mehdi Khan', url: 'https://alimehdikhan.github.io/' }],
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
    description: 'AI/ML portfolio: a Whisper-based pronunciation coach on Hugging Face Spaces, CNN medical-imaging models, FastAPI backends, and Google Cloud certifications.',
    siteName: 'Ali Mehdi Khan Portfolio',
    firstName: 'Ali Mehdi',
    lastName: 'Khan',
    images: [{
      url: '/assets/images/profile.png',
      width: 1200,
      height: 1200,
      alt: 'Ali Mehdi Khan — Portfolio',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ali Mehdi Khan | AI/ML & Python Developer',
    description: 'B.Tech CSE (2026) · Python · LLM apps & RAG · FastAPI · Junior developer at IMAPRO · Google Cloud certified.',
    images: ['/assets/images/profile.png'],
  },
  alternates: {
    canonical: 'https://alimehdikhan.github.io/',
  },
  category: 'technology',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#06070c' },
    { media: '(prefers-color-scheme: light)', color: '#f1efea' },
  ],
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
        "knowsAbout": RESUME.skills.technical,
        "knowsLanguage": "en",
        "hasCredential": RESUME.certifications.map((cert) => ({
          "@type": "EducationalOccupationalCredential",
          "name": cert.title,
          "credentialCategory": "certification",
          "recognizedBy": { "@type": "Organization", "name": cert.issuer }
        })),
        "sameAs": [
          RESUME.github,
          "https://www.linkedin.com/in/ali-mehdi-khan-b4062b2a3/"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        "url": `${SITE}/`,
        "name": "Ali Mehdi Khan Portfolio",
        "description": "Portfolio of Ali Mehdi Khan — final-year B.Tech CS student building LLM apps, NLP pipelines, and FastAPI backends in Python.",
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
        "dateModified": buildDate,
        "mainEntity": {
          "@type": "ItemList",
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
        }
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.simpleicons.org" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Sora:wght@200;300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" as="style" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Sora:wght@200;300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('is-loading');}}catch(e){}})();",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
