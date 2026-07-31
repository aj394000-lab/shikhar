import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import ServicesSection from '@/app/components/ServicesSection';
import PortfolioSection from '@/app/components/PortfolioSection';
import ProcessSection from '@/app/components/ProcessSection';
import ContactSection from '@/app/components/ContactSection';
import LeadPopup from '@/app/components/LeadPopup';

export default function HomePage() {
  return (
    <main className="relative bg-background overflow-x-hidden">
      {/* Noise overlay for premium texture */}
      <div className="noise-overlay fixed inset-0 z-[999] pointer-events-none opacity-30" />

      {/* Lead Capture Popup */}
      <LeadPopup />

      {/* Navigation */}
      <Header />

      {/* Page Sections */}
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <ProcessSection />
      <ContactSection />

      <Footer />
    </main>
  );
}