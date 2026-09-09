"use client";

import React from "react";
import Image from "next/image";
import { projectCollageContent } from "@/data/content";

export function ProjectCollage() {
  return (
    <section
      id="the-work"
      className="relative bg-[#F4F0E7] text-[#15212A] py-20 sm:py-24 md:py-28 overflow-hidden border-t border-[#15212A]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-14">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#397A91] block mb-2 font-medium">
            {projectCollageContent.sectionNumber}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-[#15212A]">
            {projectCollageContent.heading}
          </h2>
        </div>

        {/* Compact Editorial Asymmetric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
          {projectCollageContent.projects.map((project) => (
            <div
              key={project.id}
              className={`${project.aspectClass || "lg:col-span-6 aspect-16/9"} group relative overflow-hidden bg-[#E8DFD0] border border-[#15212A]/10`}
            >
              <Image
                src={project.image}
                alt={project.alt || project.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 650px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#15212A]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-[#F4F0E7] transform transition-transform duration-300 ease-out translate-y-1 group-hover:translate-y-0">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#D8E9EA] block">
                  {project.location}
                </span>
                <p className="text-sm sm:text-base font-normal tracking-wide text-white mt-0.5">
                  {project.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
