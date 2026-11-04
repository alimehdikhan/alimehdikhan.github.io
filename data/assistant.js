/* What Byte, the site's AI assistant, knows beyond the page itself: Ali's
   own answers to the questions recruiters ask, and the detail from his
   résumé PDF that the page leaves out. Byte reads all of it, with
   data/resume.js, from /llms-full.txt, so to change what Byte says, edit this
   file and redeploy the site. Only facts Ali has stated belong here. */

export const ASSISTANT = {
  /* in his own words, as the About section puts it */
  quote:
    'I like the whole path from a research model to a tool someone uses: training it, serving it from a FastAPI backend and building the interface.',

  focus: ['Speech and NLP models', 'LLM apps and RAG', 'FastAPI and Node.js backends', 'Full-stack web apps'],

  /* Recruiter questions, answered by Ali in a line or two. The page shows
     them ("Questions recruiters ask", components/Faq.js) and describes them
     to search and answer engines as a FAQPage (app/layout.js); Byte knows
     them too. */
  faq: [
    {
      q: 'Who is Ali Mehdi Khan?',
      a: 'Ali Mehdi Khan is an AI/ML and Python developer in Lucknow, India, and a junior software developer at IMAPRO. He finished his B.Tech in Computer Science in July 2026 and builds AI products end to end: the model, the Python API that serves it and the app on top.',
    },
    { q: 'Is he open to work?', a: 'Yes: entry-level software engineering and AI/ML roles, plus freelance AI and web projects.' },
    { q: 'Where would he work, and how soon could he join?', a: 'Anywhere in India or abroad: he is open to relocating, and he can join immediately.' },
    {
      q: 'What has he built?',
      a: 'Vocaly AI, an English pronunciation coach that flags mispronounced sounds at 0.94 AUC against expert ratings; a skin lesion classifier that sorts dermoscopic images into seven types in about 20 ms per image on a CPU; and Byte, the AI assistant on his portfolio that answers recruiters’ questions.',
    },
    {
      q: 'What is his tech stack?',
      a: 'Python, FastAPI, PyTorch, TensorFlow and ONNX Runtime for AI; React, TypeScript, Next.js and SvelteKit for the web; Hono and SQLite at IMAPRO; Docker and Google Cloud to ship it.',
    },
    { q: 'Which languages does he speak?', a: 'English, Hindi and Urdu.' },
    { q: 'What salary does he expect?', a: 'He is happy to discuss that directly. Email him at ali973mehdi@gmail.com.' },
    { q: 'How do I reach him?', a: 'Email is the quickest: ali973mehdi@gmail.com. LinkedIn and phone work too.' },
  ],

  /* the résumé's detail on each piece of work, beyond what the page shows */
  details: [
    {
      about: 'Vocaly AI',
      points: [
        'A wav2vec 2.0 phoneme model scores every sound with alignment-free goodness-of-pronunciation (GOP) scoring, from an Interspeech 2024 paper; faster-whisper transcribes the speech.',
        'Validated against expert ratings on 500 held-out speechocean762 recordings, beating the Whisper-only baseline: sentence-score correlation from 0.51 to 0.70, fluency from -0.08 to 0.63, and 0.94 AUC for spotting mispronunciations.',
        'He exported the phoneme model from PyTorch to int8 ONNX and published it on the Hugging Face Hub; it scores a 4-second clip in about 1 second on a 4-core CPU.',
        'An LLM coaching layer (Groq, gpt-oss-120b) explains only the errors the scorer found, with output validation, caching and a rule-based fallback. He benchmarked reasoning effort: medium answers in about 2 s against 18 s, with no loss in quality.',
      ],
    },
    {
      about: 'IMAPRO',
      points: [
        'In the SvelteKit 5 migration he kept the backend API contract unchanged and checked every migrated route, with no regressions in the booking and data flows.',
        'He built responsive layouts and shared UI components so the app behaves the same on mobile and desktop.',
        'His stack at IMAPRO is SvelteKit 5, Hono and SQLite. His FastAPI and machine-learning work is in his own projects and his GRAStech internship.',
      ],
    },
  ],
};
