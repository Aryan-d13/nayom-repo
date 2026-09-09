export interface Treatment {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

export const defaultSiteMetadata = {
  title: "FORM DENTAL · Chicago · Care, considered.",
  description:
    "Thoughtful dentistry for people who'd rather understand what's happening before anything happens. 1840 N Damen Avenue, Chicago.",
  keywords: [
    "Form Dental",
    "Dentist Chicago",
    "General Dentistry",
    "Cosmetic Dentistry",
    "Invisalign Chicago",
    "Restorative Dentistry",
  ],
};

export const defaultClinicInfo = {
  name: "FORM DENTAL",
  shortName: "FORM",
  tagline: "Care, considered.",
  location: "Chicago, Illinois",
  address: "1840 N Damen Avenue",
  cityStateZip: "Chicago, IL 60647",
  fullAddress: "1840 N Damen Avenue, Chicago",
  phone: "(312) 555-0184",
  phoneRaw: "+13125550184",
  email: "hello@formdental.example",
  hours: "Mon–Fri · 8 AM–5 PM",
  primaryCta: "Book a Visit",
  secondaryCta: "Meet the Team",
  copyright: "© 2026 Form Dental",
};

export const defaultNavbarContent = {
  mobileMenuLabel: "Menu",
};

export const defaultHeroContent = {
  eyebrow: "FORM DENTAL / CHICAGO",
  headlineLine1: "TAKE YOUR",
  headlineLine2: "TIME.",
  subheadingPrefix: "Good care starts ",
  subheadingSerif: "with a conversation.",
  copy: "Thoughtful dentistry for people who'd rather understand what's happening before anything happens.",
  cta: "BOOK A VISIT →",
  secondaryPhone: "(312) 555-0184",
  verticalBadge: "EST. IN CHICAGO",
  image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=85",
  imageAlt: "Calm portrait of dentist in warm soft daylight",
};

export const defaultBetterVisitContent = {
  eyebrow: "OUR APPROACH",
  heading: "A BETTER DENTAL VISIT ISN'T COMPLICATED.",
  statements: [
    {
      id: "listen",
      text: "Listen first.",
      detail: "Before any instrument is touched, we take time to understand your comfort and questions.",
    },
    {
      id: "explain",
      text: "Explain clearly.",
      detail: "Every scan, observation, and option is communicated plainly without jargon or pressure.",
    },
    {
      id: "treat",
      text: "Treat carefully.",
      detail: "Deliberate hands, gentle methods, and time reserved specifically so you never feel rushed.",
    },
  ],
  subtext: "We want you to know what we're doing, why we're doing it, and what comes next.",
};

export const defaultTreatmentsData: Treatment[] = [
  {
    id: "clean",
    title: "CLEAN",
    description: "Routine care, checkups and prevention.",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=85",
    alt: "Neatly organized precision dental instruments on clean linen",
  },
  {
    id: "restore",
    title: "RESTORE",
    description: "Repairs when something needs attention.",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1000&q=85",
    alt: "Delicate and focused hands handling precision restorative materials",
  },
  {
    id: "straighten",
    title: "STRAIGHTEN",
    description: "Clear aligners designed around everyday life.",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1000&q=85",
    alt: "Clean transparent aligner resting on stone surface in natural light",
  },
  {
    id: "refine",
    title: "REFINE",
    description: "Cosmetic work that still looks like you.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=85",
    alt: "Portrait of professional aesthetic dentist in modern clinic",
  },
];

export const defaultTreatmentsContent = {
  eyebrow: "TREATMENTS",
  heading: "Start with what you need.",
  disciplineCount: "04 Disciplines",
  chapterLabel: "CARE CHAPTER",
  inquirePrefix: "Inquire about",
  inquireSuffix: "care →",
};

export const defaultTheRoomContent = {
  eyebrow: "THE SPACE",
  headingPrefix: "A PLACE THAT FEELS ",
  headingSerif: "LIKE A PLACE.",
  cornerPhrases: [
    { label: "QUIET ROOMS.", position: "top-left" },
    { label: "NATURAL LIGHT.", position: "top-right" },
    { label: "NO RUSH.", position: "bottom-right" },
  ],
  image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1600&q=85",
  imageAlt: "Form Dental modern dental office operatory with ergonomic treatment chair, calm natural light, and quiet atmosphere",
};

export const defaultTeamContent = {
  eyebrow: "PEOPLE FIRST",
  dentist: "Dr. Claire Morgan",
  role: "General + Cosmetic Dentistry",
  quote: "“We can fix teeth. The first thing we should do is make sure you feel heard.”",
  paragraph: "We built Form around the idea that good dentistry should feel clear, calm and personal.",
  portrait: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=85",
  portraitAlt: "Portrait of Dr. Claire Morgan, lead dentist at Form Dental Chicago",
};

export const defaultFinalCtaContent = {
  eyebrow: "COME SEE US",
  headline: "LET'S START WITH A VISIT.",
  subheading: "No pressure. Just a conversation.",
  cta: "BOOK A VISIT →",
  phone: "(312) 555-0184",
  address: "1840 N Damen Avenue",
  bgImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85",
  bgAlt: "Softly lit interior courtyard with textured plaster and daylight",
};

export const navLinks = [
  { label: "Care", href: "#care" },
  { label: "Approach", href: "#approach" },
  { label: "Team", href: "#team" },
];

export const footerLinks = [
  { label: "Care", href: "#care" },
  { label: "Approach", href: "#approach" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
  { label: "Instagram", href: "https://instagram.com", external: true },
];

export const defaultFooterContent = {
  descriptor: "PRECISION · ARCHITECTURE · RESTRAINT",
  studioHeading: "Studio",
  indexHeading: "Index",
  bottomNote: "DESIGNED WITH QUIET PRECISION",
};

export const defaultBookingModalContent = {
  eyebrow: "Form Dental · Chicago",
  title: "Book a Visit.",
  description: "No pressure. We begin every new relationship with a simple, unhurried conversation.",
  nameLabel: "Your Name",
  namePlaceholder: "e.g. Sarah Jenkins",
  contactLabel: "Phone or Email",
  contactPlaceholder: "Where can we reach you?",
  topicLabel: "What is on your mind?",
  topics: [
    "General visit",
    "Clear aligners",
    "Restorative care",
    "Just a conversation",
  ],
  notesLabel: "Anything you would like us to know?",
  notesOptional: "(optional)",
  notesPlaceholder: "Preferences, past anxieties, or questions...",
  submitButton: "Request a Visit",
  callPrompt: "Prefer to talk now? Call ",
  successTitle: "We look forward to meeting you.",
  successMessagePrefix: "Thank you",
  successMessageSuffix: "during clinic hours (Mon–Fri, 8 AM–5 PM) to arrange your visit.",
  closeButton: "Close",
};
