'use client';
import React, { useRef } from 'react';
import { ArrowRightIcon } from '@/components/ui/icons';
import { useRevealCards } from '@/hooks/useRevealOnScroll';

const services = [
  {
    icon: 'social',
    title: 'Social Media Marketing',
    description: 'Build your brand presence across Instagram, Facebook, LinkedIn, and more. Drive engagement that converts.',
    accent: 'purple',
    size: 'large',
  },
  {
    icon: 'content',
    title: 'Content Creation',
    description: 'Compelling car-focused visuals, reels, and creatives that stop the scroll and tell your story.',
    accent: 'orange',
    size: 'normal',
  },
  {
    icon: 'ads',
    title: 'Paid Advertising',
    description: 'Maximize reach and ROI with precision-targeted Meta and Google ad campaigns.',
    accent: 'purple',
    size: 'normal',
  },
  {
    icon: 'seo',
    title: 'SEO & Analytics',
    description: 'Rank higher, grow faster. Data-driven SEO strategies that put your brand in front of the right people.',
    accent: 'orange',
    size: 'normal',
  },
  {
    icon: 'management',
    title: 'Social Media Management',
    description: 'End-to-end management — plan, design, publish, and optimize. Your brand always on, always growing.',
    accent: 'orange',
    size: 'normal',
  },
  {
    icon: 'brand',
    title: 'Brand Identity & Strategy',
    description: 'From logo to language — we craft a brand identity that resonates and stands out in competitive markets.',
    accent: 'purple',
    size: 'large',
  },
  {
    icon: 'performance',
    title: 'Performance Marketing',
    description: 'Meta & Google Ads engineered for maximum conversions. Smart decisions backed by real-time data.',
    accent: 'orange',
    size: 'normal',
  },
  {
    icon: 'video',
    title: 'Video Editing',
    description: 'Cinematic car shoots, product videos, and social media creatives that drive conversions.',
    accent: 'purple',
    size: 'normal',
  },
];

const ServiceIcon = ({ type, accent }: { type: string; accent: string }) => {
  const color = accent === 'purple' ? '#C47AFF' : '#FF8C4A';
  const icons: Record<string, React.ReactNode> = {
    social: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    content: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
    ads: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    seo: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    management: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    brand: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    performance: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    video: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  };
  return <>{icons[type]}</>;
};

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useRevealCards(cardRefs, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  return (
    <section id="services" ref={sectionRef} className="py-28 relative overflow-hidden aurora-bg">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="divider-gradient absolute top-0 left-0 right-0" />
        <div className="orb-purple absolute opacity-25" style={{ width: '500px', height: '500px', top: '10%', left: '-150px' }} />
        <div className="orb-orange absolute opacity-15" style={{ width: '350px', height: '350px', bottom: '10%', right: '-80px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full tag-pill-purple text-xs font-bold tracking-[0.2em] uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#C47AFF', boxShadow: '0 0 6px rgba(196,122,255,0.9)' }} />
            What We Do
          </div>
          <h2 className="text-section-title" style={{ color: '#F0F0F5' }}>
            Our <span className="gradient-text-purple-orange">Services</span>
          </h2>
          <p className="text-lg mt-5 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(138,139,168,0.9)' }}>
            From cinematic car shoots to full-stack digital marketing — everything your brand needs to dominate online.
          </p>
        </div>

        {/* Services bento grid — asymmetric layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
          {services.map((service, index) => {
            const isLarge = service.size === 'large';
            return (
              <div
                key={service.title}
                ref={(el) => { cardRefs.current[index] = el; }}
                className={`shimmer-card border-gradient rounded-2xl p-7 card-glow transition-all duration-500 group cursor-default relative overflow-hidden ${
                  isLarge ? 'lg:col-span-2' : ''
                }`}
                style={{
                  opacity: 0,
                  transitionDelay: `${index * 55}ms`,
                  background: 'var(--card)',
                }}
              >
                {/* Background number watermark */}
                <div
                  className="absolute top-3 right-4 text-7xl font-extrabold opacity-[0.03] leading-none select-none pointer-events-none"
                  style={{ color: service.accent === 'purple' ? '#C47AFF' : '#FF8C4A' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div
                  className={`w-13 h-13 rounded-xl flex items-center justify-center mb-6 transition-all duration-400 group-hover:scale-110 group-hover:rotate-3 ${
                    service.accent === 'purple' ? 'service-icon-purple' : 'service-icon-orange'
                  }`}
                  style={{ width: '52px', height: '52px' }}
                >
                  <ServiceIcon type={service.icon} accent={service.accent} />
                </div>

                {/* Content */}
                <h3 className="font-extrabold text-base mb-3 leading-tight" style={{ color: '#F0F0F5' }}>
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(138,139,168,0.85)' }}>
                  {service.description}
                </p>

                {/* Hover arrow */}
                <div
                  className="mt-5 flex items-center gap-1.5 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1"
                  style={{ color: service.accent === 'purple' ? '#C47AFF' : '#FF8C4A' }}
                >
                  Learn more
                  <ArrowRightIcon size={12} />
                </div>

                {/* Bottom glow line on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `linear-gradient(90deg, transparent, ${service.accent === 'purple' ? 'rgba(196,122,255,0.7)' : 'rgba(255,107,26,0.7)'}, transparent)` }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <div className="mt-16 border-gradient rounded-3xl p-10 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-bg-card" />
          <div className="orb-purple absolute opacity-20 pointer-events-none" style={{ width: '300px', height: '300px', top: '-100px', left: '-50px' }} />
          <div className="relative z-10">
            <p className="text-xl md:text-2xl font-extrabold leading-relaxed max-w-3xl mx-auto" style={{ color: '#F0F0F5' }}>
              We don&apos;t just run campaigns, we build brands that people{' '}
              <span style={{ color: '#C47AFF' }}>remember</span> and{' '}
              <span style={{ color: '#FF6B1A' }}>trust.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
