export interface DishItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: "starter" | "main" | "dessert";
  image: string;
}

export interface MenuItem {
  name: string;
  description: string;
  price: string;
}

export interface WineItem {
  name: string;
  region: string;
  type: string;
  glass: string;
  bottle: string;
}

export interface BarDrink {
  name: string;
  ingredients: string;
  price: string;
}

export const defaultBusinessInfo = {
  name: "AFTERGLOW",
  tagline: "Dinner. Then see what happens.",
  phone: "020 7946 0182",
  address: {
    street: "27 Mare Street",
    city: "London",
    postcode: "E8 4RP",
    area: "East London / Hackney",
    full: "27 Mare Street, London E8 4RP",
  },
  hours: {
    days: "Tue–Sat",
    kitchen: "5:30 PM — 11:00 PM",
    bar: "5:30 PM — Late (till 1:00 AM)",
    closed: "Sun–Mon: Closed",
  },
  social: {
    instagram: "https://instagram.com",
  },
  mapsUrl: "https://maps.google.com/?q=27+Mare+Street+London+E8",
};

export const defaultSiteMetadata = {
  title: "AFTERGLOW — Dinner. Then see what happens. | East London",
  description: "Late-night neighbourhood restaurant and wine bar at 27 Mare Street, London E8. Seasonal food, natural wine, and nowhere you need to be yet.",
  openGraph: {
    title: "AFTERGLOW — East London Restaurant & Wine Bar",
    description: "Dinner. Then see what happens. Tue–Sat · Kitchen 5:30–11 · Bar late.",
    type: "website" as const,
  },
};

export const defaultNavigationContent = {
  brand: "AFTERGLOW",
  links: [
    { label: "TONIGHT", href: "#tonight-menu", type: "scroll" as const },
    { label: "MENU", action: "openMenu" as const },
    { label: "FIND US", action: "openFindUs" as const },
  ],
  bookCta: {
    label: "BOOK",
    href: "#reservation",
  },
  mobileStrip: "KITCHEN 5:30 — LATE",
};

export const defaultHeroContent = {
  topStrip: {
    left: "EAST LONDON / TUESDAY—SATURDAY",
    right: "27 MARE ST · E8",
  },
  headline: {
    first: "DINNER.",
    second: "Stay a while.",
  },
  copy: [
    "Seasonal food, good wine,",
    "and nowhere you need to be yet.",
  ],
  cta: {
    label: "BOOK A TABLE",
    href: "#reservation",
  },
  image: {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=85",
    alt: "Afterglow restaurant table halfway through dinner with wine, candlelight and crumbs",
    badge: "best after 8",
    stamp: "27 MARE STREET",
  },
  bottomStrip: {
    left: "KITCHEN 5:30—11 · BAR UNTIL LATE",
    right: "SCROLL TO ENTER THE EVENING ↓",
  },
};

export const defaultNightChangesContent = {
  eyebrow: "NIGHT PROGRESSION",
  heading: "The gradual shift as the evening deepens.",
  timeline: "EARLY EVENING → DINNER → DRINKS → LATE NIGHT",
  moments: [
    {
      time: "6:14 PM",
      phrase: "TABLES FILLING.",
      subtext: "Coat hooks rattling. First bottles uncorked. Candle wicks catching.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=85",
      alt: "Warm sourdough and butter on linen at early dinner",
      alignment: "left" as const,
    },
    {
      time: "8:47 PM",
      phrase: "THE ROOM GETS LOUDER.",
      subtext: "Steam off the pass. Second orders in. Glasses clattering against timber.",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=85",
      alt: "Sizzling pans in hot kitchen pass",
      alignment: "right" as const,
    },
    {
      time: "11:26 PM",
      phrase: "ONE MORE?",
      subtext: "Kitchen closed. Cold Negronis. Nowhere you need to wake up for.",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=85",
      alt: "Cocktail with carved ice and citrus peel under warm bar light",
      alignment: "left" as const,
    },
  ],
};

export const TONIGHT_DISHES: DishItem[] = [
  {
    id: "peppers",
    name: "FIRE-ROASTED PEPPERS",
    description: "anchovy, almond, sherry",
    price: "£11",
    category: "starter",
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "chicken",
    name: "CHARRED CHICKEN",
    description: "preserved lemon, green olive, herbs",
    price: "£22",
    category: "main",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "tagliatelle",
    name: "TAGLIATELLE",
    description: "brown butter, sage, parmesan",
    price: "£17",
    category: "main",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "aubergine",
    name: "ROASTED AUBERGINE",
    description: "tomato, tahini, mint",
    price: "£15",
    category: "main",
    image: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "seabass",
    name: "WHOLE SEA BASS",
    description: "fennel, lemon, salsa verde",
    price: "£28",
    category: "main",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "tart",
    name: "CHOCOLATE TART",
    description: "olive oil, sea salt",
    price: "£9",
    category: "dessert",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=85",
  },
];

export const defaultMenuTonightContent = {
  ambientBadge: {
    line1: "DAILY BLACKBOARD",
    line2: "PRINTED 16:45",
  },
  eyebrow: "MENU FOR",
  heading: "TONIGHT",
  subStrip: {
    left: "SMALL PLATES & WOOD GRILL",
    right: "EAST LONDON / E8",
  },
  dishes: TONIGHT_DISHES,
  cta: {
    label: "VIEW FULL MENU",
  },
  dietaryNote: "GLUTEN-FREE & VEGAN OPTIONS AVAILABLE DAILY",
};

export const defaultRoomContent = {
  image: {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=85",
    alt: "Afterglow dining room in East London",
  },
  pinnedNotes: [
    { label: "OPEN KITCHEN", position: "top-left" as const },
    { label: "42 SEATS", position: "top-right" as const },
    { label: "NATURAL WINE", position: "bottom-left" as const },
    { label: "MUSIC GETS LOUDER AFTER NINE", position: "bottom-right" as const },
  ],
  headline: {
    first: "COME FOR DINNER.",
    second: "Stay for the part after.",
  },
};

export const defaultBarContent = {
  badge: "BAR SERVICE · TILL 01:00",
  headline: {
    first: "THE KITCHEN CLOSES.",
    second: "The bar doesn't.",
  },
  copy: [
    "Good wine.",
    "A few things to eat.",
    "One more drink if you're not ready to go home.",
  ],
  cta: {
    label: "SEE THE DRINKS",
  },
  driftingIngredients: [
    {
      id: "ice",
      label: "ICE",
      src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=85",
      alt: "Carved ice in tumbler",
    },
    {
      id: "citrus",
      label: "CITRUS",
      src: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=85",
      alt: "Citrus peel and blood orange",
    },
    {
      id: "wine",
      label: "WINE",
      src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=85",
      alt: "Ruby natural wine bottle and pour",
    },
  ],
};

export const defaultReservationContent = {
  stamps: {
    topLeft: "NO. 027 / MARE ST",
    topRight: "EST. 2026",
    bottomLeft: "TABLES RESERVED FOR DINNER & DRINKS",
    bottomRight: "LONDON E8",
  },
  header: {
    eyebrow: "RESERVATIONS",
    heading: "COME OVER.",
    locationLeft: "27 MARE STREET",
    locationRight: "E8",
  },
  form: {
    dateLabel: "DATE",
    dateOptions: [
      { value: "Tonight", label: "Tonight (Walk-in / Book)" },
      { value: "Tomorrow", label: "Tomorrow" },
      { value: "Friday", label: "This Friday" },
      { value: "Saturday", label: "This Saturday" },
      { value: "Next Tuesday", label: "Next Tuesday" },
      { value: "Next Wednesday", label: "Next Wednesday" },
      { value: "Next Thursday", label: "Next Thursday" },
    ],
    timeLabel: "TIME",
    timeOptions: [
      { value: "17:30", label: "17:30 (Early Service)" },
      { value: "18:15", label: "18:15" },
      { value: "19:00", label: "19:00" },
      { value: "19:45", label: "19:45" },
      { value: "20:30", label: "20:30 (Peak Evening)" },
      { value: "21:15", label: "21:15" },
      { value: "22:00", label: "22:00 (Late Night)" },
    ],
    guestsLabel: "GUESTS",
    guestsOptions: [
      { value: "1 Guest", label: "1 Guest (Bar counter)" },
      { value: "2 Guests", label: "2 Guests (Dining table)" },
      { value: "3 Guests", label: "3 Guests" },
      { value: "4 Guests", label: "4 Guests" },
      { value: "5 Guests", label: "5 Guests" },
      { value: "6 Guests", label: "6 Guests (Large booth)" },
    ],
    nameLabel: "NAME",
    namePlaceholder: "e.g. Frances Bell",
    emailLabel: "EMAIL",
    emailPlaceholder: "e.g. frances@example.com",
    errorRequired: "Please provide your name and email.",
    submitIdle: "REQUEST A TABLE",
    submitPending: "HOLDING TABLE...",
    footerNotice: "WALK-INS WELCOME DAILY AT THE BAR",
  },
  confirmed: {
    heading: "TABLE\nHELD.",
    subheading: "See you soon.",
    guestLabel: "GUEST",
    bookingLabel: "BOOKING",
    diningNote: "· Bar & Dining",
    brand: "AFTERGLOW",
    address: "27 MARE STREET · LONDON E8",
    resetLabel: "Make another request",
  },
};

export const defaultFinalMomentContent = {
  image: {
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=85",
    alt: "Late night at Afterglow with solitary candle and two wine glasses",
  },
  lines: [
    "LAST TABLE.",
    "LAST GLASS.",
  ],
  heading: "GOOD NIGHT.",
  brand: "AFTERGLOW",
  address: "27 MARE STREET",
};

export const defaultFooterContent = {
  brand: "AFTERGLOW",
  address: [
    "27 Mare Street",
    "London E8",
  ],
  phone: "020 7946 0182",
  hours: {
    title: "HOURS",
    days: "Tue–Sat",
    kitchen: "Kitchen 5:30 PM — 11:00 PM",
    bar: "Bar late",
    closed: "Sun–Mon: Closed",
  },
  directory: {
    title: "DIRECTORY",
    links: [
      { label: "Menu", action: "openMenu" as const },
      { label: "Reservations", href: "#reservation", type: "scroll" as const },
      { label: "Instagram", href: "https://instagram.com", external: true },
      { label: "Find Us", action: "openFindUs" as const },
    ],
  },
  copyright: "© 2026 Afterglow",
  tagline: "DINNER. THEN SEE WHAT HAPPENS.",
  location: "EAST LONDON",
};

export const EXTENDED_MENU = {
  snacks: [
    { name: "Gildas", description: "guindilla pepper, anchovy, manzanilla olive", price: "£4.5" },
    { name: "Focaccia & Estate Oil", description: "wild oregano, sea salt", price: "£5" },
    { name: "Smoked Cod's Roe", description: "radishes, seeded cracker", price: "£8" },
    { name: "Salame di Felino", description: "cornichons, warm sourdough", price: "£9" },
  ],
  smallPlates: [
    { name: "Fire-Roasted Peppers", description: "anchovy, almond, sherry vinegar", price: "£11" },
    { name: "Stracciatella", description: "blood orange, bitter leaves, hazelnut", price: "£13" },
    { name: "Raw Dexter Beef", description: "egg yolk, dripping toast, shallot", price: "£14" },
    { name: "Mussels & Cider", description: "leeks, cream, dill oil", price: "£13.5" },
  ],
  mains: [
    { name: "Tagliatelle", description: "brown butter, sage, 24-month parmesan", price: "£17" },
    { name: "Roasted Aubergine", description: "slow tomato, tahini, fresh mint", price: "£15" },
    { name: "Charred Chicken", description: "preserved lemon, green olive, braised herbs", price: "£22" },
    { name: "Whole Sea Bass", description: "fennel, charred lemon, salsa verde", price: "£28" },
    { name: "Hereford Onglet Steak", description: "anchovy butter, watercress, chips", price: "£26" },
  ],
  sweets: [
    { name: "Chocolate Tart", description: "estate olive oil, Maldon sea salt", price: "£9" },
    { name: "Rhubarb & Ricotta", description: "poached Yorkshire rhubarb, crisp pastry", price: "£8.5" },
    { name: "Neal's Yard Cheese", description: "Stichelton, pickled walnut, rye", price: "£11" },
  ],
  naturalWines: [
    { name: "Cantina Giardino — Bianco", region: "Campania, Italy", type: "Orange / Skin Contact", glass: "£8.5", bottle: "£44" },
    { name: "Domaine Mosse — Magic of Ju-Ju", region: "Loire, France", type: "Chenin / Sauvignon", glass: "£9", bottle: "£48" },
    { name: "Milan Nestarec — Forks & Knives", region: "Moravia, Czech Republic", type: "Light Juicy Red", glass: "£8.5", bottle: "£45" },
    { name: "Gut Oggau — Theodora", region: "Burgenland, Austria", type: "Crisp Mineral White", glass: "£11", bottle: "£58" },
    { name: "Partida Creus — VN Tinto", region: "Catalonia, Spain", type: "Field Blend Red", glass: "£9.5", bottle: "£50" },
  ],
};

export const defaultMenuModalContent = {
  badge: "FULL PRINTED MENU",
  title: "Afterglow Kitchen",
  hours: "TUE–SAT · SERVICE 5:30 — 11:00 PM",
  closeAriaLabel: "Close menu",
  sections: [
    {
      title: "SNACKS & APERITIFS",
      items: EXTENDED_MENU.snacks,
    },
    {
      title: "SMALL PLATES",
      items: EXTENDED_MENU.smallPlates,
    },
    {
      title: "MAINS & WOOD FIRE",
      items: EXTENDED_MENU.mains,
    },
    {
      title: "SWEETS & CHEESE",
      items: EXTENDED_MENU.sweets,
    },
  ],
  wineSection: {
    title: "NATURAL WINE BY THE GLASS & BOTTLE",
    measureNote: "125ml / 750ml",
    items: EXTENDED_MENU.naturalWines,
  },
  footnote: "DISCRETIONARY 12.5% SERVICE CHARGE ADDED TO ALL BILLS",
};

export const BAR_DRINKS: BarDrink[] = [
  {
    name: "Mare Street Negroni",
    ingredients: "Tanqueray, Campari, Cocchi Vermouth di Torino, blood orange",
    price: "£12",
  },
  {
    name: "Late Bergamot Highball",
    ingredients: "Italicus, London dry gin, salted soda, fresh thyme",
    price: "£11.5",
  },
  {
    name: "Afterglow Sour",
    ingredients: "Rittenhouse rye, amaro nonino, lemon, red wine float",
    price: "£13",
  },
  {
    name: "East London Spritz",
    ingredients: "Belsazar rose, grapefruit cordial, sparkling wine",
    price: "£10.5",
  },
  {
    name: "Cynar & Tonic",
    ingredients: "Cynar amaro, fever-tree tonic, olive, lemon twist",
    price: "£9.5",
  },
  {
    name: "Night Fig Old Fashioned",
    ingredients: "Wild turkey bourbon, roasted fig syrup, walnut bitters",
    price: "£13.5",
  },
];

export const defaultDrinksModalContent = {
  badge: "BAR & APERITIVO LIST",
  title: "Afterglow Bar",
  hours: "OPEN LATE · NO RESERVATIONS NEEDED AT THE COUNTER",
  closeAriaLabel: "Close drinks menu",
  cocktailsTitle: "HOUSE COCKTAILS",
  cocktails: BAR_DRINKS,
  beersTitle: "BEER, CIDER & DIGESTIFS",
  beers: [
    { name: "The Kernel Table Beer (3.2%) · Pint", price: "£6.5" },
    { name: "Braybrooke Keller Lager (4.8%) · Bottle", price: "£6" },
    { name: "Oliver's Fine Cider · Herefordshire (750ml)", price: "£18" },
    { name: "Amaro Montenegro / Fernet Branca (50ml)", price: "£7" },
  ],
  philosophy:
    "We pour small-producer wines made with wild yeast and minimal intervention. If you don't know what you want, tell us what you usually drink and let us pour something honest.",
};

export const defaultFindUsModalContent = {
  closeAriaLabel: "Close dialog",
  badge: "FIND US · EAST LONDON",
  title: "27 MARE STREET",
  postcode: "LONDON E8 4RP",
  sections: {
    transit: {
      title: "OVERGROUND & TRANSIT",
      lines: [
        "London Fields Station (Overground) — 4 min walk",
        "Cambridge Heath (Overground) — 6 min walk",
        "Buses 26, 48, 55, 106, 254 stop right outside on Mare Street.",
      ],
    },
    hours: {
      title: "OPENING HOURS",
      lines: [
        "Tuesday — Saturday",
        "Kitchen: 5:30 PM — 11:00 PM",
        "Bar: 5:30 PM — Late (till 1:00 AM)",
        "Sunday & Monday: Closed",
      ],
    },
    contact: {
      title: "PHONE & WALK-INS",
      phone: "020 7946 0182",
      note: "We hold several counter seats and two outdoor tables every evening for walk-in guests without reservations.",
    },
  },
  mapButton: {
    label: "OPEN IN GOOGLE MAPS →",
    href: "https://maps.google.com/?q=27+Mare+Street+London+E8",
  },
  areaTag: "HACKNEY / MARE ST",
};
