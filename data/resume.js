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
    'B.Tech Computer Science graduate (July 2026) who builds apps on language models and NLP, plus the FastAPI backends that serve them. The AI Pronunciation Coach runs on Hugging Face Spaces. Currently a junior software developer at IMAPRO, with Google Cloud skill badges in Vertex AI, Gemini and Imagen.',

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
        'An app that listens to spoken English and scores the pronunciation of each word. Whisper transcribes the audio, and a custom engine built on Epitran pulls out the IPA phonemes.',
      features:
        'A FastAPI pipeline scores the audio in under a second. An LLM then turns the raw phoneme scores into feedback a learner can follow. It is containerised with Docker and runs on Hugging Face Spaces.',
      outcome: 'A public API that returns per-word pronunciation scores in under a second.',
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
        'Built in Keras, with data augmentation and a hyperparameter search to limit overfitting.',
      outcome: '90%+ accuracy, with F1 score tracked on held-out validation data.',
      tech: ['Python', 'TensorFlow', 'Keras', 'CNN'],
      github: 'https://github.com/alimehdikhan/Cancer-Detection-Model',
      demo: null,
      gradient: 'from-emerald-600 to-teal-500',
    },
  ],

  experience: [
    {
      role: 'Junior Software Developer, Web & Mobile',
      company: 'IMAPRO · Lucknow',
      date: 'Aug 2026 – Present',
      details: [
        'Build features across the stack: SvelteKit 5 on the frontend, Hono on the backend, SQLite for data.',
        'Leading the production app’s move to SvelteKit 5, rebuilding existing pages as reusable components so they are faster and more consistent.',
        'Build and test the booking flow from the interface down to the database.',
      ],
      align: 'left',
    },
    {
      role: 'Machine Learning Intern',
      company: 'GrasTech · Lucknow',
      date: 'Jun 2025 – Jul 2025',
      details: [
        'Built skin-cancer detection and diabetes prediction models in Python, using TensorFlow and Keras.',
        'Most of the work was feature engineering and hyperparameter tuning on messy real-world medical data.',
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
      'NestJS',
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
      detail: 'For keeping 95%+ attendance in every term.',
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
