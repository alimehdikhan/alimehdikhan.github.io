'use client';

import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export function Contact() {
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
        // Auto reset status back to null after 4 seconds
        setTimeout(() => setStatus(null), 4000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="ds-section">
      <div className="container reveal-on-scroll">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-eyebrow" style={{ color: '#6366f1', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '0.75rem' }}>
            Get In Touch
          </span>
          <h2 className="ds-section-title text-gradient" style={{ marginBottom: '1rem' }}>
            Contact Me
          </h2>
          <div className="title-underline" style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
        </div>

        <div className="bento-grid">
          {/* Contact info details */}
          <div className="bento-span-6 reveal-on-scroll stagger-1">
            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: '#6366f1' }}>
                  Interested in working together?
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  Whether you're looking for a software engineer, need help with machine learning implementation, or want to collaborate on open-source work — I'd love to hear from you. 
                </p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '0.75rem', fontWeight: 500 }}>
                  ⏰ Average response time: <strong>under 24 hours</strong>.
                </p>
              </div>

              <div className="contact-block-row">
                <Card hoverable className="contact-info-card" style={{ background: 'rgba(255,255,255,0.01)' }}>
                  <div className="contact-icon-box">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <div className="contact-details-box">
                    <h4>Email</h4>
                    <span><a href="mailto:ali973mehdi@gmail.com" style={{ color: 'inherit' }}>ali973mehdi@gmail.com</a></span>
                  </div>
                </Card>

                <Card hoverable className="contact-info-card" style={{ background: 'rgba(255,255,255,0.01)' }}>
                  <div className="contact-icon-box" style={{ background: 'rgba(52, 211, 153, 0.08)', color: '#34d399' }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div className="contact-details-box">
                    <h4>Phone</h4>
                    <span><a href="tel:+919569042552" style={{ color: 'inherit' }}>+91 95690 42552</a></span>
                  </div>
                </Card>

                <Card hoverable className="contact-info-card" style={{ background: 'rgba(255,255,255,0.01)' }}>
                  <div className="contact-icon-box" style={{ background: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b' }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div className="contact-details-box">
                    <h4>Location</h4>
                    <span>Lucknow, UP, India</span>
                  </div>
                </Card>
              </div>
            </Card>
          </div>

          {/* Form */}
          <div className="bento-span-6 reveal-on-scroll stagger-2">
            <Card style={{ height: '100%' }}>
              <form onSubmit={handleSubmit} className="contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }} aria-label="Contact Form">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', width: '100%' }} className="form-row">
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                    <label htmlFor="name" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      autoComplete="name"
                      placeholder="Your Name"
                      value={formState.name}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1.25rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--card-border)',
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--input-color)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                    <label htmlFor="email" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formState.email}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1.25rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--card-border)',
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--input-color)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
                
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                  <label htmlFor="subject" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    required 
                    placeholder="Subject"
                    value={formState.subject}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--card-border)',
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--input-color)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                  <label htmlFor="message" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5" 
                    required 
                    placeholder="Tell me about your project or opportunity..."
                    value={formState.message}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--card-border)',
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--input-color)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical',
                      minHeight: '120px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <Button 
                  type="submit" 
                  variant={status === 'success' ? 'success' : 'primary'} 
                  disabled={status === 'sending'}
                  style={{ 
                    width: 'fit-content', 
                    marginTop: '0.5rem',
                    backgroundColor: status === 'success' ? '#10b981' : undefined,
                    color: status === 'success' ? '#ffffff' : undefined,
                    borderColor: status === 'success' ? '#10b981' : undefined,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {status === 'sending' ? (
                    'Sending...'
                  ) : status === 'success' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      Transmitted!
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Success/Error Toast alert */}
        {status === 'success' && (
          <div className="toast-msg-container">
            <Card style={{ padding: 0 }} className="toast-msg-card">
              <div className="toast-msg-content">
                <div className="toast-icon" style={{ color: '#10b981' }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>Message Transmitted</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>I have received your message and will respond shortly.</p>
                </div>
                <button 
                  onClick={() => setStatus(null)} 
                  aria-label="Dismiss Alert"
                  style={{ border: 'none', background: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '1.2rem', marginLeft: 'auto' }}
                >
                  ×
                </button>
              </div>
            </Card>
          </div>
        )}

        {status === 'error' && (
          <div className="toast-msg-container">
            <Card style={{ padding: 0 }} className="toast-msg-card">
              <div className="toast-msg-content is-error">
                <div className="toast-icon" style={{ color: '#ef4444' }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>Submission Failed</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>A network error occurred. Please try again.</p>
                </div>
                <button 
                  onClick={() => setStatus(null)} 
                  aria-label="Dismiss Alert"
                  style={{ border: 'none', background: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '1.2rem', marginLeft: 'auto' }}
                >
                  ×
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .bento-grid {
            display: flex !important;
            flex-direction: column !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
