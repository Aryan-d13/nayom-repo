import { CanonicalSiteData } from "./canonical";
import {
  defaultBusinessInfo,
  defaultSiteMetadata,
  defaultNavigationContent,
  defaultHeroContent,
  defaultFollowWaterContent,
  defaultDripContent,
  defaultSomethingsOffContent,
  defaultTheWorkContent,
  defaultCommonCallsContent,
  defaultFinalCtaContent,
  defaultFooterContent,
  defaultBookingModalContent,
  RoomData,
  PressureState,
  NotePoint,
  CallItem,
  ServiceLink,
  QuickLink,
} from "./defaultContent";

export function adaptCurrentPlumbingContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultBusinessInfo.name;
  const city = contact?.city || "Austin";
  const state = contact?.state || "Texas";
  const phone = contact?.phone || defaultBusinessInfo.phone;
  const phoneTel = contact?.raw_phone || defaultBusinessInfo.phoneTel;
  const email = contact?.email || defaultBusinessInfo.email;
  const tagline = identity?.tagline || defaultBusinessInfo.tagline;

  const businessInfo = {
    ...defaultBusinessInfo,
    name: name.toUpperCase(),
    fullName: name.toUpperCase(),
    tagline,
    location: `${city}, ${state} · Residential`,
    locationFull: `${city}, ${state}`,
    phone,
    phoneTel,
    email,
    coordinates: `${city.toUpperCase()} // RESIDENTIAL`,
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
  };

  const siteMetadata = {
    ...defaultSiteMetadata,
    title: `${name.toUpperCase()} — Residential Plumbing · ${city}, ${state}`,
    description: `${tagline} Repairs, drains, water heaters, leak detection, and fixtures behind everyday life in ${city}, ${state}. ${phone}.`,
  };

  const navigationContent = {
    ...defaultNavigationContent,
    ctaButton: editorial?.primary_cta?.text || defaultNavigationContent.ctaButton,
  };

  const headlineWords = editorial?.headline ? editorial.headline.split(" ") : [];
  const midPoint = Math.ceil(headlineWords.length / 2);

  const heroContent = {
    ...defaultHeroContent,
    badge: `${city.toUpperCase()}, ${state.toUpperCase()} RESIDENTIAL PLUMBING`,
    headlinePart1: headlineWords.length > 0 ? headlineWords.slice(0, midPoint).join(" ") : defaultHeroContent.headlinePart1,
    headlinePart2: headlineWords.length > 0 ? headlineWords.slice(midPoint).join(" ") : defaultHeroContent.headlinePart2,
    serifPhrase: editorial?.value_proposition || defaultHeroContent.serifPhrase,
    description: editorial?.subheadline || identity?.description || defaultHeroContent.description,
    primaryCta: editorial?.primary_cta?.text || defaultHeroContent.primaryCta,
    phoneCall: phone,
    image: {
      ...defaultHeroContent.image,
      src: heroAsset?.url_or_path || defaultHeroContent.image.src,
    },
  };

  const commonCallsContent = {
    ...defaultCommonCallsContent,
    calls:
      offerings && offerings.length > 0
        ? offerings.slice(0, 5).map((offering, idx) => {
            const fallback = defaultCommonCallsContent.calls[idx] || defaultCommonCallsContent.calls[0];
            return {
              id: offering.id || fallback.id,
              title: offering.name.toUpperCase(),
              code: `CALL // 0${idx + 1}`,
              image: fallback.image,
              caption: offering.summary || fallback.caption,
              details: offering.features ? offering.features.join(". ") : fallback.details,
              serviceCategory: offering.name,
            };
          })
        : defaultCommonCallsContent.calls,
  };

  const finalCtaContent = {
    ...defaultFinalCtaContent,
    tag: `${name.toUpperCase()} · ${city.toUpperCase()}, ${state.toUpperCase()}`,
    heading: editorial?.headline?.toUpperCase() || defaultFinalCtaContent.heading,
    serifPhrase: editorial?.value_proposition || defaultFinalCtaContent.serifPhrase,
    description: editorial?.subheadline || identity?.description || defaultFinalCtaContent.description,
    primaryCta: editorial?.primary_cta?.text || defaultFinalCtaContent.primaryCta,
    phoneCall: phone,
    phoneTel,
  };

  const footerContent = {
    ...defaultFooterContent,
    tagline,
    description: identity?.description || defaultFooterContent.description,
    coordinates: `${city.toUpperCase()} // RESIDENTIAL`,
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
  };

  const bookingModalContent = {
    ...defaultBookingModalContent,
    badge: `${city}, ${state} · Residential Craft`,
    services:
      offerings && offerings.length > 0
        ? offerings.slice(0, 5).map((o) => o.name)
        : defaultBookingModalContent.services,
    phonePlaceholder: phone,
  };

  return {
    businessInfo,
    siteMetadata,
    navigationContent,
    heroContent,
    followWaterContent: defaultFollowWaterContent,
    dripContent: defaultDripContent,
    somethingsOffContent: defaultSomethingsOffContent,
    theWorkContent: defaultTheWorkContent,
    commonCallsContent,
    finalCtaContent,
    footerContent,
    bookingModalContent,
  };
}

export type { RoomData, PressureState, NotePoint, CallItem, ServiceLink, QuickLink };
