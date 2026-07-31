'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-500 ${
        scrolled
          ? 'glass-nav shadow-xl'
          : 'bg-transparent'
      }`}
      style={scrolled ? { boxShadow: '0 4px 40px rgba(0,0,0,0.4), 0 1px 0 rgba(139,63,212,0.15)' } : {}}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-105"
            style={{ boxShadow: '0 0 20px rgba(139,63,212,0.3)' }}
          >
            <AppImage
              src="/assets/images/image-1785475268438.png"
              alt="Creativva logo — gradient purple-orange C-arrow on dark background"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-extrabold tracking-tight" style={{ color: '#F0F0F5' }}>
              creativ
            </span>
            <span className="text-xl font-extrabold tracking-tight gradient-text-purple-orange">
              va
            </span>
            <span className="text-xl font-extrabold" style={{ color: '#FF6B1A' }}>.</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks?.map((link) => (
            <a
              key={link?.label}
              href={link?.href}
              onMouseEnter={() => setActiveLink(link?.label)}
              onMouseLeave={() => setActiveLink('')}
              className="relative px-4 py-2 text-sm font-semibold transition-colors duration-200 tracking-wide rounded-lg group"
              style={{ color: activeLink === link?.label ? '#F0F0F5' : 'rgba(138,139,168,0.9)' }}
            >
              {link?.label}
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px transition-all duration-300"
                style={{
                  width: activeLink === link?.label ? '60%' : '0%',
                  background: 'linear-gradient(90deg, #9B4FE4, #FF6B1A)',
                }}
              />
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#contact"
            className="cta-gradient-btn text-white font-bold px-6 py-2.5 rounded-full text-sm tracking-wide"
            style={{ boxShadow: '0 0 20px rgba(139,63,212,0.3)' }}
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-200"
          style={{ color: '#F0F0F5', background: menuOpen ? 'rgba(139,63,212,0.15)' : 'transparent' }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>
      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 top-20 z-[400] backdrop-blur-2xl"
          style={{ background: 'rgba(6,7,15,0.97)', borderTop: '1px solid rgba(139,63,212,0.2)' }}
        >
          {/* Decorative orbs */}
          <div className="absolute top-10 left-10 w-40 h-40 orb-purple opacity-30 pointer-events-none" />
          <div className="absolute bottom-20 right-10 w-32 h-32 orb-orange opacity-20 pointer-events-none" />

          <nav className="relative flex flex-col items-center justify-center h-full gap-6 pb-20">
            {navLinks?.map((link, i) => (
              <a
                key={link?.label}
                href={link?.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-extrabold transition-all duration-200 tracking-tight"
                style={{
                  color: '#F0F0F5',
                  animationDelay: `${i * 60}ms`,
                }}
              >
                {link?.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="cta-gradient-btn text-white font-bold px-12 py-4 rounded-full text-lg mt-4"
              style={{ boxShadow: '0 0 30px rgba(139,63,212,0.4)' }}
            >
              Get Started
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
