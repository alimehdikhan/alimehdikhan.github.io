import '../styles/globals.css';
import { ThemeProvider } from '../components/ThemeProvider';

export const metadata = {
  metadataBase: new URL('https://alimehdikhan.github.io'),
  title: {
    default: 'Ali Mehdi Khan | CS Graduate (2026) | AI/ML & Python Developer',
    template: '%s | Ali Mehdi Khan',
  },
  description: 'Portfolio of Ali Mehdi Khan — B.Tech Computer Science graduate (2026) skilled in Python, Java, Machine Learning, and AI application development. Google Cloud and Deloitte certified.',
  keywords: [
    'Software Engineer',
    'AI/ML Developer',
    'Machine Learning',
    'Python',
    'Java',
    'FastAPI',
    'TensorFlow',
    'Keras',
    'NLP',
    'Google Cloud',
  ],
  authors: [{ name: 'Ali Mehdi Khan' }],
  creator: 'Ali Mehdi Khan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alimehdikhan.github.io/',
    title: 'Ali Mehdi Khan | CS Graduate (2026) | AI/ML & Python Developer',
    description: 'Entry-level Software Engineering and AI/ML portfolio featuring FastAPI, Whisper, TensorFlow, and Google Cloud certifications.',
    siteName: 'Ali Mehdi Khan Portfolio',
    images: [{
      url: '/assets/images/profile.png',
      width: 1200,
      height: 1200,
      alt: 'Ali Mehdi Khan — Portfolio',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ali Mehdi Khan | CS Graduate (2026) | AI/ML & Python Developer',
    description: 'B.Tech CSE (2026) · Python · Machine Learning · FastAPI · Google Cloud & Deloitte certified.',
    images: ['/assets/images/profile.png'],
  },
  alternates: {
    canonical: 'https://alimehdikhan.github.io/',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://alimehdikhan.github.io/#person",
        "name": "Ali Mehdi Khan",
        "url": "https://alimehdikhan.github.io/",
        "jobTitle": ["Software Engineer", "AI/ML Developer", "Python Developer"],
        "alumniOf": {
          "@type": "CollegeOrUniversity",
          "name": "Babu Banarasi Das University",
          "sameAs": "https://bbdu.ac.in/"
        },
        "sameAs": [
          "https://github.com/alimehdikhan",
          "https://www.linkedin.com/in/ali-mehdi-khan-b4062b2a3/"
        ]
      },
      {
        "@type": "ProfilePage",
        "@id": "https://alimehdikhan.github.io/#webpage",
        "url": "https://alimehdikhan.github.io/",
        "name": "Ali Mehdi Khan Portfolio",
        "about": {"@id": "https://alimehdikhan.github.io/#person"},
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "item": {
                "@type": "SoftwareApplication",
                "name": "AI Pronunciation Coach",
                "applicationCategory": "EducationalApplication"
              }
            },
            {
              "@type": "ListItem",
              "position": 2,
              "item": {
                "@type": "SoftwareApplication",
                "name": "Cancer Detection Diagnostic Pipeline",
                "applicationCategory": "HealthApplication"
              }
            }
          ]
        }
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" as="style" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
