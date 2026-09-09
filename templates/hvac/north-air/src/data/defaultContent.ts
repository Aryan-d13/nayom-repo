export interface Room {
  id: "bedroom" | "living" | "kitchen" | "office";
  title: "BEDROOM" | "LIVING ROOM" | "KITCHEN" | "OFFICE";
  quote: string;
  temp: string;
  tint: string;
  bgRgba: string;
  image: string;
}

export interface Symptom {
  text: string;
  shadowColor: string;
  context: string;
}

export interface Atmosphere {
  id: "cool" | "warm" | "breathe";
  word: string;
  tone: "cool" | "warm" | "mist";
  bgColor: string;
  textColor: string;
  subtextColor: string;
  bgImage: string;
  tagline: string;
  services: string[];
}

export const defaultCompanyInfo = {
  brand: "NORTH AIR",
  name: "North Air",
  trade: "Heating & Cooling",
  tagline: "You should feel good at home.",
  location: "Nashville, Tennessee",
  shortLocation: "Nashville, TN",
  phone: "(615) 555-0148",
  phoneRaw: "6155550148",
  phoneTel: "tel:6155550148",
  email: "hello@northair.example",
  emailHref: "mailto:hello@northair.example",
  hours: "Mon–Fri · 8 AM–5 PM",
  hoursDetail: "Emergency dispatch available for active heating & cooling failures in Greater Nashville.",
  copyright: "© 2026 North Air. Heating & Cooling.",
  promise: "Built for residential peace of mind.",
};

export const defaultNavigationContent = {
  logo: "NORTH AIR",
  trade: "Heating & Cooling",
  links: [
    { label: "Cooling", href: "#cooling", service: "AC Repair & Installation" },
    { label: "Heating", href: "#heating", service: "Heating Systems" },
    { label: "Indoor Air", href: "#indoor-air", service: "Indoor Air Quality" },
    { label: "About", href: "#the-work", service: "General Visit" },
  ],
  bookCta: "BOOK A VISIT",
  mobileMenuLabel: "MENU",
  mobileLocation: "Nashville, Tennessee",
  mobileCall: "CALL (615) 555-0148",
  mobileTagline: "You should feel good at home.",
};

export const defaultHeroContent = {
  locationLabel: "NASHVILLE / HEATING + COOLING",
  headlineWord1: "YOU CAN",
  headlineWord2: "FEEL",
  headlineWord3: "IT.",
  serifLead: "When a room is right,",
  serifItalic: "you stop thinking about it.",
  bodyCopy: "Heating, cooling and indoor air service for the spaces you spend your life in.",
  bookCta: "BOOK A VISIT",
  phoneCta: "(615) 555-0148",
  phoneSub: "Direct Line",
  image: "/north-air-hero.jpg",
  imageAlt: "Sunlit Nashville living room with linen curtains and natural morning air",
};

export const defaultTemperatureRoomContent = {
  overline: "01 / INTERACTIVE COMFORT",
  headline: "WATCH THE ROOM CHANGE.",
  description: "Move your cursor vertically across this space to shift room air from warm to cool. Notice how the space holds stillness in the center.",
  mobileHint: "Drag vertically to change room",
  states: {
    WARM: {
      key: "WARM",
      title: "TOO WARM.",
      description: "Amber atmosphere. Rising air currents. You can feel the room clinging.",
      colorText: "text-[#C07040]",
      borderColor: "border-[#E5B28D]",
    },
    COOL: {
      key: "COOL",
      title: "TOO COOL.",
      description: "Chilled air pooling low. A subtle draft at the floor and glass.",
      colorText: "text-[#4A727C]",
      borderColor: "border-[#BBD9DF]",
    },
    PERFECT: {
      key: "PERFECT",
      title: "JUST RIGHT.",
      description: "Neutral daylight. Balanced circulation. The air becomes invisible again.",
      colorText: "text-[#202321]",
      borderColor: "border-[#202321]",
    },
  },
  bullets: [
    {
      title: "01 / Amber Updrafts",
      text: "When heat builds up in the ceiling, air becomes stagnant and heavy.",
    },
    {
      title: "02 / Balanced Envelope",
      text: "Nashville humidity tamed. Even temperature from floor to ceiling.",
    },
    {
      title: "03 / Cool Settling",
      text: "A bedroom at 68° where you fall asleep in minutes.",
    },
  ],
  roomImage: "/north-air-room.jpg",
  roomImageAlt: "Living room environmental study",
};

export const defaultHouseWeatherContent = {
  overline: "02 / SPATIAL ZONES",
  headline: "THE HOUSE HAS DIFFERENT WEATHER.",
  description: "A home is not one single temperature. Air flows room to room, adapting to how you use each space throughout the day.",
  footerLeft: "Balanced airflow eliminates hot bedrooms and freezing downstairs living areas.",
  footerRight: "Air moving where it belongs.",
  rooms: [
    {
      id: "bedroom",
      title: "BEDROOM",
      quote: "Quiet enough to sleep.",
      temp: "68°",
      tint: "#BBD9DF",
      bgRgba: "rgba(187, 217, 223, 0.28)",
      image: "/room-bedroom.jpg",
    },
    {
      id: "living",
      title: "LIVING ROOM",
      quote: "Comfort wherever you sit.",
      temp: "71°",
      tint: "#F4F1E9",
      bgRgba: "rgba(244, 241, 233, 0.35)",
      image: "/room-living.jpg",
    },
    {
      id: "kitchen",
      title: "KITCHEN",
      quote: "A little less heat.",
      temp: "70°",
      tint: "#E5B28D",
      bgRgba: "rgba(229, 178, 141, 0.28)",
      image: "/room-kitchen.jpg",
    },
    {
      id: "office",
      title: "OFFICE",
      quote: "One less thing to think about.",
      temp: "69°",
      tint: "#E3E6E0",
      bgRgba: "rgba(227, 230, 224, 0.30)",
      image: "/room-office.jpg",
    },
  ] as Room[],
};

export const defaultSymptomsContent = {
  overline: "03 / THE SYMPTOMS",
  headlineLine1: "YOU NOTICE",
  headlineLine2: "WHEN IT'S",
  headlineHighlight: "NOT RIGHT.",
  closingLead1: "Something small? ",
  closingItalic1: "We'll take a look.",
  closingLead2: "Something bigger? ",
  closingItalic2: "We'll explain that too.",
  closingDescription: "No pressure. No scare tactics. Just honest diagnosis from technicians who treat your home with dignity.",
  bookCta: "BOOK A VISIT",
  callPrefix: "Or call ",
  phone: "(615) 555-0148",
  symptoms: [
    {
      text: "THE AC WON'T KEEP UP.",
      shadowColor: "rgba(229, 178, 141, 0.35)",
      context: "On 90° Nashville afternoons, the thermostat never hits setpoint.",
    },
    {
      text: "ONE ROOM IS ALWAYS HOTTER.",
      shadowColor: "rgba(229, 178, 141, 0.45)",
      context: "The upstairs nursery or corner study stays four degrees above the rest.",
    },
    {
      text: "THE HEATER KEEPS RUNNING.",
      shadowColor: "rgba(96, 127, 135, 0.35)",
      context: "Air blows constantly, but the warmth dissipates before settling.",
    },
    {
      text: "THE HOUSE FEELS STUFFY.",
      shadowColor: "rgba(227, 230, 224, 0.6)",
      context: "Heavy moisture lingering inside even when the blower is active.",
    },
    {
      text: "THAT SOUND IS NEW.",
      shadowColor: "rgba(187, 217, 223, 0.4)",
      context: "A quiet whistle in the return plenum or a rattle in the outdoor coil.",
    },
  ] as Symptom[],
};

export const defaultTechnicianLoupeContent = {
  overline: "04 / CRAFT & CARE",
  headlineLine1: "GOOD SERVICE",
  headlineLine2: "SHOULD FEEL",
  headlineHighlight: "LIKE A RELIEF.",
  leadText: "We show up, figure out what's happening, explain it clearly, and get to work.",
  bullets: [
    {
      title: "Real diagnosis.",
      text: "We test air velocity, static pressure, and refrigerant subcooling before proposing any repair.",
    },
    {
      title: "Quiet presence.",
      text: "Clean boot covers, clean drop cloths, and respectful work inside lived-in homes.",
    },
  ],
  hintText: "Hover over the photograph to inspect details through the loupe",
  badgeText: "NASHVILLE RESIDENTIAL FIELD WORK",
  badgeSub: "Inspection Detail",
  image: "/north-air-technician.jpg",
  imageAlt: "North Air technician calmly testing indoor comfort equipment",
};

export const defaultServiceAtmospheresContent = {
  overline: "05 / SERVICE ATMOSPHERES",
  description: "Three states of care for three distinct needs.",
  schedulePrefix: "SCHEDULE",
  scheduleSuffix: "VISIT →",
  atmospheres: [
    {
      id: "cool",
      word: "COOL",
      tone: "cool",
      bgColor: "#BBD9DF",
      textColor: "#202321",
      subtextColor: "#3E585F",
      bgImage: "/service-cool.jpg",
      tagline: "Air conditioning dialed for long humid southern summers.",
      services: ["AC repair", "AC replacement"],
    },
    {
      id: "warm",
      word: "WARM",
      tone: "warm",
      bgColor: "#E5B28D",
      textColor: "#202321",
      subtextColor: "#5C351E",
      bgImage: "/service-warm.jpg",
      tagline: "Quiet, reliable heating when the freeze drops down the valley.",
      services: ["Heating", "Seasonal service"],
    },
    {
      id: "breathe",
      word: "BREATHE",
      tone: "mist",
      bgColor: "#E3E6E0",
      textColor: "#202321",
      subtextColor: "#454D48",
      bgImage: "/service-breathe.jpg",
      tagline: "Whole-home filtration, ventilation, and humidity balance.",
      services: ["Indoor air", "Maintenance"],
    },
  ] as Atmosphere[],
};

export const defaultFinalCtaContent = {
  overline: "FINAL / STILLNESS",
  settledState: "COMFORT SETTLED",
  balancingState: "ROOM BALANCING...",
  headlineLine1: "HOME",
  headlineLine2: "SHOULD FEEL",
  headlineHighlight: "LIKE THIS.",
  serifLine1: "Right temperature.",
  serifLine2: "Right air.",
  serifLine3: "Right now.",
  bookCta: "BOOK A VISIT",
  phone: "(615) 555-0148",
  subnote: "No sudden blasts. No noisy compressors. Just peaceful air.",
  location: "Nashville, TN",
  duskImage: "/north-air-dusk.jpg",
  duskImageAlt: "Quiet Nashville home interior at dusk, warm comfortable lamp light",
};

export const defaultFooterContent = {
  brand: "NORTH AIR",
  tagline: "You should feel good at home.",
  servicesHeader: "Services",
  services: ["Cooling", "Heating", "Indoor Air", "Maintenance"],
  navHeader: "Navigation",
  links: [
    { label: "Services", href: "#cooling" },
    { label: "About", href: "#the-work" },
  ],
  contactLinkText: "Contact",
  officeHeader: "Nashville Office",
  location: "Nashville, Tennessee",
  phone: "(615) 555-0148",
  email: "hello@northair.example",
  hoursHeader: "Hours",
  hours: "Mon–Fri · 8 AM–5 PM",
  hoursNote: "Emergency dispatch available for active heating & cooling failures in Greater Nashville.",
  copyright: "© 2026 North Air. Heating & Cooling.",
  promise: "Built for residential peace of mind.",
};

export const defaultBookingModalContent = {
  badge: "NASHVILLE RESIDENTIAL SERVICE",
  headline: "BOOK A VISIT",
  subtitle: "We'll come out, take a look, and explain everything simply.",
  services: [
    "AC Repair",
    "AC Installation",
    "Heating",
    "Maintenance",
    "Indoor Air",
  ],
  form: {
    serviceLabel: "Select Service",
    nameLabel: "Your Name *",
    namePlaceholder: "e.g. Eleanor Vance",
    phoneLabel: "Phone Number *",
    phonePlaceholder: "(615) 555-0148",
    addressLabel: "Nashville Address or Neighborhood",
    addressPlaceholder: "e.g. East Nashville / 12 South / Belmont",
    noteLabel: "What feels off in the house?",
    notePlaceholder: "e.g. Living room is warm, quiet rattle in the return duct...",
    submitText: "CONFIRM VISIT REQUEST",
  },
  success: {
    title: "VISIT REQUESTED",
    prefix: "Thank you, ",
    defaultNeighbor: "neighbor",
    middle: ". A North Air coordinator will call you shortly at ",
    defaultPhone: "(615) 555-0148",
    suffix: " to confirm the time.",
  },
};
