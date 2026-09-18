'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ITEM, SPRING } from './fx/motion';

/* The contact form owns its own state so a keystroke re-renders this
   component only, never the Contact section and its reveal choreography.
   The form lands as one unit (ITEM) after the eyebrow and note; fields are
   not staggered individually because a form should not wobble. */

const ENDPOINT = 'https://formspree.io/f/xjgzwweq';
const EMPTY = { name: '', email: '', subject: '', message: '' };
const TOAST_MS = 5000;

const FORM_STYLE = { marginTop: 20 };

/* toast: SPRING.ui in, a short fade out; the timer hairline drains over the
   auto-dismiss window so the success toast's disappearance is not a surprise */
const TOAST_IN = { y: 30, opacity: 0 };
const TOAST_SHOWN = { y: 0, opacity: 1 };
const TOAST_OUT = { y: 16, opacity: 0, transition: { duration: 0.18 } };
const TOAST_T = { type: 'spring', ...SPRING.ui };
const TIMER_FROM = { scaleX: 1 };
const TIMER_TO = { scaleX: 0 };
const TIMER_T = { duration: TOAST_MS / 1000, ease: 'linear' };
const TIMER_STYLE = { originX: 0 };

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

export function ContactForm() {
  const reducedMotion = useReducedMotion();
  const [formState, setFormState] = useState(EMPTY);
  const [status, setStatus] = useState(null); // 'sending', 'success', 'error'
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  /* auto-dismiss timer: cleared on manual dismiss, on a new submission and on unmount */
  const hide = useRef();

  useEffect(() => {
    setMounted(true);
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
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  const dismiss = () => {
    clearTimeout(hide.current);
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = Object.fromEntries(Object.keys(formState).map((k) => [k, validate(k, formState[k])]));
    setErrors(next);
    const firstInvalid = Object.keys(next).find((k) => next[k]);
    if (firstInvalid) {
      const el = document.getElementById(firstInvalid);
      if (el) el.focus();
      return;
    }
    clearTimeout(hide.current);
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
        setStatus('success');
        setFormState(EMPTY);
        setErrors({});
        clearTimeout(hide.current);
        hide.current = setTimeout(() => setStatus(null), TOAST_MS);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  /* The toast is position: fixed, so it is portaled to <body>: the section's
     Reveal blocks carry will-change: transform, which would otherwise make a
     column its containing block. Mount-gated so server and hydration agree. */
  const toast = (
    <AnimatePresence>
      {(status === 'success' || status === 'error') && (
        <motion.div
          className={`toast${status === 'error' ? ' err' : ''}`}
          role="status"
          initial={TOAST_IN}
          animate={TOAST_SHOWN}
          exit={TOAST_OUT}
          transition={TOAST_T}
        >
          <div>
            <div className="t">{status === 'success' ? 'Message sent' : 'That didn’t go through'}</div>
            <div className="d">
              {status === 'success'
                ? 'It’s in my inbox — I’ll get back to you soon.'
                : 'Something went wrong sending that. Mind trying again?'}
            </div>
          </div>
          <button onClick={dismiss} aria-label="Dismiss Alert">
            ×
          </button>
          {status === 'success' && (
            <motion.i
              className="toast-timer"
              initial={TIMER_FROM}
              animate={TIMER_TO}
              transition={TIMER_T}
              style={TIMER_STYLE}
              aria-hidden="true"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.form
        action={ENDPOINT}
        method="POST"
        onSubmit={handleSubmit}
        className="form rev-i"
        variants={ITEM}
        style={FORM_STYLE}
        aria-label="Contact Form"
        aria-describedby="form-note"
        noValidate
      >
        <div className="form-row">
          <div className="field">
            <label htmlFor="name">
              <i aria-hidden="true">01</i>Name
            </label>
            <div className="control">
              <input type="text" autoComplete="name" required {...fieldProps('name')} />
            </div>
            {errors.name && (
              <span className="err" id="name-error">
                {errors.name}
              </span>
            )}
          </div>
          <div className="field">
            <label htmlFor="email">
              <i aria-hidden="true">02</i>Email Address
            </label>
            <div className="control">
              <input type="email" autoComplete="email" inputMode="email" required {...fieldProps('email')} />
            </div>
            {errors.email && (
              <span className="err" id="email-error">
                {errors.email}
              </span>
            )}
          </div>
        </div>

        <div className="field">
          <label htmlFor="subject">
            <i aria-hidden="true">03</i>Subject
          </label>
          <div className="control">
            <input type="text" autoComplete="off" required {...fieldProps('subject')} />
          </div>
          {errors.subject && (
            <span className="err" id="subject-error">
              {errors.subject}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="message">
            <i aria-hidden="true">04</i>Message
          </label>
          <div className="control">
            <textarea rows="5" required {...fieldProps('message')} />
          </div>
          {errors.message && (
            <span className="err" id="message-error">
              {errors.message}
            </span>
          )}
        </div>

        <div>
          {/* all three labels share one grid cell, so the button is always as
              wide as its widest label and never resizes between states */}
          <motion.button type="submit" className="btn btn-solid" data-status={status || 'idle'} disabled={status === 'sending'} aria-busy={status === 'sending'} whileTap={{ scale: .98 }} animate={status === 'success' && !reducedMotion ? { scale: [1, 1.035, 1] } : { scale: 1 }} transition={{ duration: .32 }}>
            <span className="lbl">
              <span data-on={status !== 'sending' && status !== 'success'}>Send Message</span>
              <span data-on={status === 'sending'}>Sending…</span>
              <span data-on={status === 'success'}>Sent — thanks!</span>
            </span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 19L19 5M19 5H9M19 5v10" />
            </svg>
          </motion.button>
        </div>
      </motion.form>

      {mounted && createPortal(toast, document.body)}
    </>
  );
}
