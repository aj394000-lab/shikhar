'use client';
import React, { useState, useRef, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';

const portfolioItems = [
  {
    id: 1,
    title: 'Supercar Cinematic Reel',
    category: 'Video Editing',
    thumbnail: "https://images.unsplash.com/photo-1664767289413-279326324666?auto=format&fit=crop&w=1100&q=80",
    alt: 'Red sports car on dark background with dramatic lighting and motion blur, atmospheric cinematic shot',
    span: 'col-span-1 sm:col-span-2',
    featured: true,
    instagram: 'https://www.instagram.com/cre.ativva',
  },
  {
    id: 2,
    title: 'Toyota Fortuner Film Lookbook',
    category: 'Automotive Lifestyle',
    thumbnail: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1100&q=80",
    alt: 'Toyota Fortuner parked on a scenic mountain road with cinematic light',
    span: 'col-span-1',
    featured: false,
    instagram: 'https://www.instagram.com/cre.ativva',
  },
  {
    id: 3,
    title: 'Electric Sports Motion',
    category: 'Creative Direction',
    thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1100&q=80",
    alt: 'Sleek sports car captured in motion at dusk, breaking through a cinematic street scene',
    span: 'col-span-1',
    featured: false,
    instagram: 'https://www.instagram.com/cre.ativva',
  },
  {
    id: 4,
    title: 'Dealership Meta Ad Campaign',
    category: 'Paid Advertising',
    thumbnail: "https://images.unsplash.com/photo-1691006961338-8a35d7641ea0?auto=format&fit=crop&w=1100&q=80",
    alt: 'Orange Porsche on track with motion blur background, low key lighting, dark tunnel environment',
    span: 'col-span-1',
    featured: false,
    instagram: 'https://www.instagram.com/cre.ativva',
  },
  {
    id: 5,
    title: 'Brand Identity Reveal',
    category: 'Brand Strategy',
    thumbnail: "https://images.unsplash.com/photo-1731988666788-6f0251886c1b?auto=format&fit=crop&w=1100&q=80",
    alt: 'Close-up of black car hood with dramatic studio lighting creating deep shadows and metallic reflections',
    span: 'col-span-1',
    featured: false,
    instagram: 'https://www.instagram.com/cre.ativva',
  },
];

interface PortfolioCardProps {
  item: typeof portfolioItems[0];
  index: number;
}

const PortfolioCard = ({ item }: PortfolioCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={item.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className={`${item.span} relative rounded-2xl overflow-hidden group cursor-pointer block`}
      style={{
        aspectRatio: item.featured ? 1.7 : 1.25,
        minHeight: item.featured ? 320 : 220,
        width: '100%',
        border: '1px solid rgba(30,32,64,0.6)',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 0 48px rgba(139,63,212,0.22), 0 24px 72px rgba(0,0,0,0.45)' : '0 4px 24px rgba(0,0,0,0.28)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`View ${item.title} on Instagram`}
    >
      <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full bg-[#8B3FD4]/20 blur-3xl animate-portfolio-blob pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-[#FF8C4A]/15 blur-3xl animate-portfolio-blob-delayed pointer-events-none" />
      <style>{`
        .portfolio-pan-${item.id} { transition: transform 0.7s ease; }
        .portfolio-pan-${item.id}.hovered { animation: pan-${item.id} 3s ease-in-out infinite; transform-origin: center; }
        @keyframes pan-${item.id} {
          0% { transform: scale(1.03) translateX(0); }
          50% { transform: scale(1.06) translateX(-6px); }
          100% { transform: scale(1.03) translateX(0); }
        }
        .animate-portfolio-blob { animation: portfolio-blob 8s ease-in-out infinite; }
        .animate-portfolio-blob-delayed { animation: portfolio-blob 8s ease-in-out 2s infinite; }
        @keyframes portfolio-blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(8px, -8px) scale(1.05); }
          50% { transform: translate(0, 10px) scale(1); }
          75% { transform: translate(-8px, -4px) scale(1.02); }
        }
      `}</style>
      <AppImage
        src={item.thumbnail}
        alt={item.alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`object-cover portfolio-pan-${item.id} ${isHovered ? 'hovered' : ''}`}
      />
 
      {/* Base overlay */}
      <div className="video-card-overlay absolute inset-0" />

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-400 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(135deg, rgba(139,63,212,0.15) 0%, rgba(255,107,26,0.08) 100%)' }}
      />


      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{
              background: 'rgba(139,63,212,0.2)',
              border: '1px solid rgba(139,63,212,0.35)',
              color: '#C47AFF',
              backdropFilter: 'blur(8px)',
            }}
          >
            {item.category}
          </div>
        </div>
        <h3 className="font-extrabold text-base leading-tight" style={{ color: '#F0F0F5' }}>{item.title}</h3>
        <div className="mt-2">
          {item.instagram && (
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)', color: '#F0F0F5' }}
              title="View on Instagram"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: '#F0567A' }}>
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span style={{ color: 'rgba(240,240,245,0.9)' }}>@cre.ativva</span>
            </div>
          )}
        </div>
      </div>

      {/* Featured badge */}
      {item.featured && (
        <div
          className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            background: 'rgba(255,107,26,0.18)',
            border: '1px solid rgba(255,107,26,0.35)',
            color: '#FF8C4A',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF6B1A', boxShadow: '0 0 6px rgba(255,107,26,0.9)' }} />
          Featured Work
        </div>
      )}
    </a>
  );
};

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && titleRef.current) {
            titleRef.current.classList.add('animate-slide-up');
            titleRef.current.style.opacity = '1';
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="portfolio" ref={sectionRef} className="py-28 relative overflow-hidden aurora-bg">
      <div className="absolute inset-0 pointer-events-none">
        <div className="divider-gradient absolute top-0 left-0 right-0" />
        <div className="orb-orange absolute opacity-20" style={{ width: '600px', height: '600px', top: '5%', right: '-150px' }} />
        <div className="orb-purple absolute opacity-10" style={{ width: '400px', height: '400px', bottom: '10%', left: '-100px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div ref={titleRef} className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6" style={{ opacity: 0 }}>
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full tag-pill-orange text-xs font-bold tracking-[0.2em] uppercase mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#FF8C4A', boxShadow: '0 0 6px rgba(255,140,74,0.9)' }} />
              Our Work
            </div>
            <h2 className="text-section-title" style={{ color: '#F0F0F5' }}>
              Car <span className="gradient-text-purple-orange">Portfolio</span>
            </h2>
            <p className="mt-3 max-w-md leading-relaxed" style={{ color: 'rgba(138,139,168,0.85)' }}>
              Cinematic shoots, high-energy edits, and campaigns that make car brands impossible to ignore.
            </p>
          </div>
          <a
            href="#contact"
            className="magnetic-btn inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-full text-sm transition-all duration-300 flex-shrink-0"
            style={{
              border: '1px solid rgba(30,32,64,0.9)',
              color: '#F0F0F5',
              background: 'rgba(13,14,31,0.6)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(139,63,212,0.5)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#C47AFF';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(30,32,64,0.9)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#F0F0F5';
            }}
          >
            Commission a Shoot
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min">
          {portfolioItems.map((item, index) => (
            <PortfolioCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* View all CTA */}
        <div className="mt-10 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200"
            style={{ color: 'rgba(138,139,168,0.6)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#F0F0F5'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(138,139,168,0.6)'; }}
          >
            View complete portfolio → Contact us for a full reel
          </a>
        </div>
      </div>
    </section>
  );
}
