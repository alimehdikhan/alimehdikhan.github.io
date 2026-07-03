'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Card } from './ui/Card';
import { MagneticButton } from './ui/MagneticButton';

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
        setTimeout(() => setStatus(null), 4000);
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

  return (
    <section id="contact" className="relative py-24 bg-[#0A0A0A] border-t border-neutral-900">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2 inline-block">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact Me
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } }
          }}
        >
          {/* Contact info details */}
          <motion.div variants={revealVariants} className="h-full">
            <Card className="h-full flex flex-col justify-between p-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Interested in working together?
                </h3>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-4">
                  Whether you're looking for a software engineer, need help with machine learning implementation, or want to collaborate on open-source work — I'd love to hear from you. 
                </p>
                <p className="text-xs text-neutral-500 font-semibold mb-8">
                  ⏰ Average response time: <strong className="text-neutral-300">under 24 hours</strong>.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  {
                    title: 'Email',
                    value: 'ali973mehdi@gmail.com',
                    href: 'mailto:ali973mehdi@gmail.com',
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
                    colorClass: 'text-indigo-400 border-indigo-500/10 bg-indigo-500/5'
                  },
                  {
                    title: 'Phone',
                    value: '+91 95690 42552',
                    href: 'tel:+919569042552',
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
                    colorClass: 'text-emerald-400 border-emerald-500/10 bg-emerald-500/5'
                  },
                  {
                    title: 'Location',
                    value: 'Lucknow, UP, India',
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
                    colorClass: 'text-amber-400 border-amber-500/10 bg-amber-500/5'
                  }
                ].map((item, idx) => (
                  <Card key={idx} hoverable className="flex items-center gap-4 p-4 bg-neutral-950/20 border border-neutral-900">
                    <div className={`p-2.5 rounded-lg border ${item.colorClass}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{item.title}</h4>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-bold text-white hover:text-indigo-400 transition-colors">{item.value}</a>
                      ) : (
                        <span className="text-sm font-bold text-white">{item.value}</span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Form */}
          <motion.div variants={revealVariants} className="h-full">
            <Card className="h-full p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full" aria-label="Contact Form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col items-start w-full">
                    <label htmlFor="name" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      autoComplete="name"
                      placeholder="Your Name"
                      value={formState.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-800 bg-neutral-950/40 text-white placeholder-neutral-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200 text-sm"
                    />
                  </div>
                  <div className="flex flex-col items-start w-full">
                    <label htmlFor="email" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formState.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-800 bg-neutral-950/40 text-white placeholder-neutral-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200 text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col items-start w-full">
                  <label htmlFor="subject" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    required 
                    placeholder="Subject"
                    value={formState.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-800 bg-neutral-950/40 text-white placeholder-neutral-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200 text-sm"
                  />
                </div>

                <div className="flex flex-col items-start w-full">
                  <label htmlFor="message" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5" 
                    required 
                    placeholder="Tell me about your project or opportunity..."
                    value={formState.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-800 bg-neutral-950/40 text-white placeholder-neutral-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200 text-sm resize-none min-h-[120px]"
                  />
                </div>

                <div className="pt-2">
                  <MagneticButton 
                    type="submit" 
                    variant={status === 'success' ? 'success' : 'primary'} 
                    disabled={status === 'sending'}
                    className={status === 'success' ? '!bg-emerald-600 !hover:bg-emerald-500' : ''}
                  >
                    {status === 'sending' ? (
                      'Sending...'
                    ) : status === 'success' ? (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        Transmitted!
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </MagneticButton>
                </div>
              </form>
            </Card>
          </motion.div>
        </motion.div>

        {/* Success/Error Toast alert */}
        <AnimatePresence>
          {status === 'success' && (
            <motion.div 
              className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Card className="p-0 border border-emerald-500/30 bg-neutral-950/90 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-4 p-4">
                  <div className="text-emerald-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">Message Transmitted</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">I have received your email and will respond shortly.</p>
                  </div>
                  <button 
                    onClick={() => setStatus(null)} 
                    className="text-neutral-400 hover:text-white text-lg font-bold ml-auto leading-none border-none bg-transparent cursor-pointer"
                    aria-label="Dismiss Alert"
                  >
                    ×
                  </button>
                </div>
              </Card>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Card className="p-0 border border-red-500/30 bg-neutral-950/90 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-4 p-4">
                  <div className="text-red-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">Submission Failed</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">A network error occurred. Please try again.</p>
                  </div>
                  <button 
                    onClick={() => setStatus(null)} 
                    className="text-neutral-400 hover:text-white text-lg font-bold ml-auto leading-none border-none bg-transparent cursor-pointer"
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
