'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { InstagramIcon } from '@/components/ui/icons';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ borderTop: '1px solid rgba(30,32,64,0.8)' }}>
      {/* Subtle top glow */}
      <div className="divider-gradient absolute top-0 left-0 right-0" />
      <div className="orb-purple absolute opacity-10 pointer-events-none" style={{ width: '400px', height: '200px', top: '-50px', left: '50%', transform: 'translateX(-50%)' }} />

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + brand */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div
              className="w-8 h-8 relative rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105"
              style={{ boxShadow: '0 0 12px rgba(139,63,212,0.25)' }}
            >
              <AppImage
                src="/assets/images/image-1785475268438.png"
                alt="Creativva logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="font-extrabold tracking-tight" style={{ color: '#F0F0F5' }}>
              creativ<span className="gradient-text-purple-orange">va</span>
              <span style={{ color: '#FF6B1A' }}>.</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6 text-sm font-semibold" style={{ color: 'rgba(138,139,168,0.8)' }}>
            {['Services', 'Portfolio', 'Process', 'Contact'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="transition-colors duration-200 py-2.5 px-1 min-h-[44px] flex items-center hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Social + copyright */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/cre.ativva"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  border: '1px solid rgba(30,32,64,0.9)',
                  color: 'rgba(138,139,168,0.7)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(139,63,212,0.6)';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#C47AFF';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 12px rgba(139,63,212,0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(30,32,64,0.9)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(138,139,168,0.7)';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                }}
                aria-label="Instagram"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="mailto:creativvalab@gmail.com"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  border: '1px solid rgba(30,32,64,0.9)',
                  color: 'rgba(138,139,168,0.7)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,107,26,0.6)';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#FF8C4A';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 12px rgba(255,107,26,0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(30,32,64,0.9)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(138,139,168,0.7)';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                }}
                aria-label="Email"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
            <span className="text-sm hidden lg:block" style={{ color: 'rgba(138,139,168,0.5)' }}>
              © 2026 Creativva. All rights reserved.
            </span>
          </div>
        </div>

        {/* Mobile copyright */}
        <p className="text-sm text-center mt-6 lg:hidden" style={{ color: 'rgba(138,139,168,0.5)' }}>
          © 2026 Creativva. All rights reserved.
        </p>

        {/* Privacy/Terms row */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <a href="#" className="text-xs transition-colors py-2 min-h-[44px] flex items-center hover:text-white" style={{ color: 'rgba(138,139,168,0.45)' }}>Privacy Policy</a>
          <span style={{ color: 'rgba(30,32,64,0.8)' }}>·</span>
          <a href="#" className="text-xs transition-colors py-2 min-h-[44px] flex items-center hover:text-white" style={{ color: 'rgba(138,139,168,0.45)' }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}