import { CanonicalSiteData } from "./canonical";
import {
  defaultBusinessInfo,
  defaultSiteMetadata,
  defaultNavigationContent,
  defaultHeroContent,
  defaultMenuContent,
  defaultFoodInMotionContent,
  defaultTheTableContent,
  defaultReservationContent,
  defaultQuietFinaleContent,
  defaultFooterContent,
  defaultFullMenuModalContent,
  MenuItem,
  MotionMoment,
  NavLinkItem,
  DiningHour,
  MenuCategoryItem,
  MenuCategory,
} from "./defaultContent";

export function adaptMaraContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultBusinessInfo.name;
  const city = contact?.city || "Brooklyn";
  const state = contact?.state || "NY";
  const address = contact?.address || "184 Franklin St";
  const postalCode = contact?.postal_code || "11222";
  const phone = contact?.phone || defaultBusinessInfo.phone;
  const phoneTel = contact?.raw_phone || defaultBusinessInfo.phoneTel;
  const tagline = identity?.tagline || defaultBusinessInfo.tagline;

  const businessInfo = {
    ...defaultBusinessInfo,
    name: name.toUpperCase(),
    tagline,
    phone,
    phoneTel,
    address: `${address}, ${city}`,
    addressLine1: address,
    addressLine2: `${city}, ${state} ${postalCode}`,
    hoursNote: contact?.hours || defaultBusinessInfo.hoursNote,
  };

  const siteMetadata = {
    ...defaultSiteMetadata,
    title: `${name.toUpperCase()} — ${tagline} | ${city}, ${state}`,
    description: identity?.description || defaultSiteMetadata.description,
    openGraph: {
      ...defaultSiteMetadata.openGraph,
      title: `${name.toUpperCase()} — ${tagline} | ${city}, ${state}`,
      description: `${tagline} ${address}, ${city}.`,
      type: "website" as const,
    },
  };

  const navigationContent = {
    ...defaultNavigationContent,
    brand: name.toUpperCase(),
    subtitle: tagline,
    serviceNote: contact?.hours || defaultNavigationContent.serviceNote,
    locationNote: `${address}, ${city}`,
  };

  const headlineWords = editorial?.headline ? editorial.headline.split(".") : [];
  const heroContent = {
    ...defaultHeroContent,
    locationBadge: `${city}, ${state} · ${address}`,
    headingPart1: headlineWords[0] ? `${headlineWords[0].trim().toUpperCase()}.` : defaultHeroContent.headingPart1,
    headingPart2: headlineWords[1] ? headlineWords[1].trim() : defaultHeroContent.headingPart2,
    description: editorial?.subheadline || identity?.description || defaultHeroContent.description,
    primaryCta: editorial?.primary_cta?.text || defaultHeroContent.primaryCta,
    secondaryCta: editorial?.secondary_cta?.text || defaultHeroContent.secondaryCta,
    mainDish: {
      ...defaultHeroContent.mainDish,
      image: heroAsset?.url_or_path || defaultHeroContent.mainDish.image,
    },
  };

  const signatureDishes: MenuItem[] =
    offerings && offerings.length > 0
      ? offerings.slice(0, 6).map((o, idx) => {
          const fallback = defaultMenuContent.signatureDishes[idx] || defaultMenuContent.signatureDishes[0];
          return {
            id: o.id || fallback.id,
            category: fallback.category,
            name: o.name,
            italianName: fallback.italianName,
            price: o.pricing || fallback.price,
            description: o.summary || fallback.description,
            pairing: fallback.pairing,
            image: fallback.image,
            tag: fallback.tag,
          };
        })
      : defaultMenuContent.signatureDishes;

  const menuContent = {
    ...defaultMenuContent,
    sheetHeaderBrand: `${name.toUpperCase()} · ${city.toUpperCase()}`,
    signatureDishes,
  };

  const reservationContent = {
    ...defaultReservationContent,
    postcardHeader: `DINING POSTCARD · ${address.toUpperCase()}`,
  };

  const quietFinaleContent = {
    ...defaultQuietFinaleContent,
    stampBrand: `${name.toUpperCase()} · ${city.toUpperCase()}`,
    stampLocation: `${city} ${state}`,
  };

  const footerContent = {
    ...defaultFooterContent,
    brand: name.toUpperCase(),
    description: identity?.description || defaultFooterContent.description,
    copyright: `${name.toUpperCase()} Restaurant. All rights reserved.`,
  };

  const fullMenuModalContent = {
    ...defaultFullMenuModalContent,
    brand: name.toUpperCase(),
    addressNote: `Chef & Hearth · ${address} · ${city}`,
  };

  return {
    businessInfo,
    siteMetadata,
    navigationContent,
    heroContent,
    menuContent,
    foodInMotionContent: defaultFoodInMotionContent,
    theTableContent: defaultTheTableContent,
    reservationContent,
    quietFinaleContent,
    footerContent,
    fullMenuModalContent,
  };
}

export type { MenuItem, MotionMoment, NavLinkItem, DiningHour, MenuCategoryItem, MenuCategory };
