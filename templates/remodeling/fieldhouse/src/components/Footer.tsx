import { FOOTER_CONTENT, BRAND } from "@/data/content";

export default function Footer() {
  return (
    <footer
      className="bg-parchment text-ink border-t border-dust/60 py-16 sm:py-20"
      aria-label="Fieldhouse Site Footer"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-dust/50">
          
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[0.16em] text-ink uppercase">
                {FOOTER_CONTENT.brand}
              </h2>
              <p className="font-serif italic text-lg sm:text-xl text-moss mt-2 font-normal">
                {FOOTER_CONTENT.tagline}
              </p>
            </div>

            <div className="mt-8 text-xs text-ink/70 leading-relaxed max-w-sm">
              {FOOTER_CONTENT.description}
            </div>
          </div>

          {/* Links Column */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-sans uppercase tracking-[0.25em] text-moss font-bold mb-4">
              {FOOTER_CONTENT.navHeading}
            </h3>
            <ul className="space-y-3">
              {FOOTER_CONTENT.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs uppercase tracking-[0.15em] text-ink/80 hover:text-terracotta transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-sans uppercase tracking-[0.25em] text-moss font-bold mb-4">
              {FOOTER_CONTENT.servicesHeading}
            </h3>
            <ul className="space-y-3">
              {FOOTER_CONTENT.services.map((service) => (
                <li key={service} className="text-xs tracking-wider text-ink/80">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-sans uppercase tracking-[0.25em] text-moss font-bold mb-4">
              {FOOTER_CONTENT.contactHeading}
            </h3>
            <div className="space-y-3 text-xs tracking-wider text-ink/80">
              <p>
                <a
                  href={`tel:${BRAND.phoneRaw}`}
                  className="hover:text-terracotta transition-colors"
                >
                  {FOOTER_CONTENT.contact.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${FOOTER_CONTENT.contact.email}`}
                  className="hover:text-terracotta transition-colors"
                >
                  {FOOTER_CONTENT.contact.email}
                </a>
              </p>
              <p className="text-ink/65">
                {FOOTER_CONTENT.contact.location}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Colophon */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-ink/60 uppercase tracking-widest gap-4">
          <div>{FOOTER_CONTENT.copyright}</div>
          <div className="flex items-center space-x-6">
            <span>{FOOTER_CONTENT.colophon.descriptor}</span>
            <span>{FOOTER_CONTENT.colophon.separator}</span>
            <span>{FOOTER_CONTENT.colophon.location}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
