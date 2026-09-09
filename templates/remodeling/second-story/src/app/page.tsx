"use client";

import React, { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScrollTransformation from "@/components/ScrollTransformation";
import RoomExplorer from "@/components/RoomExplorer";
import MaterialPalette from "@/components/MaterialPalette";
import ProcessTimeline from "@/components/ProcessTimeline";
import ProjectStories from "@/components/ProjectStories";
import TeamSection from "@/components/TeamSection";
import FinalTransformation from "@/components/FinalTransformation";
import Footer from "@/components/Footer";
import ProjectModal from "@/components/ProjectModal";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import { ProjectStory } from "@/data/content";

export default function Home() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Kitchen");
  const [activeProjectModal, setActiveProjectModal] =
    useState<ProjectStory | null>(null);

  const handleOpenInquiry = (service?: string) => {
    if (service) setSelectedService(service);
    setIsInquiryOpen(true);
  };

  const handleCloseInquiry = () => {
    setIsInquiryOpen(false);
  };

  const handleOpenProject = (project: ProjectStory) => {
    setActiveProjectModal(project);
  };

  const handleCloseProject = () => {
    setActiveProjectModal(null);
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-chalk text-ink flex flex-col selection:bg-terracotta/20 selection:text-ink">
        {/* 1. Header & Minimal Navigation */}
        <Navbar onOpenInquiry={() => handleOpenInquiry()} />

        <main className="flex-1">
          {/* 2. Hero — The House You Already Have */}
          <Hero onOpenInquiry={() => handleOpenInquiry()} />

          {/* 3. First Transformation — Kitchen Reveal Curtain */}
          <ScrollTransformation />

          {/* 4. "What Could Change?" — Room Explorer */}
          <RoomExplorer
            onSelectService={(svc) => handleOpenInquiry(svc)}
          />

          {/* 5. Materials — Touch the Project (Oversized tactile swatches) */}
          <MaterialPalette />

          {/* 6. Process — "Before We Build" (Ink dark background) */}
          <ProcessTimeline />

          {/* 7. Project Stories (3 homes, asymmetric layout, hover before/after) */}
          <ProjectStories onOpenProject={handleOpenProject} />

          {/* 8. The People Behind It (Maya Chen, unposed, human) */}
          <TeamSection />

          {/* 9. Final Transformation (Climactic return to hero room) */}
          <FinalTransformation onOpenInquiry={() => handleOpenInquiry()} />
        </main>

        {/* 10. Warm Stone Footer */}
        <Footer onOpenInquiry={() => handleOpenInquiry()} />

        {/* Modals */}
        <ProjectModal
          isOpen={isInquiryOpen}
          onClose={handleCloseInquiry}
          initialService={selectedService}
        />

        <ProjectDetailModal
          project={activeProjectModal}
          onClose={handleCloseProject}
          onStartProject={() => handleOpenInquiry(activeProjectModal?.type)}
        />
      </div>
    </SmoothScroll>
  );
}
