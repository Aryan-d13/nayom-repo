export interface RoomData {
  id: string;
  name: string;
  fixtures: string;
  description: string;
  detail: string;
  zone: string;
  cx: number;
  cy: number;
  note: string;
}

export interface PressureState {
  id: string;
  title: string;
  subtitle: string;
  sizeClass: string;
  glowColor: string;
  shapeStyle: string;
}

export interface NotePoint {
  id: string;
  text: string;
  xPercent: number;
  yPercent: number;
  triggerThreshold: number;
  annotation: string;
}

export interface CallItem {
  id: string;
  title: string;
  code: string;
  image: string;
  caption: string;
  details: string;
  serviceCategory: string;
}

export interface ServiceLink {
  name: string;
  cat: string;
}

export interface QuickLink {
  label: string;
  href: string;
}

export const defaultBusinessInfo = {
  name: "CURRENT",
  nameSuffix: "PLUMBING",
  fullName: "CURRENT PLUMBING",
  tagline: "Keep things moving.",
  location: "Austin, Texas · Residential",
  locationFull: "Austin, Texas",
  phone: "(512) 555-0192",
  phoneTel: "5125550192",
  email: "hello@currentplumbing.example",
  coordinates: "AUSTIN // 30.2672° N, 97.7431° W",
  motto: "WATER HAS A PATH",
  copyright: "© 2026 Current Plumbing. Fictional residential plumbing craft. All rights reserved.",
};

export const defaultSiteMetadata = {
  title: "CURRENT PLUMBING — Residential Plumbing · Austin, Texas",
  description:
    "Keep things moving. Repairs, drains, water heaters, leak detection, and fixtures behind everyday life in Austin, Texas. (512) 555-0192.",
};

export const defaultNavigationContent = {
  navLinks: [
    { label: "The Path", href: "#hero" },
    { label: "Follow The Water", href: "#follow-the-water" },
    { label: "The Drip", href: "#the-drip" },
    { label: "Pressure", href: "#pressure" },
    { label: "The Work", href: "#the-work" },
    { label: "Common Calls", href: "#common-calls" },
  ],
  ctaButton: "Book a Plumber",
  mobileCta: "Book",
  mobileDrawerCta: "Book a Plumber →",
};

export const defaultHeroContent = {
  badge: "AUSTIN, TEXAS RESIDENTIAL PLUMBING",
  headlinePart1: "EVERYTHING HAS",
  headlinePart2: "A WAY IN.",
  serifPhrase: "Water knows the way.",
  description: "Repairs, drains, water heaters and the plumbing behind everyday life.",
  primaryCta: "BOOK A PLUMBER",
  phoneCall: "(512) 555-0192",
  interactionHint: "Fluid line responds to your movement",
  scrollHint: "Follow Route",
  zones: [
    { label: "ZONE A // ENTRY FLOW", x: 96, y: 145 },
    { label: "ZONE B // MAIN SUPPLY", x: 600, y: 145 },
    { label: "ZONE C // CORE DRAINAGE", x: 96, y: 485 },
  ],
  image: {
    src: "/images/clean_morning_kitchen.jpg",
    alt: "A clean, natural kitchen sink with brass faucet bathed in morning light",
    badge: "POINT 01 // KITCHEN FIXTURE",
    dimensionMarker: 'SUPPLY // 0.50" COPPER RUN',
  },
};

export const defaultFollowWaterContent = {
  kicker: "SIGNATURE ROUTE // RESIDENTIAL CROSS-SECTION",
  title: "FOLLOW THE WATER.",
  description:
    "Every faucet, shower, toilet and drain is part of a hidden route through the house. Not a technical diagram—a single thread through everyday living.",
  stageLabel: "ACTIVE STAGE:",
  rooms: [
    {
      id: "kitchen",
      name: "KITCHEN",
      fixtures: "TAPS. SINKS. DISHWASHER.",
      description: "The daily supply center. Clean incoming flow, aerated faucet lines, and immediate hot water branches.",
      detail: "Smooth dual-line isolation for aerated faucets and dishwasher high-temp feed.",
      zone: "ZONE 01 // UPPER LEVEL",
      cx: 260,
      cy: 220,
      note: "INCOMING MAIN // BRANCH 01",
    },
    {
      id: "bath",
      name: "BATH",
      fixtures: "SHOWER. TOILET. SINK.",
      description: "High demand, balanced pressure valves, and acoustic-damped drainage channels behind quiet walls.",
      detail: "Pressure-balanced thermostatic cartridges and venting that prevents gurgles.",
      zone: "ZONE 02 // UPPER LEVEL",
      cx: 720,
      cy: 220,
      note: "ELEVATED RUN // DUAL SUPPLY",
    },
    {
      id: "laundry",
      name: "LAUNDRY",
      fixtures: "WASHER. DRAIN. SUPPLY.",
      description: "Sudden surges, high-flow discharge, and dedicated hammer arrestors preventing hydraulic shock.",
      detail: "2-inch standpipe drainage and quarter-turn shutoffs engineered for rapid valve cycling.",
      zone: "ZONE 03 // LOWER LEVEL",
      cx: 260,
      cy: 530,
      note: "HIGH-FLOW // HAMMER ARREST",
    },
    {
      id: "utility",
      name: "UTILITY",
      fixtures: "WATER HEATER.",
      description: "Thermal circulation loops, expansion relief tanks, and sediment-free copper manifolds.",
      detail: "Tankless and hybrid water heating, expansion tanks, and pressure regulator valves.",
      zone: "ZONE 04 // LOWER LEVEL",
      cx: 720,
      cy: 530,
      note: "HEART OF SYSTEM // 120°F",
    },
  ] as RoomData[],
  climaxKicker: "SYSTEM DEVIATION // ANOMALY DETECTION",
  climaxTitle: "WHEN SOMETHING BREAKS, THE PATH CHANGES.",
  climaxDescription: "A subtle loss of pressure, an unexpected puddle, or water where it doesn't belong.",
  climaxCta: "LET'S FIND IT",
  defaultService: "Leak Detection",
};

export const defaultDripContent = {
  kicker: "SEQUENCE 03 // THE METAPHOR OF GRAVITY",
  step1: "ONE DRIP.",
  step2: "ANNOYING.",
  step3: "Every day.",
  step4: "LET'S FIX IT.",
  cta: "BOOK A PLUMBER",
  scrollHint: "Scroll down to advance the drop",
  defaultService: "Plumbing Repairs",
};

export const defaultSomethingsOffContent = {
  kicker: "SEQUENCE 04 // HYDRAULIC EQUILIBRIUM",
  sectionTag: "THE SENSATIONS OF WATER",
  heading: "SOMETHING'S OFF.",
  paragraph1: "A dripping faucet. A slow drain. A weak shower.",
  serifPhrase: "You don't need to know why.",
  paragraph2:
    "You just need someone who can find out. No confusing technical gauges or numbers—just plumbing returned to quiet, dependable balance.",
  cta: "BOOK A PLUMBER",
  defaultService: "Leak Detection",
  statusBarLabel: "METAPHORICAL WATER PRESSURE SIMULATION",
  statusBarPrefix: "SCROLL TO MODULATE // CURRENT:",
  states: [
    {
      id: "low",
      title: "LOW PRESSURE.",
      subtitle: "A thin, breathless trickle where a steady stream should be.",
      sizeClass: "w-28 h-28 sm:w-36 sm:h-36",
      glowColor: "rgba(104, 184, 195, 0.2)",
      shapeStyle: "border-2 border-[#68B8C3]/50 bg-[#68B8C3]/10 scale-90",
    },
    {
      id: "high",
      title: "TOO MUCH WATER.",
      subtitle: "Strain on valve seals, loud pipe clatter, and stressed joints.",
      sizeClass: "w-72 h-72 sm:w-96 sm:h-96",
      glowColor: "rgba(200, 102, 80, 0.4)",
      shapeStyle:
        "border-2 border-[#C86650] bg-[#C86650]/20 scale-110 shadow-[0_0_60px_rgba(200,102,80,0.3)]",
    },
    {
      id: "uneven",
      title: "SOMETHING'S OFF.",
      subtitle: "Unpredictable surges, temperature jumps, and irregular rhythm.",
      sizeClass: "w-52 h-52 sm:w-64 sm:h-64",
      glowColor: "rgba(221, 240, 236, 0.35)",
      shapeStyle:
        "border-2 border-[#DDF0EC] bg-[#DDF0EC]/15 animate-pressure-wobble shadow-[0_0_40px_rgba(221,240,236,0.25)]",
    },
    {
      id: "normal",
      title: "BACK TO NORMAL.",
      subtitle: "Quiet, effortless, balanced equilibrium through the whole home.",
      sizeClass: "w-48 h-48 sm:w-60 sm:h-60",
      glowColor: "rgba(104, 184, 195, 0.5)",
      shapeStyle:
        "border-2 border-[#68B8C3] bg-[#68B8C3]/25 shadow-[0_0_50px_rgba(104,184,195,0.4)] transition-all duration-700",
    },
  ] as PressureState[],
};

export const defaultTheWorkContent = {
  sectionTag: "SECTION 05 // THE WORK & THE FIT",
  hoverHint: "HOVER OVER IMAGE TO TRACE THE CRAFT",
  mobileSummary: "Clean Cut · Right Fit · Done",
  image: {
    src: "/images/candid_tradesperson.jpg",
    alt: "Plumber naturally working beneath a sink, fitting clean brass joints",
  },
  notes: [
    {
      id: "cut",
      text: "CLEAN CUT.",
      xPercent: 28,
      yPercent: 42,
      triggerThreshold: 0.25,
      annotation: "Deburred copper · No jagged edges",
    },
    {
      id: "fit",
      text: "RIGHT FIT.",
      xPercent: 52,
      yPercent: 58,
      triggerThreshold: 0.55,
      annotation: "True alignment · Zero strain on threads",
    },
    {
      id: "done",
      text: "DONE.",
      xPercent: 74,
      yPercent: 36,
      triggerThreshold: 0.8,
      annotation: "Tested under full operating pressure",
    },
  ] as NotePoint[],
  heading: "WE LIKE THINGS THAT FIT THE WAY THEY'RE SUPPOSED TO.",
  subheading: "And we leave the space cleaner than we found it.",
};

export const defaultCommonCallsContent = {
  sectionTag: "SECTION 06 // VISUAL INDEX",
  title: "COMMON CALLS.",
  description:
    "The things people actually experience in an Austin home. Not an abstract menu—the real reasons we get called out.",
  allServicesCta: "SEE ALL SERVICES",
  calls: [
    {
      id: "leaks",
      title: "LEAKS",
      code: "CALL // 01",
      image: "/images/problem_dripping_tap.jpg",
      caption: "A persistent drip in the wall or under the vanity.",
      details:
        "Pinhole leaks in copper runs, weeping shut-off valves, and hidden supply joints. We locate the exact breach without tearing down unnecessary drywall.",
      serviceCategory: "Leak Detection",
    },
    {
      id: "drains",
      title: "CLOGGED DRAINS",
      code: "CALL // 02",
      image: "/images/problem_slow_drain.jpg",
      caption: "Water standing around your ankles or sluggish sink discharge.",
      details:
        "Organic grease buildup, bathroom hair traps, and venting resistance. We clear the entire diameter of the line to restore natural velocity.",
      serviceCategory: "Drain Cleaning",
    },
    {
      id: "hot-water",
      title: "NO HOT WATER",
      code: "CALL // 03",
      image: "/images/water_heater_utility.jpg",
      caption: "Stepping into a shower that stays lukewarm or cold.",
      details:
        "Tankless sensor faults, burned-out heating elements, expansion failure, or sediment-choked traditional tanks. Fast diagnostic and same-day recovery.",
      serviceCategory: "Water Heaters",
    },
    {
      id: "toilets",
      title: "RUNNING TOILETS",
      code: "CALL // 04",
      image: "/images/problem_running_toilet.jpg",
      caption: "The phantom sound of water refilling at 2 AM.",
      details:
        "Degraded flapper seals, overflow tube miscalibration, and worn fill valves wasting up to 200 gallons a day in silence.",
      serviceCategory: "Plumbing Repairs",
    },
    {
      id: "fixtures",
      title: "NEW FIXTURES",
      code: "CALL // 05",
      image: "/images/hero_faucet.jpg",
      caption: "Upgrading to architectural brass, matte black, or deep basins.",
      details:
        "Precision rough-in dimensions, balanced pressure cartridges, and clean seating that preserves your stone or tile countertops.",
      serviceCategory: "Fixtures & Faucets",
    },
  ] as CallItem[],
};

export const defaultFinalCtaContent = {
  tag: "CURRENT PLUMBING · AUSTIN, TEXAS",
  heading: "KEEP THINGS MOVING.",
  serifPhrase: "We'll handle the plumbing.",
  description:
    "No emergency panic. No unneeded line replacements. Just honest residential craft that leaves your home working quietly in the background.",
  primaryCta: "BOOK A PLUMBER",
  phoneCall: "(512) 555-0192",
  phoneTel: "5125550192",
  statusStill: "PATH COMPLETE // SYSTEM AT REST",
  statusActive: "THE FLOW APPROACHES EQUILIBRIUM",
};

export const defaultFooterContent = {
  tagline: "Keep things moving.",
  description:
    "Residential plumbing craft rooted in Austin, Texas. We turn invisible hydraulic routes into quiet, reliable everyday living.",
  appointmentButton: "Request Appointment",
  servicesHeader: "SERVICES",
  contactHeader: "CONTACT",
  linksHeader: "LINKS",
  services: [
    { name: "Repairs", cat: "Plumbing Repairs" },
    { name: "Drains", cat: "Drain Cleaning" },
    { name: "Water Heaters", cat: "Water Heaters" },
    { name: "Leak Detection", cat: "Leak Detection" },
    { name: "Fixtures", cat: "Fixtures & Faucets" },
  ] as ServiceLink[],
  quickLinks: [
    { label: "Services", href: "#common-calls" },
    { label: "Work", href: "#the-work" },
    { label: "About", href: "#follow-the-water" },
    { label: "Contact", href: "#final-cta" },
  ] as QuickLink[],
  coordinates: "AUSTIN // 30.2672° N, 97.7431° W",
  motto: "WATER HAS A PATH",
  copyright: "© 2026 Current Plumbing. Fictional residential plumbing craft. All rights reserved.",
};

export const defaultBookingModalContent = {
  badge: "Austin, Texas · Residential Craft",
  title: "Book a Plumber",
  description:
    "Tell us what needs attention. We arrive on time, find the path, and leave the space cleaner than we found it.",
  servicesLabel: "Service Needed",
  services: [
    "Plumbing Repairs",
    "Drain Cleaning",
    "Water Heaters",
    "Leak Detection",
    "Fixtures & Faucets",
  ],
  nameLabel: "Your Name",
  namePlaceholder: "Elena Vance",
  phoneLabel: "Phone Number",
  phonePlaceholder: "(512) 000-0000",
  addressLabel: "Austin Street Address / Neighborhood",
  addressPlaceholder: "e.g. 1402 Kinney Ave, Zilker / South Congress",
  timeWindowLabel: "Preferred Arrival Window",
  timeWindows: [
    "Morning (8am - 12pm)",
    "Afternoon (12pm - 4pm)",
    "Late Day (4pm - 7pm)",
  ],
  notesLabel: "Brief Note (Optional)",
  notesPlaceholder:
    "Dripping under guest bathroom sink, low pressure in morning shower...",
  submitButton: "Confirm Visit",
  successTitle: "We've got your route.",
  doneButton: "Done",
};
