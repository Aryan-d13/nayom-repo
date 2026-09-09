import { CanonicalSiteData } from "./canonical";
import {
  defaultClinicInfo,
  defaultNavigationContent,
  defaultHeroContent,
  defaultWhatBringsYouInContent,
  defaultCareWithoutMenuContent,
  defaultTheVisitContent,
  defaultThePeopleContent,
  defaultEveningCtaContent,
  defaultBookingModalContent,
  defaultFooterContent,
  ConcernItem,
  CareStep,
  VisitMoment,
  DoctorProfile,
} from "./defaultContent";

export function adaptClinicContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultClinicInfo.name;
  const city = contact?.city || "Brooklyn";
  const state = contact?.state || "New York";
  const address = contact?.address || defaultClinicInfo.address;
  const fullAddress = address && city ? `${address}, ${city}, ${state}` : defaultClinicInfo.fullAddress;
  const phone = contact?.phone || defaultClinicInfo.phone;
  const phoneRaw = contact?.raw_phone ? `tel:${contact.raw_phone}` : defaultClinicInfo.phoneRaw;
  const email = contact?.email || defaultClinicInfo.email;
  const tagline = identity?.tagline || defaultClinicInfo.tagline;
  const description = identity?.description || defaultClinicInfo.description;

  const clinicInfo = {
    ...defaultClinicInfo,
    name,
    subtitle: `${city.toUpperCase()} / PRIVATE CLINIC`,
    tagline,
    description,
    address,
    cityStateZip: `${city}, ${state} ${contact?.postal_code || ""}`.trim(),
    fullAddress,
    phone,
    phoneRaw,
    phoneTel: phoneRaw,
    email,
    emailHref: `mailto:${email}`,
    hours: contact?.hours
      ? {
          weekdays: contact.hours,
          fullDays: "Operating Hours",
          fullTime: contact.hours,
        }
      : defaultClinicInfo.hours,
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
  };

  const navigationContent = {
    ...defaultNavigationContent,
    brand: name,
    drawerAddress: fullAddress,
    drawerPhone: phone,
    drawerHours: clinicInfo.hours.weekdays,
    ctaText: editorial?.primary_cta?.text || defaultNavigationContent.ctaText,
  };

  const heroContent = {
    ...defaultHeroContent,
    locationLabel: `${city.toUpperCase()} / PRIVATE CLINIC`,
    headlineLine1: editorial?.headline ? editorial.headline.split(" ")[0] : defaultHeroContent.headlineLine1,
    headlineLine2: editorial?.headline ? editorial.headline.split(" ").slice(1).join(" ") : defaultHeroContent.headlineLine2,
    serifLine: editorial?.value_proposition || defaultHeroContent.serifLine,
    paragraph: editorial?.subheadline || description,
    primaryCta: editorial?.primary_cta?.text || defaultHeroContent.primaryCta,
    hoursText: clinicInfo.hours.weekdays.toUpperCase(),
    locationText: `${address ? address.toUpperCase() + ", " : ""}${city.toUpperCase()}`,
    image: heroAsset?.url_or_path || defaultHeroContent.image,
  };

  const eveningCtaContent = {
    ...defaultEveningCtaContent,
    indicator: `${city.toUpperCase()} · CLINIC HOURS`,
    phone,
    address: `${address}, ${city}`,
  };

  const bookingModalContent = {
    ...defaultBookingModalContent,
    brandHeader: `${name} · ${city.toUpperCase()}`,
    services:
      offerings && offerings.length > 0
        ? offerings.slice(0, 6).map((o) => o.name)
        : defaultBookingModalContent.services,
    phone,
  };

  const footerContent = {
    ...defaultFooterContent,
    brand: name,
    description,
    addressLine1: address,
    addressLine2: `${city}, ${state} ${contact?.postal_code || ""}`.trim(),
    hoursLine1: clinicInfo.hours.fullDays,
    hoursLine2: clinicInfo.hours.fullTime,
    phone,
    email,
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
  };

  return {
    clinicInfo,
    navigationContent,
    heroContent,
    whatBringsYouInContent: defaultWhatBringsYouInContent,
    careWithoutMenuContent: defaultCareWithoutMenuContent,
    theVisitContent: defaultTheVisitContent,
    thePeopleContent: defaultThePeopleContent,
    eveningCtaContent,
    bookingModalContent,
    footerContent,
  };
}

export type { ConcernItem, CareStep, VisitMoment, DoctorProfile };
