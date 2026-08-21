/** Resume-verified content — single source of truth aligned with the current resume PDF */

export const RESUME = {
  name: 'Ali Mehdi Khan',
  location: 'Lucknow, Uttar Pradesh, India',
  phone: '+91-9569042552',
  email: 'ali973mehdi@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ali-mehdi-khan-b4062b2a3',
  github: 'https://github.com/alimehdikhan',
  portfolio: 'https://alimehdikhan.github.io',
  resumePath: '/assets/resume/AliMehdiKhan Resume Optimized.pdf',
  resumeDownloadName: 'AliMehdiKhan_Resume.pdf',

  summary:
    'Final-year B.Tech CS student (2026) who builds AI products end to end — LLM apps, NLP pipelines, and the FastAPI backends behind them. Shipped a Whisper-based pronunciation coach to Hugging Face Spaces, and currently working as a junior developer at IMAPRO. Google Cloud certified in Vertex AI, Gemini, and Imagen.',

  roles: ['Software Engineer', 'AI/ML Developer', 'Python Developer'],

  certifications: [
    {
      title: 'Technology Job Simulation',
      issuer: 'Deloitte via Forage',
      date: 'July 2025',
    },
    {
      title: 'Build Real-World AI Apps with Gemini & Imagen',
      issuer: 'Google Cloud Skill Badge',
      date: '2025',
    },
    {
      title: 'Machine Learning with Python',
      issuer: 'freeCodeCamp',
      date: 'July 2025',
    },
    {
      title: 'Prompt Design in Vertex AI',
      issuer: 'Google Cloud Skill Badge',
      date: '2025',
    },
  ],

  projects: [
    {
      title: 'AI Pronunciation Coach',
      tag: 'AI / NLP / API',
      overview:
        'A coaching app that listens to spoken English and scores pronunciation word by word — Whisper handles transcription, a custom Epitran engine extracts the IPA phonemes.',
      features:
        'The FastAPI pipeline scores audio in under a second, and LLM-generated feedback turns raw phoneme scores into advice a learner can actually use. Dockerized, running on Hugging Face Spaces.',
      outcome: 'Live public API serving per-word pronunciation scores with sub-second responses.',
      tech: ['Python', 'FastAPI', 'OpenAI Whisper', 'Epitran', 'Docker', 'Hugging Face'],
      github: 'https://github.com/alimehdikhan/A.I-Pronunciation-Coach',
      demo: 'https://huggingface.co/spaces/Alimehdi973/ai-pronunciation-coach',
      gradient: 'from-indigo-600 to-blue-500',
    },
    {
      title: 'Cancer Detection System',
      tag: 'Machine Learning',
      overview:
        'A binary CNN classifier trained on real medical imaging datasets to flag early-stage cancer.',
      features:
        'Keras architectures with data augmentation and a systematic hyperparameter search to keep overfitting in check.',
      outcome: '90%+ accuracy, with F1 tracked on held-out validation sets.',
      tech: ['Python', 'TensorFlow', 'Keras', 'CNN'],
      github: 'https://github.com/alimehdikhan/Cancer-Detection-Model',
      demo: null,
      gradient: 'from-emerald-600 to-teal-500',
    },
  ],

  experience: [
    {
      role: 'Junior Developer — Web & Mobile',
      company: 'IMAPRO · Lucknow',
      date: 'Aug 2026 – Present',
      details: [
        'Build features across the full stack using SvelteKit 5 for the frontend, Hono for the backend, and SQLite for the database.',
        'Leading the production app’s migration to SvelteKit 5, rebuilding existing pages as reusable components to improve speed and consistency.',
        'Develop and test booking flows end to end, covering the interface, API, backend logic, and database.',
      ],
      align: 'left',
    },
    {
      role: 'Machine Learning Intern',
      company: 'GrasTech · Lucknow',
      date: 'Jun 2025 – Jul 2025',
      details: [
        'Built skin-cancer detection and diabetes prediction models in Python with TensorFlow and Keras.',
        'Most of the work was feature engineering and hyperparameter tuning against messy real-world medical data.',
      ],
      align: 'right',
    },
  ],

  skills: {
    technical: [
      'Python',
      'FastAPI',
      'OpenAI Whisper',
      'Prompt Engineering',
      'LangChain',
      'LangGraph',
      'RAG Pipelines',
      'FAISS',
      'TensorFlow',
      'Keras',
      'NLP',
      'Docker',
      'SvelteKit',
      'Next.js',
      'Hono',
      'Google Cloud',
      'Git',
      'SQL',
      'Java',
      'JavaScript',
    ],
    soft: [
      'Communication',
      'Problem Solving',
      'Team Collaboration',
      'Adaptability',
      'Time Management',
    ],
  },

  awards: [
    {
      title: 'Exemplary Discipline Award',
      detail: 'Maintained 95%+ attendance across all academic terms.',
    },
  ],

  githubStats: {
    publicRepos: 12,
    primaryLang: 'Python',
    focusArea: 'AI/ML',
  },

  githubCommits: [
    { sha: 'dc61b1e', message: 'ci: fix ruff linting errors to resolve github actions failure' },
    { sha: 'b08dc84', message: 'ci: fix module not found error in pytest by setting PYTHONPATH' },
    { sha: '1deab29', message: 'docs: fix database env var name to match backend code' },
    { sha: '08f6687', message: 'docs: update live demo link' },
    { sha: '4460d4e', message: 'feat: complete AI Pronunciation Tutor upgrade with LFS tracking' },
  ],
};
