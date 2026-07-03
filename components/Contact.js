'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Card } from './ui/Card';

export function Contact() {
  const prefersReducedMotion = useReducedMotion();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null); // 'sending', 'success', 'error'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/xjgzwweq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formState)
      });

      if (response.ok) {
        setStatus('success');
        setFormState({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const revealVariants = {
    hidden: { y: prefersReducedMotion ? 0 : 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 15,
        duration: 0.6
      }
    }
  };

  const contactDetails = [
    {
      title: 'Email',
      value: 'ali973mehdi@gmail.com',
      href: 'mailto:ali973mehdi@gmail.com',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
      gradientClass: 'from-indigo-500/0 to-indigo-500/10',
      iconClass: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400',
    },
    {
      title: 'Phone',
      value: '+91 95690 42552',
      href: 'tel:+919569042552',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
      gradientClass: 'from-emerald-500/0 to-emerald-500/10',
      iconClass: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
    },
    {
      title: 'Location',
      value: 'Lucknow, UP, India',
      href: 'https://www.google.com/maps/search/?api=1&query=Lucknow,+UP,+India',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
      gradientClass: 'from-amber-500/0 to-amber-500/10',
      iconClass: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
    }
  ];

  const socialLinks = [
    { href: 'https://github.com/alimehdikhan', icon: 'M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z', label: 'GitHub' },
    { href: 'https://linkedin.com/in/ali-mehdi-khan-b4062b2a3', icon: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z', label: 'LinkedIn' },
  ];

  return (
    <section id="contact" className="relative py-16 sm:py-24 md:py-32 bg-bg-primary border-t border-border-dim overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-10 sm:mb-16 lg:mb-24"
          initial={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2 inline-block">
            Get In Touch
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
            Contact Me
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-stretch"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* Left Panel: Contact Information */}
          <motion.div variants={revealVariants} className="flex flex-col justify-between order-2 lg:order-1">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mb-5 self-start shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <span className="w-1.5 h-1.5 flex-shrink-0 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for Internships & Full-Time</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-primary tracking-tight mb-3">
                Let's build something great together.
              </h3>
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-7 max-w-md">
                Whether you're looking for a software engineer, need help with machine learning implementation, or want to collaborate on open-source work — I'd love to hear from you.
              </p>

              <div className="flex flex-col gap-3 mb-7">
                {contactDetails.map((item, idx) => (
                  <motion.a 
                    key={idx} 
                    href={item.href} 
                    target={item.title === 'Location' ? '_blank' : undefined}
                    rel={item.title === 'Location' ? 'noopener noreferrer' : undefined}
                    className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-bg-elevated/20 border border-border-dim hover:border-border-dim/80 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-md"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                  >
                    {/* Hover Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    <div className={`p-3 rounded-xl border transition-transform duration-300 group-hover:scale-110 ${item.iconClass}`}>
                      {item.icon}
                    </div>
                    <div className="z-10 flex-1">
                      <h4 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-0.5">{item.title}</h4>
                      <span className="text-sm sm:text-base font-bold text-text-primary group-hover:text-text-primary transition-colors">{item.value}</span>
                    </div>
                    
                    <div className="z-10 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-text-secondary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-xl border border-border-dim bg-bg-elevated/40 text-text-secondary hover:text-text-primary hover:border-border-dim hover:bg-bg-elevated/80 transition-all shadow-sm"
                  aria-label={social.label}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.08, y: -2 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right Panel: Premium Form */}
          <motion.div variants={revealVariants} className="order-1 lg:order-2">
            <Card className="p-5 sm:p-8 md:p-10 bg-bg-elevated/40 backdrop-blur-xl border border-border-dim shadow-2xl rounded-3xl relative overflow-hidden flex flex-col justify-center">
              {/* Subtle gradient background inside form card */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6 w-full relative z-10" aria-label="Contact Form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  <div className="relative group">
                    <input 
                      type="text" 
                      id="name" name="name" 
                      required placeholder=" "
                      value={formState.name} onChange={handleInputChange}
                      className="peer w-full h-[56px] px-4 pt-5 pb-1 rounded-xl border border-border-dim bg-bg-primary/50 text-text-primary text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)] hover:border-border-dim/80"
                    />
                    <label htmlFor="name" className="absolute left-4 top-1.5 text-[11px] font-semibold text-text-secondary transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-indigo-400 pointer-events-none">
                      Name
                    </label>
                  </div>
                  <div className="relative group">
                    <input 
                      type="email" 
                      id="email" name="email" 
                      required placeholder=" "
                      value={formState.email} onChange={handleInputChange}
                      className="peer w-full h-[56px] px-4 pt-5 pb-1 rounded-xl border border-border-dim bg-bg-primary/50 text-text-primary text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)] hover:border-border-dim/80"
                    />
                    <label htmlFor="email" className="absolute left-4 top-1.5 text-[11px] font-semibold text-text-secondary transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-indigo-400 pointer-events-none">
                      Email Address
                    </label>
                  </div>
                </div>
                
                <div className="relative group">
                  <input 
                    type="text" 
                    id="subject" name="subject" 
                    required placeholder=" "
                    value={formState.subject} onChange={handleInputChange}
                    className="peer w-full h-[56px] px-4 pt-5 pb-1 rounded-xl border border-border-dim bg-bg-primary/50 text-text-primary text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)] hover:border-border-dim/80"
                  />
                  <label htmlFor="subject" className="absolute left-4 top-1.5 text-[11px] font-semibold text-text-secondary transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-indigo-400 pointer-events-none">
                    Subject
                  </label>
                </div>

                <div className="relative group">
                  <textarea 
                    id="message" name="message" 
                    required placeholder=" " rows="5"
                    value={formState.message} onChange={handleInputChange}
                    className="peer w-full min-h-[160px] px-4 pt-6 pb-4 rounded-xl border border-border-dim bg-bg-primary/50 text-text-primary text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-y shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)] hover:border-border-dim/80 leading-relaxed"
                  />
                  <label htmlFor="message" className="absolute left-4 top-2 text-[11px] font-semibold text-text-secondary transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-indigo-400 pointer-events-none">
                    Message
                  </label>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={status === 'sending'}
                    className={`relative w-full h-[56px] rounded-xl overflow-hidden font-bold text-sm tracking-wide text-white transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed ${
                      status === 'success' 
                        ? 'bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.4)]' 
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-[1.01] active:scale-[0.98]'
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {status === 'sending' ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Sending...
                        </>
                      ) : status === 'success' ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                          Transmitted Successfully
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </Card>
          </motion.div>
        </motion.div>

        {/* Success/Error Toast alert */}
        <AnimatePresence>
          {(status === 'success' || status === 'error') && (
            <motion.div 
              className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 sm:max-w-sm w-auto"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Card className={`p-0 border ${status === 'success' ? 'border-emerald-500/30' : 'border-red-500/30'} bg-neutral-950/90 shadow-2xl backdrop-blur-md`}>
                <div className="flex items-center gap-4 p-4">
                  <div className={status === 'success' ? 'text-emerald-400' : 'text-red-400'}>
                    {status === 'success' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">{status === 'success' ? 'Message Transmitted' : 'Submission Failed'}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">{status === 'success' ? 'I have received your email and will respond shortly.' : 'A network error occurred. Please try again.'}</p>
                  </div>
                  <button 
                    onClick={() => setStatus(null)} 
                    className="text-neutral-500 hover:text-white text-lg font-bold ml-auto leading-none border-none bg-transparent cursor-pointer transition-colors"
                    aria-label="Dismiss Alert"
                  >
                    ×
                  </button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
