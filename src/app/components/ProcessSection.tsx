'use client';
import React, { useRef, useEffect } from 'react';

const steps = [
  {
    number: '01',
    title: 'Understand',
    description: 'Deep dive into your brand, audience, goals, and competition. We map the landscape before we move.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
    color: '#9B4FE4',
    glow: 'rgba(155,79,228,0.4)',
  },
  {
    number: '02',
    title: 'Strategize',
    description: 'Build a data-backed roadmap. Every tactic tied to measurable outcomes and your growth targets.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    color: '#C47AFF',
    glow: 'rgba(196,122,255,0.4)',
  },
  {
    number: '03',
    title: 'Create',
    description: 'Produce cinematic content, launch campaigns, and execute with precision. This is where the magic happens.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    ),
    color: '#FF6B1A',
    glow: 'rgba(255,107,26,0.4)',
  },
  {
    number: '04',
    title: 'Grow',
    description: 'Monitor, optimize, and scale. Real-time analytics ensure every rupee spent works harder for your brand.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    color: '#FF8C4A',
    glow: 'rgba(255,140,74,0.4)',
  },
];

export default function ProcessSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            entry.target.classList.add('animate-slide-up');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="process" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="divider-gradient absolute top-0 left-0 right-0" />
        <div className="orb-purple absolute opacity-20" style={{ width: '700px', height: '700px', bottom: '-200px', right: '-200px' }} />
        <div className="orb-orange absolute opacity-10" style={{ width: '400px', height: '400px', top: '0', left: '-100px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full tag-pill-purple text-xs font-bold tracking-[0.2em] uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#C47AFF', boxShadow: '0 0 6px rgba(196,122,255,0.9)' }} />
            Our Process
          </div>
          <h2 className="text-section-title" style={{ color: '#F0F0F5' }}>
            Why <span className="gradient-text-purple-orange">Creativva?</span>
          </h2>
          <p className="text-lg mt-5 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(138,139,168,0.9)' }}>
            A proven 4-step framework that turns attention into engagement and engagement into measurable growth.
          </p>
        </div>

        {/* Process grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, index) => (
            <div
              key={step.title}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="shimmer-card border-gradient rounded-2xl p-8 group transition-all duration-500 relative overflow-hidden cursor-default"
              style={{
                opacity: 0,
                transitionDelay: `${index * 100}ms`,
                background: 'var(--card)',
              }}
            >
              {/* Number watermark */}
              <div
                className="absolute top-4 right-5 text-7xl font-extrabold opacity-[0.04] leading-none select-none"
                style={{ color: step.color }}
              >
                {step.number}
              </div>

              {/* Icon with glow */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7 transition-all duration-400 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${step.color}25, ${step.color}10)`,
                  border: `1px solid ${step.color}45`,
                  color: step.color,
                  boxShadow: `0 0 0 0 ${step.glow}`,
                  transition: 'all 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${step.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 0 ${step.glow}`;
                }}
              >
                {step.icon}
              </div>

              {/* Step indicator */}
              <div
                className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase mb-3"
                style={{ color: step.color }}
              >
                <span className="w-5 h-0.5 rounded-full inline-block" style={{ background: step.color }} />
                Step {step.number}
              </div>

              <h3 className="font-extrabold text-xl mb-3" style={{ color: '#F0F0F5' }}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(138,139,168,0.85)' }}>{step.description}</p>

              {/* Bottom glow on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `linear-gradient(90deg, transparent, ${step.color}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* Differentiators row */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '⚡', title: 'Creative Approach', desc: 'Fresh ideas that make you stand out' },
            { icon: '📊', title: 'Data-Driven', desc: 'Smart decisions backed by real data' },
            { icon: '🛡️', title: 'Transparent Process', desc: 'Clear communication, real results' },
            { icon: '🤝', title: 'Dedicated Support', desc: "We're with you every step" },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 p-5 rounded-xl transition-all duration-300 group"
              style={{
                border: '1px solid rgba(30,32,64,0.8)',
                background: 'rgba(13,14,31,0.6)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(139,63,212,0.35)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(139,63,212,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(30,32,64,0.8)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(13,14,31,0.6)';
              }}
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-bold text-sm" style={{ color: '#F0F0F5' }}>{item.title}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(138,139,168,0.8)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}