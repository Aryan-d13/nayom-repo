export interface NavLink {
  label: string;
  href: string;
}

export interface RoomItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  beforeImage: string;
  details: string[];
}

export interface MaterialItem {
  id: string;
  name: string;
  phrase: string;
  image: string;
  description: string;
  origin: string;
}

export interface ProcessStage {
  step: string;
  title: string;
  sentence: string;
  expanded: string;
}

export interface ProjectStory {
  id: string;
  neighborhood: string;
  title: string;
  type: string;
  description: string;
  image: string;
  beforeImage: string;
  scope: string;
  completedYear: string;
  aspectRatio: string;
}

export const defaultSiteMetadata = {
  title: "SECOND STORY | Residential Remodeling San Francisco",
  description:
    "Make room for what matters. Thoughtful residential remodeling in San Francisco for homes that deserve to be lived in differently. Kitchens, bathrooms, additions, whole-home renovations.",
  keywords: [
    "San Francisco remodeling",
    "residential architecture",
    "home renovation SF",
    "interior remodeling",
    "kitchen remodel San Francisco",
    "Victorian home renovation",
  ],
  openGraph: {
    title: "SECOND STORY — Residential Remodeling",
    description: "Your home has more to give. Let's find it.",
    locale: "en_US",
    type: "website" as const,
  },
};

export const defaultBrand = {
  name: "SECOND STORY",
  descriptor: "Residential Remodeling",
  location: "San Francisco, California",
  address: "San Francisco, CA",
  phone: "(415) 555-0168",
  phoneRaw: "4155550168",
  email: "hello@secondstory.example",
  tagline: "Make room for what matters.",
  primaryCTA: "Start a Project",
  secondaryCTA: "See Our Work",
  emotionalPromise: "You know this house. Imagine what it could become.",
};

export const defaultNavLinks: NavLink[] = [
  { label: "WORK", href: "#work" },
  { label: "PROCESS", href: "#process" },
  { label: "ABOUT", href: "#about" },
];

export const defaultHeroContent = {
  category: "SAN FRANCISCO RESIDENTIAL REMODELING",
  headline: "YOUR HOME HAS MORE TO GIVE.",
  serifSubhead: "Let's find it.",
  supportingText:
    "Thoughtful remodeling for homes that deserve to be lived in differently.",
  image:
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2200&q=85",
  imageAlt:
    "Imperfect historic San Francisco Victorian home interior with great architectural bones",
  remodeledImage:
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85",
  badge: "BEFORE",
  previewBadge: "PREVIEW: FINISHED POTENTIAL",
  houseMeta: "San Francisco Victorian • Built 1904",
  peekTooltip: "Hold to preview remodeled potential",
  peekActiveLabel: "Showing Remodel",
  peekInactiveLabel: "Hold to Peek Potential",
};

export const defaultFirstTransformation = {
  sectionNumber: "01 / CONTINUOUS TRANSFORMATION",
  sectionTitle: "The Evolution of One Room",
  liveScrubLabel: "Cursor Connected • Live Scrub",
  scrollScrubLabel: "Scroll or Move Cursor to Reveal",
  beforeImage:
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=2000&q=85",
  beforeAlt:
    "Original unrenovated kitchen with dated cabinetry and authentic morning daylight",
  afterImage:
    "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=2200&q=85",
  afterAlt:
    "Finished architectural kitchen with warm oak joinery and honed stone",
  fromLabel: "FROM THIS",
  toLabel: "TO THIS",
  dragHelpActive: "Drag or Glide Cursor to Compare",
  dragHelpInactive: "Hover or Scroll to Compare",
  caption: "A better kitchen doesn't have to mean a completely different home.",
  subCaption:
    "Original Victorian structural envelope preserved. Daylight maximized. Custom rift-cut white oak cabinetry paired with honed limestone counters.",
};

export const defaultRoomExplorerContent = {
  sectionNumber: "02 / WHAT COULD CHANGE?",
  heading: "Spaces built for how you actually live.",
  inquireLabel: "Inquire",
  beforeBadge: "Before Renovation",
  afterBadge: "Transformed Architecture",
  viewAfterLabel: "View After",
  compareBeforeLabel: "Compare Before",
  subCaptionPrefix: "San Francisco Residential • Custom joinery & structural flow",
};

export const defaultRoomsContent: RoomItem[] = [
  {
    id: "kitchen",
    title: "KITCHEN",
    tagline: "More room to cook. More room to gather. More room to stay awhile.",
    description:
      "We strip away decades of dark upper cabinets and awkward corners, turning the kitchen into the calm, intuitive center of daily life.",
    image:
      "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1600&q=85",
    beforeImage:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85",
    details: ["Fluted oak island", "Concealed ventilation", "Honed quartzite slabs"],
  },
  {
    id: "bathroom",
    title: "BATHROOM",
    tagline: "A room you use every day should feel good every day.",
    description:
      "Quiet plaster walls, steam-resistant natural light, and floor-to-ceiling simplicity designed to start and end your day in composure.",
    image:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85",
    beforeImage:
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=85",
    details: ["Continuous lime plaster", "Walk-in curbless shower", "Unlacquered brass"],
  },
  {
    id: "living",
    title: "LIVING SPACE",
    tagline: "Better light. Better flow. A better way through the house.",
    description:
      "Opening up sightlines without losing the charm of historic San Francisco trim, coved ceilings, and dedicated quiet reading corners.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85",
    beforeImage:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85",
    details: ["Restored Victorian moldings", "Concealed acoustic treatment", "Wide plank Douglas fir"],
  },
  {
    id: "whole-home",
    title: "WHOLE HOME",
    tagline: "Sometimes the answer is changing more than one room.",
    description:
      "Connecting levels, re-engineering structural load lines, and allowing your entire house to breathe as a unified, purposeful home.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
    beforeImage:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=85",
    details: ["Structural envelope refinement", "Unified thermal envelope", "Custom architectural joinery"],
  },
];

export const defaultMaterialsSectionContent = {
  sectionNumber: "03 / MATERIALS — TOUCH THE PROJECT",
  heading: "Surfaces that age with grace.",
  subheading: "Real materials laid out flat. No artificial sheen, no synthetic substitutes.",
  mobileHelper: "TAP OR SWIPE TO EXPLORE SAMPLES",
};

export const defaultMaterialsContent: MaterialItem[] = [
  {
    id: "oak",
    name: "OAK",
    phrase: "Warmth without trying too hard.",
    image:
      "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=900&q=85",
    description: "Rift-sawn white oak with matte zero-VOC oil finish.",
    origin: "Pacific Northwest mills",
  },
  {
    id: "limestone",
    name: "LIMESTONE",
    phrase: "Quiet texture.",
    image:
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=900&q=85",
    description: "Honed French limestone with gentle fossil markings.",
    origin: "Burgundy, France",
  },
  {
    id: "brass",
    name: "BRASS",
    phrase: "A little bit of shine.",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=85",
    description: "Raw unlacquered architectural brass that patinas over time.",
    origin: "Hand-turned in California",
  },
  {
    id: "plaster",
    name: "PAINTED PLASTER",
    phrase: "Depth in quiet light.",
    image:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=85",
    description: "Troweled lime plaster with natural mineral pigmentation.",
    origin: "Breathable mineral base",
  },
  {
    id: "tile",
    name: "HANDMADE TILE",
    phrase: "Character pressed by hand.",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=85",
    description: "Zellige terracotta with organic surface variation and soft glaze.",
    origin: "Artisanal hand-glazed kiln",
  },
];

export const defaultProcessSectionContent = {
  sectionNumber: "04 / BEFORE WE BUILD",
  heading: "GOOD REMODELING ISN'T JUST ABOUT THE FINISH.",
  serifSubtitle: "It's about everything before it.",
  stagePrefix: "STAGE",
  stageSuffix: "OF 04",
};

export const defaultProcessStages: ProcessStage[] = [
  {
    step: "01",
    title: "TALK",
    sentence: "Tell us what isn't working. Tell us what you wish you had.",
    expanded:
      "We walk through your home together. We don't bring sales decks; we bring pencils and measuring tapes. We talk about where the light lands at 8 AM and where you drop your keys.",
  },
  {
    step: "02",
    title: "PLAN",
    sentence: "We'll figure out what it takes before anything gets torn out.",
    expanded:
      "Every beam, permit line, electrical run, and material board is resolved first. No surprises behind opened lath-and-plaster walls that weren't accounted for in budget and timeline.",
  },
  {
    step: "03",
    title: "BUILD",
    sentence: "The messy part. Handled carefully.",
    expanded:
      "Clean job sites, HEPA air scrubbers, zipped dust barriers, and daily digital field notes. We treat your house with respect because you still have to come home here.",
  },
  {
    step: "04",
    title: "LIVE",
    sentence: "Then you get your home back.",
    expanded:
      "Every drawer slides flush. Every switch feels intentional. You walk through the front door and notice the calm that follows when a space finally fits your life.",
  },
];

export const defaultProjectStoriesSectionContent = {
  sectionNumber: "05 / THREE HOMES",
  heading: "Recent Transformations.",
  instruction:
    "Hover each photograph to glimpse what the room looked like before we touched it.",
  beforeBadge: "BEFORE RENOVATION",
  afterBadge: "FINISHED SPACE",
  viewProjectLabel: "VIEW PROJECT",
};

export const defaultProjectStories: ProjectStory[] = [
  {
    id: "noe-valley",
    neighborhood: "NOE VALLEY",
    title: "Kitchen + dining renovation",
    type: "Victorian Flat Transformation",
    description:
      "Removing two non-bearing partitions and re-framing the south garden facade opened up an Edwardian flat to continuous sun, turning a boxed-in pantry into an architectural kitchen.",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1800&q=85",
    beforeImage:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1800&q=85",
    scope: "1,150 sq ft interior renovation, custom joinery, steel garden door",
    completedYear: "2025",
    aspectRatio: "aspect-[16/9] lg:col-span-12",
  },
  {
    id: "bernal-heights",
    neighborhood: "BERNAL HEIGHTS",
    title: "Primary suite renovation",
    type: "Attic & Upper Level Retreat",
    description:
      "A former drafty storage attic re-imagined as a tranquil sanctuary with limewash walls, skylit wet room, and custom Douglas fir platform framing.",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=85",
    beforeImage:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=85",
    scope: "820 sq ft suite conversion with integrated dressing corridor",
    completedYear: "2025",
    aspectRatio: "aspect-[4/5] lg:col-span-5",
  },
  {
    id: "inner-sunset",
    neighborhood: "INNER SUNSET",
    title: "Whole-home update",
    type: "1912 Craftsman Rebirth",
    description:
      "Restoring the integrity of hundred-year-old timber framing while bringing acoustic calm, concealed heat pumps, and a luminous kitchen-dining axis.",
    image:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1800&q=85",
    beforeImage:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=85",
    scope: "2,400 sq ft whole-home architecture & contractor build",
    completedYear: "2026",
    aspectRatio: "aspect-[16/10] lg:col-span-7",
  },
];

export const defaultTeamContent = {
  sectionNumber: "06 / THE PEOPLE BEHIND IT",
  name: "Maya Chen",
  role: "Founder + Project Lead",
  quote: "“We spend a lot of time figuring out what the house is already trying to be.”",
  supportingText:
    "We care about the details, but we care just as much about how the finished space feels to live in.",
  image:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85",
  imageAlt: "Maya Chen, Founder and Project Lead at Second Story",
  fieldNotesLeft: "FIELD NOTES / SAN FRANCISCO",
  fieldNotesRight: "SITE VISIT",
  bio: "Trained in both residential architecture and on-site general contracting, Maya founded Second Story to bridge the gap between architectural ambition and the realities of San Francisco craft construction.",
};

export const defaultFinalTransformation = {
  sectionNumber: "07 / THE REALIZATION",
  beforeImage:
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2200&q=85",
  beforeAlt: "Original historic San Francisco home before renovation",
  afterImage:
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85",
  afterAlt: "Fully remodeled, warm and complete architectural interior",
  promptLine1: "WHAT IF YOU DIDN'T MOVE?",
  promptLine2: "WHAT IF YOU JUST",
  serifKeyword: "CHANGED HOME?",
  beforeBadge: "ORIGINAL BONES • 1904 VICTORIAN",
  afterBadge: "REMODELED & COMPLETE",
  stageNames: {
    bones: "ORIGINAL BONES",
    plaster: "PLASTER & PAINT",
    joinery: "CUSTOM OAK JOINERY",
    complete: "REMODELED & COMPLETE",
  },
  stepButtons: [
    { label: "Original", val: 0 },
    { label: "Plaster", val: 35 },
    { label: "Cabinetry", val: 65 },
    { label: "Complete", val: 100 },
  ],
  syncScrollLabel: "Sync Scroll",
  statusMessages: {
    original: "Showing 100% Original Home • Scroll down to begin transformation",
    complete: "Showing 100% Remodeled Space • Ready for what's next",
    moving: "Transforming in real-time with scroll",
  },
};

export const defaultFooterContent = {
  description:
    "Residential remodeling in San Francisco. Architecture, interior renovation, and licensed general contracting under one roof.",
  navHeading: "NAVIGATION",
  servicesHeading: "SERVICES",
  services: [
    "Kitchens",
    "Bathrooms",
    "Whole Home",
    "Additions",
    "Interior Renovations",
  ],
  contactHeading: "CONTACT",
  copyright: "© 2026 Second Story. All rights reserved.",
  location: "San Francisco, CA",
  topLabel: "TOP",
};

export const defaultProjectModalContent = {
  tag: "CONSULTATION WALKTHROUGH",
  title: "Start a Project",
  subtitle: "Tell us what isn't working. Tell us what you wish you had.",
  servicesLabel: "Scope of Remodel",
  services: [
    "Kitchen",
    "Bathroom",
    "Living Space",
    "Whole Home",
    "Addition",
  ],
  neighborhoods: [
    "Noe Valley",
    "Bernal Heights",
    "Inner Sunset",
    "Pacific Heights",
    "Mission District",
    "Richmond",
    "Marina / Cow Hollow",
    "Potrero Hill",
    "Other San Francisco Area",
  ],
  nameLabel: "Your Name",
  namePlaceholder: "Elena Vance",
  phoneLabel: "Phone Number",
  phonePlaceholder: "(415) 555-0199",
  emailLabel: "Email Address",
  emailPlaceholder: "elena@example.com",
  neighborhoodLabel: "San Francisco Neighborhood",
  notesLabel: "What isn't working about your home right now?",
  notesPlaceholder:
    "e.g. Dated kitchen with no counter space; Victorian layout feels closed off from natural sunlight...",
  submitLabel: "Request Walkthrough",
  callAlternativePrefix: "Prefer to call?",
  successTitle: "Thank you for reaching out.",
  successMessage:
    "Maya or our project lead will review your home notes and follow up within one business day to discuss an on-site walkthrough.",
  closeButtonLabel: "Close Window",
};

export const defaultProjectDetailModalContent = {
  beforeBadge: "BEFORE RENOVATION",
  afterBadge: "FINISHED REMODEL",
  showFinishedLabel: "Show Finished",
  showBeforeLabel: "Show Before",
  transformationHeading: "THE TRANSFORMATION",
  scopeHeading: "PROJECT SCOPE",
  actionPrompt: "Ready to explore what your space could become?",
  discussButtonLabel: "Discuss A Similar Project",
};
