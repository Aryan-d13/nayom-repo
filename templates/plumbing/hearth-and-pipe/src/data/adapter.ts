import { CanonicalSiteData } from "./canonical";
import {
  defaultBusinessInfo,
  defaultSiteMetadata,
  defaultNavigationContent,
  defaultHeroContent,
  defaultNoticeContent,
  defaultInsideHomeContent,
  defaultTheFixContent,
  defaultWaterHeaterContent,
  defaultPeopleContent,
  defaultBackToNormalContent,
  defaultBookingModalContent,
  defaultFooterContent,
  MomentItem,
  RoomSection,
  StepItem,
  NavLink,
} from "./defaultContent";

export function adaptHearthAndPipeContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultBusinessInfo.name;
  const city = contact?.city || "Seattle";
  const state = contact?.state || "Washington";
  const phone = contact?.phone || defaultBusinessInfo.phone;
  const phoneTel = contact?.raw_phone || defaultBusinessInfo.phoneTel;
  const email = contact?.email || defaultBusinessInfo.email;
  const hours = contact?.hours || defaultBusinessInfo.hours;
  const tagline = identity?.tagline || defaultBusinessInfo.tagline;

  const businessInfo = {
    ...defaultBusinessInfo,
    name: name.toUpperCase(),
    tagline,
    location: `${city.toUpperCase()} / RESIDENTIAL PLUMBING`,
    cityState: `${city}, ${state}`,
    cityShort: `${city.toUpperCase()}, ${state.slice(0, 2).toUpperCase()}`,
    phone,
    phoneTel,
    email,
    hours,
    copyright: `© ${new Date().getFullYear()} ${name}. Fictional residential plumbing.`,
  };

  const siteMetadata = {
    ...defaultSiteMetadata,
    title: `${name} — Residential Plumbing · ${city}, ${state}`,
    description: `${tagline} Plumbing repairs, water heaters, drain cleaning, leak detection, and fixtures in ${city}, ${state}.`,
  };

  const navigationContent = {
    ...defaultNavigationContent,
    brand: name.toUpperCase(),
    ctaButton: editorial?.primary_cta?.text || defaultNavigationContent.ctaButton,
  };

  const heroContent = {
    ...defaultHeroContent,
    label: `${city.toUpperCase()} / RESIDENTIAL PLUMBING`,
    description: editorial?.subheadline || identity?.description || defaultHeroContent.description,
    primaryCta: editorial?.primary_cta?.text || defaultHeroContent.primaryCta,
    phoneCall: phone,
    phoneTel,
    image: {
      ...defaultHeroContent.image,
      src: heroAsset?.url_or_path || defaultHeroContent.image.src,
    },
    captionRight: `${city.toUpperCase()}, ${state.slice(0, 2).toUpperCase()} · WATER IS INVISIBLE`,
  };

  const noticeContent = {
    ...defaultNoticeContent,
    captionSuffix: `${city.toUpperCase()}, ${state.slice(0, 2).toUpperCase()}`,
  };

  const backToNormalContent = {
    ...defaultBackToNormalContent,
    phone,
    phoneTel,
    location: `${city}, ${state}`,
  };

  const bookingModalContent = {
    ...defaultBookingModalContent,
    badge: `${city.toUpperCase()} / RESIDENTIAL`,
    phonePlaceholder: phone,
    neighborhoodPlaceholder: `e.g. Neighborhood in ${city}...`,
    phoneDisplay: `Direct: ${phone}`,
    services:
      offerings && offerings.length > 0
        ? offerings.slice(0, 5).map((o) => o.name)
        : defaultBookingModalContent.services,
  };

  return {
    businessInfo,
    siteMetadata,
    navigationContent,
    heroContent,
    noticeContent,
    insideHomeContent: defaultInsideHomeContent,
    theFixContent: defaultTheFixContent,
    waterHeaterContent: defaultWaterHeaterContent,
    peopleContent: defaultPeopleContent,
    backToNormalContent,
    bookingModalContent,
    footerContent: defaultFooterContent,
  };
}

export type { MomentItem, RoomSection, StepItem, NavLink };
