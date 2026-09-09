import { Phone, MapPin, Mail, Clock } from "lucide-react";
import { footerContent, businessInfo } from "@/data/content";

export default function Footer() {
  return (
    <footer className="bg-asphalt text-road-white border-t border-white/10 pt-20 pb-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-signal-red" />
              <span className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                {footerContent.brandName}
              </span>
            </div>

            <p className="font-display text-base uppercase tracking-wider text-signal-red font-semibold">
              {footerContent.tagline}
            </p>

            <p className="font-sans text-sm text-metal leading-relaxed max-w-sm">
              {footerContent.manifesto}
            </p>

            <div className="pt-2 font-mono text-xs text-metal/70">
              {footerContent.establishment}
            </div>
          </div>

          {/* Services Index */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs uppercase tracking-widest text-metal mb-4 font-bold border-b border-white/10 pb-1">
              {footerContent.servicesHeader}
            </h4>
            <ul className="space-y-2.5 font-sans text-sm text-pale-gray">
              {footerContent.services.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="hover:text-signal-red transition-colors block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs uppercase tracking-widest text-metal mb-4 font-bold border-b border-white/10 pb-1">
              {footerContent.exploreHeader}
            </h4>
            <ul className="space-y-2.5 font-sans text-sm text-pale-gray">
              {footerContent.links.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="hover:text-signal-red transition-colors block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="lg:col-span-3 space-y-3 font-mono text-xs text-metal">
            <h4 className="font-mono text-xs uppercase tracking-widest text-metal mb-4 font-bold border-b border-white/10 pb-1">
              {footerContent.locationHeader}
            </h4>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-signal-red shrink-0 mt-0.5" />
              <div>
                <span className="text-road-white font-medium block">{footerContent.addressLine1}</span>
                <span>{footerContent.addressLine2}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <Phone className="w-4 h-4 text-signal-red shrink-0" />
              <a
                href={businessInfo.phoneRaw}
                className="text-road-white font-bold hover:text-signal-red transition-colors"
              >
                {footerContent.phone}
              </a>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <Mail className="w-4 h-4 text-signal-red shrink-0" />
              <a
                href={`mailto:${footerContent.email}`}
                className="text-road-white hover:text-signal-red transition-colors"
              >
                {footerContent.email}
              </a>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-white/10">
              <Clock className="w-4 h-4 text-metal shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                {footerContent.hours.map((h, i) => (
                  <div key={i} className={i === 2 ? "text-white/40" : ""}>{h}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Baseline Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-metal/70">
          <div>
            {footerContent.copyright}
          </div>
          <div className="flex items-center gap-6">
            <span>{footerContent.locationTag}</span>
            <span className="text-white/20">|</span>
            <span className="text-signal-red font-medium">{footerContent.sloganTag}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
