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

  /* facts the page states in its own words (hero, About, Contact), kept here
     as data too so the AI assistant can read them from /llms.txt */
  availability:
    'Looking for entry-level software engineering and AI/ML roles, and open to freelance AI and web projects. Email is the quickest way to reach him.',
  education: {
    degree: 'B.Tech in Computer Science and Engineering',
    school: 'Babu Banarasi Das University (BBDU), Lucknow',
    date: '2022 – 2026, completed July 2026',
  },
  volunteering: {
    role: 'Programming Instructor (volunteer)',
    org: 'Tech for Good, Lucknow',
    date: '2025',
    detail: 'Taught programming to 30+ underprivileged students over three months; each one built a first working application.',
  },

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
      title: 'Skin Lesion Classifier',
      tag: 'Skin Cancer Screening · Computer Vision',
      overview:
        'Trained on the 10,015 dermoscopic images of HAM10000, it sorts a photo of a mole or spot into one of seven lesion types, melanoma and basal cell carcinoma among them, with a calibrated confidence and a plain-language risk level. A research and teaching tool, not a diagnosis.',
      features:
        'An EfficientNet-B2, fine-tuned end to end in PyTorch on splits made by lesion rather than by image, so near-duplicate photos never leak into the test set. Class-weighted loss and checkpoints picked by balanced accuracy keep rare cancers from being drowned out by benign moles, and temperature scaling makes the confidence mean something. The model is exported to ONNX and served by a FastAPI service with a Redis cache, behind a React and TypeScript app, all in Docker.',
      outcome: 'Runs in about 20 ms per image on a plain CPU, so it needs no GPU to serve.',
      tech: ['Python', 'PyTorch', 'CNN', 'ONNX Runtime', 'FastAPI', 'React', 'TypeScript', 'Docker'],
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

  /* the open-source repo the "Star Vocaly" section asks visitors to star;
     the description is the repo's own, as GitHub shows it */
  starRepo: {
    path: 'alimehdikhan/A.I-Pronunciation-Coach',
    description:
      'Vocaly AI: an English pronunciation coach. Say a sentence and it marks each sound you got wrong, then shows you how to fix it. Also mock interviews, drills and a voice coach.',
    language: 'Python',
  },

  githubCommits: [
    { sha: '74b7066', message: "feat(web): the drills' record buttons use the lit disc" },
    { sha: 'df5f93a', message: "feat(web): the coach page's record buttons use the lit disc" },
    { sha: 'a867d4e', message: 'feat(web): a lit record disc for small record buttons' },
    { sha: 'ae3a9a4', message: 'feat(web): the coach cheers a great attempt and nods at the rest' },
    { sha: '0a3778e', message: 'feat(web): the coach says hello once a visit, nudges now and then, squishes when pressed' },
  ],
};
