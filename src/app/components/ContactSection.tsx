'use client';
import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LEAD_FIELD_LIMITS, validateLead, type LeadInput } from '@/lib/leadValidation';

type FormState = LeadInput;

interface LeadEntry extends FormState {
  timestamp: string;
  hideDetails?: boolean;
}

const SERVICE_OPTIONS = [
  'social-media-marketing',
  'content-creation',
  'paid-advertising',
  'seo-analytics',
  'social-media-management',
  'brand-identity',
  'performance-marketing',
  'video-editing',
] as const;

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (leftRef.current) {
              leftRef.current.style.opacity = '1';
              leftRef.current.classList.add('animate-slide-left');
            }
            if (rightRef.current) {
              rightRef.current.style.opacity = '1';
              rightRef.current.classList.add('animate-slide-right');
            }
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (formError) setFormError('');
  };

  const saveLeadEntry = (lead: LeadEntry) => {
    try {
      const existing = JSON.parse(localStorage.getItem('creativva_leads') || '[]');
      localStorage.setItem('creativva_leads', JSON.stringify([...existing, lead]));
    } catch {
      // ignore localStorage errors
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLead(formData, SERVICE_OPTIONS);
    if (!validation.ok) {
      setFormError(validation.error);
      return;
    }
    const newLead: LeadEntry = {
      ...validation.lead,
      timestamp: new Date().toISOString(),
      hideDetails: false,
    };
    saveLeadEntry(newLead);
    setFormError('');
    setSubmitted(true);
  };

  return (
    <section id="contact" ref={sectionRef} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="divider-gradient absolute top-0 left-0 right-0" />
        <div className="orb-purple absolute opacity-25" style={{ width: '600px', height: '600px', top: '0', left: '-200px' }} />
        <div className="orb-orange absolute opacity-15" style={{ width: '450px', height: '450px', bottom: '0', right: '-120px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full tag-pill-orange text-xs font-bold tracking-[0.2em] uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#FF8C4A', boxShadow: '0 0 6px rgba(255,140,74,0.9)' }} />
            Let&apos;s Connect
          </div>
          <h2 className="text-section-title" style={{ color: '#F0F0F5' }}>
            Ready to grow your <span className="gradient-text-purple-orange">brand?</span>
          </h2>
          <p className="text-lg mt-5 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(138,139,168,0.9)' }}>
            Let&apos;s build something remarkable together. Reach out and let&apos;s talk strategy.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact info */}
          <div ref={leftRef} className="space-y-6" style={{ opacity: 0 }}>
            {/* Big tagline */}
            <div className="border-gradient rounded-3xl p-9 relative overflow-hidden" style={{ background: 'var(--card)' }}>
              <div className="absolute inset-0 gradient-bg-card" />
              <div className="orb-purple absolute opacity-20 pointer-events-none" style={{ width: '200px', height: '200px', top: '-50px', right: '-50px' }} />
              <div className="relative z-10">
                <p className="text-3xl font-extrabold leading-tight mb-4" style={{ color: '#F0F0F5' }}>
                  Where <span className="gradient-text-purple-orange">Creativity</span>{' '}
                  <span className="font-light italic" style={{ color: '#F0F0F5' }}>Meets</span>{' '}
                  <span style={{ color: '#FF6B1A' }}>Results.</span>
                </p>
                <p className="leading-relaxed" style={{ color: 'rgba(138,139,168,0.85)' }}>
                  We don&apos;t just run campaigns — we build brands that people remember and trust. 
                  Your brand&apos;s digital transformation starts with one conversation.
                </p>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-3">
              {[
                {
                  icon: 'PhoneIcon',
                  label: 'Call Us',
                  value: '+91 7415072820',
                  href: 'tel:+917415072820',
                  accent: 'purple',
                },
                {
                  icon: 'EnvelopeIcon',
                  label: 'Email Us',
                  value: 'creativvalab@gmail.com',
                  href: 'mailto:creativvalab@gmail.com',
                  accent: 'orange',
                },
                {
                  icon: 'ChatBubbleLeftRightIcon',
                  label: 'WhatsApp',
                  value: "Let's grow your brand together!",
                  href: 'https://wa.me/917415072820',
                  accent: 'purple',
                },
              ].map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-5 p-5 rounded-2xl group transition-all duration-400"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid rgba(30,32,64,0.8)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = contact.accent === 'purple' ? 'rgba(139,63,212,0.45)' : 'rgba(255,107,26,0.45)';
                    el.style.transform = 'translateY(-2px)';
                    el.style.boxShadow = contact.accent === 'purple' ?'0 8px 30px rgba(139,63,212,0.15)' :'0 8px 30px rgba(255,107,26,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = 'rgba(30,32,64,0.8)';
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                      contact.accent === 'purple' ? 'service-icon-purple' : 'service-icon-orange'
                    }`}
                  >
                    <Icon
                      name={contact.icon as 'PhoneIcon'}
                      size={20}
                      className={contact.accent === 'purple' ? 'text-primary' : 'text-accent'}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wider uppercase mb-0.5" style={{ color: 'rgba(138,139,168,0.7)' }}>{contact.label}</p>
                    <p className="font-semibold text-sm" style={{ color: '#F0F0F5' }}>{contact.value}</p>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: contact.accent === 'purple' ? '#C47AFF' : '#FF8C4A' }}>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>

            {/* CTA button */}
            <a
              href="https://www.instagram.com/cre.ativva"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 p-5 rounded-2xl group transition-all duration-400"
              style={{ background: 'var(--card)', border: '1px solid rgba(30,32,64,0.8)' }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(139,63,212,0.45)';
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 8px 30px rgba(139,63,212,0.15)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(30,32,64,0.8)';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: '#F0F0F5' }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider uppercase mb-0.5" style={{ color: 'rgba(138,139,168,0.7)' }}>Follow Us</p>
                <p className="font-semibold text-sm" style={{ color: '#F0F0F5' }}>@cre.ativva</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#C47AFF' }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </a>

            <a
              href="tel:+917415072820"
              className="cta-gradient-btn text-white font-bold px-8 py-5 rounded-2xl text-base inline-flex items-center gap-3 w-full justify-center"
              style={{ boxShadow: '0 0 40px rgba(139,63,212,0.35)' }}
            >
              Ready to grow your brand?
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Right: Booking form */}
          <div
            ref={rightRef}
            className="border-gradient rounded-3xl p-9 relative overflow-hidden"
            style={{ opacity: 0, background: 'var(--card)' }}
          >
            <div className="absolute inset-0 gradient-bg-card" />
            <div className="orb-orange absolute opacity-10 pointer-events-none" style={{ width: '250px', height: '250px', bottom: '-80px', right: '-80px' }} />
            <div className="relative z-10">
              <h3 className="text-2xl font-extrabold mb-2" style={{ color: '#F0F0F5' }}>Book a Strategy Call</h3>
              <p className="text-sm mb-8" style={{ color: 'rgba(138,139,168,0.8)' }}>
                Fill in your details and we&apos;ll reach out within 24 hours.
              </p>

              {submitted ? (
                <div className="text-center py-12">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                      background: 'linear-gradient(135deg, #8B3FD4, #FF6B1A)',
                      boxShadow: '0 0 40px rgba(139,63,212,0.5)',
                    }}
                  >
                    <Icon name="CheckIcon" size={36} className="text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-2" style={{ color: '#F0F0F5' }}>Message Received!</h4>
                  <p style={{ color: 'rgba(138,139,168,0.8)' }}>We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold tracking-wider uppercase mb-2 block" style={{ color: 'rgba(138,139,168,0.7)' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        maxLength={LEAD_FIELD_LIMITS.name}
                        autoComplete="name"
                        className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none"
                        style={{
                          background: 'rgba(22,23,40,0.8)',
                          border: '1px solid rgba(30,32,64,0.9)',
                          color: '#F0F0F5',
                        }}
                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(139,63,212,0.6)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(139,63,212,0.1)'; }}
                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(30,32,64,0.9)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold tracking-wider uppercase mb-2 block" style={{ color: 'rgba(138,139,168,0.7)' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        required
                        maxLength={LEAD_FIELD_LIMITS.phone}
                        autoComplete="tel"
                        className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none"
                        style={{
                          background: 'rgba(22,23,40,0.8)',
                          border: '1px solid rgba(30,32,64,0.9)',
                          color: '#F0F0F5',
                        }}
                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(139,63,212,0.6)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(139,63,212,0.1)'; }}
                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(30,32,64,0.9)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase mb-2 block" style={{ color: 'rgba(138,139,168,0.7)' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      maxLength={LEAD_FIELD_LIMITS.email}
                      autoComplete="email"
                      className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none"
                      style={{
                        background: 'rgba(22,23,40,0.8)',
                        border: '1px solid rgba(30,32,64,0.9)',
                        color: '#F0F0F5',
                      }}
                      onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(139,63,212,0.6)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(139,63,212,0.1)'; }}
                      onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(30,32,64,0.9)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase mb-2 block" style={{ color: 'rgba(138,139,168,0.7)' }}>
                      Service Interested In *
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none appearance-none"
                      style={{
                        background: 'rgba(22,23,40,0.8)',
                        border: '1px solid rgba(30,32,64,0.9)',
                        color: formData.service ? '#F0F0F5' : 'rgba(138,139,168,0.6)',
                      }}
                      onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'rgba(139,63,212,0.6)'; (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 3px rgba(139,63,212,0.1)'; }}
                      onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'rgba(30,32,64,0.9)'; (e.target as HTMLSelectElement).style.boxShadow = 'none'; }}
                    >
                      <option value="" style={{ background: '#0D0E1F', color: 'rgba(138,139,168,0.7)' }}>Select a service</option>
                      <option value="social-media-marketing" style={{ background: '#0D0E1F', color: '#F0F0F5' }}>Social Media Marketing</option>
                      <option value="content-creation" style={{ background: '#0D0E1F', color: '#F0F0F5' }}>Content Creation</option>
                      <option value="paid-advertising" style={{ background: '#0D0E1F', color: '#F0F0F5' }}>Paid Advertising</option>
                      <option value="seo-analytics" style={{ background: '#0D0E1F', color: '#F0F0F5' }}>SEO &amp; Analytics</option>
                      <option value="social-media-management" style={{ background: '#0D0E1F', color: '#F0F0F5' }}>Social Media Management</option>
                      <option value="brand-identity" style={{ background: '#0D0E1F', color: '#F0F0F5' }}>Brand Identity &amp; Strategy</option>
                      <option value="performance-marketing" style={{ background: '#0D0E1F', color: '#F0F0F5' }}>Performance Marketing</option>
                      <option value="video-editing" style={{ background: '#0D0E1F', color: '#F0F0F5' }}>Content Creation &amp; Video Editing</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase mb-2 block" style={{ color: 'rgba(138,139,168,0.7)' }}>
                      Tell Us About Your Project
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="What are you looking to achieve? Any specific goals or timelines?"
                      rows={4}
                      maxLength={LEAD_FIELD_LIMITS.message}
                      className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none resize-none"
                      style={{
                        background: 'rgba(22,23,40,0.8)',
                        border: '1px solid rgba(30,32,64,0.9)',
                        color: '#F0F0F5',
                      }}
                      onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(139,63,212,0.6)'; (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px rgba(139,63,212,0.1)'; }}
                      onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(30,32,64,0.9)'; (e.target as HTMLTextAreaElement).style.boxShadow = 'none'; }}
                    />
                  </div>

                  {formError && (
                    <p className="text-xs" role="alert" style={{ color: '#FF8C4A' }}>{formError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full cta-gradient-btn text-white font-bold py-4 rounded-xl text-sm tracking-wide"
                    style={{ boxShadow: '0 0 30px rgba(139,63,212,0.3)' }}
                  >
                    Send My Inquiry →
                  </button>

                  <p className="text-xs text-center" style={{ color: 'rgba(138,139,168,0.5)' }}>
                    We respond within 24 hours. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}