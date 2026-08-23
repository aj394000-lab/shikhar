'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLeadForm, LeadFormChangeEvent } from '@/hooks/useLeadForm';
import { saveLead } from '@/lib/leads';
import { LEAD_FIELD_LIMITS, validateLead } from '@/lib/leadValidation';
import { SERVICE_OPTIONS, SERVICE_VALUES } from '@/lib/services';

export default function LeadPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const { formData, handleChange: handleFormChange } = useLeadForm();

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
    const validation = validateLead(formData, SERVICE_VALUES);
    if (!validation.ok) {
      setFormError(validation.error);
      return;
    }
    // mark popup submissions to hide details in admin
    saveLead(validation.lead, true);
    setFormError('');
    setIsSubmitted(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsDismissed(true);
    }, 2500);
  };

  const handleChange = (e: LeadFormChangeEvent) => {
    handleFormChange(e);
    if (formError) setFormError('');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[8888] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

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
                  Ready to grow your{' '}
                  <span className="gradient-text-purple-orange">brand?</span>
                </h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Fill in your details and we&apos;ll craft a custom strategy for you.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Full Name *"
                    required
                    maxLength={LEAD_FIELD_LIMITS.name}
                    autoComplete="name"
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
                    maxLength={LEAD_FIELD_LIMITS.phone}
                    autoComplete="tel"
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
                    maxLength={LEAD_FIELD_LIMITS.email}
                    autoComplete="email"
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
                    <option value="" className="bg-card text-muted-foreground">Select a Service *</option>
                    {SERVICE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-card">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project (optional)"
                    rows={3}
                    maxLength={LEAD_FIELD_LIMITS.message}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                {formError && (
                  <p className="text-xs" role="alert" style={{ color: '#FF8C4A' }}>{formError}</p>
                )}
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