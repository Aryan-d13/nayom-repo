export interface MomentItem {
  id: string;
  text: string;
  image: string;
  alt: string;
}

export interface RoomSection {
  id: string;
  name: string;
  items: string[];
  statement: string;
  image: string;
  alt: string;
  layout: "image-left" | "image-right";
  textAlignment: "top" | "center" | "bottom";
}

export interface StepItem {
  num: string;
  title: string;
  desc: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export const defaultBusinessInfo = {
  name: "HEARTH & PIPE",
  tagline: "The things that make a home work.",
  location: "SEATTLE / RESIDENTIAL PLUMBING",
  cityState: "Seattle, Washington",
  cityShort: "SEATTLE, WA",
  phone: "(206) 555-0146",
  phoneTel: "2065550146",
  email: "hello@hearthpipe.example",
  hours: "Mon–Fri · 8 AM–5 PM",
  hoursNote: "Quiet scheduled residential service throughout greater Seattle.",
  copyright: "© 2026 Hearth & Pipe. Fictional residential plumbing.",
  motto: "The Things That Make A Home Work",
};

export const defaultSiteMetadata = {
  title: "Hearth & Pipe — Residential Plumbing · Seattle, Washington",
  description:
    "The things that make a home work. Plumbing repairs, water heaters, drain cleaning, leak detection, and fixtures in Seattle, Washington.",
};

export const defaultNavigationContent = {
  brand: "HEARTH & PIPE",
  links: [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
  ] as NavLink[],
  ctaButton: "BOOK A PLUMBER",
  menuToggleOpen: "MENU",
  menuToggleClose: "CLOSE",
};

export const defaultHeroContent = {
  label: "SEATTLE / RESIDENTIAL PLUMBING",
  headlinePart1: "GOOD",
  headlinePart2: "MORNING.",
  headlinePart3Prefix: "IT SHOULD",
  headlinePart3Italic: "JUST WORK.",
  description:
    "Plumbing repairs, water heaters, drains and the everyday things that keep a home running.",
  primaryCta: "BOOK A PLUMBER",
  phoneCall: "(206) 555-0146",
  phoneTel: "2065550146",
  image: {
    src: "/images/hero_morning_bathroom.jpg",
    alt: "Quiet residential bathroom in soft early morning light",
  },
  captionLeft: "HOT WATER / 7:12 AM",
  captionRight: "SEATTLE, WA · WATER IS INVISIBLE",
};

export const defaultNoticeContent = {
  label: "OBSERVATION",
  headingPart1: "YOU NOTICE",
  headingItalic: "THE LITTLE THINGS.",
  moments: [
    {
      id: "shower",
      text: "THE SHOWER TAKES FOREVER TO GET HOT.",
      image: "/images/problem_low_pressure.jpg",
      alt: "Morning shower running with delayed warm water",
    },
    {
      id: "drain",
      text: "THE SINK DRAINS TOO SLOWLY.",
      image: "/images/problem_slow_drain.jpg",
      alt: "Bathroom sink basin with slow draining water",
    },
    {
      id: "tap",
      text: "THE TAP WON'T STOP DRIPPING.",
      image: "/images/problem_dripping_tap.jpg",
      alt: "Close-up of a kitchen faucet with water dripping",
    },
    {
      id: "heater",
      text: "THE WATER HEATER SOUNDS DIFFERENT.",
      image: "/images/water_heater_utility.jpg",
      alt: "Warm utility room with residential water heater",
    },
    {
      id: "cabinet",
      text: "THAT SPOT UNDER THE CABINET IS NEW.",
      image: "/images/problem_wet_spot.jpg",
      alt: "Cabinet interior plumbing inspection",
    },
  ] as MomentItem[],
  captionPrefix: "MOMENT",
  captionSuffix: "SEATTLE, WA",
  takeaway: "SMALL DOESN'T MEAN IGNORE IT.",
  cta: "BOOK A PLUMBER",
};

export const defaultInsideHomeContent = {
  label: "RESIDENTIAL SPACES",
  heading: "INSIDE THE HOME.",
  rooms: [
    {
      id: "kitchen",
      name: "KITCHEN",
      items: ["TAPS.", "SINKS.", "DISHWASHERS."],
      statement: "The things you use without thinking about them.",
      image: "/images/clean_morning_kitchen.jpg",
      alt: "Morning light in residential kitchen with clean sink and faucet",
      layout: "image-left",
      textAlignment: "bottom",
    },
    {
      id: "bathroom",
      name: "BATHROOM",
      items: ["SHOWERS.", "TOILETS.", "SINKS."],
      statement: "Everything starts with the water working.",
      image: "/images/project_beaverton.jpg",
      alt: "Calm modern bathroom with stone tiles and pristine fixtures",
      layout: "image-right",
      textAlignment: "top",
    },
    {
      id: "laundry",
      name: "LAUNDRY",
      items: ["WASHER.", "DRAIN.", "SUPPLY."],
      statement: "Not glamorous. Very necessary.",
      image: "/images/laundry_room.jpg",
      alt: "Organized laundry space with tidy water lines",
      layout: "image-left",
      textAlignment: "center",
    },
    {
      id: "utility",
      name: "UTILITY ROOM",
      items: ["WATER HEATER."],
      statement: "Hot water, when you need it.",
      image: "/images/water_heater_utility.jpg",
      alt: "Quiet residential utility room with orderly copper plumbing",
      layout: "image-right",
      textAlignment: "bottom",
    },
  ] as RoomSection[],
};

export const defaultTheFixContent = {
  label: "THE APPROACH",
  headingPart1: "SOMETHING",
  headingItalic: "NOT RIGHT?",
  steps: [
    {
      num: "01",
      title: "TELL US WHAT'S HAPPENING.",
      desc: "A brief message or phone call. Tell us what sounds off, where water is showing up, or what isn't draining.",
    },
    {
      num: "02",
      title: "WE'LL TAKE A LOOK.",
      desc: "We arrive on time, inspect the fixture, line, or water heater directly, and trace the issue to its actual source.",
    },
    {
      num: "03",
      title: "WE'LL EXPLAIN WHAT WE FIND.",
      desc: "Clear language without jargon or pressure. Exactly what is worn, what needs repair, and what it involves.",
    },
    {
      num: "04",
      title: "THEN WE'LL FIX IT.",
      desc: "Clean, durable workmanship done right the first time. We test everything thoroughly before packing up.",
    },
  ] as StepItem[],
  endingPart1: "NO GUESSING.",
  endingItalic: "NO UNNECESSARY DRAMA.",
  cta: "BOOK A PLUMBER",
};

export const defaultWaterHeaterContent = {
  index: "01",
  title: "HOT",
  titleItalic: "WATER.",
  description:
    "When the water isn't getting hot, isn't staying hot, or the heater just isn't behaving the way it used to, we'll take a look.",
  serviceList: [
    "WATER HEATERS",
    "SERVICE",
    "REPLACEMENT",
    "TROUBLESHOOTING",
  ],
  image: {
    src: "/images/water_heater_utility.jpg",
    alt: "Architectural utility room with neat water heater and copper piping",
    captionLeft: "RESIDENTIAL UTILITY / SEATTLE",
    captionRight: "PRESSURE & HEAT",
  },
};

export const defaultPeopleContent = {
  label: "PHILOSOPHY",
  quote: "“YOU SHOULDN'T\nNEED TO KNOW\nWHAT'S UNDER\nTHE SINK.”",
  quoteHighlightPrefix: "You just need someone",
  quoteHighlightItalic: "who does.",
  description:
    "We started Hearth & Pipe because good plumbing work should feel simple from the customer's side.",
  founderName: "Sam Carter",
  founderTitle: "Founder",
  cta: "ABOUT US",
  image: {
    src: "/images/candid_tradesperson.jpg",
    alt: "Candid conversation between homeowner and plumber in home kitchen",
    captionLeft: "SAM CARTER & HOMEOWNER",
    captionRight: "SEATTLE, WA",
  },
};

export const defaultBackToNormalContent = {
  label: "RESOLUTION",
  headingLine1: "GET IT FIXED.",
  headingLine2: "GET BACK",
  headingItalic: "TO YOUR DAY.",
  subhead: "That's usually the goal.",
  cta: "BOOK A PLUMBER",
  phone: "(206) 555-0146",
  phoneTel: "2065550146",
  location: "Seattle, Washington",
  image: {
    src: "/images/evening_kitchen.jpg",
    alt: "Warm peaceful home kitchen in evening light with clean sink and pot on stove",
  },
};

export const defaultBookingModalContent = {
  badge: "SEATTLE / RESIDENTIAL",
  title: "BOOK A PLUMBER",
  servicesLabel: "Select Service Needed",
  services: [
    "Plumbing Repairs",
    "Water Heaters",
    "Drain Cleaning",
    "Leak Detection",
    "Fixtures & Faucets",
  ],
  nameLabel: "Your Name",
  namePlaceholder: "e.g. Eleanor Vance",
  phoneLabel: "Phone Number",
  phonePlaceholder: "(206) 555-0100",
  neighborhoodLabel: "Seattle Neighborhood / Street",
  neighborhoodPlaceholder: "e.g. Queen Anne, Ballard, Capitol Hill...",
  notesLabel: "What's happening? (Optional)",
  notesPlaceholder:
    "e.g. Kitchen tap won't stop dripping, water heater taking longer in the morning...",
  timingLabel: "Preferred Timing",
  timingOptions: [
    { id: "morning", label: "Morning Routine (8 AM – 12 PM)" },
    { id: "afternoon", label: "Afternoon (12 PM – 5 PM)" },
  ],
  submitButton: "SEND REQUEST",
  successTitle: "We'll Take A Look.",
  successMessage:
    "Thank you. We have received your note. A Hearth & Pipe technician will call you shortly to confirm your Seattle visit.",
  resetButton: "RETURN TO SITE",
  phoneDisplay: "Direct: (206) 555-0146",
};

export const defaultFooterContent = {
  servicesHeader: "SERVICES",
  services: [
    "Repairs",
    "Water Heaters",
    "Drains",
    "Leak Detection",
    "Fixtures",
  ],
  exploreHeader: "EXPLORE",
  links: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ] as NavLink[],
  bookLinkText: "Book a Plumber",
  officeHeader: "OFFICE",
  hoursHeader: "HOURS",
};
