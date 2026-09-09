import { CanonicalSiteData } from "./canonical";
import {
  defaultBusinessInfo,
  defaultNavigationContent,
  defaultHeroContent,
  defaultConditionsContent,
  defaultRoomsStoryContent,
  defaultDiagnosticsContent,
  defaultServicesContent,
  defaultTechnicianContent,
  defaultFinalCtaContent,
  defaultFooterContent,
  defaultTemperatureBadgeContent,
  defaultBookingModalContent,
  ConditionState,
  RoomScene,
  Symptom,
  ServiceChapter,
} from "./defaultContent";

export function adaptTemperContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultBusinessInfo.name;
  const city = contact?.city || "Phoenix";
  const state = contact?.state || "Arizona";
  const phone = contact?.phone || defaultBusinessInfo.phone;
  const phoneTel = contact?.raw_phone || defaultBusinessInfo.phoneTel;
  const email = contact?.email || defaultBusinessInfo.email;
  const tagline = identity?.tagline || defaultBusinessInfo.tagline;
  const serviceArea = contact?.service_areas?.join(", ") || defaultBusinessInfo.serviceArea;

  const businessInfo = {
    ...defaultBusinessInfo,
    name,
    fullName: name,
    tagline,
    location: `${city}, ${state}`,
    locationShort: `${city}, ${state}`,
    phone,
    phoneTel,
    email,
    serviceArea,
    serviceAreaDetailed: serviceArea,
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
    comfortArchitecture: `${city.toUpperCase()} RESIDENTIAL COMFORT ARCHITECTURE`,
  };

  const navigationContent = {
    ...defaultNavigationContent,
    brand: name.toUpperCase(),
    locationShort: `${city}, ${state}`,
    phone,
    phoneTel,
    bookCta: editorial?.primary_cta?.text || defaultNavigationContent.bookCta,
  };

  const headlineWords = editorial?.headline ? editorial.headline.split(" ") : [];
  const midPoint = Math.ceil(headlineWords.length / 2);

  const heroContent = {
    ...defaultHeroContent,
    overline: `${city} / Heating & Air`,
    headlineLine1: headlineWords.length > 0 ? headlineWords.slice(0, midPoint).join(" ") : defaultHeroContent.headlineLine1,
    headlineLine2: headlineWords.length > 0 ? headlineWords.slice(midPoint).join(" ") : defaultHeroContent.headlineLine2,
    serifLine: editorial?.value_proposition || defaultHeroContent.serifLine,
    description: editorial?.subheadline || identity?.description || defaultHeroContent.description,
    bookCta: editorial?.primary_cta?.text || defaultHeroContent.bookCta,
    phone,
    phoneTel,
    image: heroAsset?.url_or_path || defaultHeroContent.image,
  };

  const servicesContent = {
    ...defaultServicesContent,
    chapters: defaultServicesContent.chapters.map((chapter, index) => {
      const offering = offerings && offerings[index];
      if (!offering) return chapter;
      return {
        ...chapter,
        subhead: offering.name,
        description: offering.summary || chapter.description,
      };
    }),
  };

  const finalCtaContent = {
    ...defaultFinalCtaContent,
    phone,
    phoneTel,
    serviceArea,
    bookCta: editorial?.primary_cta?.text || defaultFinalCtaContent.bookCta,
  };

  const footerContent = {
    ...defaultFooterContent,
    brand: name.toUpperCase(),
    tagline,
    description: identity?.description || defaultFooterContent.description,
    phone,
    phoneTel,
    email,
    location: `${city}, ${state}`,
    bookCta: editorial?.primary_cta?.text || defaultFooterContent.bookCta,
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
    comfortArchitecture: `${city.toUpperCase()} RESIDENTIAL COMFORT ARCHITECTURE`,
  };

  const bookingModalContent = {
    ...defaultBookingModalContent,
    subtitle: serviceArea,
    phone,
    phoneTel,
  };

  return {
    businessInfo,
    navigationContent,
    heroContent,
    conditionsContent: defaultConditionsContent,
    roomsStoryContent: defaultRoomsStoryContent,
    diagnosticsContent: defaultDiagnosticsContent,
    servicesContent,
    technicianContent: defaultTechnicianContent,
    finalCtaContent,
    footerContent,
    temperatureBadgeContent: defaultTemperatureBadgeContent,
    bookingModalContent,
  };
}

export type { ConditionState, RoomScene, Symptom, ServiceChapter };
