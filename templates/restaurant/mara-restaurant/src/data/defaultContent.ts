export interface MenuItem {
  id: string;
  category: string;
  name: string;
  italianName: string;
  price: string;
  description: string;
  pairing: string;
  image: string;
  tag?: string;
}

export interface MotionMoment {
  id: string;
  image: string;
  title: string;
  caption: string;
  tag: string;
  tilt: string;
}

export interface NavLinkItem {
  id: string;
  label: string;
  shortLabel: string;
  mobileIndex: string;
  mobileLabel: string;
}

export interface DiningHour {
  days: string;
  time: string;
}

export interface MenuCategoryItem {
  name: string;
  desc: string;
  price: string;
}

export interface MenuCategory {
  title: string;
  subtitle: string;
  items: MenuCategoryItem[];
}

export const defaultBusinessInfo = {
  name: "MARA",
  tagline: "Seasonal Mediterranean",
  motto: "Come hungry. Stay awhile.",
  motto2: "Leave happy.",
  address: "184 Franklin St, Greenpoint, Brooklyn",
  addressLine1: "184 Franklin Street",
  addressLine2: "Greenpoint, Brooklyn, NY 11222",
  phone: "(718) 555-0142",
  phoneTel: "7185550142",
  hoursNote: "Dinner Service Tonight: 5 PM – 11 PM",
  walkInNotice: "Walk-ins always welcome at the bar",
  diningHours: [
    { days: "Tue – Thu", time: "5:00 PM – 10:30 PM" },
    { days: "Fri & Sat", time: "5:00 PM – 11:00 PM" },
    { days: "Sunday Supper", time: "4:30 PM – 10:00 PM" },
    { days: "Monday", time: "Closed (Market Day)" },
  ] as DiningHour[],
};

export const defaultSiteMetadata = {
  title: "MARA — Seasonal Mediterranean | Brooklyn, NY",
  description:
    "A neighbourhood seasonal Mediterranean restaurant in Greenpoint, Brooklyn. Open fire cooking, market fish, natural wine, and honest bread. Come hungry. Stay awhile.",
  keywords: [
    "Mara Restaurant",
    "Brooklyn Mediterranean Restaurant",
    "Greenpoint Dining",
    "Wood-fired cooking",
    "Natural Wine Brooklyn",
  ],
  openGraph: {
    title: "MARA — Seasonal Mediterranean | Brooklyn, NY",
    description: "Come hungry. Stay awhile. 184 Franklin Street, Brooklyn.",
    type: "website" as const,
  },
};

export const defaultNavigationContent = {
  brand: "MARA",
  subtitle: "Seasonal Mediterranean",
  serviceNote: "Dinner Service Tonight: 5 PM – 11 PM",
  locationNote: "184 Franklin St, Greenpoint, Brooklyn",
  walkInNote: "Walk-ins always welcome at the bar",
  links: [
    {
      id: "menu-section",
      label: "The Menu",
      shortLabel: "Menu",
      mobileIndex: "01",
      mobileLabel: "Tonight's Menu",
    },
    {
      id: "motion-section",
      label: "Craft & Fire",
      shortLabel: "Craft",
      mobileIndex: "02",
      mobileLabel: "Culinary Craft & Wood Fire",
    },
    {
      id: "table-section",
      label: "The Table",
      shortLabel: "Gatherings",
      mobileIndex: "03",
      mobileLabel: "The Gathering Table",
    },
    {
      id: "reservation-section",
      label: "Reservations",
      shortLabel: "Reserve",
      mobileIndex: "04",
      mobileLabel: "Reservations & Walk-Ins",
    },
    {
      id: "location-section",
      label: "Hours & Info",
      shortLabel: "Location",
      mobileIndex: "05",
      mobileLabel: "184 Franklin St & Hours",
    },
  ] as NavLinkItem[],
  fullMenuBtn: "Full Menu",
  bookTableBtn: "Book a Table",
  tableOfContents: "Table of Contents",
  openFullMenuBtn: "Open Full Printed Menu",
  reserveNowBtn: "Reserve A Table Now",
};

export const defaultHeroContent = {
  locationBadge: "Greenpoint, Brooklyn · 184 Franklin St",
  headingPart1: "COME HUNGRY.",
  headingPart2: "Leave happy.",
  description:
    "Seasonal Mediterranean cooking over open embers. Market fish straight from local boats, slow-fermented grains, wild oregano, raw milk cheeses, and natural wines poured by the glass.",
  facts: [
    { label: "Wood Hearth", value: "Olive Wood" },
    { label: "Tonight's Catch", value: "Montauk Bass" },
    { label: "Sourdough", value: "Baked 4:30 PM" },
  ],
  primaryCta: "Reserve a Table",
  secondaryCta: "Explore Tonight's Menu",
  handwrittenNote: "“Walk-ins always welcome when we have room.”",
  mainDish: {
    title: "Charred Spanish Octopus",
    subtitle: "White bean purée · wild oregano · burnt lemon",
    price: "$28",
    image: "/images/hero_octopus.jpg",
    alt: "Charred Spanish octopus with white bean puree and charred lemon",
    tag: "tonight's favourite!",
  },
  secondDish: {
    title: "Warm Sourdough",
    subtitle: "Cultured butter · sea salt",
    image: "/images/hero_sourdough.jpg",
    alt: "Warm country sourdough with cultured butter and flaky salt",
  },
  hearthBadge: "Hearth Cooked",
};

export const defaultMenuContent = {
  sectionTag: "Section 01 · The Kitchen",
  title: "Tonight's Featured Offerings",
  subtitle:
    "Printed fresh every afternoon based on market harvest and morning boats.",
  fullMenuCta: "View Full Printed Menu",
  sheetHeaderBrand: "MARA · BROOKLYN",
  sheetHeaderEdition: "SEPTEMBER 2026 EDITION",
  sheetFooterNote:
    "* Our kitchen uses raw milk cheese, organic flour, and wild seafood.",
  sheetFooterCta: "View All 24 Dishes & Wines",
  signatureDishes: [
    {
      id: "sourdough",
      category: "Inizio",
      name: "Warm Sourdough & Cultured Butter",
      italianName: "Pane di Campagna",
      price: "$9",
      description:
        "Naturally leavened 48-hour loaf baked twice daily in our wood deck oven. Served warm with cultured sea-salted butter and fermented hot honey.",
      pairing: "Pairs with: House Vermouth Spritz",
      image: "/images/hero_sourdough.jpg",
      tag: "Baked Fresh 4:30 PM",
    },
    {
      id: "olives",
      category: "Antipasti",
      name: "Warm Marinated Castelfrano & Kalamata Olives",
      italianName: "Olive Marinate con Agrumi",
      price: "$11",
      description:
        "Castelvetrano and kalamata olives gently warmed in cold-pressed Peloponnese olive oil, crushed wild fennel seed, dried calabrian chili, and charred orange peel.",
      pairing: "Pairs with: 2023 Greco di Tufo",
      image: "/images/dish_marinated_olives.jpg",
      tag: "Wood Hearth Warmed",
    },
    {
      id: "octopus",
      category: "Antipasti",
      name: "Charred Spanish Octopus",
      italianName: "Polpo alla Brace",
      price: "$28",
      description:
        "Tender braised tentacle seared on cast iron over glowing embers. Served over silky white Gigante bean purée, smoked paprika oil, and charred meyer lemon.",
      pairing: "Pairs with: 2021 Etna Rosso, Graci",
      image: "/images/hero_octopus.jpg",
      tag: "House Signature",
    },
    {
      id: "peaches",
      category: "Piatti Piccoli",
      name: "Roasted Peaches & Fresh Stracciatella",
      italianName: "Pesche Arrostite con Stracciatella",
      price: "$22",
      description:
        "Charred Hudson Valley yellow peaches, torn cow's milk stracciatella, 12-year aged Modena balsamic, fragrant genovese basil oil, and toasted pine nuts.",
      pairing: "Pairs with: 2022 Malvasia Bianca",
      image: "/images/dish_roasted_peach.jpg",
      tag: "Seasonal Market",
    },
    {
      id: "fish",
      category: "Secondi",
      name: "Whole Roasted Mediterranean Sea Bass",
      italianName: "Branzino Intero al Forno",
      price: "$42",
      description:
        "Whole wild branzino stuffed with flowering thyme, rosemary, and lemon. Roasted blistered-skin over olive wood embers with vibrant salsa verde and crispy capers.",
      pairing: "Pairs with: 2022 Vermentino di Sardegna",
      image: "/images/dish_roasted_fish.jpg",
      tag: "Catch of the Day",
    },
    {
      id: "cake",
      category: "Dolci",
      name: "Meyer Lemon Olive Oil Cake",
      italianName: "Torta all'Olio d'Oliva",
      price: "$14",
      description:
        "Tender crumb baked with single-estate Biancolilla olive oil. Crowned with lightly whipped mascarpone cream, candied Sicilian orange zest, and sea salt flakes.",
      pairing: "Pairs with: Amaro Nonino or Espresso",
      image: "/images/dish_olive_oil_cake.jpg",
      tag: "Dessert Classic",
    },
  ] as MenuItem[],
};

export const defaultFoodInMotionContent = {
  marqueeItems: [
    "CRISP",
    "✦",
    "BRIGHT",
    "✦",
    "SMOKED OVER WOOD",
    "✦",
    "SLOW GRAINS",
    "✦",
    "HONEST OLIVE OIL",
    "✦",
    "CRISP",
    "✦",
    "BRIGHT",
    "✦",
    "SMOKED OVER WOOD",
    "✦",
    "SLOW GRAINS",
    "✦",
    "HONEST OLIVE OIL",
    "✦",
    "CRISP",
    "✦",
    "BRIGHT",
    "✦",
    "SMOKED OVER WOOD",
  ],
  sectionTag: "Section 02 · Craft & Kinetic Rhythm",
  title: "Culinary Rhythm & Embers",
  subtitle:
    "No shortcuts. No microwaves. Just fire, coarse sea salt, patient fermentations, and generous hands.",
  moments: [
    {
      id: "herbs",
      image: "/images/motion_chopping_herbs.jpg",
      title: "Wild Oregano & Herbs",
      caption: "Chopped finely to order, never in bulk.",
      tag: "Aroma",
      tilt: "rotate-[-1.5deg]",
    },
    {
      id: "oil",
      image: "/images/motion_olive_oil_pour.jpg",
      title: "Cold-Pressed Olive Oil",
      caption: "Single-estate Peloponnese harvest.",
      tag: "Fat & Gold",
      tilt: "rotate-[2deg]",
    },
    {
      id: "bread",
      image: "/images/motion_bread_steam.jpg",
      title: "Cracked Sourdough",
      caption: "Warm steam rising from 48-hour levain.",
      tag: "Fire & Grain",
      tilt: "rotate-[-2deg]",
    },
    {
      id: "wine",
      image: "/images/motion_wine_pour.jpg",
      title: "Unfiltered Natural Wine",
      caption: "Poured generously into casual bistro tumblers.",
      tag: "Low Intervention",
      tilt: "rotate-[1.5deg]",
    },
    {
      id: "flame",
      image: "/images/motion_pan_flame.jpg",
      title: "Olive Wood Flame",
      caption: "Charring sea salt, fish skin, and citrus peel.",
      tag: "Hearth Craft",
      tilt: "rotate-[-1deg]",
    },
  ] as MotionMoment[],
  footnote:
    "Open hearth fueled exclusively with seasoned upstate olive and apple wood.",
  handwrittenFootnote: "“Smoked slowly, served hot.”",
};

export const defaultTheTableContent = {
  sectionTag: "Section 03 · The Gathering",
  title: "Good food tastes better around people.",
  subtitle:
    "We built Mara to be the long dinner table you wish you had at home. Unhurried meals, elbows on wood, plates passed across the center, and no one checking the time.",
  image: {
    src: "/images/the_table.jpg",
    alt: "Warm dinner gathering at Mara with friends sharing wine and food",
    quote: "“Stay for another bottle.”",
    caption: "Tuesday through Sunday evenings in Greenpoint.",
  },
  cards: [
    {
      title: "Dinner Service",
      subtitle: "Tue – Sun · 5 PM – 11 PM",
      text: "Kitchen fires up at 5:00 PM with last orders taken at 10:15 PM. Bar pours late until the last story ends. Closed Mondays.",
    },
    {
      title: "Walk-Ins Welcome",
      subtitle: "Half Room Held Every Night",
      text: "We keep the entire 12-seat zinc bar and front bistro tables open for spontaneous arrivals. If there is a wait, enjoy an aperitivo outside.",
    },
    {
      title: "Large Feasts",
      subtitle: "Tables for 6 to 14 Guests",
      text: "For gatherings of 6 or more, our kitchen serves a multi-course family-style feast featuring whole roasted fish, pasta, and shared carafes.",
    },
    {
      title: "Find Us In Brooklyn",
      subtitle: "184 Franklin St · Greenpoint",
      text: "Two blocks from the Greenpoint Ave G train stop, on the quiet corner between Huron and India Streets.",
    },
  ],
  banner: {
    title: "Planning an evening with us?",
    text: "Reservations are released 14 days in advance at 9:00 AM daily.",
    cta: "Save Your Seat",
  },
};

export const defaultReservationContent = {
  badge: "Reservations & Table Inquiries",
  title: "SAVE YOUR SEAT.",
  subtitle: "Tables for dinner are seated between 5:00 PM and 10:30 PM.",
  postcardHeader: "DINING POSTCARD · 184 FRANKLIN STREET",
  postcardTitle: "Reserve for this week",
  partyLabel: "Party",
  partyOptions: [
    "1 Guest",
    "2 Guests",
    "3 Guests",
    "4 Guests",
    "5 Guests",
    "6 Guests (Family Table)",
    "7+ Feast Inquiry",
  ],
  dateLabel: "Date",
  dateOptions: [
    "Tonight (Tonight's Service)",
    "Tomorrow Evening",
    "Friday Evening",
    "Saturday Evening",
    "Sunday Supper",
    "Next Week",
  ],
  timeLabel: "Seating",
  timeOptions: [
    "5:30 PM (Early Hearth)",
    "6:00 PM",
    "6:45 PM",
    "7:30 PM (Prime)",
    "8:15 PM",
    "9:00 PM",
    "9:45 PM (Late Supper)",
  ],
  nameLabel: "Your Name *",
  namePlaceholder: "e.g. Julian Henderson",
  emailLabel: "Email Address *",
  emailPlaceholder: "julian@example.com",
  notesLabel: "Special Notes or Dietary Preferences (Optional)",
  notesPlaceholder:
    "e.g. Birthday, anniversary, dairy allergy, outdoor request",
  submitButton: "Request Table at Mara",
  finePrint:
    "* We hold all confirmed tables for 15 minutes before offering them to walk-ins. No cancellation fee.",
  confirmationTitle: "YOU'RE ON THE LIST.",
  confirmationGreeting: "We look forward to pouring your first glass",
  confirmationNotice:
    "A confirmation slip has been sent to your email. If your schedule shifts, simply reply to the note or give us a call at",
  resetButton: "Book Another Table or Edit",
};

export const defaultQuietFinaleContent = {
  tag: "The Evening Closes",
  heading: "SEE YOU SOON.",
  description:
    "Crumbs on the linen, memories on the tongue, and wine in good company.",
  stampBrand: "MARA · BROOKLYN",
  stampLocation: "Greenpoint NY",
  image: {
    src: "/images/quiet_table_finale.jpg",
    alt: "Post-dinner table with two wine glasses, crumbs, and folded linen napkin in warm dusk light",
  },
};

export const defaultFooterContent = {
  brand: "MARA",
  motto: "Come hungry. Stay awhile.",
  description:
    "An unhurried seasonal Mediterranean restaurant built on open fire, market produce, wild herbs, natural wines, and crusty sourdough.",
  hoursTitle: "Dining Hours",
  barSeatingNotice:
    "Bar Seating: Walk-ins are seated first-come, first-served throughout the evening.",
  indexTitle: "Index",
  newsletterTitle: "The Seasonal Letter",
  newsletterText:
    "We send occasional notes when fresh olive oils land from Sicily or special wine cellar allocations open.",
  newsletterPlaceholder: "Your email address",
  newsletterFinePrint: "Never spam. Only seasonal recipes and cellar notes.",
  newsletterSuccess: "You're subscribed to our notes.",
  copyright: "MARA Restaurant. All rights reserved.",
  credit: "Made for food lovers",
};

export const defaultFullMenuModalContent = {
  brand: "MARA",
  carteTitle: "Autumn / Winter Seasonal Carte",
  printBtn: "Print",
  quote: "“Everything touched by flame, olive oil, and time.”",
  addressNote: "Chef & Hearth · 184 Franklin St · Brooklyn",
  categories: [
    {
      title: "APERITIVI & BITES",
      subtitle: "Cocktails & Stuzzichini",
      items: [
        {
          name: "Mara Spritz",
          desc: "Cappelletti aperitivo, sparkling prosecco, blood orange, rosemary",
          price: "$16",
        },
        {
          name: "Smoked Olive Martini",
          desc: "Olive oil-washed botanic gin, dry vermouth, hearth-smoked castelvetrano",
          price: "$18",
        },
        {
          name: "Warm Sourdough & Cultured Butter",
          desc: "48-hour levain, whipped jersey cow butter, fermented chili honey, sea salt",
          price: "$9",
        },
        {
          name: "Marinated Citrus Olives",
          desc: "Castelfrano & kalamata, charred orange peel, wild oregano, fennel",
          price: "$11",
        },
      ],
    },
    {
      title: "ANTIPASTI",
      subtitle: "To Start & Share",
      items: [
        {
          name: "Charred Spanish Octopus",
          desc: "Slow-braised tentacle over embers, creamy gigante beans, burnt lemon, pimentón",
          price: "$28",
        },
        {
          name: "Roasted Peaches & Stracciatella",
          desc: "Hudson Valley caramelized peaches, torn stracciatella, aged balsamic, pignoli",
          price: "$22",
        },
        {
          name: "Crudo of Hamachi",
          desc: "Preserved Meyer lemon, crispy shallot, pickled fennel pollen, sea buckthorn",
          price: "$24",
        },
        {
          name: "Coal-Roasted Bitter Greens",
          desc: "Radicchio trevisano, anchovy breadcrumb, shaved aged pecorino sardo",
          price: "$18",
        },
      ],
    },
    {
      title: "PRIMI & PASTE",
      subtitle: "Hand-rolled Daily",
      items: [
        {
          name: "Campanelle with Smoked Mussels",
          desc: "Calabrian chili butter, saffron broth, wild marjoram, toasted garum crumb",
          price: "$27",
        },
        {
          name: "Pappardelle with Slow Lamb Ragu",
          desc: "Braised Colorado lamb shoulder, rosemary, crushed juniper, ricotta salata",
          price: "$29",
        },
      ],
    },
    {
      title: "SECONDI AL FORNO",
      subtitle: "Open Ember Hearth",
      items: [
        {
          name: "Whole Roasted Mediterranean Sea Bass",
          desc: "Wild branzino, roasted over olive wood, salsa verde, charred lemons, caper berries",
          price: "$42",
        },
        {
          name: "Hearth-Roasted Half Chicken",
          desc: "Dry-brined pasture chicken, charred garlic toum, roasted dripping bread, oregano",
          price: "$34",
        },
        {
          name: "Wood-Fired Ribeye for Two (24oz)",
          desc: "Prime dry-aged beef on the bone, roasted bone marrow, salsa rossa, sea salt",
          price: "$88",
        },
        {
          name: "Charred Sweet Cabbage",
          desc: "Brown butter emulsion, toasted hazelnuts, smoked yogurt, fresh dill",
          price: "$22",
        },
      ],
    },
    {
      title: "DOLCI",
      subtitle: "Sweets & Digestivi",
      items: [
        {
          name: "Meyer Lemon Olive Oil Cake",
          desc: "Single-estate Sicilian olive oil, whipped mascarpone, candied orange, sea salt",
          price: "$14",
        },
        {
          name: "Bitter Chocolate & Hazelnut Tart",
          desc: "Valrhona 72% dark chocolate, roasted Piedmont hazelnuts, smoked maldon salt",
          price: "$15",
        },
        {
          name: "Amaro Tasting Flight",
          desc: "Three distinct regional Italian amaros served with hearth-candied walnuts",
          price: "$20",
        },
      ],
    },
  ] as MenuCategory[],
  wines: [
    "• Sparkling: 2022 Costadilà Prosecco Col Fondo, Veneto — $17 / $68",
    "• White: 2021 Occhipinti 'SP68' Bianco, Sicily — $18 / $72",
    "• Skin-Contact: 2022 Radikon 'Slatnik', Friuli — $22 / $88",
    "• Red: 2021 Frank Cornelissen 'Susucaru' Rosso, Etna — $19 / $76",
  ],
  dietaryNote:
    "Dietary Notes: We gladly accommodate vegetarian, pescatarian, and dairy-free preferences. Please notify your server upon sitting.",
  reserveCta: "Reserve a Table for Dinner",
};
