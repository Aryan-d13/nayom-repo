export interface PracticeArea {
  id: string;
  name: string;
  summary: string;
  detail: string;
  image: string;
  clauses: string[];
}

export interface Partner {
  id: string;
  name: string;
  role: string;
  image: string;
  perspective: string;
  approach: string;
}

export interface DocumentChoice {
  id: string;
  label: string;
  guidance: string;
  marginalNote: string;
}

export const defaultSiteMetadata = {
  title: "Hale & Mercer | Attorneys at Law — New York City",
  description:
    "Clear thinking when it matters. Practical legal counsel for people and businesses facing decisions that cannot be guessed at. 245 Madison Avenue, New York.",
  keywords: [
    "Hale & Mercer",
    "Attorneys at Law",
    "New York Law Firm",
    "Commercial Litigation",
    "Employment Law",
    "Real Estate",
    "Estate Planning",
  ],
  author: "Hale & Mercer",
  openGraph: {
    title: "Hale & Mercer | Attorneys at Law — New York City",
    description:
      "Clear thinking when it matters. Practical legal counsel for people and businesses facing decisions that cannot be guessed at.",
    type: "website",
    locale: "en_US",
  },
};

export const defaultFirmInfo = {
  name: "HALE & MERCER",
  suffix: "Attorneys at Law",
  location: "New York City",
  address: "245 Madison Avenue, New York, NY",
  phone: "(212) 555-0147",
  email: "hello@halemercer.example",
  tagline: "Clear thinking when it matters.",
  subTagline: "The important things deserve your full attention.",
  heroSupporting:
    "Practical legal counsel for people and businesses facing decisions that cannot be guessed at.",
  primaryCta: "TALK TO AN ATTORNEY",
  secondaryCta: "OUR PRACTICE",
};

export const defaultNavbarContent = {
  mobileMenuHeading: "Index & Chambers",
  sectionSymbol: "§",
};

export const defaultHeroContent = {
  eyebrow: "HALE & MERCER NEW YORK",
  headline: "CLEAR THINKING WHEN IT MATTERS.",
  annotationText: "read carefully",
  bottomMarginLeft: "CHAMBERS: 245 MADISON AVE",
  bottomMarginRight: "MATTERS UNDERTAKEN SELECTIVELY",
  image: {
    src: "/images/hero-lawyer.jpg",
    alt: "Hale & Mercer attorney reviewing documents in a New York office",
    location: "NEW YORK, NY",
    docRef: "DOC REF: HM-0147",
  },
};

export const defaultFinePrintContent = {
  sectionNumber: "SECTION 02",
  sectionTitle: "ANNOTATIONS ON RISK & LANGUAGE",
  headingPrefix: "THE DETAILS ARE RARELY",
  headingHighlight: "THE SMALL PART.",
  description:
    "A single ambiguous word in a clause can shift millions in liability or months of operational paralysis. We mark what matters before it becomes uncorrectable.",
  footnoteLeft: "* MARKED BY HAND IN CHAMBERS",
  footnoteRight: "HALE & MERCER • CLAUSES 01–03",
};

export const defaultFinePrintItems = [
  {
    id: "contract",
    phrase: "A contract.",
    clauseNo: "CLAUSE 01",
    explanation: "Before you sign, know what you're agreeing to.",
    extended:
      "Language sets the perimeter of your obligations. We examine every clause for ambiguous covenants, hidden liabilities, and assumptions left unstated.",
  },
  {
    id: "decision",
    phrase: "A decision.",
    clauseNo: "CLAUSE 02",
    explanation: "Know what changes if you make it.",
    extended:
      "Every material step alters your leverage. We help you model the regulatory, financial, and structural consequences before pen touches paper.",
  },
  {
    id: "dispute",
    phrase: "A dispute.",
    clauseNo: "CLAUSE 03",
    explanation: "Know where you stand before you respond.",
    extended:
      "The strongest position is built on verified facts and dispassionate analysis, never reflexive escalation.",
  },
];

export const defaultPracticeIndexContent = {
  sectionNumber: "SECTION 03",
  sectionTitle: "INDEX OF PRACTICE",
  heading: "Start Here.",
  subtitle: "SELECT A PRACTICE AREA TO REVIEW COUNSEL SCOPE & PROTOCOLS.",
  reviewScopeLabel: "Review Scope",
  exhibitPrefix: "INDEX EXHIBIT // 0",
  engagementFocusLabel: "Key Engagement Focus:",
  inquireButtonPrefix: "Inquire Regarding",
};

export const defaultPracticeAreas: PracticeArea[] = [
  {
    id: "business",
    name: "BUSINESS",
    summary:
      "Agreements, disputes, partnerships and the legal decisions that shape a company.",
    detail:
      "From governance disputes and vendor contracts to operating agreements and buyouts, we counsel founders, boards, and partners through turning points.",
    image: "/images/practice-business.jpg",
    clauses: ["Commercial Agreements", "Partnership Governance", "Pre-Litigation Assessment"],
  },
  {
    id: "employment",
    name: "EMPLOYMENT",
    summary:
      "Advice for employers and employees when work gets complicated.",
    detail:
      "Executive compensation, restrictive covenants, separation terms, and workplace investigations handled with rigorous confidentiality.",
    image: "/images/practice-employment.jpg",
    clauses: ["Separation Agreements", "Restrictive Covenants", "Internal Inquiries"],
  },
  {
    id: "realestate",
    name: "REAL ESTATE",
    summary:
      "Helping clients move through significant property decisions with clarity.",
    detail:
      "Commercial leases, acquisitions, title discrepancies, and joint ventures navigated with thorough due diligence and clear transactional drafting.",
    image: "/images/practice-realestate.jpg",
    clauses: ["Commercial Leasing", "Acquisitions & Sales", "Title & Due Diligence"],
  },
  {
    id: "estates",
    name: "ESTATES",
    summary:
      "Planning for the people and things you care about.",
    detail:
      "Wills, trust structures, fiduciary responsibilities, and succession planning arranged cleanly to eliminate future uncertainty for your family.",
    image: "/images/practice-estates.jpg",
    clauses: ["Trust & Estate Planning", "Fiduciary Guidance", "Succession Planning"],
  },
];

export const defaultPeopleContent = {
  sectionNumber: "SECTION 04",
  sectionTitle: "HUMAN JUDGMENT & COUNSEL",
  image: {
    src: "/images/attorneys-meeting.jpg",
    alt: "Elena Hale and Marcus Mercer in candid discussion across a conference table",
    stamp: "CHAMBERS CONFERENCE // CANDID RECORD",
  },
  headline: "GOOD LAW STARTS WITH LISTENING.",
  quote: "Before we tell you what to do, we need to understand what happened.",
  description:
    "Legal problems rarely arise in sterile isolation. They happen to operating businesses, trusted partnerships, and families. We do not apply standardized templates. We sit across the table and analyze the human realities that shape your leverage.",
  partnersHeading: "Partners in Practice",
  meetButtonPrefix: "MEET",
  directPartnerGuarantee:
    "Every client communicates directly with a named partner. No intermediary screening.",
};

export const defaultPartners: Partner[] = [
  {
    id: "elena-hale",
    name: "Elena Hale",
    role: "Partner",
    image: "/images/elena-hale.jpg",
    perspective:
      "Most disputes are caused by someone speaking before they listened. Good advocacy is quiet, precise, and anchored in an unvarnished review of the facts.",
    approach:
      "Elena works directly with clients to resolve commercial disputes, business friction, and executive negotiations without unnecessary posturing.",
  },
  {
    id: "marcus-mercer",
    name: "Marcus Mercer",
    role: "Partner",
    image: "/images/marcus-mercer.jpg",
    perspective:
      "When a client is overwhelmed by complexity, our job is not to add legal jargon. Our job is to isolate the one or two decisions that actually matter.",
    approach:
      "Marcus focuses on business formation, transactional agreements, real estate transactions, and long-term estate stewardship.",
  },
];

export const defaultPartnerModalContent = {
  docketProfilePrefix: "Docket Profile //",
  chambersPrefix: "Chambers:",
  consultButtonPrefix: "Consult With",
};

export const defaultDocumentMomentContent = {
  watermark: "DOC INSTRUMENT // H&M RECORD NO. 024",
  matterNumber: "MATTER NO. 024",
  intakeSubtitle: "DIAGNOSTIC INTAKE // STATE OF AFFAIRS",
  title: "WHAT DO YOU ACTUALLY NEED?",
  description:
    "Select the statement closest to your current situation. We believe clarity begins with honest diagnostic assessment, not pressure.",
  attorneyNoteHeaderLeft: "ATTORNEY NOTE",
  attorneyNoteHeaderRight: "DIRECT COUNSEL",
  partnerGuarantee:
    "We treat this as the foundation of our conversation. No matter the scale, you get direct partner attention from the first consultation.",
  ctaLabel: "TALK TO AN ATTORNEY",
  confidentialityNotice: "Initial consultation is confidential and without obligation",
};

export const defaultDocumentChoices: DocumentChoice[] = [
  {
    id: "advice",
    label: "I need advice before I decide.",
    guidance:
      "Clear analysis prevents costly entanglements before commitments are made.",
    marginalNote: "Pre-execution counsel / Risk isolation",
  },
  {
    id: "problem",
    label: "I need help with a problem.",
    guidance:
      "Early containment is almost always better than reactive litigation.",
    marginalNote: "Active dispute / Immediate mitigation",
  },
  {
    id: "negotiate",
    label: "I need someone to negotiate.",
    guidance:
      "Principled leverage requires understanding the counterparty's real constraints.",
    marginalNote: "Counterparty terms / Structured leverage",
  },
  {
    id: "start",
    label: "I don't know where to start.",
    guidance: "That's a perfectly reasonable place to begin.",
    marginalNote: "Initial inquiry / Diagnostic consultation",
  },
];

export const defaultFinalCtaContent = {
  sectionMark: "CONVERSATION PROTOCOL // FINAL ACTION",
  headline: "YOU DON’T HAVE TO HAVE THE ANSWER YET.",
  subheadline: "You just need a place to start.",
  crossedOutHesitation: "Drafting an unreviewed response",
  startHereLabel: "START HERE",
};

export const defaultFooterContent = {
  directoryHeading: "Directory",
  chambersNoteHeading: "Chambers Note",
  jurisdictionNote:
    "Practicing in the State of New York. Consultations arranged by appointment at our Madison Avenue offices or by direct secure video link.",
  legalDisclaimer:
    "This website is for general information only and does not constitute legal advice.",
  copyright: "© 2026 Hale & Mercer. All rights reserved.",
};

export const defaultContactDrawerContent = {
  intakeLabel: "Matter Intake // Confidential",
  title: "Talk to an Attorney",
  subtitle: "Tell us what happened. We’ll figure out where to start.",
  successTitle: "We have received your note.",
  successMessage:
    "An attorney will review your information directly within one business day. Your communication is held in strict professional confidence.",
  urgentLineLabel: "Direct urgent line:",
  closeButtonLabel: "Close Window",
  nameLabel: "Your Full Name",
  namePlaceholder: "Jane Doe or Company Name",
  contactLabel: "Telephone or Email",
  contactPlaceholder: "(212) 000-0000 or email@domain.com",
  concernLabel: "Primary Area of Concern",
  practiceOptions: [
    { value: "Business", label: "Business & Commercial Litigation" },
    { value: "Employment", label: "Employment Law" },
    { value: "Real Estate", label: "Real Estate" },
    { value: "Estate Planning", label: "Estate Planning" },
    { value: "Undecided", label: "Not sure where to start" },
  ],
  narrativeLabel: "Tell Us What Happened",
  narrativeHelp: "Plain language, no legalese needed",
  narrativePlaceholder:
    "Briefly describe your situation, an upcoming deadline, or a contract you're considering...",
  submitButtonLabel: "Submit In Confidence",
  disclaimer:
    "Submitting does not establish an attorney-client relationship until an engagement agreement is signed.",
  directChambersLabel: "Direct Chambers",
  addressLabel: "Address",
};

export const defaultNavLinks = [
  { label: "Practice", href: "#practice" },
  { label: "People", href: "#people" },
  { label: "Insights", href: "#matter-024" },
];
