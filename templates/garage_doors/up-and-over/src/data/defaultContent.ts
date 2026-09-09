export interface StyleItem {
  id: string;
  name: string;
  sentence: string;
  image: string;
  materials: string;
  details: string;
}

export interface RepairSituation {
  id: string;
  title: string;
  part: string;
  image: string;
  description: string;
}

export interface ArchitecturePoint {
  id: string;
  label: string;
  subtitle: string;
  description: string;
  target: { x: number; y: number };
  origin: { x: number; y: number };
  linePath: string;
}

export interface MomentItem {
  id: "OPEN" | "CLOSE" | "LOCK" | "HOME";
  word: string;
  sub: string;
  narrative: string;
  lightingBrightness: number;
}

export const defaultBusinessInfo = {
  name: "UP & OVER",
  tagline: "Garage Doors • Nashville",
  city: "Nashville",
  state: "Tennessee",
  fullLocation: "Nashville, Tennessee",
  phone: "(615) 555-0143",
  phoneTel: "6155550143",
  email: "hello@upandover.example",
  motto: "Come home to something better.",
  description:
    "Architectural garage doors, precision spring replacements, whisper openers, and custom residential facades across Nashville and Middle Tennessee.",
};

export const defaultSiteMetadata = {
  title: "UP & OVER | Garage Doors Nashville",
  description:
    "Come home to something better. Garage doors, repairs and openers for homes across Nashville, Tennessee.",
  keywords: [
    "Garage Doors Nashville",
    "Residential Garage Doors",
    "Custom Garage Doors",
    "Garage Door Repair Nashville",
  ],
  openGraph: {
    title: "UP & OVER | Garage Doors Nashville",
    description:
      "Come home to something better. Garage doors, repairs and openers for homes across Nashville.",
    type: "website",
    locale: "en_US",
  },
};

export const defaultNavigationContent = {
  brand: "UP & OVER",
  subBrand: "Garage Doors • Nashville",
  mobileLocation: "Nashville, Tennessee",
  links: [
    { label: "Doors", href: "#doors" },
    { label: "Repair", href: "#repair" },
    { label: "Openers", href: "#openers" },
    { label: "About", href: "#architecture" },
  ],
  cta: "GET A QUOTE",
  menuOpen: "MENU",
  menuClose: "CLOSE",
  directLabel: "Direct:",
};

export const defaultHeroContent = {
  italicPretitle: "Open the door. Come home.",
  headingPart1: "YOUR HOME",
  headingPart2: "STARTS HERE.",
  description: "Garage doors, repairs and openers for homes across Nashville.",
  primaryCta: "GET A QUOTE",
  secondaryCta: "SEE OUR DOORS",
  bottomTag: "NASHVILLE / RESIDENTIAL",
  bottomSubtitle: "The front of the house is not an afterthought.",
  image: {
    src: "/images/hero-dusk.jpg",
    alt: "Modern residential home in Nashville with open garage",
  },
};

export const DOOR_STYLES: StyleItem[] = [
  {
    id: "traditional",
    name: "TRADITIONAL",
    sentence: "A clean shape that works with the house instead of fighting it.",
    image: "/images/style-traditional.jpg",
    materials: "Insulated steel with recessed beadboard panels",
    details:
      "Built to honor classic brick, stone, and colonial rooflines across Middle Tennessee.",
  },
  {
    id: "modern",
    name: "MODERN",
    sentence: "Flush vertical cedar panels with recessed black channel reveals.",
    image: "/images/style-modern.jpg",
    materials: "Quarter-sawn Western red cedar & anodized black aluminum",
    details:
      "Zero visible hardware from the exterior. Continuous horizontal datum lines.",
  },
  {
    id: "carriage",
    name: "CARRIAGE",
    sentence: "Hand-forged iron hardware set into painted board-and-batten.",
    image: "/images/style-carriage.jpg",
    materials: "Heavy composite timber & forged Appalachian iron",
    details:
      "The timeless proportion of an outbuilding carriage gate, engineered for effortless overhead track operation.",
  },
  {
    id: "custom",
    name: "CUSTOM",
    sentence: "Continuous floor-to-ceiling glass and oxidized zinc cladding.",
    image: "/images/style-custom.jpg",
    materials:
      "Architectural frosted insulated glass & architectural bronze frames",
    details:
      "Engineered specifically for one site, one elevation, and one set of architectural drawings.",
  },
];

export const defaultStyleSelectorContent = {
  sectionTag: "01 / Architecture & Form",
  title: "WHICH ONE?",
  requestCta: "Request This Style",
  styles: DOOR_STYLES,
};

export const MOMENTS: MomentItem[] = [
  {
    id: "OPEN",
    word: "OPEN.",
    sub: "The day begins. Light enters the home.",
    narrative: "Smooth overhead lift. Morning air and daylight fill the space.",
    lightingBrightness: 1.15,
  },
  {
    id: "CLOSE",
    word: "CLOSE.",
    sub: "Work is done. The threshold seals.",
    narrative: "Torsion counterbalance lowers the insulated panels back to grade.",
    lightingBrightness: 0.95,
  },
  {
    id: "LOCK",
    word: "LOCK.",
    sub: "The perimeter holds. Protected within.",
    narrative: "Automated deadbolts engage securely against the foundation track.",
    lightingBrightness: 0.75,
  },
  {
    id: "HOME",
    word: "HOME.",
    sub: "The evening settles. Welcome back.",
    narrative: "Warm architectural sconces cast a welcoming evening glow.",
    lightingBrightness: 1.05,
  },
];

export const defaultOpenCloseContent = {
  sectionTag: "02 / The Physical Relationship",
  subtitle: "A door opens the day. It closes the night.",
  cycleLabel: "CYCLE",
  currentStateLabel: "Current State:",
  prevLabel: "← PREVIOUS",
  nextLabel: "NEXT STATE →",
  image: {
    src: "/images/open-close-bg.jpg",
    alt: "Residential garage architecture at twilight",
  },
  moments: MOMENTS,
};

export const REPAIR_SITUATIONS: RepairSituation[] = [
  {
    id: "wont-open",
    title: "Won't open.",
    part: "Track & Guide Rail",
    image: "/images/repair-rail.jpg",
    description:
      "Vertical track misalignment or binding roller bearing preventing upward travel.",
  },
  {
    id: "wont-close",
    title: "Won't close.",
    part: "Torsion Spring Assembly",
    image: "/images/repair-spring.jpg",
    description:
      "Counterbalance spring fatigue or safety sensor optic obstruction.",
  },
  {
    id: "noise",
    title: "Makes a strange noise.",
    part: "Whisper Drive Motor",
    image: "/images/repair-opener.jpg",
    description:
      "Chain stretch, worn nylon bushings, or gear case vibration under load.",
  },
  {
    id: "opener-dead",
    title: "Opener stopped working.",
    part: "Lift Mechanism & Logic",
    image: "/images/repair-mechanism.jpg",
    description:
      "Capacitor failure, internal trolley disconnect, or receiver circuit disruption.",
  },
];

export const defaultRepairContent = {
  sectionTag: "03 / Diagnostics & Repair",
  titlePart1: "WHEN IT STOPS WORKING,",
  titlePart2: "CALL US.",
  componentLabel: "Component:",
  pointOfInspectionLabel: "Point of inspection:",
  inspectLabel: "Inspect",
  instructions: "Hover or tap a condition to inspect component",
  calloutTitle: "Tell us what's happening. We'll take a look.",
  calloutSubtitle:
    "Serving Nashville, Williamson County, Davidson County and surrounding areas.",
  bookCta: "BOOK A REPAIR",
  callPrompt: "Or call:",
  situations: REPAIR_SITUATIONS,
};

export const ARCH_POINTS: ArchitecturePoint[] = [
  {
    id: "proportion",
    label: "THE RIGHT PROPORTION",
    subtitle: "Scale and volume in balance.",
    description:
      "A garage door is one-third of the facade. If the massing is heavy, the door must ground the elevation rather than dominate it.",
    target: { x: 32, y: 72 },
    origin: { x: 18, y: 35 },
    linePath: "M 180 260 L 260 420 L 320 540",
  },
  {
    id: "color",
    label: "THE RIGHT COLOR",
    subtitle: "Tonal dialogue with cedar and stone.",
    description:
      "Matched to the window mullions and standing-seam zinc roof. Matte charcoal #202321 absorbs direct midday glare.",
    target: { x: 55, y: 44 },
    origin: { x: 68, y: 22 },
    linePath: "M 680 180 L 600 320 L 550 440",
  },
  {
    id: "door",
    label: "THE RIGHT DOOR",
    subtitle: "Horizontal datums aligned with architecture.",
    description:
      "Panel seams align strictly with the transom window height. Every groove continues an exterior sightline.",
    target: { x: 38, y: 82 },
    origin: { x: 50, y: 88 },
    linePath: "M 520 720 L 440 700 L 380 660",
  },
  {
    id: "belong",
    label: "A GARAGE DOOR SHOULD BELONG HERE.",
    subtitle: "The front of the home resolved.",
    description:
      "When properly designed and built, the door stops being a mechanical appliance. It becomes the front of the home.",
    target: { x: 48, y: 56 },
    origin: { x: 50, y: 50 },
    linePath: "M 500 500 L 480 560",
  },
];

export const ARCHITECTURE_HOTSPOTS = [
  {
    id: "proportion",
    label: "THE RIGHT PROPORTION",
    x: "34%",
    y: "56%",
    detail:
      "Garage volume sized in equilibrium with the two-story residential facade.",
    lineCoords: { x1: "34%", y1: "56%", x2: "22%", y2: "70%" },
  },
  {
    id: "color",
    label: "THE RIGHT COLOR",
    x: "54%",
    y: "40%",
    detail: "Charcoal iron tone anchored against warm natural cedar cladding.",
    lineCoords: { x1: "54%", y1: "40%", x2: "46%", y2: "24%" },
  },
  {
    id: "door",
    label: "THE RIGHT DOOR",
    x: "30%",
    y: "68%",
    detail: "Horizontal panel reveals echo window mullions and roof datum.",
    lineCoords: { x1: "30%", y1: "68%", x2: "32%", y2: "84%" },
  },
  {
    id: "belong",
    label: "A GARAGE DOOR SHOULD BELONG HERE.",
    x: "48%",
    y: "52%",
    detail: "When architecture and opening operate as a single unified gesture.",
    lineCoords: { x1: "48%", y1: "52%", x2: "62%", y2: "52%" },
  },
];

export const defaultArchitectureContent = {
  sectionTag: "04 / Design & Taste",
  titlePart1: "THE DOOR AS",
  titlePart2: "ARCHITECTURE.",
  description:
    "A garage door is one of the largest moving surfaces on a house. It shouldn't be an afterthought of stamped steel and glued-on carriage hinges.",
  dimensionLabel: "Dimension",
  facadeStudyLabel: "/ Facade Study",
  image: {
    src: "/images/architecture-facade.jpg",
    alt: "Architectural residential facade showing garage door and proportions",
  },
  points: ARCH_POINTS,
  footnotes: [
    {
      label: "01 / Sightlines",
      detail:
        "Flush jamb returns without protruding decorative trims that conflict with modern siding.",
    },
    {
      label: "02 / Thermal Envelope",
      detail:
        "Continuous polyurethane insulation core meeting R-18 thermal standards for conditioned garage spaces.",
    },
    {
      label: "03 / Sound Attenuation",
      detail:
        "Nylon ball-bearing rollers with decoupled track dampening for quiet arrival beneath master bedrooms.",
    },
  ],
};

export const defaultFinalCtaContent = {
  tag: "Nashville, Tennessee • Residential",
  headingPart1: "COME HOME TO",
  headingPart2: "SOMETHING BETTER.",
  subtitle: "Let's find the right door.",
  primaryCta: "GET A QUOTE",
  phone: "(615) 555-0143",
  footerNote: "Direct craftsmanship • Nashville residential replacement & repair",
  image: {
    src: "/images/final-cta-bg.jpg",
    alt: "Modern residential home in Nashville at night with warm illuminated garage",
  },
};

export const defaultFooterContent = {
  brand: "UP & OVER",
  tagline: "Come home to something better.",
  description:
    "Architectural garage doors, precision spring replacements, whisper openers, and custom residential facades across Nashville and Middle Tennessee.",
  servicesTitle: "Services",
  services: [
    { label: "Doors", service: "Garage Door Replacement" },
    { label: "Repair", service: "Garage Door Repair" },
    { label: "Openers", service: "Openers" },
    { label: "Custom", service: "Custom Doors" },
  ],
  linksTitle: "Links",
  links: [
    { label: "Doors", href: "#doors" },
    { label: "Repair", href: "#repair" },
    { label: "About", href: "#architecture" },
    { label: "Contact" },
  ],
  contactTitle: "Contact",
  copyright: "© 2026 Up & Over. All rights reserved.",
  cityTag: "NASHVILLE, TENNESSEE",
};

export const defaultQuoteModalContent = {
  headerTag: "Up & Over • Nashville, TN",
  titleDefault: "Come Home to Something Better.",
  titleSubmitted: "We'll Take a Look.",
  services: [
    "Garage Door Replacement",
    "Garage Door Repair",
    "Openers",
    "Custom Doors",
  ],
  nameLabel: "Your Name",
  namePlaceholder: "E.g. Sarah Bell",
  phoneLabel: "Phone Number",
  phonePlaceholder: "(615) 555-0143",
  addressLabel: "Neighborhood or Address in Nashville",
  addressPlaceholder: "Belle Meade, Green Hills, East Nashville, Franklin...",
  notesLabel: "Notes on Your Door or Issue",
  notesPlaceholder: "Tell us what's happening or what style you envision...",
  submitCta: "Send Request",
  directLineLabel: "Direct Line:",
  thankYouTitle: "Thank you,",
  thankYouDefaultName: "neighbor",
  thankYouBodyPart1: "We received your note for",
  thankYouBodyPart2:
    "A local technician from our Nashville shop will call you shortly at",
  closeBtn: "Close Window",
};
