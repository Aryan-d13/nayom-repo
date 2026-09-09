export interface DiagnosticItem {
  id: string;
  phrase: string;
  subtext: string;
  image: string;
  imageAlt: string;
  serviceKey: string;
}

export interface RoomZone {
  id: string;
  number: string;
  name: string;
  service: string;
  headline: string;
  description: string;
  bullets: string[];
  image: string;
  alt: string;
  gridClass: string;
}

export interface ProjectItem {
  id: string;
  room: string;
  detail: string;
  neighborhood: string;
  image: string;
  alt: string;
}

export interface TrustStatement {
  text: string;
  desc: string;
}

export const defaultBusinessInfo = {
  name: "BRIGHTLINE",
  fullName: "Brightline Electric",
  trade: "Residential Electrical",
  location: "Portland, Oregon",
  fullLocation: "PORTLAND, OREGON RESIDENTIAL ELECTRICAL",
  phone: "(503) 555-0174",
  phoneTel: "tel:5035550174",
  email: "hello@brightline.example",
  emailHref: "mailto:hello@brightline.example",
  address: "Portland, OR",
  copyright: "© 2026 Brightline Electric. All rights reserved.",
  statusNote: "Available for residential service",
};

export const defaultNavigationContent = {
  logo: "BRIGHTLINE",
  links: [
    { name: "Services", href: "#services", id: "services" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "About", href: "#philosophy", id: "philosophy" },
  ],
  phone: "(503) 555-0174",
  ctaText: "Book a Service",
  mobileCtaText: "Book",
};

export const defaultHeroContent = {
  eyebrow: "PORTLAND, OREGON RESIDENTIAL ELECTRICAL",
  headline: "MAKE YOUR HOME FEEL RIGHT.",
  serifLine: "It's more than wiring.",
  description: "Repairs, lighting, upgrades and the electrical work that keeps your home running the way it should.",
  ctaPrimary: "Book a Service",
  ctaPhone: "Call (503) 555-0174",
  verticalBrand: "BRIGHTLINE",
  image: "/electrician-hero.jpg",
  imageAlt: "Warm architectural living room interior at dusk with a pool of natural 2700K light",
};

export const defaultDiagnosticContent = {
  eyebrow: "Diagnostic & Troubleshooting",
  headline: "WHAT'S GOING ON?",
  description: "Most electrical headaches start as minor annoyances. Tell us what your home is doing—we will diagnose it and give you a straightforward answer.",
  helpCta: "WE CAN HELP",
  sceneLabel: "Diagnostic Scene",
  items: [
    {
      id: "flicker",
      phrase: "THE LIGHTS FLICKER.",
      subtext: "Loose junction, aging dimmer switch, or circuit resistance. We trace the wire and fix it right at the source.",
      image: "/images/service-lighting.jpg",
      imageAlt: "Warm glowing architectural pendant lights over a clean kitchen counter",
      serviceKey: "Flickering Lights / Wiring Repair",
    },
    {
      id: "outlet",
      phrase: "THE OUTLET DIED.",
      subtext: "Tripped upstream GFCI, back-stabbed failure, or worn contacts. We test the line and restore solid, safe power.",
      image: "/images/craft-outlet.jpg",
      imageAlt: "Clean flush wall receptacle and toggle switch detail",
      serviceKey: "Dead Outlet / Receptacle Repair",
    },
    {
      id: "breaker",
      phrase: "THE BREAKER TRIPS.",
      subtext: "Overloaded circuit run, dead short, or tired breaker bar. We diagnose the draw and balance your electrical load.",
      image: "/images/service-panel.jpg",
      imageAlt: "Organized, clean residential electrical panel and breakers",
      serviceKey: "Tripping Breaker / Panel Inspection",
    },
    {
      id: "dark",
      phrase: "THE ROOM FEELS DARK.",
      subtext: "Harsh shadows, bad angles, or cold bulbs. We add warm recessed spots and under-cabinet glow that makes you want to stay in the room.",
      image: "/images/craft-recessed.jpg",
      imageAlt: "Warm ceiling recessed spot lighting illuminating a cozy living room",
      serviceKey: "Lighting Design & Upgrades",
    },
  ] as DiagnosticItem[],
};

export const defaultRoomServicesContent = {
  eyebrow: "Whole Home Overview",
  headline: "SERVICES AS A ROOM.",
  description: "Select any room in the house. The active space illuminates while the rest of the home stays quietly dimmed.",
  activeSpaceLabel: "Active Space:",
  clickHint: "Click any room to illuminate",
  roomCountText: "/ 05",
  nextRoomText: "Next Room →",
  quickSelectLabel: "Quick Select",
  explorePrefix: "Explore",
  rooms: [
    {
      id: "kitchen",
      number: "01",
      name: "Kitchen",
      service: "Lighting",
      headline: "Good lighting can change a room without changing the room itself.",
      description: "Warm under-cabinet linear fixtures, dialed-in island pendants, and dimmers that turn an all-business cooking prep area into an inviting evening gathering spot.",
      bullets: [
        "Zero-glare under-cabinet task lighting",
        "Dedicated island pendant drops",
        "Smooth 0-10V LED dimming control",
      ],
      image: "/images/service-lighting.jpg",
      alt: "Warm architectural kitchen with illuminated pendant lighting",
      gridClass: "col-span-12 sm:col-span-7 row-span-1 aspect-[16/10]",
    },
    {
      id: "living",
      number: "02",
      name: "Living Room",
      service: "Electrical Repairs",
      headline: "Outlets, switches, quiet ceiling fans, and the fixes that keep daily routine smooth.",
      description: "Troubleshooting flickering fixtures, replacing loose receptacles, silencing noisy exhaust motors, and balancing circuit lines so you never think twice about flipping a switch.",
      bullets: [
        "Silent fan wiring & speed control",
        "Plaster-flush receptacle replacements",
        "Circuit balance & safety checks",
      ],
      image: "/images/service-repairs.jpg",
      alt: "Modern comfortable residential living room with clean wiring",
      gridClass: "col-span-12 sm:col-span-5 row-span-1 aspect-[16/10]",
    },
    {
      id: "garage",
      number: "03",
      name: "Garage",
      service: "EV Charging",
      headline: "Fast, dedicated Level 2 vehicle charging installed cleanly on your schedule.",
      description: "Dedicated 48-amp runs, clean conduit routing that hugs the architectural framing, and properly load-calculated panel hookups for all modern electric vehicles.",
      bullets: [
        "Hardwired Level 2 or NEMA 14-50 runs",
        "Concealed or neat architectural conduit",
        "Load calculation & permit-ready",
      ],
      image: "/images/service-ev.jpg",
      alt: "Dedicated Level 2 EV charging setup in residential garage",
      gridClass: "col-span-12 sm:col-span-4 aspect-[4/3]",
    },
    {
      id: "hallway",
      number: "04",
      name: "Hallway",
      service: "Switches & Outlets",
      headline: "Rocker switches, dimmer controls, and outlets right where you naturally reach.",
      description: "Upgrading vintage toggles to tactile screwless wall plates, 3-way stair switching, path lighting that stays comfortable at 2 AM, and child-safe tamper-resistant receptacles.",
      bullets: [
        "Multi-way 3-way & 4-way hallway switching",
        "Warm motion path night-lighting",
        "Laser-leveled, flush screwless plates",
      ],
      image: "/images/craft-outlet.jpg",
      alt: "Clean architectural switches and flush outlets",
      gridClass: "col-span-12 sm:col-span-4 aspect-[4/3]",
    },
    {
      id: "panel",
      number: "05",
      name: "Panel Area",
      service: "Panel Upgrades",
      headline: "Modern 200A service, clean labeling, and the peace of mind of a reliable heart.",
      description: "Replacing dated fuse boxes and obsolete Zinsco/Federal Pacific panels with heavy-duty 200-amp copper-bus service, whole-home surge protection, and labeled breakers a child could read.",
      bullets: [
        "Modern 200 Amp service upgrades",
        "Whole-home surge suppression",
        "Clear, legible circuit directory labeling",
      ],
      image: "/images/service-panel.jpg",
      alt: "Clean, organized modern electrical panel with labeled breakers",
      gridClass: "col-span-12 sm:col-span-4 aspect-[4/3]",
    },
  ] as RoomZone[],
};

export const defaultPhilosophyContent = {
  eyebrow: "OUR PHILOSOPHY",
  headline: "THE BEST ELECTRICAL WORK IS THE WORK YOU DON'T NOTICE.",
  driftLine1: "Clean lines. Straight switches.",
  driftLine2: "Quiet fans. Lights exactly where they should be.",
  quote: "“We care about the part most people never think about.”",
  description: "From laser-leveling every switch plate to leaving the floor cleaner than when we walked in—craftsmanship is doing the unseen parts right.",
  image: "/images/craft-outlet.jpg",
  imageAlt: "Close-up of clean architectural switch and finished plaster interior",
};

export const defaultProjectCollageContent = {
  eyebrow: "Residential Moments",
  headline: "SMALL PROJECTS, BIG DIFFERENCE.",
  description: "Good electrical upgrades don't require gutting your house. A thoughtful afternoon of work can completely change the way you live in a space.",
  projects: [
    {
      id: "kitchen",
      room: "KITCHEN",
      detail: "Under-cabinet lighting",
      neighborhood: "SE Portland",
      image: "/images/project-seportland.jpg",
      alt: "Warm architectural kitchen with invisible under-cabinet illumination",
    },
    {
      id: "entry",
      room: "ENTRY",
      detail: "New exterior light",
      neighborhood: "North Portland",
      image: "/images/project-northportland.jpg",
      alt: "Welcoming warm exterior entry light on a Pacific Northwest modern home",
    },
    {
      id: "living",
      room: "LIVING ROOM",
      detail: "Recessed lighting",
      neighborhood: "Lake Oswego",
      image: "/images/craft-recessed.jpg",
      alt: "Warm plaster-flush recessed lighting softly illuminating a living room",
    },
    {
      id: "garage",
      room: "GARAGE",
      detail: "EV charging",
      neighborhood: "Beaverton",
      image: "/images/service-ev.jpg",
      alt: "Dedicated Level 2 EV charging setup installed flush against garage wall",
    },
  ] as ProjectItem[],
};

export const defaultTrustContent = {
  eyebrow: "Direct & Honest",
  headline: "NEED AN ELECTRICIAN? JUST CALL US.",
  subtitle: "Tell us what's going on. We'll tell you what happens next.",
  phone: "(503) 555-0174",
  ctaText: "Book a Service",
  statements: [
    { text: "Clear answers.", desc: "We explain what is happening in plain English before touching any wires." },
    { text: "Tidy work.", desc: "Drop cloths down, shoe covers on, and every bit of copper trimmings vacuumed up." },
    { text: "No unnecessary drama.", desc: "No upselling you a panel you don't need. Just good, dependable work done right." },
  ] as TrustStatement[],
};

export const defaultFinalLightsOnContent = {
  stages: [
    "LIGHTS OUT",
    "KITCHEN ILLUMINATED",
    "LIVING ROOM ON",
    "HALLWAY & PORCH ON",
    "ALL LIGHTS ON · HOME COMFORTABLE",
  ],
  headline: "GOOD WORK SHOULD FEEL SIMPLE.",
  subheadline: "BRIGHTLINE ELECTRIC · PORTLAND, OREGON",
  ctaPrimary: "Book a Service",
  ctaPhone: "(503) 555-0174",
  dimmerSuffix: "% LIGHT",
  darkImage: "/images/hero-night.jpg",
  darkImageAlt: "Pacific Northwest architectural residence at dusk",
  litImage: "/images/hero-lit.jpg",
  litImageAlt: "Warmly lit architectural home with glowing windows and welcoming porch light",
};

export const defaultFooterContent = {
  brand: "BRIGHTLINE",
  tagline: "Good work. Done right.",
  description: "Residential electrical repairs, thoughtful lighting, panel upgrades, and EV charging throughout the Portland metropolitan area.",
  navHeader: "Navigation",
  links: [
    { name: "Services", href: "#services" },
    { name: "Projects", href: "#projects" },
    { name: "About", href: "#philosophy" },
  ],
  bookingLinkText: "Contact & Book",
  serviceAreasHeader: "Service Areas",
  serviceAreas: ["Portland", "Beaverton", "Tigard", "Lake Oswego"],
  contactHeader: "Direct Contact",
  phone: "(503) 555-0174",
  email: "hello@brightline.example",
  location: "Portland, OR",
  copyright: "© 2026 Brightline Electric. All rights reserved.",
  statusNote: "Available for residential service",
};

export const defaultBookingDrawerContent = {
  eyebrow: "Direct Booking",
  title: "Book an Electrician",
  description: "Tell us what is going on. We will reply quickly with clear next steps.",
  serviceLabel: "What needs attention?",
  services: [
    "Diagnostic & Troubleshooting",
    "Flickering Lights / Wiring Repair",
    "Dead Outlet / Receptacle Repair",
    "Tripping Breaker / Panel Inspection",
    "Lighting Design & Upgrades",
    "EV Charger Installation",
    "Panel Upgrade (200A)",
    "Whole-Home Safety Walkthrough",
  ],
  cityLabel: "Service Area",
  cities: ["Portland", "Beaverton", "Tigard", "Lake Oswego", "Other Nearby"],
  nameLabel: "Your Name",
  namePlaceholder: "First & Last Name",
  phoneLabel: "Phone Number",
  phonePlaceholder: "(503) 000-0000",
  notesLabel: "Brief description (optional)",
  notesPlaceholder: "e.g. Flickering dining lights when refrigerator compressor kicks on...",
  submitText: "Request Service Appointment",
  directCallQuestion: "Need immediate guidance?",
  directCallPhone: "Call (503) 555-0174",
  guaranteeCommunication: "Prompt communication",
  guaranteeLicensed: "Licensed residential work",
  success: {
    title: "We have your details.",
    textPrefix: "Thank you, ",
    textDefaultName: "there",
    textMiddle: ". We will call or text you shortly from ",
    phone: "(503) 555-0174",
    textSuffix: " to confirm timing and details.",
    doneText: "Done",
  },
};
