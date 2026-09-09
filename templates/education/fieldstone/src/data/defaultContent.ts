export interface Interest {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  alt: string;
  color: string;
  quote: string;
}

export interface DayMoment {
  time: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  alt: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  detail: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  sentence: string;
  description: string;
  image: string;
  x: number; // percentage coordinate on map (0-100)
  y: number; // percentage coordinate on map (0-100)
}

export interface PhilosophyPillar {
  id: string;
  title: string;
  subtitle: string;
}

export interface AdmissionAction {
  id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
}

export const defaultSchoolInfo = {
  name: "FIELDSTONE",
  subname: "Independent School",
  location: "Seattle, Washington",
  locationShort: "Seattle, WA",
  postcode: "Seattle, WA 98103",
  ages: "K–12",
  tagline: "Come curious.",
  serifHero: "Leave with more questions.",
  leadCopy:
    "Fieldstone is an independent K–12 school for students who like to ask why.",
  phone: "(206) 555-0178",
  email: "hello@fieldstone.example",
  address: "4210 Greenwood Avenue, Seattle",
  hours: "Mon–Fri · 8 AM–4 PM",
  primaryCta: "VISIT THE SCHOOL →",
  secondaryCta: "Explore Fieldstone",
  disclaimer: "This fictional website is for demonstration purposes.",
  copyright: "© 2026 Fieldstone",
};

export const defaultSiteMetadata = {
  title: "Fieldstone Independent School | Seattle, WA (K–12) — Come Curious",
  description:
    "Fieldstone is an independent K–12 school in Seattle for students who like to ask why. Not just classrooms and schedules, but questions, experiments, friendships, and discoveries.",
  keywords: [
    "Fieldstone Independent School",
    "Seattle K-12 school",
    "independent school Seattle",
    "inquiry-based learning",
    "experiential education",
  ],
  authors: [{ name: "Fieldstone Independent School" }],
  openGraph: {
    title: "Fieldstone Independent School — Come Curious",
    description:
      "Fieldstone is an independent K–12 school in Seattle for students who like to ask why.",
    url: "https://fieldstone.example",
    siteName: "Fieldstone School",
    locale: "en_US",
    type: "website" as const,
  },
};

export const defaultNavbarContent = {
  brand: "FIELDSTONE",
  subBrand: "Seattle · K–12",
  links: [
    { label: "School", targetId: "hero" },
    { label: "Life Here", targetId: "interests" },
    { label: "Campus", targetId: "campus" },
    { label: "Admissions", targetId: "admissions" },
  ],
  cta: "VISIT FIELDSTONE",
  mobileMenuLabel: "Explore Fieldstone",
  mobileToggleOpen: "MENU",
  mobileToggleClose: "CLOSE",
  mobileLinks: [
    { number: "01", label: "School", targetId: "hero" },
    { number: "02", label: "Life Here", targetId: "interests" },
    { number: "03", label: "A Day Unfolding", targetId: "day" },
    { number: "04", label: "The Campus", targetId: "campus" },
    { number: "05", label: "Admissions", targetId: "admissions" },
  ],
  mobileCta: "VISIT FIELDSTONE →",
  mobileFooter: "(206) 555-0178 · Seattle, WA",
};

export const defaultHeroPhotos = [
  {
    id: "painting",
    title: "Student Painting",
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
    alt: "Young student with brushes and watercolor palette",
    rotation: "-3deg",
    className: "w-48 sm:w-56 md:w-64 lg:w-72 aspect-[4/5]",
    delay: 0.1,
  },
  {
    id: "microscope",
    title: "Child with Microscope",
    src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    alt: "Student peering into a laboratory optical microscope",
    rotation: "2.5deg",
    className: "w-52 sm:w-60 md:w-68 lg:w-80 aspect-[1/1]",
    delay: 0.25,
  },
  {
    id: "outside",
    title: "Playing Outside",
    src: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=800&q=80",
    alt: "Children running freely across natural outdoor lawn",
    rotation: "-2deg",
    className: "w-44 sm:w-52 md:w-60 lg:w-64 aspect-[3/4]",
    delay: 0.35,
  },
  {
    id: "theatre",
    title: "Theatre Rehearsal",
    src: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80",
    alt: "Students rehearsing expressive stage drama under stage lighting",
    rotation: "3deg",
    className: "w-44 sm:w-52 md:w-56 lg:w-64 aspect-[4/3]",
    delay: 0.45,
  },
  {
    id: "building",
    title: "Student Building",
    src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    alt: "Student working on physical engineering and wood fabrication",
    rotation: "-1.5deg",
    className: "w-48 sm:w-56 md:w-64 lg:w-72 aspect-[4/5]",
    delay: 0.55,
  },
];

export const defaultHeroContent = {
  topBadge: "SEATTLE / K–12",
  topBadgeSub: "· Est. Greenwood",
  headingMain: "COME",
  headingAccent: "CURIOUS.",
  handwrittenAccent: "(always)",
  serifSubheading: "Leave with more questions.",
  bodyCopy:
    "Fieldstone is an independent K–12 school for students who like to ask why. School is not just desks and schedules. It is experiments, arguments, mistakes, and ideas you cannot stop thinking about on the bus ride home.",
  primaryCta: "VISIT THE SCHOOL →",
  secondaryCta: "Explore Fieldstone",
  photoLabels: {
    paintingCaption: "Studio 3 · morning light",
    microscopeTag: "LAB B · POND SPECIMEN",
    microscopeZoom: "400x zoom!",
    buildingCaption: "Timber bridge test 04",
    deskStamp: "There is more to discover ✦",
  },
  bottomBar: {
    type: "Independent · Non-profit",
    location: "Seattle, WA 98103",
    status: "Admissions open for 2026–2027 Academic Year",
  },
};

export const defaultInterests: Interest[] = [
  {
    id: "music",
    name: "MUSIC",
    subtitle: "Acoustic strings, percussion, brass & unexpected harmonies",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80",
    alt: "Student playing instrument in sunlight",
    color: "#4E7FA3",
    quote: "Finding the cadence before the sheet music arrives.",
  },
  {
    id: "science",
    name: "SCIENCE",
    subtitle: "Microbiology, ecology, robotics & spontaneous testing",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
    alt: "Student testing fluid reaction under microscope lens",
    color: "#73866C",
    quote: "Questions that survive past the end of the lab bell.",
  },
  {
    id: "sport",
    name: "SPORT",
    subtitle: "Courtyard soccer, cross-country runs & breathless team play",
    image:
      "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=900&q=80",
    alt: "Kids running during energetic courtyard game",
    color: "#E5B84C",
    quote: "No bleachers full of pressure—just momentum and sweat.",
  },
  {
    id: "art",
    name: "ART",
    subtitle: "Oils, charcoal, ceramic wheels & oversized canvas paper",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80",
    alt: "Child mixing paints on art desk with watercolor jars",
    color: "#D76C56",
    quote: "Where nobody tells you to stay inside the lines.",
  },
  {
    id: "books",
    name: "BOOKS",
    subtitle: "Deep reading, worn anthologies & quiet sunny corners",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
    alt: "Student reading a book beside tall library shelves",
    color: "#4E7FA3",
    quote: "Finding whole universes folded between two covers.",
  },
  {
    id: "building",
    name: "BUILDING",
    subtitle: "Timber joints, circuit boards, bridges & prototypes",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
    alt: "Students assembling physical structural woodwork",
    color: "#E5B84C",
    quote: "Building things that fall down, then building them better.",
  },
  {
    id: "drama",
    name: "DRAMA",
    subtitle: "Blackbox rehearsal, improvised monologues & stagecraft",
    image:
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=900&q=80",
    alt: "Students rehearsing theatre stage gestures",
    color: "#D76C56",
    quote: "Stepping into another person's shoes until they feel real.",
  },
  {
    id: "outside",
    name: "OUTSIDE",
    subtitle: "Forest trails, soil sampling, pond life & open Pacific air",
    image:
      "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=900&q=80",
    alt: "Students exploring wooded campus grounds",
    color: "#73866C",
    quote: "Rain jackets on. Dirt under nails. Fresh Northwest cedar.",
  },
];

export const defaultInterestsContent = {
  eyebrow: "Life At Fieldstone · Curiosity Map",
  headingMain: "WHAT ARE YOU",
  headingAccent: "into?",
  description:
    "School isn’t a fixed track. Hover or tap across our constellation of passions to see where our students spend their curious hours.",
  interests: defaultInterests,
};

export const defaultDayMoments: DayMoment[] = [
  {
    time: "8:07",
    title: "ARRIVE",
    tagline: "The courtyard wakes up before the bells do.",
    description:
      "Bikes click into racks along Greenwood Avenue. Friends pick up a conversation that paused yesterday at 3:30. Thermoses click open. Nobody rushes through the threshold.",
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80",
    alt: "Students arriving and chatting outside courtyard in morning light",
    bgColor: "#4E7FA3",
    textColor: "#FFFDF8",
    accentColor: "#E5B84C",
    detail: "Seattle mist giving way to clear daylight.",
  },
  {
    time: "9:18",
    title: "MAKE",
    tagline: "Hands in clay, wood shavings, and circuit breadboards.",
    description:
      "In the design barn, seventh graders test bridge joints with timber strips and tension wires. Across the hall, kindergarteners mix tempera on huge brown craft paper.",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
    alt: "Student working with wood and tools in maker studio",
    bgColor: "#E5B84C",
    textColor: "#20231F",
    accentColor: "#D76C56",
    detail: "Making mistakes you can hold in your hands.",
  },
  {
    time: "11:42",
    title: "QUESTION",
    tagline: "The teacher isn't giving the answer. That's the point.",
    description:
      "A circle of chairs. A copy of a primary source on the table. One student says, 'Wait, but why did they assume that?' and the whole room leans forward.",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80",
    alt: "Classroom circle discussion with teacher and students",
    bgColor: "#73866C",
    textColor: "#FFFDF8",
    accentColor: "#E5B84C",
    detail: "Three dissenting opinions before the lunch chime.",
  },
  {
    time: "1:16",
    title: "PLAY",
    tagline: "Four-square debates, spontaneous games, loud laughter.",
    description:
      "The perimeter fences feel distant. Some students sprint full-speed toward the grass; others huddle over a game of strategy under the big Douglas firs.",
    image:
      "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1000&q=80",
    alt: "Students playing freely outdoors on the green campus lawn",
    bgColor: "#D76C56",
    textColor: "#FFFDF8",
    accentColor: "#FFFDF8",
    detail: "Scraped knees, quick handshakes, back to running.",
  },
  {
    time: "2:48",
    title: "DISCOVER",
    tagline: "When an idea suddenly clicks into place.",
    description:
      "The microscope slide reveals the pond water paramecium swimming in real time. A student looks up with wide eyes: 'Look at this!' Everyone gathers around.",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80",
    alt: "Science laboratory discovery moment with microscope",
    bgColor: "#F5F1E8",
    textColor: "#20231F",
    accentColor: "#4E7FA3",
    detail: "That quiet gasp when theory becomes tangible.",
  },
  {
    time: "3:31",
    title: "GO HOME",
    tagline: "Backpacks heavier with ideas than textbooks.",
    description:
      "Lockers shut gently. Unfinished clay sculptures sit in drying racks. The bus doors sigh. A ninth grader pulls out a notebook to finish a sketch on the ride across town.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    alt: "Students walking out of school talking warmly together",
    bgColor: "#20231F",
    textColor: "#FFFDF8",
    accentColor: "#E5B84C",
    detail: "Already thinking about what comes next tomorrow.",
  },
];

export const defaultDayContent = {
  eyebrow: "The Daily Arc · Not a Timetable",
  headingMain: "A DAY AT",
  headingAccent: "Fieldstone",
  description:
    "School is what happens between the bells: the argument in the hallway, the sawdust on your sneakers, the idea that won’t let you sleep.",
  moments: defaultDayMoments,
  stepperLabels: {
    prev: "Earlier in the Day",
    next: "Later in the Day",
    indicator: "moments",
  },
  momentSubtitles: {
    designBarn: "AM · DESIGN BARN",
    makerLog: "Maker Log Observation",
    humanities: "· HUMANITIES & REASONING",
    discussionNote: "Discussion note:",
    scienceWing: "· SCIENCE WING",
    observation: "Observation:",
    greenwoodGate: "PM · GREENWOOD GATE",
  },
};

export const defaultCampusLocations: CampusLocation[] = [
  {
    id: "studio",
    name: "Studio",
    sentence: "Where ideas get messy.",
    description:
      "North-facing windows, kiln room, pottery wheels, and floorboards with twelve years of paint splatters.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
    x: 18,
    y: 32,
  },
  {
    id: "library",
    name: "Library",
    sentence: "Where questions get longer.",
    description:
      "Open timber shelves, reading nooks built right into cedar window frames, and no silence police.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
    x: 34,
    y: 65,
  },
  {
    id: "science",
    name: "Science",
    sentence: "Where “what if?” gets tested.",
    description:
      "Benches with gas taps, aquariums fed with Puget Sound rainwater, and petri dishes full of curiosity.",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    x: 52,
    y: 28,
  },
  {
    id: "courtyard",
    name: "Courtyard",
    sentence: "Where lunch becomes a very long conversation.",
    description:
      "Cobblestones, outdoor picnic tables under alder trees, and four-square boxes painted by alumni.",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    x: 65,
    y: 58,
  },
  {
    id: "gym",
    name: "Gym",
    sentence: "Where energy finds rhythm.",
    description:
      "Spring-cushioned maple flooring, climbing ropes, open rollup doors letting in Pacific Northwest air.",
    image:
      "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=800&q=80",
    x: 82,
    y: 36,
  },
  {
    id: "theatre",
    name: "Theatre",
    sentence: "Where quiet voices surprise everyone.",
    description:
      "Blackbox acoustic space, lighting catwalk, costume wardrobe, and eighty intimate seats.",
    image:
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80",
    x: 78,
    y: 75,
  },
];

export const defaultCampusContent = {
  eyebrow: "Greenwood Avenue · Seattle, WA",
  headingMain: "THE",
  headingAccent: "Campus",
  description:
    "Twelve acres between the tall Douglas firs. Follow the hand-drawn path to discover where ideas get messy, tested, and shared.",
  locations: defaultCampusLocations,
  cardBadge: "Location Highlight",
  cardLocationSub: "Fieldstone Campus",
};

export const defaultPhilosophyPillars: PhilosophyPillar[] = [
  {
    id: "think",
    title: "THINK FOR YOURSELF.",
    subtitle: "Question assumptions. Examine the evidence. Form convictions that are truly your own.",
  },
  {
    id: "try",
    title: "TRY THINGS.",
    subtitle: "Build the fragile prototype. Sing the chord. Make the bold mistake that teaches you something.",
  },
  {
    id: "care",
    title: "CARE ABOUT OTHER PEOPLE.",
    subtitle: "Listen with patience. Disagree with generosity. Leave the room kinder than you found it.",
  },
];

export const defaultPhilosophyContent = {
  eyebrow: "The Central Conviction · K–12",
  photoCaption: "Growing up is an experiment in courage.",
  headingMain: "SCHOOL ISN’T ABOUT",
  headingHighlight: "HAVING EVERY",
  headingEnd: "ANSWER.",
  serifQuote: "It’s about becoming someone who knows how to find one.",
  bodyCopy:
    "We do not measure childhood in test percentiles or uniform lines. We look for the sparkle in a student’s eye when they disagree with a text, re-wire a broken circuit, or sit with someone who is having a quiet day.",
  pillars: defaultPhilosophyPillars,
};

export const defaultAdmissionActions: AdmissionAction[] = [
  {
    id: "visit",
    title: "BOOK A VISIT",
    description: "Join us for a campus morning walk. Sit in on a class, see work in progress, and smell the timber in the studio.",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80",
    tag: "Next tours every Tuesday & Thursday",
  },
  {
    id: "info",
    title: "REQUEST INFORMATION",
    description: "Receive our curriculum gazette, grade-level overviews, and admissions timeline packet in the mail.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
    tag: "Mailed directly to your home",
  },
  {
    id: "ask",
    title: "ASK A QUESTION",
    description: "Our admissions director and classroom teachers answer directly. No automated bots or sales scripts.",
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80",
    tag: "Direct reply within 24 hours",
  },
];

export const defaultAdmissionsContent = {
  eyebrow: "Admissions · Seattle, WA",
  headingMain: "COME SEE",
  headingAccent: "for yourself.",
  description: "Walk the halls. Meet the teachers. See what a normal day feels like.",
  actions: defaultAdmissionActions,
  bottomPhoneLabel: "Call our admissions office directly",
  bottomPhone: "(206) 555-0178",
  bottomNote:
    "No high-pressure deadlines or standardized interviews. Just a candid conversation about your child.",
};

export const defaultFinalMomentContent = {
  image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=80",
  alt: "Students walking out of school at late afternoon with backpacks",
  handwritten: "See you tomorrow.",
  brand: "FIELDSTONE",
  tagline: "Seattle · 3:31 PM",
};

export const defaultFooterContent = {
  name: "FIELDSTONE",
  tagline: "Come curious.",
  lead:
    "An independent K–12 school in Seattle for students who like to ask why. Where mistakes are welcomed and questions are pursued.",
  campusOpenBadge: "Greenwood Campus Open",
  campusContactHeading: "Campus & Contact",
  address: "4210 Greenwood Avenue, Seattle",
  location: "Seattle, Washington",
  phone: "(206) 555-0178",
  email: "hello@fieldstone.example",
  officeHoursHeading: "Office Hours",
  hours: "Mon–Fri · 8 AM–4 PM",
  navigationHeading: "Navigation",
  links: [
    { label: "School", targetId: "hero" },
    { label: "Life Here", targetId: "interests" },
    { label: "Campus", targetId: "campus" },
    { label: "Admissions", targetId: "admissions" },
  ],
  visitCta: "Visit Fieldstone →",
  disclaimer: "This fictional website is for demonstration purposes.",
  copyright: "© 2026 Fieldstone",
};

export const defaultVisitModalContent = {
  badge: "FIELDSTONE ADMISSIONS · SEATTLE",
  subheading: "Come observe a real morning at Greenwood Avenue. No rehearsed presentations.",
  tabs: [
    { id: "visit", label: "Visit", title: "Schedule a Campus Walk", buttonText: "Request Campus Walk →" },
    { id: "info", label: "Info Gazette", title: "Request Curriculum Gazette", buttonText: "Send Me The Gazette →" },
    { id: "ask", label: "Ask a Question", title: "Ask Our Teachers Directly", buttonText: "Send Message →" },
  ],
  labels: {
    parentName: "Parent / Guardian Name *",
    parentPlaceholder: "e.g. Clara Evans",
    email: "Email Address *",
    emailPlaceholder: "clara@example.com",
    gradeLevel: "Student Age / Grade Level",
    phone: "Phone (Optional)",
    phonePlaceholder: "(206) 555-0100",
    notes: "What questions or interests does your child have?",
    notesPlaceholder: "e.g. loves building things, curious about science lab, likes independent projects...",
    directCall: "Call directly: (206) 555-0178",
  },
  gradeOptions: [
    { value: "Kindergarten (Ages 5-6)", label: "Kindergarten (Ages 5–6)" },
    { value: "Grades 1-2 (Ages 6-8)", label: "Grades 1–2 (Ages 6–8)" },
    { value: "Grades 3-5 (Ages 8-11)", label: "Grades 3–5 (Ages 8–11)" },
    { value: "Middle School / Grades 6-8 (Ages 11-14)", label: "Middle School / Grades 6–8 (Ages 11–14)" },
    { value: "High School / Grades 9-12 (Ages 14-18)", label: "High School / Grades 9–12 (Ages 14–18)" },
  ],
  success: {
    title: "Thank you for reaching out!",
    message: "We have received your note. Our admissions team in Seattle will be in touch within 24 hours. We look forward to welcoming your family.",
    closeButton: "Close",
  },
};
