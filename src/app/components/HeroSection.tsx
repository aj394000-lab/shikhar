'use client';
import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { ArrowRightIcon } from '@/components/ui/icons';
import { gradientTextStyle } from '@/lib/styles';

const PARTICLES = [
  { x: '15%', y: '25%', size: 3, dur: 7, delay: 0 },
  { x: '80%', y: '15%', size: 2, dur: 9, delay: 1.5 },
  { x: '65%', y: '70%', size: 4, dur: 6, delay: 0.8 },
  { x: '30%', y: '80%', size: 2, dur: 8, delay: 2 },
  { x: '90%', y: '45%', size: 3, dur: 10, delay: 0.3 },
  { x: '50%', y: '10%', size: 2, dur: 7.5, delay: 1.2 },
  { x: '10%', y: '60%', size: 3, dur: 8.5, delay: 0.6 },
];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        if (heroImageRef.current) {
          heroImageRef.current.style.transform = `scale(1.06) translate(${x * -10}px, ${y * -5}px)`;
        }
        rafRef.current = null;
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-end overflow-hidden"
      style={{ background: '#04040C' }}
    >
      {/* Full-bleed car image with parallax */}
      <div
        ref={heroImageRef}
        className="absolute inset-0 z-0"
        style={{
          transform: 'scale(1.06)',
          transition: 'transform 1.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <AppImage
          src="/assets/images/luxury-car-hero.png"
          alt="Sleek luxury sports car on dark road with dramatic purple and orange studio lighting — cinematic automotive photography"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Multi-layer cinematic overlays */}
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, rgba(4,4,12,0.97) 0%, rgba(4,4,12,0.72) 45%, rgba(4,4,12,0.2) 100%)' }} />
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, rgba(4,4,12,1) 0%, rgba(4,4,12,0.5) 35%, transparent 65%)' }} />
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to bottom, rgba(4,4,12,0.6) 0%, transparent 20%)' }} />

      {/* Purple atmospheric glow — deep left */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{
          width: '700px',
          height: '700px',
          bottom: '-150px',
          left: '-150px',
          background: 'radial-gradient(ellipse, rgba(139,63,212,0.22) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Orange accent glow — mid right */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          top: '20%',
          right: '5%',
          background: 'radial-gradient(ellipse, rgba(255,107,26,0.12) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Floating particles */}
      {mounted && PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute z-10 pointer-events-none rounded-full particle"
          style={{
            left: p.x,
            top: p.y,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: i % 2 === 0
              ? 'rgba(196,122,255,0.7)'
              : 'rgba(255,107,26,0.6)',
            boxShadow: i % 2 === 0
              ? '0 0 8px rgba(196,122,255,0.8)'
              : '0 0 8px rgba(255,107,26,0.8)',
            ['--duration' as string]: `${p.dur}s`,
            ['--delay' as string]: `${p.delay}s`,
          }}
        />
      ))}

      {/* Top scanline — cinematic detail */}
      <div className="absolute top-0 left-0 right-0 z-20 h-px scanline-top" />

      {/* Vertical accent line */}
      <div
        className="absolute left-0 top-0 bottom-0 z-20 w-px pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(139,63,212,0.5) 30%, rgba(255,107,26,0.3) 70%, transparent)' }}
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-14 pb-24 pt-44">
        <div className="max-w-[680px]">

          {/* Badge row */}
          <div
            className="flex items-center gap-5 mb-10 animate-slide-up"
            style={{ animationDelay: '4.2s', opacity: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.25em] uppercase tag-pill-purple">
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: '#C47AFF', boxShadow: '0 0 6px rgba(196,122,255,0.9)' }}
              />
              Creativva Studio
            </div>
            <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, rgba(255,107,26,0.7), transparent)' }} />
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: 'rgba(255,107,26,0.9)' }}>2026</span>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
              <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Premium</span>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
              <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>V8</span>
            </div>
          </div>

          {/* Main headline */}
          <div
            className="animate-slide-up"
            style={{ animationDelay: '4.4s', opacity: 0 }}
          >
            <h1
              className="font-extrabold leading-none tracking-tight mb-1"
              style={{ fontSize: 'clamp(3.4rem, 8.5vw, 8rem)', color: '#EEEEF5', letterSpacing: '-0.035em' }}
            >
              Embark On The
            </h1>
            <h1
              className="font-extrabold leading-none tracking-tight mb-1 glow-text-purple"
              style={{
                fontSize: 'clamp(3.4rem, 8.5vw, 8rem)',
                letterSpacing: '-0.035em',
                ...gradientTextStyle('linear-gradient(135deg, #9B4FE4 0%, #C47AFF 40%, #FF6B1A 100%)'),
              }}
            >
              Journey Of Luxury
            </h1>
            <h1
              className="font-extrabold leading-none tracking-tight mb-1"
              style={{ fontSize: 'clamp(3.4rem, 8.5vw, 8rem)', color: '#EEEEF5', letterSpacing: '-0.035em' }}
            >
              – Your Dream Car
            </h1>
            <h1
              className="font-extrabold leading-none tracking-tight glow-text-orange"
              style={{ fontSize: 'clamp(3.4rem, 8.5vw, 8rem)', color: 'rgba(255,107,26,0.98)', letterSpacing: '-0.035em' }}
            >
              Awaits.
            </h1>
          </div>

          {/* Subtext */}
          <p
            className="mt-9 text-base md:text-lg leading-relaxed max-w-[520px] animate-slide-up"
            style={{ color: 'rgba(240,240,245,0.5)', animationDelay: '4.7s', opacity: 0, fontWeight: 400 }}
          >
            We craft cinematic content, bold brand identities, and high-performance digital strategies for automotive and lifestyle brands that demand excellence.
          </p>

          {/* CTA row */}
          <div
            className="flex flex-wrap items-center gap-4 mt-11 animate-slide-up"
            style={{ animationDelay: '4.9s', opacity: 0 }}
          >
            <a
              href="#contact"
              className="cta-gradient-btn inline-flex items-center gap-2.5 px-9 py-4 rounded-full font-bold text-sm tracking-wide text-white"
              style={{ boxShadow: '0 0 40px rgba(139,63,212,0.45)' }}
            >
              Start Your Journey
              <ArrowRightIcon size={16} />
            </a>
            <a
              href="#portfolio"
              className="magnetic-btn inline-flex items-center gap-2.5 px-9 py-4 rounded-full font-bold text-sm tracking-wide transition-all duration-300"
              style={{
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(240,240,245,0.75)',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
              }}
            >
              View Our Work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>

          {/* Stats row */}
          <div
            className="flex items-center gap-10 mt-16 pt-8 animate-slide-up"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)', animationDelay: '5.1s', opacity: 0 }}
          >
            {[
              { value: '150+', label: 'Projects Delivered' },
              { value: '50+', label: 'Happy Clients' },
              { value: '3×', label: 'Average ROI' },
            ].map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.08)' }} />}
                <div>
                  <p
                    className="text-3xl font-extrabold"
                    style={{
                      ...gradientTextStyle('linear-gradient(135deg, #C47AFF, #FF6B1A)'),
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs mt-1 font-medium" style={{ color: 'rgba(240,240,245,0.38)', letterSpacing: '0.06em' }}>{stat.label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-40 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #04040C)' }} />

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 right-12 z-20 flex flex-col items-center gap-2 animate-slide-up"
        style={{ animationDelay: '5.4s', opacity: 0 }}
      >
        <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.25)', writingMode: 'vertical-rl' }}>Scroll</span>
        <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, rgba(139,63,212,0.6), transparent)' }} />
      </div>
    </section>
  );
}