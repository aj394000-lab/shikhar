'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { appendLead, type Lead } from '@/lib/leads';

export default function LeadPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<Omit<Lead, 'id' | 'timestamp'>>({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  });
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) setIsVisible(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, [isDismissed]);

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = appendLead({
      ...formData,
      timestamp: new Date().toISOString(),
      hideDetails: true,
    });
    if (!result.ok) {
      setSubmitError(result.error.message);
      console.error('Lead popup submission failed:', result.error.cause);
      return;
    }

    setSubmitError('');
    setIsSubmitted(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsDismissed(true);
    }, 2500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[8888] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      {/* Popup card */}
      <div
        className="relative z-10 w-full max-w-md border-gradient rounded-2xl overflow-hidden animate-slide-up"
        style={{ background: 'var(--card)' }}
      >
        {/* Top gradient bar */}
        <div className="h-1 w-full cta-gradient-btn" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-border transition-all"
        >
          <Icon name="XMarkIcon" size={16} />
        </button>

        <div className="p-8">
          {isSubmitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full cta-gradient-btn flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckIcon" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">We&apos;ll be in touch!</h3>
              <p className="text-muted-foreground text-sm">
                Thanks for reaching out. Our team will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                  Free Consultation
                </div>
                <h2 className="text-2xl font-extrabold text-foreground leading-tight">
                  Ready to grow your <span className="gradient-text-purple-orange">brand?</span>
                </h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Fill in your details and we&apos;ll craft a custom strategy for you.
                </p>
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="mb-4 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 text-sm text-orange-200"
                >
                  <p>{submitError}</p>
                  <p className="mt-2">
                    Please try again, or call{' '}
                    <a href="tel:+917415072820" className="font-semibold underline">
                      +91 7415072820
                    </a>{' '}
                    or email{' '}
                    <a href="mailto:creativvalab@gmail.com" className="font-semibold underline">
                      creativvalab@gmail.com
                    </a>
                    .
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Full Name *"
                    required
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number *"
                    required
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address *"
                    required
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option value="" className="bg-card text-muted-foreground">
                      Select a Service *
                    </option>
                    <option value="social-media" className="bg-card">
                      Social Media Marketing
                    </option>
                    <option value="content-creation" className="bg-card">
                      Content Creation
                    </option>
                    <option value="paid-ads" className="bg-card">
                      Paid Advertising
                    </option>
                    <option value="seo" className="bg-card">
                      SEO &amp; Analytics
                    </option>
                    <option value="brand-identity" className="bg-card">
                      Brand Identity &amp; Strategy
                    </option>
                    <option value="performance" className="bg-card">
                      Performance Marketing
                    </option>
                    <option value="video-editing" className="bg-card">
                      Video Editing
                    </option>
                  </select>
                </div>
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project (optional)"
                    rows={3}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full cta-gradient-btn text-white font-bold py-4 rounded-xl text-sm tracking-wide"
                >
                  Book My Free Strategy Call →
                </button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                No spam. We respect your privacy.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
