'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { ArrowDown, Check, Copy, RotateCcw, Send, Stop, X } from '@/components/ui/icons';
import { Button } from './ui/button';
import { Robot } from './Robot';
import { useReduce } from './fx/useReduce';
import { trackClick } from './fx/trackClick';
import { trackResumeDownload } from './fx/trackDownload';
import { DUR, EASE } from './fx/motion';
import { cn } from '@/lib/utils';
import { RESUME } from '../data/resume';

/* Byte, the site's AI assistant: a robot in the corner that greets visitors,
   puts on a little show every few seconds (a dance, a peekaboo, a stretch,
   an idea), drops recruiter-worthy facts in speech bubbles, pipes up as
   visitors reach the sections a recruiter cares about, reacts to what they
   do (a résumé download, a copied email, a fast scroll, a pat, a mouse
   coming close), dozes off when ignored, and opens a chat about Ali above
   itself. Byte is a
   three.js scene (fx/robot3d.js), loaded after the visitor's first move so
   it never weighs on the first load. Without WebGL or on a phone saving
   data, the drawn twin in Robot.js stands in; when the scene is just slow
   to arrive, the twin holds the corner and Byte spins into 3D the moment
   it is ready.

   The page is static, so questions go to a Cloudflare Worker (chat-worker/)
   that holds the Groq key, adds what /llms-full.txt says about Ali and streams
   the answer back as plain text. A recruiter can leave their email for Ali
   in the chat; it reaches him through the contact form's Formspree inbox.
   The conversation stays in this tab for the visit and nowhere else.

   Layer ownership, so Motion, CSS and three.js never move the same thing:
   the launcher's wrapper      entrance and exit (Motion)
   the 3D canvas               everything Byte does (three.js)
   .robot-lift / -hop / -float the drawn twin's hover, hop and idle (CSS) */

const ENDPOINT = process.env.NEXT_PUBLIC_CHAT_URL || 'https://portfolio-chat.ali973mehdi.workers.dev/chat';
/* the contact form's own inbox, so a lead lands in Ali's email */
const LEAD_ENDPOINT = 'https://formspree.io/f/xjgzwweq';
const MAX_QUESTION = 4000; // room for a pasted job description
const LONG = 600; // past this a message is a job description: clamped, and counted
const WAIT_FIRST = 20000; // no first word by then and it gives up
const WAIT_ALL = 60000;
/* the 3D canvas overhangs the launcher (64×72, or 84×96 from md up) by
   about 20px (26px) each side and above, so the hop, the wave, the
   particles and the antenna's glow have room. Drawn at the larger size;
   phones scale it down. */
const CANVAS = { width: 136, height: 127, fit: 96, foot: 5 };

const GREETING =
  "Hi, I'm Byte, Ali's robot assistant. I've read everything on this site about him, so ask away: his projects, skills, experience, or how to hire him. You can also paste a job description and I'll tell you how he fits.";
const STARTERS = ['Why should we hire Ali?', 'Sum up his résumé', 'Tell me about Vocaly AI', 'Is he open to work?'];
const MORE = [
  'What does he do at IMAPRO?',
  'Where would he work, and how soon?',
  'What are his strongest skills?',
  'What has he built in machine learning?',
  'Has he contributed to open source?',
  'Which certificates does he have?',
];
const JD_CHIP = 'Paste a job description';
const JD_START = 'Here is a job description. How well does Ali fit?\n\n';
const LEAD_CHIP = 'Ask Ali to get back to me';
/* a question like these is a recruiter's, so the "get back to you" card follows */
const HIRING = /\b(hir(e|ing)|interview|role|position|opening|job|vacanc|opportunit|recruit|salary|ctc|notice|join|offer|candidate)/i;
const FAILED = {
  busy: "I'm getting a lot of questions right now. Give me a few seconds and try again.",
  offline: 'You seem to be offline. Check the connection and try again.',
  timeout: 'That took too long, sorry. Try again?',
  error: `My circuits hiccuped. Try again, or email Ali at ${RESUME.email}.`,
};
const PAGE_SECTIONS = ['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'opensource', 'contact'];

/* What Byte says to catch a visitor's eye, what it does as it says it, and
   the question a tap on the bubble asks for them. The greeting comes with
   every page load; the rest once each a visit: up to four section nudges
   and six facts, 15s apart, quiet while the chat is open and for the rest
   of a page load once it has been opened. Reactions answer something the
   visitor did, so they skip the queue. A dismissed bubble silences bubbles
   for the visit; the robot's shows and reactions carry on. */
const NUDGES = {
  hello: { text: "Hi, I'm Byte! Ask me anything about Ali.", first: true },
  welcome: { text: 'Welcome back! Anything I can tell you about Ali?', first: true },
  skills: { text: 'Hiring for a stack? Ask me if Ali knows it.', point: 'skills-title' },
  experience: { text: 'Curious what Ali does at IMAPRO? I know.', ask: 'What does Ali do at IMAPRO?', point: 'experience-title' },
  projects: { text: 'Want the 20-second version of Vocaly AI?', ask: 'Give me the short version of Vocaly AI.', point: 'project-1' },
  idle: { text: 'Busy? I can sum up his résumé in three lines.', ask: 'Sum up his résumé in three lines.' },
  speed: { text: 'Speed-reading? I can give you the highlights in 10 seconds.', ask: 'Give me his highlights in three bullets.' },
  leaving: { text: "Before you go: Ali's open to entry-level AI roles.", ask: 'Is Ali open to work, and how do I reach him?', face: 'surprised' },
  resume: { text: 'Good pick! Want the three-line version too?', ask: 'Sum up his résumé in three lines.', face: 'love', emit: 'heart', reaction: true },
  copied: { text: 'Copied! Email is the quickest way to reach Ali.', face: 'wink', emit: 'spark', reaction: true },
  pet: { text: 'Aww, thank you! Anything I can tell you about Ali?', face: 'love', emit: 'heart', reaction: true },
  tickle: { text: 'Hehe, that tickles!', emit: 'spark', spin: true, reaction: true },
};
/* things worth a recruiter's tap, one at a time while they read */
const FACTS = [
  { text: 'Psst! Ali can join immediately.', ask: 'Is he open to work, and how soon can he join?' },
  { text: "Hiring? Paste a job description and I'll show you how Ali fits.", jd: true },
  { text: 'Vocaly AI spots mispronounced sounds at 0.94 AUC. Want the story?', ask: 'Tell me about Vocaly AI.' },
  { text: "Ali's open to roles anywhere in India or abroad.", ask: 'Where would he work, and how soon?' },
  { text: "Ali's code is merged into a popular open-source project. Ask me which!", ask: 'Has he contributed to open source?' },
  { text: 'Want his résumé in three lines? Tap me.', ask: 'Sum up his résumé in three lines.' },
];
FACTS.forEach((f, i) => (NUDGES[`fact${i}`] = { ...f, fact: true }));
const FACT_EVERY = 35000;
/* Byte's unprompted shows (fx/robot3d.js ACTS), one every 9-15s while the
   corner is quiet: the main thing that catches a wandering eye. Dance and
   peekaboo come up most. */
const SHOWS = ['dance', 'peek', 'stretch', 'idea', 'wave', 'scan', 'love', 'spin', 'dance', 'peek', 'jump'];
const SHOW_EVERY = 9000;
const SHOW_JITTER = 6000;
const NEAR = 220; // px: a mouse this close gets a wave
const SECTIONS = ['skills', 'experience', 'projects'];
const MAX_NUDGES = 4;
const GAP = 15000;
const SHOW_FOR = 7000;
const IDLE_AFTER = 35000;
const SLEEP_AFTER = 60000;
const ARRIVE_AFTER = 1500; // lets the hero's entrance finish first
const GIVE_UP_3D = 8000; // no move by then: the drawn robot comes, and spins into 3D later
const WELCOME_AFTER = 30 * 60 * 1000; // a visit after this long is a return

/* this visit (sessionStorage) and across visits (localStorage, only the
   time of the last one); private windows and blocked storage just forget */
const keep = (local) => ({
  get(key) {
    try {
      return JSON.parse((local ? localStorage : sessionStorage).getItem(`byte-${key}`));
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      (local ? localStorage : sessionStorage).setItem(`byte-${key}`, JSON.stringify(value));
    } catch {
      /* storage unavailable */
    }
  },
});
const visit = keep(false);
const memory = keep(true);

const fresh = () => [{ id: 0, role: 'assistant', content: GREETING, local: true }];

/* the section in the middle of the screen, so Byte knows what is in view */
function sectionInView() {
  const mid = window.innerHeight / 2;
  return (
    PAGE_SECTIONS.find((id) => {
      const r = document.getElementById(id)?.getBoundingClientRect();
      return r && r.top <= mid && r.bottom >= mid;
    }) ?? null
  );
}

/* Byte writes plain text with the odd **bold**, "- " list, Markdown link,
   URL or email address; this turns those into markup and nothing else */
const TOKEN = /(\*\*[^*\n]+\*\*|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"*]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function Inline({ text }) {
  return text.split(TOKEN).map((part, i) => {
    if (i % 2 === 0) return part;
    if (part.startsWith('**')) {
      return (
        <strong key={i} className="font-semibold">
          <Inline text={part.slice(2, -2)} />
        </strong>
      );
    }
    const md = part.match(/^\[([^\]]+)\]\((.+)\)$/);
    const href = md ? md[2] : part.startsWith('http') ? part : `mailto:${part}`;
    const label = md ? md[1] : part.replace(/^https?:\/\/(www\.)?/, '');
    const external = href.startsWith('http');
    return (
      <a
        key={i}
        href={href}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        className="font-medium text-link underline decoration-current/40 underline-offset-2 hover:decoration-current"
      >
        {label}
      </a>
    );
  });
}

function Rich({ text, caret }) {
  const blocks = [];
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    const item = t.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
    const content = (item ? item[1] : t).replace(/^#{1,6}\s+/, '');
    const last = blocks.at(-1);
    if (item && last?.items) last.items.push(content);
    else blocks.push(item ? { items: [content] } : { text: content });
  }
  return (
    <>
      {blocks.map((b, i) =>
        b.items ? (
          <ul key={i} className="my-1.5 list-disc space-y-1 pl-5 marker:text-muted-foreground">
            {b.items.map((it, j) => (
              <li key={j}>
                <Inline text={it} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className="[&:not(:first-child)]:mt-2">
            <Inline text={b.text} />
          </p>
        )
      )}
      {caret && <span className="byte-caret" aria-hidden="true" />}
    </>
  );
}

function Dots() {
  return (
    <span className="robot-dots flex h-6 items-center gap-1" role="img" aria-label="Byte is thinking">
      <span className="size-1.5 rounded-full bg-current" />
      <span className="size-1.5 rounded-full bg-current" />
      <span className="size-1.5 rounded-full bg-current" />
    </span>
  );
}

const small = 'inline-flex min-h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40 outline-none';

/* one line of the conversation; memoised, so a streaming answer re-renders
   only itself */
const Message = memo(function Message({ m, streaming, reduce, onRetry }) {
  const [copied, setCopied] = useState(false);
  const [whole, setWhole] = useState(false);
  const mine = m.role === 'user';
  const clamp = mine && m.content.length > LONG && !whole;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(m.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <motion.div
      className={cn('flex flex-col', mine ? 'items-end' : 'items-start')}
      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(6px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: DUR.fast, ease: EASE }}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed [overflow-wrap:anywhere]',
          mine ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-foreground/[0.06]',
          m.failed && !mine && 'text-muted-foreground'
        )}
      >
        {mine ? (
          <span className={cn('block whitespace-pre-wrap', clamp && 'line-clamp-5')}>{m.content}</span>
        ) : !m.content ? (
          <Dots />
        ) : (
          <Rich text={m.content} caret={streaming} />
        )}
      </div>
      {mine && m.content.length > LONG && (
        <button type="button" onClick={() => setWhole((w) => !w)} className={cn(small, 'mt-1')}>
          {whole ? 'Show less' : 'Show all'}
        </button>
      )}
      {!mine && !m.local && m.content && !streaming && (
        <div className="mt-1 flex items-center gap-1">
          {m.failed ? (
            <button type="button" onClick={() => onRetry(m.id)} className={small}>
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Try again
            </button>
          ) : (
            <button type="button" onClick={copy} className={small} aria-label={copied ? 'Answer copied' : 'Copy answer'}>
              {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
          {m.stopped && <span className="px-1 text-xs text-muted-foreground">Stopped</span>}
        </div>
      )}
    </motion.div>
  );
});

const field =
  'h-10 w-full min-w-0 rounded-xl border border-input bg-card px-3 text-base text-foreground transition-[border-color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/25 aria-invalid:border-destructive sm:text-sm';

/* "Want Ali to get back to you?": the recruiter's details and this chat go
   to Ali's inbox through the contact form's Formspree endpoint */
function LeadCard({ done, transcript, onSent, onDismiss }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', note: '', _gotcha: '' });
  const [state, setState] = useState('idle'); // 'sending', 'sent', 'error'
  const [error, setError] = useState('');
  const emailRef = useRef(null);
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (state === 'sending') return;
    const email = form.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address, like name@company.com.');
      emailRef.current?.focus();
      return;
    }
    setError('');
    setState('sending');
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...form,
          email,
          _subject: `Byte: ${form.company.trim() || form.name.trim() || email} would like to talk`,
          source: 'Byte, the portfolio chat',
          transcript: transcript(),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState('sent');
      onSent(email);
    } catch {
      setState('error');
    }
  };

  if (state === 'sent' || done) {
    return (
      <div className="rounded-2xl border border-border bg-foreground/[0.04] p-4 text-[15px]" role="status">
        <p className="font-semibold">Sent! Ali will get back to you.</p>
        <p className="mt-1 text-[13px] text-muted-foreground">He has your email and this chat.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-2xl border border-border bg-foreground/[0.04] p-4" aria-labelledby="byte-lead-title">
      <h3 id="byte-lead-title" className="text-[15px] font-semibold">
        Want Ali to get back to you?
      </h3>
      <p className="mt-1 text-[13px] text-muted-foreground">Leave your email and he&apos;ll reply. This chat goes with it, so he has the context.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="sr-only" htmlFor="byte-lead-name">
          Your name
        </label>
        <input id="byte-lead-name" name="name" value={form.name} onChange={set} placeholder="Your name" autoComplete="name" className={field} />
        <label className="sr-only" htmlFor="byte-lead-company">
          Company
        </label>
        <input id="byte-lead-company" name="company" value={form.company} onChange={set} placeholder="Company" autoComplete="organization" className={field} />
        <label className="sr-only" htmlFor="byte-lead-email">
          Your email (required)
        </label>
        <input
          id="byte-lead-email"
          ref={emailRef}
          name="email"
          type="email"
          inputMode="email"
          required
          value={form.email}
          onChange={set}
          placeholder="Work email"
          autoComplete="email"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'byte-lead-error' : undefined}
          className={cn(field, 'col-span-2')}
        />
        <label className="sr-only" htmlFor="byte-lead-note">
          A note for Ali (optional)
        </label>
        <textarea
          id="byte-lead-note"
          name="note"
          value={form.note}
          onChange={set}
          rows={2}
          placeholder="The role, or a good time to talk (optional)"
          className={cn(field, 'col-span-2 h-auto resize-none py-2')}
        />
        {/* Formspree's honeypot: people never see it, bots fill it in */}
        <input name="_gotcha" value={form._gotcha} onChange={set} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      </div>
      <p className="mt-2 min-h-4 text-[13px]" aria-live="polite">
        {error ? (
          <span id="byte-lead-error" className="text-destructive">
            {error}
          </span>
        ) : state === 'error' ? (
          <span className="text-destructive">That didn&apos;t send. Your details are still here, so try again.</span>
        ) : (
          <span className="text-muted-foreground">Only Ali sees this.</span>
        )}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <Button type="submit" size="sm" disabled={state === 'sending'} aria-busy={state === 'sending'}>
          <Send aria-hidden="true" />
          {state === 'sending' ? 'Sending…' : 'Send to Ali'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDismiss}>
          Not now
        </Button>
      </div>
    </form>
  );
}

export function ChatWidget() {
  const reduce = useReduce();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== 'light';
  const [mode, setMode] = useState('pending'); // '3d' or 'svg' once known
  const [timeUp, setTimeUp] = useState(false);
  const [shown, setShown] = useState(true);
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState(null);
  const [mood, setMood] = useState('idle');
  const [hop, setHop] = useState(0);
  const [sleeping, setSleeping] = useState(false);
  /* the conversation and the lead card's state survive a reload in this tab */
  const [messages, setMessages] = useState(() => visit.get('chat')?.messages ?? fresh());
  const [lead, setLead] = useState(() => visit.get('chat')?.lead ?? 'none'); // 'offered', 'sent', 'dismissed'
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // 'waiting', 'streaming', 'happy'
  const [announce, setAnnounce] = useState('');
  const [behind, setBehind] = useState(false); // scrolled up while new text arrives

  const bot = useRef(null);
  const launcherRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const stick = useRef(true);
  const messagesRef = useRef(messages);
  const nextId = useRef(Math.max(0, ...messages.map((m) => m.id)) + 1);
  const busy = useRef(false);
  const abort = useRef(null);
  const timers = useRef({});
  const returnFocus = useRef(false);
  const spun = useRef(false);
  const arrived = timeUp && mode !== 'pending';
  const live = useRef({});
  live.current = { ...live.current, open, shown: shown && arrived, mode, dark, reduce, sleeping, lead };

  const update = (next) => {
    messagesRef.current = next;
    setMessages(next);
  };
  const patch = (id, change) => update(messagesRef.current.map((m) => (m.id === id ? { ...m, ...change } : m)));
  const later = (name, fn, ms) => {
    clearTimeout(timers.current[name]);
    timers.current[name] = setTimeout(fn, ms);
  };

  /* ───── the robot's part ───── */

  const pointAt = (id) => {
    const el = document.getElementById(id);
    const me = launcherRef.current;
    if (!el || !me) return;
    const r = el.getBoundingClientRect();
    const b = me.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    bot.current?.pointAt(r.left + r.width / 2 - (b.left + b.width / 2), r.top + Math.min(r.height, 120) / 2 - (b.top + b.height / 2));
  };

  const act = (n) => {
    setHop((h) => h + 1);
    if (!n.reaction) {
      setMood('wave');
      later('mood', () => setMood('idle'), 2400);
    }
    if (n.face) bot.current?.express(n.face, 1.8);
    if (n.emit) bot.current?.emit(n.emit, 4);
    if (n.spin) bot.current?.spin();
    if (n.point) pointAt(n.point);
  };

  const say = (key) => {
    const n = NUDGES[key];
    const seen = visit.get('seen') || [];
    const { open: isOpen, shown: isShown, last = 0, engaged, greeted } = live.current;
    if (!n || !isShown || (n.first ? greeted : seen.includes(key))) return false;
    if (!n.reaction) {
      const same = seen.filter((k) => NUDGES[k] && !NUDGES[k].reaction && Boolean(NUDGES[k].fact) === Boolean(n.fact)).length;
      if (isOpen || engaged || same >= (n.fact ? FACTS.length : MAX_NUDGES) || (!n.first && Date.now() - last < GAP)) return false;
    }
    if (n.first) live.current.greeted = true;
    else visit.set('seen', [...seen, key]);
    act(n);
    if (isOpen || visit.get('quiet')) return false;
    live.current.last = Date.now();
    setBubble(key);
    later('bubble', () => setBubble(null), SHOW_FOR);
    return true;
  };

  /* one of Byte's shows; the drawn twin can only hop or wave */
  const perform = (name) => {
    if (bot.current) return bot.current.act(name);
    if (name === 'wave') {
      setMood('wave');
      later('mood', () => setMood('idle'), 2400);
    } else setHop((h) => h + 1);
    return true;
  };

  const wake = () => {
    setSleeping(false);
    bot.current?.express('surprised', 0.9);
    setHop((h) => h + 1);
  };

  /* ───── the conversation ───── */

  const offerLead = () => {
    if (messagesRef.current.some((m) => m.kind === 'lead')) return;
    update([...messagesRef.current, { id: nextId.current++, role: 'assistant', kind: 'lead', local: true, content: '' }]);
    setLead('offered');
  };

  const transcript = () =>
    messagesRef.current
      .filter((m) => !m.local && !m.failed && m.content)
      .slice(-16)
      .map((m) => `${m.role === 'user' ? 'Visitor' : 'Byte'}: ${m.content}`)
      .join('\n\n');

  const send = async (raw) => {
    const question = raw.trim().slice(0, MAX_QUESTION);
    if (!question || busy.current) return;
    busy.current = true;
    const asked = { id: nextId.current++, role: 'user', content: question };
    const reply = { id: nextId.current++, role: 'assistant', content: '' };
    const history = [...messagesRef.current, asked];
    update([...history, reply]);
    setInput('');
    setStatus('waiting');
    setBehind(false);
    stick.current = true;
    if (!history.some((m) => m.role === 'user' && m !== asked)) trackClick('chat-ask');
    if (question.length > LONG) trackClick('chat-jd');

    let answer = '';
    const ctrl = new AbortController();
    abort.current = ctrl;
    const give = (why) => {
      ctrl.why = why;
      ctrl.abort();
    };
    const firstWord = setTimeout(() => give('timeout'), WAIT_FIRST);
    const whole = setTimeout(() => give('timeout'), WAIT_ALL);
    try {
      if (!navigator.onLine) throw new Error('offline');
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.filter((m) => !m.local && !m.failed && m.content).map(({ role, content }) => ({ role, content })),
          page: sectionInView(),
        }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) throw new Error(res.status === 429 ? 'busy' : 'error');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        clearTimeout(firstWord);
        answer += decoder.decode(value, { stream: true });
        if (answer) {
          setStatus('streaming');
          patch(reply.id, { content: answer });
        }
      }
      if (!answer.trim()) throw new Error('error');
      setAnnounce(answer);
      setStatus('happy');
      later('happy', () => setStatus('idle'), 1400);
      /* a recruiter's question, a pasted job description or a second answer
         brings the "get back to you" card, once */
      const answered = messagesRef.current.filter((m) => m.role === 'user' && !m.failed).length;
      if (live.current.lead === 'none' && (HIRING.test(question) || question.length > LONG || answered >= 2)) later('lead', offerLead, 700);
    } catch (err) {
      const why = ctrl.why || (err.name === 'AbortError' ? 'gone' : err.message);
      if (why === 'gone') return; // the widget went away
      if (why === 'stop' || answer.trim()) {
        /* stopped, or the line dropped mid-answer: keep what arrived */
        patch(reply.id, { content: answer || '…', stopped: why === 'stop' });
      } else {
        /* neither the question nor the apology goes back to the model */
        patch(asked.id, { failed: true });
        patch(reply.id, { content: FAILED[why] || FAILED.error, failed: true, retry: question });
      }
      setStatus('idle');
    } finally {
      clearTimeout(firstWord);
      clearTimeout(whole);
      busy.current = false;
    }
  };

  const stop = () => {
    if (!abort.current) return;
    abort.current.why = 'stop';
    abort.current.abort();
  };

  /* stable, so the memoised messages don't re-render while one streams */
  const retry = useCallback((id) => {
    const list = messagesRef.current;
    const i = list.findIndex((m) => m.id === id);
    const question = list[i]?.retry;
    if (!question) return;
    update(list.filter((_, j) => j !== i && j !== i - 1));
    latest.current.send(question);
  }, []);

  const restart = () => {
    stop();
    update(fresh());
    setStatus('idle');
    setAnnounce('');
    if (lead === 'offered') setLead('none');
    inputRef.current?.focus({ preventScroll: true });
  };

  const pick = (chip) => {
    if (chip === JD_CHIP) {
      setInput(JD_START);
      requestAnimationFrame(() => {
        const box = inputRef.current;
        if (!box) return;
        box.focus();
        box.setSelectionRange(box.value.length, box.value.length);
      });
    } else if (chip === LEAD_CHIP) offerLead();
    else send(chip);
  };

  const openChat = (question) => {
    clearTimeout(timers.current.bubble);
    setBubble(null);
    live.current.engaged = true;
    trackClick('chat-open');
    if (live.current.sleeping) wake();
    setOpen(true);
    if (question) send(question);
  };

  const close = () => {
    returnFocus.current = true;
    setOpen(false);
  };

  /* ───── wiring ───── */

  /* the palette's "Ask Byte" row and the site's résumé and email actions */
  const latest = useRef({});
  latest.current = { openChat, say, wake, send, perform };
  useEffect(() => {
    const on = {
      'byte:open': () => latest.current.openChat(),
      'byte:resume': () => latest.current.say('resume'),
      'byte:copied': () => latest.current.say('copied'),
    };
    Object.entries(on).forEach(([name, fn]) => window.addEventListener(name, fn));
    return () => Object.entries(on).forEach(([name, fn]) => window.removeEventListener(name, fn));
  }, []);

  /* Byte in 3D waits for the visitor's first move (a scroll, a touch, the
     mouse, a key), then an idle moment, so three.js and its shaders never
     land on the page's first load, nor on a lab test that never moves.
     Data saver, no WebGL or a lost context keep the drawn robot; a visitor
     who hasn't moved after 8s gets the drawn one, which spins into 3D once
     they do. */
  const lost = useRef(false);
  useEffect(() => {
    let gone = false;
    let idle = 0;
    const drawn = () => setMode((m) => (m === 'pending' ? 'svg' : m));
    if (navigator.connection?.saveData) {
      drawn();
      return undefined;
    }
    const load = () =>
      import('./fx/robot3d')
        .then(({ createRobot }) =>
          gone || lost.current
            ? null
            : createRobot({
                ...CANVAS,
                dark: live.current.dark,
                reduce: live.current.reduce,
                onLost: () => {
                  lost.current = true;
                  bot.current?.dispose();
                  bot.current = null;
                  setMode('svg');
                },
              })
        )
        .then((robot) => {
          if (!robot) return;
          if (gone) {
            robot.dispose();
            return;
          }
          bot.current = robot;
          setMode('3d');
        })
        .catch(drawn);
    const FIRST_MOVES = ['pointermove', 'pointerdown', 'scroll', 'wheel', 'keydown', 'touchstart'];
    const begin = () => {
      FIRST_MOVES.forEach((e) => window.removeEventListener(e, begin));
      idle = window.requestIdleCallback ? window.requestIdleCallback(load, { timeout: 1500 }) : setTimeout(load, 200);
    };
    FIRST_MOVES.forEach((e) => window.addEventListener(e, begin, { passive: true }));
    const late = setTimeout(drawn, GIVE_UP_3D);
    return () => {
      gone = true;
      FIRST_MOVES.forEach((e) => window.removeEventListener(e, begin));
      clearTimeout(late);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
      bot.current?.dispose();
      bot.current = null;
    };
  }, []);

  /* the canvas joins the launcher whenever the launcher is on screen */
  const mountCanvas = useCallback((el) => {
    const robot = bot.current;
    if (!robot) return;
    if (!el) {
      robot.setActive(false);
      return;
    }
    el.appendChild(robot.canvas);
    robot.setActive(true);
    if (!spun.current) {
      spun.current = true;
      robot.arrive();
    }
  }, []);

  /* arrive once the hero has settled, then say hello, or welcome back */
  useEffect(() => {
    const t = timers.current;
    t.arrive = setTimeout(() => setTimeUp(true), ARRIVE_AFTER);
    return () => Object.values(t).forEach(clearTimeout);
  }, []);
  useEffect(() => {
    if (!arrived) return;
    const before = memory.get('last');
    memory.set('last', Date.now());
    const back = before && Date.now() - before > WELCOME_AFTER && !visit.get('seen');
    later('hello', () => latest.current.say(back ? 'welcome' : 'hello'), 1000);
  }, [arrived]);

  /* Byte steps aside for the contact section, as Back to top does, so it
     never sits over the form (unless the chat is open) */
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const contact = document.getElementById('contact');
      setShown(!contact || contact.getBoundingClientRect().top > window.innerHeight * 0.75);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  useEffect(() => {
    if (!shown) setBubble(null);
  }, [shown]);

  /* The nudges: a section crossing the middle of the screen, a quiet spell
     (then a nap), a fast scroll, and a mouse heading for the tab bar. */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && latest.current.say(e.target.id)),
      { rootMargin: '-45% 0px -45% 0px' }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    let active = Date.now();
    let jumped = 0; // a click or key just now: the scroll that follows may be a jump, not reading
    let lastFact = Date.now();
    let lastNear = 0;
    let measured = 0;
    const trail = [];
    const stir = () => {
      active = Date.now();
      if (live.current.sleeping) latest.current.wake();
    };
    /* a mouse coming close gets a wave, at most every 20s */
    const onNear = (e) => {
      stir();
      const now = Date.now();
      if (e.pointerType !== 'mouse' || now - measured < 150 || now - lastNear < 20000 || live.current.open || live.current.hovering) return;
      measured = now;
      const b = launcherRef.current?.getBoundingClientRect();
      if (b && Math.hypot(e.clientX - (b.left + b.width / 2), e.clientY - (b.top + b.height / 2)) < NEAR && latest.current.perform('wave')) lastNear = now;
    };
    const onJump = () => {
      jumped = Date.now();
      stir();
    };
    const onScroll = () => {
      stir();
      const now = Date.now();
      trail.push([now, window.scrollY]);
      while (trail.length && now - trail[0][0] > 3000) trail.shift();
      if (now - jumped > 1500 && Math.abs(window.scrollY - trail[0][1]) > window.innerHeight * 3) latest.current.say('speed');
    };
    const quiet = ['wheel', 'touchstart'];
    quiet.forEach((e) => window.addEventListener(e, stir, { passive: true }));
    window.addEventListener('pointermove', onNear, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointerdown', onJump, { passive: true });
    window.addEventListener('keydown', onJump);
    const idle = setInterval(() => {
      const now = Date.now();
      const still = now - active;
      const { open: isOpen, shown: isShown, sleeping: asleep } = live.current;
      if (still > IDLE_AFTER) latest.current.say('idle');
      if (still > SLEEP_AFTER && !isOpen && isShown && !asleep) setSleeping(true);
      /* the next fact, while the visitor is still about */
      if (now - lastFact > FACT_EVERY && still < IDLE_AFTER && !document.hidden) {
        const seen = visit.get('seen') || [];
        const next = FACTS.findIndex((_, i) => !seen.includes(`fact${i}`));
        if (next >= 0 && latest.current.say(`fact${next}`)) lastFact = now;
      }
    }, 5000);

    const since = Date.now();
    const onLeave = (e) => {
      if (!e.relatedTarget && e.clientY <= 0 && Date.now() - since > 10000) latest.current.say('leaving');
    };
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (fine) document.addEventListener('mouseout', onLeave);

    return () => {
      io.disconnect();
      quiet.forEach((e) => window.removeEventListener(e, stir));
      window.removeEventListener('pointermove', onNear);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onJump);
      window.removeEventListener('keydown', onJump);
      clearInterval(idle);
      if (fine) document.removeEventListener('mouseout', onLeave);
    };
  }, []);

  /* the shows: one every 9-15s while Byte is on screen, awake, not chatting
     and not under the mouse, never the same twice running */
  useEffect(() => {
    if (!arrived) return undefined;
    let timer = 0;
    let last = null;
    let first = true;
    const next = () => {
      const wait = first ? 5000 + Math.random() * 2000 : SHOW_EVERY + Math.random() * SHOW_JITTER;
      first = false;
      timer = setTimeout(() => {
        const { open: isOpen, shown: isShown, sleeping: asleep, reduce: still, hovering } = live.current;
        if (!isOpen && isShown && !asleep && !still && !hovering && !document.hidden) {
          const pool = SHOWS.filter((a) => a !== last);
          const name = pool[Math.floor(Math.random() * pool.length)];
          if (latest.current.perform(name)) last = name;
        }
        next();
      }, wait);
    };
    next();
    return () => clearTimeout(timer);
  }, [arrived]);

  /* a pat (the mouse rubbing back and forth over Byte) and a tickle (a
     flurry of clicks) */
  const pat = useRef({ x: null, dir: 0, flips: [] });
  const pokes = useRef([]);
  const onPet = (e) => {
    if (e.pointerType !== 'mouse') return;
    const p = pat.current;
    const now = Date.now();
    if (p.x !== null) {
      const dx = e.clientX - p.x;
      const dir = Math.sign(dx);
      if (Math.abs(dx) > 3 && dir && dir !== p.dir) {
        p.dir = dir;
        p.flips = [...p.flips.filter((t) => now - t < 1600), now];
        if (p.flips.length >= 6) {
          p.flips = [];
          trackClick('byte-pet');
          say('pet');
        }
      }
    }
    p.x = e.clientX;
  };
  const onPoke = () => {
    bot.current?.press();
    const now = Date.now();
    pokes.current = [...pokes.current.filter((t) => now - t < 1500), now];
    if (pokes.current.length >= 4) {
      pokes.current = [];
      trackClick('byte-tickle');
      say('tickle');
    }
  };

  /* on open, the cursor goes to the question box with a mouse (on a phone
     that would raise the keyboard uninvited); on close, back to Byte */
  useEffect(() => {
    if (open) {
      const fine = window.matchMedia('(pointer: fine)').matches;
      (fine ? inputRef.current : panelRef.current)?.focus({ preventScroll: true });
    } else if (returnFocus.current) {
      returnFocus.current = false;
      launcherRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  /* on a phone the chat is a full sheet, over the navbar: the page stops scrolling under it,
     and the sheet follows the visible viewport, so the keyboard never hides
     the question box */
  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 639px)').matches) return undefined;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = 'hidden';
    /* the sheet covers Byte, so it stops drawing until the chat closes */
    bot.current?.setActive(false);
    const vv = window.visualViewport;
    const fit = () => {
      const panel = panelRef.current;
      if (!panel || !vv) return;
      panel.style.setProperty('--byte-vh', `${vv.height}px`);
      panel.style.setProperty('--byte-top', `${vv.offsetTop}px`);
    };
    fit();
    vv?.addEventListener('resize', fit);
    vv?.addEventListener('scroll', fit);
    return () => {
      html.style.overflow = before;
      if (bot.current?.canvas.isConnected) bot.current.setActive(true);
      vv?.removeEventListener('resize', fit);
      vv?.removeEventListener('scroll', fit);
    };
  }, [open]);

  /* follow a streaming answer down, unless the reader has scrolled up to
     read, in which case a "new message" pill waits for them */
  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    if (stick.current) log.scrollTop = log.scrollHeight;
    else setBehind(true);
  }, [messages, open]);
  const onLogScroll = () => {
    const log = logRef.current;
    stick.current = log.scrollHeight - log.scrollTop - log.clientHeight < 40;
    if (stick.current) setBehind(false);
  };
  const toLatest = () => {
    const log = logRef.current;
    stick.current = true;
    setBehind(false);
    log?.scrollTo({ top: log.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  };

  /* the question box grows with what is typed, up to five lines */
  useEffect(() => {
    const box = inputRef.current;
    if (!box) return;
    box.style.height = 'auto';
    box.style.height = `${Math.min(box.scrollHeight, 132)}px`;
  }, [input, open]);

  /* the conversation is kept for this visit, between answers */
  useEffect(() => {
    if (status === 'waiting' || status === 'streaming') return;
    visit.set('chat', { messages: messages.filter((m) => m.content || m.kind === 'lead'), lead });
  }, [messages, lead, status]);

  useEffect(() => () => abort.current?.abort(), []);

  const waiting = status === 'waiting';
  const streaming = status === 'streaming';
  const working = waiting || streaming;
  /* in a conversation Byte acts it out; otherwise it waves with its nudges */
  const robotMood = open ? (waiting ? 'think' : streaming ? 'talk' : status === 'happy' ? 'happy' : 'idle') : mood;
  const nudge = !open && bubble && NUDGES[bubble];
  const asked = new Set(messages.filter((m) => m.role === 'user').map((m) => m.content));
  const last = messages.at(-1);
  const chips =
    working || last?.kind === 'lead' || last?.failed
      ? []
      : messages.length === 1
        ? [...STARTERS, JD_CHIP]
        : [...[...STARTERS, ...MORE].filter((q) => !asked.has(q)).slice(0, 2), lead === 'none' || lead === 'dismissed' ? LEAD_CHIP : JD_CHIP];
  const typed = input.length;

  useEffect(() => bot.current?.setMood(robotMood), [robotMood, mode]);
  useEffect(() => bot.current?.setTheme(dark), [dark, mode]);
  useEffect(() => bot.current?.setReduce(reduce), [reduce, mode]);
  useEffect(() => bot.current?.setSleep(sleeping), [sleeping, mode]);
  useEffect(() => {
    if (hop) bot.current?.hop();
  }, [hop]);

  return (
    <>
      <AnimatePresence>
        {arrived && (shown || open) && (
          <motion.div
            key="launcher"
            className="fixed right-4 bottom-4 z-40 md:right-6 md:bottom-6"
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(140%)' }}
            animate={{ opacity: 1, transform: 'translateY(0%)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(140%)' }}
            transition={reduce ? { duration: DUR.fast } : { type: 'spring', duration: 0.5, bounce: 0.3 }}
          >
            <AnimatePresence>
              {nudge && (
                /* pointer only: the button below carries the same invitation
                   for keyboards and screen readers */
                <motion.div
                  key={bubble}
                  aria-hidden="true"
                  onClick={() => {
                    trackClick(`nudge-${bubble}`);
                    openChat(nudge.ask);
                    if (nudge.jd) pick(JD_CHIP);
                  }}
                  className="absolute right-0 bottom-full mb-6 w-max max-w-[min(250px,calc(100vw-48px))] cursor-pointer rounded-2xl rounded-br-md border border-border bg-card py-3 pr-9 pl-4 text-sm leading-snug font-medium text-card-foreground shadow-lift"
                  style={{ transformOrigin: 'bottom right' }}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(6px) scale(0.95)' }}
                  animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(6px) scale(0.95)' }}
                  transition={{ duration: DUR.fast, ease: EASE }}
                >
                  {nudge.text}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      visit.set('quiet', true);
                      setBubble(null);
                    }}
                    className="absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              ref={launcherRef}
              type="button"
              onClick={() => (open ? close() : openChat())}
              onKeyDown={(e) => open && e.key === 'Escape' && close()}
              onPointerEnter={(e) => {
                if (e.pointerType !== 'mouse') return;
                live.current.hovering = true;
                bot.current?.setHover(true);
                if (!open && Date.now() - (live.current.hoverWave ?? 0) > 10000 && perform('wave')) live.current.hoverWave = Date.now();
              }}
              onPointerLeave={() => {
                live.current.hovering = false;
                bot.current?.setHover(false);
                pat.current.x = null;
              }}
              onPointerMove={onPet}
              onPointerDown={onPoke}
              aria-label="Chat with Byte, Ali's AI assistant"
              aria-haspopup="dialog"
              aria-expanded={open}
              className="robot-launcher group relative block h-[72px] w-16 rounded-3xl outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/40 md:h-24 md:w-[84px]"
            >
              {!nudge && !open && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 bottom-full mb-6 rounded-full border border-border bg-card px-3 py-1.5 text-[13px] font-medium whitespace-nowrap text-card-foreground opacity-0 shadow-lift transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  Ask me about Ali
                </span>
              )}
              {mode === '3d' ? (
                <span
                  ref={mountCanvas}
                  className="pointer-events-none absolute -top-[19.5px] -left-[19px] block h-[95.25px] w-[102px] md:-top-[26px] md:-left-[26px] md:h-[127px] md:w-[136px]"
                  aria-hidden="true"
                />
              ) : (
                <>
                  <span className="robot-shadow absolute -bottom-1 left-1/2 h-2 w-9 -translate-x-1/2 rounded-full bg-black/30 blur-[3px]" aria-hidden="true" />
                  <span className="robot-lift absolute inset-x-0 bottom-0 block aspect-square">
                    <span key={hop} className="robot-hop block size-full" data-hop={hop ? '' : undefined}>
                      <span className="robot-float block size-full">
                        <Robot mood={sleeping ? 'sleep' : robotMood} className="size-full" />
                      </span>
                    </span>
                  </span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-labelledby="byte-title"
            tabIndex={-1}
            onKeyDown={(e) => e.key === 'Escape' && close()}
            className="fixed inset-x-2 top-[calc(8px_+_var(--byte-top,0px))] z-[55] flex h-[calc(var(--byte-vh,100dvh)_-_16px)] flex-col overflow-hidden rounded-3xl border border-border bg-card/95 text-card-foreground shadow-lift backdrop-blur-xl outline-none sm:inset-x-auto sm:top-auto sm:right-4 sm:bottom-[100px] sm:z-[45] sm:h-[min(620px,calc(100dvh_-_176px))] sm:w-[400px] md:right-6 md:bottom-[132px] md:h-[min(620px,calc(100dvh_-_208px))]"
            style={{ transformOrigin: 'bottom right' }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(16px) scale(0.96)' }}
            animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: DUR.fast } }
                : { opacity: 0, transform: 'translateY(16px) scale(0.96)', transition: { duration: DUR.fast, ease: EASE } }
            }
            transition={{ duration: DUR.base, ease: EASE }}
          >
            <div className="flex items-center gap-3 border-b border-border py-3 pr-2 pl-5">
              <span className={cn('size-2.5 shrink-0 rounded-full bg-primary', working && 'animate-pulse')} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <h2 id="byte-title" className="text-[15px] leading-tight font-semibold tracking-[-0.01em]">
                  Byte
                </h2>
                <p className="text-[13px] text-muted-foreground">{waiting ? 'Thinking…' : streaming ? 'Typing…' : "Ali's AI assistant"}</p>
              </div>
              {messages.length > 1 && (
                <Button variant="ghost" size="icon" onClick={restart} aria-label="Start a new chat">
                  <RotateCcw aria-hidden="true" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={close} aria-label="Close chat">
                <X aria-hidden="true" />
              </Button>
            </div>

            <div className="relative min-h-0 flex-1">
              <div ref={logRef} onScroll={onLogScroll} className="h-full space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
                {messages.map((m, i) =>
                  m.kind === 'lead' ? (
                    <LeadCard
                      key={m.id}
                      done={lead === 'sent'}
                      transcript={transcript}
                      onSent={() => {
                        setLead('sent');
                        trackClick('chat-lead');
                        bot.current?.express('love', 2);
                        bot.current?.emit('heart', 5);
                      }}
                      onDismiss={() => {
                        setLead('dismissed');
                        update(messagesRef.current.filter((x) => x.id !== m.id));
                      }}
                    />
                  ) : (
                    <Message key={m.id} m={m} reduce={reduce} streaming={streaming && i === messages.length - 1} onRetry={retry} />
                  )
                )}
                {chips.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Suggested questions">
                    {chips.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => pick(q)}
                        className={cn(
                          'min-h-10 rounded-full border px-3.5 text-[13px] font-medium transition-[background-color,border-color] duration-200 outline-none focus-visible:ring-4 focus-visible:ring-ring/25',
                          q === LEAD_CHIP || q === JD_CHIP
                            ? 'border-primary/50 bg-primary/10 hover:bg-primary/20'
                            : 'border-input bg-card/60 hover:border-foreground/40 hover:bg-card'
                        )}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <AnimatePresence>
                {behind && (
                  <motion.button
                    type="button"
                    onClick={toLatest}
                    className="absolute bottom-3 left-1/2 inline-flex h-9 -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-[13px] font-medium shadow-lift"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DUR.fast }}
                  >
                    <ArrowDown className="size-3.5" aria-hidden="true" />
                    New message
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <p className="sr-only" aria-live="polite">
              {announce}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2 border-t border-border px-3 pt-3"
            >
              <label htmlFor="byte-question" className="sr-only">
                Ask Byte about Ali, or paste a job description
              </label>
              <textarea
                id="byte-question"
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    if (!working) send(input);
                  }
                }}
                maxLength={MAX_QUESTION}
                placeholder="Ask about Ali…"
                autoComplete="off"
                className="max-h-[132px] min-h-11 min-w-0 flex-1 resize-none rounded-3xl border border-input bg-background/60 px-4 py-[11px] text-base leading-snug text-foreground transition-[border-color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/25 sm:text-[15px]"
              />
              {working ? (
                <Button type="button" size="icon" variant="outline" onClick={stop} aria-label="Stop the answer" className="size-11 shrink-0">
                  <Stop aria-hidden="true" />
                </Button>
              ) : (
                <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Send question" className="size-11 shrink-0">
                  <Send aria-hidden="true" />
                </Button>
              )}
            </form>
            <div className="flex items-center justify-between gap-3 px-4 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] text-xs text-muted-foreground">
              <span>
                {typed > LONG ? (
                  `${typed.toLocaleString()} / ${MAX_QUESTION.toLocaleString()} characters`
                ) : (
                  <>
                    Answers come from this site.<span className="hidden sm:inline"> Robots can slip.</span>
                  </>
                )}
              </span>
              <span className="flex shrink-0 gap-3">
                <a
                  href={RESUME.resumePath}
                  download={RESUME.resumeDownloadName}
                  onClick={() => trackResumeDownload('chat')}
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  Résumé
                </a>
                <a href={`mailto:${RESUME.email}`} className="font-medium text-foreground underline-offset-2 hover:underline">
                  Email Ali
                </a>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
