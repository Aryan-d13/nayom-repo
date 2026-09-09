import React from 'react';
import HeroSection from '../components/HeroSection';
import TechStackSection from '../components/TechStackSection';
import ProjectsSection from '../components/ProjectsSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <TechStackSection />
      <ProjectsSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
}
