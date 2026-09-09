export interface ServiceProblem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
}

export interface HouseRoom {
  id: "kitchen" | "bathroom" | "laundry" | "garage" | "utility";
  name: string;
  tags: string;
  description: string;
  commonIssues: string[];
  coordinates: { x: number; y: number; width: number; height: number };
  pipePath: string;
}

export interface RoomData {
  id: string;
  name: string;
  subtitle: string;
  photo: string;
  alt: string;
  description: string;
  commonFixes: string[];
}

export interface ProjectItem {
  id: string;
  location: string;
  title: string;
  image: string;
  alt?: string;
  aspectClass?: string;
  aspect?: "large" | "medium" | "tall";
}

export const defaultSiteMetadata = {
  title: "Goodflow Plumbing — Portland, Oregon Residential Plumbing",
  description:
    "Water should just work. Everyday residential repairs, drain cleaning, water heaters, and leak detection in Portland, Oregon. Fictional residential plumbing service.",
  keywords: [
    "Goodflow Plumbing",
    "Plumber Portland",
    "Residential Plumbing Oregon",
    "Drain Cleaning",
    "Water Heaters",
    "Leak Detection",
  ],
  author: "Goodflow Plumbing",
  openGraph: {
    title: "Goodflow Plumbing — Portland, Oregon Residential Plumbing",
    description:
      "Water should just work. Everyday residential repairs, drain cleaning, water heaters, and leak detection in Portland, Oregon.",
    type: "website",
    locale: "en_US",
  },
};

export const defaultCompany = {
  name: "GOODFLOW PLUMBING",
  shortName: "GOODFLOW",
  city: "Portland, Oregon",
  tagline: "Water should just work.",
  phone: "(503) 555-0139",
  phoneRaw: "tel:5035550139",
  email: "hello@goodflow.example",
  serviceAreas: ["Portland", "Beaverton", "Tigard", "Lake Oswego"],
  services: [
    "Plumbing Repairs",
    "Drain Cleaning",
    "Water Heaters",
    "Leak Detection",
    "Fixture Installation",
  ],
};

export const defaultNavbarContent = {
  locationTag: "Portland, OR",
  navLinks: [
    { label: "Services", href: "#services" },
    { label: "The Work", href: "#the-work" },
    { label: "About", href: "#about" },
  ],
  callUsLabel: "Call Us",
  bookButtonLabel: "Book a Plumber",
  bookMobileLabel: "Book",
};

export const defaultHeroContent = {
  eyebrow: "PORTLAND, OREGON RESIDENTIAL PLUMBING",
  headlineLine1: "WATER SHOULD",
  headlineLine2: "JUST WORK.",
  serifSentence: "When it doesn't, call someone who knows what to do.",
  supportingCopy:
    "Repairs, drains, water heaters and the everyday plumbing problems that need fixing.",
  primaryCta: "Book a Plumber",
  secondaryCta: "Call Us",
  image: {
    src: "/images/hero_faucet.jpg",
    alt: "Water smoothly flowing from a modern kitchen faucet into a stone sink with morning light",
    caption: "01 / NATURAL FLOW",
  },
};

export const defaultSmallProblemsContent = {
  sectionNumber: "02 / EVERYDAY DIAGNOSTICS",
  heading: "IT USUALLY STARTS WITH SOMETHING SMALL.",
  spotlightLabel: "DIAGNOSIS SPOTLIGHT",
  closingStatement:
    "Sometimes it's five minutes. Sometimes it's a bigger job. Either way, we'd rather take a look.",
  ctaLabel: "Book a Plumber",
};

export const defaultSmallProblems: ServiceProblem[] = [
  {
    id: "dripping-tap",
    title: "A dripping tap.",
    subtitle: "Usually a worn ceramic disc or seat washer. An easy morning fix.",
    image: "/images/problem_dripping_tap.jpg",
    alt: "Close-up of a dripping modern brass faucet",
  },
  {
    id: "running-toilet",
    title: "A toilet that won't stop running.",
    subtitle: "Flapper seal or fill valve issue that quietly wastes gallons all day.",
    image: "/images/problem_running_toilet_v2.jpg",
    alt: "Contemporary minimalist toilet fixture and vanity in warm architectural bathroom",
  },
  {
    id: "slow-drain",
    title: "A drain that takes forever.",
    subtitle: "Organic buildup or soap scum caught along the trap. Cleared clean.",
    image: "/images/problem_slow_drain.jpg",
    alt: "Stainless sink basin with clear swirling water",
  },
  {
    id: "low-pressure",
    title: "A shower with no pressure.",
    subtitle: "Mineral blockage or pressure regulator imbalance restored to full flow.",
    image: "/images/problem_low_pressure.jpg",
    alt: "Rain shower head in natural stone tile stall",
  },
  {
    id: "wet-spot",
    title: "A wet spot that wasn't there yesterday.",
    subtitle: "Hidden moisture behind baseboard or cabinet. We locate the true origin.",
    image: "/images/problem_wet_spot_v2.jpg",
    alt: "Water damage and moisture bubbling along the baseboard and hardwood floor",
  },
];

export const defaultInteractiveHouseContent = {
  sectionNumber: "03 / THE WORK BY ROOM",
  headingPrefix: "HOW WATER MOVES",
  headingHighlight: "THROUGH YOUR HOME.",
  description:
    "Every room has its own plumbing rhythm. Select a space below to see the everyday problems we diagnose and fix there.",
  residenceLabel: "PORTLAND RESIDENCE",
  fixesHeading: "Common fixes we handle here",
  bookButtonPrefix: "Book",
  bookButtonSuffix: "Service",
};

export const defaultRoomStories: RoomData[] = [
  {
    id: "kitchen",
    name: "Kitchen",
    subtitle: "Leaks · Taps · Garbage Disposals",
    photo: "/images/clean_morning_kitchen.jpg",
    alt: "Bright residential kitchen with clean counters and faucet",
    description:
      "Small problems have a habit of becoming annoying problems. A spray wand that won't retract, a disposal that hums without spinning, or a slow puddle beneath the sink trap. We'll sort them out.",
    commonFixes: [
      "Under-sink supply hoses & shutoff stops",
      "Garbage disposal jams & clean replacements",
      "Dripping gooseneck faucets & spray wands",
    ],
  },
  {
    id: "bathroom",
    name: "Bathroom",
    subtitle: "Toilets · Showers · Sinks",
    photo: "/images/project_alberta.jpg",
    alt: "Clean bathroom fixture and shower tile in Portland home",
    description:
      "Fixtures that drip, pipes that whistle, or drains that back up. We rebuild running toilet valves, restore water pressure in shower cartridges, and clear slow sink traps properly.",
    commonFixes: [
      "Running toilet flappers & fill valves",
      "Shower cartridges & low pressure restoration",
      "Slow-draining sinks and vanity traps",
    ],
  },
  {
    id: "laundry",
    name: "Laundry",
    subtitle: "Washing Machines · Drains · Supply Lines",
    photo: "/images/problem_slow_drain.jpg",
    alt: "Stainless laundry sink basin and clean drainage",
    description:
      "Old rubber washer hoses can fail quietly behind the wall. We install burst-resistant stainless braided lines, clear standpipe venting, and ensure drainage runs freely.",
    commonFixes: [
      "Burst-resistant stainless braided hoses",
      "Standpipe overflow & drain trap venting",
      "Quarter-turn shutoff valves for easy isolation",
    ],
  },
  {
    id: "garage",
    name: "Garage & Heater",
    subtitle: "Water Heaters · Shutoffs",
    photo: "/images/project_beaverton.jpg",
    alt: "Clean modern water heater installation in tidy basement",
    description:
      "Tank or tankless, pilot lights or pressure valves. When the morning shower turns lukewarm, we diagnose heating elements, flush tank sediment, or replace aging units without the sales pitch.",
    commonFixes: [
      "Tank & tankless water heater diagnostics",
      "Temperature & pressure relief (T&P) valves",
      "Anode rod replacement & sediment flushing",
    ],
  },
  {
    id: "utility",
    name: "Utility Area",
    subtitle: "Main Line · Pressure Regulators",
    photo: "/images/project_sellwood.jpg",
    alt: "Outdoor and basement water cleanout plumbing",
    description:
      "The central heartbeat of your home's water. If street pressure spikes or your main shutoff valve is seized, we replace the regulator and keep incoming pressure balanced.",
    commonFixes: [
      "Pressure reducing valves (PRV) replacement",
      "Quarter-turn main water shutoff valves",
      "Pipe banging & thermal expansion controls",
    ],
  },
];

export const defaultHouseRooms: HouseRoom[] = [
  {
    id: "kitchen",
    name: "KITCHEN",
    tags: "Leaks · Taps · Garbage Disposals",
    description:
      "Small problems have a habit of becoming annoying problems. We'll sort them out.",
    commonIssues: ["Under-sink supply hoses", "Garbage disposal jams", "Spray wand leaks"],
    coordinates: { x: 300, y: 170, width: 200, height: 130 },
    pipePath: "M 150 380 L 150 280 L 320 280 L 400 240",
  },
  {
    id: "bathroom",
    name: "BATHROOM",
    tags: "Toilets · Showers · Sinks",
    description:
      "Fixtures that drip, pipes that whistle, or drains that back up. We fix them properly.",
    commonIssues: ["Cartridge replacement", "Running fill valves", "Slow shower drains"],
    coordinates: { x: 300, y: 30, width: 200, height: 120 },
    pipePath: "M 150 380 L 150 140 L 320 140 L 420 100",
  },
  {
    id: "laundry",
    name: "LAUNDRY",
    tags: "Washing Machines · Drains · Supply Lines",
    description:
      "Hidden hoses, vibrating valves, and slow drainage sorted before they spill.",
    commonIssues: ["Burst-resistant braided lines", "Standpipe venting", "Sediment traps"],
    coordinates: { x: 90, y: 170, width: 190, height: 130 },
    pipePath: "M 150 380 L 150 260 L 200 260 L 220 220",
  },
  {
    id: "garage",
    name: "GARAGE",
    tags: "Water Heaters · Shutoffs",
    description:
      "Tank or tankless, pilot lights or pressure valves. Reliable hot water restored.",
    commonIssues: ["Anode rod service", "Expansion tank tuning", "Emergency shutoff valve"],
    coordinates: { x: 90, y: 320, width: 190, height: 130 },
    pipePath: "M 150 380 L 150 350 L 220 350",
  },
  {
    id: "utility",
    name: "UTILITY AREA",
    tags: "Main Line · Pressure Regulators · Meters",
    description:
      "The central heartbeat of your water line kept in balance.",
    commonIssues: ["Pressure reducing valves (PRV)", "Main shutoff replacement", "Water hammer arrestors"],
    coordinates: { x: 300, y: 320, width: 200, height: 130 },
    pipePath: "M 50 410 L 150 410 L 150 380 L 340 380",
  },
];

export const defaultLeakDetectionContent = {
  sectionNumber: "04 / NON-INVASIVE DETECTION",
  headingPrefix: "LEAKS DON'T ALWAYS MAKE",
  headingHighlight: "THEMSELVES OBVIOUS.",
  description:
    "Sometimes the important part is finding where the water started. Water travels along joists, pools behind baseboards, and leaves clues feet away from the actual leak.",
  buttonLabel: "Leak Detection",
  image: {
    src: "/images/leak_detection_v2.jpg",
    alt: "Non-invasive thermal imaging infrared scan detecting hidden water pipe leaks behind bathroom wall",
  },
};

export const defaultEmergencyStripContent = {
  badge: "CALL GOODFLOW · URGENT ASSISTANCE",
  heading: "WATER WHERE IT SHOULDN'T BE?",
  description: "Turn off the water if you can. Then call us.",
};

export const defaultDialogueProcessContent = {
  sectionNumber: "05 / HOW WE WORK",
  heading: "FROM CALL TO DONE.",
  subtitle: "A simple conversation, not a high-pressure sales pitch.",
  closingTitle: "THAT'S IT.",
  closingDescription: "No guessing. No unnecessary runaround. Just a clear next step.",
};

export const defaultConversationSteps = [
  { speaker: "YOU", text: "Something's leaking.", align: "left" },
  { speaker: "US", text: "Okay. Tell us what's happening.", align: "right" },
  { speaker: "YOU", text: "It's under the sink.", align: "left" },
  { speaker: "US", text: "We'll take a look.", align: "right" },
  { speaker: "YOU", text: "And then?", align: "left" },
  { speaker: "US", text: "We'll explain what needs doing.", align: "right" },
];

export const defaultProjectCollageContent = {
  sectionNumber: "06 / RECENT WORK",
  heading: "REAL HOMES. ORDINARY FIXES.",
  projects: [
    {
      id: "se-portland",
      location: "SE PORTLAND",
      title: "Kitchen leak",
      image: "/images/project_kitchen_v2.jpg",
      alt: "Under-sink kitchen plumbing, disposal, and P-trap repair in SE Portland",
      aspectClass: "lg:col-span-7 aspect-16/10 sm:aspect-16/11",
    },
    {
      id: "sellwood",
      location: "SELLWOOD",
      title: "Drain repair",
      image: "/images/project_drain_v2.jpg",
      alt: "Modern linear stainless steel shower drain installation in Sellwood",
      aspectClass: "lg:col-span-5 aspect-16/10 sm:aspect-16/11",
    },
    {
      id: "beaverton",
      location: "BEAVERTON",
      title: "Water heater",
      image: "/images/project_water_heater_v2.jpg",
      alt: "High-efficiency tankless water heater installation with copper piping in Beaverton",
      aspectClass: "lg:col-span-6 aspect-16/9 sm:aspect-16/10",
    },
    {
      id: "alberta",
      location: "ALBERTA",
      title: "Bathroom remodel",
      image: "/images/project_bathroom_v2.jpg",
      alt: "Craftsman bathroom remodel with Zellige tile and brass plumbing fixtures in Alberta",
      aspectClass: "lg:col-span-6 aspect-16/9 sm:aspect-16/10",
    },
  ],
};

export const defaultFinalCtaContent = {
  sectionNumber: "07 / CLOSING",
  headlineLine1: "FIX THE PROBLEM.",
  headlineLine2: "GET BACK TO YOUR DAY.",
  serifLine: "That's really all anyone wants.",
  description:
    "Book a service with Goodflow Plumbing. No hassle, no bloated estimates, just reliable Portland residential plumbing done right.",
  ctaLabel: "Book a Plumber",
  image: {
    src: "/images/clean_morning_kitchen.jpg",
    alt: "Ordinary warm kitchen with clean counters and morning light, everything working quietly",
    captionLeft: "PORTLAND MORNING",
    captionRight: "EVERYTHING FLOWING",
  },
};

export const defaultFooterContent = {
  description:
    "Residential plumbing for Portland, Oregon. Fictional local services crafted for honest, seamless domestic living.",
  navTitle: "Navigation",
  navLinks: [
    { label: "Services", href: "#services" },
    { label: "House Map", href: "#house-map" },
    { label: "The Work", href: "#the-work" },
    { label: "About", href: "#about" },
  ],
  serviceAreasTitle: "Service Areas",
  contactTitle: "Contact",
  dispatchLabel: "Residential Dispatch & Emergencies",
  copyright: "© 2026 Goodflow Plumbing. Water should just work.",
  locationNote: "Portland, Oregon Residential Plumbing",
};

export const defaultBookingModalContent = {
  eyebrow: "GOODFLOW SERVICE REQUEST",
  title: "Book a Plumber",
  subtitle:
    "Tell us what is happening. We will call you back to confirm a clean arrival window.",
  serviceSelectLabel: "What needs looking at?",
  urgencyLabel: "Urgency",
  urgencyOptions: ["Today / ASAP", "This Week / Flexible"],
  phoneLabel: "Your Phone Number",
  phonePlaceholder: "(503) 000-0000",
  addressLabel: "Portland Neighborhood / Zip",
  addressPlaceholder: "e.g. SE Hawthorne or 97214",
  noteLabel: "Brief Note (What are you seeing or hearing?)",
  notePlaceholder:
    "e.g. Kitchen tap won't shut off completely; slow draining bathroom basin.",
  callAlternativePrefix: "Prefer calling?",
  submitLabel: "Request Plumber",
  confirmedTitle: "Request Received",
  confirmedMessage: {
    part1: "We received your request for",
    part2: "in",
    defaultAddress: "Portland",
    part3: "A Goodflow plumber will ring you at",
    part4: "shortly to confirm the arrival window.",
  },
  doneButtonLabel: "Done",
};
