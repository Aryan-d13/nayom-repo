export interface ConcernItem {
  id: string;
  text: string;
  image: string;
  alt: string;
  context: string;
}

export interface CareStep {
  id: string;
  word: string;
  description: string;
  subtext: string;
  image: string;
  alt: string;
}

export interface VisitMoment {
  id: string;
  stepNumber: string;
  word: string;
  line: string;
  sub: string;
  spaceLabel: string;
  spaceDetail: string;
  quote: string;
  tags: string[];
  image: string;
  alt: string;
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}

export interface DoctorProfile {
  name: string;
  role: string;
  image: string;
  alt: string;
}

export const defaultClinicInfo = {
  name: "NORTH",
  type: "private clinic",
  fullType: "Private Medical Clinic",
  subtitle: "BROOKLYN / PRIVATE CLINIC",
  tagline: "A sequence of care, not a transactional list of services.",
  description: "A quiet place in a busy city. Providing primary care, preventive screenings, women’s health, and same-day consultations in Brooklyn.",
  address: "91 Kent Avenue",
  cityStateZip: "Brooklyn, NY 11249",
  fullAddress: "91 Kent Avenue, Brooklyn, NY",
  phone: "(718) 555-0164",
  phoneRaw: "tel:7185550164",
  phoneTel: "tel:7185550164",
  email: "hello@northclinic.example",
  emailHref: "mailto:hello@northclinic.example",
  hours: {
    weekdays: "Mon–Fri 8 AM–6 PM",
    fullDays: "Monday – Friday",
    fullTime: "8:00 AM – 6:00 PM",
  },
  transitNote: "Subway: L Train to Bedford Ave or NYC Ferry to North 6th St / Kent Ave.",
  disclaimer: "This website provides general information and is not a substitute for medical advice.",
  copyright: "© 2026 North Clinic. All rights reserved.",
};

export const defaultNavigationContent = {
  brand: "NORTH",
  badge: "/ private clinic",
  links: [
    { label: "Care", href: "#care" },
    { label: "Approach", href: "#approach" },
    { label: "The Visit", href: "#visit" },
    { label: "Team", href: "#people" },
  ],
  ctaText: "BOOK A VISIT",
  mobileClose: "CLOSE [×]",
  drawerAddress: "91 Kent Avenue, Brooklyn, NY",
  drawerPhone: "(718) 555-0164",
  drawerHours: "Mon–Fri · 8 AM–6 PM",
};

export const defaultHeroContent = {
  locationLabel: "BROOKLYN / PRIVATE CLINIC",
  headlineLine1: "YOU CAN SLOW",
  headlineLine2: "DOWN HERE.",
  serifLine: "We'll take the time.",
  paragraph: "Thoughtful primary and preventive care for the people who live around here.",
  primaryCta: "BOOK A VISIT",
  secondaryCta: "HOW WE WORK",
  hoursText: "MON–FRI 8 AM–6 PM",
  locationText: "91 KENT AVENUE, BROOKLYN",
  image: "/images/hero-clinic.jpg",
  imageAlt: "Calm clinic interior with soft daylight, sheer linen curtains, an oak chair, and a potted plant",
};

export const defaultWhatBringsYouInContent = {
  overline: "WHY PEOPLE COME TO US",
  headline: "WHAT BRINGS YOU IN?",
  emotionalQuote: "Whatever brings you in, we'll start there.",
  concerns: [
    {
      id: "checkup",
      text: "I need a checkup.",
      image: "/images/brings-checkup.jpg",
      alt: "Calm consultation room bathed in soft natural daylight",
      context: "Routine screenings & baseline health",
    },
    {
      id: "not-right",
      text: "Something doesn't feel right.",
      image: "/images/brings-conversation.jpg",
      alt: "Unhurried conversation between doctor and patient",
      context: "Symptoms that haven't cleared up",
    },
    {
      id: "putting-off",
      text: "I've been putting it off.",
      image: "/images/brings-putting-it-off.jpg",
      alt: "Peaceful clinic interior alcove with linen drapery",
      context: "Things you haven't made time for",
    },
    {
      id: "stay-ahead",
      text: "I want to stay ahead of things.",
      image: "/images/brings-stay-ahead.jpg",
      alt: "Calm outdoor walk in morning light",
      context: "Preventive care & long-term longevity",
    },
    {
      id: "talk",
      text: "I just need to talk to someone.",
      image: "/images/brings-talk.jpg",
      alt: "Quiet consultation corner with tea and warm light",
      context: "Mental wellness & general reassurance",
    },
  ] as ConcernItem[],
};

export const defaultCareWithoutMenuContent = {
  overline: "CARE WITHOUT THE MENU",
  subtitle: "A sequence of care, not a transactional list of services.",
  overlayTag: "NORTH CARE PRINCIPLE",
  steps: [
    {
      id: "prevent",
      word: "PREVENT",
      description: "Routine care, screenings and keeping track of what's changing.",
      subtext: "Preventive Care · Wellness Visits · Baseline Labs",
      image: "/images/care-prevent.jpg",
      alt: "Calm clinic examination room with morning light",
    },
    {
      id: "listen",
      word: "LISTEN",
      description: "Start with what's actually bothering you.",
      subtext: "Primary Care · Extended Consultations · Unhurried Time",
      image: "/images/care-listen.jpg",
      alt: "Physician listening closely during a conversation",
    },
    {
      id: "treat",
      word: "TREAT",
      description: "Make a plan and move forward.",
      subtext: "Women's Health · Same-Day Appointments · Clear Diagnostics",
      image: "/images/care-treat.jpg",
      alt: "Collaborative care plan discussed quietly at an oak table",
    },
    {
      id: "followup",
      word: "FOLLOW UP",
      description: "Keep the conversation going when it matters.",
      subtext: "Direct Messaging · Check-in Calls · Care Continuity",
      image: "/images/care-followup.jpg",
      alt: "Peaceful sunlit clinic hallway showing ongoing support",
    },
  ] as CareStep[],
};

export const defaultTheVisitContent = {
  overline: "THE VISIT",
  headline: "WHAT PHYSICALLY HAPPENS",
  description: "Appointments here are designed around how people actually experience medical care: entering a quiet space, being heard, and leaving with clarity.",
  moments: [
    {
      id: "arrive",
      stepNumber: "01",
      word: "ARRIVE",
      line: "Come in. Take a breath.",
      sub: "No crowded waiting area. Water, quiet light, and immediate greeting. You settle in without clipboard interrogation or delays.",
      spaceLabel: "ENTRYWAY & RECEPTION NOOK",
      spaceDetail: "Natural birch, cold water, morning daylight",
      quote: "“You step through the door and the rush of the street stops immediately.”",
      tags: ["Zero wait queue", "Quiet arrival", "Tea & filtered water"],
      image: "/images/visit-arrive.jpg",
      alt: "Patient stepping into calm clinic entryway with wooden benches",
    },
    {
      id: "talk",
      stepNumber: "02",
      word: "TALK",
      line: "Tell us what's going on.",
      sub: "Sitting across a solid table, not perched on crinkling examination paper. An unhurried conversation where your daily reality is heard.",
      spaceLabel: "CONSULTATION ROOM 01",
      spaceDetail: "Low oak table, linen armchairs, no paper beds",
      quote: "“We listen first, because understanding context is half the diagnosis.”",
      tags: ["Unhurried 30–45 min", "Face-to-face table", "Complete history"],
      image: "/images/visit-talk.jpg",
      alt: "Patient and doctor having an unhurried conversation",
    },
    {
      id: "check",
      stepNumber: "03",
      word: "CHECK",
      line: "We'll figure out what needs attention.",
      sub: "Careful physical examination and diagnostic clarity explained as we go. Every test or assessment is discussed openly beforehand.",
      spaceLabel: "EXAMINATION SUITE",
      spaceDetail: "Gentle lighting, transparent diagnostics, instant vitals",
      quote: "“Every check has a reason, explained in plain language before we begin.”",
      tags: ["Transparent tests", "Immediate vitals", "Zero rush"],
      image: "/images/visit-check.jpg",
      alt: "Gentle medical examination in quiet daylight",
    },
    {
      id: "leave",
      stepNumber: "04",
      word: "LEAVE",
      line: "Know what happens next.",
      sub: "Clear next steps, electronic prescriptions sent before you step out, and direct doctor messaging access if questions arise.",
      spaceLabel: "DAYLIT EXIT CORRIDOR",
      spaceDetail: "Digital summary, direct physician chat link",
      quote: "“When you walk out, your care plan is already on your phone.”",
      tags: ["Care summary sent", "Direct doctor chat", "Prescriptions ready"],
      image: "/images/visit-leave.jpg",
      alt: "Calm hallway leading toward natural daylight and the street",
    },
  ] as VisitMoment[],
};

export const defaultThePeopleContent = {
  overline: "THE PEOPLE",
  quotePart1: "“Most of the time, people already know what they need to talk about. ",
  quoteHighlight: "They just need someone to listen.",
  quotePart2: "”",
  description: "North was built around longer conversations, clear explanations and care that feels personal.",
  doctors: [
    {
      name: "Dr. Nina Patel",
      role: "Primary Care",
      image: "/images/dr-nina-patel.jpg",
      alt: "Candid portrait of Dr. Nina Patel in quiet natural light",
    },
    {
      name: "Dr. Evan Brooks",
      role: "Family Medicine",
      image: "/images/dr-evan-brooks.jpg",
      alt: "Candid portrait of Dr. Evan Brooks in quiet natural light",
    },
  ] as DoctorProfile[],
};

export const defaultEveningCtaContent = {
  indicator: "BROOKLYN · EVENING CLINIC HOURS",
  headline: "COME AS YOU ARE.",
  serifText: "We'll start there.",
  ctaText: "BOOK A VISIT",
  phone: "(718) 555-0164",
  address: "91 Kent Avenue, Brooklyn",
  image: "/images/evening-clinic.jpg",
  imageAlt: "Exterior view of North Clinic on Kent Avenue at dusk with warm lights inside",
};

export const defaultBookingModalContent = {
  brandHeader: "NORTH · BROOKLYN",
  headline: "BOOK A VISIT",
  italicSub: "Tell us what you need. We'll arrange the time.",
  services: [
    "Primary Care",
    "Women's Health",
    "Preventive Care",
    "Same-Day Appointments",
    "Wellness Visits",
  ],
  success: {
    title: "WE HAVE YOUR NOTE.",
    italicNote: "We'll be in touch within two business hours.",
    urgentPrefix: "If this is urgent or for today, please give us a direct call at ",
    phone: "(718) 555-0164",
    closeButton: "CLOSE",
  },
  form: {
    careLabel: "Care Required",
    nameLabel: "Your Name",
    namePlaceholder: "First and last name",
    contactLabel: "Phone or Email",
    contactPlaceholder: "(718) 000-0000 or email",
    noteLabel: "Anything you'd like us to know beforehand? (Optional)",
    notePlaceholder: "e.g. routine checkup, sore knee, or general consultation",
    callDirectLabel: "Or call directly: ",
    submitText: "CONFIRM REQUEST →",
  },
};

export const defaultFooterContent = {
  brand: "NORTH",
  type: "Private Medical Clinic",
  description: "A quiet place in a busy city. Providing primary care, preventive screenings, women’s health, and same-day consultations in Brooklyn.",
  ctaText: "Schedule a conversation",
  locationHeader: "LOCATION",
  addressLine1: "91 Kent Avenue",
  addressLine2: "Brooklyn, NY 11249",
  hoursHeader: "HOURS",
  hoursLine1: "Monday – Friday",
  hoursLine2: "8:00 AM – 6:00 PM",
  contactHeader: "DIRECT CONTACT",
  phone: "(718) 555-0164",
  email: "hello@northclinic.example",
  pagesHeader: "PAGES",
  links: [
    { label: "Care", href: "#care" },
    { label: "Approach", href: "#approach" },
    { label: "The Visit", href: "#visit" },
    { label: "Team", href: "#people" },
  ],
  bookingLinkText: "Contact & Booking",
  transitNote: "Subway: L Train to Bedford Ave or NYC Ferry to North 6th St / Kent Ave.",
  disclaimer: "This website provides general information and is not a substitute for medical advice.",
  copyright: "© 2026 North Clinic. All rights reserved.",
};
