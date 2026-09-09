"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatWeKeep from "@/components/WhatWeKeep";
import Transformations from "@/components/Transformations";
import ThePlan from "@/components/ThePlan";
import MaterialTable from "@/components/MaterialTable";
import ThePeople from "@/components/ThePeople";
import FinalStay from "@/components/FinalStay";
import Footer from "@/components/Footer";
import ProjectModal from "@/components/ProjectModal";

export default function Home() {
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-warm-white text-ink flex flex-col selection:bg-terracotta/20 selection:text-ink">
      {/* Refined Architectural Navigation */}
      <Navbar onOpenProjectModal={() => setProjectModalOpen(true)} />

      {/* Main Experience: 5 Major Sections */}
      <main id="main-content" className="flex-grow">
        {/* 1. Hero: "Keep the Good Parts" */}
        <Hero onOpenProjectModal={() => setProjectModalOpen(true)} />

        {/* 2. Preservation: "What Do We Keep?" */}
        <WhatWeKeep />

        {/* 3. Transformations: "Then We Change What Needs Changing" */}
        <Transformations />

        {/* 4. Spatial Intelligence & Materiality: "The Plan" + "Material Table" */}
        <ThePlan onOpenProjectModal={() => setProjectModalOpen(true)} />
        <MaterialTable />

        {/* 5. Team & Final Stay Invitation: "The People" + Final CTA "Stay" */}
        <ThePeople onOpenProjectModal={() => setProjectModalOpen(true)} />
        <FinalStay onOpenProjectModal={() => setProjectModalOpen(true)} />
      </main>

      {/* Architectural Editorial Footer */}
      <Footer />

      {/* Plan a Project Consultation Drawer */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />
    </div>
  );
}
