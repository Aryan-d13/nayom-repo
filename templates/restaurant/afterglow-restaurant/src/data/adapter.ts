import { CanonicalSiteData } from "./canonical";
import {
  defaultBusinessInfo,
  defaultSiteMetadata,
  defaultNavigationContent,
  defaultHeroContent,
  defaultNightChangesContent,
  TONIGHT_DISHES,
  defaultMenuTonightContent,
  defaultRoomContent,
  defaultBarContent,
  defaultReservationContent,
  defaultFinalMomentContent,
  defaultFooterContent,
  EXTENDED_MENU,
  defaultMenuModalContent,
  BAR_DRINKS,
  defaultDrinksModalContent,
  defaultFindUsModalContent,
  DishItem,
  MenuItem,
  WineItem,
  BarDrink,
} from "./defaultContent";

export function adaptAfterglowContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultBusinessInfo.name;
  const city = contact?.city || "London";
  const address = contact?.address || "27 Mare Street";
  const postcode = contact?.postal_code || "E8 4RP";
  const fullAddress = `${address}, ${city} ${postcode}`;
  const phone = contact?.phone || defaultBusinessInfo.phone;
  const tagline = identity?.tagline || defaultBusinessInfo.tagline;

  const businessInfo = {
    ...defaultBusinessInfo,
    name: name.toUpperCase(),
    tagline,
    phone,
    address: {
      street: address,
      city,
      postcode,
      area: `${city}`,
      full: fullAddress,
    },
    hours: {
      ...defaultBusinessInfo.hours,
      kitchen: contact?.hours || defaultBusinessInfo.hours.kitchen,
    },
  };

  const siteMetadata = {
    ...defaultSiteMetadata,
    title: `${name.toUpperCase()} — ${tagline} | ${city}`,
    description: identity?.description || defaultSiteMetadata.description,
    openGraph: {
      ...defaultSiteMetadata.openGraph,
      title: `${name.toUpperCase()} — ${city} Restaurant & Wine Bar`,
      description: `${tagline} ${contact?.hours || "Tue–Sat · Kitchen 5:30–11 · Bar late."}`,
      type: "website" as const,
    },
  };

  const navigationContent = {
    ...defaultNavigationContent,
    brand: name.toUpperCase(),
  };

  const headlineWords = editorial?.headline ? editorial.headline.split(".") : [];
  const heroContent = {
    ...defaultHeroContent,
    topStrip: {
      left: `${city.toUpperCase()} / TUESDAY—SATURDAY`,
      right: address.toUpperCase(),
    },
    headline: {
      first: headlineWords[0] ? `${headlineWords[0].trim().toUpperCase()}.` : defaultHeroContent.headline.first,
      second: editorial?.value_proposition || (headlineWords[1] ? headlineWords[1].trim() : defaultHeroContent.headline.second),
    },
    copy: editorial?.subheadline
      ? [editorial.subheadline, ""]
      : defaultHeroContent.copy,
    cta: {
      label: editorial?.primary_cta?.text || defaultHeroContent.cta.label,
      href: defaultHeroContent.cta.href,
    },
    image: {
      ...defaultHeroContent.image,
      src: heroAsset?.url_or_path || defaultHeroContent.image.src,
      stamp: address.toUpperCase(),
    },
  };

  const dishes: DishItem[] =
    offerings && offerings.length > 0
      ? offerings.slice(0, 6).map((o, idx) => {
          const fallback = TONIGHT_DISHES[idx] || TONIGHT_DISHES[0];
          return {
            id: o.id || fallback.id,
            name: o.name.toUpperCase(),
            description: o.summary || fallback.description,
            price: o.pricing || fallback.price,
            category: fallback.category,
            image: fallback.image,
          };
        })
      : TONIGHT_DISHES;

  const menuTonightContent = {
    ...defaultMenuTonightContent,
    subStrip: {
      left: "SMALL PLATES & WOOD GRILL",
      right: `${city.toUpperCase()} / ${postcode.toUpperCase()}`,
    },
    dishes,
  };

  const reservationContent = {
    ...defaultReservationContent,
    stamps: {
      ...defaultReservationContent.stamps,
      topLeft: address.toUpperCase(),
      bottomRight: city.toUpperCase(),
    },
    header: {
      ...defaultReservationContent.header,
      locationLeft: address.toUpperCase(),
      locationRight: postcode.toUpperCase(),
    },
    confirmed: {
      ...defaultReservationContent.confirmed,
      brand: name.toUpperCase(),
      address: `${address.toUpperCase()} · ${city.toUpperCase()} ${postcode.toUpperCase()}`,
    },
  };

  const finalMomentContent = {
    ...defaultFinalMomentContent,
    brand: name.toUpperCase(),
    address: address.toUpperCase(),
  };

  const footerContent = {
    ...defaultFooterContent,
    brand: name.toUpperCase(),
    address: [address, `${city} ${postcode}`],
    phone,
    copyright: `© ${new Date().getFullYear()} ${name}`,
    tagline: tagline.toUpperCase(),
    location: city.toUpperCase(),
  };

  const findUsModalContent = {
    ...defaultFindUsModalContent,
    badge: `FIND US · ${city.toUpperCase()}`,
    title: address.toUpperCase(),
    postcode: `${city.toUpperCase()} ${postcode.toUpperCase()}`,
    sections: {
      ...defaultFindUsModalContent.sections,
      contact: {
        ...defaultFindUsModalContent.sections.contact,
        phone,
      },
    },
    areaTag: address.toUpperCase(),
  };

  return {
    businessInfo,
    siteMetadata,
    navigationContent,
    heroContent,
    nightChangesContent: defaultNightChangesContent,
    TONIGHT_DISHES: dishes,
    menuTonightContent,
    roomContent: defaultRoomContent,
    barContent: defaultBarContent,
    reservationContent,
    finalMomentContent,
    footerContent,
    EXTENDED_MENU,
    menuModalContent: defaultMenuModalContent,
    BAR_DRINKS,
    drinksModalContent: defaultDrinksModalContent,
    findUsModalContent,
  };
}

export type { DishItem, MenuItem, WineItem, BarDrink };
