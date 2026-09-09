export interface SymptomItem {
  id: string;
  phrase: string;
  subtext: string;
  image: string;
  alt: string;
  investigation: string;
}

export interface FocusZone {
  id: string;
  label: string;
  customerObservation: string;
  investigationDetail: string;
  scale: number;
  translateX: string;
  translateY: string;
  markerPosition: { top: string; left: string };
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  index: string;
}

export const defaultBusinessInfo = {
  name: "COMMON GROUND AUTO",
  shortName: "COMMON GROUND",
  tagline: "Know what's wrong. Know what's next.",
  city: "Denver",
  state: "Colorado",
  est: "DENVER / EST. 1842",
  shopSubtitle: "DENVER / INDEPENDENT AUTO REPAIR",
  address: "1842 Larimer Street",
  cityStateZip: "Denver, CO 80202",
  fullAddress: "1842 Larimer Street, Denver, CO",
  phone: "(303) 555-0194",
  phoneRaw: "tel:3035550194",
  email: "hello@commongroundauto.example",
  hours: {
    weekdays: "Mon–Fri · 8 AM–6 PM",
    saturday: "Sat · 8 AM–2 PM",
    sunday: "Sun · Closed",
  },
  manifesto: "Independent auto repair in Denver, Colorado. Practical investigation, clear explanations, and reliable work for the vehicles you depend on daily.",
  copyright: "© 2026 Common Ground Auto. All rights reserved.",
};

export const defaultNavigationContent = {
  brandTitle: "COMMON GROUND",
  badge: "DENVER / EST. 1842",
  links: [
    { name: "Services", href: "#services" },
    { name: "Diagnostics", href: "#diagnostics" },
    { name: "Our Shop", href: "#shop" },
  ],
  ctaText: "BOOK SERVICE",
  phone: "(303) 555-0194",
  drawerHeader: "SERVICE DRAWER / 01",
  drawerStatus: "SHOP OPEN",
  drawerCallLabel: "CALL THE SHOP",
  drawerAddress: "1842 Larimer St, Denver",
  drawerHours: "8 AM – 6 PM",
};

export const defaultHeroContent = {
  shopLabel: "DENVER / INDEPENDENT AUTO REPAIR",
  headline: "THAT SOUND?",
  subHeadline: "Let's figure it out.",
  paragraph: "Repairs, maintenance and diagnostics for the cars that get you through the week.",
  primaryCta: "BOOK SERVICE",
  secondaryCta: "(303) 555-0194",
  secondaryPhone: "(303) 555-0194",
  signalText: "SIGNAL: CH-01",
  waveformReadout: "CURSOR SENSING FREQ",
  footnoteLeft: "NO APPOINTMENT REQUIRED FOR DROP-OFF ESTIMATES",
  footnoteRight: "KNOW WHAT'S WRONG. KNOW WHAT'S NEXT.",
  image: "/images/hero_dashboard.jpg",
  imageAlt: "Close-up photograph of an everyday automobile dashboard illuminated at night in Denver",
};

export const defaultSymptomsContent = {
  step: "STEP 01 / SYMPTOM INTAKE",
  title: "TELL US WHAT IT'S DOING.",
  subtitle: "Select what matches your vehicle. Hover or tap to see our inspection focus.",
  ctaText: "TAKE A LOOK",
  quote: "“You don't need to know the part number. You just need to tell us what you're noticing.”",
  quoteAuthor: "COMMON GROUND AUTO — WE TRANSLATE THE NOISE INTO A PLAN",
  diagnosticTargetPrefix: "DIAGNOSTIC TARGET:",
  intakePrefix: "INTAKE CODE: CGA-",
  intakeSuffix: "DENVER SHOP INSPECTION",
  items: [
    {
      id: "no-start",
      phrase: "IT WON'T START.",
      subtext: "Single click, slow crank, or dead silence when you turn the key.",
      image: "/images/symptom_no_start.jpg",
      alt: "Battery terminal and starter connection inspected in workshop",
      investigation: "We test battery health, alternator output, and starter draw first.",
    },
    {
      id: "brakes-wrong",
      phrase: "THE BRAKES FEEL WRONG.",
      subtext: "Spongy pedal, squeal when stopping, or grinding down to a stop.",
      image: "/images/symptom_brakes.jpg",
      alt: "Brake rotor disc and caliper mechanical assembly",
      investigation: "Full physical inspection of pad thickness, rotors, calipers, and hydraulic fluid.",
    },
    {
      id: "check-engine",
      phrase: "THE CHECK ENGINE LIGHT CAME ON.",
      subtext: "Steady amber light on your dash without an obvious symptom.",
      image: "/images/symptom_check_engine.jpg",
      alt: "Check engine warning indicator on instrument cluster",
      investigation: "We read live sensor feeds and trace the fault to the root physical cause.",
    },
    {
      id: "making-noise",
      phrase: "IT'S MAKING A NOISE.",
      subtext: "Clicking on turns, rattling over bumps, or rhythmic squeals under the hood.",
      image: "/images/symptom_engine_noise.jpg",
      alt: "Engine bay drive belts, pulleys, and alternator assembly",
      investigation: "Acoustic stethoscope inspection of pulleys, bearings, heat shields, and exhausts.",
    },
    {
      id: "pulling",
      phrase: "IT'S PULLING TO ONE SIDE.",
      subtext: "The steering wheel drifts on a flat stretch of road or shudders at 60 mph.",
      image: "/images/symptom_pulling_tire.jpg",
      alt: "Automobile tire tread wear and wheel alignment rack perspective",
      investigation: "Laser alignment check, tire pressure verification, and suspension bushing inspection.",
    },
    {
      id: "doesnt-feel-right",
      phrase: "IT JUST DOESN'T FEEL RIGHT.",
      subtext: "Hesitation when accelerating, rough idle at red lights, or a loose feeling on bumps.",
      image: "/images/symptom_feel_suspension.jpg",
      alt: "Automotive suspension control arm and chassis bushing",
      investigation: "A focused road test with a technician to isolate what you feel behind the wheel.",
    },
  ] as SymptomItem[],
};

export const defaultDiagnosisContent = {
  step: "STEP 02 / VEHICLE ORIENTATION",
  title: "WHERE ARE YOU NOTICING IT?",
  description: "Pick a point on the vehicle. You don't have to be exact—we use your experience to begin our inspection.",
  interactiveCropPrefix: "INTERACTIVE CROP:",
  commonObservationLabel: "COMMON CUSTOMER OBSERVATION:",
  weWillFindItHeading: "WE'LL FIND IT.",
  weWillFindItSub: "The goal isn't to guess. It's to know.",
  footerMethod: "METHOD: PHYSICAL INSPECTION + LIVE SYSTEM ANALYSIS",
  footerProtocol: "DENVER SHOP PROTOCOL / 1842 LARIMER",
  vehicleImage: "/images/car_diagnosis_profile.jpg",
  vehicleImageAlt: "Contemporary passenger vehicle profile in auto repair workshop",
  zones: [
    {
      id: "front",
      label: "FRONT",
      customerObservation: "STRANGE NOISE",
      investigationDetail: "Ticking, squealing belts, water pump bearing rumble, or clicking on steering turn.",
      scale: 1.55,
      translateX: "20%",
      translateY: "4%",
      markerPosition: { top: "62%", left: "22%" },
    },
    {
      id: "center",
      label: "CENTER",
      customerObservation: "CHECK ENGINE",
      investigationDetail: "Dashboard amber light, catalytic converter efficiency, emissions sensors, or spark miss.",
      scale: 1.4,
      translateX: "0%",
      translateY: "-4%",
      markerPosition: { top: "45%", left: "50%" },
    },
    {
      id: "rear",
      label: "REAR",
      customerObservation: "BRAKE FEEL",
      investigationDetail: "Grinding on heavy stops, uneven pad drag, parking brake tension, or exhaust hanger looseness.",
      scale: 1.55,
      translateX: "-20%",
      translateY: "8%",
      markerPosition: { top: "64%", left: "78%" },
    },
    {
      id: "left",
      label: "LEFT",
      customerObservation: "PULLING",
      investigationDetail: "Drifting on straight asphalt, uneven tire shoulder wear, or front tie-rod play.",
      scale: 1.6,
      translateX: "14%",
      translateY: "14%",
      markerPosition: { top: "72%", left: "32%" },
    },
    {
      id: "right",
      label: "RIGHT",
      customerObservation: "SUSPENSION",
      investigationDetail: "Hollow clunk over neighborhood potholes, worn strut mount, or stabilizing link looseness.",
      scale: 1.6,
      translateX: "-14%",
      translateY: "14%",
      markerPosition: { top: "72%", left: "70%" },
    },
  ] as FocusZone[],
};

export const defaultShopContent = {
  step: "STEP 03 / THE FACILITY",
  title: "THE SHOP",
  description: "Good work is usually pretty unremarkable. The car goes in. We find the problem. The car goes out.",
  addressLine: "1842 LARIMER STREET · DENVER, CO · DOWNTOWN SERVICE BAYS",
  documentaryTag: "DOCUMENTARY PHOTOGRAPHY · COMMON GROUND WORKSHOP",
  alignedStatus: "COHERENT COMPOSITE",
  unalignedStatus: "DOCUMENTARY WALL",
  bays: {
    bay1: {
      image: "/images/shop_lift_bay.jpg",
      alt: "Denver auto repair shop bay with vehicle raised on hydraulic lift",
      label: "BAY 01 / TWO-POST HYDRAULIC LIFT",
    },
    mechanic: {
      image: "/images/shop_mechanic_hands.jpg",
      alt: "Mechanic working with hand wrench on automotive engine",
      label: "PRECISION TORQUE / MECHANICAL ASSEMBLY",
    },
    tools: {
      image: "/images/shop_tool_bench.jpg",
      alt: "Organized workshop steel tool bench and wrenches",
      label: "BENCH / DIAGNOSTIC & HAND TOOLS",
    },
    wheels: {
      image: "/images/shop_wheel_bay.jpg",
      alt: "Wheel removed on lift with brake assembly under portable work light",
      label: "INSPECTION / ROTORS & RUNNING GEAR",
    },
  },
};

export const defaultServicesContent = {
  step: "STEP 04 / SERVICE INDEX",
  title: "SERVICES",
  tagline: "INDEPENDENT VEHICLE CARE · NO UNNECESSARY UPSELLS",
  footerLeft: "ALL MAKES & MODELS SERVICED",
  footerRight: "ESTIMATES PROVIDED BEFORE WORK BEGINS",
  items: [
    {
      id: "repair",
      name: "REPAIR",
      description: "For the thing that shouldn't be making that sound.",
      image: "/images/symptom_engine_noise.jpg",
      alt: "Mechanical repairs and engine component servicing",
      index: "01",
    },
    {
      id: "brakes",
      name: "BRAKES",
      description: "When stopping doesn't feel quite right.",
      image: "/images/symptom_brakes.jpg",
      alt: "Brake rotor, caliper and pad service",
      index: "02",
    },
    {
      id: "diagnostics",
      name: "DIAGNOSTICS",
      description: "When the warning light isn't telling you enough.",
      image: "/images/symptom_check_engine.jpg",
      alt: "Check engine light and vehicle electronic diagnosis",
      index: "03",
    },
    {
      id: "maintenance",
      name: "MAINTENANCE",
      description: "Keep small problems from becoming bigger ones.",
      image: "/images/shop_tool_bench.jpg",
      alt: "Routine fluids, filters, and scheduled maintenance",
      index: "04",
    },
    {
      id: "tires",
      name: "TIRES",
      description: "Because four contact points matter.",
      image: "/images/symptom_pulling_tire.jpg",
      alt: "Tire replacement, mounting, balancing and alignment",
      index: "05",
    },
    {
      id: "electrical",
      name: "ELECTRICAL",
      description: "When something isn't turning on.",
      image: "/images/symptom_no_start.jpg",
      alt: "Battery, alternator, wiring and starting system service",
      index: "06",
    },
  ] as ServiceItem[],
};

export const defaultHandoffContent = {
  step: "STEP 05 / THE HANDOFF",
  headline: "FIXED.",
  subHeadline: "BACK TO YOUR DAY.",
  serifText: "That's the whole point.",
  garageImage: "/images/handoff_garage_lighting.jpg",
  garageAlt: "Hands on steering wheel inside car in shop garage lighting",
  daylightImage: "/images/handoff_daylight.jpg",
  daylightAlt: "Hands on steering wheel driving out into clean daylight on Denver road",
};

export const defaultBookingContent = {
  badge: "APPOINTMENT REQUEST",
  headline: "SOMETHING FEELS OFF?",
  headlineRed: "LET'S TAKE A LOOK.",
  description: "Tell us what you're noticing. We'll take it from there.",
  callLabel: "CALL DIRECTLY",
  addressLabel: "SHOP ADDRESS",
  hoursLabel: "SHOP HOURS",
  ticketLabel: "INTAKE TICKET / SERVICE INQUIRY",
  shopBrand: "COMMON GROUND",
  submitSuccess: {
    title: "GOT IT.",
    message: "We'll be in touch about your appointment.",
    urgentNote: "If this is urgent or your car won't move, call us at (303) 555-0194.",
    resetButton: "Submit another note",
  },
  form: {
    nameLabel: "Your Name",
    namePlaceholder: "e.g. Alex Morgan",
    phoneLabel: "Phone Number",
    phonePlaceholder: "(303) 000-0000",
    issueLabel: "What's going on?",
    issuePlaceholder: "Describe what you hear, feel, or see on the dashboard...",
    dayLabel: "Preferred Day",
    dayOptions: [
      { value: "Today", label: "Today (Drop-off / Urgent)" },
      { value: "Tomorrow", label: "Tomorrow" },
      { value: "This Week", label: "Later this week" },
      { value: "Saturday", label: "Saturday morning" },
    ],
    submitText: "REQUEST SERVICE",
    footerDisclaimer: "No payment required. We will call you back to confirm drop-off.",
  },
};

export const defaultFooterContent = {
  brandName: "COMMON GROUND AUTO",
  tagline: "Know what's wrong. Know what's next.",
  manifesto: "Independent auto repair in Denver, Colorado. Practical investigation, clear explanations, and reliable work for the vehicles you depend on daily.",
  establishment: "DENVER / INDEPENDENT WORKSHOP · EST. 1842 LARIMER",
  servicesHeader: "SERVICES",
  exploreHeader: "EXPLORE",
  locationHeader: "LOCATION & HOURS",
  addressLine1: "1842 Larimer Street",
  addressLine2: "Denver, CO 80202",
  phone: "(303) 555-0194",
  email: "hello@commongroundauto.example",
  hours: [
    "Mon–Fri · 8 AM–6 PM",
    "Sat · 8 AM–2 PM",
    "Sun · Closed",
  ],
  services: [
    { name: "Repair", href: "#services" },
    { name: "Brakes", href: "#services" },
    { name: "Diagnostics", href: "#diagnostics" },
    { name: "Maintenance", href: "#services" },
    { name: "Tires", href: "#services" },
    { name: "Electrical", href: "#services" },
  ],
  links: [
    { name: "Services", href: "#services" },
    { name: "Shop", href: "#shop" },
    { name: "About", href: "#shop" },
    { name: "Contact", href: "#booking" },
  ],
  copyright: "© 2026 Common Ground Auto. All rights reserved.",
  locationTag: "DENVER, COLORADO",
  sloganTag: "KNOW WHAT'S WRONG",
};
