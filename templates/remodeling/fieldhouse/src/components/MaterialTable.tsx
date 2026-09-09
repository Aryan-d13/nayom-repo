import Image from "next/image";
import { MATERIAL_TABLE_CONTENT } from "@/data/content";

export default function MaterialTable() {
  return (
    <section
      id="materials"
      className="py-24 sm:py-32 md:py-40 bg-warm-white border-t border-dust/30 relative"
      aria-label="Material Table: Good Materials Don't Need To Shout"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Editorial Statement Header */}
        <div className="mb-14 sm:mb-20 max-w-4xl">
          <div className="text-[11px] font-sans uppercase tracking-[0.25em] text-moss font-semibold mb-4">
            {MATERIAL_TABLE_CONTENT.sectionTag}
          </div>

          <h2 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] text-ink uppercase">
            {MATERIAL_TABLE_CONTENT.headlineLines.map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
            <span className="font-serif italic font-normal normal-case text-terracotta tracking-normal">
              {MATERIAL_TABLE_CONTENT.serifAccent}
            </span>
          </h2>

          <p className="text-base sm:text-lg text-ink/75 max-w-xl font-normal mt-6 leading-relaxed">
            {MATERIAL_TABLE_CONTENT.description}
          </p>
        </div>

        {/* Large Photographic Work Table Composition - Clean without overlays */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-parchment shadow-[0_20px_50px_-20px_rgba(35,35,33,0.18)]">
          <Image
            src={MATERIAL_TABLE_CONTENT.image}
            alt={MATERIAL_TABLE_CONTENT.imageAlt}
            fill
            sizes="100vw"
            className="object-cover object-center filter saturate-[0.88] contrast-[1.03]"
          />
        </div>

        {/* Clean Architectural Material Grid below photograph */}
        <div className="mt-12 pt-8 border-t border-dust/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MATERIAL_TABLE_CONTENT.samples.map((sample, idx) => (
            <div key={sample.id} className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs text-moss font-semibold">
                  0{idx + 1}
                </span>
                <span className="h-[1px] w-6 bg-dust/60" />
                <h3 className="font-sans font-bold text-sm tracking-[0.15em] text-ink uppercase">
                  {sample.name}
                </h3>
              </div>
              <p className="text-sm text-ink/75 leading-relaxed font-serif italic">
                {sample.descriptor}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
