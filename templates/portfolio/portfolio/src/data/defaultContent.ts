export interface RabbitHoleItem {
  id: string;
  title: string;
  category: string;
  thought: string;
  defaultX: number;
  defaultY: number;
  rotation: number;
}

export interface Project {
  id: string;
  num: string;
  title: string;
  oneLiner: string;
  year: string;
  image: string;
  tryingToDo: string;
  learned: string;
  tags: string[];
}

export interface BuildStep {
  id: string;
  label: string;
  isArrow?: boolean;
  isGlitch?: boolean;
}

export interface WritingPiece {
  id: string;
  title: string;
  type: string;
  excerpt: string;
  readingTime: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export const defaultPersonalInfo = {
  name: "Aryan Sharma",
  nameUppercase: "ARYAN SHARMA",
  tagline: "Engineering / Building / Thinking",
  shortRole: "Engineering student. Builder. Writer. Still curious.",
  email: "aryan@example.com",
  currentStatus: "learning · building · writing · asking better questions",
  statusOnline: "currently online",
  copyrightYear: "2026",
  socialLinks: [
    { label: "GITHUB", url: "https://github.com" },
    { label: "LINKEDIN", url: "https://linkedin.com" },
    { label: "SPOTIFY", url: "https://spotify.com" },
    { label: "X", url: "https://x.com" },
  ] as SocialLink[],
};

export const defaultSiteMetadata = {
  title: "Aryan Sharma — Engineering / Building / Thinking",
  description:
    "Aryan Sharma is an engineering student, builder, and writer exploring physics, systems, technology, and curiosity. A mind in motion.",
  keywords: [
    "Aryan Sharma",
    "Portfolio",
    "Engineering",
    "Builder",
    "Writer",
    "Physics",
    "Systems",
  ],
  authors: [{ name: "Aryan Sharma" }],
  openGraph: {
    title: "Aryan Sharma — Engineering / Building / Thinking",
    description:
      "A mind in motion. Learning, building, writing, asking better questions.",
    type: "website" as const,
  },
} as const;

export const defaultNavigationContent = {
  brand: "Aryan Sharma",
  links: [
    { id: "work", label: "Work", mobileLabel: "01 // WORK" },
    { id: "thinking", label: "Thinking", mobileLabel: "02 // THINKING" },
    { id: "about", label: "About", mobileLabel: "03 // ABOUT" },
    { id: "contact", label: "Contact", mobileLabel: "04 // CONTACT" },
  ],
  statusText: "currently online",
  indexLabel: "INDEX",
  subtitle: "Engineering / Systems",
};

export const defaultHeroContent = {
  sparseName: "Aryan Sharma",
  sparseRole: "Engineering / Building / Thinking",
  statementLine1: "I'M STILL",
  statementLine2: "FIGURING",
  statementLine3: "IT OUT.",
  counterStatement: "That's kind of the point.",
  currentPrefix: "Currently:",
  currentStatus: "learning · building · writing · asking better questions",
  exploreCta: "EXPLORE",
};

export const defaultInterruptionThoughts = {
  interruption1: { text: "WHY?", thought: "why?" },
  interruption2: { text: "WHAT IF?", thought: "what if?" },
  interruption3: { text: "MAKE SOMETHING.", thought: "make something" },
};

export const defaultRabbitHolesContent = {
  sectionTag: "01 // ARCHIVE OF CURIOSITIES",
  headingLine1: "THINGS I KEEP",
  headingLine2: "COMING BACK TO.",
  description:
    "Pinned notes from Aryan's personal notebook. Click any fragment to open.",
  items: [
    {
      id: "quantum-physics",
      title: "Quantum Physics",
      category: "PHYSICS",
      thought: "I like questions where intuition stops working.",
      defaultX: 12,
      defaultY: 18,
      rotation: -2.5,
    },
    {
      id: "human-behavior",
      title: "Human Behavior",
      category: "PSYCHOLOGY",
      thought: "We make choices first and build explanations after.",
      defaultX: 56,
      defaultY: 14,
      rotation: 1.8,
    },
    {
      id: "artificial-intelligence",
      title: "Artificial Intelligence",
      category: "COMPUTING",
      thought:
        "Teaching silicon to think makes you realize how little we know about thinking.",
      defaultX: 30,
      defaultY: 34,
      rotation: -1.2,
    },
    {
      id: "why-people-believe",
      title: "Why People Believe Things",
      category: "COGNITION",
      thought:
        "Belief is rarely about facts; it is usually about belonging and protection.",
      defaultX: 68,
      defaultY: 38,
      rotation: 2.2,
    },
    {
      id: "writing",
      title: "Writing",
      category: "THOUGHT",
      thought: "Sometimes writing is just thinking with the mess visible.",
      defaultX: 18,
      defaultY: 52,
      rotation: -3,
    },
    {
      id: "space",
      title: "Space",
      category: "COSMOS",
      thought: "A reminder that almost everything is empty, silent, and waiting.",
      defaultX: 52,
      defaultY: 56,
      rotation: 1.5,
    },
    {
      id: "design",
      title: "Design",
      category: "CRAFT",
      thought:
        "The best design doesn't call attention to itself. It makes the world feel frictionless.",
      defaultX: 80,
      defaultY: 62,
      rotation: -1.8,
    },
    {
      id: "systems",
      title: "Systems",
      category: "ENGINEERING",
      thought:
        "You don't understand something until you understand feedback loops.",
      defaultX: 25,
      defaultY: 74,
      rotation: 2.4,
    },
    {
      id: "love",
      title: "Love",
      category: "INTIMACY",
      thought: "The most irrational and necessary thing we do.",
      defaultX: 72,
      defaultY: 80,
      rotation: -2.2,
    },
    {
      id: "technology",
      title: "Technology",
      category: "TOOLS",
      thought: "Tools shape the hands that hold them.",
      defaultX: 44,
      defaultY: 86,
      rotation: 1.1,
    },
    {
      id: "reality",
      title: "Reality",
      category: "ONTOLOGY",
      thought:
        "We experience an interface constructed by our senses, not raw reality.",
      defaultX: 84,
      defaultY: 22,
      rotation: -1.5,
    },
  ] as RabbitHoleItem[],
  modalPrefix: "NOTEBOOK //",
  modalClose: "ESC / CLOSE",
  modalFooterLeft: "Aryan's desk notes",
  modalFooterRight: "Obsessive learning",
};

export const defaultWorkContent = {
  sectionTag: "02 // SELECTED BUILDS",
  heading: "THINGS I MADE.",
  description:
    "Sparse representations of prototypes, experiments, and systems. Click any build to inspect.",
  projects: [
    {
      id: "nayom",
      num: "01",
      title: "NAYOM",
      oneLiner: "A system built around ambitious ideas and experimentation.",
      year: "2025",
      image: "/projects/nayom.svg",
      tryingToDo:
        "Explore whether complex distributed state transitions could be modeled as lightweight declarative graphs without introducing unnecessary overhead.",
      learned:
        "The hardest part of system design isn't making things work; it's deciding which edge cases don't deserve the architectural complexity they demand.",
      tags: ["Systems", "Architecture", "Distributed"],
    },
    {
      id: "project-atlas",
      num: "02",
      title: "PROJECT ATLAS",
      oneLiner: "An experimental interface and product concept.",
      year: "2025",
      image: "/projects/atlas.svg",
      tryingToDo:
        "Design an interface where spatial layout directly reflects cognitive relationships rather than deep hierarchical menu trees.",
      learned:
        "People don't naturally think in folders. They think in spatial proximity and associations. When an interface reflects that, mental overhead collapses.",
      tags: ["Spatial Interface", "Design Concept", "Tooling"],
    },
    {
      id: "motion-lab",
      num: "03",
      title: "MOTION LAB",
      oneLiner: "A collection of interaction and animation experiments.",
      year: "2024",
      image: "/projects/motion-lab.svg",
      tryingToDo:
        "Test how physical spring damping, inertia, and velocity transfers influence emotional satisfaction during rapid web interaction.",
      learned:
        "Motion is sensory feedback. When calibrated with restraint, it reassures the brain that a digital system is responsive, predictable, and solid.",
      tags: ["Interaction Physics", "Micro-Motion", "TypeScript"],
    },
    {
      id: "private-build",
      num: "04",
      title: "PRIVATE BUILD",
      oneLiner: "An unnamed project currently in progress.",
      year: "2026",
      image: "/projects/private-build.svg",
      tryingToDo:
        "Synthesize several engineering and design rabbit holes into a single focused tool built for sustained, deep cognitive work.",
      learned:
        "Early versions are almost always wrong. Keeping a project quiet protects the freedom to break assumptions and rebuild from first principles.",
      tags: ["Active R&D", "Confidential", "In Progress"],
    },
  ] as Project[],
};

export const defaultBuildContent = {
  sectionTag: "03 // THE PROCESS",
  headingLine1: "I LIKE MAKING",
  headingLine2: "THINGS THAT",
  headingLine3: "DIDN'T EXIST",
  headingHighlight: "BEFORE.",
  steps: [
    { id: "idea", label: "IDEA" },
    { id: "arrow-1", label: "→", isArrow: true },
    { id: "prototype", label: "PROTOTYPE" },
    { id: "arrow-2", label: "→", isArrow: true },
    { id: "break-it", label: "BREAK IT", isGlitch: true },
    { id: "arrow-3", label: "→", isArrow: true },
    { id: "question-it", label: "QUESTION IT" },
    { id: "arrow-4", label: "→", isArrow: true },
    { id: "rebuild", label: "REBUILD" },
    { id: "arrow-5", label: "→", isArrow: true },
    { id: "ship", label: "SHIP" },
  ] as BuildStep[],
  quote: "The first version is almost never the version worth keeping.",
  footer: "Rapid prototyping · Breaking assumptions · Rebuilding cleaner",
};

export const defaultWritingContent = {
  sectionTag: "WORDS",
  headingLine1: "Some things are easier",
  headingLine2: "to understand after",
  headingLine3: "you write them down.",
  pieces: [
    {
      id: "pretend",
      title: "THE THINGS WE PRETEND\nNOT TO THINK ABOUT",
      type: "01 · ESSAY",
      excerpt:
        "We organize our days to avoid stillness, because stillness is when the questions we can't easily answer start knocking on the door.",
      readingTime: "4 min read",
    },
    {
      id: "too-fast",
      title: "WHY EVERYTHING\nFEELS TOO FAST",
      type: "02 · NOTES",
      excerpt:
        "Speed is frequently mistaken for momentum. When you optimize exclusively for throughput rather than depth, you arrive very quickly at nothing.",
      readingTime: "3 min read",
    },
    {
      id: "curious",
      title: "ON BEING\nCURIOUS",
      type: "03 · FRAGMENT",
      excerpt:
        "Curiosity is an appetite, not a strategy. It leads you into rooms you didn't plan on entering, which is usually where the real ideas are hiding.",
      readingTime: "2 min read",
    },
  ] as WritingPiece[],
  readerNote:
    "Writing is where messy intuitions get untangled. When an idea survives being committed to paper without jargon, you finally understand what you actually meant.",
  author: "Aryan Sharma",
  draftsLabel: "Unpublished notebook drafts",
};

export const defaultPhysicsContent = {
  sectionTag: "04 // REALITY & INQUIRY",
  headingLine1: "THE UNIVERSE",
  headingLine2: "IS WEIRD.",
  reaction: "I like that.",
  conclusionLine1: "There are probably better questions",
  conclusionLine2: "than the ones we usually ask.",
};

export const defaultOutsideScreenContent = {
  sectionTag: "05 // SENSORY ARCHIVE",
  line1: "I LIKE",
  line2: "RAIN.",
  line3: "NIGHTS.",
  line4: "GOOD CONVERSATIONS.",
  line5: "THINGS THAT MAKE",
  line6: "time disappear.",
  image: {
    src: "/night-life.svg",
    alt: "Rain on window at night with streetlamp bokeh",
  },
  footerLeft: "Notes outside the machine",
  footerRight: "Observation over velocity",
};

export const defaultAboutContent = {
  sectionTag: "06 // ABOUT",
  name: "ARYAN SHARMA",
  portrait: {
    src: "/aryan.svg",
    alt: "Aryan Sharma portrait",
    captionLeft: "ARYAN SHARMA",
    captionRight: "FIGURING IT OUT",
  },
  roles: ["Engineering student.", "Builder.", "Writer."],
  curiousMotto: "Still curious.",
  bioParagraphs: [
    "I'm interested in building things, understanding how they work, and figuring out why people behave the way they do.",
    "I learn quickly, get obsessed with ideas, and usually end up somewhere I didn't expect.",
  ],
  orbitsLabel: "Recurring orbits",
  orbits: [
    "Technology",
    "Physics",
    "Psychology",
    "Writing",
    "Design",
    "Systems",
  ],
};

export const defaultFutureContent = {
  sectionTag: "07 // AMBITION & DIRECTION",
  headingLine1: "I HAVE NO",
  headingLine2: "INTEREST",
  headingLine3: "IN KEEPING",
  headingLine4: "THINGS SMALL.",
  statementLine1: "There are too many things to learn,",
  statementLine2: "too many places to go,",
  statementLine3: "and too many ideas worth trying.",
  cta: "NEXT → UNKNOWN",
  footer: "2026 and forward",
};

export const defaultContactContent = {
  sectionTag: "08 // REACH OUT",
  heading: "SAY HELLO.",
  prompts: [
    "Have an interesting idea?",
    "Want to build something?",
    "Want to talk about something strange?",
  ],
  email: "aryan@example.com",
  copiedText: "COPIED TO CLIPBOARD",
  emailLabel: "EMAIL",
  quote:
    "I generally prefer interesting conversations over formal introductions.",
};

export const defaultFooterContent = {
  copyrightName: "ARYAN SHARMA",
  copyrightYear: "© 2026",
  scrollTopText: "STILL BECOMING",
};

export const defaultThoughtCursorContent = {
  idleThoughts: ["hmm.", "interesting.", "wait.", "why?", "keep going."],
};
