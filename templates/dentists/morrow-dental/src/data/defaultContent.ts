export interface TreatmentNote {
  id: string;
  title: string;
  sentence: string;
  annotation: string;
  image: string;
  secondaryCrop: string;
  alt: string;
}

export interface PhilosophyPillar {
  id: string;
  word: string;
  description: string;
  image: string;
  alt: string;
}

export interface DetailImage {
  id: string;
  title: string;
  image: string;
  alt: string;
  offsetY: number;
}

export const defaultSiteMetadata = {
  title: "MORROW DENTAL — Keep it looking like you. | Los Angeles",
  description:
    "Thoughtful dental care focused on health, comfort, and natural-looking results. General and cosmetic dentistry at 812 North Fairfax Avenue, Los Angeles.",
  keywords: [
    "Morrow Dental",
    "Los Angeles Dentist",
    "Fairfax Avenue Dental",
    "Cosmetic Dentistry",
    "Natural Smile",
    "Veneers",
    "Clear Aligners",
    "Restorative Care",
  ],
  authors: [{ name: "Morrow Dental" }],
  openGraph: {
    title: "MORROW DENTAL — A Good Smile Looks Like You",
    description:
      "Thoughtful dental care focused on health, comfort, and natural-looking results in Los Angeles.",
    type: "website",
    locale: "en_US",
  },
};

export const defaultClinicData = {
  name: "MORROW DENTAL",
  shortName: "MORROW",
  city: "Los Angeles",
  state: "California",
  tagline: "Keep it looking like you.",
  address: "812 North Fairfax Avenue, Los Angeles",
  cityStateZip: "Los Angeles, CA 90046",
  phone: "(323) 555-0176",
  phoneRaw: "+13235550176",
  email: "hello@morrowdental.example",
  hours: "Mon–Fri · 8 AM–5 PM",
  primaryCta: "Book a Visit",
  secondaryCta: "Explore Care",
  services: [
    "General Dentistry",
    "Cosmetic Dentistry",
    "Veneers",
    "Clear Aligners",
    "Restorative Care",
  ],
  copyright: "© 2026 Morrow Dental",
};

export const defaultNavbarContent = {
  navLinks: [
    { label: "Care", href: "#care" },
    { label: "Approach", href: "#approach" },
    { label: "Our Team", href: "#team" },
  ],
  bookButton: "BOOK A VISIT",
  bookButtonMobile: "BOOK A VISIT →",
  mobileClose: "[ Close ]",
  mobileMenu: "[ Menu ]",
};

export const defaultHeroContent = {
  locationLabel: "LOS ANGELES",
  clinicLabel: "MORROW DENTAL",
  headlineWords: ["A", "GOOD", "SMILE", "LOOKS", "LIKE", "YOU."],
  serifLine: "Not someone else.",
  copy: "Thoughtful dental care focused on health, comfort, and natural-looking results.",
  primaryCta: "BOOK A VISIT →",
  secondaryCta: "MEET THE TEAM",
  image: "/morrow-portrait.jpg",
  imageAlt: "Editorial natural portrait of a person smiling softly in warm studio light",
  caption: "PORTRAIT / MORROW STUDIO",
};

export const defaultPhilosophyContent = {
  headline: "NOT EVERY SMILE NEEDS CHANGING.",
  serifPrefix: "Sometimes it just needs ",
  serifSubtitle: "a little more attention.",
  studyPrefix: "STUDIO STUDY / ",
  platePrefix: "PLATE 0",
  hint: "Interact or hover over words to view portrait studies",
  pillars: [
    {
      id: "health",
      word: "HEALTH",
      description: "A subtle close-up of a natural smile, rooted in strength and preventative care.",
      image: "/health-portrait.jpg",
      alt: "Subtle close-up portrait of a healthy natural smile",
    },
    {
      id: "balance",
      word: "BALANCE",
      description: "A portrait crop focused on the face, honoring symmetry without rigid uniformity.",
      image: "/balance-portrait.jpg",
      alt: "Editorial portrait crop focused on facial structure and warm balance",
    },
    {
      id: "confidence",
      word: "CONFIDENCE",
      description: "A person laughing naturally, unconcerned with forced perfection.",
      image: "/confidence-portrait.jpg",
      alt: "Candid warm portrait of a person laughing naturally",
    },
  ] as PhilosophyPillar[],
};

export const defaultTreatmentsData: TreatmentNote[] = [
  {
    id: "clean",
    title: "CLEAN",
    sentence: "Routine care, without making it complicated.",
    annotation: "start here",
    image: "/clean-treatment.jpg",
    secondaryCrop: "/detail-smile.jpg",
    alt: "Calm portrait representing routine thoughtful clean care",
  },
  {
    id: "straighten",
    title: "STRAIGHTEN",
    sentence: "A little more room for everything to sit right.",
    annotation: "in line",
    image: "/straighten-treatment.jpg",
    secondaryCrop: "/detail-enamel.jpg",
    alt: "Editorial portrait showing natural alignment and contour",
  },
  {
    id: "restore",
    title: "RESTORE",
    sentence: "Bring back what needs bringing back.",
    annotation: "gentle repair",
    image: "/restore-treatment.jpg",
    secondaryCrop: "/detail-hands.jpg",
    alt: "Warm intimate portrait expressing restored comfort",
  },
  {
    id: "refine",
    title: "REFINE",
    sentence: "Small changes. Still you.",
    annotation: "quiet precision",
    image: "/refine-treatment.jpg",
    secondaryCrop: "/detail-lips.jpg",
    alt: "Refined portrait with subtle and personal smile enhancement",
  },
];

export const defaultTreatmentsContent = {
  eyebrow: "CARE DISCIPLINES · STUDIO CONTACT SHEET",
  heading: "TREATMENTS AS PORTRAIT NOTES.",
  description: "Physical care conceived as subtle, individual portraits rather than clinical procedures.",
  proofBadge: "PROOF B",
  isoLabel: "ISO 200 · STUDIO",
  consultButton: "CONSULT ON THIS",
};

export const defaultConsultationContent = {
  eyebrow: "THE FIRST APPOINTMENT",
  headline: "FIRST, WE TALK.",
  caption: "CONSULTATION ROOM 01 · NO EQUIPMENT IN USE",
  questions: [
    {
      text: "What bothers you?",
      highlight: "What bothers you",
    },
    {
      text: "What don't you want changed?",
      highlight: "don't you want changed",
    },
    {
      text: "What would make you feel better when you leave?",
      highlight: "feel better when you leave",
    },
  ],
  closing: "That's where we start.",
  image: "/consultation.jpg",
  imageAlt: "Dentist and patient in quiet, sunlit room conversing comfortably without clinical machinery",
};

export const defaultDetailsContent = {
  eyebrow: "MICRO OBSERVATIONS · BEAUTY EDITORIAL",
  headline: "THE SMALL THINGS MATTER.",
  copyPrefix: "How light catches a smile. How a tooth sits beside another. How everything fits together ",
  copyHighlight: "without looking “done.”",
  bottomLabel: "ABSTRACTED TEXTURES · NATURAL ENAMEL · INTIMATE SCALE",
  items: [
    {
      id: "teeth",
      title: "Light & Enamel",
      image: "/detail-enamel.jpg",
      alt: "Abstract macro close-up of natural tooth enamel catching warm light",
      offsetY: -20,
    },
    {
      id: "lips",
      title: "Lip Contour",
      image: "/detail-lips.jpg",
      alt: "Intimate close-up of relaxed lips and natural skin tone",
      offsetY: 25,
    },
    {
      id: "skin",
      title: "Skin Warmth",
      image: "/detail-skin.jpg",
      alt: "Close-up of soft skin texture in morning studio light",
      offsetY: -35,
    },
    {
      id: "eye",
      title: "Expression",
      image: "/detail-eye.jpg",
      alt: "Gentle eye expression reflecting candid emotion",
      offsetY: 15,
    },
    {
      id: "smile",
      title: "Natural Form",
      image: "/detail-smile.jpg",
      alt: "Micro close-up of authentic natural smile curve",
      offsetY: -15,
    },
    {
      id: "hands",
      title: "Presence",
      image: "/detail-hands.jpg",
      alt: "Calm resting hands conveying gentleness and deliberate pacing",
      offsetY: 30,
    },
  ] as DetailImage[],
};

export const defaultDoctorContent = {
  eyebrow: "LEAD CLINICIAN · FOUNDING ETHOS",
  portraitCaption: "PORTRAIT · MAYA REED",
  name: "Dr. Maya Reed",
  role: "Dentist + Founder",
  quote: "“I don't want patients leaving wondering what happened. I want them leaving knowing exactly what we did and why.”",
  paragraph: "Morrow was built around a simple idea: good dentistry should feel personal.",
  cta: "MEET MAYA →",
  directVisitCta: "BOOK DIRECT VISIT →",
  image: "/dr-maya.jpg",
  imageAlt: "Candid portrait of Dr. Maya Reed in a sunlit Los Angeles studio",
  personalNote:
    "“When you visit Morrow, we sit down together before any examination. Whether you are coming for regular cleaning, clear aligners, or delicate cosmetic refinement, our goal is that you always recognize yourself in the mirror.”",
  personalNoteAuthor: "— Morrow Dental",
};

export const defaultFinalCtaContent = {
  eyebrow: "LOS ANGELES · MORROW STUDIO",
  headline: "COME AS YOU ARE.",
  serifSubtitle: "We'll take it from there.",
  copy: "Book a visit at Morrow Dental.",
  cta: "BOOK A VISIT →",
  phone: "(323) 555-0176",
  address: "812 North Fairfax Avenue",
  image: "/cta-face.jpg",
  imageAlt: "Large intimate portrait emerging from soft warm tone behind typography",
};

export const defaultFooterContent = {
  brand: "MORROW",
  tagline: "Keep it looking like you.",
  locationLabel: "LOS ANGELES · CALIFORNIA",
  locationHeading: "LOCATION",
  addressLine1: "812 North Fairfax Avenue",
  addressLine2: "Los Angeles, CA 90046",
  hoursHeading: "HOURS",
  hours: "Mon–Fri · 8 AM–5 PM",
  directHeading: "DIRECT",
  phone: "(323) 555-0176",
  email: "hello@morrowdental.example",
  indexHeading: "INDEX",
  navLinks: [
    { label: "Care", href: "#care" },
    { label: "Approach", href: "#approach" },
    { label: "Team", href: "#team" },
    { label: "Contact", href: "#contact" },
    { label: "Instagram", href: "https://instagram.com" },
  ],
  copyright: "© 2026 Morrow Dental",
  taglineEnd: "THE SMILE AS PORTRAITURE",
};

export const defaultBookingModalContent = {
  closeLabel: "[ Close ]",
  eyebrowSuffix: "· Studio Appointment",
  title: "Book a Visit.",
  description:
    "A visit begins with a conversation. Tell us what care you are considering, or simply come in to discuss what would make you feel comfortable.",
  serviceLabel: "Focus of Care",
  timeLabel: "Preferred Time of Day",
  timeOptions: ["Morning", "Midday", "Afternoon"],
  nameLabel: "Your Name",
  namePlaceholder: "First and last name",
  contactLabel: "Phone or Email",
  contactPlaceholder: "Direct contact for confirmation",
  noteLabel: "What would you like us to know?",
  noteOptional: "(optional)",
  notePlaceholder:
    "E.g., questions about comfort, something specific you don't want changed...",
  submitButton: "Request Visit →",
  callDirectLabel: "Or call directly: ",
  successEyebrow: "Request Received",
  successTitlePrefix: "We look forward to meeting you, ",
  successMessagePart1: "Our coordinator will reach out shortly via ",
  successMessagePart2: " to confirm a time that works seamlessly for you.",
  focusLabel: "Focus:",
  locationLabel: "Location:",
  hoursLabel: "Hours:",
  doneButton: "Done",
};
