import '../styles/globals.css';

export const metadata = {
  metadataBase: new URL('https://alimehdikhan.dev'),
  title: {
    default: 'Ali Mehdi Khan | AI Engineer & Full Stack Developer',
    template: '%s | Ali Mehdi Khan',
  },
  description: 'Portfolio of Ali Mehdi Khan, an Agentic AI Developer, Machine Learning Engineer, and Full Stack Developer specializing in Python, Next.js, and LLM implementations.',
  keywords: [
    'AI Engineer', 
    'Agentic AI Developer', 
    'Machine Learning Engineer', 
    'Full Stack Developer',
    'Python', 
    'Next.js', 
    'React', 
    'FastAPI', 
    'LLM', 
    'Generative AI'
  ],
  authors: [{ name: 'Ali Mehdi Khan' }],
  creator: 'Ali Mehdi Khan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alimehdikhan.dev/',
    title: 'Ali Mehdi Khan | AI Engineer & Full Stack Developer',
    description: 'Explore the portfolio of Ali Mehdi Khan, an expert in Agentic AI, Machine Learning, and Full Stack Engineering.',
    siteName: 'Ali Mehdi Khan Portfolio',
    images: [{
      url: '/assets/images/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Ali Mehdi Khan Portfolio Preview',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ali Mehdi Khan | AI Engineer & Full Stack Developer',
    description: 'Expert in Agentic AI, Machine Learning, and Full Stack Engineering.',
    images: ['/assets/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://alimehdikhan.dev/',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://alimehdikhan.dev/#person",
        "name": "Ali Mehdi Khan",
        "url": "https://alimehdikhan.dev/",
        "jobTitle": ["AI Engineer", "Machine Learning Engineer", "Full Stack Developer", "Agentic AI Developer"],
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
        "@id": "https://alimehdikhan.dev/#webpage",
        "url": "https://alimehdikhan.dev/",
        "name": "Ali Mehdi Khan Portfolio",
        "about": {"@id": "https://alimehdikhan.dev/#person"}
      }
    ]
  };

  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
