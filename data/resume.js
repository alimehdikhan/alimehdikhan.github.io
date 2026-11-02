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
    'Computer Science graduate (July 2026) and junior software developer at IMAPRO who builds AI products end to end: the model, the Python API that serves it and the app on top. Vocaly AI, his English pronunciation coach, runs on Hugging Face Spaces. Google Cloud skill badges in Vertex AI, Gemini and Imagen.',

  roles: ['Software Engineer', 'AI/ML Engineer', 'Full-Stack Developer', 'Python Developer'],

  certifications: [
    {
      /* the photographed certificate; featured as the widest card */
      title: 'Project-based Summer Training in Machine Learning',
      issuer: 'GRAStech',
      date: 'July 2025',
      image: 'grastech-machine-learning',
      featured: true,
      detail: 'Held at BBD University, Lucknow, from 24 June to 31 July 2025. Certificate no. GRAS/PBT/ML/1220432084.',
    },
    {
      title: 'Technology Job Simulation',
      issuer: 'Deloitte via Forage',
      date: 'July 2025',
      image: 'deloitte-technology-job-simulation',
      verify:
        'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/9PBTqmSxAf6zZTseP/udmxiyHeqYQLkTPvf_9PBTqmSxAf6zZTseP_KzLDtoE8E3EyhFYQv_1753301699579_completion_certificate.pdf',
    },
    {
      title: 'Build Real-World AI Apps with Gemini & Imagen',
      issuer: 'Google Cloud Skill Badge',
      date: 'July 2025',
      image: 'google-gemini-imagen',
      verify: 'https://www.credly.com/badges/38ba1161-84d4-4975-8972-b633b389f8cd',
    },
    {
      title: 'Machine Learning with Python',
      issuer: 'freeCodeCamp',
      date: 'July 2025',
      image: 'freecodecamp-machine-learning-python',
      verify: 'https://www.freecodecamp.org/certification/alimehdikhan/machine-learning-with-python-v7',
    },
    {
      title: 'Prompt Design in Vertex AI',
      issuer: 'Google Cloud Skill Badge',
      date: 'July 2025',
      image: 'google-vertex-prompt-design',
      verify: 'https://www.credly.com/badges/7b347535-2bb6-419f-b130-1019f9a9ed38',
    },
  ],

  projects: [
    {
      title: 'Vocaly AI',
      tag: 'AI Pronunciation Coach · Speech & NLP',
      overview:
        'An English pronunciation coach. Say a sentence and it marks every sound that came out wrong (a "th" heard as "f", a "v" heard as "w"), then shows how to fix it. It also runs mock interviews, minimal-pair drills and a spoken coach.',
      features:
        'Whisper on Groq transcribes the speech, with faster-whisper as a fallback, while a wav2vec 2.0 phoneme model on ONNX Runtime scores each sound against the target sentence. A FastAPI backend serves a React and TypeScript app, coaching tips come from Groq and Gemini Live, and it runs in Docker on Hugging Face Spaces.',
      outcome: 'Flags mispronounced sounds at 0.94 AUC against expert ratings on the speechocean762 test set.',
      tech: ['Python', 'FastAPI', 'OpenAI Whisper', 'wav2vec 2.0', 'ONNX Runtime', 'React', 'TypeScript', 'Docker', 'Hugging Face'],
      github: 'https://github.com/alimehdikhan/A.I-Pronunciation-Coach',
      demo: 'https://alimehdi973-ai-pronunciation-coach.hf.space',
      /* the product's own mark (white wordmark, for the dark art panel) */
      logo: { src: '/assets/images/vocaly-logo.webp', width: 640, height: 628 },
      gradient: 'from-indigo-600 to-blue-500',
    },
    {
      title: 'Cancer Detection System',
      tag: 'Machine Learning',
      overview:
        'A binary CNN classifier trained on real medical imaging datasets to flag early-stage cancer.',
      features:
        'Built in Keras. Data augmentation and a hyperparameter search keep it from overfitting, and F1 is tracked next to accuracy so the rarer class is not ignored.',
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
      /* the company's own marks: imaPRO's white wordmark (from imapro.in) sits
         on a dark plate, GRAStech's colour logo (from grastech.in) on white */
      logo: { src: '/assets/logos/imapro.svg', width: 159, height: 36, plate: 'dark' },
      details: [
        'Lead the production app’s move to SvelteKit 5, rebuilding its pages as reusable components that load faster and behave the same everywhere.',
        'Build and test the booking flow end to end, from the interface down to the database.',
        'Ship features across the stack: SvelteKit 5 on the frontend, Hono APIs on the backend, SQLite for data.',
      ],
      align: 'left',
    },
    {
      role: 'Machine Learning Intern',
      company: 'GRAStech · Lucknow',
      date: 'Jun 2025 – Jul 2025',
      logo: { src: '/assets/logos/grastech.webp', width: 400, height: 86, plate: 'light' },
      details: [
        'Built a skin-cancer detection model and a diabetes prediction model in Python with TensorFlow and Keras.',
        'Spent most of the time on feature engineering and hyperparameter tuning, getting real-world medical data into shape.',
      ],
      align: 'right',
    },
  ],

  skills: {
    /* the headline stack (tech marquee and structured data): the résumé's
       list, then the additions from the GitHub profile README. The Skills
       section lists the full groups. */
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
      'TypeScript',
      'React',
      'Node.js',
      'PyTorch',
      'Hugging Face',
      'Gemini',
      'PostgreSQL',
      'Tailwind CSS',
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
    publicRepos: 17,
    primaryLang: 'TypeScript',
    focusArea: 'AI/ML',
  },

  githubCommits: [
    { sha: '74b7066', message: "feat(web): the drills' record buttons use the lit disc" },
    { sha: 'df5f93a', message: "feat(web): the coach page's record buttons use the lit disc" },
    { sha: 'a867d4e', message: 'feat(web): a lit record disc for small record buttons' },
    { sha: 'ae3a9a4', message: 'feat(web): the coach cheers a great attempt and nods at the rest' },
    { sha: '0a3778e', message: 'feat(web): the coach says hello once a visit, nudges now and then, squishes when pressed' },
  ],
};
