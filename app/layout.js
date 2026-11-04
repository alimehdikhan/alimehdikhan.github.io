import localFont from 'next/font/local';
import '../styles/globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { RESUME } from '../data/resume';

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
  return (
    <html lang="en" className={`${manrope.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
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
