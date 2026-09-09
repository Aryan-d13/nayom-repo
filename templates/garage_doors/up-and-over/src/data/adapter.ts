import { CanonicalSiteData } from "./canonical";
import {
  defaultBusinessInfo,
  defaultSiteMetadata,
  defaultNavigationContent,
  defaultHeroContent,
  defaultStyleSelectorContent,
  defaultOpenCloseContent,
  defaultRepairContent,
  defaultArchitectureContent,
  defaultFinalCtaContent,
  defaultFooterContent,
  defaultQuoteModalContent,
  DOOR_STYLES,
  MOMENTS,
  REPAIR_SITUATIONS,
  ARCH_POINTS,
  ARCHITECTURE_HOTSPOTS,
  StyleItem,
  RepairSituation,
  ArchitecturePoint,
  MomentItem,
} from "./defaultContent";

function splitHeadline(headline?: string | null): { part1: string; part2: string } {
  if (!headline) {
    return {
      part1: defaultHeroContent.headingPart1,
      part2: defaultHeroContent.headingPart2,
    };
  }
  const words = headline.trim().split(/\s+/);
  if (words.length <= 1) {
    return { part1: words[0] || defaultHeroContent.headingPart1, part2: "" };
  }
  const mid = Math.ceil(words.length / 2);
  return {
    part1: words.slice(0, mid).join(" "),
    part2: words.slice(mid).join(" "),
  };
}

export function adaptGarageDoorContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const seo = siteData?.seo;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultBusinessInfo.name;
  const city = contact?.city || defaultBusinessInfo.city;
  const state = contact?.state || defaultBusinessInfo.state;
  const fullLocation =
    city && state ? `${city}, ${state}` : defaultBusinessInfo.fullLocation;
  const phone = contact?.phone || defaultBusinessInfo.phone;
  const phoneTel = contact?.raw_phone || phone.replace(/[^0-9+]/g, "") || defaultBusinessInfo.phoneTel;
  const email = contact?.email || defaultBusinessInfo.email;
  const description = identity?.description || defaultBusinessInfo.description;
  const tagline =
    identity?.tagline ||
    (identity?.category ? `Garage Doors • ${city}` : defaultBusinessInfo.tagline);

  const businessInfo = {
    name,
    tagline,
    city,
    state,
    fullLocation,
    phone,
    phoneTel,
    email,
    motto: editorial?.value_proposition || defaultBusinessInfo.motto,
    description,
  };

  const siteMetadata = {
    title: seo?.title || `${name} | Garage Doors ${city}`,
    description: seo?.meta_description || description,
    keywords:
      seo?.keywords && seo.keywords.length > 0
        ? seo.keywords
        : [
            `Garage Doors ${city}`,
            "Residential Garage Doors",
            "Custom Garage Doors",
            `Garage Door Repair ${city}`,
          ],
    openGraph: {
      title: seo?.title || `${name} | Garage Doors ${city}`,
      description: seo?.meta_description || description,
      type: "website",
      locale: "en_US",
    },
  };

  const navigationContent = {
    ...defaultNavigationContent,
    brand: name,
    subBrand: tagline,
    mobileLocation: fullLocation,
    cta: editorial?.primary_cta?.text || defaultNavigationContent.cta,
  };

  const headlineParts = splitHeadline(editorial?.headline);

  const heroContent = {
    italicPretitle: editorial?.value_proposition || defaultHeroContent.italicPretitle,
    headingPart1: headlineParts.part1,
    headingPart2: headlineParts.part2,
    description: editorial?.subheadline || description,
    primaryCta: editorial?.primary_cta?.text || defaultHeroContent.primaryCta,
    secondaryCta: editorial?.secondary_cta?.text || defaultHeroContent.secondaryCta,
    bottomTag: `${city.toUpperCase()} / RESIDENTIAL`,
    bottomSubtitle: defaultHeroContent.bottomSubtitle,
    image: heroAsset?.url_or_path
      ? { src: heroAsset.url_or_path, alt: heroAsset.alt || `${name} Garage Doors` }
      : defaultHeroContent.image,
  };

  // Semantic Offerings mapping only for footer/services list, keeping specialized DOOR_STYLES intact
  const adaptedFooterServices =
    offerings && offerings.length > 0
      ? offerings.slice(0, 5).map((o) => ({
          label: o.name,
          service: o.name,
        }))
      : defaultFooterContent.services;

  const repairContent = {
    ...defaultRepairContent,
    calloutSubtitle: `Serving ${city}, ${state} and surrounding areas.`,
    situations: REPAIR_SITUATIONS,
  };

  const finalCtaContent = {
    ...defaultFinalCtaContent,
    tag: `${fullLocation} • Residential`,
    phone,
    footerNote: `Direct craftsmanship • ${city} residential replacement & repair`,
  };

  const footerContent = {
    ...defaultFooterContent,
    brand: name,
    tagline: businessInfo.motto,
    description,
    services: adaptedFooterServices,
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
    cityTag: `${city.toUpperCase()}, ${state.toUpperCase()}`,
  };

  const quoteModalContent = {
    ...defaultQuoteModalContent,
    headerTag: `${name} • ${city}, ${state}`,
    services:
      offerings && offerings.length > 0
        ? offerings.slice(0, 6).map((o) => o.name)
        : defaultQuoteModalContent.services,
    phonePlaceholder: phone,
    addressPlaceholder: `Neighborhood or Address in ${city}...`,
    thankYouBodyPart2: `A local technician from our ${city} shop will call you shortly at`,
  };

  return {
    businessInfo,
    siteMetadata,
    navigationContent,
    heroContent,
    styleSelectorContent: defaultStyleSelectorContent,
    DOOR_STYLES,
    openCloseContent: defaultOpenCloseContent,
    MOMENTS,
    repairContent,
    REPAIR_SITUATIONS,
    architectureContent: defaultArchitectureContent,
    ARCH_POINTS,
    ARCHITECTURE_HOTSPOTS,
    finalCtaContent,
    footerContent,
    quoteModalContent,
  };
}

export type { StyleItem, RepairSituation, ArchitecturePoint, MomentItem };
