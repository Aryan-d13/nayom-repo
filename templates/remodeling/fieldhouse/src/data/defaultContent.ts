export interface NavLink {
  label: string;
  href: string;
}

export interface KeepDetail {
  id: string;
  title: string;
  description: string;
  subtitle: string;
  image: string;
  alt: string;
}

export interface TransformationItem {
  id: string;
  category: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  captionLines: string[];
  subtext: string;
}

export interface FloorPlanRoom {
  id: string;
  name: string;
  path?: string;
  labelCoords?: { x: number; y: number };
  question: string;
  reflection: string;
  architectNote: string;
}

export interface MaterialSample {
  id: string;
  name: string;
  descriptor: string;
  coords: { x: number; y: number };
}

export const defaultSiteMetadata = {
  title: "FIELDHOUSE | Residential Remodeling Portland, Oregon",
  description:
    "Homes worth staying for. Remodeling thoughtful homes without removing the things that make them feel like home. Kitchens, bathrooms, additions, whole-home, and custom built-ins in Portland, Oregon.",
  keywords: [
    "Portland residential remodeling",
    "home remodeling Portland Oregon",
    "craftsman home renovation",
    "historic home preservation Portland",
    "kitchen remodeling Portland",
    "bathroom remodeling Portland",
  ],
  openGraph: {
    title: "FIELDHOUSE — Residential Remodeling",
    description: "Homes worth staying for. Portland, Oregon.",
    locale: "en_US",
    type: "website" as const,
  },
};

export const defaultBrand = {
  name: "FIELDHOUSE",
  descriptor: "Residential Remodeling",
  location: "Portland, Oregon",
  address: "Portland, Oregon",
  tagline: "Homes worth staying for.",
  phone: "(503) 555-0161",
  phoneRaw: "5035550161",
  email: "hello@fieldhouse.example",
  primaryCTA: "Plan a Project",
  secondaryCTA: "Explore Our Work",
  secondaryAltCTA: "SEE OUR WORK",
  services: [
    "Kitchens",
    "Bathrooms",
    "Additions",
    "Whole-home remodeling",
    "Custom built-ins",
  ],
  mobilePlanCta: "Plan",
};

export const defaultNavLinks: NavLink[] = [
  { label: "What We Keep", href: "#what-we-keep" },
  { label: "Transformations", href: "#transformations" },
  { label: "The Plan", href: "#the-plan" },
  { label: "Materials", href: "#materials" },
  { label: "About", href: "#people" },
];

export const defaultHeroContent = {
  label: "PORTLAND / RESIDENTIAL REMODELING",
  headline: "KEEP\nTHE GOOD\nPARTS.",
  headlineLines: ["KEEP", "THE GOOD", "PARTS."],
  serifLine: "Then make the rest work better.",
  supportingCopy:
    "Remodeling thoughtful homes without removing the things that make them feel like home.",
  primaryCTA: "PLAN A PROJECT →",
  secondaryCTA: "SEE OUR WORK",
  architectNote: "original trim\nkeep this",
  architectNoteTag: "architect note #01",
  cornerBadge: "1918 Craftsman · Portland",
  image:
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2200&q=85",
  imageAlt:
    "Character-rich Portland craftsman home interior with original dark wood trim, worn floorboards, and warm afternoon light",
};

export const defaultWhatWeKeepContent = {
  sectionTag: "Preservation First",
  headline: "SOME THINGS\nSHOULDN'T\nBE REPLACED.",
  headlineLines: ["SOME THINGS", "SHOULDN'T", "BE REPLACED."],
  subtextFirst: "Good remodeling isn't always about making everything new.",
  subtextSecond: "Sometimes it's about knowing what to leave alone.",
  instructionHint: "Select or hover any detail to view character element",
  preservedBadge: "Preserved Element",
  locationBadge: "Portland Craft",
  items: [
    {
      id: "windows",
      title: "THE WINDOWS",
      subtitle: "True divided-light fir frames",
      description:
        "Wavy cylinder glass that distorts the afternoon rain just enough. We restore the counterweights, strip the old lead, and weatherstrip the sashes rather than throwing out a century of seasoned timber.",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=85",
      alt: "Restored historic wood casement windows letting in soft natural daylight",
    },
    {
      id: "floorboards",
      title: "THE FLOORBOARDS",
      subtitle: "Old-growth Douglas fir with history",
      description:
        "Slightly worn, patinated where decades of feet have turned from the hall into the kitchen. We hand-mend split boards and finish with matte hardwax oil rather than plasticizing them.",
      image:
        "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1800&q=85",
      alt: "Authentic aged wide-plank wood floorboards with honest patina and sunlight",
    },
    {
      id: "light",
      title: "THE LIGHT",
      subtitle: "How the Pacific Northwest afternoon moves",
      description:
        "The way 3:30 PM sunlight filters across the plaster hallway. Any wall we move or opening we enlarge is drawn around preserving where that quiet beam lands.",
      image:
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1800&q=85",
      alt: "Warm raking golden afternoon light falling gently on historic plaster wall and wood sill",
    },
    {
      id: "corner",
      title: "THE WEIRD LITTLE CORNER",
      subtitle: "The quirk that makes it this house",
      description:
        "The offset chimney bump-out, the odd pantry jog, or the angled turn under the stair. Standard contractors tear it out or box it in; we turn it into a dedicated telephone desk or book alcove.",
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1800&q=85",
      alt: "A charming idiosyncratic residential alcove nook with built-in bookshelves and natural shadow",
    },
  ] as KeepDetail[],
};

export const defaultTransformationsSectionContent = {
  sectionTag: "Spatial Evolution",
  headlineLines: ["THEN WE CHANGE", "WHAT NEEDS", "CHANGING."],
  subtitle: "A quiet sequence of three residential transformations.",
  toggleBefore: "Before",
  toggleFinished: "Finished",
  originalSpaceBadge: "Original Space",
  finishedBadge: "Finished",
};

export const defaultTransformationsContent: TransformationItem[] = [
  {
    id: "kitchen",
    category: "KITCHEN",
    title: "1924 Craftsman Galley to Living Kitchen",
    beforeImage:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1800&q=85",
    afterImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85",
    beforeAlt: "Dated closed-off kitchen prior to remodeling",
    afterAlt: "Open, light-filled kitchen with rift-sawn oak and soapstone counters",
    captionLines: ["More room.", "Better light.", "Same house."],
    subtext:
      "We took down the unoriginal 1970s soffits, opened the back wall to the garden, and designed inset cabinetry that respects the 1920s architecture.",
  },
  {
    id: "bathroom",
    category: "BATHROOM",
    title: "Second-Floor Bath with Morning Southern Light",
    beforeImage:
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1800&q=85",
    afterImage:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1800&q=85",
    beforeAlt: "Cramped utilitarian bathroom prior to renovation",
    afterAlt: "Serene lime plaster bathroom with unlacquered brass and daylight",
    captionLines: ["A quieter room", "to start the day."],
    subtext:
      "Waterproof lime plaster walls, unlacquered brass hardware that will age with the house, and a reclaimed double-hung window brought back into service.",
  },
  {
    id: "living",
    category: "LIVING SPACE",
    title: "Formal Parlor & Dining Room Reconnection",
    beforeImage:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=85",
    afterImage:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85",
    beforeAlt: "Disjointed living area before reconfiguring spatial flow",
    afterAlt: "Unified, comfortable living space with restored trim and inviting flow",
    captionLines: ["Better flow.", "More reasons to stay in."],
    subtext:
      "We widened the central cased opening by 42 inches using salvaged old-growth fir trim milled to match the parlor's 1912 baseboards exactly.",
  },
];

export const defaultFloorPlanContent = {
  sectionTag: "Architectural Layout · Working Draft",
  headline: "START WITH\nHOW YOU LIVE.",
  headlineLines: ["START WITH", "HOW YOU LIVE."],
  conversationalSubtitle:
    "This should feel like a thoughtful conversation rather than a technical planning tool.",
  cta: "PLAN A PROJECT →",
  selectedPrefix: "Selected:",
  sketchTitle: "SKETCH: RESIDENTIAL STUDY · REV 03",
  sketchScale: "SCALE: 1/4\" = 1'-0\"",
  sketchInstruction: "Click any room on the plan to view spatial design reflection",
  activeSelectionTag: "● Active selection",
  annotations: {
    kitchenLight: "keep natural light axis",
    openingDimension: "open +42\"",
  },
  questions: [
    {
      q: "Where does everyone end up at the end of the day?",
      room: "KITCHEN",
      note: "Keep the island clear of appliances; make room for elbows and conversation.",
    },
    {
      q: "What do you wish had another six feet?",
      room: "DINING",
      note: "Extend the sightline directly through French doors to the garden.",
    },
    {
      q: "Which room never quite works?",
      room: "ENTRY",
      note: "A shallow bench and recessed coat hooks turn a bottleneck into a landing spot.",
    },
  ],
  rooms: [
    {
      id: "entry",
      name: "ENTRY",
      question: "Which room never quite works?",
      reflection:
        "The entry shouldn't be an afterthought. Built-in drop niches and recessed storage give coats and wet boots a deliberate home.",
      architectNote: "reclaim 18\" niche for bench",
    },
    {
      id: "living",
      name: "LIVING",
      question: "Where do you read when the rain sets in?",
      reflection:
        "Original box-beam ceiling preserved. We aligned the seating axis with the brick fireplace and morning window.",
      architectNote: "preserve box-beam ceiling",
    },
    {
      id: "dining",
      name: "DINING",
      question: "What do you wish had another six feet?",
      reflection:
        "A wide cased doorway connects the dining table directly to the kitchen while preserving the intimate room proportions.",
      architectNote: "widen cased opening +42\"",
    },
    {
      id: "kitchen",
      name: "KITCHEN",
      question: "Where does everyone end up at the end of the day?",
      reflection:
        "Low counters with honest materials. A quiet scullery corner handles the clutter so the island stays an inviting gathering place.",
      architectNote: "continuous honed stone run",
    },
    {
      id: "primary",
      name: "PRIMARY",
      question: "How do you wake up with the light?",
      reflection:
        "Relocating the closet opened up a southern exposure window that was walled over in 1968.",
      architectNote: "uncover 1920 window opening",
    },
    {
      id: "bath",
      name: "BATH",
      question: "Can a small space feel completely calm?",
      reflection:
        "Curbless shower and unified lime plaster eliminate visual clutter, making a modest footprint feel generous.",
      architectNote: "curbless drain + lime plaster",
    },
  ],
};

export const defaultMaterialTableContent = {
  sectionTag: "Tactile Materiality",
  headlineLines: ["GOOD MATERIALS", "DON'T NEED"],
  serifAccent: "to shout.",
  description:
    "Materials chosen for how they feel to the hand at seven in the morning, how they handle Portland light, and how honestly they will age thirty years from now.",
  image:
    "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=2200&q=85",
  imageAlt:
    "Architectural designer work table with cut white oak, honed stone, unlacquered brass hardware, paint chips, and folded plans",
  samples: [
    {
      id: "oak",
      name: "WHITE OAK",
      descriptor: "Rift-sawn, finished with matte vegetable oil",
      coords: { x: 28, y: 35 },
    },
    {
      id: "stone",
      name: "HONED STONE",
      descriptor: "Unfilled limestone with hand-rubbed edges",
      coords: { x: 62, y: 32 },
    },
    {
      id: "brass",
      name: "AGED BRASS",
      descriptor: "Unlacquered, intended to deepen with touch",
      coords: { x: 38, y: 68 },
    },
    {
      id: "paint",
      name: "SOFT WHITE",
      descriptor: "Mineral paint that absorbs rainy-day glare",
      coords: { x: 74, y: 65 },
    },
  ] as MaterialSample[],
};

export const defaultPeopleContent = {
  sectionTag: "The Craftsmen & Designers",
  person: "Maya Ellis",
  role: "Founder / Project Lead",
  locationTag: "On Site · Portland",
  quotePart1: "“We're in people's homes\nfor a long time.",
  quoteHighlight: "We think that should mean something.”",
  body: "We care about the plan, the finish, and all the small decisions that make a house feel right.",
  linkText: "MEET THE TEAM →",
  image:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1800&q=85",
  imageAlt:
    "Maya Ellis and the Fieldhouse carpentry team reviewing architectural floor plans inside a historic renovation in progress",
};

export const defaultFinalCtaContent = {
  sectionTag: "Staying in Place",
  headline: "MAYBE YOU\nDON'T NEED\nA NEW HOME.",
  headlineLines: ["MAYBE YOU", "DON'T NEED", "A NEW HOME."],
  serifLine: "Maybe you need\na better version\nof this one.",
  primaryCTA: "PLAN A PROJECT →",
  phone: "(503) 555-0161",
  location: "Portland, Oregon",
  image:
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=85",
  imageAlt:
    "Warm, peaceful finished Portland home interior in late afternoon light with handcrafted woodwork and quiet character",
};

export const defaultFooterContent = {
  brand: "FIELDHOUSE",
  tagline: "Homes worth staying for.",
  description:
    "Portland, Oregon residential remodeling focused on historic character preservation, daylight, and enduring craftsmanship.",
  navHeading: "Navigation",
  links: [
    { label: "Work", href: "#transformations" },
    { label: "Process", href: "#the-plan" },
    { label: "About", href: "#people" },
    { label: "Contact", href: "#contact" },
  ],
  servicesHeading: "Services",
  services: [
    "Kitchens",
    "Bathrooms",
    "Additions",
    "Whole Home",
    "Built-ins",
  ],
  contactHeading: "Portland Studio",
  contact: {
    phone: "(503) 555-0161",
    email: "hello@fieldhouse.example",
    location: "Portland, Oregon",
  },
  copyright: "© 2026 Fieldhouse",
  colophon: {
    descriptor: "Residential Remodeling",
    separator: "·",
    location: "Portland, OR",
  },
};

export const defaultProjectModalContent = {
  studioTag: "Fieldhouse · Portland",
  title: "Tell us about your house.",
  description:
    "We take on a limited number of residential renovations each year so every home gets our full attention.",
  fields: {
    nameLabel: "Your Name *",
    namePlaceholder: "Jane & David",
    phoneLabel: "Phone *",
    phonePlaceholder: "(503) 555-0100",
    emailLabel: "Email Address *",
    emailPlaceholder: "jane@example.com",
    neighborhoodLabel: "Portland Neighborhood",
    neighborhoodPlaceholder: "e.g. Laurelhurst, Irvington, Ladd's",
    houseEraLabel: "Approximate Era of House",
    houseEraOptions: [
      "1900–1920s Craftsman / Foursquare",
      "1930s–1940s Tudor / Colonial",
      "1950s–1960s Mid-Century Ranch",
      "Later / Custom",
    ],
    roomLabel: "Primary Area of Focus",
    roomOptions: [
      "Kitchen Remodel",
      "Bathroom Remodel",
      "Main Floor / Flow Reconfiguration",
      "Whole-Home Remodel",
      "Addition / Primary Suite",
      "Custom Architectural Built-ins",
    ],
    notesLabel: "What do you love most about the house, and what frustrates you?",
    notesPlaceholder:
      "Tell us about the light, the awkward doors, or what made you fall in love with the place...",
  },
  callDirectPrefix: "Or call direct:",
  submitButton: "Submit Project Details →",
  success: {
    title: "Thank you.",
    message:
      "We received your note. Maya or one of our project leads will review your home details and reach out within one business day.",
    closeButton: "Close",
  },
};
