import { RESUME } from './resume';

/* The case studies at /projects/<slug>: how each project was built, what was
   measured and where it falls short. Every figure comes from the project's
   own README or measurements; nothing here is rounded up. Body blocks are
   paragraphs (strings), { list }, { steps } and { table }. */

const vocaly = RESUME.projects.find((p) => p.slug === 'vocaly-ai');
const lesion = RESUME.projects.find((p) => p.slug === 'skin-lesion-classifier');

export const CASE_STUDIES = [
  {
    slug: 'vocaly-ai',
    project: 'Vocaly AI',
    tag: 'Speech & NLP',
    title: 'Vocaly AI: a pronunciation coach that hears every sound',
    seoTitle: 'Vocaly AI: pronunciation scoring case study',
    description:
      'How I built Vocaly AI, an English pronunciation coach: Whisper plus a wav2vec 2.0 phoneme model, 0.94 AUC against expert raters, served from FastAPI.',
    published: '2026-11-04',
    summary: [
      'Vocaly AI listens to you read a sentence and marks each sound that came out wrong, a "th" heard as "f" or a "v" heard as "w", then shows you how to fix it.',
      'I built all of it: the scoring pipeline, the FastAPI backend and the React app, which runs in Docker on Hugging Face Spaces. On 500 recordings it never saw, its sound check agrees with trained human raters at 0.94 AUC.',
    ],
    stats: [
      { value: '0.94', label: 'AUC for "was this sound wrong?" on 500 held-out recordings' },
      { value: '0.51 → 0.70', label: 'agreement with expert sentence scores, before and after' },
      { value: '−0.08 → 0.63', label: 'agreement on fluency, after fixing one rule' },
      { value: '~1 s', label: 'to score a four-second clip on a 4-core CPU' },
    ],
    links: [
      { label: 'Try the live demo', href: vocaly.demo, primary: true },
      { label: 'Code on GitHub', href: vocaly.github },
      { label: 'Phoneme model on Hugging Face', href: 'https://huggingface.co/Alimehdi973/wav2vec2-espeak-onnx-int8' },
    ],
    code: vocaly.github,
    demo: vocaly.demo,
    stack: ['Python', 'FastAPI', 'OpenAI Whisper', 'wav2vec 2.0', 'ONNX Runtime', 'scikit-learn', 'React', 'TypeScript', 'Docker', 'Hugging Face'],
    art: { src: '/assets/images/vocaly-logo.webp', alt: 'Vocaly AI', width: 640, height: 628, fit: 'logo' },
    og: '/assets/images/og-vocaly-ai.png',
    sections: [
      {
        heading: 'Why Whisper alone was not enough',
        body: [
          'Speech recognisers are built to understand you, not to grade you. Whisper hears "tink" and writes "think", because that is the likely word, so the slip a learner most needs to hear about disappears.',
          'The first version scored Whisper’s words against a pronunciation dictionary and nothing else. Measured against expert raters, it barely agreed with them: 0.51 on sentence scores, and slightly negative on fluency.',
        ],
      },
      {
        heading: 'How it scores a sentence',
        body: [
          {
            steps: [
              { title: 'Level the audio', text: 'The browser boosts quiet microphones and sends 16 kHz mono WAV, so the server rarely needs ffmpeg.' },
              {
                title: 'Find the words',
                text: 'Whisper large on Groq returns the words and their timings in a second or two, and local faster-whisper takes over if Groq is down. Voice activity detection drops the "Thank you." Whisper likes to invent over silence.',
              },
              {
                title: 'Hear the sounds',
                text: 'A wav2vec 2.0 phoneme model on ONNX Runtime gives the probability of every sound, every 20 ms. It has no language model, so it does not correct a wrong sound into the right word.',
              },
              {
                title: 'Judge each sound',
                text: 'Alignment-free goodness of pronunciation (Cao et al., Interspeech 2024) weighs each expected sound against every alternative. The strongest alternative becomes the diagnosis: /θ/ came out as /s/.',
              },
              {
                title: 'Score and explain',
                text: 'Words are aligned with a weighted edit distance, then the app gives four scores (pronunciation, fluency, clarity and completeness) and a coach card with one tip per slip.',
              },
            ],
          },
        ],
      },
      {
        heading: 'Checking it against people',
        body: [
          'I measured the scorer on speechocean762: 5,000 English sentences read by Mandarin speakers and rated by trained annotators per sentence, word and sound. The weights were fitted on its training split. These figures come from 500 test recordings the fitting never saw, as Pearson’s r with the human rating.',
          {
            table: {
              head: ['Test split, 500 recordings', 'Before', 'Now'],
              rows: [
                ['Sentence accuracy', '0.514', '0.651'],
                ['Sentence overall score', '0.507', '0.697'],
                ['Sentence fluency', '−0.084', '0.627'],
                ['Word accuracy', '0.422', '0.555'],
                ['"Was this sound wrong?" (AUC)', 'n/a', '0.939'],
              ],
            },
          },
          'Two changes did most of the work. The old fluency rule punished anyone over 180 words a minute, but the raters scored faster readers as more fluent, so I fitted the curve to them. And when Whisper reported a word as missing but its sounds were there, the word is now scored from the sounds instead of getting zero. That alone moved word accuracy from 0.398 to 0.555.',
        ],
      },
      {
        heading: 'Where it still falls short',
        body: [
          'Only about 4% of the sounds in that data are rated wrong, which makes this a rare-event problem. At the threshold the app uses, about two flagged sounds in five are real slips (0.41 precision), and many slips go unflagged.',
          'The phoneme model also leans toward the sound you meant to make. When a synthetic voice made twelve deliberate substitutions inside full sentences, half were reported. Spoken alone, "think" and "sink" separate cleanly; inside a familiar phrase, "berry" read as "very" came back clean. A model fine-tuned on non-native speech is the next step.',
        ],
      },
      {
        heading: 'Making it fair for Indian speakers',
        body: [
          'The curve that turns sound evidence into "chance it is clean" was fitted on Mandarin speakers. On L2-ARCTIC, a corpus of non-native English with every sound marked by annotators, it flagged under 1% of a Hindi speaker’s sounds and caught 4% of the real slips.',
          'So speakers of Hindi, Urdu, Bengali, Gujarati, Marathi, Punjabi, Tamil and Telugu get a trained sound model instead: logistic regression over the sound’s evidence, how long it lasted, the strongest competing sound and how clean its neighbours were. Every candidate also had to pass a native check set, 82 sentences read by four native voices, without flagging more than 2% of correct speech.',
          {
            table: {
              head: ['Held-out Hindi speaker', 'Default curve', 'Sound model'],
              rows: [
                ['"Was this sound wrong?" (AUC)', '0.602', '0.776'],
                ['Real slips flagged', '4%', '13%'],
                ['Flags that are real slips', '39%', '45%'],
              ],
            },
          },
          'It catches three times as many of the slips the annotators heard, and its flags are right more often. The whole model is 16 KB of weights run with NumPy, so it adds no noticeable time.',
        ],
      },
      {
        heading: 'A coach that only explains real mistakes',
        body: [
          'Each attempt ends with a coach card. An LLM (gpt-oss-120b on Groq) writes the wording, but only for the slips the scorer actually found, so it cannot invent problems. Its output is validated and cached, and a rule-based coach takes over when it is unavailable.',
          'I benchmarked reasoning effort for it: medium answered in about 2 seconds against 18 for the slower setting, with no gain in quality.',
        ],
      },
      {
        heading: 'Shipping it on a small CPU',
        body: [
          {
            list: [
              'I exported the phoneme model from PyTorch to int8 ONNX (355 MB) and published it on the Hugging Face Hub. A four-second clip takes about a second on a 4-core CPU.',
              'FastAPI puts the heavy work behind a bounded queue, so a burst of requests waits its turn instead of failing.',
              'A multi-stage Docker build runs on Hugging Face Spaces, with PostgreSQL for history in production and SQLite locally.',
              'The frontend is React 19 with TypeScript and Vite, with a WebGL orb that follows the live audio.',
            ],
          },
        ],
      },
      {
        heading: 'More than a score',
        body: [
          'Around the scorer is a full practice app: mock interviews in eight formats that run hands-free, minimal-pair drills built from the sounds you miss most, a library of all 41 American English sounds, a spoken coach on Gemini Live, and progress tracking with before-and-after recordings.',
        ],
      },
    ],
  },

  {
    slug: 'skin-lesion-classifier',
    project: 'Skin Lesion Classifier',
    tag: 'Computer Vision · Medical Imaging',
    title: 'A skin lesion classifier built to be honest about its accuracy',
    seoTitle: 'Skin Lesion Classifier: HAM10000 case study',
    description:
      'How I rebuilt a skin cancer notebook into a seven-class HAM10000 classifier: leak-free splits, calibrated confidence and about 20 ms per image on a CPU.',
    published: '2026-11-04',
    summary: [
      'The Skin Lesion Classifier sorts a dermoscopic photo of a mole or spot into one of the seven HAM10000 lesion types, melanoma and basal cell carcinoma among them, with a calibrated confidence and a plain-language risk level.',
      'I rebuilt it from a Keras notebook into three parts: a PyTorch training pipeline, a FastAPI service that runs the model with ONNX Runtime, and a React app. It is a research and teaching tool, not a diagnosis.',
    ],
    stats: [
      { value: '7', label: 'lesion types, learned from 10,015 dermoscopic images' },
      { value: '~20 ms', label: 'model time per image on a CPU' },
      { value: '~5 ms', label: 'for an image it has seen before, from the cache' },
      { value: '70 / 15 / 15', label: 'train, validation and test split, made by lesion' },
    ],
    links: [{ label: 'Code on GitHub', href: lesion.github, primary: true }],
    code: lesion.github,
    stack: ['Python', 'PyTorch', 'CNN', 'ONNX Runtime', 'FastAPI', 'React', 'TypeScript', 'Docker'],
    art: { src: '/assets/images/project-2.svg', alt: '', width: 800, height: 800, fit: 'art' },
    og: '/assets/images/og-skin-lesion-classifier.png',
    sections: [
      {
        heading: 'What was wrong with the first version',
        body: [
          'The project started as a Keras notebook: a frozen MobileNetV2 with a small head on top. Going back to it, I found its numbers could not be trusted.',
          {
            list: [
              'Data leakage. HAM10000 has 10,015 images of about 7,470 lesions, and splitting by image put photos of the same lesion in both training and validation.',
              'A broken evaluation. The validation generator shuffled, so predictions were compared with labels in a different order.',
              'Augmented validation images, and class weights dropped from the main training run, so plain accuracy could hide poor melanoma detection.',
            ],
          },
          'So I treated the rebuild as a chance to get one number I could defend, rather than a bigger one.',
        ],
      },
      {
        heading: 'Splitting by lesion, not by photo',
        body: [
          'The new pipeline splits with StratifiedGroupKFold on the lesion ID: 70% for training, 15% for validation and 15% for testing, stratified by diagnosis. No lesion appears in two splits, the split files are saved so any run can be reproduced, and the test set is touched once, at the end.',
        ],
      },
      {
        heading: 'Training for the rare cancers',
        body: [
          'About 67% of the images are benign moles, so a model can look accurate while missing melanoma. Three choices push back on that:',
          {
            list: [
              'Class-weighted cross-entropy (the inverse square root of each class’s frequency) with label smoothing.',
              'Checkpoints chosen by balanced accuracy, the mean recall over classes, so a rare cancer counts as much as a common mole.',
              'Augmentation suited to dermoscopy, where a lesion has no "up": random resized crops, horizontal and vertical flips, full rotation and mild colour jitter.',
            ],
          },
          'The backbone is an ImageNet-pretrained EfficientNet-B2 at 256 px, fine-tuned end to end with AdamW, a warm-up then cosine decay, mixed precision, gradient clipping, an exponential moving average of the weights and early stopping. At inference, predictions are averaged over flipped views.',
        ],
      },
      {
        heading: 'Confidence that means something',
        body: [
          'A medical interface should not say 95% when it means 70%. After training, temperature scaling is fitted on the validation set, so a reported 80% is right about 80% of the time.',
          'The API adds up the probabilities of melanoma, basal cell carcinoma and actinic keratosis into one malignant probability and turns it into a risk level. When the top class is under 50%, the app says the model is unsure instead of naming a type.',
        ],
      },
      {
        heading: 'Fast on an old CPU',
        body: [
          'I wanted it to run without a GPU, so I benchmarked backbones in ONNX Runtime on my development machine, a 2015 quad-core Intel Core i5-6500T throttled to about 0.8 GHz during the tests. The numbers moved with the machine’s load, so treat them as rough.',
          {
            table: {
              head: ['Backbone, one 224 px image, 4 threads', 'Median'],
              rows: [
                ['ConvNeXt-Tiny', '150–600 ms'],
                ['ResNet-50', '48 ms'],
                ['EfficientNet-B2 (chosen)', '19 ms'],
                ['EfficientNet-B0', '12 ms'],
              ],
            },
          },
          'Through the whole API, with decoding and preprocessing, one view takes about 55 ms and the default two flipped views about 140 ms. A repeat upload comes back from the cache in about 5 ms. ONNX Runtime also keeps the runtime near 50 MB, where PyTorch would need about 2 GB.',
        ],
      },
      {
        heading: 'Built to be served',
        body: [
          {
            list: [
              'Results are cached by model version and the SHA-256 of the image, first in memory and then in Redis, and identical uploads in flight share one inference.',
              'Uploads are checked for type and size (JPEG, PNG or WebP up to 10 MB), with decompression-bomb protection and EXIF orientation handled.',
              'Each exported model carries its version, preprocessing, class order, calibration temperature and test metrics, and a test checks that the API preprocesses images exactly as training did.',
              'Docker Compose runs nginx (the static site and rate limiting), the API and Redis, and CI runs the API, ML and web tests on every push.',
            ],
          },
        ],
      },
      {
        heading: 'Its limits, stated plainly',
        body: [
          {
            list: [
              'HAM10000 is dermoscopic. Ordinary phone photos look different, and accuracy on them will be lower.',
              'There is no out-of-distribution check yet: a photo of a cat still gets a lesion label, though low confidence is flagged as uncertain.',
              'The dataset skews toward lighter skin and a European population, and performance on other groups has not been measured.',
              'HAM10000 is licensed CC BY-NC-SA 4.0, so models trained on it are for non-commercial use.',
            ],
          },
        ],
      },
    ],
  },

  {
    slug: 'byte',
    project: 'Byte',
    tag: 'LLM App · 3D · Edge',
    title: 'Byte: a 3D robot that answers recruiters’ questions about me',
    seoTitle: 'Byte: a 3D AI assistant on a static site',
    description:
      'How I built Byte, the 3D robot on my portfolio that answers recruiters from my own notes: three.js, a Cloudflare Worker and gpt-oss-120b on Groq.',
    published: '2026-11-04',
    summary: [
      'Byte is the robot in the corner of this site. Ask it anything about my work and it answers in a second or two, from the same notes that build the page. Paste a job description and it says how I fit, gaps included. Leave your email and it passes it to me with the conversation.',
      'The site is static, on GitHub Pages, so Byte comes in three pieces: a three.js scene in the page, a Cloudflare Worker that holds the API key, and gpt-oss-120b on Groq.',
    ],
    stats: [
      { value: '~1.5 s', label: 'for a typical full answer' },
      { value: '0 KB', label: 'of three.js in the first page load' },
      { value: '8 a minute', label: 'questions per visitor, so nobody can drain the quota' },
      { value: '1 list', label: 'of answers feeds the page, its structured data and Byte' },
    ],
    links: [{ label: 'Ask Byte', action: 'byte', primary: true }, { label: 'Code on GitHub', href: 'https://github.com/alimehdikhan/alimehdikhan.github.io' }],
    code: 'https://github.com/alimehdikhan/alimehdikhan.github.io',
    stack: ['Three.js', 'React', 'Next.js', 'Cloudflare Workers', 'Groq', 'Prompt Engineering', 'LLM Evaluation'],
    art: { src: '/assets/images/byte.webp', alt: 'Byte, a small white robot with a glowing lime face, headphone ears and an antenna', width: 720, height: 720, fit: 'render' },
    og: '/assets/images/og-byte.png',
    sections: [
      {
        heading: 'Why a robot',
        body: [
          'Recruiters skim, and they ask the same few things: is he open to work, where and how soon could he join, what has he built. Byte answers those in a second, at any hour, without anyone opening my résumé. A small robot that waves, plays peekaboo and naps when ignored also gets noticed in a way a contact form does not.',
        ],
      },
      {
        heading: 'Answers that stay true',
        body: [
          'Byte only knows what this site says. When the site is built it writes /llms-full.txt from the same data as the page; the Worker fetches that, keeps it for ten minutes and puts it in front of the model with a short set of rules:',
          {
            list: [
              'Use only facts from the profile, in its own words, and add no praise of your own.',
              'Keep each job and project separate. An early answer credited FastAPI to my day job, where the stack is SvelteKit, Hono and SQLite; one rule and one line in my notes fixed it.',
              'If the profile does not say, say so and point to my email. Salary is for a direct conversation.',
              'Reply in the language and script the visitor writes in, Hinglish included.',
            ],
          },
          'Pasting a job description switches Byte into matching: a one-line verdict, up to four facts that fit and a plain list of what my profile does not show. Tested on a role that asked for AWS, Kubernetes and MLflow, it named all three as gaps.',
        ],
      },
      {
        heading: 'A static site with a secret',
        body: [
          'GitHub Pages cannot hold an API key, so a Cloudflare Worker sits between the page and the model. It keeps the Groq key as an encrypted secret, answers only requests from this site, limits each visitor to eight questions a minute and streams the answer back as plain text.',
          'Groq’s free tier allows each model 8,000 tokens a minute, about four questions with my profile attached. When gpt-oss-120b is busy, the Worker spills over to gpt-oss-20b, which has its own allowance. I tried medium reasoning effort for everything, and it sometimes spent the whole token budget thinking and returned nothing, so ordinary questions use low effort and pasted job descriptions get medium.',
        ],
      },
      {
        heading: 'A robot made of primitives',
        body: [
          'Byte is a few dozen pieces built from three.js primitives (rounded boxes, capsules, tori and sprites), so there is no model file to download. Its face is a glass screen with glowing eyes, it floats on a lime jet and its head follows your cursor.',
          'Every 9 to 15 seconds it puts on a little show: a dance, a peekaboo below the screen edge, a stretch and a yawn, an idea with its antenna flaring. It wears heart eyes when someone downloads my résumé, winks at a copied email, points at the section a speech bubble is about and dozes off after a minute alone. Without WebGL, or with data saver on, a drawn SVG twin stands in, and reduced motion gets still poses.',
        ],
      },
      {
        heading: 'Keeping the page fast',
        body: [
          'My first version loaded three.js as soon as the page was idle. On a throttled mobile Lighthouse run that meant one 3.9-second main-thread task while the shaders compiled, and the performance score fell from 73 to 66.',
          'Now Byte waits for the visitor’s first scroll, touch, mouse move or key press, sets itself up in steps that hand the main thread back, and compiles its shaders with compileAsync. three.js is no longer in the first load at all, the score is back at 74 to 75 and the largest paint lands in 1.1 seconds.',
        ],
      },
      {
        heading: 'Turning attention into a conversation',
        body: [
          {
            list: [
              'Speech bubbles drop one recruiter-worthy fact at a time ("Psst! Ali can join immediately."), a few per visit, and one dismiss silences them.',
              'Tapping a bubble opens the chat with its question already asked.',
              'After a recruiter-style question or two, Byte offers to pass the visitor’s email to me with the transcript, through the same inbox as the contact form.',
              'Free counters record chats opened, first questions, pasted job descriptions and contacts left, so I can see which nudges work.',
            ],
          },
        ],
      },
    ],
  },
];

export const caseStudy = (slug) => CASE_STUDIES.find((s) => s.slug === slug);
