"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useLenis } from "@/components/SmoothScroll";
import { footerContent, businessInfo } from "@/data/content";

interface FooterProps {
  onOpenReservation: () => void;
  onOpenMenu: () => void;
}

export default function Footer({ onOpenReservation, onOpenMenu }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { scrollTo } = useLenis();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer id="location-section" className="bg-[#FAF6EE] text-[#20201D] border-t border-[#DDD1BB] paper-grain">
      {/* Top Printed Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand & Story (4 cols) */}
          <div className="lg:col-span-4">
            <h3
              onClick={() => scrollTo(0, 0)}
              className="font-serif text-4xl font-bold tracking-tight text-[#20201D] cursor-pointer hover:text-[#C75037] transition-colors"
            >
              {footerContent.brand}
            </h3>
            <p className="font-serif italic text-lg text-[#C75037] mt-1">
              {footerContent.motto}
            </p>
            <p className="text-xs text-[#68655E] mt-4 leading-relaxed max-w-sm">
              {footerContent.description}
            </p>

            <div className="mt-6 flex flex-col gap-1 text-xs text-[#68655E]">
              <span>{businessInfo.addressLine1}</span>
              <span>{businessInfo.addressLine2}</span>
              <a
                href={`tel:${businessInfo.phoneTel}`}
                className="text-[#C75037] font-semibold hover:underline mt-1 inline-block"
              >
                {businessInfo.phone}
              </a>
            </div>
          </div>

          {/* Operating Hours (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#687052] mb-4">
              {footerContent.hoursTitle}
            </h4>
            <ul className="space-y-3 text-xs text-[#68655E]">
              {businessInfo.diningHours.map((item, idx) => {
                const isLast = idx === businessInfo.diningHours.length - 1;
                return (
                  <li
                    key={item.days}
                    className={`flex justify-between ${
                      isLast
                        ? "pb-1.5 text-[#9B978F]"
                        : "border-b border-dashed border-[#DDD1BB] pb-1.5"
                    }`}
                  >
                    <span className={isLast ? "" : "font-medium text-[#20201D]"}>
                      {item.days}
                    </span>
                    <span>{item.time}</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 p-3 bg-[#F2EADB] border border-[#DDD1BB] rounded-xs text-[11px] text-[#68655E]">
              {footerContent.barSeatingNotice}
            </div>
          </div>

          {/* Navigation & Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#687052] mb-4">
              {footerContent.indexTitle}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#68655E]">
              <li>
                <button
                  onClick={onOpenMenu}
                  className="hover:text-[#C75037] transition-colors cursor-pointer"
                >
                  Full Menu
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenReservation}
                  className="hover:text-[#C75037] transition-colors cursor-pointer"
                >
                  Reserve Table
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("#table-section", -60)}
                  className="hover:text-[#C75037] transition-colors cursor-pointer"
                >
                  Large Groups
                </button>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=184+Franklin+St+Brooklyn+NY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C75037] transition-colors"
                >
                  Google Maps ↗
                </a>
              </li>
              <li>
                <span className="text-[#9B978F]">G Train: Greenpoint Ave</span>
              </li>
            </ul>
          </div>

          {/* Seasonal Gazette / Newsletter (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#687052] mb-4">
              {footerContent.newsletterTitle}
            </h4>
            <p className="text-xs text-[#68655E] mb-3 leading-relaxed">
              {footerContent.newsletterText}
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    placeholder={footerContent.newsletterPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F2EADB] border border-[#DDD1BB] px-3 py-2.5 text-xs text-[#20201D] placeholder:text-[#9B978F] focus:outline-none focus:border-[#C75037] rounded-l-xs"
                  />
                  <button
                    type="submit"
                    className="bg-[#C75037] hover:bg-[#A93E27] text-[#FFFDF8] px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-r-xs transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <span className="block text-[10px] text-[#9B978F]">
                  {footerContent.newsletterFinePrint}
                </span>
              </form>
            ) : (
              <div className="bg-[#687052]/10 border border-[#687052]/30 p-3 rounded-xs text-xs text-[#687052] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#687052]" />
                <span>{footerContent.newsletterSuccess}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="mt-16 pt-8 border-t border-[#DDD1BB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9B978F] gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {footerContent.copyright}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>{businessInfo.address}</span>
            <span>·</span>
            <span>{footerContent.credit}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
