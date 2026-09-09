import { CanonicalSiteData } from "./canonical";
import {
  defaultBusinessInfo,
  defaultNavigationContent,
  defaultHeroContent,
  defaultDiagnosticContent,
  defaultRoomServicesContent,
  defaultPhilosophyContent,
  defaultProjectCollageContent,
  defaultTrustContent,
  defaultFinalLightsOnContent,
  defaultFooterContent,
  defaultBookingDrawerContent,
  DiagnosticItem,
  RoomZone,
  ProjectItem,
  TrustStatement,
} from "./defaultContent";

export function adaptElectricContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultBusinessInfo.name;
  const city = contact?.city || "Portland";
  const state = contact?.state || "Oregon";
  const phone = contact?.phone || defaultBusinessInfo.phone;
  const phoneTel = contact?.raw_phone ? `tel:${contact.raw_phone}` : defaultBusinessInfo.phoneTel;
  const email = contact?.email || defaultBusinessInfo.email;
  const emailHref = contact?.email ? `mailto:${contact.email}` : defaultBusinessInfo.emailHref;
  const address = contact?.address || `${city}, ${state}`;

  const businessInfo = {
    ...defaultBusinessInfo,
    name,
    fullName: name,
    location: `${city}, ${state}`,
    fullLocation: `${city.toUpperCase()}, ${state.toUpperCase()} RESIDENTIAL ELECTRICAL`,
    phone,
    phoneTel,
    email,
    emailHref,
    address,
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
  };

  const navigationContent = {
    ...defaultNavigationContent,
    logo: name.toUpperCase(),
    phone,
    ctaText: editorial?.primary_cta?.text || defaultNavigationContent.ctaText,
  };

  const heroContent = {
    ...defaultHeroContent,
    eyebrow: `${city.toUpperCase()}, ${state.toUpperCase()} RESIDENTIAL ELECTRICAL`,
    headline: editorial?.headline || defaultHeroContent.headline,
    serifLine: editorial?.value_proposition || defaultHeroContent.serifLine,
    description: editorial?.subheadline || identity?.description || defaultHeroContent.description,
    ctaPrimary: editorial?.primary_cta?.text || defaultHeroContent.ctaPrimary,
    ctaPhone: `Call ${phone}`,
    verticalBrand: name.toUpperCase(),
    image: heroAsset?.url_or_path || defaultHeroContent.image,
  };

  const trustContent = {
    ...defaultTrustContent,
    phone,
  };

  const finalLightsOnContent = {
    ...defaultFinalLightsOnContent,
    subheadline: `${name.toUpperCase()} · ${city.toUpperCase()}, ${state.toUpperCase()}`,
    ctaPhone: phone,
    ctaPrimary: editorial?.primary_cta?.text || defaultFinalLightsOnContent.ctaPrimary,
  };

  const footerContent = {
    ...defaultFooterContent,
    brand: name.toUpperCase(),
    description: identity?.description || defaultFooterContent.description,
    serviceAreas: contact?.service_areas && contact.service_areas.length > 0
      ? contact.service_areas
      : [city, `${city} Metro`, "Surrounding Counties"],
    phone,
    email,
    location: address,
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
  };

  const bookingDrawerContent = {
    ...defaultBookingDrawerContent,
    services:
      offerings && offerings.length > 0
        ? offerings.slice(0, 8).map((o) => o.name)
        : defaultBookingDrawerContent.services,
    phonePlaceholder: phone,
    directCallPhone: `Call ${phone}`,
    success: {
      ...defaultBookingDrawerContent.success,
      phone,
    },
  };

  return {
    businessInfo,
    navigationContent,
    heroContent,
    diagnosticContent: defaultDiagnosticContent,
    roomServicesContent: defaultRoomServicesContent,
    philosophyContent: defaultPhilosophyContent,
    projectCollageContent: defaultProjectCollageContent,
    trustContent,
    finalLightsOnContent,
    footerContent,
    bookingDrawerContent,
  };
}

export type { DiagnosticItem, RoomZone, ProjectItem, TrustStatement };
