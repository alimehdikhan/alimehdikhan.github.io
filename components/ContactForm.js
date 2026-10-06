'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CircleAlert, X } from '@/components/ui/icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { SendButton } from './SendButton';
import { ContactSuccess } from './ContactSuccess';
import { SPRING } from './fx/motion';
import { cn } from '@/lib/utils';

/* The contact form owns its own state so a keystroke re-renders this
   component only, never the Contact section. */

const ENDPOINT = 'https://formspree.io/f/xjgzwweq';
const EMPTY = { name: '', email: '', subject: '', message: '' };
const FIELDS = Object.keys(EMPTY);
/* one-tap subjects: they fill the Subject field and can be edited after */
const TOPICS = ['Job opportunity', 'Internship', 'Collaboration', 'Say hello'];
/* failure toast: SPRING.ui in, a short fade out */
const TOAST_IN = { y: 30, opacity: 0 };
const TOAST_SHOWN = { y: 0, opacity: 1 };
const TOAST_OUT = { y: 16, opacity: 0, transition: { duration: 0.18 } };
const TOAST_T = { type: 'spring', ...SPRING.ui };

/* validate on blur rather than per keystroke; an existing error clears as
   soon as the field becomes valid so nobody is nagged while fixing it */
const validate = (name, value) => {
  const v = value.trim();
  if (name === 'name') return v ? '' : 'Please enter your name.';
  if (name === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address, like name@example.com.';
  if (name === 'subject') return v ? '' : 'Please add a subject line.';
  if (name === 'message') return v.length >= 10 ? '' : 'Please write a message of at least 10 characters.';
  return '';
};

function Field({ id, label, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <span className="text-sm text-destructive" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}

/* indeterminate progress bar along the top edge of the card while sending */
function SendingBar({ active, host }) {
  return createPortal(
    <AnimatePresence>
      {active && (
        <motion.div
          key="bar"
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-10 h-1 overflow-hidden bg-foreground/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.span
            className="absolute inset-y-0 w-2/5 rounded-full bg-foreground"
            initial={{ x: '-100%' }}
            animate={{ x: '260%' }}
            transition={{ duration: 1.1, ease: 'easeInOut', repeat: Infinity }}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    host
  );
}

export function ContactForm() {
  const reducedMotion = useReducedMotion();
  const [formState, setFormState] = useState(EMPTY);
  const [status, setStatus] = useState(null); // 'sending', 'success', 'error'
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  const hide = useRef();
  const formRef = useRef(null);
  const anchorRef = useRef(null);
  /* the card around the form hosts the success scene and the progress bar */
  const [card, setCard] = useState(null);
  /* where the send button sits inside that card: the scene floods out from it */
  const [origin, setOrigin] = useState(null);
  /* synchronous guard against double submits (a second click or Enter can
     land before React has re-rendered the busy state) */
  const inFlight = useRef(false);

  useEffect(() => {
    setMounted(true);
    const host = formRef.current?.closest('[data-slot="card"]') || null;
    if (host) {
      host.classList.add('relative', 'overflow-hidden');
      setCard(host);
    }
    return () => clearTimeout(hide.current);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const fieldProps = (name) => ({
    name,
    id: name,
    value: formState[name],
    onChange: handleInputChange,
    onBlur: handleBlur,
    readOnly: status === 'sending',
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  const dismiss = () => {
    clearTimeout(hide.current);
    setStatus(null);
  };

  /* "Send another message": the scene collapses back into the button, and
     focus returns to the first field once it has */
  const reset = () => setStatus(null);

  /* a topic chip fills the subject; on a desktop the cursor moves on to the
     message (on a phone that would raise the keyboard uninvited) */
  const pickTopic = (topic) => {
    setFormState((prev) => ({ ...prev, subject: topic }));
    setErrors((prev) => ({ ...prev, subject: '' }));
    if (matchMedia('(pointer: fine)').matches) document.getElementById('message')?.focus({ preventScroll: true });
  };

  const ready = FIELDS.map((k) => validate(k, formState[k]) === '');
  const readyCount = ready.filter(Boolean).length;
  const afterScene = () => document.getElementById('name')?.focus({ preventScroll: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inFlight.current || status === 'sending' || status === 'success') return;
    const next = Object.fromEntries(Object.keys(formState).map((k) => [k, validate(k, formState[k])]));
    setErrors(next);
    const firstInvalid = Object.keys(next).find((k) => next[k]);
    if (firstInvalid) {
      const el = document.getElementById(firstInvalid);
      if (el) el.focus();
      return;
    }
    clearTimeout(hide.current);
    inFlight.current = true;
    setStatus('sending');

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        const c = card?.getBoundingClientRect();
        const b = anchorRef.current?.getBoundingClientRect();
        setOrigin(c && b ? { x: b.left - c.left + b.width / 2, y: b.top - c.top + b.height / 2 } : null);
        setStatus('success');
        setFormState(EMPTY);
        setErrors({});
      } else {
        /* the entered text stays so the visitor can simply try again */
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      inFlight.current = false;
    }
  };

  /* Only failures use the toast; success is shown in place on the button.
     The toast is position: fixed, so it is portaled to <body>, clear of any
     transformed ancestor. Mount-gated so server and hydration agree. */
  const toast = (
    <AnimatePresence>
      {status === 'error' && (
        <motion.div
          className="fixed right-4 bottom-4 left-4 z-[70] flex items-start gap-4 overflow-hidden rounded-3xl border border-border bg-card/90 p-4 pr-2 text-card-foreground shadow-lift backdrop-blur-xl sm:right-6 sm:bottom-6 sm:left-auto sm:w-[376px]"
          role="status"
          initial={TOAST_IN}
          animate={TOAST_SHOWN}
          exit={TOAST_OUT}
          transition={TOAST_T}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive" aria-hidden="true">
            <CircleAlert className="size-5" />
          </span>
          <div className="flex-1 pt-0.5">
            <div className="font-semibold">Your message didn’t send</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Something went wrong on the way. Your text is still in the form, so you can try again.
            </div>
          </div>
          <Button variant="ghost" size="icon" className="-mt-1 size-9" onClick={dismiss} aria-label="Dismiss Alert">
            <X aria-hidden="true" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <form
        ref={formRef}
        action={ENDPOINT}
        method="POST"
        onSubmit={handleSubmit}
        className={`flex flex-col gap-6 transition-opacity duration-300 ${status === 'sending' ? '[&_input]:opacity-60 [&_textarea]:opacity-60' : ''}`}
        aria-label="Contact Form"
        aria-describedby="form-note"
        noValidate
        inert={status === 'success' ? '' : undefined}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="name" label="Name" error={errors.name}>
            <Input type="text" autoComplete="name" required {...fieldProps('name')} />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <Input type="email" autoComplete="email" inputMode="email" required {...fieldProps('email')} />
          </Field>
        </div>

        <Field id="subject" label="Subject" error={errors.subject}>
          <Input type="text" autoComplete="off" required {...fieldProps('subject')} />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Quick subjects">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                disabled={status === 'sending'}
                aria-pressed={formState.subject === topic}
                onClick={() => pickTopic(topic)}
                className="min-h-10 rounded-full border border-input bg-card/60 px-3.5 text-[13px] font-medium transition-[background-color,color,border-color] duration-200 outline-none hover:border-foreground/40 hover:bg-card focus-visible:ring-4 focus-visible:ring-ring/25 aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-primary-foreground disabled:opacity-60"
              >
                {topic}
              </button>
            ))}
          </div>
        </Field>

        <Field id="message" label="Message" error={errors.message}>
          <Textarea rows={5} required {...fieldProps('message')} />
        </Field>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <SendButton status={status} reduce={reducedMotion} anchorRef={anchorRef} />
          {/* a quiet progress meter: one pip per field that is ready to send */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground" aria-hidden="true">
            <span className="flex gap-1">
              {ready.map((ok, i) => (
                <span key={FIELDS[i]} className={cn('h-1.5 w-6 rounded-full transition-colors duration-300', ok ? 'bg-foreground' : 'bg-foreground/15')} />
              ))}
            </span>
            <span className="tabular-nums">{readyCount} of {FIELDS.length} ready</span>
          </div>
        </div>
      </form>

      {mounted && createPortal(toast, document.body)}
      {mounted && card && <SendingBar active={status === 'sending'} host={card} />}
      {mounted && (
        <ContactSuccess
          open={status === 'success'}
          container={card}
          origin={origin}
          reduce={reducedMotion}
          onReset={reset}
          onClosed={afterScene}
        />
      )}
    </>
  );
}
