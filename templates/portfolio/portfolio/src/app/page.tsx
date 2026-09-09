import React from "react";
import { Navigation } from "@/components/Navigation";
import { ThoughtCursor } from "@/components/ThoughtCursor";
import { Hero } from "@/components/Hero";
import { RabbitHoles } from "@/components/RabbitHoles";
import { Work } from "@/components/Work";
import { BuildSection } from "@/components/BuildSection";
import { WritingSection } from "@/components/WritingSection";
import { PhysicsMoment } from "@/components/PhysicsMoment";
import { OutsideTheScreen } from "@/components/OutsideTheScreen";
import { About } from "@/components/About";
import { FutureSection } from "@/components/FutureSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { interruptionThoughts } from "@/data/content";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#090A0F] text-[#E7E6DF] selection:bg-[#8096C7] selection:text-[#090A0F]">
      {/* Subtle Desktop Ambient Thought Cursor */}
      <ThoughtCursor />

      {/* Adaptive Navigation */}
      <Navigation />

      {/* Section 1: Hero - Currently Becoming */}
      <Hero />

      {/* Monolithic Thought Interruption 1 */}
      <div className="w-full py-20 sm:py-28 px-6 sm:px-12 border-t border-white/[0.03] select-none bg-[#090A0F] flex items-center justify-center">
        <p
          className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-[-0.04em] text-white/[0.04] hover:text-white/[0.12] transition-colors duration-500 font-sans"
          data-thought={interruptionThoughts.interruption1.thought}
        >
          {interruptionThoughts.interruption1.text}
        </p>
      </div>

      {/* Section 2: Rabbit Holes */}
      <div id="rabbit-holes">
        <RabbitHoles />
      </div>

      {/* Section 3: Work - Things I Made */}
      <Work />

      {/* Monolithic Thought Interruption 2 */}
      <div className="w-full py-20 sm:py-28 px-6 sm:px-12 border-t border-white/[0.03] select-none bg-[#090A0F] flex items-center justify-center">
        <p
          className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-[-0.04em] text-white/[0.04] hover:text-white/[0.12] transition-colors duration-500 font-sans"
          data-thought={interruptionThoughts.interruption2.thought}
        >
          {interruptionThoughts.interruption2.text}
        </p>
      </div>

      {/* Section 4: The Build */}
      <BuildSection />

      {/* Section 5: Writing */}
      <WritingSection />

      {/* Section 6: Physics / Curiosity Moment */}
      <PhysicsMoment />

      {/* Monolithic Thought Interruption 3 */}
      <div className="w-full py-20 sm:py-28 px-6 sm:px-12 border-t border-white/[0.03] select-none bg-[#090A0F] flex items-center justify-center">
        <p
          className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-[-0.04em] text-white/[0.04] hover:text-white/[0.12] transition-colors duration-500 font-sans"
          data-thought={interruptionThoughts.interruption3.thought}
        >
          {interruptionThoughts.interruption3.text}
        </p>
      </div>

      {/* Section 7: Outside The Screen */}
      <OutsideTheScreen />

      {/* Section 8: About */}
      <About />

      {/* Section 9: Future (High Contrast Ivory) */}
      <FutureSection />

      {/* Section 10: Contact */}
      <ContactSection />

      {/* Section 11: Footer */}
      <Footer />
    </main>
  );
}
