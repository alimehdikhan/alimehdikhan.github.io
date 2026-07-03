/** Resume-verified content — single source of truth aligned with AliMehdiKhan Resume Optimized.pdf */

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
    'B.Tech Computer Science graduate (2026) skilled in Python, Java, Machine Learning, and AI application development. Google Cloud and Deloitte certified. Seeking an entry-level Software Engineering or AI/ML role to deliver impactful, data-driven solutions.',

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
        'AI pronunciation coaching platform using OpenAI Whisper and NLP for spoken English evaluation.',
      features:
        'Low-latency audio processing and scoring pipelines built with FastAPI for real-time spoken English feedback.',
      outcome: 'Delivers diagnostic pronunciation metrics through a production-style API pipeline.',
      tech: ['FastAPI', 'Python', 'OpenAI Whisper', 'NLP', 'REST APIs'],
      github: 'https://github.com/alimehdikhan/A.I-Pronunciation-Coach',
      demo: 'https://huggingface.co/spaces/Alimehdi973/ai-pronunciation-coach',
      gradient: 'from-indigo-600 to-blue-500',
    },
    {
      title: 'Cancer Detection System',
      tag: 'Machine Learning',
      overview:
        'Binary classification model trained on real-world medical datasets for early-stage cancer prediction.',
      features:
        'Keras deep learning architectures with supervised learning, feature engineering, and hyperparameter tuning.',
      outcome: 'Achieved 90%+ accuracy for early-stage cancer prediction.',
      tech: ['TensorFlow', 'Keras', 'Python', 'Machine Learning'],
      github: 'https://github.com/alimehdikhan/Cancer-Detection-Model',
      demo: null,
      gradient: 'from-emerald-600 to-teal-500',
    },
  ],

  experience: [
    {
      role: 'Machine Learning Intern',
      company: 'BBD University · Lucknow',
      date: 'Jun 2025 – Jul 2025',
      details: [
        'Built skin cancer detection and diabetes prediction models using supervised learning and deep learning in Python.',
        'Applied feature engineering and hyperparameter tuning to maximize model accuracy on medical datasets.',
      ],
      align: 'left',
    },
    {
      role: 'Volunteer',
      company: 'Tech for Good',
      date: '3 months',
      details: [
        'Delivered programming training to 30+ underprivileged students over 3 months.',
        'Improved digital literacy and enabled participants to build their first functional applications.',
      ],
      align: 'right',
    },
  ],

  skills: {
    technical: [
      'Python',
      'Java',
      'C',
      'C++',
      'JavaScript',
      'SQL',
      'FastAPI',
      'TensorFlow',
      'Keras',
      'Git',
      'GitHub',
      'REST APIs',
      'Machine Learning',
      'NLP',
      'HTML',
      'CSS',
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
      detail: 'Maintained 95%+ attendance across all academic terms, demonstrating reliability and commitment.',
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