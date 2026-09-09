import React from 'react';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FaqSection from '../components/FaqSection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
      <FaqSection />
    </div>
  );
}
