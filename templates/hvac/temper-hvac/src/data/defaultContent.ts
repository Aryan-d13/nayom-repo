export interface ConditionState {
  id: string;
  title: string;
  temp: number;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  subtext: string;
  sensoryNote: string;
  visualFilter: string;
  ambientTexture: string;
}

export interface RoomScene {
  id: string;
  name: string;
  number: string;
  serifQuote: string;
  detail: string;
  image: string;
  colorTint: string;
}

export interface Symptom {
  id: string;
  number: string;
  headline: string;
  practicalInsight: string;
  frequencyNote: string;
}

export interface ServiceChapter {
  id: string;
  word: string;
  subhead: string;
  tagline: string;
  description: string;
  details: string[];
  cta: string;
  image: string;
  bgClass: string;
  textClass: string;
  accentClass: string;
}

export const defaultBusinessInfo = {
  name: "TEMPER",
  fullName: "TEMPER Heating & Air",
  tagline: "Feels better in here.",
  subtagline: "Cool enough to forget about it.",
  location: "Phoenix, Arizona",
  locationShort: "Phoenix, AZ",
  phone: "(602) 555-0188",
  phoneTel: "6025550188",
  email: "hello@temper.example",
  serviceArea: "Serving residential homes across Phoenix, Arizona",
  serviceAreaDetailed: "Phoenix, Paradise Valley, Scottsdale, and surrounding valley homes.",
  copyright: "© 2026 Temper Heating & Air. All rights reserved.",
  comfortArchitecture: "PHOENIX RESIDENTIAL COMFORT ARCHITECTURE",
};

export const defaultNavigationContent = {
  brand: "TEMPER",
  locationShort: "Phoenix, AZ",
  trade: "Heating & Air",
  phone: "(602) 555-0188",
  phoneTel: "6025550188",
  menuButton: "Menu",
  bookCta: "Book a Visit",
  warmthHeading: "Warmth & Atmosphere",
  airHeading: "Air & Clarity",
  navLinks: [
    { label: "Cooling", href: "#services-cooling" },
    { label: "Heating", href: "#services-heating" },
    { label: "Air", href: "#services-air" },
    { label: "About", href: "#technician" },
  ],
};

export const defaultHeroContent = {
  overline: "Phoenix / Heating & Air",
  headlineLine1: "HOW SHOULD",
  headlineLine2: "HOME FEEL?",
  serifLine: "Cool enough to forget about it.",
  description: "Air conditioning, heating and comfort for the places you spend your life.",
  bookCta: "Book a Visit",
  phone: "(602) 555-0188",
  phoneTel: "6025550188",
  image: "/temper-hero.jpg",
  imageAlt: "Sunlit architectural desert bedroom and living room in Phoenix",
};

export const defaultConditionsContent = {
  headerOverline: "Sensory Exploration",
  headerTitle: "Cycle through the sensations of an Arizona home",
  footerQuote: "Whatever your home is doing, it should be doing it better.",
  bookCta: "Book a Visit",
  conditions: [
    {
      id: "hot",
      title: "TOO HOT.",
      temp: 86,
      bgGradient: "from-[#8B361F] via-[#A95B43] to-[#542114]",
      textColor: "text-[#FAF0E6]",
      accentColor: "text-[#E9D9BE]",
      subtext: "Summer heat pushes relentlessly through glass. The ceiling fan just stirs warm air.",
      sensoryNote: "Heavy, sluggish air. The thermostat never catches up.",
      visualFilter: "brightness(0.95) saturate(1.4) sepia(0.2)",
      ambientTexture: "radial-gradient(ellipse at 50% 30%, rgba(233, 217, 190, 0.18) 0%, transparent 70%)",
    },
    {
      id: "cold",
      title: "TOO COLD.",
      temp: 63,
      bgGradient: "from-[#1D2B30] via-[#2F3E44] to-[#43545A]",
      textColor: "text-[#E6F3F5]",
      accentColor: "text-[#C8DDE0]",
      subtext: "Drafts gather at the floorboards. Sudden sharp chills when the system kicks on.",
      sensoryNote: "Rigid, uneven cold. Pockets of winter trapped inside.",
      visualFilter: "contrast(1.15) saturate(0.85) hue-rotate(185deg)",
      ambientTexture: "radial-gradient(ellipse at 50% 70%, rgba(200, 221, 224, 0.15) 0%, transparent 65%)",
    },
    {
      id: "dry",
      title: "TOO DRY.",
      temp: 79,
      bgGradient: "from-[#6E4F32] via-[#8D6B49] to-[#4A3420]",
      textColor: "text-[#F8F3EA]",
      accentColor: "text-[#E9D9BE]",
      subtext: "Desert air steals moisture from skin and lungs. Restless mornings with a parched throat.",
      sensoryNote: "Dusty static. Arid stillness in every corner.",
      visualFilter: "contrast(1.05) sepia(0.35) saturate(0.9)",
      ambientTexture: "radial-gradient(circle at 50% 50%, rgba(233, 217, 190, 0.22) 0%, transparent 60%)",
    },
    {
      id: "stuffy",
      title: "TOO STUFFY.",
      temp: 77,
      bgGradient: "from-[#383E3A] via-[#4F5752] to-[#2B302D]",
      textColor: "text-[#EDEFEA]",
      accentColor: "text-[#C8DDE0]",
      subtext: "Dead air lingers in closed rooms. Odors and humidity linger long after dinner.",
      sensoryNote: "Heavy atmosphere. Recirculated air that never feels refreshed.",
      visualFilter: "blur(0.4px) contrast(0.95) saturate(0.9)",
      ambientTexture: "radial-gradient(ellipse at 50% 50%, rgba(200, 221, 224, 0.12) 0%, transparent 80%)",
    },
    {
      id: "right",
      title: "JUST RIGHT.",
      temp: 72,
      bgGradient: "from-[#2A353A] via-[#3B4D54] to-[#1E2528]",
      textColor: "text-[#FCFCF9]",
      accentColor: "text-[#C8DDE0]",
      subtext: "You don't think about the heat. You don't think about the cold. The air simply belongs.",
      sensoryNote: "Gentle, balanced, balanced Phoenix comfort.",
      visualFilter: "none",
      ambientTexture: "radial-gradient(circle at 50% 40%, rgba(200, 221, 224, 0.2) 0%, transparent 75%)",
    },
  ] as ConditionState[],
};

export const defaultRoomsStoryContent = {
  overline: "The Rooms Tell The Story",
  balancePrefix: "Balancing the ",
  rooms: [
    {
      id: "bedroom",
      name: "BEDROOM",
      number: "01",
      serifQuote: "Sleep should feel easy.",
      detail:
        "When afternoon warmth lingers across the roofline, your bedroom shouldn't fight to reach rest. Calm, steady, silent air that lets you drift off without turning over the pillow.",
      image: "/room-bedroom.jpg",
      colorTint: "from-[#171A1A]/70 via-[#43545A]/30 to-transparent",
    },
    {
      id: "living",
      name: "LIVING ROOM",
      number: "02",
      serifQuote: "Comfort should not depend on where you sit.",
      detail:
        "No hot spots near the floor-to-ceiling glass. No shivering directly underneath a drafty supply register. Consistent, gentle air balanced for the entire space.",
      image: "/room-living.jpg",
      colorTint: "from-[#171A1A]/70 via-[#A95B43]/25 to-transparent",
    },
    {
      id: "kitchen",
      name: "KITCHEN",
      number: "03",
      serifQuote: "Heat belongs outside.",
      detail:
        "Preparing an evening meal shouldn't overwhelm the core of your home. Effective air exchange that pulls out heat and aromas while maintaining desert freshness.",
      image: "/room-kitchen.jpg",
      colorTint: "from-[#171A1A]/70 via-[#E9D9BE]/25 to-transparent",
    },
    {
      id: "office",
      name: "HOME OFFICE",
      number: "04",
      serifQuote: "You should be able to concentrate on work.",
      detail:
        "Quiet airflow that keeps the afternoon clear, crisp, and alert. Never stuffy, never noisy—just steady clarity while you focus.",
      image: "/room-office.jpg",
      colorTint: "from-[#171A1A]/70 via-[#43545A]/35 to-transparent",
    },
  ] as RoomScene[],
};

export const defaultDiagnosticsContent = {
  overline: "Practical Clarity",
  headline: "YOU'LL KNOW WHEN SOMETHING ISN'T RIGHT.",
  inspectPrompt: "Let's take a look →",
  scheduleCta: "Schedule diagnostic visit →",
  trustQuote: "Sometimes it's a quick repair. Sometimes it needs a closer look. We'll tell you which.",
  bookCta: "Book a Visit",
  generalBookingIssue: "General Diagnostic Evaluation",
  symptoms: [
    {
      id: "still-hot",
      number: "01",
      headline: "THE AC IS RUNNING. THE ROOM IS STILL HOT.",
      practicalInsight:
        "Usually a dirty coil, an undetected refrigerant loss, or restricted duct airflow. We measure supply and return temperatures at each register to pinpoint where the cooling is getting lost.",
      frequencyNote: "Common mid-summer issue",
    },
    {
      id: "humid",
      number: "02",
      headline: "THE HOUSE FEELS HUMID.",
      practicalInsight:
        "If the unit cools the temperature quickly but turns off before drawing moisture out of the air, your home feels muggy and sticky. We check cycle timing, coil saturation, and fan speeds.",
      frequencyNote: "Monsoon & late summer",
    },
    {
      id: "uneven",
      number: "03",
      headline: "ONE ROOM IS ALWAYS DIFFERENT.",
      practicalInsight:
        "Often caused by duct leakage in the attic, west-facing desert exposure, or static pressure imbalance. We check the airflow path and balancing dampers to make temperatures uniform.",
      frequencyNote: "Airflow distribution issue",
    },
    {
      id: "sounds-wrong",
      number: "04",
      headline: "THE SYSTEM SOUNDS WRONG.",
      practicalInsight:
        "Whining, vibration, or metal clatter usually points to a failing blower motor bearing, fan blade friction, or electrical contact chatter. Catching it before a 115° Phoenix weekend saves the entire compressor.",
      frequencyNote: "Mechanical inspection recommended",
    },
  ] as Symptom[],
};

export const defaultServicesContent = {
  overline: "Services / Environmental Chapters",
  chapters: [
    {
      id: "services-cooling",
      word: "COOL",
      subhead: "AC Repair & Installation",
      tagline: "When summer shows up, your house should still feel like home.",
      description:
        "Phoenix summers don't negotiate. We service and install air conditioning systems calibrated specifically for desert heat loads, keeping head pressure low and indoor cooling continuous.",
      details: [
        "Compressor & fan diagnosis",
        "Refrigerant leak pinpointing",
        "Full inverter system replacement",
        "Duct airflow balancing",
      ],
      cta: "Schedule Cooling Visit",
      image: "/service-cool.jpg",
      bgClass: "bg-[#E2EFF1] text-[#171A1A]",
      textClass: "text-[#171A1A]",
      accentClass: "text-[#43545A]",
    },
    {
      id: "services-heating",
      word: "WARM",
      subhead: "Heating & Seasonal Service",
      tagline: "Warmth when you need it. Nothing more complicated than that.",
      description:
        "Desert winters bring sudden cold desert nights. We maintain heat pumps, electric air handlers, and furnaces so they switch on smoothly the first evening the frost rolls in.",
      details: [
        "Heat pump reversing valve testing",
        "Electric heat strip inspection",
        "Safety control verification",
        "Thermostat & zoning calibration",
      ],
      cta: "Schedule Heating Visit",
      image: "/service-warm.jpg",
      bgClass: "bg-[#F4ECE0] text-[#171A1A]",
      textClass: "text-[#171A1A]",
      accentClass: "text-[#A95B43]",
    },
    {
      id: "services-air",
      word: "BREATHE",
      subhead: "Indoor Air & Maintenance",
      tagline: "The air inside your home matters too.",
      description:
        "Dust, pollen, and lingering cooking moisture shouldn't recirculate day after day. We integrate whole-home air purification and planned maintenance that keeps equipment quiet and filters clean.",
      details: [
        "High-efficiency media filtration",
        "Whole-home humidity management",
        "Coil hygiene & sanitized drain lines",
        "Annual preventive care visits",
      ],
      cta: "Schedule Air Quality Visit",
      image: "/service-breathe.jpg",
      bgClass: "bg-[#F6F2EA] text-[#171A1A]",
      textClass: "text-[#171A1A]",
      accentClass: "text-[#43545A]",
    },
  ] as ServiceChapter[],
};

export const defaultTechnicianContent = {
  overline: "Human Craft",
  name: "Evan Brooks",
  title: "Service Manager",
  location: "Phoenix, AZ",
  quote: "Most people don't want to know how the system works. They just want to know that someone knows what they're doing.",
  punchline: "That's our job.",
  cta: "Meet Our Team",
  bookingIssue: "Meet Evan and the Service Team",
  image: "/technician-evan.jpg",
  imageAlt: "Evan Brooks, Service Manager, thoughtfully inspecting an indoor air return vent",
};

export const defaultFinalCtaContent = {
  settledTemp: 72,
  settledState: "COMFORT SETTLED",
  overline: "Home Sanctuary",
  headline: "FEELS BETTER IN HERE.",
  serifLine: "That's the point.",
  description: "No dramatic gadgets, no loud airflow. Just comfortable, quiet rooms that make it easy to come home.",
  bookCta: "Book a Visit",
  bookingIssue: "Final CTA: Feels better in here",
  phone: "(602) 555-0188",
  phoneTel: "6025550188",
  serviceArea: "Serving residential homes across Phoenix, Arizona",
  image: "/temper-evening.jpg",
  imageAlt: "Peaceful evening interior in a Phoenix home with warm lamp light and gentle breeze",
};

export const defaultFooterContent = {
  brand: "TEMPER",
  tagline: "Feels better in here.",
  description: "Residential heating, air conditioning and whole-home comfort designed for the climate of Phoenix, Arizona.",
  servicesHeader: "Services",
  navHeader: "Navigation",
  contactHeader: "Contact",
  phone: "(602) 555-0188",
  phoneTel: "6025550188",
  email: "hello@temper.example",
  location: "Phoenix, Arizona",
  bookCta: "Book a Visit",
  footerBookingIssue: "Footer Visit Request",
  copyright: "© 2026 Temper Heating & Air. All rights reserved.",
  comfortArchitecture: "PHOENIX RESIDENTIAL COMFORT ARCHITECTURE",
  services: [
    { name: "Cooling", href: "#services-cooling" },
    { name: "Heating", href: "#services-heating" },
    { name: "Air Quality", href: "#services-air" },
    { name: "Maintenance", href: "#services-air" },
  ],
  links: [
    { name: "Services", href: "#services" },
    { name: "About", href: "#technician" },
    { name: "Diagnostics", href: "#diagnostics" },
    { name: "Contact", href: "#final-cta" },
  ],
};

export const defaultTemperatureBadgeContent = {
  ariaLabel: "Environmental comfort indicator",
  balancedLabel: "Balanced",
  indoorLabel: "Indoor",
};

export const defaultBookingModalContent = {
  overline: "TEMPER Service Visit",
  title: "Book a Visit",
  subtitle: "Phoenix, Paradise Valley, Scottsdale, and surrounding valley homes.",
  issuesLabel: "What is happening in your home?",
  defaultIssue: "AC is running, but room is still hot",
  issuesList: [
    "AC is running, but room is still hot",
    "House feels humid & sticky",
    "One room is always different",
    "The system sounds wrong / noisy",
    "Seasonal heating & cooling inspection",
    "New high-efficiency system consultation",
  ],
  nameLabel: "Your Name",
  namePlaceholder: "Sarah Jenkins",
  phoneLabel: "Phone Number",
  phonePlaceholder: "(602) 555-0199",
  addressLabel: "Home Address or Neighborhood",
  addressPlaceholder: "e.g. Arcadia, Central Ave, or North Central Phoenix",
  timeWindowLabel: "Preferred Time Window",
  timeWindows: ["Morning (8am - 12pm)", "Afternoon (12pm - 5pm)"],
  defaultTimeWindow: "Morning (8am - 12pm)",
  submitCta: "Confirm Visit Request",
  immediatePrefix: "Need immediate assistance? Call ",
  phone: "(602) 555-0188",
  phoneTel: "6025550188",
  success: {
    title: "Visit Request Received",
    prefix: "Thank you, ",
    defaultNeighbor: "neighbor",
    middle: ". Evan or one of our technicians will call you at ",
    defaultPhone: "your number",
    confirmPrefix: " shortly to confirm your ",
    confirmSuffix: " arrival window.",
    doneButton: "Done",
  },
};
