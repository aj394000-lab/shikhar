'use client';
import React, { useEffect, useState } from 'react';
import AppImage from '@/components/ui/AppImage';

export default function CarIntro() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible');

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase('fading'), 3200);
    const goneTimer = setTimeout(() => setPhase('gone'), 4000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(goneTimer);
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] animated-gradient-bg flex flex-col items-center justify-center transition-opacity duration-700 ${
        phase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute blob-purple blob-morph"
          style={{ width: '600px', height: '600px', top: '-100px', left: '-100px' }}
        />
        <div
          className="absolute blob-orange blob-morph"
          style={{ width: '500px', height: '500px', bottom: '-80px', right: '-80px', animationDelay: '3s' }}
        />
      </div>

      {/* Spinning ring */}
      <div className="absolute w-96 h-96 rounded-full border border-primary/20 spin-slow" />
      <div
        className="absolute rounded-full border border-accent/10 spin-slow"
        style={{ width: '500px', height: '500px', animationDirection: 'reverse', animationDuration: '30s' }}
      />

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 relative">
              <AppImage
                src="/assets/images/image-1785475268438.png"
                alt="Creativva logo — gradient purple-orange C-arrow mark on dark background"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="text-4xl font-extrabold tracking-tight text-foreground">
                creativ
              </span>
              <span className="text-4xl font-extrabold tracking-tight gradient-text-purple-orange">
                va
              </span>
              <span className="text-accent text-4xl font-extrabold">.</span>
            </div>
          </div>
          <p className="text-muted-foreground text-xs tracking-[0.4em] uppercase mt-1 text-center">
            Digital Marketing Agency
          </p>
        </div>

        {/* 3D Car visual */}
        <div
          className="intro-car-stage relative"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="car-3d-rotate">
            <div className="relative w-72 h-44 md:w-96 md:h-56">
              {/* Car silhouette using SVG */}
              <svg
                viewBox="0 0 400 200"
                className="w-full h-full drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 30px rgba(123,47,190,0.6)) drop-shadow(0 0 60px rgba(249,115,22,0.3))' }}
              >
                {/* Ground reflection */}
                <ellipse cx="200" cy="185" rx="160" ry="12" fill="rgba(123,47,190,0.15)" />
                {/* Car body */}
                <path
                  d="M60 140 L60 110 L100 75 L160 60 L240 58 L300 72 L340 110 L340 140 Z"
                  fill="url(#carBodyGrad)"
                  strokeWidth="1.5"
                  stroke="rgba(123,47,190,0.8)"
                />
                {/* Roof */}
                <path
                  d="M110 110 L140 75 L200 65 L260 65 L295 110 Z"
                  fill="url(#roofGrad)"
                  strokeWidth="1"
                  stroke="rgba(168,85,247,0.6)"
                />
                {/* Windows */}
                <path d="M118 108 L143 80 L195 72 L195 108 Z" fill="rgba(200,220,255,0.15)" stroke="rgba(168,85,247,0.4)" strokeWidth="0.8" />
                <path d="M200 72 L255 72 L285 108 L200 108 Z" fill="rgba(200,220,255,0.15)" stroke="rgba(168,85,247,0.4)" strokeWidth="0.8" />
                {/* Wheels */}
                <circle cx="115" cy="142" r="22" fill="url(#wheelGrad)" stroke="rgba(249,115,22,0.6)" strokeWidth="1.5" />
                <circle cx="115" cy="142" r="12" fill="#1A1B2E" stroke="rgba(249,115,22,0.8)" strokeWidth="1" />
                <circle cx="285" cy="142" r="22" fill="url(#wheelGrad)" stroke="rgba(249,115,22,0.6)" strokeWidth="1.5" />
                <circle cx="285" cy="142" r="12" fill="#1A1B2E" stroke="rgba(249,115,22,0.8)" strokeWidth="1" />
                {/* Headlights */}
                <path d="M330 115 L340 115 L340 125 L330 122 Z" fill="url(#lightGrad)" opacity="0.9" />
                {/* Taillights */}
                <path d="M60 115 L70 118 L70 128 L60 125 Z" fill="#F97316" opacity="0.8" />
                {/* Speed lines */}
                <line x1="0" y1="100" x2="55" y2="100" stroke="url(#speedGrad)" strokeWidth="2" opacity="0.6" />
                <line x1="0" y1="115" x2="50" y2="115" stroke="url(#speedGrad)" strokeWidth="1.5" opacity="0.4" />
                <line x1="0" y1="130" x2="45" y2="130" stroke="url(#speedGrad)" strokeWidth="1" opacity="0.3" />

                <defs>
                  <linearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1A1B2E" />
                    <stop offset="50%" stopColor="#12103A" />
                    <stop offset="100%" stopColor="#0A0B1A" />
                  </linearGradient>
                  <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2A1F4A" />
                    <stop offset="100%" stopColor="#1A1B2E" />
                  </linearGradient>
                  <radialGradient id="wheelGrad" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#2A2B45" />
                    <stop offset="100%" stopColor="#0A0B1A" />
                  </radialGradient>
                  <linearGradient id="lightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#FFF3E0" />
                  </linearGradient>
                  <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="100%" stopColor="#7B2FBE" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Glow under car */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-4 blur-xl"
                style={{ background: 'rgba(123,47,190,0.4)' }}
              />
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div
          className="animate-slide-up text-center"
          style={{ animationDelay: '0.8s', opacity: 0 }}
        >
          <p className="text-muted-foreground text-sm tracking-wider">
            Where <span className="text-primary font-semibold">Creativity</span> Meets{' '}
            <span className="text-accent font-semibold">Results.</span>
          </p>
        </div>
      </div>

      {/* Loading bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48">
        <div className="h-0.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #7B2FBE, #F97316)',
              animation: 'loadBar 3s ease-out forwards',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loadBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}